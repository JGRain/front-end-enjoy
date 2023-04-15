<template><div><p>快速排序的 javascript 实现。</p>
<!--more-->
<h1 id="简单快速排序" tabindex="-1"><a class="header-anchor" href="#简单快速排序" aria-hidden="true">#</a> 简单快速排序</h1>
<h2 id="排序问题" tabindex="-1"><a class="header-anchor" href="#排序问题" aria-hidden="true">#</a> 排序问题</h2>
<ul>
<li>输入：n 个数的一个序列<code v-pre>&lt;a1, a2, ..., an&gt;</code></li>
<li>输出：输入序列的一个排列<code v-pre>&lt;a1', a2', ..., an'&gt;</code>，满足<code v-pre>a1' &lt;= a2' &lt;= ... &lt;= an'</code></li>
</ul>
<h2 id="思路" tabindex="-1"><a class="header-anchor" href="#思路" aria-hidden="true">#</a> 思路</h2>
<p>快速排序使用分治法（Divide and conquer）策略来把一个序列（list）分为两个子序列（sub-lists）。</p>
<p>步骤为：</p>
<ol>
<li>从数列中挑出一个元素，称为&quot;基准&quot;（pivot），</li>
<li>重新排序数列，所有元素比基准值小的摆放在基准前面，所有元素比基准值大的摆在基准的后面（相同的数可以到任一边）。在这个分区结束之后，该基准就处于数列的中间位置。这个称为分区（partition）操作。</li>
<li>递归地（recursive）把小于基准值元素的子数列和大于基准值元素的子数列排序。</li>
</ol>
<p>递归的最底部情形，是数列的大小是零或一，也就是永远都已经被排序好了。虽然一直递归下去，但是这个算法总会结束，因为在每次的迭代（iteration）中，它至少会把一个元素摆到它最后的位置去。</p>
<h2 id="js-基本思路实现" tabindex="-1"><a class="header-anchor" href="#js-基本思路实现" aria-hidden="true">#</a> js 基本思路实现</h2>
<p>这里我们先使用两个数组分别保存“基准”左边、右边的子集。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">fakeQuickSort</span><span class="token punctuation">(</span><span class="token parameter">iArr</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> n <span class="token operator">=</span> iArr<span class="token punctuation">.</span>length<span class="token punctuation">;</span>
  <span class="token comment">// 若只有一个，则返回</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>n <span class="token operator">&lt;=</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> iArr<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 若有多个，则选择基准进行分组，递归处理</span>
  <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token keyword">var</span> p <span class="token operator">=</span> <span class="token function">parseInt</span><span class="token punctuation">(</span>n <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">var</span> pivot <span class="token operator">=</span> iArr<span class="token punctuation">[</span>p<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">var</span> leftArr <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
      rightArr <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
      arrVal<span class="token punctuation">;</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> n <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      arrVal <span class="token operator">=</span> iArr<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>arrVal <span class="token operator">&lt;=</span> pivot<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 小于基准放置左侧</span>
        leftArr<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>arrVal<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token comment">// 大于基准放置右侧</span>
        rightArr<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>arrVal<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 递归计算左边、右边子集，将数组合并返回</span>
    <span class="token keyword">return</span> <span class="token function">fakeQuickSort</span><span class="token punctuation">(</span>leftArr<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">concat</span><span class="token punctuation">(</span>
      <span class="token punctuation">[</span>pivot<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">concat</span><span class="token punctuation">(</span><span class="token function">fakeQuickSort</span><span class="token punctuation">(</span>rightArr<span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="验证" tabindex="-1"><a class="header-anchor" href="#验证" aria-hidden="true">#</a> 验证</h2>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token function">fakeQuickSort</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 输出[1, 2, 3, 4, 5, 6]</span>

<span class="token function">fakeQuickSort</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 输出[1, 1, 2, 3, 5]</span>

<span class="token function">fakeQuickSort</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">12</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">134</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">34</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 输出[1, 1, 2, 2, 3, 3, 4, 4, 5, 6, 12, 34, 134]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="快速排序" tabindex="-1"><a class="header-anchor" href="#快速排序" aria-hidden="true">#</a> 快速排序</h1>
<h2 id="原址排序" tabindex="-1"><a class="header-anchor" href="#原址排序" aria-hidden="true">#</a> 原址排序</h2>
<p>在排序算法中，如果输入数组中仅有常数个元素需要在排序过程中存储在数组之外，则称排序算法是原址的。</p>
<p>插入排序、堆排序、快速排序等都是原址排序。
归并排序不是原址的。</p>
<p>上面简单版本的缺点是，它需要 Ω(n)的额外存储空间，也就跟归并排序一样不好。额外需要的存储器空间配置，在实际上的实现，也会极度影响速度和缓存的性能。有一个比较复杂使用原地（in-place）分区算法的版本，且在好的基准选择上，平均可以达到 O(log n)空间的使用复杂度。</p>
<h2 id="快速排序思路" tabindex="-1"><a class="header-anchor" href="#快速排序思路" aria-hidden="true">#</a> 快速排序思路</h2>
<p>上面我们移动位置是通过建立新的子集数组伪装的，这里我们则需要实现真正的位置交换。</p>
<ul>
<li>获取基准值</li>
<li>将低于基准值的排列在左侧，剩下的排列在右侧</li>
<li>分别对左侧和右侧进行递归排序</li>
</ul>
<p>这是原址排序算法，它分区了标示为&quot;左边（left）&quot;和&quot;右边（right）&quot;的序列部分，借由移动小于 a[pivotIndex]的所有元素到子序列的开头，留下所有大于或等于的元素接在他们后面。
在这个过程它也为基准元素找寻最后摆放的位置，也就是它回传的值。它暂时地把基准元素移到子序列的结尾，而不会被前述方式影响到。</p>
<p>由于算法只使用交换，因此最后的数列与原先的数列拥有一样的元素。要注意的是，一个元素在到达它的最后位置前，可能会被交换很多次。</p>
<p>参考<a href="https://zh.wikipedia.org/wiki/%E5%BF%AB%E9%80%9F%E6%8E%92%E5%BA%8F" target="_blank" rel="noopener noreferrer">快速排序-wiki<ExternalLinkIcon/></a></p>
<h2 id="js-基本思路实现-1" tabindex="-1"><a class="header-anchor" href="#js-基本思路实现-1" aria-hidden="true">#</a> js 基本思路实现</h2>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 交换数组值</span>
<span class="token keyword">function</span> <span class="token function">swap</span><span class="token punctuation">(</span><span class="token parameter">arr<span class="token punctuation">,</span> a<span class="token punctuation">,</span> b</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>a <span class="token operator">==</span> b<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">var</span> c <span class="token operator">=</span> arr<span class="token punctuation">[</span>a<span class="token punctuation">]</span><span class="token punctuation">;</span>
  arr<span class="token punctuation">[</span>a<span class="token punctuation">]</span> <span class="token operator">=</span> arr<span class="token punctuation">[</span>b<span class="token punctuation">]</span><span class="token punctuation">;</span>
  arr<span class="token punctuation">[</span>b<span class="token punctuation">]</span> <span class="token operator">=</span> c<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">quickSort</span><span class="token punctuation">(</span><span class="token parameter">iArr<span class="token punctuation">,</span> start<span class="token punctuation">,</span> end</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> n <span class="token operator">=</span> end <span class="token operator">-</span> start<span class="token punctuation">;</span>
  <span class="token comment">// 若只有一个或者没有，则返回</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>n <span class="token operator">&lt;=</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
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
    <span class="token comment">// 递归排序左侧</span>
    <span class="token function">quickSort</span><span class="token punctuation">(</span>iArr<span class="token punctuation">,</span> start<span class="token punctuation">,</span> leftIndex<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 递归排序右侧</span>
    <span class="token function">quickSort</span><span class="token punctuation">(</span>iArr<span class="token punctuation">,</span> leftIndex <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span> end<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> iArr<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="验证-1" tabindex="-1"><a class="header-anchor" href="#验证-1" aria-hidden="true">#</a> 验证</h2>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token function">quickSort</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 输出[1, 2, 3, 4, 5, 6]</span>

<span class="token function">quickSort</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 输出[1, 1, 2, 3, 5]</span>

<span class="token function">quickSort</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">12</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">134</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">34</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">13</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 输出[1, 1, 2, 2, 3, 3, 4, 4, 5, 6, 12, 34, 134]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


