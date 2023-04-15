<template><div><p>接触过 jQuery 的小伙伴们大概在切换到 mvvm 初总不习惯，需要进行开发思维的转换，从事件驱动的角度出发，到从数据驱动的角度出发，也是不小的挑战。</p>
<!--more-->
<h1 id="事件驱动" tabindex="-1"><a class="header-anchor" href="#事件驱动" aria-hidden="true">#</a> 事件驱动</h1>
<h2 id="gui-与事件" tabindex="-1"><a class="header-anchor" href="#gui-与事件" aria-hidden="true">#</a> GUI 与事件</h2>
<p>GUI（图形用户界面）与事件驱动的渊源可谓不浅。</p>
<p>GUI 应用程序的特点是注重与用户的交互，因此程序的执行取决于与用户的实时交互情况，大部分的程序执行需要等到用户的交互动作发生之后。</p>
<p>由于用户的输入频率并不高，若不停轮询获取用户输入，就有点像 ajax 轮询和 websocket 推送的关系：</p>
<ol>
<li>资源利用率低。</li>
<li>不能真正做到及时同步。</li>
</ol>
<p><strong>由于 GUI 程序的执行流程由用户控制，并且不可预期，为了适应这种特点，我们需要采用事件驱动的编程方法。普通程序的执行可概括为“启动——做事——终止”，而事件驱动的程序的执行可概括为“启动——事件循环（即等待事件发生并处理之）”。</strong></p>
<h2 id="事件驱动编程" tabindex="-1"><a class="header-anchor" href="#事件驱动编程" aria-hidden="true">#</a> 事件驱动编程</h2>
<h3 id="事件" tabindex="-1"><a class="header-anchor" href="#事件" aria-hidden="true">#</a> 事件</h3>
<p>事件是可以被控件识别的操作，如按下确定按钮，选择某个单选按钮或者复选框。每一种控件有自己可以识别的事件，如窗体的加载、单击、双击等事件，编辑框（文本框）的文本改变事件，等等。</p>
<p>事件（event）是针对应用程序所发生的事情，并且应用程序需要对这种事情做出响应。</p>
<h3 id="事件处理" tabindex="-1"><a class="header-anchor" href="#事件处理" aria-hidden="true">#</a> 事件处理</h3>
<p>程序对事件的响应其实就是调用预先编制好的代码来对事件进行处理，这种代码称为事件处理程序（event handler）。</p>
<p><strong>事件驱动编程（event-driven programming）就是针对这种“程序的执行由事件决定”的应用的一种编程范型。</strong></p>
<h3 id="event-loop" tabindex="-1"><a class="header-anchor" href="#event-loop" aria-hidden="true">#</a> Event loop</h3>
<p>主线程从&quot;任务队列&quot;中读取事件，这个过程是循环不断的，所以整个的这种运行机制又称为 Event Loop（事件循环）。</p>
<p>关于 Javascript 的单线程与 Event Loop，想要了解可以参考<a href="http://www.ruanyifeng.com/blog/2014/10/event-loop.html" target="_blank" rel="noopener noreferrer">《JavaScript 运行机制详解：再谈 Event Loop》<ExternalLinkIcon/></a>。今天的主角是数据驱动，事件相关的不进行详细说明了。</p>
<h2 id="事件驱动思维" tabindex="-1"><a class="header-anchor" href="#事件驱动思维" aria-hidden="true">#</a> 事件驱动思维</h2>
<p>在 GUI 和 Javascript 的设计场景下，我们写代码的时候也会代入这样的思维：</p>
<p><strong>用户输入 =&gt; 事件响应 =&gt; 代码运行 =&gt; 刷新页面状态</strong></p>
<p>于是乎，刚开始写应用的思路如下：</p>
<ol>
<li>开发静态页面。</li>
<li>添加事件监听，包括用户输入、http 请求、定时器触发等事件。</li>
<li>针对不同事件，编写不同的处理逻辑，包括获取事件状态/输入、计算并更新状态等。</li>
<li>根据计算后的数据状态，重新渲染页面。</li>
</ol>
<p>通俗地说，事件驱动思维是从事件响应出发，来完成应用的设计和编程。</p>
<h1 id="数据驱动" tabindex="-1"><a class="header-anchor" href="#数据驱动" aria-hidden="true">#</a> 数据驱动</h1>
<p>数据驱动，将我们从复杂的逻辑设计带进数据处理的世界。</p>
<h2 id="何为数据" tabindex="-1"><a class="header-anchor" href="#何为数据" aria-hidden="true">#</a> 何为数据</h2>
<p>数据是什么，官方回答：数据是科学实验、检验、统计等所获得的和用于科学研究、技术设计、查证、决策等的数值。</p>
<p>但其实不管是资料中、生活和工作中，所有的事物我们都可以抽象为数据。像游戏里面的角色、物品、经验值、天气、时间等等，都是数据。游戏其实也算是对真实世界抽象的一种，而抽象之后，最终都可呈现为数据。</p>
<p>我认为，<strong>数据是一个抽象的过程。</strong></p>
<p>回到日常写码中，前端写页面，抽象成数据常用的无非是：</p>
<ul>
<li>列表 =&gt; array</li>
<li>状态 =&gt; number/boolen</li>
<li>一个卡片 =&gt; object</li>
<li>等等</li>
</ul>
<h2 id="事件驱动到数据驱动" tabindex="-1"><a class="header-anchor" href="#事件驱动到数据驱动" aria-hidden="true">#</a> 事件驱动到数据驱动</h2>
<h3 id="数据驱动-vs-事件驱动" tabindex="-1"><a class="header-anchor" href="#数据驱动-vs-事件驱动" aria-hidden="true">#</a> 数据驱动 vs 事件驱动</h3>
<p>要对事件驱动和数据驱动进行直观的比较，大概是以下这样：</p>
<h4 id="事件驱动-1" tabindex="-1"><a class="header-anchor" href="#事件驱动-1" aria-hidden="true">#</a> 事件驱动</h4>
<ol>
<li>构建页面：设计 DOM =&gt; 生成 DOM =&gt; 绑定事件</li>
<li>监听事件：操作 UI =&gt; 触发事件 =&gt; 响应处理 =&gt; 更新 UI</li>
</ol>
<h4 id="数据驱动-1" tabindex="-1"><a class="header-anchor" href="#数据驱动-1" aria-hidden="true">#</a> 数据驱动</h4>
<ol>
<li>构建页面：设计数据结构 =&gt; 事件绑定逻辑 =&gt; 生成 DOM</li>
<li>监听事件：操作 UI =&gt; 触发事件 =&gt; 响应处理 =&gt; 更新数据 =&gt; 更新 UI</li>
</ol>
<p>其实最大的转变是，以前会把组件视为 DOM，把事件/逻辑处理视为 Javascript，把样式视为 CSS。而当转换思维方式之后，组件、事件、逻辑处理、样式都是一份数据，我们只需要把数据的状态和转换设计好，剩下的实现则由具现方式（模版引擎、事件机制等）来实现。</p>
<h3 id="数据驱动思维" tabindex="-1"><a class="header-anchor" href="#数据驱动思维" aria-hidden="true">#</a> 数据驱动思维</h3>
<p>转换到数据驱动思维后，我们在编程实现的过程中，更多的是思考数据的维护和处理，而无需过于考虑 UI 的变化和事件的监听。</p>
<p>拿一个企业网站来说，里面的很多数据和链接，从前我们常用方式是直接写成 DOM，然后就产生了很长的一段 DOM 代码。</p>
<p>如果说我们将其切换到数据，以对象和数组的方式存储，这时候我们只需要写一段具现方式，将这组数据转成 DOM。这种方式有以下好处：</p>
<ul>
<li>数据变更方便</li>
<li>DOM 结构变轻</li>
<li>DOM 结构/样式调整方便</li>
<li>抽象设计</li>
<li>代码量减少，易于维护</li>
</ul>
<h2 id="数据驱动与-mvvm" tabindex="-1"><a class="header-anchor" href="#数据驱动与-mvvm" aria-hidden="true">#</a> 数据驱动与 mvvm</h2>
<p>数据驱动的设计思维或许与 mvvm 没有必然的联系，但是 mvvm 框架提供一些具现方式将数据驱动变得更加轻松。</p>
<h3 id="mvvm-集成具现化方法" tabindex="-1"><a class="header-anchor" href="#mvvm-集成具现化方法" aria-hidden="true">#</a> mvvm 集成具现化方法</h3>
<p>拿 vue 框架来说，有以下一些很方便的具现方法：</p>
<ul>
<li>模板渲染：数据 =&gt; AST =&gt; 生成 DOM</li>
<li>数据绑定：交互输入/http 请求响应/定时器触发 =&gt; 事件监听 =&gt; 数据变更 =&gt; diff =&gt; DOM 更新</li>
<li>路由引擎：url =&gt; 数据(host/path/params 等) =&gt; 解析对应页面</li>
</ul>
<p>当我们使用了这些 mvvm 框架时，它们解决了如何让数据转变成需要的东西，将抽象具象化的问题。在这样的情况下，我们只需要完成两步：</p>
<ol>
<li>将产品/业务/设计抽象化，将 UI、交互抽象为数据。</li>
<li>将一组组的数据用逻辑处理连接起来。</li>
</ol>
<h3 id="mvvm-推动数据驱动思维" tabindex="-1"><a class="header-anchor" href="#mvvm-推动数据驱动思维" aria-hidden="true">#</a> mvvm 推动数据驱动思维</h3>
<p>这里借用 vue，来举两个例子吧。</p>
<p>一、获取 input 输入并更新
实现一个 input 的监听输入，并更新输出到模板，我们能有以下代码的变化：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token comment">&lt;!--1. 事件驱动--></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text<span class="token punctuation">"</span></span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>input<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>p<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">
  <span class="token function">$</span><span class="token punctuation">(</span><span class="token string">"#input"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">"click"</span><span class="token punctuation">,</span> <span class="token parameter">e</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> val <span class="token operator">=</span> e<span class="token punctuation">.</span>target<span class="token punctuation">.</span>value<span class="token punctuation">;</span>
    <span class="token function">$</span><span class="token punctuation">(</span><span class="token string">"#p"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">text</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>

<span class="token comment">&lt;!--2. 数据驱动 + vue--></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text<span class="token punctuation">"</span></span> <span class="token attr-name">v-model</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>inputValue<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">></span></span>{{ inputValue }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当我们在 vue 中，模板引擎帮我们处理了模板渲染、数据绑定的过程，我们只需要知道这里面只有一个有效数据，即 input 的值。</p>
<p>二、部分更新列表
我们再来看个例子，我们有一组数据，需要渲染成一个列表：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">const</span> list <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token punctuation">{</span> <span class="token literal-property property">id</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span> <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"name1"</span><span class="token punctuation">,</span> <span class="token literal-property property">href</span><span class="token operator">:</span> <span class="token string">"http://href1"</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span> <span class="token literal-property property">id</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"name2"</span><span class="token punctuation">,</span> <span class="token literal-property property">href</span><span class="token operator">:</span> <span class="token string">"http://href2"</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span> <span class="token literal-property property">id</span><span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span> <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"name3"</span><span class="token punctuation">,</span> <span class="token literal-property property">href</span><span class="token operator">:</span> <span class="token string">"http://href3"</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span> <span class="token literal-property property">id</span><span class="token operator">:</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"name4"</span><span class="token punctuation">,</span> <span class="token literal-property property">href</span><span class="token operator">:</span> <span class="token string">"http://href4"</span> <span class="token punctuation">}</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol>
<li>当我们需要渲染成列表时：</li>
</ol>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token comment">&lt;!--1). 事件驱动--></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>ul<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript">
  <span class="token keyword">const</span> dom <span class="token operator">=</span> <span class="token function">$</span><span class="token punctuation">(</span><span class="token string">"#ul"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  list<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token parameter">item</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    dom<span class="token punctuation">.</span><span class="token function">append</span><span class="token punctuation">(</span>
      <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">&lt;li data-id="</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>item<span class="token punctuation">.</span>id<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">">&lt;span></span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>item<span class="token punctuation">.</span>name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">&lt;/span>: &lt;a href="</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>
        item<span class="token punctuation">.</span>href
      <span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">"></span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>item<span class="token punctuation">.</span>href<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">&lt;/a>&lt;/li></span><span class="token template-punctuation string">`</span></span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>

<span class="token comment">&lt;!--2). 数据驱动 + vue--></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">v-for</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>item in list<span class="token punctuation">"</span></span> <span class="token attr-name">:key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>item.id<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span><span class="token punctuation">></span></span>{{item.name}}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>a</span> <span class="token attr-name">:href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>item.href<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>{{item.href}}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>a</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2">
<li>当我们需要更新一个列表中某个 id 的其中一个数据时（这里需要更改 id 为 3 的 name 值）：</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 1). 事件驱动</span>
<span class="token keyword">const</span> dom <span class="token operator">=</span> <span class="token function">$</span><span class="token punctuation">(</span><span class="token string">"#ul"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> id <span class="token operator">=</span> <span class="token number">3</span><span class="token punctuation">;</span>
dom<span class="token punctuation">.</span><span class="token function">find</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">li[data-id="</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>id<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">"] span</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">text</span><span class="token punctuation">(</span><span class="token string">"newName3"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 2). 数据驱动 + vue</span>
<span class="token keyword">const</span> id <span class="token operator">=</span> <span class="token number">3</span><span class="token punctuation">;</span>
list<span class="token punctuation">.</span><span class="token function">find</span><span class="token punctuation">(</span><span class="token parameter">item</span> <span class="token operator">=></span> item<span class="token punctuation">.</span>id <span class="token operator">==</span> <span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">.</span>name <span class="token operator">==</span> <span class="token string">"newName3"</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当然这里我们已知<code v-pre>list</code>里面有<code v-pre>id</code>为 3 的值，若是未知或不确定的数据，则需要做好异常处理，如：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">const</span> id <span class="token operator">=</span> <span class="token number">3</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> item3 <span class="token operator">=</span> list<span class="token punctuation">.</span><span class="token function">find</span><span class="token punctuation">(</span><span class="token parameter">item</span> <span class="token operator">=></span> item<span class="token punctuation">.</span>id <span class="token operator">==</span> <span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span>item3<span class="token punctuation">)</span> item3<span class="token punctuation">.</span>name <span class="token operator">==</span> <span class="token string">"newName3"</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在使用数据驱动的时候，模板渲染的事情会交给框架去完成，我们需要做的就是数据处理而已。</p>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>思维的切换和视角的转变，是一件很有意思的事情。从更多的角度去观察，去思考，去总结，才能更好地理解被观察体。</p>
</div></template>


