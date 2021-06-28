---
layout: post
title: pip和easy_install
date: 2021-06-28
categories: [Python]
tags: Python
---

# pip和easy_install

## 介绍
- easy_install和pip都是用来下载安装Python一个公共资源库PyPI 
的相关资源包的，pip是easy_install的改进版，提供更好的提示信 
息，删除package等功能。老版本的python中只有easy_install， 
没有pip。
- easy_install 打包和发布 Python 包
- pip 是包管理

## easy_install
### 安装一个包
easy_install 包名
easy_install “包名 == 版本号”

### 升级一个包
easy_install -U "包名 >= 版本号"

## pip
### 安装一个包
pip install 包名
pip install 包名 == 版本号

### 升级一个包（如果不提供版本号，升级到最新版本）
pip install --upgrade 包名 >= 版本号

### 删除一个包
pip uninstall 包名
