---
layout: post
title: pyenv 和 vitualenv
date: 2021-05-04
categories: [拾遗]
tags: 拾遗
---

##vituralenv和pyenv
## 场景
    1. pyenv 是一个开源的 Python 版本管理工具，可以轻松地给系统安装任意 Python 版本，想玩哪个版本，瞬间就可以切换。有了 pyenv，我们不需要再为系统多版本 Python 共存问题而发愁，也不用为手动编译安装其他 Python 版本而浪费时间，只需要执行一条简单的命令就可以切换并使用任何其他版本，该工具真正地做到了开箱即用，简单实用。
    
    2. virtualenv 是一个用来创建完全隔离的 Python 虚拟环境的工具，可以为每个项目工程创建一套独立的 Python 环境，从而可以解决不同工程对 Python 包，或者版本的依赖问题。假如有 A 和 B 两个工程，A 工程代码要跑起来需要 requests 1.18.4，而 B 工程跑起来需要 requests 2.18.4，这样在一个系统中就无法满足两个工程同时运行问题了。最好的解决办法是用 virtualenv 给每个工程创建一个完全隔离的 Python 虚拟环境，给每个虚拟环境安装相应版本的包，让程序使用对应的虚拟环境运行即可。这样既不影响系统 Python 环境，也能保证任何版本的 Python 程序可以在同一系统中运行。
    
    3. 最佳实践：使用 pyenv 安装任何版本的 Python，然后用 virtualenv 创建虚拟环境时指定需要的 Python 版本路径，这样就可以创建任何版本的虚拟环境，这样的实践真是极好的！

## 命令
    1. pyenv
        1. pyenv install xxx (python版本)
        2. pyenv global xxx （选择默认的环境）
        3. 查看有哪些版本 pyenv versions (默认的前面有个*)
    
    2. virtualenv
        1. 创建：mkdir xxx && virtualenv -p ${python版本} xxx
        2. 启动: source xxx/bin/activate
