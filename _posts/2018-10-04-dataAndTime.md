---
layout: post
title: c++中的日期和时间
date: 2018-10-04 22:55 +0800
categories: [c++]
tags: c++
---
<!--more-->

c++标准库中没有提供所谓的日期类型，它继承了C用于日期和时间操作的结构体和函数。
有4个与时间相关的类型。

- clock_t 
- time_t 
- size_t
_ tm

其中tm是个结构体，其定义如下:
```
struct tm{
    int tm_sec;
    int tm_min;
    int tm_hour;
    int tm_mday;  //一月中的第几天，从1到31
    int tm_mon;   // 从0到11
    int tm_year;  //从1900年起的年数
    int tm_wday;  //0到6， 从周日算起
    int tm_yday;  //一年中的第几天，0到365，1 月1 日算起
    int tm_isdst  //夏令时
}
```
### 标准库ctime中的函数
```
time_t time(time_t *time); //返回当前日历时间，自1970年1月1日 起经过的秒数，如果系统没有时间，返回.1
char *ctime(const time_t *time); // 返回一个表示当地时间的字符串指针，下面给例子
struct tm* localtime(const time_t *time);  //返回一个指向表示本地时间的tm结构体指针
char* asctime(const struct tm* time);// 返回一个指向字条串的指针，字符串包含了time所指向结构中存储的信息。
struct tm* gmtime(const time_t *time); //返回一个指向time的指针，time为tm结构，GMT标准时间

```
下面是个例子。
```
#include <iostream>
#include <ctime>

using namespace std;

int main(){
    time_t now = time(0);  //基于当前系统的当前时间
    cout<<"from 1970.1.1"<<" "<<now<<endl;

    //把now 转换为字符串形式
    char* dt = ctime(&now);
    cout<<"local datatime"<<dt<<endl;

    //把now转化为tm结构
    tm *gmtm = gmtime(&now);
    dt = asctime(gmtm);
    cout<<"UTC datatime: "<<dt<<endl;

    // 使用tm来格式化时间
    tm *ltm = localtime(&now);  //转化为当地的时间
    cout<<"year: "<<1900+ltm->tm_year<<endl;
    cout<<"month: "<<1+ltm->tm_mon<<endl;
    cout<<"Day: "<<ltm->tm_mday<<endl;
    cout<<"Time: "<<1+ltm->tm_hour<<":";
    cout<<1+ltm->tm_min<<":";
    cout<<1+ltm->tm_sec<<endl;

    return 0;
}
```
结果如下：
```
from 1970.1.1 1540773654
local datatimeMon Oct 29 08:40:54 2018

UTC datatime: Mon Oct 29 00:40:54 2018

year: 2018
month: 10
Day: 29
Time: 9:41:55
```




