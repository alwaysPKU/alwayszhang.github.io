---
layout: post
title: 相交链表
date: 2021-06-21
categories: [leetcode]
tags: leetcode
---

[160.相交链表](https://leetcode-cn.com/problems/intersection-of-two-linked-lists/)
```
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None

class Solution:
    def getIntersectionNode(self, headA: ListNode, headB: ListNode) -> ListNode:
        P_a = headA
        P_b = headB
        while P_a != P_b:
            P_a = P_a.next if P_a  else headB
            P_b = P_b.next if P_b  else headA
        return P_a
```
