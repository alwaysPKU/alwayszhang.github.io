---
layout: post
title: mxnet调用cuda
date: 2018-12-14
categories: [python]
tags: python
---
<!--more-->


之前用mxnet的调过cuda包，觉得还是挺方便的，所以还是想复习一下。

如果要用mxnet的cuda运行时，需要在编译的时候加上

```
ENABLE_CUDA_RTC = 1
```

不然会报错的。

按照官方的教程

```

source = r'''
extern "C" __global__ void axpy(const float *x, float *y, float alpha) {
    int i = threadIdx.x + blockIdx.x * blockDim.x;
    y[i] += alpha * x[i];
}
'''

module = mx.rtc.CudaModule(source)   # 每个source只需要调一次就可以，如果有多个source分别处理不同的任务的话，可以申请多次。
func = module.get_kernel("axpy", "const float *x, float *y, float alpha")
x = mx.nd.ones((10,), ctx=mx.gpu(0))
y = mx.nd.zeros((10,), ctx=mx.gpu(0))
func.launch([x, y, 3.0], mx.gpu(0), (1, 1, 1), (10, 1, 1))
print(y)

```

其中`(1,1,1)和(10,1,1)`是grid dim 和block dim, 还有一个参数是shared_memory,如果用到shared_memeory的话，需要加上那个参数。


