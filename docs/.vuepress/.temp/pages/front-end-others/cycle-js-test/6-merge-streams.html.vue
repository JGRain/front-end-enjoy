<template><div><p>因为对 Rxjs 的好感玩上了 Cycle.js，该系列用于记录使用该框架的一些笔记。本文介绍 xStream 的合流处理，并手动实现其中的 combine 方法。</p>
<!--more-->
<h1 id="合流" tabindex="-1"><a class="header-anchor" href="#合流" aria-hidden="true">#</a> 合流</h1>
<h2 id="xstream" tabindex="-1"><a class="header-anchor" href="#xstream" aria-hidden="true">#</a> <a href="https://github.com/staltz/xStream" target="_blank" rel="noopener noreferrer">xStream<ExternalLinkIcon/></a></h2>
<p>xStream 和 rxjs 类似，都是 reactive programming 在 js 上的实现。
xStream 比较轻量级一点，特别为 Cycle.js 做了兼容。</p>
<p>xStream 拥有四种基础类型：</p>
<ol>
<li>
<p><a href="https://github.com/staltz/xstream#stream" target="_blank" rel="noopener noreferrer">流（<code v-pre>Stream</code>）<ExternalLinkIcon/></a>：一个拥有多个事件监听器的事件发射器。</p>
</li>
<li>
<p><a href="https://github.com/staltz/xstream#listener" target="_blank" rel="noopener noreferrer">监听器（<code v-pre>Listener</code>）<ExternalLinkIcon/></a>：一个带有<code v-pre>next</code>, <code v-pre>error</code>, 和<code v-pre>complete</code>其中 1-3 个函数的对象。</p>
</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> listener <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token function-variable function">next</span><span class="token operator">:</span> <span class="token parameter">value</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"The Stream gave me a value: "</span><span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token function-variable function">error</span><span class="token operator">:</span> <span class="token parameter">err</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">"The Stream gave me an error: "</span><span class="token punctuation">,</span> err<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token function-variable function">complete</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"The Stream told me it is done."</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3">
<li><a href="https://github.com/staltz/xstream#producer" target="_blank" rel="noopener noreferrer">发射器（<code v-pre>Producer</code>）<ExternalLinkIcon/></a>：发射通过流传播的事件。</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> producer <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token function-variable function">start</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">listener</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>id <span class="token operator">=</span> <span class="token function">setInterval</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> listener<span class="token punctuation">.</span><span class="token function">next</span><span class="token punctuation">(</span><span class="token string">"你好"</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>

  <span class="token function-variable function">stop</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">clearInterval</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>id<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>

  <span class="token literal-property property">id</span><span class="token operator">:</span> <span class="token number">0</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token comment">// 每隔1秒发送“你好”</span>
<span class="token keyword">var</span> stream <span class="token operator">=</span> xs<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span>producer<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="4">
<li><a href="https://github.com/staltz/xstream#memorystream" target="_blank" rel="noopener noreferrer">记忆流（<code v-pre>MemoryStream</code>）<ExternalLinkIcon/></a>：可用于保存最近一次数据。</li>
</ol>
<p>常用工厂函数：<code v-pre>create</code>, <code v-pre>from</code>, <code v-pre>of</code>, <code v-pre>merge</code>, <code v-pre>combine</code>等。
常用方法和操作：<code v-pre>addListener</code>, <code v-pre>removeListener</code>, <code v-pre>subscribe</code>, <code v-pre>map</code>, <code v-pre>mapTo</code>, <code v-pre>filter</code>, <code v-pre>startWith</code>等。
更多说明可以查看<a href="https://github.com/staltz/xStream" target="_blank" rel="noopener noreferrer">官方文档<ExternalLinkIcon/></a>，虽然上面说明也不是很详细。</p>
<h2 id="xstream-合流" tabindex="-1"><a class="header-anchor" href="#xstream-合流" aria-hidden="true">#</a> xstream 合流</h2>
<p>这里面有两个工厂方法：<code v-pre>merge</code> 和 <code v-pre>combine</code>。</p>
<ul>
<li><code v-pre>merge(stream1, stream2)</code></li>
</ul>
<p>该方法会将多个流合在一起，同步更新流。</p>
<div class="language-markdown line-numbers-mode" data-ext="md"><pre v-pre class="language-markdown"><code>--1----2-----3--------4---
----a-----b----c---d------
merge
--1-a--2--b--3-c---d--4---
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>combine(stream1, stream2)</code></li>
</ul>
<p>该方法会将多个输入流合入，并始终返回各个流上一次的合流。</p>
<div class="language-markdown line-numbers-mode" data-ext="md"><pre v-pre class="language-markdown"><code>--1----2-----3--------4---
----a-----b-----c--d------
combine
----1a-2a-2b-3b-3c-3d-4d--
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用方式：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">const</span> stream1 <span class="token operator">=</span> xs<span class="token punctuation">.</span><span class="token function">of</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> stream2 <span class="token operator">=</span> xs<span class="token punctuation">.</span><span class="token function">of</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

xs<span class="token punctuation">.</span><span class="token function">combine</span><span class="token punctuation">(</span>stream1<span class="token punctuation">,</span> stream2<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">combinedEmissions</span> <span class="token operator">=></span> <span class="token punctuation">[</span><span class="token operator">...</span>combinedEmissions<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="combine-流的实现" tabindex="-1"><a class="header-anchor" href="#combine-流的实现" aria-hidden="true">#</a> combine 流的实现</h2>
<p>这里，本骚年开始的时候没有发现<code v-pre>combine</code>方法合流，一直用的<code v-pre>merge</code>，然后自己弄了个实现方式，直至看到了<code v-pre>combine</code>[捂脸]。</p>
<p>既然写都写了，可以分享一下，不知道是不是<code v-pre>combine</code>的实现，但最后功能使用是一样的：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> xs <span class="token keyword">from</span> <span class="token string">"xstream"</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">merge</span><span class="token punctuation">(</span><span class="token parameter"><span class="token operator">...</span>origins</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// state用来缓存上次状态</span>
  <span class="token keyword">let</span> <span class="token literal-property property">state</span><span class="token operator">:</span> any <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token comment">// 获取输入的次序，并将每个流匹配到对应的次序</span>
  <span class="token keyword">let</span> keys <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">keys</span><span class="token punctuation">(</span>origins<span class="token punctuation">)</span><span class="token punctuation">;</span>
  keys<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token parameter">key</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    origins<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> origins<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">x</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token keyword">let</span> y <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
      y<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> x<span class="token punctuation">;</span>
      <span class="token keyword">return</span> y<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> xs<span class="token punctuation">.</span><span class="token function">merge</span><span class="token punctuation">(</span><span class="token operator">...</span>origins<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">res</span><span class="token operator">:</span> any</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token comment">// 判断更新的流，更新对应的流</span>
    keys<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token parameter">key</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      state<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> res<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">?</span> res<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">:</span> state<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 输出数组</span>
    <span class="token keyword">return</span> <span class="token punctuation">[</span><span class="token operator">...</span>state<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当然，这个功能最后使用的时候，有个跟<code v-pre>combine</code>不一样的地方：</p>
<div class="language-markdown line-numbers-mode" data-ext="md"><pre v-pre class="language-markdown"><code>--1----2-----3--------4---
----a-----b-----c--d------
my merge
--1-1a-2a-2b-3b-3c-3d-4d--

--1----2-----3--------4---
----a-----b-----c--d------
combine
----1a-2a-2b-3b-3c-3d-4d--
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>也就是说，第一次单流流动的时候也是有更新和输出的。</p>
<h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>这节主要简单介绍了 xStream，以及合流相关方法和其中的一些实现探索。<br>
目前还没有解决第四节的问题，但是距离也一步步跟进了，我们慢慢深入探索，一些浅显的东西也便会出来了。</p>
</div></template>


