---
layout: post
title:  用c++布模型
date: 2018-11-19
description: "torch"
tag: torch
---

这个是在实际中应该会碰到的问题，即模型学习好了之后，接下来就要用了，当然后面的inference过程用python依然是可以的，而且可能甚至很快很方便的就能实现好，因为python有许多方便的库可以直接使用，但是有个非常关键的问题是速度，特别是在一些实时的任务上，比如自动驾驶，或者一些其它的实时detect的任务上面，甚至是手机移动端等小型的设备上。这里就写一个简单的例子来展示如何用c++来加载模型做前向计算。

### 准备工作

这个例子需要最新的torch 1.0.0的review version, 我是用conda安装的，直接运行的官方给的命令

` conda install pytorch-nightly cuda92 -c pytorch `

但是安装的时候有bug,

```
Rolling back transaction: done

PermissionError(13, 'Permission denied')

```

解决办法是更改conda文件的权限

`sudo chown -R user anaconda3`

或者是  `sudo chmod -R 777 anaconda3`， 我是用的后者。

然后还要安装 `torchvision`, 方法是

`pip install torchvision`.




### 准备模型 


```
import torch

import torchvision

model = torchvision.models.resnet18()
```

### 将模型通过跟踪转化为troch脚本


```

example = torch.rand(1,3,224,224)
traced_scripts_module = torch.jit.trace(model, example)

```

这时候的ScriptModule现在与常规的pytorch模块的用法一样

```
# test

output = traced_script_module(torch.ones(1,3,224,224))

print(output[0,:5])

```

* 转化为torch脚本的方式还可以通过注释的方式，这里先用上面的方式，用注释的方式后面再作补充。

### 将脚本模块序列化为文件，

即保存到硬盘上面去

```
traced_script_module.save("model.pt")

```

没问题的话，就会有"model.pt"这个文件。
接下来将离开python的领域，进入到c++

### 用c++加载脚本模型


下面这个文件是 `example-app.cpp`

```
#include <torch/script.h> // One-stop header.

#include <iostream>
#include <memory>

int main(int argc, const char* argv[]) {
  if (argc != 2) {
    std::cerr << "usage: example-app <path-to-exported-script-module>\n";
    return -1; 
  }

  // Deserialize the ScriptModule from a file using torch::jit::load().
  std::shared_ptr<torch::jit::script::Module> module = torch::jit::load(argv[1]);

  assert(module != nullptr);
  std::cout << "ok\n";
}


```

### 用LibTorch构建应用程序

我们需要用`LibTorch`, 下载路径是在这个里面 [LibTorch](https://pytorch.org/cppdocs/installing.html)

可以运行下面的代码进行下载解压

```
wget https://download.pytorch.org/libtorch/nightly/cpu/libtorch-shared-with-deps-latest.zip
unzip libtorch-shared-with-deps-latest.zip

```

现在的文件目录结构是

```
.
├── example-app.cpp
└── libtorch-shared-with-deps-latest.zip

```

当前目录是 `example-app`

接下来就是编译过程，首先是写个CMakeLists.txt

```
cmake_minimum_required(VERSION 3.0 FATAL_ERROR)
project(custom_ops)

find_package(Torch REQUIRED)

add_executable(example-app example-app.cpp)
target_link_libraries(example-app "${TORCH_LIBRARIES}")
set_property(TARGET example-app PROPERTY CXX_STANDARD 11)


```

然后在当前目录（example-app）下

```

mkdir build
cd build
cmake -DCMAKE_PREFIX_PATH=/home/pengkun/torch_learn/torch_self/example-app/libtorch ..
make

```
其中后面是绝对路径。

结果是这样的

```
pengkun@ubuntu:~/torch_learn/torch_self/example-app$ mkdir build
pengkun@ubuntu:~/torch_learn/torch_self/example-app$ cd build/
pengkun@ubuntu:~/torch_learn/torch_self/example-app/build$ ls
pengkun@ubuntu:~/torch_learn/torch_self/example-app/build$ cmake -DCMAKE_PREFIX_PATH=/home/pengkun/torch_learn/torch_self/example-app/libtorch ..
-- The C compiler identification is GNU 5.4.0
-- The CXX compiler identification is GNU 5.4.0
-- Check for working C compiler: /usr/bin/cc
-- Check for working C compiler: /usr/bin/cc -- works
-- Detecting C compiler ABI info
-- Detecting C compiler ABI info - done
-- Detecting C compile features
-- Detecting C compile features - done
-- Check for working CXX compiler: /usr/bin/c++
-- Check for working CXX compiler: /usr/bin/c++ -- works
-- Detecting CXX compiler ABI info
-- Detecting CXX compiler ABI info - done
-- Detecting CXX compile features
-- Detecting CXX compile features - done
-- Looking for pthread.h
-- Looking for pthread.h - found
-- Looking for pthread_create
-- Looking for pthread_create - not found
-- Looking for pthread_create in pthreads
-- Looking for pthread_create in pthreads - not found
-- Looking for pthread_create in pthread
-- Looking for pthread_create in pthread - found
-- Found Threads: TRUE  
-- Found torch: /home/pengkun/torch_learn/torch_self/example-app/libtorch/lib/libtorch.so  
-- Configuring done
-- Generating done
-- Build files have been written to: /home/pengkun/torch_learn/torch_self/example-app/build
pengkun@ubuntu:~/torch_learn/torch_self/example-app/build$ make
Scanning dependencies of target example-app
[ 50%] Building CXX object CMakeFiles/example-app.dir/example-app.cpp.o
[100%] Linking CXX executable example-app
[100%] Built target example-app
pengkun@ubuntu:~/torch_learn/torch_self/example-app/build$ 

```

执行完了之后就会有一个 `example-app`生成，然后就可以运行了,在build中运行

`./example-app ../../model.pt` , 第二个是我的model.pt的位置。

可以看到打出了一个`ok`.

### 在c++中执行脚本模块

我们做这些的目的是希望更快的让模型做前向计算，下面是一个小的例子。是在前面的基础上加上去的。
仍然是 `example-app.cpp`

```
#include <torch/script.h> // One-stop header.

#include <iostream>
#include <memory>

int main(int argc, const char* argv[]) {
  if (argc != 2) {
    std::cerr << "usage: example-app <path-to-exported-script-module>\n";
    return -1; 
  }

  // Deserialize the ScriptModule from a file using torch::jit::load().
  std::shared_ptr<torch::jit::script::Module> module = torch::jit::load(argv[1]);

  assert(module != nullptr);
  std::cout << "ok\n";
    

  // Create a vector of inputs.
  std::vector<torch::jit::IValue> inputs;
  inputs.push_back(torch::ones({1, 3, 224, 224}));

// Execute the model and turn its output into a tensor.
  auto output = module->forward(inputs).toTensor();

  std::cout << output.slice(/*dim=*/1, /*start=*/0, /*end=*/5) << '\n';

}

```

然后按照上面的过程再编译一次，这次运行之后得到的结果是 


```
ok
-0.2222  0.1833 -0.0838 -0.1398  0.3353
[ Variable[CPUFloatType]{1,5} ]


```

### 后记

上面的虽然用c++来实现了，但是速度上仍然很慢，所以下面会考虑用cuda的来实现。


