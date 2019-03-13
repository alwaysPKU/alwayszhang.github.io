---
layout: post
title: ssh 连接服务器长时间不操作断开问题
date: 2019-03-13
categories: [拾遗]
tags: 拾遗
---
<!--more-->

修改/etc/ssh/sshd_config文件，找到 ClientAliveInterval0和ClientAliveCountMax 3并将注释符号（"#"）去掉,

将ClientAliveInterval对应的0改成60,

ClientAliveInterval指定了服务器端向客户端请求消息的时间间隔, 默认是0, 不发送.

ClientAliveInterval 60表示每分钟发送一次, 然后客户端响应, 这样就保持长连接了.

ClientAliveCountMax, 使用默认值3即可.ClientAliveCountMax表示服务器发出请求后客户端没有响应的次数达到一定值, 就自动断开.正常情况下, 客户端不会不响应.

重起sshd服务：

service sshd restart
