# 数据备份

### 一.定义：

> ​	备份就是吧数据库复制到转储存设备的过程，其中，转储设备是指用于放置数据库副本的磁带或磁盘。通常也将存放于转储设备中的数据库的副本称为原数据库的备份或转储。备份是一份数据副本。



### 二.备份分类

#### 逻辑和物理角度分析

> 从物理与逻辑的，备份可以分为物理备份和逻辑备份。
> 物理备份：对数据库操作系统的物理文件（数据文件，控制文件和日志文件）的备份。物理备份又可以分为脱机备份（冷备份）和联机备份（热备份），前者是在关闭数据库的时候进行的，后者是以归档日志的方式对运行的数据库进行备份。可以使用oracle的恢复管理器（RMAN）或操作系统命令进行数据库的物理备份。
> 逻辑备份：对数据库逻辑组件（如表和存储过程等数据库对象）的备份。逻辑备份的手段很多，如传统的EXP，数据泵（EXPDP），数据库闪回技术等第三方工具，都可以进行数据库的逻辑备份。

#### 从数据库的备份角度分类： 

> 备份可以分为完全备份和增量备份和差异备份

- 完全备份：每次对数据库进行完整备份，当发生数据丢失的灾难时，完全备份无需依赖其他信息即可实现100%的数据恢复，其恢复时间最短且操作最方便。
- 增量备份：只有那些在上次完全备份或增量备份后被修改的文件才会被备份。优点是备份数据量小，需要的时间短，缺点是恢复的时候需要依赖以前备份记录，出问题的风险较大。
- 差异备份：备份那些自从上次完全备份之后被修改过的文件。从差异备份中恢复数据的时间较短，因此只需要两份数据—最后一次完整备份和最后一次差异备份，缺点是每次备份需要的时间较长。



### 三.恢复定义

>恢复就是发生故障后，利用已备份的数据文件或控制文件，重新建立一个完整的数据库

## Oracle

### 一、恢复分类

- 实例恢复

  --当oracle实例出现失败后，oracle 自动进行的恢复

- 介质恢复

  --当存放数据库的介质出现故障时所作的恢复。介质恢复又分为完全恢复和不完全恢复

  - 完全恢复

    --将数据库恢复到数据库失败时的状态。这种恢复是通过装载数据库备份并应用全部的重做日志做到的

  - 不完全恢复

    --将数据库恢复到数据库失败前的某一时刻的状态。这种恢复是通过装载数据库备份并应用部分的重做日志做到的。进行不完全恢复后，必须在重启数据库时用resetlogs选项重设联机重做日志

## 二、逻辑备份（expdp 和impdp）

### 1、expdp/impdp和exp/imp的区别

>exp和imp是客户端工具，他们既可以在客户端使用，也可以在服务端使用。
>
>expdp/impdp是服务端的工具程序，他们只能在oracle服务端使用，不能再客户端使用。
>
>imp只适用于exp导出的文件，不适用于expdp导出文件；impdp只适用于expdp导出的文件，而不适用于exp导出文件。
>
>对于10g以上的服务器，使用exp通常不能导出0行数据的空表，而此时必须使用expdp导出。

### 2、导入导出

#### 1)exp 导出/imp导入

```shell
# 切换到oracle用户 su - oracle

# 导出
# exp 用户名/密码 file=文件路径 tables=表1，表2
exp smtdp/12345 file=/home/oracle/data/temp.dmp \ tables=table_name_01,table_name_02 

# 导入
# imp 用户名/密码 file=文件路径 full=y ignore=y
imp smtdp/12345 file=/home/oracle/data/temp.dmp

# 执行文件权限设置
# 设置目录所有者为oinstall用户组的Oracle用户
chown -R oracle:oinstall temp.dmp
```

#### 2)expdp/impdp

1. ##### 在准备要备份的数据库服务器上创建备份目录
> 在后面使用sql命令创建的逻辑目录并不是在OS上创建目录，所以我们先要在服务器上创建一个目录

```shell
su oracle
$ mkdir /home/oracle/oracle_bak
```
2. ##### 用管理员身份登陆到sqlplus

```shell
$ sqlplys /nolog
SQL> conn sys/oracl as sysdba
```
3. ##### 创建逻辑目录
```shell
SQL> create directory data_dir as ‘/home/oracle/oracle_bak’;
```
4. ##### 查看管理员目录是否存在
```shell
SQL> select * from dba_direcories;
```
5. ##### 使用管理员用户给指定的用户赋予在该目录的操作权限
> 比如该用户需要备份自己的数据
```shell
SQL> grant read,write on directory data_dir to C##BAK_TEST_USER;
```

### 导出数据的方式
1. ##### "full=y" ,全量导出数据库
```shell
$ expdp sys/oracle@orcl dumpfile=expdp.dmp directory=data_dir 
full=y logfile=expdp.log
```

2. ##### schemas按用户导出
```shell
$ expdp user/passwd@orcl schemas=user dumpfile=expdp.dmp directory=data_dir logfile=expdp.log
```

3. ##### 按表空间导出
```shell
$ expdp sys/passwd@orcl tablespace=tbs1,tbs2 dumpfile=expdp.dmp directory=data_dir logfile=expdp.log
```

4. ##### 导出表
```shell
$ expdp user/passwd@orcl tables=table1,table2 dumpfile=expdp.dmp directory=data_dir logfile=expdp.log
```

5. ##### 按查询条件导出
```shell
$ expdp user/passwd@orcl tables=table1=‘where number=1234’ dumpfile=expdp.dmp directory=data_dir logfile=expdp.log
```


### 导入数据的方式
> 首先需要导入的文件存放在导入的数据库服务器上

参照导出的时候的建立目录方式建立物理目录和逻辑目录（只是建目录即可，如果需要给用户权限则加上给用户权限的那步)
使用命令导入，同时，导入方式也可以分为五种，分别对应着导出的五种方式

1. ##### “full=y”，全量导入数据库；
```shell
impdp user/passwd directory=data_dir dumpfile=expdp.dmp full=y
```

2. ##### 同名用户导入，从用户A导入到用户A；
```shell
impdp A/passwd schemas=A directory=data_dir dumpfile=expdp.dmp logfile=impdp.log;
```

3. ##### 
###### ①从A用户中把表table1和table2导入到B用户中；
```shell
impdp B/passwdtables=A.table1,A.table2 remap_schema=A:B directory=data_dir dumpfile=expdp.dmp logfile=impdp.log;
```


###### ②将表空间TBS01、TBS02、TBS03导入到表空间A_TBS，将用户B的数据导入到A，并生成新的oid防止冲突；
```shell
impdp A/passwd remap_tablespace=TBS01:A_TBS,TBS02:A_TBS,TBS03:A_TBS remap_schema=B:A FULL=Y transform=oid:n
directory=data_dir dumpfile=expdp.dmp logfile=impdp.log
```

4. ##### 导入表空间
```shell
impdp sys/passwd tablespaces=tbs1 directory=data_dir dumpfile=expdp.dmp logfile=impdp.log
```

5. ##### 追加数据
```shell
impdp sys/passwd directory=data_dir dumpfile=expdp.dmp schemas=system table_exists_action=replace logfile=impdp.log;
–table_exists_action:导入对象已存在时执行的操作。有效关键字:SKIP,APPEND,REPLACE和TRUNCATE
```

#### 3)并行操作
> 可以通过PARALLEL参数作为导出 使用一个以上的线程来加速作业


版权声明：本文为CSDN博主「lz_N_one」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/lz_N_one/article/details/126139352


## Mysql

### 一、备份数据库

我们可以使用 mysqldump 工具来备份 MySQL 数据库，该工具可以生成 SQL 脚本文件，包含数据库中所有表和数据的语句。

```shell
mysqldump -u [username] -p [database_name] > [backup_file].sql
```

其中，[username] 是 MySQL 用户名，[database_name] 是需要恢复的数据库名称，[backup_file].sql 是备份的文件名。

该命令会将 SQL 脚本文件导出到当前目录下。

### 二、恢复 MySQL 数据库

如果需要恢复之前备份的数据，可以运行以下命令：

该命令将备份文件中的SQL语句执行，从而将数据恢复到指定的数据库中

如果需要回复半个月前的数据，可以选择备份文件中的某个时间节点之前的数据，并使用以上方法进行恢复

此外，还有其他的备份方式， 如使用mysql自带的mysqlbinlog 工具进行增量备份，或使用第三方备份软件进行备份。根据实际需求选择合适的备份方式，并将备份文件存放在可靠的位置。

navicat也可以

### 补充：

备份方法有很多，包括**逻辑备份、物理备份、全备份和增量备份。**可以根据需求和环境选择合适的方式。如果想要恢复半个月前的数据，需要先确保优半个月前的备份文件，然后使用相应的工具或者命令进行还原

例如：

如果你使用 mysqldump 命令进行了逻辑备份，那么你可以使用 source 指令或者 mysql 命令来导入备份文件。



#### 逻辑备份

逻辑备份是使用SQL语句来导出和导入数据库的数据的方法。优点是简单易用，可以跨平台和存储引擎，可以部分备份和恢复。它的缺点是速度慢，占用空间大，可能影响数据库性能。

mysql提供了一个原生的逻辑备份工具叫做mysqldump。可以使用它来备份整个数据库实例、单个数据库或单张表。例如，如果你想要备份一个叫ytt的数据库，可以在命令行窗口输入

```shell
mysqldump -u 用户名 -p 密码 --database ytt > ytt.sql
```

这样就会生成一个包含ytt数据库所有数据的sql文件。

如果你想要恢复这个文件到数据库中，可以在命令行输入：

```shell
mysql -u 用户名 -p 密码 < ytt.sql
```

或者

```shell
mysql -u 用户名 -p 密码 source ytt.sql
```

这样就会执行 SQL 文件中的语句，将数据还原到数据库中。



#### 物理备份

物理备份是直接拷贝数据库中的数据文件、配置文件和日志文件。优点是速度快，占用空间小，不影响数据库性能。缺点是恢复复杂，需要关闭数据库服务，可能导致数据不一致。（docker 挂载出coloum）



Mysql有一个开源的物理热备工具叫做 **Percona XtraBackup**。它可以在不锁表的情况下备份InnoDB，XtraDB

和MyISAM存储引擎的表，并且支持增量同步。可以用它来备份整个数据库实例或单个数据库

例如，想全量备份一个叫ytt的数据库，可以在输入：

```shell
innobackupex --user=用户名 --password=密码 --databases="ytt" /backup
```

这样就会在 /backup 目录下生成一个包含 ytt 数据库所有数据文件的目录。

如果想要恢复这个目录到数据库中，需要准备好数据文件，然后拷贝到对应的数据目录中，并更改权限和所有者，具体步骤如下

```shell
innobackupex --apply-log \
/backup/2023-02-27_00-00-00 	\
cp -r /backup/2023-02-27_00-00-00/* \
/var/lib/mysql \
chown -R mysql:mysql /var/lib/mysql

```

请注意，在恢复之前，你需要停止 MySQL 服务，并确保数据目录为空。

#### 全备份和增量备份

全备份是指备份数据库中的所有数据，不管数据是否有变化。它的优点是恢复简单，不需要其他文件。他的缺点是占用空间大，耗时长，影响数据库性能。

增量同步是指备份上次全备份，或增量备份后发生变化的数据，需要开启binlog日志功能，它的优点是占用空间小，耗时短，不影响数据库性能，它的缺点是恢复复杂，需要依赖binlog日志文件和全备份文件

例如 如果想要每天进行一次全备份和每小时进行一次增量备份，你可以使用mysqldump工具和binlog工具实现。

首先在my.cnf文件中开启binlog功能，并设置每天生成一个日志文件，

```shell
[mysqld] log-bin=/var/lib/mysql/mysql-bin expire-logs-days=7 max_binlog_size=100M

```

然后在 crontab 中设置定时任务

```shell
# 每天凌晨 0 点进行一次全备份 
0 0 * * * mysqldump -u root -p password --all-databases > /backup/full_$(date +%Y%m%d).sql

```

每小时进行一次增量备份

```shell
0 * * * * mysqlbinlog --read-from-remote-server --host=localhost --user=root --password=password --stop-never-slave-server-id=10 mysql-bin.000001 > /backup/incremental_$(date +%Y%m%d%H).sql`
```

这样就可以在 /backup 目录下生成全备份和增量备份文件。

如果你想要恢复这些文件到数据库中，你需要**先停止 MySQL 服务**，并确保数据目录为空。然后按照以下步骤操作：

```shell
# 恢复最近一次的全备份文件 
mysql -u root -p password < /backup/full_20230227.sql
```

恢复之后产生的所有增量备份文件

```shell
mysqlbinlog /backup/incremental_202302270*.sql | mysql -u root -p password`
```