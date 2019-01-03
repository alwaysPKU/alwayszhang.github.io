---
layout: post
title:  双系统安装
date: 2018-11-21
description: "其它"
tag: 其它
---

### linux 双系统
感觉mac写tex没有windows方便，主要是许多符号的命令我没有记住，所以又在自己的linux系统上想着再安了一个windows系统，过程如下。

* 启动U盘

从学校下的win10的系统，制作启动pan,

* 然后设置电脑的BIOS为u-pan为优先选择的，然后重启就可以了。

但是在安装的时候，因为之前，电脑是linux系统的，导致不能安装，说是windows必须安在ntfs的上面，然后在网上查了一下，是按照下面的这个操作的，

1、在当前安装界面按住Shift+F10调出命令提示符窗口； 
2、输入diskpart，按回车执行； 
3、进入DISKPART命令模式，输入list disk回车，列出当前磁盘信息； 
4、要转换磁盘0格式，则输入select disk 0回车，输入clean，删除磁盘分区； 
5、输入convert mbr，回车，将磁盘转换为MBR，输入convert gpt则转为GPT； 
6、最后输入exit回车退出命令提示符，返回安装界面继续安装系统。 
7、然后点击新建磁盘就可以安装驱动。

然后就可以了。

### Mac 双系统

今天真是强迫症了，后来了解到mac是可以直接安装windows的，用bootcamp，非常方便，一直enter就可以了。然后快速的试了一下，但是打开后连不上网，查了一下，是因为驱动没安装，方法是从文件管理器里面进入D盘（不太大），里面进入bootcamp文件目录下，然后点setup.ext就可以了。

不过对windows有些失望，mac的本来的触摸板非常好用的，结果到windows这里变得非常死板，好像还得按下去才可以，而且看pdf的时候也不方便，不能够一滑到底的随便翻页。


