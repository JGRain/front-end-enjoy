<template><div><p>上一节我们介绍了小程序的 computed 计算属性，这次我们来讲讲 watch 观察属性叭~</p>
<p>官方已支持数据监听，详情可查看<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/observer.html" target="_blank" rel="noopener noreferrer">数据监听器<ExternalLinkIcon/></a>。</p>
<p><strong>数据监听器可以用于监听和响应任何属性和数据字段的变化。从小程序基础库版本 2.6.1 开始支持。</strong></p>
<p>注意：以下内容中，使用的是个人制作的 <a href="https://github.com/godbasin/watch-behavior" target="_blank" rel="noopener noreferrer">watch-behavior<ExternalLinkIcon/></a>。</p>
<!--more-->
<h2 id="watch-观察属性使用" tabindex="-1"><a class="header-anchor" href="#watch-观察属性使用" aria-hidden="true">#</a> watch 观察属性使用</h2>
<p>这里我们直接先讲解下怎么用哇。</p>
<h3 id="安装依赖" tabindex="-1"><a class="header-anchor" href="#安装依赖" aria-hidden="true">#</a> 安装依赖</h3>
<p>整个实现的依赖包，放在 Github 上，大家可以去翻看和点星星：<a href="https://github.com/godbasin/watch-behavior" target="_blank" rel="noopener noreferrer">watch-behavior<ExternalLinkIcon/></a>。</p>
<ul>
<li>安装<code v-pre>watch</code>：</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>npm install --save miniprogram-watch
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><blockquote>
<p>使用 behavior 需要依赖小程序基础库 2.2.3 以上版本，同时依赖开发者工具的 npm 构建。具体详情可查阅<a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html" target="_blank" rel="noopener noreferrer">官方 npm 文档<ExternalLinkIcon/></a>。</p>
</blockquote>
<h3 id="在-component-中使用" tabindex="-1"><a class="header-anchor" href="#在-component-中使用" aria-hidden="true">#</a> 在 Component 中使用</h3>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 需要开发者工具 npm 依赖</span>
<span class="token keyword">const</span> watchBehavior <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"miniprogram-watch"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token function">Component</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">behaviors</span><span class="token operator">:</span> <span class="token punctuation">[</span>watchBehavior<span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token literal-property property">properties</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">propA</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> Number<span class="token punctuation">,</span>
      <span class="token literal-property property">value</span><span class="token operator">:</span> <span class="token number">0</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">a</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
    <span class="token literal-property property">b</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">c</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">d</span><span class="token operator">:</span> <span class="token number">33</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token literal-property property">e</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">]</span><span class="token punctuation">]</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token comment">// 可以将需要监听的数据放入 watch 里面，当数据改变时推送相应的订阅事件</span>
  <span class="token comment">// 支持 data 以及 properties 的监听</span>
  <span class="token literal-property property">watch</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token function">propA</span><span class="token punctuation">(</span><span class="token parameter">val<span class="token punctuation">,</span> oldVal</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"propA new: %s, old: %s"</span><span class="token punctuation">,</span> val<span class="token punctuation">,</span> oldVal<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function">a</span><span class="token punctuation">(</span><span class="token parameter">val<span class="token punctuation">,</span> oldVal</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"a new: %s, old: %s"</span><span class="token punctuation">,</span> val<span class="token punctuation">,</span> oldVal<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token string-property property">"b.c.d"</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">val<span class="token punctuation">,</span> oldVal</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"b.c.d new: %s, old: %s"</span><span class="token punctuation">,</span> val<span class="token punctuation">,</span> oldVal<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token string-property property">"b.e[2][0]"</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">val<span class="token punctuation">,</span> oldVal</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"b.e[2][0] new: %s, old: %s"</span><span class="token punctuation">,</span> val<span class="token punctuation">,</span> oldVal<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token string-property property">"b.e[3][4]"</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">val<span class="token punctuation">,</span> oldVal</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"b.e[3][4] new: %s, old: %s"</span><span class="token punctuation">,</span> val<span class="token punctuation">,</span> oldVal<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">methods</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token function">onTap</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setData</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        <span class="token literal-property property">a</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>
        <span class="token string-property property">"b.c.d"</span><span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span>
        <span class="token string-property property">"b.e[2][0]"</span><span class="token operator">:</span> <span class="token number">444</span><span class="token punctuation">,</span>
        <span class="token literal-property property">c</span><span class="token operator">:</span> <span class="token number">123</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 不在 data 里面的数据项不会放入观察者列表，比如这里的'b.e[3][4]'</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="在-page-中使用" tabindex="-1"><a class="header-anchor" href="#在-page-中使用" aria-hidden="true">#</a> 在 Page 中使用</h3>
<p><strong><code v-pre>Component</code>是<code v-pre>Page</code>的超集，因此可以使用<code v-pre>Component</code>构造器构造页面。</strong></p>
<p><a href="https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html" target="_blank" rel="noopener noreferrer">官方文档<ExternalLinkIcon/></a>：</p>
<blockquote>
<p>事实上，小程序的页面也可以视为自定义组件。因而，页面也可以使用<code v-pre>Component</code>构造器构造，拥有与普通组件一样的定义段与实例方法。但此时要求对应<code v-pre>json</code>文件中包含<code v-pre>usingComponents</code>定义段。</p>
</blockquote>
<ul>
<li><code v-pre>page.json</code></li>
</ul>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"usingComponents"</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>page.js</code></li>
</ul>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 这里我们就可以使用 Component 代替 Page</span>
<span class="token function">Component</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">a</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
    <span class="token literal-property property">b</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">c</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">d</span><span class="token operator">:</span> <span class="token number">33</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token literal-property property">e</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">3</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">]</span><span class="token punctuation">]</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token comment">// 可以将需要监听的数据放入 watch 里面，当数据改变时推送相应的订阅事件</span>
  <span class="token literal-property property">watch</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token function">a</span><span class="token punctuation">(</span><span class="token parameter">val<span class="token punctuation">,</span> oldVal</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"a new: %s, old: %s"</span><span class="token punctuation">,</span> val<span class="token punctuation">,</span> oldVal<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token string-property property">"b.c.d"</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">val<span class="token punctuation">,</span> oldVal</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"b.c.d new: %s, old: %s"</span><span class="token punctuation">,</span> val<span class="token punctuation">,</span> oldVal<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token string-property property">"b.e[2][0]"</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">val<span class="token punctuation">,</span> oldVal</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"b.e[2][0] new: %s, old: %s"</span><span class="token punctuation">,</span> val<span class="token punctuation">,</span> oldVal<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token string-property property">"b.e[3][4]"</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">val<span class="token punctuation">,</span> oldVal</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"b.e[3][4] new: %s, old: %s"</span><span class="token punctuation">,</span> val<span class="token punctuation">,</span> oldVal<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">methods</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token comment">// 页面的生命周期方法（即`on`开头的方法，如上面的`onLoad`），应写在`methods`定义段中。</span>
    <span class="token function">onLoad</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 如访问页面`/pages/index/index?paramA=123&amp;paramB=xyz`，如果声明有属性(`properties`)`paramA`或`paramB`，则它们会被赋值为`123`或`xyz`</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>data<span class="token punctuation">.</span>paramA <span class="token comment">// 页面参数 paramA 的值</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>data<span class="token punctuation">.</span>paramB <span class="token comment">// 页面参数 paramB 的值</span>
    <span class="token punctuation">}</span>
    <span class="token function">onTap</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setData</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        <span class="token literal-property property">a</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>
        <span class="token string-property property">"b.c.d"</span><span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span>
        <span class="token string-property property">"b.e[2][0]"</span><span class="token operator">:</span> <span class="token number">444</span><span class="token punctuation">,</span>
        <span class="token literal-property property">c</span><span class="token operator">:</span> <span class="token number">123</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 不在 data 里面的数据项不会放入观察者列表，比如这里的'b.e[3][4]'</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>更多的，也可以参考本人的<a href="https://github.com/godbasin/wxapp-typescript-demo" target="_blank" rel="noopener noreferrer">wxapp-typescript-demo<ExternalLinkIcon/></a>中的<a href="https://github.com/godbasin/wxapp-typescript-demo/tree/master/src/pages/watch" target="_blank" rel="noopener noreferrer">watch page<ExternalLinkIcon/></a>，后续也会持续更新方便好用的能力 demo。</p>
<h2 id="watch-观察属性实现" tabindex="-1"><a class="header-anchor" href="#watch-观察属性实现" aria-hidden="true">#</a> watch 观察属性实现</h2>
<p>自定义组件中<code v-pre>computed</code>计算属性的实现，由<a href="https://github.com/wechat-miniprogram/computed" target="_blank" rel="noopener noreferrer">官方<ExternalLinkIcon/></a>提供的。上一篇<RouterLink to="/wxapp/wxapp-technique/wxapp-computed.html">《使用 computed 计算属性》</RouterLink>中，也有讲解大致思路和使用方法。</p>
<p>现在，轮到我们自己来实现一个<code v-pre>watch</code>观察属性了。</p>
<p>这里的实现主要也是针对自定义组件中的<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/behaviors.html" target="_blank" rel="noopener noreferrer"><code v-pre>behaviors</code><ExternalLinkIcon/></a>。上一篇已经讲过，这里就不再复述啦。</p>
<h3 id="watch-触发机制" tabindex="-1"><a class="header-anchor" href="#watch-触发机制" aria-hidden="true">#</a> watch 触发机制</h3>
<p>其实<code v-pre>watch</code>的触发机制，基本都在<code v-pre>setData</code>的时候触发。而在自定义组件里，会有两种情况需要需要触发对应的<code v-pre>watch</code>监听：</p>
<ul>
<li><code v-pre>properties</code>属性变化时</li>
<li><code v-pre>data</code>属性变化时（调用<code v-pre>setData</code>）</li>
</ul>
<h3 id="watch-监听更新机制" tabindex="-1"><a class="header-anchor" href="#watch-监听更新机制" aria-hidden="true">#</a> watch 监听更新机制</h3>
<p>既然<code v-pre>properties</code>和<code v-pre>data</code>都需要监听，我们来整理下逻辑。大致流程如下：</p>
<ol>
<li>在组件初始化的时候，将对应的<code v-pre>watch</code>路径加进观察队列<code v-pre>observers</code>。</li>
<li>在<code v-pre>properties</code>和<code v-pre>data</code>属性变更时，触发更新。</li>
</ol>
<ul>
<li><code v-pre>properties</code>可根据<code v-pre>observer</code>触发更新</li>
<li><code v-pre>data</code>可根据<code v-pre>setData</code>触发更新</li>
</ul>
<ol start="3">
<li>更新时，先对比变更路径，然后根据路径是否匹配（即<code v-pre>observers</code>是否存在对应观察者），来确定是否需要通知相应的观察者。</li>
<li>确定存在变更路径，则对比新数据与旧数据是否一致，一致则拦截不做通知。</li>
<li>因为<code v-pre>watch</code>可能存在循环触发更新，对一次更新的最大通知次数做限制（这里限制 5 次）。</li>
</ol>
<p>具体的实现可以在<a href="https://github.com/godbasin/watch-behavior" target="_blank" rel="noopener noreferrer">watch<ExternalLinkIcon/></a>中找到。</p>
<h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2>
<ul>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html" target="_blank" rel="noopener noreferrer">Component 构造器<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/behaviors.html" target="_blank" rel="noopener noreferrer">behaviors<ExternalLinkIcon/></a></li>
</ul>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>Npm 包的发布，是一件简单也挺复杂的事情。简单的话，你可以发布一个单文件，不带任何构建等。复杂的时候，你需要写好 demo、test、构建环境等等。<br>
有些时候，自己亲自参与做一下，会让你更容易理解，这也是为什么我们偶尔需要造点轮子的原因。</p>
</div></template>


