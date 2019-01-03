---
layout: post
title: mxnet编译的一些问题
date: 2018-12-13
categories: [python]
tags: python
---
<!--more-->

之前用mxnet的时候觉得非常的方便，最近用pytorch用的比较多，但是感觉pytorch调cuda没有mxnet调cuda方便，所以就又找了一下之前学mxnet的时候，然后又在自己的pc上重装了mxnet,然后这次遇到了问题，可能之前我也遇到了，但是都解决了，就没有记下来，这次打算得全部记下来。

### 做准备

安装各种需要的软件

```
sudo apt-get update
sudo apt-get install -y build-essential git

```

* math 

```
sudo apt-get install -y libopenblas-dev

```
* opencv

```
sudo apt-get install -y libopencv-dev

```

如果在CPU上运行下面的

```
git clone --recursive https://github.com/apache/incubator-mxnet.git
cd incubator-mxnet
echo "USE_OPENCV = 1" >> ./config.mk
echo "USE_BLAS = openblas" >> ./config.mk
make -j $(nproc)


```

如果是在GPU上，运行下面的

```
git clone --recursive https://github.com/apache/incubator-mxnet.git
cd incubator-mxnet
echo "USE_OPENCV = 1" >> ./config.mk
echo "USE_BLAS = openblas" >> ./config.mk
echo "USE_CUDA = 1" >> ./config.mk
echo "USE_CUDA_PATH = /usr/local/cuda" >> ./config.mk
echo "USE_CUDNN = 1" >> ./config.mk
make -j $(nproc)
```

注意如果要调cuda的话，还要加一个cuda运行时的

`echo "ENABLE_CUDA_RTC = 1" >> ./config.mk`

然后再编译。

### 问题
编译的时候可能第一行就会出现

`INFO nvcc was not on your path`之类的东西，其实这个不是问题，这个只是Makefile里面的一个提示语句，原因是因为没有指定nvcc的路径，但是其实只要指定了cuda的路径的话这个其实就没有事儿，因为Makefile里面会从cuda路径里面去找nvcc。

编译完了之后再安装

```
export LD_LIBRARY_PATH=$PWD/lib

cd python
$ pip install -e .

```
