---
layout: post
title: CUDA-version之间的切换
date: 2018-08-04
categories: [CUDA]
tags: CUDA
---
<!--more-->


有时候见到模型需要的cuda的version要求不一样，所以在不同的cuda之间进行切换就很重要。比如目前常用的有

9.2的，9.0的，8.0的。就可以一下子安着三个，然后看具体用哪个在进行相应的切换就可以了，其实质上就是建立不同的软链接。

假设已经用`deb`的安装好了一个cuda之后，下面是下载不同version的runfile格式的进行安装的（见网上是这样介绍的，具体不是runfile的自己没有试过）。

下载好runfile文件之后，执行

```
sudo chmod 777 -R cuda_9.0.176_384.81_linux.run 
sudo ./cuda_9.0.176_384.81_linux.run 

```

然后 一直按着enter读完`更多`，

接下来是这样的

```
Install NVIDIA Accelerated Graphics Driver for Linux-x86_64 384.81?
(y)es/(n)o/(q)uit: n

Install the CUDA 9.0 Toolkit?
(y)es/(n)o/(q)uit: y

Enter Toolkit Location
 [ default is /usr/local/cuda-9.0 ]: 

Do you want to install a symbolic link at /usr/local/cuda?
(y)es/(n)o/(q)uit: n

Install the CUDA 9.0 Samples?
(y)es/(n)o/(q)uit: n

Installing the CUDA Toolkit in /usr/local/cuda-9.0 ...



```

其中可以根据自己的选择，因为我安装了更高的驱动了就选择了n，暂时没有创建软链接是因为等会儿自己想看看具体的操作。

出的结如下

```
===========
= Summary =
===========

Driver:   Not Selected
Toolkit:  Installed in /usr/local/cuda-9.0
Samples:  Not Selected

Please make sure that
 -   PATH includes /usr/local/cuda-9.0/bin
 -   LD_LIBRARY_PATH includes /usr/local/cuda-9.0/lib64, or, add /usr/local/cuda-9.0/lib64 to /etc/ld.so.conf and run ldconfig as root

To uninstall the CUDA Toolkit, run the uninstall script in /usr/local/cuda-9.0/bin

Please see CUDA_Installation_Guide_Linux.pdf in /usr/local/cuda-9.0/doc/pdf for detailed information on setting up CUDA.

***WARNING: Incomplete installation! This installation did not install the CUDA Driver. A driver of version at least 384.00 is required for CUDA 9.0 functionality to work.
To install the driver using this installer, run the following command, replacing <CudaInstaller> with the name of this run file:
    sudo <CudaInstaller>.run -silent -driver

Logfile is /tmp/cuda_install_1976.log


```

现在在 `/usr/local`下面已经有2个了。

`bin  cuda-9.0  cuda-9.2  etc  games  include  lib  man  sbin  share  src`

建立

`sudo ln -s /usr/local/cuda-9.0/ /usr/local/cuda`

就可以看到多了个高亮的`cuda`。

如果想换到其它version，就把这个链接删掉从新建立一个就可以了。

### 之前碰到的一个bug
之前我的pc上碰到了一个这样的bug,即我安装了cuda9.0和cuda9.2也配了环境变量，但是我`nvcc --version`的时候看到的却总是cuda7.5的，后来我想，可能是我在安装torch的时候它里面自己安装了nvidia-cuda-toolkit吧，然后我就在根目录下查找nvcc的文件
`cd /`, `sudo find -name "nvcc"`,然后就出现了有nvcc的地址，
`/usr/bin/nvcc`, '/usr/lib/nvidia-cuda-toolkit/nvcc'， 还有我自己安装的两个,
我把前面的两个全部删除了之后，再建立了一个cuda9.0的软链接'/usr/local/cuda'，然后就能看到cuda的version是`9.0`了。


