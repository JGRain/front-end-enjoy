<template><div><p>该系列用于记录一些使用方法、demo 以及原理分析。本文介绍 Vue 中多个元素或是组件的过渡效果。</p>
<!--more-->
<h1 id="多元素-组件过渡" tabindex="-1"><a class="header-anchor" href="#多元素-组件过渡" aria-hidden="true">#</a> 多元素/组件过渡</h1>
<h2 id="多元素过渡" tabindex="-1"><a class="header-anchor" href="#多元素过渡" aria-hidden="true">#</a> 多元素过渡</h2>
<p>这里的多元素过渡，通常指的是 v-if 和 v-else 等指令绑定元素状态切换的动画效果。</p>
<p>Vue 官网里面提到一个需要注意的地方：
当有相同标签名的元素切换时，需要通过 key 特性设置唯一的值来标记以让 Vue 区分它们，否则 Vue 为了效率只会替换相同标签内部的内容。</p>
<p>嘛，这个就跟 v-for 中绑定 key 是差不多原理的，总之是追踪元素，然后来进行操作或是优化更新算法。</p>
<p>这里看看<a href="https://cn.vuejs.org/v2/guide/transitions.html#%E5%A4%9A%E4%B8%AA%E5%85%83%E7%B4%A0%E7%9A%84%E8%BF%87%E6%B8%A1" target="_blank" rel="noopener noreferrer">官网<ExternalLinkIcon/></a>的例子：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>transition</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">v-if</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>docState === 'saved'<span class="token punctuation">"</span></span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>saved<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
    Edit
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">v-if</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>docState === 'edited'<span class="token punctuation">"</span></span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>edited<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
    Save
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">v-if</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>docState === 'editing'<span class="token punctuation">"</span></span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>editing<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
    Cancel
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>transition</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="多组件过渡" tabindex="-1"><a class="header-anchor" href="#多组件过渡" aria-hidden="true">#</a> 多组件过渡</h2>
<p>多个组件的过渡要使用动态组件。</p>
<p>什么是动态组件呢？通过使用保留的 component 元素，并对其 is 特性进行动态绑定，你可以在同一个挂载点动态切换多个组件：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>component</span> <span class="token attr-name"><span class="token namespace">v-bind:</span>is</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>currentView<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
  <span class="token comment">&lt;!-- 组件在 vm.currentview 变化时改变！ --></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>component</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> vm <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">el</span><span class="token operator">:</span> <span class="token string">"#example"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">currentView</span><span class="token operator">:</span> <span class="token string">"home"</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">components</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">home</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token comment">/* ... */</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token literal-property property">posts</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token comment">/* ... */</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token literal-property property">archive</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token comment">/* ... */</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里要加过渡的话，就是酱紫：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>transition</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>component-fade<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>component</span> <span class="token attr-name"><span class="token namespace">v-bind:</span>is</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>currentView<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>component</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>transition</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>路由组件的过渡，大概也是属于这种吧（没仔细研究过，瞎说的）~</p>
<h2 id="过渡模式" tabindex="-1"><a class="header-anchor" href="#过渡模式" aria-hidden="true">#</a> 过渡模式</h2>
<p>多元素和多组件的过渡中，会有上一个的离开以及下一个的进入的情况，于是便有了这个过渡模式。</p>
<p>Vue 提供了以下过渡模式：</p>
<ul>
<li><strong>in-out</strong>：新元素先进行过渡，完成之后当前元素过渡离开。</li>
<li><strong>out-in</strong>：当前元素先进行过渡，完成之后新元素过渡进入。</li>
</ul>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>transition</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>fade<span class="token punctuation">"</span></span> <span class="token attr-name">mode</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>out-in<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
  <span class="token comment">&lt;!-- ... the buttons ... --></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>transition</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当然，在不做任何设置的时候，transition 的默认行为是：进入和离开同时发生。</p>
<h2 id="实现逻辑" tabindex="-1"><a class="header-anchor" href="#实现逻辑" aria-hidden="true">#</a> 实现逻辑</h2>
<p>其实多元素和组件的过渡，大致总体是跟单个元素的过渡相似的，大概是多了切换的过程，也就是一个结束另外一个开始的过渡把。</p>
<p>所以这里可以看看以下的源码：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// replace old child transition data with fresh one</span>
<span class="token comment">// important for dynamic transitions!</span>
<span class="token keyword">const</span> <span class="token literal-property property">oldData</span><span class="token operator">:</span> Object <span class="token operator">=</span>
  oldChild <span class="token operator">&amp;&amp;</span> <span class="token punctuation">(</span>oldChild<span class="token punctuation">.</span>data<span class="token punctuation">.</span>transition <span class="token operator">=</span> <span class="token function">extend</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> data<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// handle transition mode</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span>mode <span class="token operator">===</span> <span class="token string">"out-in"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// return placeholder node and queue update when leave finishes</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>_leaving <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
  <span class="token function">mergeVNodeHook</span><span class="token punctuation">(</span>oldData<span class="token punctuation">,</span> <span class="token string">"afterLeave"</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>_leaving <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">$forceUpdate</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token function">placeholder</span><span class="token punctuation">(</span>h<span class="token punctuation">,</span> rawChild<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>mode <span class="token operator">===</span> <span class="token string">"in-out"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isAsyncPlaceholder</span><span class="token punctuation">(</span>child<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> oldRawChild<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">let</span> delayedLeave<span class="token punctuation">;</span>
  <span class="token keyword">const</span> <span class="token function-variable function">performLeave</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token function">delayedLeave</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token function">mergeVNodeHook</span><span class="token punctuation">(</span>data<span class="token punctuation">,</span> <span class="token string">"afterEnter"</span><span class="token punctuation">,</span> performLeave<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">mergeVNodeHook</span><span class="token punctuation">(</span>data<span class="token punctuation">,</span> <span class="token string">"enterCancelled"</span><span class="token punctuation">,</span> performLeave<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">mergeVNodeHook</span><span class="token punctuation">(</span>oldData<span class="token punctuation">,</span> <span class="token string">"delayLeave"</span><span class="token punctuation">,</span> <span class="token parameter">leave</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    delayedLeave <span class="token operator">=</span> leave<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里大概的操作是：</p>
<ol>
<li>当 mode 为 'out-in' 时，将下一个元素的插入时间延后，等待上一个元素的离开动画完成后，再触发下一个元素的插入和进入动画。</li>
<li>当 mode 为 'in-out' 时，将上一个元素的移除时间延后，等待下一个元素的进入动画完成后，再触发上一个元素的移除和离开动画。</li>
</ol>
<p>因为前面几节我们也分析过，进入动画和元素插入捆绑，而离开动画和元素移除捆绑，所以这里只需要控制元素的延时变更，就能得到动画控制的效果了。</p>
<h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>本节我们介绍了 Vue 中多元素和多组件的过渡，其实他们也可以算是一个东西啦。在前面几节的基础上，这块内容的理解相对简单些。</p>
</div></template>


