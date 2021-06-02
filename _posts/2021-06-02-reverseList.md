---
layout: post
title: 反转链表
date: 2021-06-02
categories: [leetcode]
tags: leetcode
---

### 反转链表
[206.反转链表](https://leetcode-cn.com/problems/reverse-linked-list/)
##### 1.基基础方法
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
### 反转链表II
[92.反转链表 II](https://leetcode-cn.com/problems/reverse-linked-list-ii/submissions/)
#### 1. 基础方法
```
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseBetween(self, head: ListNode, left: int, right: int) -> ListNode:
        before_head = ListNode(-1)
        before_head.next = head
        pre = before_head
        for _ in range(left - 1):
            pre = pre.next
        cur = pre.next
        for _ in range(right - left):
            next = cur.next
            cur.next = next.next
            next.next = pre.next
            pre.next = next
        return before_head.next
```
