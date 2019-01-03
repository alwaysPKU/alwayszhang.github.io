---
layout: post
title: C++中的引用
date: 2018-10-27 11：55 +0800
categories: [c++]
tags: c++
---
<!--more-->

### 概述
引用一般指的是左值引用，引用实际上一种隐式指针，为对象建立了一个别名，能过&来实现。那么既然是别名，那么对引用的操作就和对来来对象的操作完全一样。
###注意
* 一个c++引用被初始化后，不能再将它去引用另外一个对象。
* 刚才已经说了，引用只是其他对象的别名，对它的操作与原来对象的操作具有相同的作用。
* 指针变量和引用的区别，后面会将
* 引用应该初始化
### 引用传递参数
在C++中函数参数传递的方式主要有两种，值传递和引用传递。值传递就是在函数调用时，将实际参数的值copy一份到调用函数中，这样有个好处是在函数中修改了参数的值，并不会改变实际参数的值
比如见下面的例子。
![avator](/images/reference1.png)
运行结果如下
![avator](/images/reference2.png)
可以看出来，尽管在函数里面改变了传进来的参数的值，但是实际上参数的值并没有改变。
这样感觉还挺安全的。
现在立即可以想到，如果在函数传递参数的时候，传进来的如果是个非常大的东西那，那进行值传递的时候岂不是多了很多的开销。为了解决这个问题，可以有两种办法，一种是传传递指针，一种是传引用。

先来看传指针
![avator](/images/reference3.png)
![avator](/images/reference4.png)
说明参数实际的值也被改了。
再来看传引用
![avator](/images/reference6.png)
![avator](/images/reference5.png)

### 指针和引用的区别
这个在面试的时候经常遇到，比如引用必须初始化，指针不需要，指针变量是个数据类型，引用不是的。
指针和引用都可以作为函数的返回值，但是要注意引用作为返回值的时候不能是局部变量的引用，但是可以是对一个静态变量的引用。看下面的例子。
```
#include <iostream>
#include <ctime>
using namespace std;

double vals[] = {10.1,11.1,12.1};

//返回引用
double& setValue(int i){
    return vals[i];  //注意这里还是像通常的写法一样
}

int main(){
    cout<<"before value"<<endl;
    for(int i=0;i<3;i++){
        cout<<"value["<<i<<"]="<<" "<<vals[i]<<endl;
    }
    setValue(1) = 300;
    setValue(2) = 40;
    cout<<"after value"<<endl;
    for(int i=0;i<3;i++){
        cout<<"value["<<i<<"]="<<" "<<vals[i]<<endl;
    }
    return 1;

}

```
输出的结果为
```
before value
value[0]= 10.1
value[1]= 11.1
value[2]= 12.1
after value
value[0]= 10.1
value[1]= 300
value[2]= 40
```
还有下面的
```
int& fun(){
    int q;
    // return q;   //这是错误的，因为q是local的
    static int x;
    return x;  //可以的，因为x是静态变量，在函数作用域外依然是有效的。
}
```

