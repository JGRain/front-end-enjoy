<template><div><p>快速选择（Quick-Select）的 javascript 实现。</p>
<!--more-->
<h1 id="快速选择" tabindex="-1"><a class="header-anchor" href="#快速选择" aria-hidden="true">#</a> 快速选择</h1>
<h2 id="问题" tabindex="-1"><a class="header-anchor" href="#问题" aria-hidden="true">#</a> 问题</h2>
<ul>
<li>输入：n 个数的一个序列<code v-pre>&lt;a1, a2, ..., an&gt;</code></li>
<li>输出：找到第 k 个最小数字的元素</li>
</ul>
<h2 id="快速选择-1" tabindex="-1"><a class="header-anchor" href="#快速选择-1" aria-hidden="true">#</a> 快速选择</h2>
<p>快速选择（Quickselect）是一种从无序列表找到第 k 小元素的选择算法。它从原理上来说与快速排序有关。</p>
<p>快速选择的总体思路与快速排序一致，选择一个元素作为基准来对元素进行分区，将小于和大于基准的元素分在基准左边和右边的两个区域。不同的是，快速选择并不递归访问双边，而是只递归进入一边的元素中继续寻找。这降低了平均时间复杂度，从<code v-pre>O(n log n)</code>至<code v-pre>O(n)</code>，不过最坏情况仍然是<code v-pre>O(n2)</code>。</p>
<p>与快速排序一样，快速选择一般是以原地算法的方式实现，除了选出第 k 小的元素，数据也得到了部分地排序。</p>
<h2 id="思路" tabindex="-1"><a class="header-anchor" href="#思路" aria-hidden="true">#</a> 思路</h2>
<ol>
<li>从数列中挑出一个元素，称为&quot;基准&quot;（pivot）。</li>
<li>重新排序数列，所有元素比基准值小的摆放在基准前面，所有元素比基准值大的摆在基准的后面（相同的数可以到任一边）。在这个分区结束之后，该基准就处于数列的中间位置。</li>
<li>判断第 k 个最小元素位于左侧还是右侧，然后对该侧进行递归。</li>
</ol>
<ul>
<li>参考<a href="https://zh.wikipedia.org/wiki/%E5%BF%AB%E9%80%9F%E9%80%89%E6%8B%A9" target="_blank" rel="noopener noreferrer">快速选择-wiki<ExternalLinkIcon/></a></li>
</ul>
<h2 id="js-基本思路实现" tabindex="-1"><a class="header-anchor" href="#js-基本思路实现" aria-hidden="true">#</a> js 基本思路实现</h2>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 交换数组值</span>
<span class="token keyword">function</span> <span class="token function">swap</span><span class="token punctuation">(</span><span class="token parameter">arr<span class="token punctuation">,</span> a<span class="token punctuation">,</span> b</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>a <span class="token operator">==</span> b<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">var</span> c <span class="token operator">=</span> arr<span class="token punctuation">[</span>a<span class="token punctuation">]</span><span class="token punctuation">;</span>
  arr<span class="token punctuation">[</span>a<span class="token punctuation">]</span> <span class="token operator">=</span> arr<span class="token punctuation">[</span>b<span class="token punctuation">]</span><span class="token punctuation">;</span>
  arr<span class="token punctuation">[</span>b<span class="token punctuation">]</span> <span class="token operator">=</span> c<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">quickSelect</span><span class="token punctuation">(</span><span class="token parameter">iArr<span class="token punctuation">,</span> start<span class="token punctuation">,</span> end<span class="token punctuation">,</span> k</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> n <span class="token operator">=</span> end <span class="token operator">-</span> start<span class="token punctuation">;</span>
  <span class="token comment">// 若只有一个或者没有，则返回</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>n <span class="token operator">&lt;=</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> iArr<span class="token punctuation">[</span>start<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 若有多个，则选择基准进行位置调整，递归处理</span>
  <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token keyword">var</span> p <span class="token operator">=</span> end <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span> <span class="token comment">// 选取最后一个作为基准</span>
    <span class="token keyword">var</span> pivot <span class="token operator">=</span> iArr<span class="token punctuation">[</span>p<span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token comment">// 获取基准值</span>
    <span class="token keyword">var</span> leftIndex <span class="token operator">=</span> start<span class="token punctuation">;</span> <span class="token comment">// 记录左侧列表位置</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> n <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      arrVal <span class="token operator">=</span> iArr<span class="token punctuation">[</span>start <span class="token operator">+</span> i<span class="token punctuation">]</span><span class="token punctuation">;</span>
      <span class="token comment">// 若小于基准，则排列在左侧</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>arrVal <span class="token operator">&lt;=</span> pivot<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">swap</span><span class="token punctuation">(</span>iArr<span class="token punctuation">,</span> leftIndex<span class="token operator">++</span><span class="token punctuation">,</span> start <span class="token operator">+</span> i<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token comment">// 若大于基准，继续</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 交换基准至中间</span>
    <span class="token function">swap</span><span class="token punctuation">(</span>iArr<span class="token punctuation">,</span> leftIndex<span class="token punctuation">,</span> p<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>leftIndex <span class="token operator">></span> k <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 若k &lt; 基准位置，递归排序左侧</span>
      <span class="token keyword">return</span> <span class="token function">quickSelect</span><span class="token punctuation">(</span>iArr<span class="token punctuation">,</span> start<span class="token punctuation">,</span> leftIndex<span class="token punctuation">,</span> k<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>leftIndex <span class="token operator">&lt;</span> k <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 若k > 基准位置，递归排序右侧</span>
      <span class="token keyword">return</span> <span class="token function">quickSelect</span><span class="token punctuation">(</span>iArr<span class="token punctuation">,</span> leftIndex <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span> end<span class="token punctuation">,</span> k<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token comment">// 若k = 基准位置，返回</span>
      <span class="token keyword">return</span> iArr<span class="token punctuation">[</span>k <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


