---
layout: post
title: python magic method
date: 2018-10-08 11：55 +0800
categories: [python]
tags: python
---
<!--more-->

这次总结一下关于python的"__init__"这一类函数。
### __init__
这个就是在对象初始化的时候会调用，可以选择实现，也可以选择不实现，最好还是实现。

### __str__
这个相当于是直接打印对象的实现方法，需要返回一个str对象
比如

```
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age 
    
    def __str__(self):
        return "my name is %s and I am %d years old" %(self.name, self.age)


a = Student("lisi", 20) 
print(a)

```

输出的结果就是
```
my name is lisi and I am 20 years old
```

### "__call__"
这个函数超级好，可以让对象像个函数一样，也更好的理角了一切都是对象这句话。

```
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age 
    
    def __str__(self):
        return "my name is %s and I am %d years old" %(self.name, self.age)
    
    def __call__(self, x): 
        print("who call me? %s"%x)
    

a = Student("lisi", 20) 
a("lisi")


```

结果为``` who call me? lisi```

### "__getitem__"
这个可以让函数通过下标的方式来访问某些内容


```
lass Student:
    def __init__(self, name, age, data):
        self.name = name
        self.age = age
        self.data = data

    def __str__(self):
        return "my name is %s and I am %d years old" %(self.name, self.age)

    def __call__(self, x):
        print("who call me? %s"%x)

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        assert 0<=idx and idx<len(self.data)
        return self.data[idx]
a = Student("lisi", 20, range(100))
a("lisi")
print(len(a))
for i in range(len(a)):
    print a[i]           

```

### "__setitem__"

这个可以像字典或者列表一样改变或者赋值

```
class Student:
    def __init__(self, name, age, data):
        self.name = name
        self.age = age 
        self.data = data
    
    def __str__(self):
        return "my name is %s and I am %d years old" %(self.name, self.age)
    
    def __call__(self, x): 
        print("who call me? %s"%x)
    
    def __len__(self):
        return len(self.data)
    
    def __setitem__(self, idx, value):
        assert 0<= idx and idx <len(self.data)
        self.data[idx] = value 
    def __getitem__(self, idx):
        assert 0<=idx and idx<len(self.data)
        return self.data[idx]
a = Student("lisi", 20, range(100))
a("lisi")
print(len(a))
print a[0]
a[0] = 7 
print a[0]


```

结果为

```
who call me? lisi
100
0
7
```

### “__delitem__”
这个是支持以下标的方式删除对象，实现了上面的三个函数之后就可以像字典一样的操作了。这些是在数据准备的时候常用到的函数。

### “__setattr__” 和"__getattr__"
这两个函数和"__setitem__"“__getitem__”非常相似，主要差别是这两个是通过"."来操作的，不是通过下标"index"来访问的。不需要长度之类的。

### "__iter__"

这个是迭代器要实现的一个方法，有了这个之后我们就可以自己定义一个迭代器了。