<template><div><p>因为对 Rxjs 的好感玩上了 Cycle.js，该系列用于记录使用该框架的一些笔记。本文将继续针对第四节中未完成的 input 值获取进行 debug，详细记录 debug 过程。</p>
<!--more-->
<h2 id="input-获取-value" tabindex="-1"><a class="header-anchor" href="#input-获取-value" aria-hidden="true">#</a> Input 获取 value</h2>
<p>这里我们可以先回放第四节--<a href="https://godbasin.github.io/2017/09/08/cyclejs-notes-4-use-class-build-input/" target="_blank" rel="noopener noreferrer">《Cycle.js 学习笔记 4--使用 Class 和装饰器》<ExternalLinkIcon/></a>。</p>
<h3 id="input-class" tabindex="-1"><a class="header-anchor" href="#input-class" aria-hidden="true">#</a> Input Class</h3>
<p>我们使用 Class 建立的 Input 组件是酱紫的：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> xs <span class="token keyword">from</span> <span class="token string">"xstream"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> run <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@cycle/run"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> makeDOMDriver <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@cycle/dom"</span><span class="token punctuation">;</span>

<span class="token comment">// id主要是用来注册多个Input的时候抓取到对应的id</span>
<span class="token comment">// 有点简陋，但木有关系啦</span>
<span class="token keyword">let</span> id <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">InputComponent</span> <span class="token punctuation">{</span>
  <span class="token constant">DOM</span><span class="token punctuation">;</span>
  value<span class="token punctuation">;</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">domSources<span class="token punctuation">,</span> type</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// value</span>
    <span class="token keyword">const</span> inputValue$ <span class="token operator">=</span> domSources
      <span class="token punctuation">.</span><span class="token function">select</span><span class="token punctuation">(</span><span class="token string">"#input"</span> <span class="token operator">+</span> id<span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">events</span><span class="token punctuation">(</span><span class="token string">"keyup"</span><span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">ev</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>ev<span class="token punctuation">.</span>target<span class="token punctuation">.</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> ev<span class="token punctuation">.</span>target<span class="token punctuation">.</span>value<span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">startWith</span><span class="token punctuation">(</span><span class="token string">""</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// dom</span>
    <span class="token keyword">const</span> input$ <span class="token operator">=</span> inputValue$<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">val</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token punctuation">(</span>
        <span class="token operator">&lt;</span>input
          type<span class="token operator">=</span><span class="token punctuation">{</span>type<span class="token punctuation">}</span>
          id<span class="token operator">=</span><span class="token punctuation">{</span><span class="token string">"input"</span> <span class="token operator">+</span> id<span class="token operator">++</span><span class="token punctuation">}</span>
          className<span class="token operator">=</span><span class="token string">"form-control"</span>
          value<span class="token operator">=</span><span class="token punctuation">{</span>val<span class="token punctuation">}</span>
        <span class="token operator">/</span><span class="token operator">></span>
      <span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token constant">DOM</span> <span class="token operator">=</span> input$<span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> inputValue$<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="使用-inputcomponent" tabindex="-1"><a class="header-anchor" href="#使用-inputcomponent" aria-hidden="true">#</a> 使用 InputComponent</h3>
<p>我们希望通过<code v-pre>new InputComponent</code>的方式来注册这样一个双向绑定的<code v-pre>Input</code>，第四节中，我们的结果是，每次只有第一次监听和更新状态是生效的。</p>
<p>这里我们通过对比的方式来进行 debug：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">LoginComponent</span><span class="token punctuation">(</span><span class="token parameter">sources</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> domSource <span class="token operator">=</span> sources<span class="token punctuation">.</span><span class="token constant">DOM</span><span class="token punctuation">;</span>

  <span class="token comment">// 登录点击和路由切换</span>
  <span class="token keyword">const</span> loginClick$ <span class="token operator">=</span> domSource<span class="token punctuation">.</span><span class="token function">select</span><span class="token punctuation">(</span><span class="token string">"#submit"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">events</span><span class="token punctuation">(</span><span class="token string">"click"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 手动获取的Input值</span>
  <span class="token keyword">const</span> inputValue$ <span class="token operator">=</span> domSource
    <span class="token punctuation">.</span><span class="token function">select</span><span class="token punctuation">(</span><span class="token string">"#uname"</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">events</span><span class="token punctuation">(</span><span class="token string">"keyup"</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">ev</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>ev<span class="token punctuation">.</span>target<span class="token punctuation">.</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">return</span> ev<span class="token punctuation">.</span>target<span class="token punctuation">.</span>value<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">startWith</span><span class="token punctuation">(</span><span class="token string">""</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 通过InputComponent注册的Input和值</span>
  <span class="token keyword">const</span> pwdInputSource <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">InputComponent</span><span class="token punctuation">(</span>domSource<span class="token punctuation">,</span> <span class="token string">"password"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> pwdInputDOM$ <span class="token operator">=</span> pwdInputSource<span class="token punctuation">.</span><span class="token constant">DOM</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> pwdInputValue$ <span class="token operator">=</span> pwdInputSource<span class="token punctuation">.</span>value<span class="token punctuation">;</span>

  <span class="token comment">// 合流生成最终DOM流</span>
  <span class="token keyword">const</span> loginView$ <span class="token operator">=</span> xs
    <span class="token punctuation">.</span><span class="token function">combine</span><span class="token punctuation">(</span>inputValue$<span class="token punctuation">,</span> pwdInputDOM$<span class="token punctuation">,</span> pwdInputValue$<span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">[</span>inputValue<span class="token punctuation">,</span> pwdDOM<span class="token punctuation">,</span> pwdValue<span class="token punctuation">]</span></span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token punctuation">(</span>
        <span class="token operator">&lt;</span>form<span class="token operator">></span>
          <span class="token operator">&lt;</span>h1<span class="token operator">></span>System<span class="token operator">&lt;</span><span class="token operator">/</span>h1<span class="token operator">></span>
          <span class="token operator">&lt;</span>div<span class="token operator">></span>
            <span class="token operator">&lt;</span>input
              type<span class="token operator">=</span><span class="token string">"text"</span>
              id<span class="token operator">=</span><span class="token string">"uname"</span>
              className<span class="token operator">=</span><span class="token string">"form-control"</span>
              value<span class="token operator">=</span><span class="token punctuation">{</span>inputValue<span class="token punctuation">}</span>
            <span class="token operator">/</span><span class="token operator">></span>
          <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>
          <span class="token punctuation">{</span>inputValue<span class="token punctuation">}</span>
          <span class="token operator">&lt;</span>div<span class="token operator">></span><span class="token punctuation">{</span>pwdDOM<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>
          <span class="token punctuation">{</span>pwdValue<span class="token punctuation">}</span>
          <span class="token operator">&lt;</span>div<span class="token operator">></span>
            <span class="token operator">&lt;</span>a className<span class="token operator">=</span><span class="token string">"btn btn-default"</span> id<span class="token operator">=</span><span class="token string">"submit"</span><span class="token operator">></span>
              Login
            <span class="token operator">&lt;</span><span class="token operator">/</span>a<span class="token operator">></span>
          <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>
        <span class="token operator">&lt;</span><span class="token operator">/</span>form<span class="token operator">></span>
      <span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token punctuation">{</span>
    <span class="token constant">DOM</span><span class="token operator">:</span> loginView$<span class="token punctuation">,</span>
    <span class="token literal-property property">router</span><span class="token operator">:</span> loginClick$<span class="token punctuation">.</span><span class="token function">mapTo</span><span class="token punctuation">(</span><span class="token string">"/app"</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>很明显，手动获取的<code v-pre>inputValue</code>能响应 input 更新状态，但通过<code v-pre>InputComponent</code>注册的 Input 和值只有第一次才能更新状态。</p>
<p>开始的时候，本骚年一直以为是 Driver 驱动的问题，但是这样对比一看，原因一下子出来了[捂脸]：
因为每次更新状态后，<code v-pre>pwdDOM</code>的值更新了，虽然生成一个完全一样的 input，但是由于是个变量，因此每次都是移除重新种植。</p>
<p>故原有的 input 被移除，连同在它上面绑定的监听事件一起。</p>
<h3 id="实现" tabindex="-1"><a class="header-anchor" href="#实现" aria-hidden="true">#</a> 实现</h3>
<p>要拿到 Input 的实时 value，本骚年想到了三种方法：</p>
<ol>
<li>只针对<code v-pre>value</code>进行绑定，即手动获取的 Input 值，并且手动写 DOM。</li>
<li>不更新<code v-pre>InputComponent</code>的基本 DOM，只更新里面的 value。</li>
<li>将输入和输出拆离，也就是设置输入，以及将状态更新流出。</li>
</ol>
<p>第一种方法，写了跟没写似的，没多少用处，故我们直接略过实现第二种吧。</p>
<p>第二种方法，我们要实现除了初始化之外，每次更新值不更新对应的 DOM，其实也没有多难，我们可以通过缓存的方式来进行：</p>
<ul>
<li>初始化的时候缓存 DOM。</li>
<li>每次更新获取 DOM 并更新值。</li>
</ul>
<p>其实这跟很多的框架是一样的，像 Angular、React、Vue 等，无非是实现虚拟 DOM、或者其他方式的 diff 过程。
具体大家可以翻阅不同代码的源码，这里就不多说了。有个 React 的虚拟 DOM 实现文章可以参考：<a href="https://github.com/livoras/blog/issues/13" target="_blank" rel="noopener noreferrer">《深度剖析：如何实现一个 Virtual DOM 算法》<ExternalLinkIcon/></a>。</p>
<p>好吧，我们来做第三种。</p>
<h2 id="输入设置和输出更新" tabindex="-1"><a class="header-anchor" href="#输入设置和输出更新" aria-hidden="true">#</a> 输入设置和输出更新</h2>
<h3 id="输入输出与双向绑定" tabindex="-1"><a class="header-anchor" href="#输入输出与双向绑定" aria-hidden="true">#</a> 输入输出与双向绑定</h3>
<p>其实双向绑定无非是个输入设置和输出更新的语法糖，像 Angular 里面就是：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token comment">&lt;!--双向绑定 ( [(...)] ) --></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>my-sizer</span> <span class="token attr-name">[(size)]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>fontSizePx<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>my-sizer</span><span class="token punctuation">></span></span>

<span class="token comment">&lt;!--双向绑定=属性绑定+事件绑定--></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>my-sizer</span> <span class="token attr-name">[size]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>fontSizePx<span class="token punctuation">"</span></span> <span class="token attr-name">(sizeChange)</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>fontSizePx=$event<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>my-sizer</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里我们的 Input 则会有三种方法：</p>
<ol>
<li>获取 DOM。</li>
<li>设置 DOM 的 value。</li>
<li>获取 DOM 的 value。</li>
</ol>
<h3 id="实现输入设置和输出更新" tabindex="-1"><a class="header-anchor" href="#实现输入设置和输出更新" aria-hidden="true">#</a> 实现输入设置和输出更新</h3>
<p>我们根据上面的想法，初步预设这样的思路：</p>
<ul>
<li><code v-pre>set value</code>：该流将作为 DOM 的源，可更新 DOM 值</li>
<li><code v-pre>get value</code>：该流以 DOM 为源，更获取 DOM 的更新</li>
<li><code v-pre>dom</code>：以<code v-pre>set value</code>为源，且为<code v-pre>get value</code>的源</li>
</ul>
<p>这样我们其实可以脱离调用者的<code v-pre>sources</code>了，初步实现：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">let</span> id <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

@bindMethods
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">InputComponent</span> <span class="token punctuation">{</span>
  id<span class="token punctuation">;</span>
  <span class="token constant">DOM</span><span class="token punctuation">;</span>
  inputGet<span class="token punctuation">;</span>
  inputSet<span class="token punctuation">;</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">domSource<span class="token punctuation">,</span> type</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>id <span class="token operator">=</span> id<span class="token operator">++</span><span class="token punctuation">;</span>
    <span class="token comment">// 给设置值预留，初始化流为undefined</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>inputSet <span class="token operator">=</span> xs<span class="token punctuation">.</span><span class="token function">of</span><span class="token punctuation">(</span><span class="token keyword">undefined</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// 接上设置流</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token constant">DOM</span> <span class="token operator">=</span> xs
      <span class="token punctuation">.</span><span class="token function">merge</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>inputSet<span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">val</span> <span class="token operator">=></span> <span class="token punctuation">(</span>
        <span class="token operator">&lt;</span>input
          type<span class="token operator">=</span><span class="token punctuation">{</span>type<span class="token punctuation">}</span>
          id<span class="token operator">=</span><span class="token punctuation">{</span><span class="token string">"input"</span> <span class="token operator">+</span> <span class="token keyword">this</span><span class="token punctuation">.</span>id<span class="token punctuation">}</span>
          className<span class="token operator">=</span><span class="token string">"form-control"</span>
          value<span class="token operator">=</span><span class="token punctuation">{</span>val<span class="token punctuation">}</span>
        <span class="token operator">/</span><span class="token operator">></span>
      <span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// 获取对应的值</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>inputGet <span class="token operator">=</span> domSource
      <span class="token punctuation">.</span><span class="token function">select</span><span class="token punctuation">(</span><span class="token string">"#input"</span> <span class="token operator">+</span> <span class="token keyword">this</span><span class="token punctuation">.</span>id<span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">events</span><span class="token punctuation">(</span><span class="token string">"keyup"</span><span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">ev</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>ev<span class="token punctuation">.</span>target<span class="token punctuation">.</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> ev<span class="token punctuation">.</span>target<span class="token punctuation">.</span>value<span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">startWith</span><span class="token punctuation">(</span><span class="token string">""</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">getDOM</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token constant">DOM</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">getValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>inputGet<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">setValue</span><span class="token punctuation">(</span><span class="token parameter">val</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 待实现</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里我们将流的入口流和出口流拆开了，这样就能拿到每次 input 更新的流了。至于设置值的方法还没想好，应该可以参考参考 Driver 的设计。</p>
<p>这次我们能正常获取手动设置的 input，以及通过注册设置的 input 的值啦。</p>
<h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>这节主要围绕上一次的无法获取到 input 更新值的问题，进行 debug 并解决。<br>
但目前还木有完全实现双向绑定，其中缺了一个就是<code v-pre>set value</code>的实现，这块我们后面可以跟 driver 驱动一起讲。<br>
<a href="https://github.com/godbasin/godbasin.github.io/tree/blog-codes/cyclejs-notes/7-debug-input" target="_blank" rel="noopener noreferrer">此处查看项目代码<ExternalLinkIcon/></a><br>
<a href="http://cyclejs-notes.godbasin.com/7-debug-input/index.html" target="_blank" rel="noopener noreferrer">此处查看页面效果<ExternalLinkIcon/></a></p>
</div></template>


