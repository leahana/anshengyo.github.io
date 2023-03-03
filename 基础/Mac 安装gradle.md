## Mac 安装gradle 



### 一 下载gradle

下载地址：https://gradle.org/releases/  选择**binary-only** 下载



### 二 创建本地gradle

复制根目录路径

```zsh
(base)
anshengyo at Mac-Coda in ~
$ vim ~/.bash_profile

#添加路径 "=" 号前后不能有空格
export GRADLE_HOME="/Users/anshengyo/DevTools/JavaDev/gradle/gradle-7.6.1"
export PATH=$PATH:$GRADLE_HOME/bin

#:wq保存 ,无法保存是权限问题

#重新加载配置文件
source ～/.bash_profile
```

### 三 查看gradle 版本验证



```shell
anshengyo at Mac-Coda in ~
$ gradle -v

Welcome to Gradle 7.6.1!

Here are the highlights of this release:
 - Added support for Java 19.
 - Introduced `--rerun` flag for individual task rerun.
 - Improved dependency block for test suites to be strongly typed.
 - Added a pluggable system for Java toolchains provisioning.

For more details see https://docs.gradle.org/7.6.1/release-notes.html


------------------------------------------------------------
Gradle 7.6.1
------------------------------------------------------------

Build time:   2023-02-24 13:54:42 UTC
Revision:     3905fe8ac072bbd925c70ddbddddf4463341f4b4

Kotlin:       1.7.10
Groovy:       3.0.13
Ant:          Apache Ant(TM) version 1.10.11 compiled on July 10 2021
JVM:          1.8.0_332 (Azul Systems, Inc. 25.332-b09)
OS:           Mac OS X 13.2.1 aarch64

(base)
```

