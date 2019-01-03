---
layout: post
title: torch的dataloader中的‘pin_memory’指的是什么
date: 2019-01-01
categories: [torch]
tags: torch
---
<!--more-->

在用dataloader加载数据的时候，发现有的时候会加'pip_memory=True'有时候是'False'，就好奇的查了一下，也找了一些资料关于这方面的介绍的。


首先是关于pin_memory的介绍

### cuda 笔记中的

主机端存在虚拟内存，主机内存不足是会将内存数据交换到虚拟内存中，虚拟内存就是主机中的磁盘空间，需要该页时再重新从磁盘加载回来。这样做可以使用比实际内存更大的内存空间。

锁页内存允许GPU上的MDA控制器在使用主机内存时不用CPU参与。GPU上的显存都是锁页的，因为GPU上的内存时不支持交换到磁盘的。锁页内存就是分配主机内存时锁定该页，让其不与磁盘交换。

CUDA中锁页内存的使用可以使用CUDA驱动API（ driver API’s）cuMemAllocHost()或者使用CUDA的运行时API（runtime API）中的cudaMallocHost()。除此之外还可以直接用主机上Malloc()分配的空间，然后将其注册为锁页内存（使用cudaHostRegister()函数完成注册）。

使用锁页内存的好处有以下几点：

1.设备内存与锁页内存之间的数据传输可以与内核执行并行处理。

2.锁页内存可以映射到设备内存，减少设备与主机的数据传输。

3.在前端总线的主机系统锁页内存与设备内存之间的数据交换会比较快；并且可以是write-combining的，此时带宽会跟大。

如果要所有的线程都可以使用锁页内存的好处，需要在分配时将cudaHostAllocPortable标志传给cudaMallocHost()，或者将cudaHostRegisterPortable标志传给函数cudaHostRegister()

write-combining内存，默认情况下锁页内存时可缓存的，可以再使用cudaMallocHost()函数时使用cudaHostAllocWriteCombined标志声明为write-combining的，write-combining内存没有一二级缓存，这样其他的应用可拥有更多的缓存资源。此外write-combining在PCI总线的系统中没有snooped过程，可以获得高达40%的传输加速。但是从主机读取write-combining内存速度很慢，因此应该用于主机端只写的数据。

要讲锁页内存映射到设备内存的地址空间还需要在cudaMalloHost()中使用cudaHost- AllocMapped标志，或者在用cudaHostRegister()函数注册时使用标志cudaHostRegisterMapped

用来分配一块被映射到设备内存空间的锁页内存。这样的锁页内存会有两个内存地址：主机上的内存地址和设备上的内存地址。主机内存地址直接由函数cudaMallocHost()或Malloc()返回，设备内存地址则由函数cudaHostGetDevicePointer()查询，用以在kernel中访问锁页内存。

### pytorch中的这个

pin_memory就是锁页内存，创建DataLoader时，设置pin_memory=True，则意味着生成的Tensor数据最开始是属于内存中的锁页内存，这样将内存的Tensor转义到GPU的显存就会更快一些。

主机中的内存，有两种存在方式，一是锁页，二是不锁页，锁页内存存放的内容在任何情况下都不会与主机的虚拟内存进行交换（注：虚拟内存就是硬盘），而不锁页内存在主机内存不足时，数据会存放在虚拟内存中。

而显卡中的显存全部是锁页内存！

当计算机的内存充足的时候，可以设置pin_memory=True。当系统卡住，或者交换内存使用过多的时候，设置pin_memory=False。因为pin_memory与电脑硬件性能有关，pytorch开发者不能确保每一个炼丹玩家都有高端设备，因此pin_memory默认为False。
