<template><div><p>小程序的双线程，之前也有详细讲过了。而双线程的设计，使得逻辑层和渲染层无法直接进行数据传输。那双线程的渲染机制、通信机制，setData 的出现、工作原理、使用建议等，应该要怎么去理解呢？</p>
<!--more-->
<h1 id="无处不在的-setdata" tabindex="-1"><a class="header-anchor" href="#无处不在的-setdata" aria-hidden="true">#</a> 无处不在的 setData</h1>
<p>几乎每个开发者都会用到<code v-pre>setData</code>，要是在复杂的页面中，写了很多的<code v-pre>setData</code>，然后我们会发现页面真的是延迟严重，甚至卡顿、假死。</p>
<p><a href="https://developers.weixin.qq.com/miniprogram/dev/framework/performance/tips.html" target="_blank" rel="noopener noreferrer">官方<ExternalLinkIcon/></a>在性能优化中有提到：</p>
<ol>
<li><strong>避免频繁的去 setData。</strong></li>
<li><strong>避免每次 setData 都传递大量新数据。</strong></li>
<li><strong>后台态页面进行 setData。</strong></li>
</ol>
<p>但是到底是为什么呢？<code v-pre>setData</code>的出现、设计方案是怎样的，又为何要这么设计呢？一切都还是要从双线程说起。</p>
<h2 id="小程序的虚拟-dom" tabindex="-1"><a class="header-anchor" href="#小程序的虚拟-dom" aria-hidden="true">#</a> 小程序的虚拟 DOM</h2>
<h3 id="双线程的难题" tabindex="-1"><a class="header-anchor" href="#双线程的难题" aria-hidden="true">#</a> 双线程的难题</h3>
<p>我们知道，小程序的双线程设计，主要为了管控安全，避免操作 DOM。（可参考<RouterLink to="/wxapp/wxapp-principle/2-wxapp-technology-architecture.html">《小程序的底层框架》</RouterLink>）</p>
<p>把开发者的 JS 逻辑代码放到单独的线程去运行，因为不在 Webview 线程里，所以这个环境没有 Webview 任何接口，自然开发者就没法直接操作 DOM，也就没法动态去更改界面。</p>
<p>但是，这样就产生了新的问题。<strong>没法操作 DOM，那用户交互需要界面变化的话怎么办呢？</strong></p>
<h3 id="模板数据绑定" tabindex="-1"><a class="header-anchor" href="#模板数据绑定" aria-hidden="true">#</a> 模板数据绑定</h3>
<p>模版数据绑定的方案，已经成为前端框架中最基础的功能。</p>
<p><strong>数据绑定的过程其实不复杂：</strong></p>
<ol>
<li><strong>解析语法生成 AST。</strong></li>
<li><strong>根据 AST 结果生成 DOM。</strong></li>
<li><strong>将数据绑定更新至模板。</strong></li>
</ol>
<p>浏览器会把 HTML 解析成一棵树，最后渲染出来。整个界面是对应着一棵 DOM 树。</p>
<p>其实浏览器页面的 DOM 结构树，也是 AST 的一种，把 HTML DOM 语法解析并生成最终的页面。而模板引擎中常用的，则是将模板语法解析生成 HTML DOM。</p>
<p>而最容易引发性能问题的，主要是第三点。而关于数据更新的解决方案，React 首先提出了虚拟 DOM 的设计，而现在也基本被大部分框架吸收，小程序也不例外。</p>
<h3 id="虚拟-dom-机制" tabindex="-1"><a class="header-anchor" href="#虚拟-dom-机制" aria-hidden="true">#</a> 虚拟 DOM 机制</h3>
<p>说到数据更新的 Diff，更多的则是<code v-pre>Diff + 更新模板</code>这样一个过程。</p>
<p><strong>虚拟 DOM 解决了常见的局部数据更新的问题</strong>，例如数组中值位置的调换、部分更新。</p>
<p>一般来说计算过程如下：</p>
<ol>
<li><strong>用 JS 对象模拟 DOM 树。</strong></li>
</ol>
<p>一个真正的 DOM 元素非常庞大，拥有很多的属性值。而其中很多的属性对于计算过程来说是不需要的，所以我们的第一步就是简化 DOM 对象。 我们用一个 JavaScript 对象结构表示 DOM 树的结构。</p>
<ol start="2">
<li><strong>比较两棵虚拟 DOM 树的差异。</strong></li>
</ol>
<p>当状态变更的时候，重新构造一棵新的对象树。然后用新的树和旧的树进行比较，记录两棵树差异。通常来说这样的差异需要记录，最后得到一组差异记录。</p>
<ol start="3">
<li><strong>把差异应用到真正的 DOM 树上。</strong></li>
</ol>
<p>对差异记录要应用到真正的 DOM 树上，例如节点的替换、移动、删除，文本内容的改变等。</p>
<p>小程序里，由于无法直接操作 DOM，主要也是通过数据传递的方式来进行相关的模版更新。模版绑定的机制、数据更新的机制，都可以参照上面的说明，想更具体理解也可以参考<a href="https://github.com/godbasin/godbasin.github.io/issues/7" target="_blank" rel="noopener noreferrer">《前端模板引擎》<ExternalLinkIcon/></a>。</p>
<p>那么既然不在一个线程，数据的通信是怎么做的呢？</p>
<h2 id="小程序的数据通信与渲染机制" tabindex="-1"><a class="header-anchor" href="#小程序的数据通信与渲染机制" aria-hidden="true">#</a> 小程序的数据通信与渲染机制</h2>
<h3 id="双线程通信方式" tabindex="-1"><a class="header-anchor" href="#双线程通信方式" aria-hidden="true">#</a> 双线程通信方式</h3>
<p>小程序的视图层目前使用 WebView 作为渲染载体，而逻辑层是由独立的 JavascriptCore 作为运行环境。在架构上，WebView 和 JavascriptCore 都是独立的模块，并不具备数据直接共享的通道。</p>
<p>一个小程序存在多个界面，所以渲染层存在多个 WebView 线程。 <strong>逻辑层和渲染层的通信会经由微信客户端（Native）做中转，逻辑层发送网络请求也经由 Native 转发</strong> ，小程序的通信模型如图：
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/下载.png" alt="小程序的通信模型图（官方）"></p>
<p>当前，视图层和逻辑层的数据传输，实际上通过两边提供的 evaluateJavascript 所实现。<strong>即用户传输的数据，需要将其转换为字符串形式传递，同时把转换后的数据内容拼接成一份 JS 脚本，再通过执行 JS 脚本的形式传递到两边独立环境。</strong></p>
<p>而 evaluateJavascript 的执行会受很多方面的影响，数据到达视图层并不是实时的。所以我们的<code v-pre>setData</code>函数将数据从逻辑层发送到视图层，是异步的。</p>
<p>有了线程之间的通信，我们来看看小程序的渲染机制。</p>
<h3 id="双线程渲染机制" tabindex="-1"><a class="header-anchor" href="#双线程渲染机制" aria-hidden="true">#</a> 双线程渲染机制</h3>
<p>双线程的渲染，其实是结合了前面的一系列机制（模版绑定、虚拟 DOM、线程通信），最后整合的一个执行步骤。</p>
<p><strong>1. 通过模版数据绑定和虚拟 DOM 机制，小程序提供了带有数据绑定语法的 DSL 给到开发者，用来在渲染层描述界面的结构。</strong></p>
<p>就是我们常见的这些：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>view</span><span class="token punctuation">></span></span> {{ message }} <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>view</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>view</span> <span class="token attr-name"><span class="token namespace">wx:</span>if</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>{{condition}}<span class="token punctuation">"</span></span><span class="token punctuation">></span></span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>view</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>checkbox</span> <span class="token attr-name">checked</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>{{false}}<span class="token punctuation">"</span></span><span class="token punctuation">></span></span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>checkbox</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>噢，这里顺便吐个槽，<code v-pre>wx:if</code>竟然不支持<code v-pre>[].indexOf(xx) &gt; -1</code>等等相关的函数运算（摔！）。</p>
<p><strong>2. 小程序在逻辑层提供了设置页面数据的 api。</strong></p>
<p>不用问就是<code v-pre>setData</code>了：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setData</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">key</span><span class="token operator">:</span> value
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>setData</code>函数用于将数据从逻辑层发送到视图层（异步），同时改变对应的<code v-pre>this.data</code>的值（同步）。</p>
<p><strong>3. 逻辑层需要更改界面时，只要把修改后的 data 通过 setData 传到渲染层。</strong></p>
<p>传输的数据，会转换为字符串形式传递，故应尽量避免传递大量数据。</p>
<p><strong>4. 渲染层会根据前面提到的渲染机制重新生成 VD（虚拟 DOM）树，并更新到对应的 DOM 树上，引起界面变化。</strong></p>
<h2 id="原生组件的出现" tabindex="-1"><a class="header-anchor" href="#原生组件的出现" aria-hidden="true">#</a> 原生组件的出现</h2>
<p>原生组件的出现，其实与 setData 的机制也有那么点关系，那么就当题外话一块补充下。</p>
<h3 id="频繁交互的性能" tabindex="-1"><a class="header-anchor" href="#频繁交互的性能" aria-hidden="true">#</a> 频繁交互的性能</h3>
<p>我们知道，用户的一次交互，如点击某个按钮，开发者的逻辑层要处理一些事情，然后再通过 setData 引起界面变化。这样的一个过程需要四次通信：</p>
<ol>
<li>渲染层 -&gt; Native（点击事件）。</li>
<li>Native -&gt; 逻辑层（点击事件）。</li>
<li>逻辑层 -&gt; Native（setData）。</li>
<li>Native -&gt; 渲染层（setData）。</li>
</ol>
<p>在一些强交互的场景（表单、canvas 等），这样的操作流程会导致用户体验卡顿。</p>
<h3 id="引入原生组件" tabindex="-1"><a class="header-anchor" href="#引入原生组件" aria-hidden="true">#</a> 引入原生组件</h3>
<p>前面也说过，小程序是 Hybrid 应用，除了 Web 组件的渲染体系（上面讲到），还有由客户端原生参与组件（原生组件）的渲染。</p>
<h4 id="引入原生组件的-3-个好处" tabindex="-1"><a class="header-anchor" href="#引入原生组件的-3-个好处" aria-hidden="true">#</a> 引入原生组件的 3 个好处</h4>
<ol>
<li><strong>绕过 setData、数据通信和重渲染流程，使渲染性能更好。</strong></li>
<li><strong>扩展 Web 的能力。</strong> 比如像输入框组件（input, textarea）有更好地控制键盘的能力。</li>
<li><strong>体验更好，同时也减轻 WebView 的渲染工作。</strong> 比如像地图组件（map）这类较复杂的组件，其渲染工作不占用 WebView 线程，而交给更高效的客户端原生处理。</li>
</ol>
<h4 id="原生组件的渲染过程" tabindex="-1"><a class="header-anchor" href="#原生组件的渲染过程" aria-hidden="true">#</a> 原生组件的渲染过程</h4>
<ol>
<li>组件被创建，包括组件属性会依次赋值。</li>
<li>组件被插入到 DOM 树里，浏览器内核会立即计算布局，此时我们可以读取出组件相对页面的位置（x, y 坐标）、宽高。</li>
<li>组件通知客户端，客户端在相同的位置上，根据宽高插入一块原生区域，之后客户端就在这块区域渲染界面。</li>
<li>当位置或宽高发生变化时，组件会通知客户端做相应的调整。</li>
</ol>
<p>简单来说，就是 <strong>原生组件在 WebView 这一层只需要渲染一个占位元素，之后客户端在这块占位元素之上叠了一层原生界面。</strong></p>
<p>有利必有弊，原生组件也是有限制的：</p>
<ul>
<li>最主要的限制是一些 CSS 样式无法应用于原生组件</li>
<li>由于客户端渲染，原生组件的层级会比所有在 WebView 层渲染的普通组件要高</li>
</ul>
<h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2>
<ul>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/framework/performance/tips.html" target="_blank" rel="noopener noreferrer">setData<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/ebook?action=get_post_info&amp;token=935589521&amp;volumn=1&amp;lang=zh_CN&amp;book=miniprogram&amp;docid=000caab39b88b06b00863ab085b80a" target="_blank" rel="noopener noreferrer">《小程序开发指南--6.3 原生组件》<ExternalLinkIcon/></a></li>
</ul>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>总而言之，这一节内容主要是围绕 setData 展开，包括双线程的渲染机制、通信机制，setData 的出现（逻辑层通知渲染层）、工作原理（evaluateJavascript 字符串传递）、使用建议（setData 交互性能）、性能优化（原生组件出现）。<br>
小程序乍一看是简单的双线程设计，但仔细研究就会发现设计过程中也遇到了不少问题，不断探索解决才有了现在的美好样子。我们在开发过程中会踩的一些坑，其实在理解原理之后便很容易懂了。<br>
现在再来看，官方在性能优化中说到的优化建议，你都能深刻理解了吗？</p>
</div></template>


