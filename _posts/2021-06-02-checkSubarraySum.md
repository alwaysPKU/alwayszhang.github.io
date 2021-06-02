---
layout: post
title: 连续子数组的和
date: 2021-06-02
categories: [leetcode]
tags: leetcode, 动态规划
---

### 连续子数组的和
[523.连续的子数组和](https://leetcode-cn.com/problems/continuous-subarray-sum/)
##### 1.动态规划
```
class Solution:
    def checkSubarraySum(self, nums: List[int], k: int) -> bool:
        pre_sum = {0 : -1}
        tmp = 0
        l = len(nums)
        if l < 2:
            return False
        for i in range(l):
            tmp += nums[i]
            leave = tmp%k
            if leave in pre_sum:
                if i - pre_sum[leave] >= 2:
                    return True
            else:
                pre_sum[leave] = i
        return False
```
