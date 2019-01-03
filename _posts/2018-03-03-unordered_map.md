---
layout: post
title: unordered_map
date: 2018-03-03
categories: [c++]
tags: c++
---
<!--more-->


### static

首先明白map 和unordered_map是有差别的，map内部实现了一个红黑树， 该结构肯有自动排序的功能，因此map内部的所有元素都是有序的，而unordered_map内部实现了一个哈希表，因此其元素的排列顺序是杂乱的，无序的。

基本的用法如下


```

#include <iostream>
#include <unordered_map>
#include <algorithm>
#define N 20
using namespace std;
//重定义一个好用的名字
typedef std::unordered_map<std::string, std::string> stringMap;
int main(){
    // 构造方式
    stringMap firstMap;   //空的
    stringMap secondMap ( { {"apple", "red"},{"lemon", "yellow"} } ); //
    stringMap thirdMap (secondMap); //直接初始化成secondMap;
    //还可以以另外一个的一部分来进行初始化
    stringMap fifth (secondMap.begin(), secondMap.end());
    //判断是否为空，以及大小
    cout<<secondMap.empty()<<endl;
    cout<<secondMap.size()<<endl;
    //获得value
    cout<<secondMap["apple"] <<endl;
    // count返回的值不是0就是1，是1的话说明有这个key。
    cout<<secondMap.count("apple")<<endl;
    //再试一下
    unordered_map<int, int> dict;
    for(int i=0;i<N;i++){
        dict[i] = -1*i;
    }   
    cout<<dict.size()<<endl;
    cout<<dict[3]<<endl;
    cout<<dict.at(3) <<endl;   
    // 查找，除了上面的count可以判断是否有key的话
    unordered_map<int, int>::iterator it; 
    it = dict.find(5);    //find是根据key来find的，
    if(it != dict.end()){
        cout<<(*it).first<<(*it).second<<endl;
    }   
    return 0;
}


```

