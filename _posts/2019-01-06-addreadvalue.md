---
layout: post
title: github pages添加阅读量
date: 2019-01-06
categories: [github]
tags: github
---
<!--more-->

# github pages添加阅读量

标签： github

---

```前提是已经搭建好github pages```

 

 ### 注册LeanCloud
 ### 创建应用，申请appid和appkey
 ### 创建一个class，随便起名，例如Counter
 ### 修改代码
 ##### 1. _config.yml文件
 ```
leancloud:
  enable: true
  app_id: your_id
  app_key: your_key
 ```
 
 ##### 2.添加include/leancloud-analytics.html
 
 ```
 {% if site.leancloud.enable %}

<script src="https://code.jquery.com/jquery-3.2.0.min.js"></script>
<script src="https://cdn1.lncld.net/static/js/av-core-mini-0.6.1.js"></script>
<script>AV.initialize("{{site.leancloud.app_id}}", "{{site.leancloud.app_key}}");</script>
<script>
    function showHitCount(Counter) {
        var query = new AV.Query(Counter);
        var entries = [];
        var $visitors = $(".leancloud_visitors");
        $visitors.each(function () {
            entries.push( $(this).attr("id").trim() );
        });
        query.containedIn('url', entries);
        query.find()
                .done(function (results) {
                    console.log("results",results);
                    var COUNT_CONTAINER_REF = '.leancloud-visitors-count';
                    if (results.length === 0) {
                        $visitors.find(COUNT_CONTAINER_REF).text(0);
                        return;
                    }
                    for (var i = 0; i < results.length; i++) {
                        var item = results[i];
                        var url = item.get('url');
                        var hits = item.get('hits');
                        var element = document.getElementById(url);
                        $(element).find(COUNT_CONTAINER_REF).text(hits);
                    }
                    for(var i = 0; i < entries.length; i++) {
                        var url = entries[i];
                        var element = document.getElementById(url);
                        var countSpan = $(element).find(COUNT_CONTAINER_REF);
                        if( countSpan.text() == '') {
                            countSpan.text(0);
                        }
                    }
                })
                .fail(function (object, error) {
                    console.log("Error: " + error.code + " " + error.message);
                });
    }
    function addCount(Counter) {
        var $visitors = $(".leancloud_visitors");
        var url = $visitors.attr('id').trim();
        var title = $visitors.attr('data-flag-title').trim();
        var query = new AV.Query(Counter);
        query.equalTo("url", url);
        query.find({
            success: function(results) {
                if (results.length > 0) {
                    var counter = results[0];
                    counter.fetchWhenSave(true);
                    counter.increment("hits");
                    counter.save(null, {
                        success: function(counter) {
                            var $element = $(document.getElementById(url));
                            $element.find('.leancloud-visitors-count').text(counter.get('hits'));
                        },
                        error: function(counter, error) {
                            console.log('Failed to save Visitor num, with error message: ' + error.message);
                        }
                    });
                } else {
                    var newcounter = new Counter();
                    /* Set ACL */
                    var acl = new AV.ACL();
                    acl.setPublicReadAccess(true);
                    acl.setPublicWriteAccess(true);
                    newcounter.setACL(acl);
                    /* End Set ACL */
                    newcounter.set("title", title);
                    newcounter.set("url", url);
                    newcounter.set("hits", 1);
                    newcounter.save(null, {
                        success: function(newcounter) {
                            var $element = $(document.getElementById(url));
                            $element.find('.leancloud-visitors-count').text(newcounter.get('hits'));
                        },
                        error: function(newcounter, error) {
                            console.log('Failed to create');
                        }
                    });
                }
            },
            error: function(error) {
                console.log('Error:' + error.code + " " + error.message);
            }
        });
    }
    $(function() {
        var Counter = AV.Object.extend("Counter");
        if ($('.leancloud_visitors').length == 1) {
            // in post.html, so add 1 to hit counts
            addCount(Counter);
        } else if ($('.post-link').length > 1){
            // in index.html, there are many 'leancloud_visitors' and 'post-link', so just show hit counts.
            showHitCount(Counter);
        }
    });
</script>
{% endif %}
```


##### 3._layouts/default.html
添加
```{% include leancloud-analytics.html %}```

##### 4._layouts/post.html
添加
```html
{% if site.leancloud.enable %}
       <span id="{{ page.url }}" class="leancloud_visitors" data-flag-title="{{ page.title }}">
        <span class="post-meta-divider">|</span>
        <span class="post-meta-item-text"> Hits:  </span>
        <span class="leancloud-visitors-count"></span>
       </span>
{% endif %}
```
 
reference:

[1][在个人博客中添加文章点击次数](https://blog.csdn.net/u013553529/article/details/63357382)

[2][github](https://github.com/galian123/galian123.github.io)
