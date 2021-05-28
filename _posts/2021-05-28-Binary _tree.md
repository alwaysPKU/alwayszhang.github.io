---
layout: post
title: 二叉树
date: 2021-05-28
categories: [leetcode]
tags: leetcode
---

* 遍历
   * 深度优先
      * 递归
	     * 前序
		 * 中序
		 * 后序
	  * 迭代
	     * 前序
		 * 中序
		 * 后序
   * 广度优先
   
---
---
# 一、遍历
# 1.1 深度优先
### 1.递归
#### 1.1 前序
```
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def postorderTraversal(self, root: TreeNode) -> List[int]:
        res = list()
        def post_order(root: TreeNode):
            if not root:
                return
            res.append(root.val)
            post_order(root.left)
            post_order(root.right)
        post_order(root)
        return res
```
#### 1.2 中序
```
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def postorderTraversal(self, root: TreeNode) -> List[int]:
        res = list()
        def post_order(root: TreeNode):
            if not root:
                return
            post_order(root.left)
            res.append(root.val)
            post_order(root.right)
        post_order(root)
        return res
```
#### 1.3 后续
```
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def postorderTraversal(self, root: TreeNode) -> List[int]:
        res = list()
        def post_order(root: TreeNode):
            if not root:
                return
            post_order(root.left)
            post_order(root.right)
            res.append(root.val)
        post_order(root)
        return res
```

### 2. 迭代
#### 2.1 前序
```
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def preorderTraversal(self, root: TreeNode) -> List[int]:
        res = list()
        stack = list()
        if not root:
            return res
        node = root
        while node or stack:
            while node:
                res.append(node.val)
                stack.append(node)
                node = node.left
            node = stack.pop()
            node = node.right
        return res
```
#### 2.2 中序
```
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def inorderTraversal(self, root: TreeNode) -> List[int]:
        res = list()
        stack = list()
        if not root:
            return res
        node = root
        while node or stack:
            while node:
                stack.append(node)
                node = node.left
            node = stack.pop()
            res.append(node.val)
            node = node.right
        return res
```
#### 2.3 后序1
```
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def postorderTraversal(self, root: TreeNode) -> List[int]:
        res = list()
        stack = list()
        if not root:
            return res
        node = root
        prev = None
        while node or stack:
            while node:
                stack.append(node)
                node = node.left
            node = stack.pop()
            if not node.right or node.right == prev:
                res.append(node.val)
                prev = node
                node = None
            else:
                stack.append(node)
                node = node.right
        return res
```
#### 2.4 后序2
```
# 思想：前序遍历，调换左右子树的遍历顺序，然后反转最终结果
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def postorderTraversal(self, root: TreeNode) -> List[int]:
        res = list()
        stack = list()
        if not root:
            return res
        node = root
        while node or stack:
            while node:
                res.append(node.val)
                stack.append(node)
                node = node.right
            node = stack.pop()
            node = node.left
        return res[:-1]
```

# 1.1 广度优先


