---
layout: post
title: 第K大的数
date: 2021-08-23
categories: [leetcode]
tags: leetcode
---

[215. 数组中的第K个最大元素](https://leetcode-cn.com/problems/kth-largest-element-in-an-array/)   <font color=goldenrod>中等</font>
```
题目：
  给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。
  请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。
示例 1:
  输入: [3,2,1,5,6,4] 和 k = 2
  输出: 5
```
**基于快排（partition）**
```
class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        l = 0
        r = len(nums) - 1
        target = len(nums) - k
        while l < r:
            mid = self.partition(nums, l , r)
            if mid == target:
                return nums[mid]
            elif mid > target:
                r = mid - 1
            else:
                l = mid + 1
        return nums[l]

    def partition(self, nums, l, r):
        i = l + 1
        j = r
        while True:
            while i < r and nums[i] <= nums[l]:
                i += 1
            while l < j and nums[j] >= nums[l]:
                j -= 1
            if i >= j:
                break
            nums[i], nums[j] = nums[j], nums[i]
        nums[l], nums[j] = nums[j], nums[l]
        return j
```
