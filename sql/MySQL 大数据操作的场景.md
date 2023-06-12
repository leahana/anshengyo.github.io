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







# EasyExcel数据导入导出

## 1. 传统POI版本优缺点比较

我们主要会讨论Apache的POI技术，以及与不同Excel版本的兼容性问题。

### 1.1. HSSFWorkbook

HSSFWorkbook是我们早期使用最多的对象，它可以操作Excel2003以前（包含2003）的所有Excel版本。在2003以前Excel的版本后缀还是`.xls`。

- **优点**：
  - 不会报内存溢出。因为数据量还不到7万，所以内存一般都够用。首先，你得明确知道这种方式是将数据先读取到内存中，然后再操作。

- **缺点**：
  - 最多只能导出65535行。也就是说，导出的数据函数超过这个数据就会报错。

### 1.2. XSSFWorkbook

XSSFWorkbook是很多公司现在仍在使用的实现类，它可以操作的Excel2003–Excel2007之间的版本，Excel的扩展名是`.xlsx`。

- **优点**：
  - 这种形式的出现是为了突破HSSFWorkbook的65535行局限，是为了针对Excel2007版本的1048576行，16384列，最多可以导出104万条数据。

- **缺点**：
  - 虽然导出数据行数增加了很多倍，但是随之而来的内存溢出问题也成了噩梦。因为你所创建的book，Sheet，row，cell等在写入到Excel之前，都是存放在内存中的（这还没有算Excel的一些样式格式等等），可想而知，内存不溢出就有点不科学了！

### 1.3. SXSSFWorkbook

SXSSFWorkbook是POI3.8之后的版本才有的实现类，它可以操作Excel2007以后的所有版本Excel,扩展名是`.xlsx`。从POI 3.8版本开始，提供了一种基于XSSF的低内存占用的SXSSF方式。

- **优点**：
  - 这种方式一般不会出现内存溢出。它使用了硬盘来换取内存空间，也就是当内存中数据达到一定程度，这些数据会被持久化到硬盘中存储起来，而内存中存的都是最新的数据。
  - 支持大型Excel文件的创建（存储百万条数据绰绰有余）。

- **缺点**：
  - 既然一部分数据持久化到了硬盘中，且不能被查看和访问，那么就会导致，在同一时间点我们只能访问一定数量的数据，也就是内存中存储的数据;
  - `sheet.clone()`方法将不再支持，这还是因为持久化的原因;
  - 不再支持对公式的求值，还是因为持久化的原因，在硬盘中的数据没法读取到内存中进行计算；
  - 在使用模板方式下载数据的时候，不能改动表头，还是因为持久化的问题，写到了硬盘里就不能改变了；

## 2. 根据情况选择使用方式

了解了HSSFWorkbook，XSSFWorkbook，SXSSFWorkbook三种Workbook的优点和缺点后，我们需要根据具体情况来决定使用哪种方式。以下是我通常会参考的几种情况：

1. 当我们经常导入导出的数据不超过7万的情况下，可以选择使用`HSSFWorkbook`或者`XSSFWorkbook`；
2. 当数据量超过7万并且导出的Excel中不涉及对Excel的样式，公式，格式等操作的情况下，推荐使用`SXSSFWorkbook`；
3. 当数据量超过7万，并且我们需要操作Excel中的表头，样式，公式等，这时我们可以使用`XSSFWorkbook`配合进行分批查询，分批写入Excel的方式。

## 3. 百万级数据导入导出

解决问题的第一步是明确自己面临的问题是什么。在处理大量数据时，我们可能会遇到以下问题：

1. 数据量超级大，使用传统的POI方式来完成导入导出很可能会导致内存溢出，并且效率会非常低；
2. 数据量大直接使用`select * from tableName`肯定不行，一下子查出来300万条数据肯定会很慢；
3. 300万数据导出到Excel时不能都写在一个Sheet中，这样效率会非常低，甚至可能需要几分钟才能打开；
4. 300万数据导出到Excel中不能一行一行的导出到Excel中，因为频繁的IO操作是不可取的；
5. 导入时300万数据存储到DB如果循环一条条插入也肯定不行；
6. 导入时300万数据如果使用Mybatis的批量插入也肯定不行，因为Mybatis的批量插入其实就是SQL的循环，速度一样会很慢。

在接下来的部分，我们将讨论如何解决上述问题。



## 4. 解决思路

根据上述列出的问题，我们可以提出以下的解决思路：

### 针对问题1

主要问题在于内存溢出，我们可以使用之前介绍的POI方式来解决。虽然原生的POI解决起来可能比较麻烦，但是通过查阅资料，我们可以发现阿里的一款POI封装工具`EasyExcel`，可以帮助我们解决上述问题。

### 针对问题2

我们不能一次性查询出全部数据，但是可以采用分批查询的方式，这只是需要多查询几次，而且市面上有许多分页插件可以使用。因此，这个问题相对好解决。

### 针对问题3

我们可以将300万条数据分散写入不同的Sheet中，例如，每个Sheet写入一百万条数据。

### 针对问题4

我们不能一行一行地写入到Excel中，但是我们可以将分批查询的数据分批写入到Excel中。

### 针对问题5

在导入到数据库时，我们可以将Excel中读取的数据存储到集合中，当达到一定数量后，直接批量插入到数据库中。

### 针对问题6

我们不能使用Mybatis的批量插入，但可以使用JDBC的批量插入，并配合事务来完成批量插入到数据库。即Excel读取分批+JDBC分批插入+事务。

在接下来的部分，我们将详细探讨如何实现上述解决思路。



## 5. 实践案例：模拟500万数据导出

我们现在来处理一个实际需求：使用`EasyExcel`完成500万数据的导出。

以下是处理500万数据导出的解决思路：

1. 首先在查询数据库层面，我们采取分批查询的策略，例如每次查询20万条数据。
2. 每次查询结束后，使用`EasyExcel`工具将查询到的数据立即写入。
3. 当一个Sheet满载100万条数据后，开始向另一个Sheet中写入数据。
4. 循环上述步骤，直至所有数据全部写入Excel。

**注意事项：**

- 我们需要预先计算Sheet的数量，以及每个Sheet的写入次数。特别注意的是最后一个Sheet的写入次数，因为我们并不知道最后一个Sheet会写入多少数据。例如，最后一个Sheet可能只写入25万条数据，也可能满载100万条数据。因为这里的500万只是模拟数据，实际导出的数据可能多于或少于500万。
- 我们需要计算写入次数，因为我们采用的是分页查询，所以写入的次数应与查询的次数一致。换句话说，查询数据库多少次就写入Excel多少次。

1.如此大批量数据的导出和导入操作，会占用大量的内存实际开发中还应限制操作人数。
2.在做大批量的数据导入时，可以使用jdbc手动开启事务，批量提交。

>来源：blog.csdn.net/qq_44981526/article/details/128738042
