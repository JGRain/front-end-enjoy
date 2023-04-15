<template><div><p>全局状态管理在小程序里也算是一道难题了，有些小伙伴会选择引入一些类 Store 的库来管理全局状态。今天来给大家分享一个，使用 Behavior 来管理全局状态的小技巧。</p>
<!--more-->
<h1 id="behaviors" tabindex="-1"><a class="header-anchor" href="#behaviors" aria-hidden="true">#</a> Behaviors</h1>
<p>自定义组件中，提供了<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/behaviors.html" target="_blank" rel="noopener noreferrer"><code v-pre>behaviors</code>的使用和定义<ExternalLinkIcon/></a>。</p>
<p>从官方文档我们能看到：</p>
<blockquote>
<p><code v-pre>behaviors</code>是用于组件间代码共享的特性，类似于一些编程语言中的“mixins”或“traits”。
每个<code v-pre>behavior</code>可以包含一组属性、数据、生命周期函数和方法，组件引用它时，它的属性、数据和方法会被合并到组件中，生命周期函数也会在对应时机被调用。每个组件可以引用多个<code v-pre>behavior</code>。</p>
</blockquote>
<p>简单来说，我们能通过<code v-pre>behaviors</code>来重构<code v-pre>Component</code>的能力。Behavior的用处很多，前面也有介绍 <a href="https://godbasin.github.io/2018/12/23/wxapp-computed/" target="_blank" rel="noopener noreferrer">computed 计算属性<ExternalLinkIcon/></a>、<a href="https://godbasin.github.io/2018/12/26/wxapp-watch/" target="_blank" rel="noopener noreferrer">watch 观察属性<ExternalLinkIcon/></a>的实现，都是使用的 Behavior。</p>
<h2 id="全局状态管理" tabindex="-1"><a class="header-anchor" href="#全局状态管理" aria-hidden="true">#</a> 全局状态管理</h2>
<p>我们希望全局共享一些数据状态，如果只是通过一个文件的方式进行维护，那么我们无法在状态更新的时候及时地同步到页面。我们需要额外调用 setData 才能更新页面中的 data 数据，才能告诉渲染层这块的数据渲染需要变更，而很多的 Store 状态管理库也是通过这样的方式实现的（事件通知 + setData + 全局状态）。</p>
<p>在小程序 Behavior 能力的支持下，我们可以通过一个全局的 globalData Behavior 注入到每个需要用到的 Component 中，这样就可以在需要的页面中直接引入该 Behavior，就能获取到了。不啰嗦，Behavior的实现如下：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// globalDataStore 用来全局记录 globalData，为了跨页面同步 globalData 用</span>
<span class="token keyword">export</span> <span class="token keyword">let</span> globalDataStore <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token comment">// 获取本地的 gloabalData 缓存</span>
<span class="token keyword">try</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> gloabalData <span class="token operator">=</span> wx<span class="token punctuation">.</span><span class="token function">getStorageSync</span><span class="token punctuation">(</span><span class="token string">"gloabalData"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 有缓存的时候加上</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>gloabalData<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    globalDataStore <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token operator">...</span>gloabalData <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">"gloabalData getStorageSync error"</span><span class="token punctuation">,</span> <span class="token string">"e ="</span><span class="token punctuation">,</span> error<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// globalCount 用来全局记录 setGlobalData 的调用次数，为了在 B 页面回到 A 页面的时候，</span>
<span class="token comment">// 检查页面 __setGlobalDataCount 和 globalCount 是否一致来判断在 B 页面是否有 setGlobalData,</span>
<span class="token comment">// 以此来同步 globalData</span>
<span class="token keyword">let</span> globalCount <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">Behavior</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">globalData</span><span class="token operator">:</span> Object<span class="token punctuation">.</span><span class="token function">assign</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> globalDataStore<span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">lifetimes</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token function">attached</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 页面 onLoad 的时候同步一下 globalCount</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>__setGlobalDataCount <span class="token operator">=</span> globalCount<span class="token punctuation">;</span>
      <span class="token comment">// 同步 globalDataStore 的内容</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setData</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        <span class="token literal-property property">globalData</span><span class="token operator">:</span> Object<span class="token punctuation">.</span><span class="token function">assign</span><span class="token punctuation">(</span>
          <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token keyword">this</span><span class="token punctuation">.</span>data<span class="token punctuation">.</span>globalData <span class="token operator">||</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
          globalDataStore
        <span class="token punctuation">)</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">pageLifetimes</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token function">show</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 为了在 B 页面回到 A 页面的时候，检查页面 __setGlobalDataCount 和 globalCount 是否一致来判断在 B 页面是否有 setGlobalData</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>__setGlobalDataCount <span class="token operator">!=</span> globalCount<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 同步 globalData</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>__setGlobalDataCount <span class="token operator">=</span> globalCount<span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setGlobalData</span><span class="token punctuation">(</span>Object<span class="token punctuation">.</span><span class="token function">assign</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> globalDataStore<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">methods</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token comment">// setGlobalData 实现，主要内容为将 globalDataStore 的内容设置进页面的 data 的 globalData 属性中。</span>
    <span class="token function">setGlobalData</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">obj</span><span class="token operator">:</span> any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      globalCount <span class="token operator">=</span> globalCount <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">;</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>__setGlobalDataCount <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>__setGlobalDataCount <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">;</span>
      obj <span class="token operator">=</span> obj <span class="token operator">||</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
      <span class="token keyword">let</span> outObj <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">keys</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">reduce</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">sum<span class="token punctuation">,</span> key</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        <span class="token keyword">let</span> _key <span class="token operator">=</span> <span class="token string">"globalData."</span> <span class="token operator">+</span> key<span class="token punctuation">;</span>
        sum<span class="token punctuation">[</span>_key<span class="token punctuation">]</span> <span class="token operator">=</span> obj<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> sum<span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setData</span><span class="token punctuation">(</span>outObj<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        globalDataStore <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>data<span class="token punctuation">.</span>globalData<span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token comment">// setGlobalDataAndStorage 实现，先调用 setGlobalData，然后存到 storage 里</span>
    <span class="token function">setGlobalDataAndStorage</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">obj</span><span class="token operator">:</span> any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setGlobalData</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">try</span> <span class="token punctuation">{</span>
        <span class="token keyword">let</span> gloabalData <span class="token operator">=</span> wx<span class="token punctuation">.</span><span class="token function">getStorageSync</span><span class="token punctuation">(</span><span class="token string">"gloabalData"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// 有缓存的时候加上</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>gloabalData<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          gloabalData <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token operator">...</span>gloabalData<span class="token punctuation">,</span> <span class="token operator">...</span>obj <span class="token punctuation">}</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
          gloabalData <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token operator">...</span>obj <span class="token punctuation">}</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        wx<span class="token punctuation">.</span><span class="token function">setStorageSync</span><span class="token punctuation">(</span><span class="token string">"gloabalData"</span><span class="token punctuation">,</span> gloabalData<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        console<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">"gloabalData setStorageSync error"</span><span class="token punctuation">,</span> <span class="token string">"e ="</span><span class="token punctuation">,</span> e<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>显然，该 Behavior 主要提供了几个能力：</p>
<ul>
<li>会在小程序 data 添加 globalData 的属性，在 WXML 文件中可以直接通过<code v-pre>globalData.xxxx</code>获取到</li>
<li>提供<code v-pre>setGlobalData()</code>方法，用于更新全局状态</li>
<li>提供<code v-pre>setGlobalDataAndStorage()</code>方法，用于更新全局状态，同时写入缓存（会在下次启动应用的时候自动获取缓存数据）</li>
</ul>
<p>这样，我们在初始化 Component 的时候直接引入就可以使用：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token function">Component</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token comment">// 在behaviors中引入globalDataBehavior</span>
  <span class="token literal-property property">behaviors</span><span class="token operator">:</span> <span class="token punctuation">[</span>globalDataBehavior<span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token comment">// 其他选项</span>
  <span class="token literal-property property">methods</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token function">test</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 使用this.setGlobalData可以更新全局的数据状态</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setGlobalData</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">test</span><span class="token operator">:</span> <span class="token string">"hello world"</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 使用this.setGlobalDataAndStorage可以更新全局的数据状态，并写入缓存</span>
      <span class="token comment">// 下次globalDataBehavior会默认从缓存中获取</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setGlobalDataAndStorage</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">test</span><span class="token operator">:</span> <span class="token string">"hello world"</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在引入了 globalDataBehavior 之后，我们的 WXML 就可以直接使用了：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>view</span><span class="token punctuation">></span></span>{{ globalData.test }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>view</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="页面如何使用-behavior" tabindex="-1"><a class="header-anchor" href="#页面如何使用-behavior" aria-hidden="true">#</a> 页面如何使用 Behavior</h2>
<p><code v-pre>Component</code>是<code v-pre>Page</code>的超集，因此可以使用<code v-pre>Component</code>构造器构造页面。</p>
<p>看看<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html" target="_blank" rel="noopener noreferrer">官方文档<ExternalLinkIcon/></a>：事实上，小程序的页面也可以视为自定义组件。因而，页面也可以使用<code v-pre>Component</code>构造器构造，拥有与普通组件一样的定义段与实例方法。但此时要求对应<code v-pre>json</code>文件中包含<code v-pre>usingComponents</code>定义段。</p>
<p>更详细的使用方法，在 <a href="https://godbasin.github.io/2018/12/23/wxapp-computed/" target="_blank" rel="noopener noreferrer">computed 计算属性<ExternalLinkIcon/></a>、<a href="https://godbasin.github.io/2018/12/26/wxapp-watch/" target="_blank" rel="noopener noreferrer">watch 观察属性<ExternalLinkIcon/></a>两篇文章中也有描述，大家可以自行参考。</p>
<p>或者直接查看最终的项目代码：<a href="https://github.com/godbasin/wxapp-typescript-demo" target="_blank" rel="noopener noreferrer">wxapp-typescript-demo<ExternalLinkIcon/></a>。</p>
<h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2>
<ul>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html" target="_blank" rel="noopener noreferrer">Component构造器<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/behaviors.html" target="_blank" rel="noopener noreferrer">behaviors<ExternalLinkIcon/></a></li>
</ul>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>Behavior 其实是很强大的一个能力，我们能用它来对自己的小程序做很多的能力拓展，缺啥补啥，还可以“混入”给每个 Component 每个方法打入日志，就不用每个组件自己手动打印代码拉。</p>
</div></template>


