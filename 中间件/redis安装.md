## redis

### 一、安装命令

##### 使用mac的包管理工具brew ，如果未安装brew，命令行先输入以下命令

```swift
/bin/bash -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
```

##### 安装redis：

```Swift
brew install redis@6.2.6 #@后可指定版本
```

### 二、使用redis的常用命令

##### 1.启动redis 服务

```Swift
brew services start redis
```

##### 2.关闭redis服务

```Swift
brew services stop redis
```

##### 3.重启redis服务

```Swift
brew services restart redis
```

##### 4.打开图形化界面

```Swift
redis-cli
```

### 三、常用配置命令

##### 1.开机启动redis命令

```swift
ln -sfv /usr/local/opt/redis/*.plist ~/Library/LaunchAgents
```

##### 2.使用配置文件启动redis-server

```swift
redis-server /usr/local/etc/redis.conf
```

##### 3.停止redis服务

```swift
redis-cli shutdown
```

##### 4.redis配置文件位置

```swift
/usr/local/etc/redis.conf
```

##### 5.卸载redis

```swift
brew uninstall redis rm ~/Library/LaunchAgents/homebrew.mxcl.redis.plist
```



## SpringBoot 整合redis

##### 起步依赖

```xml
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

##### yml配置



```yaml
spring:
#  redis:
#    host: 127.0.0.1
#    port: 6379
#    timeout: 20000
```

## redis业务场景

#### 一 缓存

​		1.必须保证不同对象的key不会重复，key尽量短，类名(表名)+主键拼接

​		2.选择合适的序列化方式，提高效率减少内存占用

​		3.缓存内容与数据库一致

#### 二 排行榜

​		淘宝年度/日销榜单。利用zset结构能实现复杂排行榜。

#### 三 计数器

​		点赞，文章阅读播放数。先写入redis再定时同步数据库。incr命令实现计数器功能。

​		高读写特性完全发挥redis作用。string，hash，sorted set 都提供incr方法用于原子自增。

​		1.显示每天注册用户数量，初始化时设置0点过期时间。

​		2.每条微博/动态 点赞，评论，转发，浏览 四个属性用hash计数，key为weibo_id，field为

​			like_number,comment_number,forward_number,view_number,操作完成后通过			hincrby使filed 自增

#### 四 限流

​		以访问者的ip和其他信息作为key。访问一次增加一次计数。



#### 五 分布式会话

​		集群模式下，引用不多一般使用容器自带的session复制功能，应用增多且相对复杂的系统	一般会搭建以redis等内存数据库为中心的session服务，session 不再由容器管理，而是由	 	session服务和内存数据库管理。

#### 六 分布式锁	

​		对同一个资源的并发访问，全局id，减库存，秒杀等场景，利用redis setnx功能来编写锁，	设置返回1 获取成功，否则失败。

​	EX：设置键的过期时间（单位为秒）
​	PX：设置键的过期时间（单位为毫秒）
​	NX:  只在键不存在时，才对键进行设置操作。 SET key value NX 效果等同于 SETNX key 			 value 。
​	XX ：只在键已经存在时，才对键进行设置操作

​			简单分布式锁

```zsh
set lock_key locked NX EX 1
```

​	第三方库 redisson

#### 七 消息队列

​		redis list 是双向列表， 生产者ipush消息放入list， 消费者通过rpop取出消息。需要实现带有优先级的消息队列可以使用sorted set。redis 也有持久化的能力。

#### 八 抽奖

​		Redis Spop移除指定key的一个或多个随机元素

#### 九 签到

#### 十 显示最新的项目列表



