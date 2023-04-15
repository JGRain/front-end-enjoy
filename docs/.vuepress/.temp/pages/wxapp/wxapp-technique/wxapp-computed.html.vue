<template><div><p>小程序的出身，基于安全和管控的考虑，使用了双线程的设计，同时对于 DOM 操作、动态创建 DOM 这些都隔离了。在写代码的时候，模版语法不支持函数计算等，computed 的方法就显得十分重要了。</p>
<!--more-->
<h2 id="自定义组件" tabindex="-1"><a class="header-anchor" href="#自定义组件" aria-hidden="true">#</a> 自定义组件</h2>
<p>小程序的自定义组件涉及功能很多，这篇只针对<code v-pre>computed</code>展开来讲。</p>
<p><code v-pre>computed</code>比较适合较复杂逻辑的计算，同时在小程序无法在模板里使用<code v-pre>methods</code>这样的场景下，计算属性的需求就更强烈了。</p>
<h3 id="behaviors" tabindex="-1"><a class="header-anchor" href="#behaviors" aria-hidden="true">#</a> behaviors</h3>
<p>自定义组件中，提供了<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/behaviors.html" target="_blank" rel="noopener noreferrer"><code v-pre>behaviors</code>的使用和定义<ExternalLinkIcon/></a>。</p>
<p>从官方文档我们能看到：</p>
<blockquote>
<p><code v-pre>behaviors</code>是用于组件间代码共享的特性，类似于一些编程语言中的“mixins”或“traits”。
每个<code v-pre>behavior</code>可以包含一组属性、数据、生命周期函数和方法，组件引用它时，它的属性、数据和方法会被合并到组件中，生命周期函数也会在对应时机被调用。每个组件可以引用多个<code v-pre>behavior</code>。</p>
</blockquote>
<p>简单来说，我们能通过<code v-pre>behaviors</code>来重构<code v-pre>Component</code>的能力。</p>
<p>如果说，我们能“混入”<code v-pre>Component</code>，其实基本很多能力都能实现啦。其实我们自己封装一层的<code v-pre>MyComponent</code>也能达到一定的效果，但是这样的拓展性会变得很糟。</p>
<p>通过<code v-pre>behaviors</code>的方式，每个组件可以按需引入自己需要的<code v-pre>behavior</code>啦。</p>
<h3 id="computed-实现" tabindex="-1"><a class="header-anchor" href="#computed-实现" aria-hidden="true">#</a> computed 实现</h3>
<p>我们来梳理下这里的逻辑，我们需要一个<code v-pre>computed</code>能力，需要处理的主要是：<code v-pre>setData</code>的时候，根据<code v-pre>computed</code>来计算哪些数据需要处理。</p>
<p>所以我们要做的是：</p>
<ol>
<li>记下来需要<code v-pre>computed</code>的变量。</li>
<li>在每次<code v-pre>setData</code>之前，看看是否包含到需要<code v-pre>computed</code>的变量，匹配到了就进行<code v-pre>computed</code>处理。</li>
<li>使用处理后的数据，进行<code v-pre>setData</code>。</li>
</ol>
<p>官方已经提供了<a href="https://github.com/wechat-miniprogram/computed" target="_blank" rel="noopener noreferrer">计算属性实现的 behavior<ExternalLinkIcon/></a>，大家也可以尽情翻看实现的<a href="https://github.com/wechat-miniprogram/computed/blob/master/src/index.js" target="_blank" rel="noopener noreferrer">源码<ExternalLinkIcon/></a>，和使用这种拓展能力。</p>
<h2 id="page-的超集" tabindex="-1"><a class="header-anchor" href="#page-的超集" aria-hidden="true">#</a> Page 的超集</h2>
<h3 id="hack-实现-page-computed-能力" tabindex="-1"><a class="header-anchor" href="#hack-实现-page-computed-能力" aria-hidden="true">#</a> hack 实现 Page computed 能力</h3>
<p>想必大家都会有疑惑，<code v-pre>Component</code>里支持<code v-pre>behaviors</code>，但是<code v-pre>Page</code>依然写起来很不方便呀。虽然所有的<code v-pre>Page</code>最终也能通过<code v-pre>Component</code>来实现，但是这样是否需要多包装一层呢？</p>
<p>答案是不用。</p>
<h3 id="使用-component-构造器构造页面" tabindex="-1"><a class="header-anchor" href="#使用-component-构造器构造页面" aria-hidden="true">#</a> 使用 Component 构造器构造页面</h3>
<p><code v-pre>Component</code>是<code v-pre>Page</code>的超集，因此可以使用<code v-pre>Component</code>构造器构造页面。</p>
<p>同样的，我们来看看<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html" target="_blank" rel="noopener noreferrer">官方文档<ExternalLinkIcon/></a>：</p>
<blockquote>
<p>事实上，小程序的页面也可以视为自定义组件。因而，页面也可以使用<code v-pre>Component</code>构造器构造，拥有与普通组件一样的定义段与实例方法。但此时要求对应<code v-pre>json</code>文件中包含<code v-pre>usingComponents</code>定义段。</p>
</blockquote>
<p>也就是说，我们这样的页面：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token function">Page</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">logs</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token function">onLoad</span><span class="token punctuation">(</span><span class="token parameter">query</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 如访问页面`/pages/index/index?paramA=123&amp;paramB=xyz`，如果声明有属性(`properties`)`paramA`或`paramB`，则它们会被赋值为`123`或`xyz`</span>
    query<span class="token punctuation">.</span>paramA<span class="token punctuation">;</span> <span class="token comment">// 页面参数 paramA 的值</span>
    query<span class="token punctuation">.</span>paramA<span class="token punctuation">;</span> <span class="token comment">// 页面参数 paramB 的值</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setData</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">logs</span><span class="token operator">:</span> <span class="token punctuation">(</span>wx<span class="token punctuation">.</span><span class="token function">getStorageSync</span><span class="token punctuation">(</span><span class="token string">"logs"</span><span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">log</span><span class="token operator">:</span> number</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token function">formatTime</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span>log<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以这么写：</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"usingComponents"</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token function">Component</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token comment">// 组件的属性可以用于接收页面的参数</span>
  <span class="token literal-property property">properties</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">paramA</span><span class="token operator">:</span> Number<span class="token punctuation">,</span>
    <span class="token literal-property property">paramB</span><span class="token operator">:</span> String
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">logs</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">methods</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token function">onLoad</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 如访问页面`/pages/index/index?paramA=123&amp;paramB=xyz`，如果声明有属性(`properties`)`paramA`或`paramB`，则它们会被赋值为`123`或`xyz`</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>data<span class="token punctuation">.</span>paramA<span class="token punctuation">;</span> <span class="token comment">// 页面参数 paramA 的值</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>data<span class="token punctuation">.</span>paramB<span class="token punctuation">;</span> <span class="token comment">// 页面参数 paramB 的值</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setData</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        <span class="token literal-property property">logs</span><span class="token operator">:</span> <span class="token punctuation">(</span>wx<span class="token punctuation">.</span><span class="token function">getStorageSync</span><span class="token punctuation">(</span><span class="token string">"logs"</span><span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">log</span><span class="token operator">:</span> number</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
          <span class="token keyword">return</span> <span class="token function">formatTime</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span>log<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样，我们就能愉快地使用<code v-pre>behaviors</code>啦。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">const</span> computedBehavior <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"miniprogram-computed"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">Component</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">behaviors</span><span class="token operator">:</span> <span class="token punctuation">[</span>computedBehavior<span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">logs</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">computed</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token function">logsAfterComputed</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 计算属性同样挂在 data 上，每当进行 setData 的时候会重新计算</span>
      <span class="token comment">// 比如此字段可以通过 this.data.b 获取到</span>
      <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>data<span class="token punctuation">.</span>logs<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">x</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token punctuation">{</span>
          <span class="token literal-property property">log</span><span class="token operator">:</span> x<span class="token punctuation">,</span>
          <span class="token literal-property property">logAfterCompute</span><span class="token operator">:</span> x <span class="token operator">+</span> <span class="token string">"logAfterCompute"</span>
        <span class="token punctuation">}</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">methods</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token function">onLoad</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setData</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        <span class="token literal-property property">logs</span><span class="token operator">:</span> <span class="token punctuation">(</span>wx<span class="token punctuation">.</span><span class="token function">getStorageSync</span><span class="token punctuation">(</span><span class="token string">"logs"</span><span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">log</span><span class="token operator">:</span> number</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
          <span class="token keyword">return</span> <span class="token function">formatTime</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span>log<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用<code v-pre>Component</code>构造器构造页面，需要注意：</p>
<ol>
<li>组件的属性可以用于接收页面的参数，如访问页面<code v-pre>/pages/index/index?paramA=123&amp;paramB=xyz</code>，如果声明有属性(<code v-pre>properties</code>)<code v-pre>paramA</code>或<code v-pre>paramB</code>，则它们会被赋值为<code v-pre>123</code>或<code v-pre>xyz</code>。（可参考<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html" target="_blank" rel="noopener noreferrer">官方代码示例<ExternalLinkIcon/></a>）</li>
<li>页面的生命周期方法（即<code v-pre>on</code>开头的方法，如上面的<code v-pre>onLoad</code>），应写在<code v-pre>methods</code>定义段中。</li>
</ol>
<p>这样，你就能愉快地在代码里面使用<code v-pre>computed</code>计算属性啦~</p>
<p>更多的，也可以参考本人的<a href="https://github.com/godbasin/wxapp-typescript-demo" target="_blank" rel="noopener noreferrer">wxapp-typescript-demo<ExternalLinkIcon/></a>中的<a href="https://github.com/godbasin/wxapp-typescript-demo/tree/master/src/pages/logs" target="_blank" rel="noopener noreferrer">log page<ExternalLinkIcon/></a>，后续也会持续更新方便好用的能力 demo。</p>
<h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2>
<ul>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html" target="_blank" rel="noopener noreferrer">Component 构造器<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/behaviors.html" target="_blank" rel="noopener noreferrer">behaviors<ExternalLinkIcon/></a></li>
</ul>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>小程序提供的能力其实挺多的，但是很多时候由于文档很多、查找不方便，会导致我们有些很好用的功能没有发现，然后苦逼地一边吐槽一边悲壮地撸代码。<br>
官方提供的目前只有<code v-pre>computed</code>，大家可以看看，是不是还可以做<code v-pre>watch</code>之类的能力呢？</p>
</div></template>


