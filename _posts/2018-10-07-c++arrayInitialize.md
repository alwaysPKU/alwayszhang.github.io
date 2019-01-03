---
layout: post
title: c和c++中的数组初始化注意
date: 2018-10-06 11：55 +0800
categories: [c++]
tags: c++
---
<!--more-->


本来以为在c 中按下面的两种方式初始化的时候都是0呢，但是测试了之后才知道其实不是的。

```

#include <stdio.h>

int main(){
    int a[9];
    int b[9]={0};

    for(int i=0;i<9;i++){
        printf("a:%d, b:%d \n", a[i],b[i]);
    }   


    return 0;
}


```

测试结果如下

```
a:1835627636, b:0 
a:1600061541, b:0 
a:1869833334, b:0 
a:1952802655, b:0 
a:0, b:0 
a:0, b:0 
a:0, b:0 
a:0, b:0 
a:1, b:0 
pengkun@ubuntu:~$ ./a.out demoarray.c 
a:0, b:0 
a:0, b:0 
a:0, b:0 
a:0, b:0 
a:1835627636, b:0 
a:1600061541, b:0 
a:1869833334, b:0 
a:1952802655, b:0 
a:1, b:0 


```

所以可以看出来b一直都是0,但是a不是的，这是要注意的。


把上面的代码改成

```
#include <stdio.h>
#include <iostream>

int main(){
    int a[9];
    int b[9]={0};
    int *c = new int[9];
    
    for(int i=0;i<9;i++){
        printf("a:%d, b:%d, c:%d \n", a[i],b[i],c[i]);
    }   


    return 0;
}


```


结果如下


```

a:0, b:0, c:0 
a:0, b:0, c:0 
a:65535, b:0, c:0 
a:1, b:0, c:0 
a:1151520240, b:0, c:0 
a:32765, b:0, c:0 
a:4196538, b:0, c:0 
a:0, b:0, c:0 
a:2, b:0, c:0 


```

上面的过程说明了在初始他的时候的三种方式中，第一种并不会全部都初始化为0,而第二种方式和c++中的new方式确实是初始化为0的。


