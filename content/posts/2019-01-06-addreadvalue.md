---
layout: post
title: github pages添加阅读量
date: 2019-01-06
categories: [github]
tags: github
---
<!--more-->

标签： github

---

### 前提是已经搭建好github pages



### 1.注册LeanCloud

### 2.创建应用，申请appid和appkey

### 3.创建一个class，随便起名，例如Counter

### 4.修改代码:


##### 1. _config.yml文件

```
leancloud:
enable: true
app_id: your_id
app_key: your_key
```

##### 2.添加include/leancloud-analytics.html

```
这里本来是一段html代码
但是会执行，册那
```


##### 3._layouts/default.html
添加
```
这里也有代码
```


##### 4._layouts/post.html
添加

```
这里也有代码🤣
```

reference:

[1][在个人博客中添加文章点击次数](https://blog.csdn.net/u013553529/article/details/63357382)

[2][github](https://github.com/galian123/galian123.github.io)
