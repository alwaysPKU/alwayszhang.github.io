---
layout: post
title: 链表相关
date: 2021-08-16
categories: [leetcode]
tags: leetcode
---

- 反转类
    - [206.反转链表](https://leetcode-cn.com/problems/reverse-linked-list/) **<font color=green>简单</font>**
    - [92.反转链表 II](https://leetcode-cn.com/problems/reverse-linked-list-ii/submissions/) **<font color=goldenord>中等</font>**
    - [25.K 个一组翻转链表](https://leetcode-cn.com/problems/reverse-nodes-in-k-group/) **<font color=red>困难</font>**
    - [24. 两两交换链表中的节点](https://leetcode-cn.com/problems/swap-nodes-in-pairs/)   **<font color=goldenord>中等</font>**
- 相交类
    - [剑指 Offer II 022. 链表中环的入口节点](https://leetcode-cn.com/problems/c32eOV/)   **<font color=goldenord>中等</font>**
    - [160. 相交链表](https://leetcode-cn.com/problems/intersection-of-two-linked-lists/)   **<font color=green>简单</font>**
- 删除类
    - [剑指 Offer 18. 删除链表的节点](https://leetcode-cn.com/problems/shan-chu-lian-biao-de-jie-dian-lcof/)   **<font color=green>简单</font>**  # 无重复
    - [203. 移除链表元素](https://leetcode-cn.com/problems/remove-linked-list-elements/submissions/)  **<font color=green>简单</font>**  #有重复
    - [19. 删除链表的倒数第 N 个结点](https://leetcode-cn.com/problems/remove-nth-node-from-end-of-list/) **<font color=goldenord>中等</font>**
- 合并类
    - [21. 合并两个有序链表](https://leetcode-cn.com/problems/merge-two-sorted-lists/)  **<font color=green>简单</font>**
    - [23. 合并K个升序链表](https://leetcode-cn.com/problems/merge-k-sorted-lists/)  **<font color=red>困难</font>**

---


### 反转链表 **<font color=green>简单</font>**
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
### 反转链表II  **<font color=goldenrod>中等</font>**
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

### [25.K 个一组翻转链表](https://leetcode-cn.com/problems/reverse-nodes-in-k-group/) **<font color=red>困难</font>**
```
题目：
    给你一个链表，每 k 个节点一组进行翻转，请你返回翻转后的链表。

    k 是一个正整数，它的值小于或等于链表的长度。

    如果节点总数不是 k 的整数倍，那么请将最后剩余的节点保持原有顺序。

```
```
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseKGroup(self, head: ListNode, k: int) -> ListNode:
        res = ListNode(-1)
        res.next = head
        pre = res
        
        while head:
            tail = pre
            for i in range(k):
                tail = tail.next
                if not tail:
                    return res.next

            next = tail.next
            new_head, new_tail = self.reverse(head, tail)
            pre.next = new_head
            new_tail.next = next
            pre = new_tail
            head = new_tail.next
        return res.next

    def reverse(self, head: ListNode, tail: ListNode):  # 用到了反转链表，但是注意while的中止条件不同
        pre = None
        cur = head
        while pre!=tail:
            next = cur.next
            cur.next = pre
            pre = cur
            cur = next
        return tail, head

        
```

### [24. 两两交换链表中的节点](https://leetcode-cn.com/problems/swap-nodes-in-pairs/)   **<font color=goldenord>中等</font>**
```
题目：
    给定一个链表，两两交换其中相邻的节点，并返回交换后的链表。

    你不能只是单纯的改变节点内部的值，而是需要实际的进行节点交换。

```

```
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def swapPairs(self, head: ListNode) -> ListNode:
        pre = ListNode(-1)
        pre.next = head
        res = pre
        cur = head 
        while cur:
            next = cur.next
            cur.next = next.next
            pre.next = next
            next.next = cur
            pre = cur
            cur = cur.next
        return res.next
```

### [剑指 Offer II 022. 链表中环的入口节点](https://leetcode-cn.com/problems/c32eOV/)   **<font color=goldenord>中等</font>**
```
题目：
    给定一个链表，返回链表开始入环的第一个节点。 从链表的头节点开始沿着 next 指针进入环的第一个节点为环的入口节点。如果链表无环，则返回 ：null。

    为了表示给定链表中的环，我们使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 pos 是 -1，则在该链表中没有环。注意，pos 仅仅是用于标识环的情况，并不会作为参数传递到函数中。

    说明：不允许修改给定的链表。
```

```
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None
# 快慢指针，第一次相遇后，让其中一个回到head，然后同步往后走，再次相遇肯定在环入口
class Solution:
    def detectCycle(self, head: ListNode) -> ListNode:
        A = head
        B = head
        
        if not A:
            return None
        if A.next:
            A = A.next
        else:
            return None
        
        if A.next:
            B = A.next
        else:
            return None
        
        while A != B:
            if not B or not B.next or not B.next.next:
                return None
            else:
                A = A.next
                B = B.next.next
        A = head
        while A != B:
            A = A.next
            B = B.next
        return A
```


### [160. 相交链表](https://leetcode-cn.com/problems/intersection-of-two-linked-lists/)   **<font color=green>简单</font>**
```
判定链表是否相交
```

```
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None
# 双指针法，遍历完自己，遍历对方，知道两指针相遇。或者不相遇都是None
class Solution:
    def getIntersectionNode(self, headA: ListNode, headB: ListNode) -> ListNode:
        P_a = headA
        P_b = headB
        while P_a != P_b:
            P_a = P_a.next if P_a  else headB
            P_b = P_b.next if P_b  else headA
        return P_a
```

### [剑指 Offer 18. 删除链表的节点](https://leetcode-cn.com/problems/shan-chu-lian-biao-de-jie-dian-lcof/)  **<font color=green>简单</font>**  #无重复
```
题目：
    给定单向链表的头指针和一个要删除的节点的值，定义一个函数删除该节点。

    返回删除后的链表的头节点。
    注意：此题对比原题有改动
    题目保证链表中节点的值互不相同
```
```
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, x):
#         self.val = x
#         self.next = None
class Solution:
    def deleteNode(self, head: ListNode, val: int) -> ListNode:
        pre = ListNode(-1)
        pre.next = head
        res = pre
        while pre.next.val != val:
            pre = pre.next
        pre.next = pre.next.next
        return res.next
```

### [203. 移除链表元素](https://leetcode-cn.com/problems/remove-linked-list-elements/submissions/)  **<font color=green>简单</font>**  #有重复
```
题目：
    给你一个链表的头节点 head 和一个整数 val ，请你删除链表中所有满足 Node.val == val 的节点，并返回 新的头节点 。
```

```
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def removeElements(self, head: ListNode, val: int) -> ListNode:
        pre = ListNode(-1)
        pre.next = head
        res = pre
        while head:
            if head.val == val:
                pre.next = head.next
                head = pre.next
            else:
                head = head.next
                pre = pre.next
        return res.next
```

### [19. 删除链表的倒数第 N 个结点](https://leetcode-cn.com/problems/remove-nth-node-from-end-of-list/) **<font color=goldenord>中等</font>**
```
题目：
    给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。

    进阶：你能尝试使用一趟扫描实现吗？
```

```
# 双指针
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def removeNthFromEnd(self, head: ListNode, n: int) -> ListNode:
        res = ListNode(-1)
        res.next = head
        left = res
        right = res
        while n > 0:
            right = right.next
            n -= 1
        while right.next:
            right = right.next
            left = left.next
        left.next = left.next.next
        return res.next
```


### [21. 合并两个有序链表](https://leetcode-cn.com/problems/merge-two-sorted-lists/)  **<font color=green>简单</font>**
```
题目：
    将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 
```
```
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def mergeTwoLists(self, l1: ListNode, l2: ListNode) -> ListNode:
        head = ListNode(0)
        res = head
        while l1 and l2:
            if l1.val <= l2.val:
                head.next = l1
                l1 = l1.next
            else:
                head.next = l2
                l2 = l2.next
            head = head.next
        head.next = l2 if not l1 else l1
        return res.next
```

### [23. 合并K个升序链表](https://leetcode-cn.com/problems/merge-k-sorted-lists/)
```
题目：
    给你一个链表数组，每个链表都已经按升序排列。

    请你将所有链表合并到一个升序链表中，返回合并后的链表。
```

```
# 递归，二分法
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def mergeKLists(self, lists: List[ListNode]) -> ListNode:
        l = len(lists)
        if l == 0:
            return None
        if l == 1:
            return lists[0]
        mid = l // 2
        return self.mergeTwoLists(self.mergeKLists(lists[:mid]), self.mergeKLists(lists[mid:]))
        
    def mergeTwoLists(self, l1: ListNode, l2: ListNode) -> ListNode:
        head = ListNode(0)
        res = head
        while l1 and l2:
            if l1.val <= l2.val:
                head.next = l1
                l1 = l1.next
            else:
                head.next = l2
                l2 = l2.next
            head = head.next
        head.next = l2 if not l1 else l1
        return res.next
```
