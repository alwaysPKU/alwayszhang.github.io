---
layout: post
title: python多进程的一个例子
date: 2018-10-07 23：00 +0800
categories: [python]
tags: python
---
<!--more-->

自己写了个例子来展示多进程，但是注意，这里的不如不用多进程，因为数据量太小，也没有多少IO。反而有些大材小用，但是仅仅是作为一个例子和模板。为后面写其他的时候提供方便。
这个里面写的代码适合多个读一个写的情况，比如mxnet里面产生训练数据.rec的时候就会用到，这个代码也是从那个里面提出来的。这种情况下，因为多个读的彼此之间并无通信，所以用的是多进程，并且要读的常常是图，所以IO会占时间,这种写法，使得读的时间提高了很多倍，但是有个不好的地方是，写的时候目前似乎只能用一个进程来写。应该还是有其他办法的，比如加入锁的机制。这个是下一步探索的目标。
然后也和顺序有些关系，这里写的时候会打乱顺序，这要看具体情况了。

```
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from __future__ import print_function
import os
import sys

curr_path = os.path.abspath(os.path.dirname(__file__))
sys.path.append(os.path.join(curr_path, "../python"))

import random
import argparse
import cv2
import time
import traceback

try:
    import multiprocessing
except ImportError:
    multiprocessing = None


def Read( ):   

def Write():

def read_worker(q_in, q_out):     
# 每一个读的子进程，都会从q_in里面去取，取完了做完了事情了之后，放到q_out的这个队列里面去
# 等待q_out去处理。
    while True:
        deq = q_in.get()
        if deq is None:
            break
        Read(q_in, q_out)
        

def write_worker(q_out):   # 这个函数就相当于是从队列中去取。然后做事情。
    pen = open("file.txt", 'w')
    more = True
    while more:
        deq = q_out.get()
        if deq is not None:
            pen.write("\t".join(map(str, deq))+'\n')
        else:
            more = False
    pen.close()

def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('--num-thread', type=int, default=2,
                        help='number of thread to use.')
    args = parser.parse_args()
    return args

if __name__ == '__main__':
    
    image_list = range(1, 600000)
    cur = time.time()
    args = parse_args()
    if args.num_thread > 1 and multiprocessing is not None:
        q_in = [multiprocessing.Queue(1024) for i in range(args.num_thread)]
        ## 这里是多个读，一个写，
        q_out = multiprocessing.Queue(1024)
        ## 读的时候的多个子进程
        # 创建多个读的子进程
        read_process = [multiprocessing.Process(target=read_worker, args=(q_in[i], q_out)) \
                        for i in range(args.num_thread)]
        # 启动每一个子进程
        for p in read_process:
            p.start()
        # 创建一个写的子进程
        write_process = multiprocessing.Process(target=write_worker, args=(q_out, ))
        # 启动写的子进程
        write_process.start()

        #比如说有1000个吧，然后有8个进程来读，那么每个按下面的写法，每个只需要读125个。
        # 然后每个子进程里面就push了125个了。
        for i, item in enumerate(image_list):
            q_in[i % len(q_in)].put((i, item))
        for q in q_in:
            q.put(None)   # 在这里这一步必不可少，这在前面写的while里面判断取出的是不是none的时候会用到，作为一个结束的标志。
        
        for p in read_process:
            p.join()  
        # 这个的意思是至少得有一个写入，写的才能够写啊，
        q_out.put(None)  # 这个和上面的是一样的，必不可少，不然程序会进入死循环。
        write_process.join()  # 然后开始执行写的进程
    
    
    print("total spends on multiProcess", time.time()-cur)
    
    cur = time.time()
    ww = open('file2.txt', 'w')
    for x in image_list:
        ww.write('\t'.join(map(str, (x, x)))+'\n')
    ww.close()
    print("total spends ", time.time()-cur)


```

这段代码里对读的和写的都是用队列来操作的.
