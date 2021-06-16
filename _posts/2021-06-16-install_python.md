---
layout: post
title: 从源码安装python
date: 2021-06-16
categories: [拾遗]
tags: 拾遗
---

### 1. 下载python源码包. [下载python](https://www.python.org/downloads/source/)
### 2. 解压tar zxvf xxx.tar.gz 到当前文件夹(假如路径是/a/b/Python-3.7.0)
### 3. 安装路径 mkdir /a/b/Python3.7(你想要的安装python的路径)
### 4. 安装
1. cd /a/b/Python-3.7.0 
2. 配置： ./configure --prefix=/a/b/Python3.7
3. 编译：make
4. 安装：make install

```
此时你已经吧pyton3.7安装到了/a/b/Python3.7
```
### 5.创建python虚拟环境，方便开发
1. mkdir /a/b/python3.7-virtual/【虚拟环境目录】 && virtualenv -p /a/b/Python3.7/bin/python3 /a/b/python3.7-virtual/
2. 开启虚拟环境 source /a/b/python3.7-virtual/bin/activate
3. 此时，which python 你会发现地址应该是/a/b/python3.7-virtual/bin/python
4. 开启你的专属python开发环境吧。
