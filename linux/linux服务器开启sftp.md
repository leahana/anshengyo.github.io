# linux服务器开启sftp



##	1. 创建sftp用户组
> 创建完成后使用cat /etc/group 查看组信息
```zsh
groupadd sftp
cat /etc/group
# sftp:x:1002:
```

##	2.创建一个sftp用户，并添加到用户组
> sftpuser01并加入到创建的sftp用户组中，同时修改sftpuser01用户的密码
> 
```zsh
root@VM-16-8-ubuntu:~# useradd -g sftp -s /bin/false sftpuser01passwd sftpuser01
root@VM-16-8-ubuntu:~# passwd sftpuser01
New password:
Retype new password:
passwd: password updated successfully
root@VM-16-8-ubuntu:~#
```

##	3.新建目录，并指定为用户home目录
> 
```zsh
# 新建/data/sftp/sftpuser01 目录，并将它指定为sftpuser01用户的home目录
root@VM-16-8-ubuntu:~# mkdir -p /data/sftp/sftpuser01
root@VM-16-8-ubuntu:~# usermod -d /data/sftp/sftpuser01 sftpuser01
```

##	4.编辑配置文件
> 编辑 /etc/ssh/sshd_config 
> 


```zsh
# 使用vi/vim 编辑文件
vim /etc/ssh/sshd_config
# 1.配置基本的ssh远程登录配置
# 开启验证
PasswordAuthentication yes
# 禁止空密码登录
PermitEmptyPasswords no
# 开启远程登录
PermitRootLogin yes

# 2.配置 sftp 使用系统自带的 internal-sftp 服务
# 注释掉下面这行
# Subsystem sftp        /usr/lib/openssh/sftp-server
Subsystem sftp internal-sftp


# Subsystem
# 配置到这你即可以使用帐号 ssh 登录，也可以使用 ftp 客户端 sftp 登录。
# 如果希望用户只能 sftp 而不能 ssh 登录到服务器，而且要限定用户的活动目录继续配置

# 4.对登录用户的限定 
# Match Group sftp-users这一行是指定以下的子行配置是匹配sftp用户组的，多个用户组用英文逗号分隔。
# Match [User|Group] sftp 这里是对登录用户的权限限定配置 Match 会对匹配到的用户或用户组起作用 且高于 ssh 的通项配置
Match Group sftp
# 还可以用 %h代表用户home目录 %u代表用户名
# ChrootDirectory /%h/%u
# ChrootDirectory %h该行指定Match Group行指定的用户组验证后用于chroot环境的路径，也就是默认的用户目录，比如/home/admin；也可以写明确路径，例如/data/sftp/sftpuser01。
ChrootDirectory /data/sftp/sftpuser01

# 强制使用系统自带的 internal-sftp 服务 这样用户只能使用ftp模式登录
# ForceCommand internal-sftp该行强制执行内部sftp，并忽略任何~/.ssh/rc文件中的命令。

ForceCommand internal-sftp 
# 设置是否允许tcp端口转发，保护其他的tcp连接
AllowTcpForwarding no 
# 设置是否允许 x11转发
X11Forwarding no


# 使用:wq保存
:wq
```

##	5.修改用户组用户目录权限
>	修改sftp用户组用户目录权限
```zsh
# 1、修改权限为root用户拥有
chown root /data/sftp/sftpuser01
# 2、修改权限为root可读写执行，其它用户可读
chmod 755 /data/sftp/sftpuser01
# 在用户目录下建立子目录，让sftp中的用户可读写文件
# 我们在/data/sftp/sftpuser01目录下新建一个upload和upload文件夹：
cd /data/sftp/sftpuser01
mkdir upload
mkdir download
# 3、授权upload文件夹读写，让子文件夹属于 sftpuser01
chown sftpuser01 /data/sftp/sftpuser01/upload
chown sftpuser01 /data/sftp/sftpuser01/download
# 4、让子文件夹upload被sftpuser01读写
chmod 755 /data/sftp/sftpuser01/upload
chmod 755 /data/sftp/sftpuser01/download
```

##	6.重启服务登陆sftp测试
```zsh
# 配置完成 重启 sshd 服务
service sshd restart
# systemctl restart sshd.service
# centos7重启ssh的命令是sudo systemctl restart sshd.service
# sudo service ssh restart

# sftp 用户名@ip地址。
root@VM-16-8-ubuntu:/# sftp sftpuser01@127.0.0.1
sftpuser01@127.0.0.1's password:
Connected to 127.0.0.1.
sftp> ls
download  upload
sftp> ls -la
drwxr-xr-x    4 root     root         4096 Mar 23 02:37 .
drwxr-xr-x    4 root     root         4096 Mar 23 02:37 ..
drwxr-xr-x    2 sftpuser01 root         4096 Mar 23 02:37 download
drwxr-xr-x    2 sftpuser01 root         4096 Mar 23 02:37 upload
sftp> exit
```

1、 chroot 路径上的所有目录，所有者必须是 root，权限最大为 0755，这一点必须要注意而且符合 所以如果以非 root 用户登录时，我们需要在 chroot 下新建一个登录用户有权限操作的目录

2、chroot 一旦设定 则相应的用户登录时会话的根目录 "/" 切换为此目录，如果你此时使用 ssh 而非 sftp 协议登录，则很有可能会被提示：

/bin/bash: No such file or directory
这则提示非常的正确，对于此时登录的用户，会话中的根目录 "/" 已经切换为你所设置的 chroot 目录，除非你的 chroot 就是系统的 "/" 目录，否则此时的 chroot/bin 下是不会有 bash 命令的，这就类似添加用户时设定的 -s /bin/false 参数，shell 的初始命令式 /bin/false 自然就无法远程 ssh 登录了

ForceCommand 强制用户登录会话时使用的初始命令 如果如上配置了此项 则 Match 到的用户只能使用 sftp 协议登录，而无法使用 ssh 登录 会被提示

This service allows sftp connections only.


注意：

1、chroot 可能带来的问题，因为 chroot 会将会话的根目录切换至此，所以 ssh 登录很可能会提示 /bin/bash: No such file or directory 的错误，因为此会话的路径会为 chroot/bin/bash

2、ForceCommand 为会话开始时的初始命令 如果指定了比如 internal-sftp，则会提示 This service allows sftp connections only. 这就如同 usermod -s /bin/false 命令一样，用户登录会话时无法调用 /bin/bash 命令，自然无法 ssh 登录服务器

原文来自：https://www.linuxidc.com/Linux/2019-01/156465.htm
本文地址：https://www.linuxprobe.com/ssh-sftp-configuration.html

