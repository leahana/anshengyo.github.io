### 每天100w次登陆请求，8g内存如何设置jvm参数

### Step1 新系统上线如何规划容量

##### 一.套路总结

任何新业务系统上线前都需要估算服务配置和jvm的内存参数，容量和资源规划并不仅仅是随意估算的，需要根据系统所在的业务场景估算，推算出一个系统运行模型，评估jvm性能和GC频率等指标

建模步骤:

- 计算业务系统每秒创建的对象会占用多大的内存空间，然后计算每个集群下每个系统每秒的内存占用空间()对象的创建速度
- 设置一个机器配置，估算新生代的空间，比较不同新生代大小之下，多久出发一次MionorGC.

​		Minor GC：当Eden区域不足分配时就会触发。

- 根据这套配置，基本可以推算出整个系统的运行模型，每秒钟创建多少对象，1s后成为垃圾，系统运行多久新生代会出发一次GC， 频率多高

##### 二.套路实战--以登录系统为例

模拟推演过程

- 假设每天100w次登陆请求， 登陆峰值在早上，预估峰值时期每秒100次登陆请求.
- 假设部署三台服务器，每台服务器每秒处理30次登陆请求，假设一个登陆请求需要处理1秒钟，jvm新生代理每秒就要生成30个登陆对象，1s之后请求完毕这些对象成为了垃圾
- 一个登陆对象假设20个字段，一个对象估算500字节，30个登陆占用大约15kb，考虑到RPC和DB操作，网络通信，写库，写缓存一顿操作下来，可以扩大到20-50倍，大约1s产生 几百k-1m数据。
- 假设2c4g机器部署，分配2g堆内存，新生代则只有几百M ，按照1s1M的垃圾产生速度，几百秒就会出发一次MinorGC
- 假设4c8g机器部署，分配4g堆内存，新生代分配2g，如此需要几个小时才会触发一次MinorGC

所以 可以粗略推断出一个每天100w次请求的登录系统，按照4c8g的3实例集群配置，分配4g堆内存，2g新生代的jvm，可以保证系统的一个正常负载

搭建新系统需要预估每个实例需要多少容量多少配置，集群配置多少实例的等等。

### Step2：该如何进行垃圾回收器的选择？

##### 吞吐量优先还是响应时间优先

吞吐量 = CPU在用户应用程序运行的时间/（CPU在用户应用程序运行的时间+CPU垃圾回收的时间）

响应时间 = 平均每次GC的耗时

通常这在jvm中是两难之选



堆内存增大，gc一次能处理的数量变大，吞吐量变大；但是gc一次的时间会变长，导致后面排队的县城等待时间变长；相反，如果堆内存小，gc一次时间短，排队等待的线程等待时间变短，延迟减少，但一次请求的数量变小（并不绝对）

无法同时兼顾，是吞吐优先还是响应优先，这是一个需要权衡的问题

#### 垃圾回收设计上的考量

- jvm 在GC时 不允许一边垃圾回收，一边创建新对象。
- jvm需要一段stop the world的暂停时间，STP会造成系统短暂停顿不能处理任何请求
- 新生代收集频率高，性能优先，常用复制算法；老年代频次低，空间敏感，避免复制方式
- 所有垃圾回收器的设计目标都是让GC频率更少，时间更短，减少GC对系统影响

#### CMS 和G1

目前主流的垃圾回收器配置是新生代采用ParNew，老年代采用CMS组合的方式，或者是完全采用G1回收器

从未来趋势来看，G1是官方维护，和更为推崇的垃圾回收器

响应优先：ParNew+CMS组合

-XX:+UseParNewGC(CMS默认)

-XX:+UseConcMarkSweepGC

吞吐优先：G1回收器

-XX:+UseG1GC

系统业务：

- 延迟敏感推荐使用cms
- 打内存服务，要求高吞吐量的，采用G1回收器

#### CMS垃圾回收器的工作机制

CMS主要是针对老年代的回收器，老年代是标记-清除，默认会在一次FullGC算法后做整理算法，清理内存碎片

|   CMS GC   | 描述                                                         | stop  the world | 速度 |
| :--------: | :----------------------------------------------------------- | :-------------: | :--: |
| 1.标记开始 | 初始标记仅标记GCRoots能关联到的对象,速度很快                 |       Yes       | 很快 |
| 2.并发标记 | 并发标记阶段就是进行GCRoots Tracing的过程                    |       No        |  慢  |
| 3.重新标记 | 重新标记阶段是为了修正并发标记期间因用户程序继续运作而导致标记变动的那一部分对象的标记记录 |       Yes       | 很快 |
| 4.垃圾回收 | 并发清理垃圾对象                                             |       No        |  慢  |

- 优点: 并发收集，主打 低延迟。在最耗时的两个阶段都没有发生STW，而需要STW的阶段都以很快的速度完成
- 缺点：1.消耗cpu，2.浮动垃圾，3.内存碎片
- 适用场景：重视服务器响应速度，要求系统停顿时间最短

### Step3：如何对每个分区的比例、大小进行规划

一般思路：

首先，jvm最重要最核心的参数事去评估的内存和分配，第一步需要指定堆内存大小，这是系统上线前必须要做的， -Xms 初始堆大小， -Xmx最大堆大小，后台java服务中，一般都指定为系统内存的一半，过大会占用服务器的系统资源，过小则无法发挥出jvm的最佳性能

其次，需要指定-Xmn新生代的大小，这个参数非常关键，灵活度很大，sun官方推荐为3/8大小，但是要根据业务场景来定，针对于无状态或者轻状态服务（现在最常见的业务系统如Web应用）来说，一般新生代甚至可以给到堆内存3/4的大小；而对于有状态服务 （常见如1M服务，网关接入层等系统） 新生代可以按照默认比例1/3来设置。服务有状态则意味着会有更多的本地缓存和绘画状态信息常驻内存，因为要给老年代设置更大的内存来存放这些对象。

最后，设置 -Xss栈内存大小，设置单个线程栈大小，默认值和jdk版本、系统有关、一般默认512-1024kb。一个后台服务如果常驻线程有几百个，那么栈内存这边也会占用了几百M的大小

| JVM参数 | 描述                                                     | 默认       | 推荐        |
| ------- | -------------------------------------------------------- | ---------- | ----------- |
| -Xms    | Java堆内存大小                                           | OS内存64/1 | OS内存一半  |
| -Xmx    | java堆内存最大大小                                       | OS内存4/1  | OS内存一半  |
| -Xmn    | java堆内存中新生代大小，扣除新生代剩下的就是老年代大小了 | 堆内存1/3  | sun推荐 3/8 |
| -Xss    | 每个线程的栈内存大小                                     | 和jdk有关  | sun         |



对于8g内存，一半分配一半的最大内存就可以了，因为机器本上还要占用一定内存，一半是4g内存分配给jvm



引入性能压测缓解，测试同学对登陆接口压至1s内50m的对象生成速度，采用ParNew+CMS

的组合回收器

正常的JVM参数如下

```zsh
-Xms3072M -Xmx3072M -Xss1M -XX:MetaspaceSize=256M -XX:MaxMetaspaceSize=256M -XX:SurvivorRatio=8 

```

这样设置可能会由于动态对象年龄判断原则导致频繁full gc。



压测过程中，短时间（比如20s）Eden区就满了，此时对象已经无法分配，会触发MinorGC

假设在这次GC后s1装入100m ，马上20s后又会触发一次MinorGC，多出来的100M存活对象+S

区的100M已经无法顺利放入到S2区，此时机会触发JVM的动态年龄机制，将一批100m左右的对象推到老年代保存，持续运行一段时间，系统可能一个小时内就会出发一次FullGC

按照默认8:1:1比例分配 survivor区之后1g的10% 也就是几十到100m



如果每次MinorGC垃圾回收后进入survivor对象很多，并且survivor对象大小很快找过Survivor的50%，那么就会出发动态年龄判定规则，让部分对象进入老年代



而一个GC过程中，可能部分WEB请求为处理完毕，几十m的对象，进入survivor的概率是非常大的，甚至一定会发生

- Survivor Space(幸存者区)

如何解决这个问题？

为了让对象尽可能在新生代的eden区和survivor区，尽可能的让survivor区内存多一点，达到200m左右

于是更新jvm参数如下

```zsh
-Xms3072M -Xmx3072M -Xmn2048M -Xss1M -XX:MetaspaceSize=256M -XX:MaxMetaspaceSize=256M  -XX:SurvivorRatio=8  

说明：
‐Xmn2048M ‐XX:SurvivorRatio=8 
年轻代大小2g，eden与survivor的比例为8:1:1，也就是1.6g:0.2g:0.2g
```



survivor达到200m，几十m对象到底survivor，survivor也不一定超过50%

这样可以防止每次垃圾回收后，survivor对象太早超过50%

这样就降低了因为对象年龄判断原则导致 对象频繁进入老年代的问题



#### 什么是jvm动态年龄判断规则

对象进入老年代的**动态年龄判断规则**（动态晋升年龄计算阈值）：Minor GC时，Minor GC 时，Survivor 中年龄 1 到 N 的对象大小超过 Survivor 的 50% 时，则将大于等于年龄 N 的对象放入老年代。

核心优化策略： 

- 让短期存活的对象尽量都留在Survivor理，不要进入老年代，这样在Minor GC时这些对象都会被回收，不会进到老年代从而导致full gc

#### 

#### 应该如何去评估新生代内存和分配合适？

见step3思路



### Step4 ：栈内存大小多少比较合适

-Xss栈内存大小，设置单个线程栈大小，默认值和JDK版本、系统有关，一般默认512~1024kb。一个后台服务如果常驻线程有几百个，那么栈内存这边也会佔用了几百M的大小。



### step5：对象年龄应该为多少才移动到老年代比较合适？

假设一次minorGC 要间隔20-30s 并且大多数对象在几秒内就会变为垃圾

那么对象长时间没有被回收，比如2分钟没有回收，可以认为这些对象是会存活的比较长的对象，从而移动到老年代，而不是继续一直占用survivor区空间

所以可以将默认的15岁改小一点，比如改为5，

那么意味着对象要经过5次minorgc才会进入老年代，整个时间也有一两分钟了（50*30s = 150s）和几秒的时间相比，对象已经存活了足够长的时间了。

所以适当调整jvm参数如下

```zsh
‐Xms3072M ‐Xmx3072M ‐Xmn2048M ‐Xss1M ‐XX:MetaspaceSize=256M ‐XX:MaxMetaspaceSize=256M ‐XX:SurvivorRatio=8 ‐XX:MaxTenuringThreshold=5 

```



### Step6 :多大的对象，可以直接到老年代

对于多大的对象直接进入老年代(参数-XX:PretenureSizeThreshold)，一般可以结合自己系统看下有没有什么大对象 生成，预估下大对象的大小，一般来说设置为1M就差不多了，很少有超过1M的大对象，所以：可以适当调整JVM参数如下：

```zsh s
‐Xms3072M ‐Xmx3072M ‐Xmn2048M ‐Xss1M ‐XX:MetaspaceSize=256M ‐XX:MaxMetaspaceSize=256M ‐XX:SurvivorRatio=8 ‐XX:MaxTenuringThreshold=5 ‐XX:PretenureSizeThreshold=1M

```



### Step7：垃圾回收器CMS老年代的参数优化

Jdk8 默认的垃圾回收器是 JDK8默认的垃圾回收器是-XX:+UseParallelGC(年轻代)和-XX:+UseParallelOldGC(老年代)，

如果内存较大（超过4个G ）建议使用G1

这里是4G以内，又是主打“低延时” 的业务系统，可以使用下面的组合：



```
ParNew+CMS(-XX:+UseParNewGC -XX:+UseConcMarkSweepGC)

```

新生代的采用ParNew回收器，工作流程就是经典复制算法，在三块区中进行流转回收，只不过采用多线程并行的方式加快了MinorGC速度。

老生代的采用CMS。再去**优化老年代参数**：比如老年代默认在标记清除以后会做整理，还可以在CMS的增加GC频次还是增加GC时长上做些取舍



响应优先的参数调优

```zsh
XX:CMSInitiatingOccupancyFraction=70
```

设定CMS在内存占用率达到70%的时候开始GC（因为CMS会有浮动垃圾，所以一般较早启动GC）

设定CMS在对内存占用率达到70%的时候开始GC(因为CMS会有浮动垃圾,所以一般都较早启动GC)

```shell
XX:+UseCMSInitiatinpOccupancyOnly
```

和上面搭配使用，否则只生效一次

```zsh
-XX:+AlwaysPreTouch
```

强制操作系统把内存真正分配给jvm

综上，只要年轻代参数设置合理，老年代CMS的参数设置基本都可以用默认值，如下所示：

```shell
‐Xms3072M ‐Xmx3072M ‐Xmn2048M ‐Xss1M ‐XX:MetaspaceSize=256M ‐XX:MaxMetaspaceSize=256M ‐XX:SurvivorRatio=8  ‐XX:MaxTenuringThreshold=5 ‐XX:PretenureSizeThreshold=1M ‐XX:+UseParNewGC ‐XX:+UseConcMarkSweepGC ‐XX:CMSInitiatingOccupancyFraction=70 ‐XX:+UseCMSInitiatingOccupancyOnly ‐XX:+AlwaysPreTouch

```

**参数解释**

1.`‐Xms3072M ‐Xmx3072M` 最小最大堆设置为3g，最大最小设置为一致防止内存抖动

2.`‐Xss1M` 线程栈1m

3.`‐Xmn2048M ‐XX:SurvivorRatio=8` 年轻代大小2g，eden与survivor的比例为8:1:1，也就是1.6g:0.2g:0.2g

4.`-XX:MaxTenuringThreshold=5` 年龄为5进入老年代 5.‐`XX:PretenureSizeThreshold=1M` 大于1m的大对象直接在老年代生成

6.`‐XX:+UseParNewGC ‐XX:+UseConcMarkSweepGC` 使用ParNew+cms垃圾回收器组合

7.`‐XX:CMSInitiatingOccupancyFraction=70` 老年代中对象达到这个比例后触发fullgc

8.`‐XX:+UseCMSInitiatinpOccupancyOnly` 老年代中对象达到这个比例后触发fullgc，每次

9.`‐XX:+AlwaysPreTouch` 强制操作系统把内存真正分配给IVM，而不是用时才分配。



### Step8: 配置OOM的时候内存dump文件和GC日志

额外增加了GC打印日志，OOM自动dump等配置内容，帮助进行问题排查

```shell
-XX:+HeapDumpOnOutOfMemoryError

```

在oom jvm快要死掉的时候，输入Heap Dump到指定文件

路径只指向目录 jvm会保持文件名的唯一 java_pid${pid}.hprof

```shell

-XX:+HeapDumpOnOutOfMemoryError 
-XX:HeapDumpPath=${LOGDIR}/
```



因为如果指向特定的文件，而文件已存在，反而不能写入。

输出4G的HeapDump，会导致IO性能问题，在普通硬盘上，会造成20秒以上的硬盘IO跑满，

需要注意一下，但在容器环境下，这个也会影响同一宿主机上的其他容器。

GC的日志的输出也很重要：

```shell

-Xloggc:/dev/xxx/gc.log 
-XX:+PrintGCDateStamps 
-XX:+PrintGCDetails
```



通用模版

**基于4C8G系统的ParNew+CMS回收器模板（响应优先），新生代大小根据业务灵活调整！**

不能保证性能最佳，但是至少能让JVM这一层是稳定可控的

```shell
-Xms4g
-Xmx4g
-Xmn2g
-Xss1m
-XX:SurvivorRatio=8
-XX:MaxTenuringThreshold=10
-XX:+UseConcMarkSweepGC
-XX:CMSInitiatingOccupancyFraction=70
-XX:+UseCMSInitiatingOccupancyOnly
-XX:+AlwaysPreTouch
-XX:+HeapDumpOnOutOfMemoryError
-verbose:gc
-XX:+PrintGCDetails
-XX:+PrintGCDateStamps
-XX:+PrintGCTimeStamps
-Xloggc:gc.log
```

#### 如果是GC的吞吐优先，推荐使用G1，基于8C16G系统的G1回收器模板：

G1收集器自身已经有一套预测和调整机制了，因此我们首先的选择是相信它，

即调整-`XX:MaxGCPauseMillis=N`参数，这也符合G1的目的——让GC调优尽量简单！

同时也不要自己显式设置新生代的大小（用-Xmn或-XX:NewRatio参数），

如果人为干预新生代的大小，会导致目标时间这个参数失效。

```shell
-Xms8g
-Xmx8g
-Xss1m
-XX:+UseG1GC
-XX:MaxGCPauseMillis=150
-XX:InitiatingHeapOccupancyPercent=40
-XX:+HeapDumpOnOutOfMemoryError
-verbose:gc
-XX:+PrintGCDetails
-XX:+PrintGCDateStamps
-XX:+PrintGCTimeStamps
-Xloggc:gc.log
```

| G1参数                              | 描述                                                | 默认值 |
| ----------------------------------- | --------------------------------------------------- | ------ |
| XX:MaxGCPauseMillis=N               | 最大gc停顿时间。柔韧性莫表，jvm满足90% 不保证100%   | 200    |
| -XX:nitiatingHeapOccupancyPercent=n | 当整个堆的空间使用百分比超过这个值时，就会融发MixGC | 45     |

针对`-XX:MaxGCPauseMillis`来说，参数的设置带有明显的倾向性：调低↓：延迟更低，但MinorGC频繁，MixGC回收老年代区减少，增大Full GC的风险。调高↑：单次回收更多的对象，但系统整体响应时间也会被拉长。

针对`InitiatingHeapOccupancyPercent`来说，调参大小的效果也不一样：调低↓：更早触发MixGC，浪费cpu。调高↑：堆积过多代回收region，增大FullGC的风险。



### 调优总结

系统在上线前的综合调优思路：

1、业务预估：根据预期的并发量、平均每个任务的内存需求大小，然后评估需要几台机器来承载，每台机器需要什么样的配置。

2、容量预估：根据系统的任务处理速度，然后合理分配Eden、Surivior区大小，老年代的内存大小。

3、回收器选型：响应优先的系统，建议采用ParNew+CMS回收器；吞吐优先、多核大内存(heap size≥8G)服务，建议采用G1回收器。

4、优化思路：让短命对象在MinorGC阶段就被回收（同时回收后的存活对象<Survivor区域50%，可控制保留在新生代），长命对象尽早进入老年代，不要在新生代来回复制；尽量减少Full GC的频率，避免FGC系统的影响。

5、到目前为止，总结到的调优的过程主要基于上线前的测试验证阶段，所以我们尽量在上线之前，就将机器的JVM参数设置到最优！

JVM调优只是一个手段，但并不一定所有问题都可以通过JVM进行调优解决，大多数的Java应用不需要进行JVM优化，我们可以遵循以下的一些原则：

- 上线之前，应先考虑将机器的JVM参数设置到最优；
- 减少创建对象的数量（代码层面）；
- 减少使用全局变量和大对象（代码层面）；
- 优先架构调优和代码调优，JVM优化是不得已的手段（代码、架构层面）；
- 分析GC情况优化代码比优化JVM参数更好（代码层面）；

通过以上原则，我们发现，其实最有效的优化手段是架构和代码层面的优化，而JVM优化则是最后不得已的手段，也可以说是对服务器配置的最后一次“压榨”。