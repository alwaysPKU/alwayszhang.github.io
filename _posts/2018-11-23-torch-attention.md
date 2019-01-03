---
layout: post
title:  pytorch中一些注意的地方（不断更新）
date: 2018-11-23
description: "torch"
tag: torch
---

### torch.size()

这个如果想要获得其大小的话，可以 torch.size()[0]，或者torch.size()[1]
这个在看maskrcnn代码时碰到过这个错误。


### 保存模型与加载模型 

之前在一个blob中已经提到有两种方式都可以保存模型，先回忆下这两种方式。

* 保存参数的方式

* 保存整个模型和参数的方式


但是其实上面的两种方法都需要依赖于其它的东西，只要模型导入的时候需要依赖的包，按上面的方式的话，会保存依赖的包关系。那现在这样就会有问题，比如现在要拿这个模型安装到人脸识别的硬件产品上面去，那么表面上看好像只是load了一下模型，但是因为它里面保存的有所需要的包，所以还是需要把其他的东西给添加起来，所以如果要布到硬件里面，或者想要抛开各种依赖包的话，可以用c++的那种方式。

大致的过程如下。

假设以前按照这种方式保存了一个".tar"的模型

```
def save_checkpoint(net, is_best, filename='result_model'):
    torch.save(net, filename + '_latest.pth.tar')
    if is_best:
        shutil.copyfile(filename + '_latest.pth.tar', filename + '_best.pth.tar')
```


然后调用的时候是这样的

```

 save_checkpoint({
                    'iter': iters,
                    'state_dict': model.state_dict(),
                    }, is_best, 'bestmodel')
    
```

现在假设模型训练完了，保存了`bestmodel_best.pth.tar`, 

下面开始把这个模型转化为序列化脚本。

```

model = Model()   # 这个是自己的网络结构类

model_path = 'bestmodel_best.pth.tar'
model_dict = torch.load(model_path)

model.load_state_dict(model_dict)
model = model.cuda()
model.eval()

example = torch.rand(1,3,224,224).cuda()
traced_script_module = torch.jit.trace(model, example)
traced_script_module.save("model.pt")

```

如果没有问题的话，上面的过程就会把模型转化为序列化脚本。

如果再加载的话，是这样的。

```
model = torch.jit.load(model_path).cuda()
model.eval()

```
然后再去做推理的操作。


