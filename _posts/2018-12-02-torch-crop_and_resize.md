---
layout: post
title: pytorch实现crop和resize（C版本）
date: 2018-12-02
categories: [torch]
tags: torch
---
<!--more-->

这里主要是实现一下用C来写crop和resize的操作，如果想要提速度的话，会用到。这里先只写前向计算的部分，梯度回传的那部分还没有搞明白。

### 大致流程

主要目标：是在一张图上crop出多个框，或者是在每张图上crop出一个框，然后把这些框全部resize到同一个shape, 其中输入和输出全部都是四维的张量，即，`(batch_size, deep, width, high)`可能有的顺序有些差别。

要crop出的框的位置信息是0--1的小数表示的，即它是相对于整个大图而言的，resize是用的双线性插值。即主要的想法是找到与其最接近的那4个点的位置，要注意的是有时候不一定是4个。但是都可以用同一个公式来进行计算。

代码如下。

```
#include <TH/TH.h>
#include <stdio.h>
#include <math.h>

void CropAndResizePerBox(
    const float * image_data,
    const int batch_size,
    const int depth,
    const int image_height,
    const int image_width,

    const float * boxes_data,
    const int * box_index_data,
    const int start_box,
    const int limit_box,

    float * corps_data,
    const int crop_height,
    const int crop_width,
    const float extrapolation_value
) {
    const int image_channel_elements = image_height * image_width;   //每个channels上的个
数
    const int image_elements = depth * image_channel_elements;   // 每个图上的元素个数。

    const int channel_elements = crop_height * crop_width;          // crop出的每个channel上的数量
    const int crop_elements = depth * channel_elements;   // 要crop的每个图上的元素个数

    int b;
    for (b = start_box; b < limit_box; ++b) {       //从开始到结束的box
        const float * box = boxes_data + b * 4;     //当前box的首地址
        const float y1 = box[0];
        const float x1 = box[1];
        const float y2 = box[2];
        const float x2 = box[3];

        // 上面是获得要crop的box的位置。

        const int b_in = box_index_data[b];   //这个应该是得到到这个batch中的第几个。
        if (b_in < 0 || b_in >= batch_size) {
            printf("Error: batch_index %d out of range [0, %d)\n", b_in, batch_size);
            exit(-1);
        }
t float height_scale =
            (crop_height > 1)
                ? (y2 - y1) * (image_height - 1) / (crop_height - 1)
                : 0;
        const float width_scale =
            (crop_width > 1) ? (x2 - x1) * (image_width - 1) / (crop_width - 1)
                             : 0;


        for (int y = 0; y < crop_height; ++y)
        {
            const float in_y = (crop_height > 1)
                                   ? y1 * (image_height - 1) + y * height_scale
                                   : 0.5 * (y1 + y2) * (image_height - 1);   //y1,y2只是>相对位置，现在得到的是个真实的位置，注意是个小数。

            if (in_y < 0 || in_y > image_height - 1)    // 这时候已经比原图还要大了，就补
0.
            {
                for (int x = 0; x < crop_width; ++x)     // 对于每一个宽度
                {
                    for (int d = 0; d < depth; ++d)    //对于每一个深度。
                    {
                        // crops(b, y, x, d) = extrapolation_value;
                        // 下面的即具体到数组的位置。
                        corps_data[crop_elements * b + channel_elements * d + y * crop_width + x] = extrapolation_value;
                    }
                }
                continue;  //然后进行下一个。
            }
            const int top_y_index = floorf(in_y);
            const int bottom_y_index = ceilf(in_y);
            const float y_lerp = in_y - top_y_index;


            for (int x = 0; x < crop_width; ++x)
            {
                const float in_x = (crop_width > 1)
                                       ? x1 * (image_width - 1) + x * width_scale
                                       : 0.5 * (x1 + x2) * (image_width - 1);
                if (in_x < 0 || in_x > image_width - 1)
                {
                    for (int d = 0; d < depth; ++d)
                    {
                        corps_data[crop_elements * b + channel_elements * d + y * crop_width + x] = extrapolation_value;
                    }
                    continue;
                }

                const int left_x_index = floorf(in_x);
                const int right_x_index = ceilf(in_x);
                const float x_lerp = in_x - left_x_index;

                for (int d = 0; d < depth; ++d)   //然后对于每一个深度。
                {
                    const float *pimage = image_data + b_in * image_elements + d * image_channel_elements;   //从首地址平移到该channel的位置。
                   // 因为上面已经得到该channel的位置了。
                    const float top_left = pimage[top_y_index * image_width + left_x_index];     //
                    const float top_right = pimage[top_y_index * image_width + right_x_index];
                    const float bottom_left = pimage[bottom_y_index * image_width + left_x_index];
                    const float bottom_right = pimage[bottom_y_index * image_width + right_x_index];// 其周围的4个像素点上的值。

                    const float top = top_left + (top_right - top_left) * x_lerp;
                    const float bottom =
                        bottom_left + (bottom_right - bottom_left) * x_lerp;

                    corps_data[crop_elements * b + channel_elements * d + y * crop_width + x] = top + (bottom - top) * y_lerp;   // 嗯 然后 得到该像素点的值。
                }
            }   // end for x
        }   // end for y
    }   // end for b

}


```

注意算scale的时候，height-1，是因为其像素点之间的间距的个数就是(height_1)那么多个。就是全部是当成距离来算的。把这个改成cuda来写的话也比较容易，只要开的线程的个数是输出的总长度就可以了。
