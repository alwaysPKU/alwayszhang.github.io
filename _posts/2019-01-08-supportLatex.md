---
layout: post
title: jekyll支持latex公式
date: 2019-01-08
categories: [拾遗]
tags: 拾遗
---
<!--more-->

标签： 拾遗

---

在incloud/head.html文件里加入以下代码：
```html
<script type="text/x-mathjax-config">
MathJax.Hub.Config({
tex2jax: {
skipTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
inlineMath: [['$','$']]
}
});
</script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/latest.js?config=TeX-MML-AM_CHTML' async></script>
```

来个秀：
$$\begin{multline} \lambda_\textbf{coord} \sum_{i = 0}^{S^2}     \sum_{j = 0}^{B}     \mathbb{𝟙}_{ij}^{\text{obj}}             \left[             \left(                 x_i - \hat{x}_i             \right)^2 +             \left(                 y_i - \hat{y}_i             \right)^2             \right] \\ + \lambda_\textbf{coord} \sum_{i = 0}^{S^2}     \sum_{j = 0}^{B}         \mathbb{𝟙}_{ij}^{\text{obj}}          \left[         \left(             \sqrt{w_i} - \sqrt{\hat{w}_i}         \right)^2 +         \left(             \sqrt{h_i} - \sqrt{\hat{h}_i}         \right)^2         \right] \\ + \sum_{i = 0}^{S^2}     \sum_{j = 0}^{B}         \mathbb{𝟙}_{ij}^{\text{obj}}         \left(             C_i - \hat{C}_i         \right)^2 \\ + \lambda_\textrm{noobj} \sum_{i = 0}^{S^2}     \sum_{j = 0}^{B}     \mathbb{𝟙}_{ij}^{\text{noobj}}         \left(             C_i - \hat{C}_i         \right)^2 \\ + \sum_{i = 0}^{S^2} \mathbb{𝟙}_i^{\text{obj}}     \sum_{c \in \textrm{classes}}         \left(             p_i(c) - \hat{p}_i(c)         \right)^2 \end{multline}$$

