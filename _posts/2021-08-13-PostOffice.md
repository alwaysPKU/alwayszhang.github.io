---
layout: post
title: 邮局选址【DP】
date: 2021-08-13
categories: [leetcode]
tags: leetcode
---

嬴彻 笔试题目
POJ 1160 Post Office (区间dp，从n个村庄选m个点建邮局，使得每个村庄到邮局的距离和最小)
```
题目：
  一条直线上有居民点，邮局只能建在居民点上。给定一个有序整形数组arr，每个值表示居民点的一维坐标，再给定一个正数num，表示邮局数量。
  选择num个居民点建立num个邮局，使所有的居民点到邮局的总距离最短，返回最短的总距离。
输出描述：
  输出一个整数表示答案
  
示例：
  输入：
    6 2
    1 2 3 4 5 1000
  输出：
    6
  说明：
    第一个邮局建立在3位置，第二个邮局建立在1000位置。那么1位置到邮局的距离为2,2位置到邮局距离为1,3位置到邮局的距离为0，4位置到邮局的距离为1,5位置到邮局的距离为2,1000位置到邮局的距离为0.
  这种方案下的总距离为6。
 
```

**<font color=Green>Ans:</font>**
```
题解：
  设dp[i][j]表示前i个村庄建j个邮局的最小距离和。

  先预处理对于每个区间建一个邮局的最小距离和。设dis[i][j]表示在区间[i][j]建一个邮局的最小距离和。dis[i][j]=dis[i][j-1]+a[j]-a[(i+j)/2].因为建一个邮局的话，显然建立在中位数上是最优的，画个图就明了了。多一个村庄，虽然邮局的位置可能变了，但是前i-1个距离之和是不变的。所以多出了的距离就是第j个村庄到邮局的距离。

  考虑加一个邮局：
  前k个村庄建j-1个邮局，在第k+1个村庄到第i个村庄之间建一个邮局。
  dp[i][j]=max{dp[k][j-1]+dis[k+1][j]}，k是决策。取值范围为[j-1,i-1].

```

```
#include <cstdio>
#include <algorithm>
#include <cstring>
#include <iostream>
#define INF 0x3f3f3f3f
using namespace std;

const int maxn=330;
int dp[maxn][maxn];
int a[maxn];
int dis[maxn][maxn];//dis[i][j]表示在第i个村和第j个村之间建一个邮局的“代价”

int main()
{
    int n,m;
    while(~scanf("%d%d",&n,&m))
    {
        for(int i=1;i<=n;i++)
            scanf("%d",&a[i]);
        //预处理dis[i][j]
        for(int i=1;i<=n;i++)
            for(int j=i+1;j<=n;j++)
        {

            //显然在[i,j]放一个邮局，放在最中间是最优的
            dis[i][j]=dis[i][j-1]+a[j]-a[(i+j)/2];
        }
        for(int i=1;i<=n;i++)
        {
            dp[i][i]=0;
            dp[i][1]=dis[1][i];
        }
        for(int j=2;j<=m;j++)
        {
            for(int i=j+1;i<=n;i++)
            {
                dp[i][j]=INF;
                for(int k=j-1;k<i;k++)
                {
                    dp[i][j]=min(dp[i][j],dp[k][j-1]+dis[k+1][i]);
                }
            }
        }
        printf("%d\n",dp[n][m]);
    }
    return 0;
}

```
————————————————

[原文链接](https://blog.csdn.net/qq_37685156/article/details/81158864)
