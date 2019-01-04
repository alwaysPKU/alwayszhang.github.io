---
layout: post
title: blog push到远程仓库（github pages）出错
date: 2019-01-03
categories: [github]
tags: github
---
<!--more-->

本地仓库更新blog后，需要远程推送到github仓库。用命令`git push xxx(远程库名字，有的默认origin) master`。但是出现错误。
我怀疑是因为远程仓库被访问后，有些修改，所以需要pull到本地，再push，还没验证。
但是也可以`git push -f xxx master`强制覆盖，反正也是你自己一个人在维护blog，--force也不会有人想要砍死你😎
