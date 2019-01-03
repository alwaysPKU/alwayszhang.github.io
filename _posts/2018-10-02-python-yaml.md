---
layout: post
title: python妙用'config.yml'
date: 2018-10-01
categories: [python]
tags: python
---
<!--more-->

之前写模型时总是纠结于各种参数，一直在想要是有一个文件就专门写参数的话，到时候统一管理起来也方便，比如如果有一个前端的界面是提供给别人看的，那么这种功能就很有需要了。

现在发现用'config.yml'可以实现这样的一种功能，感觉这个就像c++中的头文件的感觉。

不过这只是一种，这种方便在于后端的经常会要用`config.yml`，其实写一个类也可以实现，然后所有的参数都放到这个类里面去，就可以了。


### 先一个config.yml

```
a: 1
b: 2
c: 3
d: 4
e: 5

x: 
    x1: 3
    x2: 4


```

最后一个x是个字典
### 再写一个demo_config.py

```

import yaml
from easydict import EasyDict as edict
def Config(filename):
    with open(filename, "r") as f:
        #print(yaml.load(f))
        parser = edict(yaml.load(f))
        print(parser)
    for x in parser:
        print('{}:{}'.format(x, parser[x]))
    
    return parser
    

parser = Config("config.yml")
print(parser.a, parser['a'])

```

注意 `yaml.load(f)`load 一次就可以了，再`load`时就为空了好像。

这样的话只要把常用的参数在这个配置文件里面写好，用的时候调用这个函数就可以了。而且改着也方便。

上面的运行结果是这样的

```
{'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'x': {'x1': 3, 'x2': 4}}
a:1
b:2
c:3
d:4
e:5
x:{'x1': 3, 'x2': 4}
1 1


```


