---
layout: post
title: 二叉树
date: 2021-05-28
categories: [leetcode]
tags: leetcode
---

[二叉树定义](https://zh.wikipedia.org/wiki/%E4%BA%8C%E5%8F%89%E6%A0%91)

* 遍历
   * 深度优先 Depth-First-Search，DFS
      * 递归
	     * 前序
	     * 中序
	     * 后序
	  * 迭代
	     * 前序
	     * 中序
	     * 后序
   * 广度优先(层次遍历)
      * [102.二叉树的层序遍历](https://leetcode-cn.com/problems/binary-tree-level-order-traversal/)
      * [102.二叉树的层序遍历II](https://leetcode-cn.com/problems/binary-tree-level-order-traversal-ii/)
      * [637.二叉树的层平均值](https://leetcode-cn.com/problems/average-of-levels-in-binary-tree/)
 * 二叉搜索树
   * [98.验证二叉搜索树 ](https://leetcode-cn.com/problems/validate-binary-search-tree/)
   
> 深度优先遍历：从根节点出发，沿着左子树方向进行纵向遍历，直到找到叶子节点为止。然后回溯到前一个节点，进行右子树节点的遍历，直到遍历完所有可达节点为止。

> 广度优先遍历：从根节点出发，在横向遍历二叉树层段节点的基础上纵向遍历二叉树的层次。
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

#  广度优先
## 给定一个二叉树，层序遍历,且每一层返回一个list
[leetcode](https://leetcode-cn.com/problems/binary-tree-level-order-traversal/)
```
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def levelOrder(self, root: TreeNode) -> List[List[int]]:
        from queue import Queue
        res = list()
        q = Queue()
        if not root:
            return res
        q.put(root)
        level_size = 1
        next_level_size = 0
        level_res = list()
        while not q.empty():
            while level_size > 0:
                node = q.get()
                level_res.append(node.val)
                level_size -= 1
                if node.left:
                    q.put(node.left)
                    next_level_size += 1
                if node.right:
                    q.put(node.right)
                    next_level_size += 1
            level_size = next_level_size
            next_level_size = 0
            res.append(level_res)
            level_res = []
        return res
```
## 给定一个二叉树，返回其节点值自底向上的层序遍历
[二叉树层序遍历II](https://leetcode-cn.com/problems/binary-tree-level-order-traversal-ii/)
```
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def levelOrderBottom(self, root: TreeNode) -> List[List[int]]:
        from queue import Queue
        res = list()
        q = Queue()
        if not root:
            return res
        q.put(root)
        level_size = 1
        next_level_size = 0
        level_res = list()
        while not q.empty():
            while level_size > 0:
                node = q.get()
                level_res.append(node.val)
                level_size -= 1
                if node.left:
                    q.put(node.left)
                    next_level_size += 1
                if node.right:
                    q.put(node.right)
                    next_level_size += 1
            level_size = next_level_size
            next_level_size = 0
            res.append(level_res)
            level_res = []
        return res[::-1]
```
## 二叉树层平均值
```
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def averageOfLevels(self, root: TreeNode) -> List[List[int]]:
        from queue import Queue
        res = list()
        q = Queue()
        if not root:
            return res
        q.put(root)
        level_size = 1
        next_level_size = 0
        level_res = list()
        while not q.empty():
            while level_size > 0:
                node = q.get()
                level_res.append(node.val)
                level_size -= 1
                if node.left:
                    q.put(node.left)
                    next_level_size += 1
                if node.right:
                    q.put(node.right)
                    next_level_size += 1
            level_size = next_level_size
            next_level_size = 0
            res.append(mean(level_res))
            level_res = []
        return res
```
# 二、二叉搜索树

>给定一个二叉树，判断其是否是一个有效的二叉搜索树。

>假设一个二叉搜索树具有如下特征：

>>节点的左子树只包含小于当前节点的数。

>>节点的右子树只包含大于当前节点的数。

>>所有左子树和右子树自身必须也是二叉搜索树。

### 验证二叉搜索树
* 递归
```
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def isValidBST(self, root: TreeNode) -> bool:
        lower = float('-inf')
        upper = float('inf')
        def helper(node: TreeNode, lower, upper):
            if not node:
                return True
            
            val = node.val
            if val <= lower or val >= upper:
                return False
            if not helper(node.right, val, upper):
                return False
            if not helper(node.left, lower, val):
                return False
            return True
        
        return helper(root, lower, upper)
```
* 中序遍历（二叉搜索树的中序遍历结果，肯定是升序的）
```
迭代中序遍历
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def isValidBST(self, root: TreeNode) -> bool:
        stack = list()
        node = root
        left = float('-inf')
        while node or stack:
            while node:
                stack.append(node)
                node = node.left
            node = stack.pop()
            if left < node.val:
                left = node.val
            else:
                return False
            node = node.right
        return True
```
