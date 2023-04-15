<template><div><p>因为业务需要折腾起了图表，该系列用于记录使用该库制作 Tree 图表的一些笔记。本节我们要在 link 连接线上，添加文字说明。</p>
<!--more-->
<h1 id="添加曲线文字" tabindex="-1"><a class="header-anchor" href="#添加曲线文字" aria-hidden="true">#</a> 添加曲线文字</h1>
<hr>
<h2 id="textpath" tabindex="-1"><a class="header-anchor" href="#textpath" aria-hidden="true">#</a> textPath</h2>
<p>除了笔直地绘制一行文字以外， SVG 也可以根据 <code v-pre>&lt;path&gt;</code> 元素的形状来放置文字。 只要在<code v-pre>&lt;textPath&gt;</code>元素内部放置文本，并通过其<code v-pre>xlink:href</code>属性值引用<code v-pre>&lt;path&gt;</code>元素，我们就可以让文字块呈现在<code v-pre>&lt;path&gt;</code>元素给定的路径上了。</p>
<h2 id="添加-textpath" tabindex="-1"><a class="header-anchor" href="#添加-textpath" aria-hidden="true">#</a> 添加 textPath</h2>
<p>简单来说，我们想要实现连接线上增加文字说明，需要进行这样的处理：</p>
<ol>
<li>给每个 link 的 svg 元素<code v-pre>&lt;path&gt;</code>添加 id 标识。</li>
<li>在 link 的 enter 操作中，添加<code v-pre>&lt;textPath&gt;</code>元素，并设置<code v-pre>xlink:href</code>属性值引用对应的<code v-pre>&lt;path&gt;</code>。</li>
<li>给每个<code v-pre>&lt;textPath&gt;</code>添加对应的文字和颜色。</li>
</ol>
<h3 id="给-path-添加-id-标识" tabindex="-1"><a class="header-anchor" href="#给-path-添加-id-标识" aria-hidden="true">#</a> 给 path 添加 id 标识</h3>
<p>在 link 的 enter 操作中，给<code v-pre>&lt;path&gt;</code>添加 id：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 添加enter操作，添加类名为link的path元素</span>
<span class="token keyword">var</span> linkEnter <span class="token operator">=</span> link
  <span class="token punctuation">.</span><span class="token function">enter</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">insert</span><span class="token punctuation">(</span><span class="token string">"path"</span><span class="token punctuation">,</span> <span class="token string">"g"</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"class"</span><span class="token punctuation">,</span> <span class="token string">"link"</span><span class="token punctuation">)</span>
  <span class="token comment">// 添加id</span>
  <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"id"</span><span class="token punctuation">,</span> <span class="token parameter">d</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token string">"textPath"</span> <span class="token operator">+</span> d<span class="token punctuation">.</span>id<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// ...其他操作</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="添加-textpath-文字" tabindex="-1"><a class="header-anchor" href="#添加-textpath-文字" aria-hidden="true">#</a> 添加 textPath 文字</h3>
<p>我们在 link 的 enter 操作中，添加 text，同时添加与 path 匹配的 textPath：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>link
  <span class="token punctuation">.</span><span class="token function">enter</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">append</span><span class="token punctuation">(</span><span class="token string">"text"</span><span class="token punctuation">)</span>
  <span class="token comment">// 给text添加textPath元素</span>
  <span class="token punctuation">.</span><span class="token function">append</span><span class="token punctuation">(</span><span class="token string">"textPath"</span><span class="token punctuation">)</span>
  <span class="token comment">// 给textPath设置path的引用</span>
  <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"xlink:href"</span><span class="token punctuation">,</span> <span class="token parameter">d</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token string">"#textPath"</span> <span class="token operator">+</span> d<span class="token punctuation">.</span>id<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token comment">// 字体居中</span>
  <span class="token punctuation">.</span><span class="token function">style</span><span class="token punctuation">(</span><span class="token string">"text-anchor"</span><span class="token punctuation">,</span> <span class="token string">"middle"</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"startOffset"</span><span class="token punctuation">,</span> <span class="token string">"50%"</span><span class="token punctuation">)</span>
  <span class="token comment">// 父节点的name</span>
  <span class="token punctuation">.</span><span class="token function">style</span><span class="token punctuation">(</span><span class="token string">"fill"</span><span class="token punctuation">,</span> <span class="token string">"red"</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">text</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> d<span class="token punctuation">.</span>parent<span class="token punctuation">.</span>id<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">append</span><span class="token punctuation">(</span><span class="token string">"tspan"</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">style</span><span class="token punctuation">(</span><span class="token string">"fill"</span><span class="token punctuation">,</span> <span class="token string">"blue"</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">text</span><span class="token punctuation">(</span><span class="token string">" --> "</span><span class="token punctuation">)</span>
  <span class="token comment">// 子节点的name</span>
  <span class="token punctuation">.</span><span class="token function">append</span><span class="token punctuation">(</span><span class="token string">"tspan"</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">style</span><span class="token punctuation">(</span><span class="token string">"fill"</span><span class="token punctuation">,</span> <span class="token string">"red"</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">text</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">d</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> d<span class="token punctuation">.</span>id<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面我们还处理了这样的事情，添加文字说明：父节点 id --&gt; 子节点 id，同时还设置了颜色。</p>
<h2 id="path-方向调整" tabindex="-1"><a class="header-anchor" href="#path-方向调整" aria-hidden="true">#</a> path 方向调整</h2>
<p>如果按照这样的方式，我们会发现我们的文字反了：
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1513586990(1).png" alt="image"></p>
<p>像一个个蝙蝠，倒挂着在那。这是因为 pathText 是有方向的，而我们在添加 path 元素的时候，使用的贝塞尔曲线为子节点到父节点的方向，故我们需要进行调整：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 添加贝塞尔曲线的path，方向为父节点指向子节点</span>
<span class="token keyword">function</span> <span class="token function">diagonalReverse</span><span class="token punctuation">(</span><span class="token parameter">s <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> d <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  path <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">M </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>d<span class="token punctuation">.</span>y<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>d<span class="token punctuation">.</span>x<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">
                  C </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token punctuation">(</span>s<span class="token punctuation">.</span>y <span class="token operator">+</span> d<span class="token punctuation">.</span>y<span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">2</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>d<span class="token punctuation">.</span>x<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">,
                  </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token punctuation">(</span>s<span class="token punctuation">.</span>y <span class="token operator">+</span> d<span class="token punctuation">.</span>y<span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">2</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>s<span class="token punctuation">.</span>x<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">,
                  </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>s<span class="token punctuation">.</span>y<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>s<span class="token punctuation">.</span>x<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> path<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后把之前<code v-pre>diagonal</code>改为<code v-pre>diagonalReverse</code>，就可以实现想要的效果了。</p>
<p>最终效果如图：
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1513586680(1).png" alt="image"></p>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>本节介绍了一个新的 svg 元素--textPath，可以通过绘制 path，然后给 text 添加 textPath 来绘制曲线文字。刚开始本骚年还以为是 d3 的能力，看来是小瞧了 svg 了呢，不过现在似乎 svg 使用越来越少了呢。Sign~</p>
<p><a href="https://github.com/godbasin/godbasin.github.io/tree/blog-codes/d3-tree-notes/7-text-path" target="_blank" rel="noopener noreferrer">此处查看项目代码<ExternalLinkIcon/></a><br>
<a href="http://d3.godbasin.com/7-text-path/index.html" target="_blank" rel="noopener noreferrer">此处查看页面效果<ExternalLinkIcon/></a></p>
</div></template>


