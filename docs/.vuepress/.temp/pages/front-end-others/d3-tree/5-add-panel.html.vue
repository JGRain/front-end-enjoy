<template><div><p>因为业务需要折腾起了图表，该系列用于记录使用该库制作 Tree 图表的一些笔记。本节实现浮层信息，当鼠标放置在节点上面时，展示节点信息。</p>
<!--more-->
<h1 id="添加浮层" tabindex="-1"><a class="header-anchor" href="#添加浮层" aria-hidden="true">#</a> 添加浮层</h1>
<h2 id="实现逻辑" tabindex="-1"><a class="header-anchor" href="#实现逻辑" aria-hidden="true">#</a> 实现逻辑</h2>
<p>给图表添加浮层，其实有个很简单的办法，大概逻辑是：</p>
<ul>
<li>用一个<code v-pre>&lt;div&gt;</code>元素来装载数据</li>
<li>绑定节点的 mouseover 事件，当鼠标浮在节点上时，设置浮层展示，同时设置内容和位置</li>
<li>绑定节点的 mouseout 事件，当鼠标移出节点时，设置浮层隐藏</li>
</ul>
<h2 id="添加浮层-div" tabindex="-1"><a class="header-anchor" href="#添加浮层-div" aria-hidden="true">#</a> 添加浮层 div</h2>
<p>我们来添加这么一个版块：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>chartTooltip hidden<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>strong</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>name<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>strong</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>和这样一个样式：</p>
<div class="language-css line-numbers-mode" data-ext="css"><pre v-pre class="language-css"><code><span class="token selector">.chartTooltip</span> <span class="token punctuation">{</span>
  <span class="token property">position</span><span class="token punctuation">:</span> absolute<span class="token punctuation">;</span>
  <span class="token property">width</span><span class="token punctuation">:</span> 200px<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> auto<span class="token punctuation">;</span>
  <span class="token property">padding</span><span class="token punctuation">:</span> 10px<span class="token punctuation">;</span>
  <span class="token property">box-sizing</span><span class="token punctuation">:</span> border-box<span class="token punctuation">;</span>
  <span class="token property">background-color</span><span class="token punctuation">:</span> white<span class="token punctuation">;</span>
  <span class="token property">border-radius</span><span class="token punctuation">:</span> 5px<span class="token punctuation">;</span>
  <span class="token property">box-shadow</span><span class="token punctuation">:</span> 2px 2px 5px <span class="token function">rgba</span><span class="token punctuation">(</span>0<span class="token punctuation">,</span> 0<span class="token punctuation">,</span> 0<span class="token punctuation">,</span> 0.4<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token property">pointer-events</span><span class="token punctuation">:</span> none<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.chartTooltip.hidden</span> <span class="token punctuation">{</span>
  <span class="token property">display</span><span class="token punctuation">:</span> none<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">.chartTooltip p</span> <span class="token punctuation">{</span>
  <span class="token property">margin</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
  <span class="token property">font-size</span><span class="token punctuation">:</span> 14px<span class="token punctuation">;</span>
  <span class="token property">line-height</span><span class="token punctuation">:</span> 20px<span class="token punctuation">;</span>
  <span class="token property">word-wrap</span><span class="token punctuation">:</span> break-word<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里我们简单地，只展示节点的 name 属性，但其实一个 div 元素能实现各种各样的交互和样式吧，剩下的都是一个前端必备的能力啦。</p>
<h2 id="绑定鼠标事件" tabindex="-1"><a class="header-anchor" href="#绑定鼠标事件" aria-hidden="true">#</a> 绑定鼠标事件</h2>
<p>我们需要在每个节点 enter 操作中，绑定 mouseover 和 mouseout 事件：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 添加enter操作，添加类名为node的group元素</span>
<span class="token keyword">var</span> nodeEnter <span class="token operator">=</span> node
  <span class="token punctuation">.</span><span class="token function">enter</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">append</span><span class="token punctuation">(</span><span class="token string">"g"</span><span class="token punctuation">)</span>
  <span class="token comment">// ...其他操作</span>
  <span class="token comment">// 添加mouseover事件</span>
  <span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">"mouseover"</span><span class="token punctuation">,</span> <span class="token parameter">d</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token comment">// 从d3.event获取鼠标的位置</span>
    <span class="token keyword">var</span> transform <span class="token operator">=</span> d3<span class="token punctuation">.</span>event<span class="token punctuation">;</span>
    <span class="token keyword">var</span> yPosition <span class="token operator">=</span> transform<span class="token punctuation">.</span>offsetY <span class="token operator">+</span> <span class="token number">20</span><span class="token punctuation">;</span>
    <span class="token keyword">var</span> xPosition <span class="token operator">=</span> transform<span class="token punctuation">.</span>offsetX <span class="token operator">+</span> <span class="token number">20</span><span class="token punctuation">;</span>

    <span class="token comment">// 将浮层位置设置为鼠标位置</span>
    <span class="token keyword">var</span> chartTooltip <span class="token operator">=</span> d3
      <span class="token punctuation">.</span><span class="token function">select</span><span class="token punctuation">(</span><span class="token string">".chartTooltip"</span><span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">style</span><span class="token punctuation">(</span><span class="token string">"left"</span><span class="token punctuation">,</span> xPosition <span class="token operator">+</span> <span class="token string">"px"</span><span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">style</span><span class="token punctuation">(</span><span class="token string">"top"</span><span class="token punctuation">,</span> yPosition <span class="token operator">+</span> <span class="token string">"px"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// 更新浮层内容</span>
    chartTooltip<span class="token punctuation">.</span><span class="token function">select</span><span class="token punctuation">(</span><span class="token string">".name"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">text</span><span class="token punctuation">(</span>d<span class="token punctuation">.</span>data<span class="token punctuation">.</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// 移除浮层hidden样式，展示浮层</span>
    chartTooltip<span class="token punctuation">.</span><span class="token function">classed</span><span class="token punctuation">(</span><span class="token string">"hidden"</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token comment">// 添加mouseover事件</span>
  <span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">"mouseout"</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token comment">// 添加浮层hidden样式，隐藏浮层</span>
    d3<span class="token punctuation">.</span><span class="token function">select</span><span class="token punctuation">(</span><span class="token string">".chartTooltip"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">classed</span><span class="token punctuation">(</span><span class="token string">"hidden"</span><span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// ...click和dblclick事件操作</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最终效果如图：
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1513572588.png" alt="image"></p>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>嗯，你没看错，这节到这里就结束了。虽然内容不多，不过学到了个比较取巧的办法。很多时候我们都有类似的想法，像在 canvas 里面就得使用 canvas 来绘制内容。<br>
跳开固有的逻辑看事物，会有不同的想法和看到不同的景色噢。</p>
<p><a href="https://github.com/godbasin/godbasin.github.io/tree/blog-codes/d3-tree-notes/5-add-panel" target="_blank" rel="noopener noreferrer">此处查看项目代码<ExternalLinkIcon/></a><br>
<a href="http://d3.godbasin.com/5-add-panel/index.html" target="_blank" rel="noopener noreferrer">此处查看页面效果<ExternalLinkIcon/></a></p>
</div></template>


