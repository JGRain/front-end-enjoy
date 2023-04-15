<template><div><p>该系列用于记录一些使用方法、demo 以及原理分析。本文介绍 transition 组件，和创建简单 demo 的过程。</p>
<!--more-->
<h1 id="动画过渡" tabindex="-1"><a class="header-anchor" href="#动画过渡" aria-hidden="true">#</a> 动画过渡</h1>
<p>Vue 的动画过渡做得挺强大的，不过平时总是做的管理类项目，几乎不怎么用到动画。这次也是因为要弄个讲课 PPT 才来仔细研究这块，开始以为照着官网看看差不多就可以了，后来才发现这块的内容超出本骚年的想象。嘛，还挺有意思的。</p>
<h2 id="vue-过渡常用方式" tabindex="-1"><a class="header-anchor" href="#vue-过渡常用方式" aria-hidden="true">#</a> Vue 过渡常用方式</h2>
<p>Vue 过渡主要分为两类：<strong>CSS 动画</strong>和<strong>Javascript 动画</strong>。</p>
<p>根据<a href="https://cn.vuejs.org/v2/guide/transitions.html#%E6%A6%82%E8%BF%B0" target="_blank" rel="noopener noreferrer">官网<ExternalLinkIcon/></a>的说法，Vue 在插入、更新或者移除 DOM 时，提供多种不同方式的应用过渡效果，举例如下：</p>
<ul>
<li>在 CSS 过渡和动画中自动应用 class（CSS 动画）</li>
<li>可以配合使用第三方 CSS 动画库，如 Animate.css（CSS 动画）</li>
<li>在过渡钩子函数中使用 JavaScript 直接操作 DOM（Javascript 动画）</li>
<li>可以配合使用第三方 JavaScript 动画库，如 Velocity.js（Javascript 动画）</li>
</ul>
<p>嗯，也就是上面所说的两类，主要区分是否手动实现还是借用工具实现而已。</p>
<h2 id="动画过渡的方法和原理" tabindex="-1"><a class="header-anchor" href="#动画过渡的方法和原理" aria-hidden="true">#</a> 动画过渡的方法和原理</h2>
<h3 id="强大的-requestanimationframe" tabindex="-1"><a class="header-anchor" href="#强大的-requestanimationframe" aria-hidden="true">#</a> 强大的 requestAnimationFrame</h3>
<p>关于 requestAnimationFrame ，如果说没怎么写过动画的，或许几乎没听过。一般来说，大家常用的方式主要是来解决传说中浏览器刷新频率的问题。</p>
<p>在本骚年以前也写动画的日子里，通常是使用 jQuery ，各种计算然后调用 <code v-pre>animate()</code> 等。后面也接触了 CSS3 ， transform 到 animation ， CSS 的动画能力简直要上天了。</p>
<p>我们来看看<a href="https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame" target="_blank" rel="noopener noreferrer">MDN<ExternalLinkIcon/></a>上是怎么介绍的吧。</p>
<p><code v-pre>window.requestAnimationFrame()</code> 方法告诉浏览器您希望执行动画，并请求浏览器在下一次重绘之前调用指定的函数来更新动画。该方法使用一个回调函数作为参数，这个回调函数会在浏览器重绘之前调用。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>window<span class="token punctuation">.</span><span class="token function">requestAnimationFrame</span><span class="token punctuation">(</span>callback<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><strong>callback</strong>
一个在每次需要重新绘制动画时调用的包含指定函数的参数。这个回调函数有一个传参，DOMHighResTimeStamp，指示从触发 requestAnimationFrame 回调到现在（重新渲染页面内容之前）的时间。</p>
<p><strong>返回值</strong>
一个 long 整数，请求 ID ，也是回调列表中唯一的标识。
可以传此值到 <code v-pre>window.cancelAnimationFrame()</code> 以取消回调函数。</p>
<p>关于 requestAnimationFrame 能做到的一些 CSS 不能做的，可以参考<a href="http://www.zhangxinxu.com/wordpress/2013/09/css3-animation-requestanimationframe-tween-%E5%8A%A8%E7%94%BB%E7%AE%97%E6%B3%95/" target="_blank" rel="noopener noreferrer">《CSS3 动画那么强，requestAnimationFrame 还有毛线用？》<ExternalLinkIcon/></a>看看。</p>
<p>总之，我们来看看 Vue 里面的相关代码：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// binding to window is necessary to make hot reload work in IE in strict mode</span>
<span class="token comment">// 此处在不兼容时使用setTimeout进行向下兼容</span>
<span class="token keyword">const</span> raf <span class="token operator">=</span>
  inBrowser <span class="token operator">&amp;&amp;</span> window<span class="token punctuation">.</span>requestAnimationFrame
    <span class="token operator">?</span> window<span class="token punctuation">.</span><span class="token function">requestAnimationFrame</span><span class="token punctuation">.</span><span class="token function">bind</span><span class="token punctuation">(</span>window<span class="token punctuation">)</span>
    <span class="token operator">:</span> setTimeout<span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">nextFrame</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">fn</span><span class="token operator">:</span> Function</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">raf</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token function">raf</span><span class="token punctuation">(</span>fn<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>nextFrame 就是 Vue 中用来 CSS 动画过渡的方法，可以在下一次重绘之前进行一些处理。后面讲 CSS 动画过渡的时候我们会再详细点分析。</p>
<h3 id="关键的-transitionend-和-animationend" tabindex="-1"><a class="header-anchor" href="#关键的-transitionend-和-animationend" aria-hidden="true">#</a> 关键的 transitionend 和 animationend</h3>
<p>这两个分别是 CSS 动画中的结束事件， transitionend 是 CSS transition（如 transform/scale 等）结束的触发事件，animationend 则是 CSS 动画（keyframe）结束的触发事件。</p>
<h4 id="transitionend" tabindex="-1"><a class="header-anchor" href="#transitionend" aria-hidden="true">#</a> transitionend</h4>
<p>transitionend 事件会在 CSS transition 结束后触发。以下两种情况不会触发：</p>
<ol>
<li>当 transition 完成前移除 transition 时，比如移除 css 的 transition-property 属性。</li>
<li>在 transition 完成前设置 display 为&quot;none&quot;。</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 在指定的元素上监听transitionend事件</span>
element<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">"transitionend"</span><span class="token punctuation">,</span> callback<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="animationend" tabindex="-1"><a class="header-anchor" href="#animationend" aria-hidden="true">#</a> animationend</h4>
<p>animationend 事件会在一个 CSS 动画完成时触发。与 transitionend 相似，animationend 的触发不包括完成前就已终止的情况，例如元素变得不可见或者动画从元素中移除。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 在指定的元素上监听animationend事件</span>
element<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">"animationend"</span><span class="token punctuation">,</span> callback<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>相比 CSS transition，CSS 动画还有相关的事件，包括：</p>
<ul>
<li><strong>animationstart</strong>: animationstart 事件会在 CSS 动画开始时触发。如果有 animation-delay 延时，事件会在延迟时效过后立即触发</li>
<li><strong>animationiteration</strong>: 循环动画中，在每次循环结束时触发</li>
<li><strong>animationcancel</strong>: animationcancel 事件会在 CSS 异常终止时触发（即在未触发 animationend 事件的情况下停止运行）</li>
</ul>
<p>Vue 的 CSS 过渡中会使用到这两个事件，后续会讲到。</p>
<h2 id="transition-组件" tabindex="-1"><a class="header-anchor" href="#transition-组件" aria-hidden="true">#</a> transition 组件</h2>
<p>Vue 提供了 transition 的封装组件，可以给元素和组件添加 entering/leaving 过渡。</p>
<h3 id="transition-的使用" tabindex="-1"><a class="header-anchor" href="#transition-的使用" aria-hidden="true">#</a> transition 的使用</h3>
<p>我们看看有哪些情况下可以使用 transition：</p>
<ul>
<li>条件渲染 (使用 v-if )</li>
<li>条件展示 (使用 v-show )</li>
<li>动态组件</li>
<li>组件根节点</li>
</ul>
<p>transition 的封装组件，主要是结合组件生命周期，在一些特殊逻辑（如 v-if、v-show、v-for）里增加钩子，来触发动画的实现。</p>
<p>我们知道，Vue 里面实现动画过渡有 CSS 和 Javascript 两种，而两种又是可以结合的，当然这是通过预埋的钩子以及上面讲到的 CSS 事件的方式来实现的。</p>
<p>至于具体的实现，后面分篇来讲一下，这里就不过多讲述了。</p>
<h3 id="来个-demo" tabindex="-1"><a class="header-anchor" href="#来个-demo" aria-hidden="true">#</a> 来个 demo</h3>
<p>废话少说，直接甩个<a href="https://cn.vuejs.org/v2/guide/transitions.html#%E5%8D%95%E5%85%83%E7%B4%A0-%E7%BB%84%E4%BB%B6%E7%9A%84%E8%BF%87%E6%B8%A1" target="_blank" rel="noopener noreferrer">官网的例子<ExternalLinkIcon/></a>：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token comment">&lt;!-- transition的使用 --></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>demo<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name"><span class="token namespace">v-on:</span>click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>show = !show<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
    Toggle
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>transition</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>fade<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span> <span class="token attr-name">v-if</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>show<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>hello<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>transition</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-css line-numbers-mode" data-ext="css"><pre v-pre class="language-css"><code><span class="token comment">/* 简单的css transition实现动画 */</span>
<span class="token selector">.fade-enter-active,
.fade-leave-active</span> <span class="token punctuation">{</span>
  <span class="token property">transition</span><span class="token punctuation">:</span> opacity 0.5s<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
.fade-enter<span class="token punctuation">,</span> .fade-leave-to <span class="token comment">/* .fade-leave-active below version 2.1.8 */</span> <span class="token punctuation">{</span>
  <span class="token property">opacity</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里是使用的 CSS transition 方式来实现动画过渡的，我们看看在切换 v-if 的时候都发生了什么。</p>
<ol>
<li>v-if 绑定值的变更，导致插入或删除包含在 transition 组件中的元素。</li>
<li>自动嗅探目标元素是否应用了 CSS 过渡或动画。这里的确使用 CSS 过渡，于是会在元素添加时添加 CSS 类名，并判断动画加载完之后删除 CSS 类名。</li>
<li>如果过渡组件提供了 JavaScript 钩子函数，这些钩子函数将在恰当的时机被调用。（这里由于没有使用到，故不会执行）</li>
<li>如果没有找到 JavaScript 钩子并且也没有检测到 CSS 过渡/动画，DOM 操作 (插入/删除) 在下一帧中立即执行。（当然在我们的例子中，这一步也不会生效）</li>
</ol>
<h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>本节我们简单介绍了 Vue 中 transition 封装组件的使用和 demo ，以及一些实现原理相关的基础知识。由于直接举的官方例子，这里效果页面大家可以到官网上看看就好啦。</p>
</div></template>


