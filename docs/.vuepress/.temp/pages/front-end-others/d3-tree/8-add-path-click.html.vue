<template><div><p>因为业务需要折腾起了图表，该系列用于记录使用该库制作 Tree 图表的一些笔记。本节我们要在 link 连接线上，添加 hover 的样式，和点击事件。</p>
<!--more-->
<h1 id="添加-path-事件" tabindex="-1"><a class="header-anchor" href="#添加-path-事件" aria-hidden="true">#</a> 添加 path 事件</h1>
<h2 id="基本思路" tabindex="-1"><a class="header-anchor" href="#基本思路" aria-hidden="true">#</a> 基本思路</h2>
<p>之前在讲节点悬浮展示信息的时候，也有做过差不多逻辑的事情，这里因为比较简单，也不涉及新的特性，就直接讲讲逻辑吧。</p>
<ol>
<li>绑定 mouseout 和 mouseover 事件，给线条加上颜色。</li>
<li>绑定 click 事件，获取需要的信息，再触发对应的事情。</li>
</ol>
<p>简单来说，就是这么一小段：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 添加enter操作，添加类名为link的path元素</span>
<span class="token keyword">var</span> linkEnter <span class="token operator">=</span> link
  <span class="token punctuation">.</span><span class="token function">enter</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">insert</span><span class="token punctuation">(</span><span class="token string">"path"</span><span class="token punctuation">,</span> <span class="token string">"g"</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"class"</span><span class="token punctuation">,</span> <span class="token string">"link"</span><span class="token punctuation">)</span>
  <span class="token comment">// 添加id</span>
  <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"id"</span><span class="token punctuation">,</span> <span class="token parameter">d</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token string">"textPath"</span> <span class="token operator">+</span> d<span class="token punctuation">.</span>id<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">"mouseover"</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    d3<span class="token punctuation">.</span><span class="token function">select</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">style</span><span class="token punctuation">(</span><span class="token string">"stroke"</span><span class="token punctuation">,</span> <span class="token string">"orange"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">"mouseout"</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    d3<span class="token punctuation">.</span><span class="token function">select</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">style</span><span class="token punctuation">(</span><span class="token string">"stroke"</span><span class="token punctuation">,</span> <span class="token string">"#CCC"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">"click"</span><span class="token punctuation">,</span> <span class="token parameter">d</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token function">alert</span><span class="token punctuation">(</span>d<span class="token punctuation">.</span>parent<span class="token punctuation">.</span>data<span class="token punctuation">.</span>name <span class="token operator">+</span> <span class="token string">" -> "</span> <span class="token operator">+</span> d<span class="token punctuation">.</span>data<span class="token punctuation">.</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token comment">// 默认位置为当前父节点的位置</span>
  <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"d"</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">var</span> o <span class="token operator">=</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">x</span><span class="token operator">:</span> source<span class="token punctuation">.</span>x0<span class="token punctuation">,</span>
      <span class="token literal-property property">y</span><span class="token operator">:</span> source<span class="token punctuation">.</span>y0
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token function">diagonalReverse</span><span class="token punctuation">(</span>o<span class="token punctuation">,</span> o<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从上面我们可以知道，绑定事件时，使用 this 可以获取到当前元素。所以需要注意的是，这里如果使用可箭头函数，可能就拿不到想要的数据了喔。</p>
<p>最终效果如图：
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1514014266(1).jpg" alt="image"></p>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>我也不知道为啥这节就这么点内容...只是觉得这个点可以记一下，但是又实在凑不上很多东西了，大家将就看看吧。</p>
<p><a href="https://github.com/godbasin/godbasin.github.io/tree/blog-codes/d3-tree-notes/8-add-path-click" target="_blank" rel="noopener noreferrer">此处查看项目代码<ExternalLinkIcon/></a><br>
<a href="http://d3.godbasin.com/8-add-path-click/index.html" target="_blank" rel="noopener noreferrer">此处查看页面效果<ExternalLinkIcon/></a></p>
</div></template>


