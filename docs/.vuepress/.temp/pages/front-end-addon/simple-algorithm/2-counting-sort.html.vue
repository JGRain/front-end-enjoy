<template><div><p>计数排序的 javascript 实现。</p>
<!--more-->
<h1 id="计数排序" tabindex="-1"><a class="header-anchor" href="#计数排序" aria-hidden="true">#</a> 计数排序</h1>
<h2 id="排序问题" tabindex="-1"><a class="header-anchor" href="#排序问题" aria-hidden="true">#</a> 排序问题</h2>
<ul>
<li>输入：n 个数的一个序列<code v-pre>&lt;a1, a2, ..., an&gt;</code></li>
<li>输出：输入序列的一个排列<code v-pre>&lt;a1', a2', ..., an'&gt;</code>，满足<code v-pre>a1' &lt;= a2' &lt;= ... &lt;= an'</code></li>
</ul>
<h2 id="计数排序-1" tabindex="-1"><a class="header-anchor" href="#计数排序-1" aria-hidden="true">#</a> 计数排序</h2>
<p>计数排序（Counting sort）是一种稳定的线性时间排序算法。
计数排序使用一个额外的数组 C，其中第 i 个元素是待排序数组 A 中值等于 i 的元素的个数。然后根据数组 C 来将 A 中的元素排到正确的位置。</p>
<p>当输入的元素是 n 个 0 到 k 之间的整数时，它的运行时间是<code v-pre>Θ(n + k)</code>。计数排序不是比较排序，排序的速度快于任何比较排序算法。
由于用来计数的数组 C 的长度取决于待排序数组中数据的范围（等于待排序数组的最大值与最小值的差加上 1），这使得计数排序对于数据范围很大的数组，需要大量时间和内存。</p>
<ul>
<li>参考<a href="https://zh.wikipedia.org/wiki/%E8%AE%A1%E6%95%B0%E6%8E%92%E5%BA%8F" target="_blank" rel="noopener noreferrer">计数排序-wiki<ExternalLinkIcon/></a></li>
</ul>
<h2 id="思路" tabindex="-1"><a class="header-anchor" href="#思路" aria-hidden="true">#</a> 思路</h2>
<ol>
<li>找出待排序的数组中最大和最小的元素。</li>
<li>统计数组中每个值为<code v-pre>i</code>的元素出现的次数，存入数组<code v-pre>C</code>的第<code v-pre>i</code>项。</li>
<li>对所有的计数累加（从<code v-pre>C</code>中的第一个元素开始，每一项和前一项相加）。</li>
<li>反向填充目标数组：将每个元素<code v-pre>i</code>放在新数组的第<code v-pre>C(i)</code>项，每放一个元素就将<code v-pre>C(i)</code>减去 1。</li>
</ol>
<h2 id="js-基本思路实现" tabindex="-1"><a class="header-anchor" href="#js-基本思路实现" aria-hidden="true">#</a> js 基本思路实现</h2>
<p>这里我们先使用两个数组分别保存“基准”左边、右边的子集。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">countingSort</span><span class="token punctuation">(</span><span class="token parameter">iArr<span class="token punctuation">,</span> max</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> n <span class="token operator">=</span> iArr<span class="token punctuation">.</span>length<span class="token punctuation">;</span>
  <span class="token keyword">var</span> oArr <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token comment">// 创建长度max的数组，填充0</span>
  <span class="token keyword">var</span> <span class="token constant">C</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;=</span> max<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token constant">C</span><span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 遍历输入数组，填充C</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> j <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> j <span class="token operator">&lt;</span> n<span class="token punctuation">;</span> j<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token constant">C</span><span class="token punctuation">[</span>iArr<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token operator">++</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 遍历C，输出数组</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> k <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> k <span class="token operator">&lt;=</span> max<span class="token punctuation">;</span> k<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 按顺序将值推入输出数组，并将对应标志位减1</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token constant">C</span><span class="token punctuation">[</span>k<span class="token punctuation">]</span><span class="token operator">--</span> <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      oArr<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>k<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> oArr<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="验证" tabindex="-1"><a class="header-anchor" href="#验证" aria-hidden="true">#</a> 验证</h2>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token function">countingSort</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 输出[1, 2, 3, 4, 5, 6]</span>

<span class="token function">countingSort</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 输出[1, 1, 2, 3, 5]</span>

<span class="token function">countingSort</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">12</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">134</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">34</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token number">134</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 输出[1, 1, 2, 2, 3, 3, 4, 4, 5, 6, 12, 34, 134]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


