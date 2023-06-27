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
* 构造
   * [105. 从前序与中序遍历序列构造二叉树](https://leetcode-cn.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)
   * [106. 从中序与后序遍历序列构造二叉树](https://leetcode-cn.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)
* 二叉搜索树
   * [98.验证二叉搜索树 ](https://leetcode-cn.com/problems/validate-binary-search-tree/)
   * [501.二叉搜索树中的众数](https://leetcode-cn.com/problems/find-mode-in-binary-search-tree/)
   * [230.二叉搜索树中第K小的元素](https://leetcode-cn.com/problems/kth-smallest-element-in-a-bst/)
   
---
```
深度优先遍历：从根节点出发，沿着左子树方向进行纵向遍历，直到找到叶子节点为止。然后回溯到前一个节点，进行右子树节点的遍历，直到遍历完所有可达节点为止。
广度优先遍历：从根节点出发，在横向遍历二叉树层段节点的基础上纵向遍历二叉树的层次。
```
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
---

# 二、 构造
### [105. 从前序与中序遍历序列构造二叉树](https://leetcode-cn.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)
**<font color=red>前序先确定根节点位置，中序确定根节点左右边</font>**
```
给定一棵树的前序遍历 preorder 与中序遍历  inorder。请构造二叉树并返回其根节点。
注意:
你可以假设树中没有重复的元素。
```
```
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> TreeNode:
        index_inorder = {element: idx for idx, element in enumerate(inorder)}
        n = len(preorder)

        def dfs(p_left, p_right, i_left, i_right):
            if p_left > p_right:
                return
            preorder_root = p_left
            inorder_root = index_inorder[preorder[preorder_root]]

            root = TreeNode(preorder[preorder_root])
            left_num = inorder_root - i_left
            root.left = dfs(p_left+1, p_left+left_num, i_left, inorder_root - 1)
            root.right = dfs(p_left+left_num+1, p_right, inorder_root + 1, i_right)
            return root
        return dfs(0, n-1, 0, n-1)
```

###  [106. 从中序与后序遍历序列构造二叉树](https://leetcode-cn.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)
**<font color=red>后续倒着遍历先确定根节点位置，中序确定根节点左右边</font>**
```
根据一棵树的中序遍历与后序遍历构造二叉树。
注意:
你可以假设树中没有重复的元素。
```
**<font color=blue>python3</font>**
```
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def buildTree(self, inorder: List[int], postorder: List[int]) -> TreeNode:
        def dfs(in_left, in_right):
            if in_left > in_right:
                return

            val = postorder.pop()
            root = TreeNode(val)

            idx = idx_inorder[val]

            root.right = dfs(idx+1, in_right)
            root.left = dfs(in_left, idx-1)
            return root
        idx_inorder = {val: idx for idx, val in enumerate(inorder)}
        return dfs(0, len(postorder) - 1)
```

**<font color=blue>C++</font>**
```
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
    int post_idx;
    unordered_map<int, int> idx_map;

public:
    TreeNode* dfs(int in_left, int in_right, vector<int>& inorder, vector<int>& postorder){
        if (in_left > in_right) return nullptr;
        int root_val = postorder[post_idx];
        TreeNode* root = new TreeNode(root_val);

        int index = idx_map[root_val];

        post_idx--;
        root->right = dfs(index+1, in_right, inorder, postorder);
        root->left = dfs(in_left, index-1, inorder, postorder);
        return root;
    }
    TreeNode* buildTree(vector<int>& inorder, vector<int>& postorder) {
        post_idx = (int)postorder.size() - 1;

        int idx = 0;
        for (auto& val: inorder){
            idx_map[val] = idx++; 
        }
        return dfs(0, (int)inorder.size()-1, inorder, postorder);
    }
};
```



---
# 三、二叉搜索树

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

### [501.二叉搜索树中的众数](https://leetcode-cn.com/problems/find-mode-in-binary-search-tree/)
```
利用二叉搜索树中序遍历的有序性
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def findMode(self, root: TreeNode) -> List[int]:
        res = list()
        node = root
        if not node:
            return node
        stack = list()
        base = float('-inf')
        count = 0
        max_count = 0
        while node or stack:
            while node:
                stack.append(node)
                node = node.left
            node = stack.pop()
            val = node.val
            if val == base:
                count += 1
            else:
                base = val
                count = 1
            if count == max_count:
                res.append(val)
            elif count > max_count:
                res = [val]
                max_count = count
            node = node.right
        return res
```

### [230.二叉搜索树中第K小的元素](https://leetcode-cn.com/problems/kth-smallest-element-in-a-bst/)
```
利用二叉搜索树中序遍历的有序性
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def kthSmallest(self, root: TreeNode, k: int) -> int:
        node = root
        stack = list()
        count = 0
        while node or stack:
            while node:
                stack.append(node)
                node = node.left
            node = stack.pop()
            val = node.val
            count += 1
            if count == k:
                return val
            node = node.right
```
