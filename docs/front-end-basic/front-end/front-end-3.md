---
title: 3. HTML 和 CSS
---

本文稍微讲一下 HTML 和 CSS。

<!--more-->

# 编辑器

写代码，怎么可以少了编辑器呢。

## IDE

集成开发环境（Integrated Development Environment，简称 IDE）是一种辅助程序开发人员开发软件的应用软件，在开发工具内部就可以辅助编写源代码文本、并编译打包成为可用的程序，有些甚至可以设计图形接口。

简单来说，IDE 会集成了很多工具、插件和环境，常见代码提示、错误提示、编译工具等等，在 IDE 下面打开一个 web 项目，很多的辅助信息都帮你解析好了。  
而相对来说，IDE 比起文本编辑器就会笨重很多，尤其在多项目开发管理、编辑器启动的时候，速度明显下降。

前端常用的 IDE 无非是 Webstorm 了。

## 文本编辑器

文本编辑器最大的优势，便是轻。像项目多的时候，常常是打开多个文本编辑器，也不至于卡顿。

而文本编辑器通常也是很灵活的，可以安装需要的一些插件，也能获得想要的辅助功能。

前端常用的文本编辑器有 Sublime、VSCode 等等。

## 提升写码幸福指数

个人习惯的开发伴侣是 VSCode（**VSCode 万岁！**）。

作为伴随长时间的同伴，当然要好好设置一下啦。

1. 选择喜欢的主题样式。
   个人比较喜欢 VSCode 的默认样式，大家也可以去下载各种的主题或是自定义样式。

2. 安装一些插件。
   像本骚年前段时间安装的一个 VSCode 插件：

![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20171108125834.jpg)

还有比较出名的当然是 Atom 的 power mode 啦：

![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/68747470733a2f2f636c6f75642e67697468756275736572636f6e74656e742e636f6d2f6173736574732f3638383431352f31313631353536352f31306631363435362d396336352d313165352d386166342d3236356630316663383361302e676966.gif)

以及最近比较有人气的 [TabNine](https://marketplace.visualstudio.com/items?itemName=TabNine.tabnine-vscode) AI 训练自动补全的插件，写得越多补齐越厉害哦。

嘛，喜欢的事情要做得开心才对啦。除了编辑器，一台好的电脑、机械键盘、耳机等都是写码必备的提高幸福指数的装备啦。

我认识的很多很(ai)牛(zhuang)逼(bi)的程序员，都会让写代码变成很开心的事情。而这样的态度，也是很棒的生活态度。

# HTML 与 CSS

上一节也有简单说过 HTML 相关的，我想想这里讲些啥的好。  
这里主要针对一些样式的逻辑来说明，其他详细的属性和设置值希望大家已经在 [w3c](http://www.w3school.com.cn/) 或是 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS) 上学习过了。

## 盒子模型

我们能从控制台的 Element 模块里，找到这样的盒子模型：

![image](https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1510119051%281%29.png)

盒模型(box model)是 CSS 中的一个重要概念，它是元素大小的呈现方式。

### 概念

在一个文档中，每个元素都被表示为一个矩形的盒子。确定这些盒子的尺寸, 属性（像它的颜色，背景，边框方面）和位置是渲染引擎的目标。

在 CSS 中，使用标准盒模型描述这些矩形盒子中的每一个。这个模型描述了元素所占空间的内容。   
每个盒子有四个边：外边距边（`margin`）,边框边（`border`）,内填充边（`padding`）与内容边（`content`）。

### margin 叠加

当两个或更多个垂直边距相遇时，它们将形成一个外边距（`margin`）。

`margin`的叠加会有一些混淆，需要注意的地方是：  
外边距（`margin`）的高度等于两个发生叠加的外边距的高度中的较大者。  
**只有普通文档流中块框的垂直外边距才会发生外边距叠加。行内框、 浮动框或绝对定位框之间的外边距不会叠加。**

### 盒模型计算

CSS3 中新增了一种盒模型计算方式：`box-sizing`属性。盒模型默认的值是`content-box`, 新增的值是`padding-box`和`border-box`，几种盒模型计算元素宽高的区别如下：

#### content-box（默认）

元素宽高(`width/height`)等于：`content`  
布局所占宽高等于：`width/height(content) + border + padding`  

#### padding-box

元素宽高(`width/height`)等于：`content + padding`
布局所占宽高等于：`width/height(content + padding) + border`  

#### border-box

元素宽高(`width/height`)等于：`content + padding + border`  
布局所占宽高等于：`width/height(content + padding + border)`  

## 内联元素与块状元素

### 内联元素

内联元素又称行内元素等，表示位于行内的元素。  
内联元素只能容纳文本或者其他内联元素，它允许其他内联元素与其位于同一行。  
内联元素的宽度高度不起作用。  

常见的内联元素：`<a>`/`<span>`/`<i>`/`<strong>`等。

### 块状元素

块状元素一般是其他元素的容器，可容纳内联元素和其他块状元素。  
块状元素排斥其他元素与其位于同一行。  
块状元素的宽度高度起作用。  

常见的块状元素有：

- `<div>`/`<p>`/`<h1>`/`<h2>…<h6>`/`<ul>`/`<ol>`
- HTML5 新元素: `<section>`/`<article>`/`<header>`/`<footer>`等

### 常用的 display 属性

#### block：块状元素

- 可容纳其他块状元素或内联元素
- 排斥其他元素与其位于同一行
- 宽度高度起作用，`block`元素可以设置宽度`width`和高度`height`，有效

#### inline：内联元素

- 位于行内，即位于块状元素或者其他内联元素内
- 只能容纳文本或者其他内联元素
- 允许其他内联元素与其位于同一行
- inline 元素的宽度高度不起作用

#### inline-block 元素

- 与`inline`元素相似的地方
  - 位于行内，即位于块状元素或者其他内联元素内
  - 允许其他内联元素与其位于同一行
- 与`block`元素相似的地方

  - 可容纳其他块状元素或内联元素
  - 宽度高度起作用

- 使用`inline-block`可以很方便解决一些问题:
  - 使元素居中
  - `inline`元素`a`/`span`设置宽高
  - 将多个块状元素放在一行

### float 浮动

`float`属性定义元素在哪个方向浮动。  
`float`属性可应用于图像，使文本围绕在图像周围。  

使用`float`还可能遇到高度塌陷的问题，而可以使用几个方法解决：

- 父元素使用`overflow: hidden`（此时高度为`auto`）
- 使父元素也成为浮动`float`元素
- 使用`clear`清除浮动

`float`撑开父元素主要依赖 BFC 原则。

**BFC 特性：**

1. BFC 会阻止垂直外边距（margin-top、margin-bottom）折叠。
2. BFC 不会重叠浮动元素。
3. BFC 可以包含浮动。

### 具体说明

以上的一些样式属性和方法，更多具体说明可参考[《CSS 的 display 有关》](https://godbasin.github.io/2016/06/26/about-display/)。

## 元素定位

**文档流**：正常的文档流也叫普通流，在 HTML 里面的写法就是从上到下，从左到右的排版布局。

而我们常用的布局，与`position`样式属性紧紧相关。

### static

默认值。没有定位，元素出现在正常的流中（忽略 top, bottom, left, right 或者 z-index 声明）。

### inherit

规定应该从父元素继承 position 属性的值。

### relative

生成相对定位的元素，相对于其正常位置进行定位。

`relative`的特点：

- 保持原有文档流，但相对本身的原始位置发生位移，且占空间
- 元素也遵循从上到下，从左到右的排版布局
- 相对于其正常位置进行定位，在这里设置了`relative`的元素相对其原本位置（`position: static`）进行位移
- 元素占有原本位置，因此下一个元素会排到该元素后方
- 元素占位不会随着定位的改变而改变。也就是说`relative`在文档流中占有的位置与其原本位置（`position: static`）相同

这里有个需要注意的地方： 虽然`relative`元素占位与`static`相同，但会溢出父元素，撑开整个页面（`document`）。

### absolute

生成绝对定位的元素，相对于`static`定位以外的第一个父元素进行定位。  
元素的位置通过`left`, `top`, `right`以及`bottom`属性进行规定。  

`absolute`的特点：

- `absolute`元素脱离文档流
- `absolute`元素不占位，因此下一个符合普通流的元素会略过`absolute`元素排到其上一个元素的后方
- `absolute`元素的定位是相对于`static`定位以外的第一个父元素进行定位

### fixed

生成绝对定位的元素，相对于浏览器窗口进行定位。  
元素的位置通过`left`, `top`, `right`以及`bottom`属性进行规定。  

`fixed`的特点：

- `fixed`元素脱离文档流
- `fixed`元素不占位
- `fixed`相对于浏览器窗口来定位，不管是否有`static`定位以外的父元素
- `absolute`元素会随着页面的滚动而滚动，而`fixed`不会

## 元素堆叠

元素的堆叠方式和顺序，除了与`position`定位有关，也与`z-index`有关。  

### z-index

有关`z-index`的说明：

1. 无`z-index`或者`z-index`值相等时，堆叠顺序均由元素在文档中的先后位置决定，后出现的会在上面。
2. 当向上追溯找不到含有`z-index`值的父元素的情况下，则可以视为自由的`z-index`元素。
3. 自由的`z-index`元素可以与其他自由的定位元素或者父元素的同级兄弟定位元素来比较`z-index`的值，决定其堆叠顺序。
4. `z-index`值只决定同一父元素中的同级子元素的堆叠顺序。
5. 父元素的`z-index`值为子元素定义了堆叠顺序，即子元素依赖于父元素`z-index`值来获得页面中的堆叠顺序。

### 具体说明

有关元素定位和堆叠的更多说明，可以参考文章[《CSS 的 position 和 z-index 有关》](https://godbasin.github.io/2016/06/25/about-position/)。

# 结束语

本节简单介绍了关于 HTML 和 CSS 主要的一些规则和说明，或许有些杂乱，但这些都是我们在调试样式的时候需要遵循的逻辑。  
即使是元素的尺寸和颜色，或许也是有一套规则的，只要掌握了这些原理，debug 速度不就快很多了嘛。
