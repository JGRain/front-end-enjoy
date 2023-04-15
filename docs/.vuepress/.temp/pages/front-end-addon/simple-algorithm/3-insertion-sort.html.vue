<template><div><p>插入排序的 javascript 实现。</p>
<!--more-->
<h1 id="插入排序" tabindex="-1"><a class="header-anchor" href="#插入排序" aria-hidden="true">#</a> 插入排序</h1>
<h2 id="排序问题" tabindex="-1"><a class="header-anchor" href="#排序问题" aria-hidden="true">#</a> 排序问题</h2>
<ul>
<li>输入：n 个数的一个序列<code v-pre>&lt;a1, a2, ..., an&gt;</code></li>
<li>输出：输入序列的一个排列<code v-pre>&lt;a1', a2', ..., an'&gt;</code>，满足<code v-pre>a1' &lt;= a2' &lt;= ... &lt;= an'</code></li>
</ul>
<h2 id="思路" tabindex="-1"><a class="header-anchor" href="#思路" aria-hidden="true">#</a> 思路</h2>
<p>插入排序的工作方式像许多人排序一手扑克牌：</p>
<ol>
<li>左手为空，桌子上牌面向下</li>
<li>每次从桌子上拿走一张牌插入左手中正确的位置</li>
<li>为了找到正确位置，从右到左将它与已经在手中的每张牌进行比较，然后插入</li>
<li>重复步骤 2~3</li>
</ol>
<h2 id="js-实现" tabindex="-1"><a class="header-anchor" href="#js-实现" aria-hidden="true">#</a> js 实现</h2>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">insertionSort</span><span class="token punctuation">(</span><span class="token parameter">iArr</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> oArr <span class="token operator">=</span> <span class="token punctuation">[</span>iArr<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token keyword">var</span> n <span class="token operator">=</span> iArr<span class="token punctuation">.</span>length<span class="token punctuation">;</span>
  <span class="token comment">// 从左边开始，每次拿一个与已排列好的数组进行比较</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> n<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> j <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> j <span class="token operator">&lt;</span> i<span class="token punctuation">;</span> j<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>iArr<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">&lt;=</span> oArr<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 若介于小于该元素，则插入其前方</span>
        oArr<span class="token punctuation">.</span><span class="token function">splice</span><span class="token punctuation">(</span>j<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> iArr<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>j <span class="token operator">===</span> i <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 若比最后一个还大，则排在最右侧</span>
        oArr<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>iArr<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> oArr<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="验证" tabindex="-1"><a class="header-anchor" href="#验证" aria-hidden="true">#</a> 验证</h2>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token function">insertionSort</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 输出[1, 2, 3, 4, 5, 6]</span>

insertionSort<span class="token punctuation">[</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">12</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">134</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">34</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 输出[1, 1, 2, 2, 3, 3, 4, 5, 6, 12, 34, 134]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="单数组插入排序" tabindex="-1"><a class="header-anchor" href="#单数组插入排序" aria-hidden="true">#</a> 单数组插入排序</h2>
<h3 id="思路-1" tabindex="-1"><a class="header-anchor" href="#思路-1" aria-hidden="true">#</a> 思路</h3>
<p>这里在一个数组中进行插入排序：</p>
<ol>
<li>从第一个元素开始，该元素可以认为已经被排序</li>
<li>取出下一个元素，在已经排序的元素序列中从后向前扫描</li>
<li>如果该元素（已排序）小于新元素，将新元素插入该元素下一位置</li>
<li>重复步骤 3，直到找到已排序的元素小于或者等于新元素的位置，将新元素插入到该位置后</li>
<li>若无，则将新元素插入最左侧</li>
<li>重复步骤 2~5</li>
</ol>
<h3 id="js-实现-1" tabindex="-1"><a class="header-anchor" href="#js-实现-1" aria-hidden="true">#</a> js 实现</h3>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">insertionSort</span><span class="token punctuation">(</span><span class="token parameter">iArr</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> n <span class="token operator">=</span> iArr<span class="token punctuation">.</span>length<span class="token punctuation">;</span>
  <span class="token comment">// 从第一个元素开始，该元素可以认为已经被排序</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> n<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 取出下一个元素，在已经排序的元素序列中从后向前扫描</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> j <span class="token operator">=</span> i <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span> j <span class="token operator">>=</span> <span class="token number">0</span><span class="token punctuation">;</span> j<span class="token operator">--</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>iArr<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">>=</span> iArr<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 如果该元素（已排序）小于新元素，将新元素插入该元素下一位置</span>
        iArr<span class="token punctuation">.</span><span class="token function">splice</span><span class="token punctuation">(</span>j <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> iArr<span class="token punctuation">.</span><span class="token function">splice</span><span class="token punctuation">(</span>i<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>j <span class="token operator">===</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 如果已是最小元素，则插入最左侧</span>
        iArr<span class="token punctuation">.</span><span class="token function">splice</span><span class="token punctuation">(</span>j<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> iArr<span class="token punctuation">.</span><span class="token function">splice</span><span class="token punctuation">(</span>i<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> iArr<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="验证-1" tabindex="-1"><a class="header-anchor" href="#验证-1" aria-hidden="true">#</a> 验证</h3>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token function">insertionSort</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 输出[1, 2, 3, 4, 5, 6]</span>

insertionSort<span class="token punctuation">[</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">12</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">134</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">34</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 输出[1, 1, 2, 2, 3, 3, 4, 5, 6, 12, 34, 134]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


