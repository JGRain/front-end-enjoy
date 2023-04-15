<template><div><p>因为业务需要折腾起了图表，该系列用于记录使用该库制作 Tree 图表的一些笔记。本节我们来给图表添加拖动和缩放吧。</p>
<!--more-->
<h1 id="添加鼠标事件" tabindex="-1"><a class="header-anchor" href="#添加鼠标事件" aria-hidden="true">#</a> 添加鼠标事件</h1>
<h2 id="d3-zoom" tabindex="-1"><a class="header-anchor" href="#d3-zoom" aria-hidden="true">#</a> d3-zoom</h2>
<p>不得不说，这节我们增加的拖动和缩放功能，都是通过<code v-pre>d3-zoom</code>模块来完成的。
<code v-pre>d3-zoom</code>可以对 selections 进行平移和缩放，它封装了浏览器支持的 input events 并对浏览器兼容性做了处理。</p>
<p>我们先来介绍下基本的 API：</p>
<p><strong>d3.zoom()</strong>
创建一个 zoom 操作。返回一个 zoom 对象方法，通常被传递给 selection.call 来调用。</p>
<p><strong>zoom.scaleExtent([extent])</strong>
设置或获取缩放范围。默认为<code v-pre>[0, ∞]</code>。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 这里我们创建了zomm操作，同时通过scaleExtent设置缩放区域为0.1-100倍。</span>
<span class="token keyword">var</span> zoom <span class="token operator">=</span> d3<span class="token punctuation">.</span><span class="token function">zoom</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">scaleExtent</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">0.1</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>zoom.on(typenames[, listener])</strong>
三种情况：设置，取消，获取事件监听器。</p>
<ol>
<li>如果指定了 listener，则为对应的 typenames 设置事件监听器。</li>
<li>如果 listenter 为 null，则取消对应的 typenames 监听器。</li>
<li>如果没有指定 listenter，则返回对应的 typenames 监听器。</li>
</ol>
<p>typenames 是一个字符串，由 type 和 name 组成。也就是可以为同一种事件类型添加多个监听器。type 必须为如下几种：</p>
<ul>
<li>start：开始缩放 (比如鼠标按下)</li>
<li>zoom：开始缩放变换(比如拖拽)</li>
<li>end：缩放结束(比如鼠标抬起 )</li>
</ul>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> zoom <span class="token operator">=</span> d3
  <span class="token punctuation">.</span><span class="token function">zoom</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token comment">// 设置缩放区域为0.1-100倍</span>
  <span class="token punctuation">.</span><span class="token function">scaleExtent</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">0.1</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
  <span class="token comment">// 监听缩放变换事件，包括拖动和滚轮</span>
  <span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">"zoom"</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 绑定zoom事件，通过单独定义dblclick.zoom，释放zoom双击事件（默认为双击放大，会与动态请求冲突）</span>
<span class="token function">selection</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span>zoom<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">"dblclick.zoom"</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>更多的 API 详情，请参考<a href="https://github.com/xswei/d3js_doc/tree/master/API/d3-zoom-master" target="_blank" rel="noopener noreferrer">d3-zoom<ExternalLinkIcon/></a>。</p>
<h2 id="zoom-events" tabindex="-1"><a class="header-anchor" href="#zoom-events" aria-hidden="true">#</a> Zoom Events</h2>
<p>当 zoom event listener 被调用时, d3.event 会被设置为当前的 zoom 事件。zoom event 对象由以下几部分组成:</p>
<ul>
<li>target：当前的缩放 zoom behavior。</li>
<li>type：事件类型:“start”, “zoom” 或者 “end”; 参考 zoom.on。</li>
<li>transform：当前的 zoom transform(缩放变换)。</li>
<li>sourceEvent：原始事件, 比如 mousemove 或 touchmove。</li>
</ul>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>zoom<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">"zoom"</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token comment">// 可以获取zoom事件当前的缩放状态</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>d3<span class="token punctuation">.</span>event<span class="token punctuation">.</span>transform<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="添加-zoom-事件的处理" tabindex="-1"><a class="header-anchor" href="#添加-zoom-事件的处理" aria-hidden="true">#</a> 添加 zoom 事件的处理</h2>
<p>svg 里面包括很多的子元素，我们这里采用给整个 svg 添加 zoom 事件，来进行完整的缩放和拖动处理：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 这里我们将svg元素，和子group元素拆分</span>
<span class="token keyword">var</span> svg <span class="token operator">=</span> d3
  <span class="token punctuation">.</span><span class="token function">select</span><span class="token punctuation">(</span><span class="token string">"body"</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">append</span><span class="token punctuation">(</span><span class="token string">"svg"</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"width"</span><span class="token punctuation">,</span> width <span class="token operator">+</span> margin<span class="token punctuation">.</span>right <span class="token operator">+</span> margin<span class="token punctuation">.</span>left<span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"height"</span><span class="token punctuation">,</span> height <span class="token operator">+</span> margin<span class="token punctuation">.</span>top <span class="token operator">+</span> margin<span class="token punctuation">.</span>bottom<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 子group元素存为view变量</span>
<span class="token keyword">var</span> view <span class="token operator">=</span> svg
  <span class="token punctuation">.</span><span class="token function">append</span><span class="token punctuation">(</span><span class="token string">"g"</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">"transform"</span><span class="token punctuation">,</span> <span class="token string">"translate("</span> <span class="token operator">+</span> margin<span class="token punctuation">.</span>left <span class="token operator">+</span> <span class="token string">","</span> <span class="token operator">+</span> margin<span class="token punctuation">.</span>top <span class="token operator">+</span> <span class="token string">")"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 创建zoom操作</span>
<span class="token keyword">var</span> zoom <span class="token operator">=</span> d3
  <span class="token punctuation">.</span><span class="token function">zoom</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token comment">// 设置缩放区域为0.1-100倍</span>
  <span class="token punctuation">.</span><span class="token function">scaleExtent</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">0.1</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">"zoom"</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token comment">// 子group元素将响应zoom事件，并更新transform状态</span>
    view<span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span>
      <span class="token string">"transform"</span><span class="token punctuation">,</span>
      <span class="token string">"translate("</span> <span class="token operator">+</span>
        <span class="token punctuation">(</span>d3<span class="token punctuation">.</span>event<span class="token punctuation">.</span>transform<span class="token punctuation">.</span>x <span class="token operator">+</span> margin<span class="token punctuation">.</span>left<span class="token punctuation">)</span> <span class="token operator">+</span>
        <span class="token string">","</span> <span class="token operator">+</span>
        <span class="token punctuation">(</span>d3<span class="token punctuation">.</span>event<span class="token punctuation">.</span>transform<span class="token punctuation">.</span>y <span class="token operator">+</span> margin<span class="token punctuation">.</span>top<span class="token punctuation">)</span> <span class="token operator">+</span>
        <span class="token string">") scale("</span> <span class="token operator">+</span>
        d3<span class="token punctuation">.</span>event<span class="token punctuation">.</span>transform<span class="token punctuation">.</span>k <span class="token operator">+</span>
        <span class="token string">")"</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// svg层绑定zoom事件，同时释放zoom双击事件</span>
<span class="token function">svg</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span>zoom<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">"dblclick.zoom"</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里，不管是鼠标滚轮的事件还是拖动事件，都会触发 zoom 事件响应。如果说滚轮事件与页面上下滚动事件相斥的话，我们可以通过<code v-pre>zoom.filter()</code>来过滤。我们如果想要改成按下 ctrl 键的同时，滚动鼠标滚轮才进行缩放，可以这样修改：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> zoom <span class="token operator">=</span> d3
  <span class="token punctuation">.</span><span class="token function">zoom</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">scaleExtent</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">0.1</span><span class="token punctuation">,</span> <span class="token number">100</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// isWheelEvent为是否滚轮事件</span>
    <span class="token keyword">var</span> isWheelEvent <span class="token operator">=</span> d3<span class="token punctuation">.</span>event <span class="token keyword">instanceof</span> <span class="token class-name">WheelEvent</span><span class="token punctuation">;</span>
    <span class="token comment">// 返回是否ctrl与滚轮同时触发</span>
    <span class="token keyword">return</span> <span class="token operator">!</span>isWheelEvent <span class="token operator">||</span> <span class="token punctuation">(</span>isWheelEvent <span class="token operator">&amp;&amp;</span> d3<span class="token punctuation">.</span>event<span class="token punctuation">.</span>ctrlKey<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">"zoom"</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>效果如图，缩放前：
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1513511660(1).png" alt="image"></p>
<p>放大后：
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1513511993(1).png" alt="image"></p>
<h2 id="根据节点数量和层级调整间距" tabindex="-1"><a class="header-anchor" href="#根据节点数量和层级调整间距" aria-hidden="true">#</a> 根据节点数量和层级调整间距</h2>
<p>而当我们的层级树和子节点树上去之后，我们的节点会挤到一起，而要避免文字被遮挡，需要调整间距。</p>
<p>我们先来定义两个函数方法，分别用来获取最深层数和最大子节点数。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 获取最多的子节点数</span>
<span class="token keyword">function</span> <span class="token function">getMax</span><span class="token punctuation">(</span><span class="token parameter">obj</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> max <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>obj<span class="token punctuation">.</span>children<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    max <span class="token operator">=</span> obj<span class="token punctuation">.</span>children<span class="token punctuation">.</span>length<span class="token punctuation">;</span>
    obj<span class="token punctuation">.</span>children<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token parameter">d</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> tmpMax <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getMax</span><span class="token punctuation">(</span>d<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>tmpMax <span class="token operator">></span> max<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        max <span class="token operator">=</span> tmpMax<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> max<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 获取最深层级数</span>
<span class="token keyword">function</span> <span class="token function">getDepth</span><span class="token punctuation">(</span><span class="token parameter">obj</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> depth <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>obj<span class="token punctuation">.</span>children<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    obj<span class="token punctuation">.</span>children<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token parameter">d</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token keyword">var</span> tmpDepth <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getDepth</span><span class="token punctuation">(</span>d<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>tmpDepth <span class="token operator">></span> depth<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        depth <span class="token operator">=</span> tmpDepth<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> <span class="token number">1</span> <span class="token operator">+</span> depth<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>同时，我们在每次更新节点状态时，重新进行 tree 的大小调整：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">updateChart</span><span class="token punctuation">(</span><span class="token parameter">source</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 大致计算需要放大的倍数</span>
  <span class="token keyword">var</span> scale <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token function">getDepth</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">8</span> <span class="token operator">||</span> <span class="token number">0.5</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token punctuation">(</span><span class="token function">getMax</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">12</span> <span class="token operator">||</span> <span class="token number">0.5</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 定义Tree层级，并设置宽高</span>
  <span class="token keyword">var</span> treemap <span class="token operator">=</span> d3<span class="token punctuation">.</span><span class="token function">tree</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">[</span>height <span class="token operator">*</span> scale<span class="token punctuation">,</span> width<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 其他处理</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>本节我们添加了鼠标操作，包括滚轮缩放和拖动，主要依靠 d3-zoom 模块来实现。同时，考虑文字重叠，也进行了些处理。<br>
细心的小伙伴们或许会发现 d3-drag 模块，骚年还没用到，不过或许区别在于整体的拖动和单个元素的拖动吧。<br>
<a href="https://github.com/godbasin/godbasin.github.io/tree/blog-codes/d3-tree-notes/4-zoom-amd-drag" target="_blank" rel="noopener noreferrer">此处查看项目代码<ExternalLinkIcon/></a><br>
<a href="http://d3.godbasin.com/4-zoom-amd-drag/index.html" target="_blank" rel="noopener noreferrer">此处查看页面效果<ExternalLinkIcon/></a></p>
</div></template>


