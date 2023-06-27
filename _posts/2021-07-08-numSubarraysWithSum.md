---
layout: post
title: 和相同的二元子数组
date: 2021-07-08
categories: [leetcode]
tags: leetcode
---


[930.和相同的二元子数组](https://leetcode-cn.com/problems/binary-subarrays-with-sum/)
```
from collections import defaultdict
class Solution:
    def numSubarraysWithSum(self, nums: List[int], goal: int) -> int:
        sum = 0
        order_map = defaultdict(int)
        res = 0
        for num in nums:
            order_map[sum] += 1
            sum += num
            res += order_map[sum - goal]  #解释sum[j]-goal=sum[i] 所以有多少个sum[i]即加上去
        return res
```
