---
layout: post
title: 化学式中原子的数量
date: 2021-07-06
categories: [leetcode]
tags: leetcode
---


[726.原子的数量]（https://leetcode-cn.com/problems/number-of-atoms/）
```
from collections import defaultdict, deque
class Solution:
    def countOfAtoms(self, formula: str) -> str:
        res_collection  = deque()
        n = len(formula)
        idx = 0
        while idx <= n -1:
            if formula[idx] != ')':
                res_collection.append(formula[idx])
                idx += 1
            else:
                left_idx = idx + 1
                right_idx = left_idx
                num = 1
                while right_idx <= n-1 and formula[right_idx].isdigit():
                    right_idx += 1
                if left_idx <= n - 1 and left_idx != right_idx:
                    num = int(formula[left_idx : right_idx])
                idx = right_idx

                tmp = []
                one_par = res_collection.pop()
                while one_par != '(':
                    tmp.append(one_par)
                    one_par = res_collection.pop()
                tmp.reverse()
                res_collection.append(self.process_one(''.join(tmp*num)))
        tmp = []
        while res_collection: 
            tmp.append(res_collection.popleft())
        return self.process_one(''.join(tmp))


    # 处理每一个不带（）的表达式
    def process_one(self, formula: str):
        res = defaultdict(int)
        res_str = ''
        n = len(formula)
        idx = 0
        while idx <= n-1:
            it = formula[idx]
            if it.isupper():
                autom = it
                while idx < n - 1 and formula[idx + 1].islower():
                    autom += formula[idx + 1]
                    idx += 1
                num = 1
                if idx < n - 1 and formula[idx + 1].isdigit():
                    idx_right = idx + 1
                    while idx_right < n -1 and formula[idx_right + 1].isdigit():
                        idx_right += 1
                    num = int(formula[idx + 1: idx_right + 1])
                    idx = idx_right
                if autom in res:
                    res[autom] += num
                    idx += 1
                else:
                    res[autom] = num
                    idx += 1
        res_tmp = []
        for k, v in res.items():
            res_tmp.append([k, v])
        res_tmp.sort(key=lambda x:x[0])
        for k, v in res_tmp:
            if v == 1:
                v = ''
            res_str += '{}{}'.format(k, v)
        return res_str
```
