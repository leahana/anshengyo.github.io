# SQL 

## Oracle函数



### Oracle字段属性

#### 时间属性DATETIME和TIMESTAMP的区别：

1. ##### 时间范围不同：

   DATETIME的日期范围是1001-9999年，TIMESTAMP的时间范围是1970-2038年

   

2. ##### 时区：

   DATETIME的储存时间与时区无关，TIMESTAMP储存时间与时区有关，显示的值也依赖于时区。在mysql服务器，操作系统以及客户端连接都有时区设置。

   

3. ##### 储存空间：

   DATETIME使用8字节的存储空间，TIMESTAMP的储存空间为4字节。因此，TIMESTAMP比DATETIME的空间利用率更高。

   

4. ##### 默认值：

   DATETIME的默认值为null，TIMESTAMP的字段默认不为空（not null），默认值为当前时间（CURRENT_TIMESTAMP），如果不做特殊处理，并且update语句中没有指定该列的更新值，则默认更新为当前时间。



#### NUMBER长度对应java属性

1. ##### 如果不指定number的长度，或指定长度n>18：java.math.BigDecimal（id number not null）

2. ##### 10 <= n <= 18：java.lang.Long（id number(n) not null）

3. ##### 1 <= n <= 9：Ijava.lang.Integer（id number(n) not null）



### 字符串空值处理函数：nvl函数

```sql
#NVL函数的功能是实现空值的转换，根据第一个表达式的值是否为空值来返回响应的列名或表达式，主要用于对数据列上的空值进行处理，语法格式如：
NVL( string1, replace_with)。
#NVL(E1, E2)的功能为：如果E1为NULL，则函数返回E2，否则返回E1本身。但此函数有一定局限，所以就有了NVL2函数。
#拓展：NVL2函数:Oracle/PLSQL中的一个函数,Oracle在NVL函数的功能上扩展，提供了NVL2函数。NVL2(E1, E2, E3)的功能为：如果E1为NULL，则函数返回E3，若E1不为null，则返回E2。
```



### 分组后获取每组数据第一条数据

```sql
select * from (
	select ROW_NUMBER() over(partition by x order by y desc),
	t1.* from table_test  t1 
) rn
where rn =1
```

此sql代表按照字段x进行分组，按照字段y倒序排序，取每个分组中的第一条数据。

其中 partition by 是指的是要进行分组的字段。

### oracle 插入数据 根据字段新增or更新

oracle 插入数据 根据字段新增or更新useGeneratedKeys只针对insert 语句, 默认为false

当设置为 true 时，表示如果插入的表以自增列为主键，则允许 JDBC 支持自动生成主键，并可将自动生成的主键返回。

```xml
<insert id = "insert" parameterType = "java.util.ArrayList" useGeneratedKeys = "false">
merge into table_name_1 t1 
using(
  <foreach collection="list" item = "item" index = "index" separator = "union">
    		select	#{item.id,jdbcType=varchar} ID,
    						#{item.name,jdbcType = varchar}  NAME,
    						#{item.age,jdbcType =number} AGE,
    						to_char(sysdate,"YYYY-MM-DD HH24:MI:SS") CREATE_TIME,
    						to_char(sysdate,"YYYY-MM-DD HH24:MI:SS") UPDATE_TIME
      	from DUAL
  </foreach>) t2
  on (t1.id = t2.id)
  when matched then 
  		update 
  			set t1.NAME = t2.NAME,
  					t1.AGE = t2.AGE,
  					t1.UPDATE_TIME = to_char(sysdate,"YYYY-MM-DD HH24:MI:SS")
  when not matched then
  			insert(
  				NAME,
  				AGE,
  				CREATE_TIME,
  				UPDATE_TIME
  			)
  		VALUES(
  			t2.NAME,
  			t2.AGE,
  			t2.CREATE_TIME,
  			t2.UPDATE_TIME
  )
</insert>
     
```

补充：相似语法，mysql: INSERT ··· ON DUPLICATE KEY UPDATE语法



## Oracle实现数据同步

思路一：

步骤一：查询A表中的所有数据

步骤二：删除B表中的所有数据

步骤三：将步骤一查询出的数据批量插入到B表中

思路二：

利用merge into 语法 根据id判断记录是否存在，如果不存在insert 如果存在 update

需求示例1：将同一个数据库中的A表数据同步到B表中

```sql
merge into B b  -- B表是要更新的表
using A a				-- 关联表
on (b.id=a.id) 	-- 关联条件
when matched then	-- 匹配关联条件执行更新操作
update set      
b.name=a.name，
b.age=a.age
when not matched then -- 不匹配关联条件
insert values(a.name,a.age);
```

 需求示例2：讲一个数据库中的A表数据同步到另一个数据库的B表中

首先查询出A表集合数据，然后循环插入或修改；

这里只针对B表操作：（ID为了测试使用特殊值，在程序中应该是传递过来的参数）

```SQL
merge into B
using(select count(*) count from B where id ='123')
t1 no (t1.count<>0)
when matched then update set
name='zhangsan',
age=12
where id='123'
when not matched then insert (id,age,name)values('123',12,'zhangsan')
```



## Oracle服务器启动

VMware vSphere Client

oracle 启动

```shell
#先切换到oracle
$ lsnrctl start
$ sqlplus /nolog
SQL\ conn / as sysdba
Connected to an idel instance
SQL\ startup
ORACLE instance started
```



#### 







