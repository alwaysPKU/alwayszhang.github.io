---
layout: post
title: 最大黑方阵
date: 2021-09-06
categories: [leetcode]
tags: leetcode
---

[面试题 17.23. 最大黑方阵](https://leetcode-cn.com/problems/max-black-square-lcci/)
```
题目：
  给定一个方阵，其中每个单元(像素)非黑即白。设计一个算法，找出 4 条边皆为黑色像素的最大子方阵。

  返回一个数组 [r, c, size] ，其中 r, c 分别代表子方阵左上角的行号和列号，size 是子方阵的边长。若有多个满足条件的子方阵，返回 r 最小的，若 r 相同，返回 c 最小的子方阵。若无满足条件的子方阵，返回空数组。

示例：

  输入:
  [
     [1,0,1],
     [0,0,1],
     [0,0,1]
  ]
  输出: [1,0,2]
  解释: 输入中 0 代表黑色，1 代表白色，标粗的元素即为满足条件的最大子方阵

```

**Ans**

```
创建记录状态矩阵mark[r][c][2] 
1. matric[r][c][0]记录r,c点向右连续0的个数
2. matric[r][c][1]记录r,c点向下连续0的个数
则len = min(matric[r][c][0]， matric[r][c][1])是其可能组成最大矩阵的边：
此时开始判定，如果len比记录到的最大矩阵边长size小，不用判定了继续下一步
如果len>=size 则判定 matric[r+len-1][c][0] >= len and matric[r][c+len-1][1] >= len则能够组成更大的矩阵，或者rc更小，但是size一样的矩阵。记录之。如果不且len-- >= size。继续上一步判定。
```

```
class Solution:
    def findSquare(self, matrix: List[List[int]]) -> List[int]:
        m = len(matrix)
        n = len(matrix[0])
        mark = [[['']*2 for _ in range(n)] for _ in range(m)]
        
        ans = []
        for r in range(m-1, -1, -1):
            for c in range(n-1, -1, -1):
                if matrix[r][c] == 1:
                    mark[r][c][0] = 0
                    mark[r][c][1] = 0
                else:
                    if r < m-1:
                        mark[r][c][1] = mark[r+1][c][1] + 1
                    else:
                        mark[r][c][1] = 1
                    if c < n -1:
                        mark[r][c][0] = mark[r][c+1][0] + 1
                    else:
                        mark[r][c][0] = 1
                    len_min = min(mark[r][c][0], mark[r][c][1])
                    while len(ans)==0 or len_min >= ans[2]:
                        if mark[r+len_min-1][c][0] >= len_min and mark[r][c+len_min-1][1] >= len_min:
                            ans = [r, c, len_min]
                            break
                        else:
                            len_min -= 1
        return ans
```
