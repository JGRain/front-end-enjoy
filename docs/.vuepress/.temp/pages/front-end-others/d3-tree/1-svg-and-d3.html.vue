<template><div><p>因为业务需要折腾起了图表，该系列用于记录使用该库制作 Tree 图表的一些笔记。本文介绍 svg 和 D3，认识 D3 的概念和作用。</p>
<!--more-->
<h1 id="svg-与-d3" tabindex="-1"><a class="header-anchor" href="#svg-与-d3" aria-hidden="true">#</a> SVG 与 D3</h1>
<p>不同于 Echarts 使用 Canvas 绘制，D3 主要使用 SVG 来绘制图表，当然现在似乎也支持了 Canvas。</p>
<h2 id="svg" tabindex="-1"><a class="header-anchor" href="#svg" aria-hidden="true">#</a> SVG</h2>
<p>SVG 是什么呢？</p>
<p>可缩放矢量图形（Scalable Vector Graphics，SVG)，是一种用来描述二维矢量图形的 XML 标记语言。 简单地说，SVG 面向图形，HTML 面向文本。
SVG 与 Flash 类似，都是用于二维矢量图形，二者的区别在于，SVG 是一个 W3C 标准，基于 XML，是开放的，而 Flash 是封闭的基于二进制格式的。</p>
<p>所以，SVG 与 HTML 相似，都是基于元素，同时通过给元素添加样式、属性、事件的方式，来达到交互的目的。</p>
<p>SVG 里面的元素类型，也与 HTML 一样丰富，可以参考<a href="https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element" target="_blank" rel="noopener noreferrer">SVG 元素参考 | MDN<ExternalLinkIcon/></a>，这里只先介绍使用比较多的几个，剩下的等遇到的时候再讲吧。</p>
<p>我们找后面将使用到的一个 Tree Demo 来讲吧，在控制台能看到这些元素：
<img src="https://about-position-1255459943.file.myqcloud.com/1513414198(1).png" alt="image"></p>
<h4 id="svg-1" tabindex="-1"><a class="header-anchor" href="#svg-1" aria-hidden="true">#</a> svg</h4>
<p>我们常常看到两种：</p>
<ol>
<li><code v-pre>&lt;svg&gt;</code>为根元素，主要用作矢量图片等。</li>
<li><code v-pre>&lt;svg&gt;</code>不是根元素，可以用于在当前文档（比如说，一个 HTML 文档）内嵌套一个独立的 svg 片段。这个独立片段拥有独立的视口和坐标系统。</li>
</ol>
<h4 id="g" tabindex="-1"><a class="header-anchor" href="#g" aria-hidden="true">#</a> g</h4>
<p>元素<code v-pre>&lt;g&gt;</code>是用来组合对象的容器。添加到 g 元素上的变换会应用到其所有的子元素上。添加到 g 元素的属性会被其所有的子元素继承。这里我们使用<code v-pre>&lt;g&gt;</code>来管理节点对象和 link 连接线对象。</p>
<h4 id="path" tabindex="-1"><a class="header-anchor" href="#path" aria-hidden="true">#</a> path</h4>
<p><code v-pre>&lt;path&gt;</code>元素是 SVG 基本形状中最强大的一个，它不仅能创建其他基本形状，还能创建更多其他形状。另外，path 只需要设定很少的点，就可以创建平滑流畅的线条（比如曲线，比如上面的贝塞尔曲线）。这里我们使用<code v-pre>&lt;path&gt;</code>来创建 link 连接线。</p>
<h4 id="cycle" tabindex="-1"><a class="header-anchor" href="#cycle" aria-hidden="true">#</a> cycle</h4>
<p><code v-pre>&lt;circle&gt;</code> SVG 元素是一个 SVG 的基本形状，用来创建圆,基于一个圆心和一个半径。这里我们使用<code v-pre>&lt;circle&gt;</code>来绘制节点。</p>
<h4 id="text" tabindex="-1"><a class="header-anchor" href="#text" aria-hidden="true">#</a> text</h4>
<p><code v-pre>&lt;text&gt;</code>元素定义了一个由文字组成的图形。注意：我们可以将渐变、图案、剪切路径、遮罩或者滤镜应用到 text 上。这里我们使用<code v-pre>&lt;text&gt;</code>来绘制节点描述。</p>
<h2 id="d3" tabindex="-1"><a class="header-anchor" href="#d3" aria-hidden="true">#</a> D3</h2>
<p>关于 D3，我希望你已经有一些研究，基本的安装和 API 查找和使用，可以参考<a href="https://github.com/d3/d3/wiki" target="_blank" rel="noopener noreferrer">官方文档<ExternalLinkIcon/></a>，这里只大致讲述下 D3 库的大致内容。</p>
<h3 id="d3-是什么" tabindex="-1"><a class="header-anchor" href="#d3-是什么" aria-hidden="true">#</a> D3 是什么</h3>
<p>D3 是一个可以基于数据来操作文档的 JavaScript 库。可以帮助你使用 HTML,CSS,SVG 以及 Canvas 来展示数据。D3 遵循现有的 Web 标准，可以不需要其他任何框架独立运行在现代浏览器中，它结合强大的可视化组件来驱动 DOM 操作。</p>
<p>D3 可以将数据绑定到 DOM 上，然后根据数据来计算对应 DOM 的属性值。例如你可以根据一组数据生成一个表格。或者也可以生成一个可以过渡和交互的 SVG 图形。</p>
<p>D3 的运行速度很快，支持大数据集和动态交互以及动画，当然在数量级上去了之后，据说 SVG 性能与 Canvas 还是差了一些的。</p>
<p>下面我们讲几个 D3 中比较关键的概念。</p>
<h3 id="selections-选择集" tabindex="-1"><a class="header-anchor" href="#selections-选择集" aria-hidden="true">#</a> Selections(选择集)</h3>
<p>D3 采用声明式方法，可以对任意节点以及节点集合进行操作:</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>d3<span class="token punctuation">.</span><span class="token function">selectAll</span><span class="token punctuation">(</span><span class="token string">"p"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">style</span><span class="token punctuation">(</span><span class="token string">"color"</span><span class="token punctuation">,</span> <span class="token string">"white"</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// selectAll则选中所有匹配的元素</span>

<span class="token comment">// 同时，可以操作其他节点，而不相互影响</span>
d3<span class="token punctuation">.</span><span class="token function">select</span><span class="token punctuation">(</span><span class="token string">"body"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">style</span><span class="token punctuation">(</span><span class="token string">"background-color"</span><span class="token punctuation">,</span> <span class="token string">"black"</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// select仅仅选择第一个匹配的元素</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们能看到：</p>
<ol>
<li>选择器方法接受<a href="https://www.w3.org/TR/selectors-api/" target="_blank" rel="noopener noreferrer">W3C selector strings<ExternalLinkIcon/></a>支持的字符串，比如<code v-pre>.fancy</code>表示选择类名为<code v-pre>fancy</code>的元素, <code v-pre>div</code>选择<code v-pre>DIV</code>元素。</li>
<li>选择集的方法一般返回当前选择集或一个新的选择集，这样可以支持简明的链式语法。</li>
</ol>
<h3 id="属性操作" tabindex="-1"><a class="header-anchor" href="#属性操作" aria-hidden="true">#</a> 属性操作</h3>
<p>在选中元素之后，就可以通过一些方法对元素进行操作。比如设置 a 元素的 name 属性和颜色:</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>d3<span class="token punctuation">.</span><span class="token function">select</span><span class="token punctuation">(</span><span class="token string">"a"</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"name"</span><span class="token punctuation">,</span> <span class="token string">"fred"</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">style</span><span class="token punctuation">(</span><span class="token string">"color"</span><span class="token punctuation">,</span> <span class="token string">"red"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="动态属性" tabindex="-1"><a class="header-anchor" href="#动态属性" aria-hidden="true">#</a> 动态属性</h4>
<p>或许上面的操作，与 jQuery、Prototype 有相似之处。但是不同的是，样式、属性以及其他属性的值在 D3 中可以是函数形式，而不仅仅是常量。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>d3<span class="token punctuation">.</span><span class="token function">selectAll</span><span class="token punctuation">(</span><span class="token string">"p"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">style</span><span class="token punctuation">(</span><span class="token string">"color"</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token string">"hsl("</span> <span class="token operator">+</span> Math<span class="token punctuation">.</span><span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">*</span> <span class="token number">360</span> <span class="token operator">+</span> <span class="token string">",100%,50%)"</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="数据绑定" tabindex="-1"><a class="header-anchor" href="#数据绑定" aria-hidden="true">#</a> 数据绑定</h3>
<p>上面这种通过匿名函数动态设置属性、样式值的方法常用来绑定数据。</p>
<p>数据被定义在一个数组中，并且每一个数据值可以作为这个函数的参数，此外还有索引等参数，如我们的 Demo 中则用 id 设为索引，此索引对于后面 enter 和 exit 操作等都有很大的用处。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> node <span class="token operator">=</span> svg<span class="token punctuation">.</span><span class="token function">selectAll</span><span class="token punctuation">(</span><span class="token string">"g.node"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">data</span><span class="token punctuation">(</span>nodes<span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> d<span class="token punctuation">.</span>id <span class="token operator">||</span> <span class="token punctuation">(</span>d<span class="token punctuation">.</span>id <span class="token operator">=</span> <span class="token operator">++</span>i<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>数据绑定操作可以方便的根据具体数据操作 DOM 元素。</p>
<p>将数组类型的 data 与选择集中的元素绑定，返回一个 update 集：数据与元素绑定。因为数据个数未必与元素个数一致，所以又有 enter 和 exit 操作。故在数据绑定操作之后会产生三种选择集：update 集,enter 集以及 exit 集。</p>
<h3 id="enter-和-exit-操作" tabindex="-1"><a class="header-anchor" href="#enter-和-exit-操作" aria-hidden="true">#</a> enter 和 exit 操作</h3>
<p>数据绑定的时候可能出现 DOM 元素与数据元素个数不匹配的问题，那么 enter 和 exit 就是用来处理这个问题的。</p>
<p>enter 操作用来添加新的 DOM 元素，exit 操作用来移除多余的 DOM 元素。如果数据元素多于 DOM 个数时用 enter，如果数据元素少于 DOM 元素，则用 exit。</p>
<p>通常来说，我们将元素绑定数据的时候，一般会同时定义 enter 和 exit 的操作，会有三种状态：</p>
<ol>
<li>数据元素与 DOM 元素个数一样时，操作元素。</li>
<li>数据元素个数多于 DOM 元素个数时，动态添加元素，并操作元素。</li>
<li>数据元素个数少于 DOM 元素个数，移除多余元素。</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> circle <span class="token operator">=</span> svg
  <span class="token punctuation">.</span><span class="token function">selectAll</span><span class="token punctuation">(</span><span class="token string">"circle"</span><span class="token punctuation">)</span> <span class="token comment">// 1</span>
  <span class="token punctuation">.</span><span class="token function">data</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span> <span class="token comment">// 2</span>
  <span class="token punctuation">.</span><span class="token function">style</span><span class="token punctuation">(</span><span class="token string">"fill"</span><span class="token punctuation">,</span> <span class="token string">"blue"</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 3</span>

circle<span class="token punctuation">.</span><span class="token function">exit</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">remove</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 4</span>

circle
  <span class="token punctuation">.</span><span class="token function">enter</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">append</span><span class="token punctuation">(</span><span class="token string">"circle"</span><span class="token punctuation">)</span> <span class="token comment">// 5</span>
  <span class="token punctuation">.</span><span class="token function">style</span><span class="token punctuation">(</span><span class="token string">"fill"</span><span class="token punctuation">,</span> <span class="token string">"green"</span><span class="token punctuation">)</span> <span class="token comment">// 6</span>
  <span class="token punctuation">.</span><span class="token function">merge</span><span class="token punctuation">(</span>circle<span class="token punctuation">)</span> <span class="token comment">// 7</span>
  <span class="token punctuation">.</span><span class="token function">style</span><span class="token punctuation">(</span><span class="token string">"stroke"</span><span class="token punctuation">,</span> <span class="token string">"black"</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 8</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个过程可分解成以下步骤:</p>
<ol>
<li>当前存在的 circles 被选中。</li>
<li>将新的数据绑定到这些圆上, 返回 update 集。</li>
<li>将 update 集中的圆颜色设置为 blue。</li>
<li>没有数据对应的圆，也就是多余的圆被删除。</li>
<li>新的圆被 appended，也就是圆不够了，会添加新的圆进来。</li>
<li>新加入的圆颜色设置为 green。</li>
<li>将新添加的圆和已存在的圆 union(合并)为一个新的选择集，包括了当前所有的存在的圆。</li>
<li>将当前所有的圆的边线设置为 black。</li>
</ol>
<h3 id="事件处理" tabindex="-1"><a class="header-anchor" href="#事件处理" aria-hidden="true">#</a> 事件处理</h3>
<p>selections 允许监听和分发事件以支持交互。</p>
<p>我们可以看到我们的 Demo 中：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> nodeEnter <span class="token operator">=</span> node
  <span class="token punctuation">.</span><span class="token function">enter</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">append</span><span class="token punctuation">(</span><span class="token string">"g"</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"class"</span><span class="token punctuation">,</span> <span class="token string">"node"</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"transform"</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token string">"translate("</span> <span class="token operator">+</span> source<span class="token punctuation">.</span>y0 <span class="token operator">+</span> <span class="token string">","</span> <span class="token operator">+</span> source<span class="token punctuation">.</span>x0 <span class="token operator">+</span> <span class="token string">")"</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">"click"</span><span class="token punctuation">,</span> click<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面每个节点添加的时候，都会绑定<code v-pre>click</code>事件，当然这里是 toggle，也就是切换子节点的展开和收起状态。</p>
<h3 id="过渡" tabindex="-1"><a class="header-anchor" href="#过渡" aria-hidden="true">#</a> 过渡</h3>
<p>D3 支持动画效果，这种动画效果可以通过对样式属性的过渡实现。其补间插值支持多种方式，比如线性、弹性等。此外 D3 内置了多种插值方式，比如对数值类型、字符类型路径数据以及颜色等。</p>
<p>D3 中过渡的 API 是 transition，参考<a href="https://github.com/xswei/d3js_doc/tree/master/API/d3-transition-master" target="_blank" rel="noopener noreferrer">d3-transition<ExternalLinkIcon/></a>。
transition 是一个类 selection 为 DOM 元素进行过渡的接口，可以使 DOM 从当前状态平滑的过渡到目标状态。</p>
<p>除了 D3 提供的过渡之外，也可以通过 CSS 动画来实现对元素的过渡效果。</p>
<h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2>
<ul>
<li><a href="https://github.com/xswei/d3js_doc/tree/master/Introduction" target="_blank" rel="noopener noreferrer">d3js 简介<ExternalLinkIcon/></a></li>
<li><a href="https://github.com/xswei/d3js_doc/tree/master/API/d3-selection-master" target="_blank" rel="noopener noreferrer">d3-selection<ExternalLinkIcon/></a></li>
<li><a href="https://github.com/xswei/d3js_doc/tree/master/API/d3-transition-master" target="_blank" rel="noopener noreferrer">d3-transition<ExternalLinkIcon/></a></li>
</ul>
<p>令还有个 D3 的教程网站，如果你需要的话：<a href="http://www.ourd3js.com/wordpress/396/" target="_blank" rel="noopener noreferrer">【 D3.js 入门系列 】 入门总结<ExternalLinkIcon/></a>。</p>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>这节主要简单介绍了 SVG 和 D3，如果你是一个前端基础不大稳的入门者，建议可以系统看看。如果说你是个经验满满的实战者，那么边做边查边翻源码的方式也是很不错的呢。</p>
</div></template>


