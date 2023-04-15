<template><div><p>因为对 Rxjs 的好感玩上了 Cycle.js，该系列用于记录使用该框架的一些笔记。本文我们从了解 Driver 驱动开始，完成 Input 值的设置<code v-pre>set value</code>，然后实现 Input 的双向绑定。</p>
<!--more-->
<h2 id="input-输入流" tabindex="-1"><a class="header-anchor" href="#input-输入流" aria-hidden="true">#</a> Input 输入流</h2>
<p>有小伙伴们把 Cycle.js 翻译中文了，大家可以看看<a href="http://cyclejs.cn/" target="_blank" rel="noopener noreferrer">中文文档<ExternalLinkIcon/></a>。</p>
<h3 id="driver-驱动" tabindex="-1"><a class="header-anchor" href="#driver-驱动" aria-hidden="true">#</a> Driver 驱动</h3>
<p>这里我们先来看看什么是 Driver。
Driver 其实是一些函数，它用来监听输入流，然后执行必要的副作用操作，最后可能会返回输出流。</p>
<p>至于抽象想象什么的，本骚年已经在<a href="https://godbasin.github.io/2017/09/16/cyclejs-notes-5-design-and-abstraction/" target="_blank" rel="noopener noreferrer">《Cycle.js 学习笔记 5--关于框架设计和抽象》<ExternalLinkIcon/></a>中发挥过脑洞的力量了。</p>
<p>Driver 应该始终与某些<code v-pre>I/O effect</code>联系在一起。
大多数 Driver，比如<code v-pre>DOM Driver</code>，以<code v-pre>sink</code>（为了描述<code v-pre>write</code>）作为输入，以<code v-pre>source</code>（为了捕获<code v-pre>read</code>）作为输出。</p>
<p>像我们要实现一个 Websocket 的 Driver：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span>adapt<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@cycle/run/lib/adapt'</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">makeSockDriver</span><span class="token punctuation">(</span><span class="token parameter">peerId</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> sock <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Sock</span><span class="token punctuation">(</span>peerId<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">function</span> <span class="token function">sockDriver</span><span class="token punctuation">(</span><span class="token parameter">outgoing$</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 添加流监听</span>
    outgoing$<span class="token punctuation">.</span><span class="token function">addListener</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token function-variable function">next</span><span class="token operator">:</span> <span class="token parameter">outgoing</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        sock<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>outgoing<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token function-variable function">error</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token function-variable function">complete</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// 创建流</span>
    <span class="token keyword">const</span> incoming$ <span class="token operator">=</span> xs<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token function-variable function">start</span><span class="token operator">:</span> <span class="token parameter">listener</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
        sock<span class="token punctuation">.</span><span class="token function">onReceive</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">msg</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          listener<span class="token punctuation">.</span><span class="token function">next</span><span class="token punctuation">(</span>msg<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token function-variable function">stop</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">return</span> <span class="token function">adapt</span><span class="token punctuation">(</span>incoming$<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">return</span> sockDriver<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="实现流创建和监听" tabindex="-1"><a class="header-anchor" href="#实现流创建和监听" aria-hidden="true">#</a> 实现流创建和监听</h3>
<p>我们希望能通过<code v-pre>set value</code>的方式注入流，我们可以创建一个流，然后调用监听器：</p>
<ol>
<li>创建流，提取出监听器。</li>
<li>将 1 步骤创建的流作为输入更新 Input 的 value。</li>
<li>在调用<code v-pre>setValue()</code>方法时触发监听器。</li>
<li>将 Input 的<code v-pre>change</code>或者<code v-pre>keyup</code>事件流，合并 3 步骤更新的流，作为输出。</li>
</ol>
<p>我们大概能得到这样一个 Input：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>@bindMethods
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">InputComponent</span> <span class="token punctuation">{</span>
  id<span class="token punctuation">;</span>
  listener<span class="token punctuation">;</span>
  <span class="token constant">DOM</span><span class="token punctuation">;</span>
  inputGet<span class="token punctuation">;</span>
  inputSet<span class="token punctuation">;</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">domSource<span class="token punctuation">,</span> type</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>id <span class="token operator">=</span> id<span class="token operator">++</span><span class="token punctuation">;</span>

    <span class="token comment">// 初始化流，并提取出监听器</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>inputSet <span class="token operator">=</span> xs
      <span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        <span class="token function-variable function">start</span><span class="token operator">:</span> <span class="token parameter">listener</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
          <span class="token keyword">this</span><span class="token punctuation">.</span>listener <span class="token operator">=</span> listener<span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token function-variable function">stop</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">startWith</span><span class="token punctuation">(</span><span class="token keyword">undefined</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

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

    <span class="token comment">// 合并输入流和源流，然后输出更新值</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>inputGet <span class="token operator">=</span> xs
      <span class="token punctuation">.</span><span class="token function">merge</span><span class="token punctuation">(</span>
        domSource
          <span class="token punctuation">.</span><span class="token function">select</span><span class="token punctuation">(</span><span class="token string">"#input"</span> <span class="token operator">+</span> <span class="token keyword">this</span><span class="token punctuation">.</span>id<span class="token punctuation">)</span>
          <span class="token punctuation">.</span><span class="token function">events</span><span class="token punctuation">(</span><span class="token string">"keyup"</span><span class="token punctuation">)</span>
          <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">ev</span> <span class="token operator">=></span> ev<span class="token punctuation">.</span>target<span class="token punctuation">.</span>value<span class="token punctuation">)</span><span class="token punctuation">,</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>inputSet
      <span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">startWith</span><span class="token punctuation">(</span><span class="token string">""</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">getDOM</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token constant">DOM</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">getValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>inputGet<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">setValue</span><span class="token punctuation">(</span><span class="token parameter">val</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 触发监听器</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>listener<span class="token punctuation">.</span><span class="token function">next</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="检验实现" tabindex="-1"><a class="header-anchor" href="#检验实现" aria-hidden="true">#</a> 检验实现</h3>
<p>检验的时候到了，我们通过设置一个定时器，触发 Input 输入的自动更新，当然，你也可以自己手动输入验证。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">LoginComponent</span><span class="token punctuation">(</span><span class="token parameter">sources</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> domSource <span class="token operator">=</span> sources<span class="token punctuation">.</span><span class="token constant">DOM</span><span class="token punctuation">;</span>

  <span class="token comment">// 登录点击和路由切换</span>
  <span class="token keyword">const</span> loginClick$ <span class="token operator">=</span> domSource<span class="token punctuation">.</span><span class="token function">select</span><span class="token punctuation">(</span><span class="token string">"#submit"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">events</span><span class="token punctuation">(</span><span class="token string">"click"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 通过InputComponent注册的Input和值</span>
  <span class="token keyword">const</span> unameInputSource <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">InputComponent</span><span class="token punctuation">(</span>domSource<span class="token punctuation">,</span> <span class="token string">"text"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> unameInputDOM$ <span class="token operator">=</span> unameInputSource<span class="token punctuation">.</span><span class="token function">getDOM</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> unameInputValue$ <span class="token operator">=</span> unameInputSource<span class="token punctuation">.</span><span class="token function">getValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 设计一个定时器，每秒自增1，并输入到username的input</span>
  <span class="token keyword">let</span> a <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
  <span class="token function">setInterval</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    unameInputSource<span class="token punctuation">.</span><span class="token function">setValue</span><span class="token punctuation">(</span>a<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 合流生成最终DOM流</span>
  <span class="token keyword">const</span> loginView$ <span class="token operator">=</span> xs
    <span class="token punctuation">.</span><span class="token function">combine</span><span class="token punctuation">(</span>unameInputDOM$<span class="token punctuation">,</span> unameInputValue$<span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">[</span>unameDOM<span class="token punctuation">,</span> unameValue<span class="token punctuation">]</span></span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token punctuation">(</span>
        <span class="token operator">&lt;</span>form<span class="token operator">></span>
          <span class="token operator">&lt;</span>h1<span class="token operator">></span>System<span class="token operator">&lt;</span><span class="token operator">/</span>h1<span class="token operator">></span>
          <span class="token operator">&lt;</span>div<span class="token operator">></span><span class="token punctuation">{</span>unameDOM<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>
          <span class="token punctuation">{</span>unameValue<span class="token punctuation">}</span>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="双向绑定" tabindex="-1"><a class="header-anchor" href="#双向绑定" aria-hidden="true">#</a> 双向绑定</h3>
<p>我们能看到，在定时器的作用下，Input 值每秒自增，同时获取到的值也触发更新。
当我们讲输入和输出连接到一起的时候，我们就实现了简单的双向绑定。前面也说过了，双向绑定只是个语法糖而已，拆开来说也就是能设置输入，并获取输出。</p>
<p>这时候，我们巧妙地使用<code v-pre>get</code>和<code v-pre>set</code>，就可以实现双向绑定：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>@bindMethods
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">InputComponent</span> <span class="token punctuation">{</span>
  <span class="token comment">// 其他没有改变</span>
  <span class="token comment">// 将 getValue 和 setValue 调整为 get 和 set 的方式</span>
  <span class="token keyword">get</span> <span class="token function">value</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>inputGet<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">set</span> <span class="token function">value</span><span class="token punctuation">(</span><span class="token parameter">val</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 触发监听器</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>listener<span class="token punctuation">.</span><span class="token function">next</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样，我们在使用的时候：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">LoginComponent</span><span class="token punctuation">(</span><span class="token parameter">sources</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// ...其他</span>

  <span class="token comment">// 通过InputComponent注册的Input和值</span>
  <span class="token keyword">const</span> unameInputSource <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">InputComponent</span><span class="token punctuation">(</span>domSource<span class="token punctuation">,</span> <span class="token string">"text"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> unameInputDOM$ <span class="token operator">=</span> unameInputSource<span class="token punctuation">.</span><span class="token function">getDOM</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 通过获取值的方式</span>
  <span class="token keyword">const</span> unameInputValue$ <span class="token operator">=</span> unameInputSource<span class="token punctuation">.</span>value<span class="token punctuation">;</span>

  <span class="token comment">// 设计一个定时器，每秒自增1，并输入到username的input</span>
  <span class="token keyword">let</span> a <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
  <span class="token function">setInterval</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token comment">// 通过设置的方式</span>
    unameInputSource<span class="token punctuation">.</span>value <span class="token operator">=</span> a<span class="token operator">++</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>塔嗒！是不是好了。</p>
<h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>这节主要简单（真的很简单）介绍了驱动 Driver，并成功地完成了之前没有完成的部分，完成 Input 的输入，并将 Input 的输入和输出衔接在一起，对外呈现出一种双向绑定的方式。<br>
<a href="https://github.com/godbasin/godbasin.github.io/tree/blog-codes/cyclejs-notes/8-two-way-binding" target="_blank" rel="noopener noreferrer">此处查看项目代码<ExternalLinkIcon/></a><br>
<a href="http://cyclejs-notes.godbasin.com/8-two-way-binding/index.html" target="_blank" rel="noopener noreferrer">此处查看页面效果<ExternalLinkIcon/></a></p>
</div></template>


