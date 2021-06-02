---
layout: post
title: 反转链表
date: 2021-06-02
categories: [leetcode]
tags: leetcode
---

### 反转链表
[206.反转链表](https://leetcode-cn.com/problems/reverse-linked-list/)
##### 1.基本方法
```
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseList(self, head: ListNode) -> ListNode:
        pre = None
        cur = head
        while cur:
            tmp = cur.next
            cur.next = pre
            pre = cur
            cur = tmp
        return pre

```
