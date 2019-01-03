---
layout: post
title: python-collections包的使用
date: 2018-10-01
categories: [python]
tags: python
---
<!--more-->

在有时候看代码时，常会见到别人用了collections,好像挺方便的，然后自己也总结一下，有时候说不定就会用到了。

### Counter

是一个简单的计数器，用来统计字符出现的个数，见下面的例子。

```


from collections import Counter 
c = Counter()
for item in 'happy new year':
    c[item]=c[item]+1

print(c)

```

结果是
```
Counter({'p': 2, 'y': 2, ' ': 2, 'e': 2, 'a': 2, 'r': 1, 'h': 1, 'n': 1, 'w': 1})

```

那如果想要用c呢，其实c是个字典。可以用 `isinstance(c, dict)`来看一下它

也可以用下面的办法来查看数字出现的次数

```
from collections import Counter

c = Counter()
for i in range(10):
    c[i]=c[i]+1

print(c）
```

其实自己写一个统计的也不难，但是有了这个之后就更加地方便了，使得代码更加的整洁。

### OrderedDict

顾名思义，通常的dict是无序的，特别是在迭代的时候无法确定key的顺序，那么用这个的话就会使得key是有序的了，但是这个序并不是key本身的序，而是插入的顺序。
比如

```
from collections import OrderedDict
d = dict(zip(range(10), range(0,20,2)))

od = Orderdict(zip(range(10), range(0,20,2)))

print(d)
print(od)

```

### defaultdict

使用dict，如果key不存在时，就会报keyerror, 但是如果希望key不存在时，返回一个default的值的话，那么这时候就可以用defaultdict。
其实dict里面有个函数get和这个类似，看具体的场合吧。

```
from collections import defaultdict

dd = defaultdict(lambda: "N/A")
dd['1'] = 20
print(dd['2'])

```
上面的这几个都是我目前见到别人用过的。





