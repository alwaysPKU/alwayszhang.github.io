---
layout: post
title: python-多进程、多线程
date: 2018-11-08
categories: [python]
tags: python
---
<!--more-->

之前看了网上的总结关于多进程，多线程的，但是感觉自己理解的还是不够深刻，所以又在网上看了一些内容，加深下理解。
然后关于Python实现多进程和多线程也了解了一些。

### multiprocessing 模块，
python的多进程实现主要是这个模块，
里面常用的有`Process`, `Pool`两个比较常用的。其中前者是启动少量的进程，后者是启动大量的进程，所以叫进程池

### Process 相关的操作

```
from multiprocessing import Process

def run(i):
    print i

p = Process(target=run, args=(i,))
p.start()
p.join()

```
其中`start`方法用来启动，`join`方法可以等等子进程程结束后再继续往下支行，常用于进程间的同步，即一个一个地执行。

### Pool 相关

```
from multiprocessing import Pool

def run(i):
    print i

p = Pool(4)
for i in range(4):
    p.apply_async(run, args=(i,))
p.close()
p.join()
```

Pool的参数 default是机子的CPU核心数目，在调用`join`之前必须要有`close()`方法，调用完`close()`方法之后就不能继续添加新的`Process`了。

另外，多进程的时候常常有进程之间的通信,这里面有`Queue`，`Pipes`，比如我之前写的那个例子就是用的队列，读的进程读完之后放入队列，等待写的进程去写。这个可以看我之前写的那个例子。

### 子进程 subprocess
这个我在实际中见到的情况，都是让其去运行命令行里的操作，比如:

```
import subprocess
r = subprocess.call(['cp', '-r', 'me', 'me_copy'])
print("Exit code", r)

```

这样可以在程序中执行命令行里的操作os里面也有类似的函数。比如`os.system`,`os.popen`等。

### 多线程 threading 模块

```

def run():
    print threading.current_thread().name  # 打印当前在运行的线程的名字
    n = 0
    while n<100:
        print(threading.current_thread().name, n)
    print threading.current_thread().name  # 打印当前在运行的线程的名字

print threading.current_thread().name  # 打印当前在运行的线程的名字

t = threading.Thread(target=run, name='THREAD1')
t.start()
t.join()
print "end", threading.current_thread().name  # 打印当前在运行的线程的名字
    
```

运行之后会发现开始和结尾的时候都是一个叫 "MainThread"的在运行，中间的都是我起的那个"THREAD1"在运行。
其实任何一个进程default都会启动一个线程，这个线程就是主线程，主线程又可以启动新的线程，
`threading.current_thread()`会返回当前线程的实例。

### 线程锁
这个是在多线程中应该说是经常会见到的问题，多进程中，同一个变量，各自有一份copy在每个进程中，互不影响，而多线程中，所以变量由所有线程share，任何一个变量都可以被任何一个线程修改，这样如果同时改一个变量就会乱了。应该用锁的办法来保证类似"原子操作"。

比如下面的代码
```
import threading
import time

ret = 0

def change(n):
    global ret
    ret = ret+n
    ret = ret-n
def run(n):
    for i in range(10000):
        change(n)

t1 = threading.Thread(target=run_thread, args=(5,))
t2 = threading.Thread(target=run_thread, args=(8,))

t1.start()
t2.start()
t1.join()
t2.join()
print(ret)
```
就有可能出错，返回的结果可能不是0，主要原因是 `ret=ret+n`并不是原子操作，
而是相当于
`x = ret+n`
`ret = x`
那么这中间就有可能有其它的线程insert，来改。
这种情况下就要用锁来保证同一个时间，只能由一个来修改其内容。

```
ret = 0
lock = threading.Lock()

def run(n):
    for i in range(10000):
        # 先get lock
        lock.acquire()
        try:
            change(n)
        finally:
            # 再释放锁让其它的线程可以用
            lock.release()
```

### 多核
现在机器大都是多核的了，但是不同的语言也有所不同，其实python 里面如果不做修改的话是无法做到真正的复用多核的，因为python里面有一个GIL锁，即global interpreter lock，任何python线程执行前，都要先获得GIL锁，然后执行100条字节码之后就会释放GIL锁，让别的线程有机会执行，这样虽然python里面的线程是真正的线程，但是即使有100个线程在100个核上跑，也只能用到1个核。
比如看下面的例子

```
import threading, multiprocessing

def run():
    x = 0 
    while True:
        x = x^1 

print multiprocessing.cpu_count()
for i in range(multiprocessing.cpu_count()):
    t = threading.Thread(target=run)
    t.start()

```

程序运行的时候打出的是`8`，但是

![avator](/images/mul.png)

显然没有怎么运行，但是如果是用c，c++或者java的话，将会达到800%.

### 自己遇到的bug，还没有改好

```
# --coding: UTF-8 --
import os,sys
import multiprocessing

def read_worker(q_in, q_out):
    while True:
        deq = q_in.get()
        if deq is None:
            break
        q_out.put(deq)

def write_worker(q_out, i):
    global ret
    more = True
    while more:
        deq = q_out.get()
        if deq is not None:
            ret[i].append(deq)
        else:
            more = False
    
ret = [[] for i in range(3)]

q_in = [multiprocessing.Queue(1024) for i in range(3)]
q_out = [multiprocessing.Queue(1024) for i in range(3)]


read_process = [multiprocessing.Process(target=read_worker, args=(q_in[i], q_out[i])) for i in range(3)]
for p in read_process:
    p.start()

write_process = [multiprocessing.Process(target=write_worker, args=(q_out[i], i)) for i in range(3)]
for p in write_process:
    p.start()

for i in range(1000):
    q_in[i%3].put(i)

for q in q_in:
    q.put(None)

for p in read_process:
    p.join()

for q in q_out:
    q.put(None)
for p in write_process:
    p.join()

print ret
```
结果输出却是 `[[], [], []]`不太明白，哪里出错了，
如果 在 `write_worker`的`else`里面加上
`print ret[i]`的话，能够把结果打印出来，但是结果没有存到外面的ret[i]里面不知道为啥，按理说，ret是可变的，函数里面修改的话，会影响外面的值的，比如

```
ret = [[] for i in range(3)]
def fun(i):
    ret[i].append(i*i)

for i in range(3):
    fun(i)

print ret 
```

输出的就是 `[[0], [1], [4]]`.
如果不行，就打算每个进程的结果先写到硬盘上，最后全部算完了之后再读一次，融合到一块儿，但是我觉得一定是有解决办法的。

### 解决办法
后来问了阿威，才知道list其实不是线程安全的，最好不要用多线程对list进行操作
将ret 作下边的修正后，相应的地方由append换成put之后
`ret = [multiprocessing.Queue(1024) for i in range(3)]`
最后再加上下面的

```
def fun(ll, i):
    more = True
    while more:
        deq = ret[i].get()
        if deq is not None:
            ll.append(deq)
        else:
            more = False

result = []
for i in range(3):
    fun(result, i)

print result

```
就可以看到是想要的结果了。其实原因是，多进程的时候，各个进程之间是不共享内存的，即便是程序里面的global变量，这个global变量在每个子进程中是它们各自的global变量，但在各个子进程之间却不share，也就是它们只看到了自己的这个里面的，并不知道其它子进程里发生了变化。而Queue之所以可行，是因为它是进程，线程安全的，这在multiprocessing里面是写好了的。
上面的代码，是从具体问题中抽象出来的。不过也可以用进程池`Pool`来解决，进程池有个好处是可以有返回值。这样就不仅可以在函数里面做一些写入的操作，而且可以让函数返回值。比如下面这个是对一个问题的抽象。

```
# --coding: UTF-8 --
import os
from multiprocessing import Pool

os.system("mkdir TEXT")

def run(i):
    with open("TEXT/%d.txt"%i, 'w') as w:
        w.write("%d"%(i*i)+"\n")
    return i*i*i


if __name__=='__main__':
    workers = Pool(processes=6)
    results = workers.map(run, range(1,20))
    print results
```

即一方面在函数里面写入，一方面让函数有返回值，最终的results还可以用来去做其他的事情，或者再写入。比如写入的时候可以是图，而返回的时候可以是个名字之类的，而且results是和`workers.map(run, range(1,20))`这里面传入的参数的排序有关系，不过可以也让结果变乱。


