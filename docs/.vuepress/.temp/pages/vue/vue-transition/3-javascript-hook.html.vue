<template><div><p>该系列用于记录一些使用方法、demo 以及原理分析。本文介绍使用 Javascript 钩子来实现动画效果的过程。</p>
<!--more-->
<h1 id="javascript-钩子" tabindex="-1"><a class="header-anchor" href="#javascript-钩子" aria-hidden="true">#</a> JavaScript 钩子</h1>
<h2 id="完整的钩子信息" tabindex="-1"><a class="header-anchor" href="#完整的钩子信息" aria-hidden="true">#</a> 完整的钩子信息</h2>
<p>这里我们直接贴出<a href="https://cn.vuejs.org/v2/guide/transitions.html#JavaScript-%E9%92%A9%E5%AD%90" target="_blank" rel="noopener noreferrer">官网<ExternalLinkIcon/></a>的展示：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>transition</span>
  <span class="token attr-name"><span class="token namespace">v-on:</span>before-enter</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>beforeEnter<span class="token punctuation">"</span></span>
  <span class="token attr-name"><span class="token namespace">v-on:</span>enter</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>enter<span class="token punctuation">"</span></span>
  <span class="token attr-name"><span class="token namespace">v-on:</span>after-enter</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>afterEnter<span class="token punctuation">"</span></span>
  <span class="token attr-name"><span class="token namespace">v-on:</span>enter-cancelled</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>enterCancelled<span class="token punctuation">"</span></span>
  <span class="token attr-name"><span class="token namespace">v-on:</span>before-leave</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>beforeLeave<span class="token punctuation">"</span></span>
  <span class="token attr-name"><span class="token namespace">v-on:</span>leave</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>leave<span class="token punctuation">"</span></span>
  <span class="token attr-name"><span class="token namespace">v-on:</span>after-leave</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>afterLeave<span class="token punctuation">"</span></span>
  <span class="token attr-name"><span class="token namespace">v-on:</span>leave-cancelled</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>leaveCancelled<span class="token punctuation">"</span></span>
<span class="token punctuation">></span></span>
  <span class="token comment">&lt;!-- ... --></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>transition</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// ...</span>
<span class="token literal-property property">methods</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  <span class="token comment">// --------</span>
  <span class="token comment">// 进入中</span>
  <span class="token comment">// --------</span>

  <span class="token function-variable function">beforeEnter</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">el</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// ...</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token comment">// 此回调函数是可选项的设置</span>
  <span class="token comment">// 与 CSS 结合时使用</span>
  <span class="token function-variable function">enter</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">el<span class="token punctuation">,</span> done</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// ...</span>
    <span class="token function">done</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token function-variable function">afterEnter</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">el</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// ...</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token function-variable function">enterCancelled</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">el</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// ...</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>

  <span class="token comment">// --------</span>
  <span class="token comment">// 离开时</span>
  <span class="token comment">// --------</span>

  <span class="token function-variable function">beforeLeave</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">el</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// ...</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token comment">// 此回调函数是可选项的设置</span>
  <span class="token comment">// 与 CSS 结合时使用</span>
  <span class="token function-variable function">leave</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">el<span class="token punctuation">,</span> done</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// ...</span>
    <span class="token function">done</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token function-variable function">afterLeave</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">el</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// ...</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token comment">// leaveCancelled 只用于 v-show 中</span>
  <span class="token function-variable function">leaveCancelled</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">el</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// ...</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里对进入和离开的动画钩子说明也比较清晰了，我们来看个 demo：</p>
<h3 id="使用-jquery-的例子" tabindex="-1"><a class="header-anchor" href="#使用-jquery-的例子" aria-hidden="true">#</a> 使用 jQuery 的例子</h3>
<p>官方提供一个使用 Velocity.js 的例子，这块本骚年不熟悉，就直接拿个最简单的 jQuery 动画来写把~</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>example-4<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>show = !show<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
    Toggle
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>transition</span> <span class="token attr-name"><span class="token namespace">v-on:</span>enter</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>enter<span class="token punctuation">"</span></span> <span class="token attr-name"><span class="token namespace">v-on:</span>leave</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>leave<span class="token punctuation">"</span></span> <span class="token attr-name"><span class="token namespace">v-bind:</span>css</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>false<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span> <span class="token attr-name">v-if</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>show<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
      Demo
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>transition</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">el</span><span class="token operator">:</span> <span class="token string">"#example-4"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">show</span><span class="token operator">:</span> <span class="token boolean">false</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">methods</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token function-variable function">enter</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">el<span class="token punctuation">,</span> done</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token comment">// 元素已被插入 DOM</span>
      <span class="token comment">// 在动画结束后调用 done</span>
      <span class="token function">$</span><span class="token punctuation">(</span>el<span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">css</span><span class="token punctuation">(</span><span class="token string">"opacity"</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">animate</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">opacity</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token literal-property property">fontSize</span><span class="token operator">:</span> <span class="token string">"100px"</span> <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">,</span> done<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function-variable function">leave</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">el<span class="token punctuation">,</span> done</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token comment">// 与 enter 相同</span>
      <span class="token function">$</span><span class="token punctuation">(</span>el<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">animate</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">opacity</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token literal-property property">fontSize</span><span class="token operator">:</span> <span class="token string">"0px"</span> <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">,</span> done<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看看<a href="https://jsfiddle.net/41fuumkz/6/" target="_blank" rel="noopener noreferrer">这里的 demo<ExternalLinkIcon/></a>。</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/transition2.1.8.png" alt="image"></p>
<h3 id="初始渲染" tabindex="-1"><a class="header-anchor" href="#初始渲染" aria-hidden="true">#</a> 初始渲染</h3>
<p>Vue 的动画提供了一个初始渲染的开关，指的是第一次展示（而不是第一次切换）的时候是否需要动画效果。</p>
<p>具体可以看看上面的例子，当我们把 show 的默认值设置为 true 的时候，初次展示并不会加载进入动画。</p>
<p>但是当我们在 transition 组件中添加 appear 属性时，则在初次展示时也会加载进入动画：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>example-4<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">@click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>show = !show<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
    Toggle
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>transition</span> <span class="token attr-name">appear</span> <span class="token attr-name"><span class="token namespace">v-on:</span>enter</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>enter<span class="token punctuation">"</span></span> <span class="token attr-name"><span class="token namespace">v-on:</span>leave</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>leave<span class="token punctuation">"</span></span> <span class="token attr-name"><span class="token namespace">v-bind:</span>css</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>false<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span> <span class="token attr-name">v-if</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>show<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
      Demo
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>transition</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以查看<a href="https://jsfiddle.net/godbasin/41fuumkz/8/" target="_blank" rel="noopener noreferrer">demo<ExternalLinkIcon/></a>，尝试将 appear 去掉试试（<a href="https://jsfiddle.net/godbasin/41fuumkz/7/" target="_blank" rel="noopener noreferrer">demo<ExternalLinkIcon/></a>），看看区别就能理解了~</p>
<p>当然，你也可以绑定 appear 专属的动画效果：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>transition</span>
  <span class="token attr-name">appear</span>
  <span class="token attr-name"><span class="token namespace">v-on:</span>before-appear</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>customBeforeAppearHook<span class="token punctuation">"</span></span>
  <span class="token attr-name"><span class="token namespace">v-on:</span>appear</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>customAppearHook<span class="token punctuation">"</span></span>
  <span class="token attr-name"><span class="token namespace">v-on:</span>after-appear</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>customAfterAppearHook<span class="token punctuation">"</span></span>
  <span class="token attr-name"><span class="token namespace">v-on:</span>appear-cancelled</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>customAppearCancelledHook<span class="token punctuation">"</span></span>
<span class="token punctuation">></span></span>
  <span class="token comment">&lt;!-- ... --></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>transition</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="实现逻辑" tabindex="-1"><a class="header-anchor" href="#实现逻辑" aria-hidden="true">#</a> 实现逻辑</h3>
<p>上一节<RouterLink to="/vue/vue-transition/1-transition-component.html">1. transition 组件》</RouterLink>中，我们详细描述了在使用 CSS 过渡和动画的时候，具体的实现原理。</p>
<p>而 Javascript 钩子的实现逻辑其实很简单：</p>
<ol>
<li>检测组件是否使用了 Javascript 钩子。</li>
<li>若使用了 Javascript 钩子，则这些钩子函数将在恰当的时机被调用。</li>
</ol>
<p>当然这些钩子分别穿插在各个地方，顺序的话也很明了。这里以离开动画为例子，我们来看看这段被我简化后的代码：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">leave</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">vnode</span><span class="token operator">:</span> VNodeWithData<span class="token punctuation">,</span> <span class="token literal-property property">rm</span><span class="token operator">:</span> Function</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// el是被动画的元素</span>
  <span class="token keyword">const</span> <span class="token literal-property property">el</span><span class="token operator">:</span> any <span class="token operator">=</span> vnode<span class="token punctuation">.</span>elm<span class="token punctuation">;</span>

  <span class="token comment">// 当然如果进入动画还没结束，就取消吧~</span>
  <span class="token comment">// call enter callback now</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isDef</span><span class="token punctuation">(</span>el<span class="token punctuation">.</span>_enterCb<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    el<span class="token punctuation">.</span>_enterCb<span class="token punctuation">.</span>cancelled <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    el<span class="token punctuation">.</span><span class="token function">_enterCb</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 嗯，这里获取该获取的东西，包括Javascript钩子和CSS类名</span>
  <span class="token keyword">const</span> data <span class="token operator">=</span> <span class="token function">resolveTransition</span><span class="token punctuation">(</span>vnode<span class="token punctuation">.</span>data<span class="token punctuation">.</span>transition<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span>
    css<span class="token punctuation">,</span>
    type<span class="token punctuation">,</span>
    leaveClass<span class="token punctuation">,</span>
    leaveToClass<span class="token punctuation">,</span>
    leaveActiveClass<span class="token punctuation">,</span>
    beforeLeave<span class="token punctuation">,</span>
    leave<span class="token punctuation">,</span>
    afterLeave<span class="token punctuation">,</span>
    leaveCancelled<span class="token punctuation">,</span>
    delayLeave<span class="token punctuation">,</span>
    duration
  <span class="token punctuation">}</span> <span class="token operator">=</span> data<span class="token punctuation">;</span>

  <span class="token comment">// 这个cb比较重要啦，将</span>
  <span class="token keyword">const</span> cb <span class="token operator">=</span> <span class="token punctuation">(</span>el<span class="token punctuation">.</span>_leaveCb <span class="token operator">=</span> <span class="token function">once</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token comment">// 移除v-leave-to和v-leave-active类名</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>expectsCSS<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">removeTransitionClass</span><span class="token punctuation">(</span>el<span class="token punctuation">,</span> leaveToClass<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">removeTransitionClass</span><span class="token punctuation">(</span>el<span class="token punctuation">,</span> leaveActiveClass<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span>cb<span class="token punctuation">.</span>cancelled<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 如果离开被取消，则移除v-leave类名</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>expectsCSS<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">removeTransitionClass</span><span class="token punctuation">(</span>el<span class="token punctuation">,</span> leaveClass<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token comment">// 看到了吧，这里埋下了leaveCancelled的Javascript钩子</span>
      leaveCancelled <span class="token operator">&amp;&amp;</span> <span class="token function">leaveCancelled</span><span class="token punctuation">(</span>el<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token function">rm</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 这里埋下了afterLeave的Javascript钩子</span>
      afterLeave <span class="token operator">&amp;&amp;</span> <span class="token function">afterLeave</span><span class="token punctuation">(</span>el<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 这个离开动画的函数只调用一次啦</span>
    el<span class="token punctuation">.</span>_leaveCb <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 看看要不要延迟执行啦</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>delayLeave<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">delayLeave</span><span class="token punctuation">(</span>performLeave<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token function">performLeave</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 嗯，这个才是真正执行的函数</span>
  <span class="token keyword">function</span> <span class="token function">performLeave</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// the delayed leave may have already been cancelled</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>cb<span class="token punctuation">.</span>cancelled<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 看，这里埋下了beforeLeave的Javascript钩子</span>
    beforeLeave <span class="token operator">&amp;&amp;</span> <span class="token function">beforeLeave</span><span class="token punctuation">(</span>el<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 下面这是上一节讲到的逻辑，执行CSS过渡动画的</span>
    <span class="token comment">// cb是上面定义的回调啦，里面包括afterLeave钩子</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>expectsCSS<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">addTransitionClass</span><span class="token punctuation">(</span>el<span class="token punctuation">,</span> leaveClass<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">addTransitionClass</span><span class="token punctuation">(</span>el<span class="token punctuation">,</span> leaveActiveClass<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">nextFrame</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        <span class="token function">addTransitionClass</span><span class="token punctuation">(</span>el<span class="token punctuation">,</span> leaveToClass<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token function">removeTransitionClass</span><span class="token punctuation">(</span>el<span class="token punctuation">,</span> leaveClass<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>cb<span class="token punctuation">.</span>cancelled <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>userWantsControl<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isValidDuration</span><span class="token punctuation">(</span>explicitLeaveDuration<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">setTimeout</span><span class="token punctuation">(</span>cb<span class="token punctuation">,</span> explicitLeaveDuration<span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            <span class="token function">whenTransitionEnds</span><span class="token punctuation">(</span>el<span class="token punctuation">,</span> type<span class="token punctuation">,</span> cb<span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 看，这里还埋下了leave的Javascript钩子</span>
    <span class="token comment">// 和其他钩子不同的是，这里传进去cb了</span>
    leave <span class="token operator">&amp;&amp;</span> <span class="token function">leave</span><span class="token punctuation">(</span>el<span class="token punctuation">,</span> cb<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>expectsCSS <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>userWantsControl<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">cb</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>嗯，大概是这些的逻辑啦，现在大家明白了<code v-pre>leave: function (el, done)</code>里的 done 是什么了吧~</p>
<h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>本节我们介绍了 Vue 动画中的 Javascript 钩子，以及相关的一些源码分析。很多时候我们看一个框架内容好多好复杂，其实慢慢理解和思考，一点点拆分下来也不是特别难的啦。</p>
</div></template>


