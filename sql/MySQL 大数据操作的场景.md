# MySQL 大数据操作的场景
[微信公众号](https://mp.weixin.qq.com/s/Te8fG-ayiNB0yXl2DCagyw)

> 大数据操作的场景：

1. 数据迁移；
2. 数据导出；
3. 批量处理数据；

  实际工作，指定查询数据过大时，一般采用分页查询的方式一页一页将数据存放到内存中。不分页，或者分页很大时，如果一下将你数据全部加载出来到内存中，很可能发生OOM，而且查询很慢，因为框架耗费大量时间去和内存吧数据库查询的结果封装成我们要的实体类。

## 举例：在业务系统需要从 MySQL 数据库里读取 100w 数据行进行处理，应该怎么做？
  做法通常如下：

1.   常规查询：一次性读取100w数据到内存中，或者分页读取。
2.   流式查询：建立长链接，利用服务端游标，每次读取一条加载到jvm内存（多次获取，一次一行）
3.   游标查询：和流式一样，通过fetcheSize参数，控制一次读取多少数据（多次获取，一次多行）

### 常规查询：

> 默认情况下，完整的检索结果回将其储存在内存中。大多数情况下，这是最有效的操作方式并由于MySQL网络协议的设计，因此更易于实现。

#### 举例：

假设单表100w数据，一般采用分页的方式查询

```java
@Mapper
public interface BigDataSearchMapper extends BaseMapper<BigDataSearchEntity> {

    @Select("SELECT bds.* FROM big_data_search bds ${ew.customSqlSegment} ")
    Page<BigDataSearchEntity> pageList(@Param("page") Page<BigDataSearchEntity> page, @Param(Constants.WRAPPER) QueryWrapper<BigDataSearchEntity> queryWrapper);

}
```
注：这里使用MybatisPlus
该方式比较简单，但在不考虑Limit深分页优化的情况下，估计数据库服务器很块就嘎了，或者可能会花上几十分钟，几个小时，甚至几天时间检索数据。



### 流式查询：
> 流式查询是指查询成功后不是返回一个集合，而是返回一个迭代器，应用每次从迭代器取一条查询结果。流式查询的好处是能够降低内存的使用。如果没有流式查询，我们想要从数据库获取100w记录而没有足够的内存时，就不得不分页查询，而分页查询的效率取决于表设计，如果设计的不好，就无法执行高效的分页查询。因此流式查询是一个数据库访问框架必须具备的功能。
> 
MyBatis中使用流式查询避免数据量过大导致oom，但在流式查询过程中，数据库连接是保持打开状态的。

因此需要注意：

1. 执行一个流式查询后，数据库访问框架就不负责关闭数据库连接了，需要应用在取完数据后自己关闭。
2. 必须先读取（或者关闭）结果集中的所有行，然后才能对连接发出任何其他查询，否则将引发异常。



#### MyBatis流式查询接口

> MyBatis提供了一个叫org.apache.ibatis.cursor.Cursor的接口类用于流式查询，这个接口继承了java.io.Closeable和java.lang.iterable接口。

由此可知：

1. Cursor是可关闭的；
2. Cursor是可遍历的；

除此之外，Cursor还提供了三个方法：

1. isOpen(),用于在读取数据之前判断Cursor对象是否是打开状态，只有当打开时Cursor才能读取数据。
2. isConsumed(),用于判断查询结果是否全部取完。
3. getCurrentIndex(),返回已经获取了多少条数据

使用流式查询，则要保持对产生结果集的语句所引用的表的并发访问，因为其查询会独占连接，所以必须尽快处理。

**为什么要用流式查询**

- 如果又一个很大的查询结果需要遍历处理，又不想一次性将结果集装入客户端内存,就可以考虑使用流式查询
- 分库分表的场景下，单个表的查询结果集虽然不大，但是如果某个查询跨了多个库多个表，又要做结果集的合并、排序等动作，依然有可能撑爆内存，详细研究sharding-sphere的代码不难发现，除了group by于order by字段不一样之外，其他的场景都非常适合使用流式查询，可以最大限度的降低对客户端内存的消耗。



#### 游标查询

> 对大量数据进行处理时，为防止内存泄漏情况发生，也可以采用游标方式进行数据查询处理。这种处理方式比常规查询要快很多。
>
> 当查询百万级的数据的时候，还可以使用游标方式进行数据查询处理，不仅可以节省内存的消耗，而且还不需要一次性取出所有数据，可以进行逐条处理或逐条取出部分批量处理。一次查询指定 fetchSize 的数据，直到把数据全部处理完。

MyBatis的处理加了两个注解：@Options和@ResultType

##### 

```java
@Mapper
public interface BigDataSearchMapper extends BaseMapper<BigDataSearchEntity> {

    // 方式一 多次获取，一次多行
    @Select("SELECT bds.* FROM big_data_search bds ${ew.customSqlSegment} ")
    @Options(resultSetType = ResultSetType.FORWARD_ONLY, fetchSize = 1000000)
    Page<BigDataSearchEntity> pageList(@Param("page") Page<BigDataSearchEntity> page, @Param(Constants.WRAPPER) QueryWrapper<BigDataSearchEntity> queryWrapper);

    // 方式二 一次获取，一次一行
    @Select("SELECT bds.* FROM big_data_search bds ${ew.customSqlSegment} ")
    @Options(resultSetType = ResultSetType.FORWARD_ONLY, fetchSize = 100000)
    @ResultType(BigDataSearchEntity.class)
    void listData(@Param(Constants.WRAPPER) QueryWrapper<BigDataSearchEntity> queryWrapper, ResultHandler<BigDataSearchEntity> handler);

}
```

**@Options**

- ResultSet.FORWORD_ONLY：结果集的游标只能向下滚动
- ResultSet. SCROLL_INSENSITIVE：结果集的游标可以上下移动，当数据库变化时，当前结果集不变
- ResultSet.SCROLL_SENSITIVE：返回可滚动的结果集，当数据库变化时，当前结果集同步改变
- fetchSize：每次获取量

**@ResultType**

- @ResultType(BigDataSearchEntity.class): 转换成返回实体类型



**注意**：返回类型必须为void，因为查询的结果在ResultHandler里处理数据，所以这个handler也是必须的，可以使用lambda实现一个依次处理逻辑。

**注意**：虽然上述代码都有@Options 但实际操作不同

1. 方式1是多次查询，一次返回多条
2. 方式2是一次查询，一次返回一条

**原因**：


Oracle 是从服务器一次取出 fetch size 条记录放在客户端，客户端处理完成一个批次后再向服务器取下一个批次，直到所有数据处理完成。

MySQL 是在执行 ResultSet.next() 方法时，会通过数据库连接一条一条的返回。flush buffer 的过程是阻塞式的，如果网络中发生了拥塞，send buffer 被填满，会导致 buffer 一直 flush 不出去，那 MySQL 的处理线程会阻塞，从而避免数据把客户端内存撑爆。



**非流式查询和流式查询区别：**

**1、** 非流式查询：内存会随着查询记录的增长而近乎直线增长；
**2、** 流式查询：内存会保持稳定，不会随着记录的增长而增长其内存大小取决于批处理大小BATCH_SIZE的设置，该尺寸越大，内存会越大所以BATCH_SIZE应该根据业务情况设置合适的大小；

另外要切记每次处理完一批结果要记得释放存储每批数据的临时容器，即上文中的gxids.clear();

来源:blog.csdn.net/xhaimail/article/details/119386460
