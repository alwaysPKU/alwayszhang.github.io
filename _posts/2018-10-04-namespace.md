---
layout: post
title: c++之namespace
date: 2018-10-04 22:55 +0800
categories: [c++]
tags: c++
---
<!--more-->

命名空间主要适用于不同的班级中可能有多个小明，然后在调用的时候为了防止搞混，所以用命名空间加以约束。

* 定义namespce

```
namespace namespace_name {

}
```

调用的时候就可以这样调用 

```
namespace_name::code  //code可以是变量也可以是函数
std::cout
```
正如上面所说，一个代码中可以定义多个同名的函数，当他们在不同的命名空间中时，就需要通过

```
first_space::func();
second_space::func();
```
这种方式来指定调用的是具体的哪一个空间中的函数。

* using 指令
经常会见到

```
using namespace std;
```

这实际上是告诉编译器，后面都会使用std这个namespace，这个```using namespace name;```也可以放在代码的中间，这时候其后续的代码将使用这个指定的命名空间。
* 命名空间可以嵌套

```
namespace namespace_name1{

    namespace namespace_name2{
    
    }
}
```

使用的时候可以这样

```
using namespace namespace_name1::namespace_name2;
```
