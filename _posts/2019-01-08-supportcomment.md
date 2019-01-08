---
layout: post
title: jekyll支持latex公式
date: 2019-01-08
categories: [拾遗]
tags: 拾遗
---
<!--more-->

标签： 拾遗

---

```要借助leancloud平台```

 1. 注册leancloud
 2. 新建应用，名字任取
 3. 创建class，可取名comment，默认配置即可
 4. include/comments.html添加代码
 
 ```html
 <script src="//cdn1.lncld.net/static/js/3.0.4/av-min.js"></script>
    <script src='//unpkg.com/valine/dist/Valine.min.js'></script>
<div id="comment"></div>
    
<script>
    var valine = new Valine();
    valine.init({
        el:'#comment',
        appId:'App ID',//leancloud里找
        appKey:'App Key',//leancloud里找
        notify:true,
        path: '{{ page.url }}',
        placeholder:'默认评论'
    })
</script>
```


