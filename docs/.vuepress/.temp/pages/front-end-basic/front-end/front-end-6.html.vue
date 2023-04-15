<template><div><p>本节我们从用户角度出发，认识浏览器的渲染机制吧。</p>
<!--more-->
<h1 id="浏览器" tabindex="-1"><a class="header-anchor" href="#浏览器" aria-hidden="true">#</a> 浏览器</h1>
<p>浏览器的主要功能是展示网页资源，也即请求服务器并将结果显示在浏览器窗口中。<br>
资源的格式一般是 HTML，但也有 PDF、图片等其它各种格式。资源的定位由 URI(Uniform resource Identifier) 来实现。</p>
<h2 id="浏览器的结构" tabindex="-1"><a class="header-anchor" href="#浏览器的结构" aria-hidden="true">#</a> 浏览器的结构</h2>
<p>废话少说，先上图：
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/layers.png" alt="image"></p>
<ol>
<li>
<p>用户接口（User Interface）<br>
包括地址栏，前进后退，书签菜单等窗口上除了网页显示区域以外的部分。</p>
</li>
<li>
<p>浏览器引擎（Browser engine）：查询与操作渲染引擎的接口。</p>
</li>
<li>
<p>渲染引擎（Rendering engine）。<br>
负责显示请求的内容，比如请求到<code v-pre>HTML</code>, 它会负责解析<code v-pre>HTML</code>与<code v-pre>CSS</code>并将结果显示到窗口中。</p>
</li>
<li>
<p>网络（Networking）。<br>
用于网络请求, 如 HTTP 请求。它包括平台无关的接口和各平台独立的实现。</p>
</li>
<li>
<p>UI 后端（UI backend）。<br>
绘制基础元件，如组合框与窗口。它提供平台无关的接口，内部使用操作系统的相应实现。</p>
</li>
<li>
<p><code v-pre>JavaScript</code>解释器（JavaScript Interpreter）：用于解析执行<code v-pre>JavaScript</code>代码。</p>
</li>
<li>
<p>数据存储（Data storage）。<br>
这是一个持久层。浏览器需要把所有数据存到硬盘上，如 cookies。<br>
新的<code v-pre>HTML</code>规范 (<code v-pre>HTML5</code>) 规定了一个完整（虽然轻量级）的浏览器中的数据库：<code v-pre>web database</code>。</p>
</li>
</ol>
<p>以上大概是浏览器的主要结构，作为前端，除了大致都了解一下之外，这节我们主要关注渲染引擎和 JavaScript 解释器。<br>
当然，我们先从头理一下页面请求的过程。</p>
<h2 id="页面请求" tabindex="-1"><a class="header-anchor" href="#页面请求" aria-hidden="true">#</a> 页面请求</h2>
<p>当我们去面试的时候，常常会被问一个问题：在浏览器里面输入<code v-pre>url</code>，按下 enter 键，会发生什么？<br>
这是个或许平时我们不会思考的问题，不过在了解之后会对整个网页渲染有更好的认识。</p>
<p>当我们按下 enter 键之后，浏览器就会发起一个 HTTP 请求，我们也可以从控制台看到：<br>
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1512702987(1).png" alt="image"></p>
<p>在这里，我们能看到所有浏览器发起的网络请求，包括页面、图片、CSS 文件、xhr 请求等等，还能看到请求的状态（<code v-pre>200</code>成功、<code v-pre>404</code>找不到、缓存、重定向等等）、耗时、请求头和内容、返回头和内容，等等等等。
这里涉及太多 http 相关的东西啦，先略过。</p>
<p>这里第一个就是我们的页面请求，我们来看看返回了什么：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1512703607(1).png" alt="image"></p>
<p>很明显，这里返回<code v-pre>&lt;html&gt;</code>页面，然后浏览器会加载页面，同时页面中涉及的资源也会触发请求下载，包括我们看到的<code v-pre>png</code>图片、<code v-pre>js</code>文件，这里没有<code v-pre>css</code>样式，大概是样式被直出到<code v-pre>&lt;html&gt;</code>页面里啦。</p>
<p>当然，这里面没有体现请求发送出去之后的流程，下面是<strong>一个完整的 HTTP 请求过程</strong>：</p>
<ul>
<li>域名解析（此处涉及<code v-pre>DNS</code>的寻址过程）</li>
<li>发起<code v-pre>TCP</code>的 3 次握手</li>
<li>建立<code v-pre>TCP</code>连接后发起<code v-pre>http</code>请求</li>
<li>服务器响应<code v-pre>http</code>请求，浏览器得到<code v-pre>html</code>代码</li>
<li>浏览器解析<code v-pre>html</code>代码，并请求 html 代码中的资源（如<code v-pre>js</code>、<code v-pre>css</code>、图片等，此处可能涉及<code v-pre>HTTP</code>缓存）</li>
<li>浏览器对页面进行渲染呈现给用户（此处涉及浏览器的渲染原理）</li>
</ul>
<p>关于最后一步，我们先上个图：<br>
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/image013.png" alt="image">
这是我们的浏览器拿到源代码后，会进行的处理。</p>
<p>上面这些环节，如果你还有哪些不是很清楚的，请抱着强烈的好奇心去把它们探索完成。</p>
<h1 id="浏览器渲染机制" tabindex="-1"><a class="header-anchor" href="#浏览器渲染机制" aria-hidden="true">#</a> 浏览器渲染机制</h1>
<h2 id="解析" tabindex="-1"><a class="header-anchor" href="#解析" aria-hidden="true">#</a> 解析</h2>
<p>我们亲爱的浏览器会解析三个东西：</p>
<ol>
<li><code v-pre>HTML/SVG/XHTML</code>。解析这三种文件会产生一个<code v-pre>DOM Tree</code>。（渲染引擎）</li>
<li><code v-pre>CSS</code>，解析<code v-pre>CSS</code>会产生<code v-pre>CSS规则树</code>。（渲染引擎）</li>
<li><code v-pre>Javascript</code>脚本，主要是通过<code v-pre>DOM API</code>和<code v-pre>CSSOM API</code>来操作<code v-pre>DOM Tree</code>和<code v-pre>CSS Rule Tree</code>。（JavaScript 解释器）</li>
</ol>
<p>解析完成后，浏览器引擎会通过<code v-pre>DOM Tree</code>和<code v-pre>CSS Rule Tree</code>来构造<code v-pre>Render Tree</code>。</p>
<p>大致流程如下图：
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/flow.png" alt="image"></p>
<p>我们来看看它们都是些啥。</p>
<h3 id="dom-tree" tabindex="-1"><a class="header-anchor" href="#dom-tree" aria-hidden="true">#</a> DOM Tree</h3>
<p>前面也简单讲过 DOM 树了，这里再从<a href="http://coolshell.cn/articles/9666.html" target="_blank" rel="noopener noreferrer">《浏览器的渲染原理简介》<ExternalLinkIcon/></a>偷一下（噢，上面东西也是很多从这偷...参考的）：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>head</span><span class="token punctuation">></span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>title</span><span class="token punctuation">></span></span>Web page parsing<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>title</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>head</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">></span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">></span></span>Web page parsing<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">></span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">></span></span>This is an example Web page.<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的这段<code v-pre>html</code>会生成这样的一个<code v-pre>DOM Tree</code>：<br>
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/DOM-Tree-01.jpg" alt="image"></p>
<p><code v-pre>DOM Tree</code>和<code v-pre>Render Tree</code>有个很简单的区别：像<code v-pre>header</code>或<code v-pre>display:none</code>的元素，会在<code v-pre>DOM Tree</code>中，但不会添加到<code v-pre>Render Tree</code>里。</p>
<h3 id="render-tree" tabindex="-1"><a class="header-anchor" href="#render-tree" aria-hidden="true">#</a> Render Tree</h3>
<p><code v-pre>CSS Rule Tree</code>主要是 Firefox 的产物。<br>
Firefox 基本上来说是通过<code v-pre>CSS</code>解析生成<code v-pre>CSS Rule Tree</code>，然后通过比对<code v-pre>DOM</code>生成<code v-pre>Style Context Tree</code>。<br>
然后 Firefox 通过把<code v-pre>Style Context Tree</code>和其<code v-pre>Render Tree（Frame Tree）</code>关联上，就完成了。</p>
<p>Webkit 不像 Firefox 要用两个树来干这个，Webkit 也有<code v-pre>Style</code>对象，它直接把这个<code v-pre>Style</code>对象存在了相应的<code v-pre>DOM</code>结点上了。</p>
<p>建立<code v-pre>CSS Rule Tree</code>是需要比照着<code v-pre>DOM Tree</code>来的。<code v-pre>CSS</code>匹配<code v-pre>DOM Tree</code>主要是从右到左解析<code v-pre>CSS</code>的<code v-pre>Selector</code>，这是一个相当复杂和有性能问题的事情。</p>
<h2 id="渲染" tabindex="-1"><a class="header-anchor" href="#渲染" aria-hidden="true">#</a> 渲染</h2>
<p>解析的角度大概讲完了，下面来从渲染的角度讲讲。</p>
<h3 id="基本流程" tabindex="-1"><a class="header-anchor" href="#基本流程" aria-hidden="true">#</a> 基本流程</h3>
<p>渲染的流程基本上如下（黄色的四个步骤）：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/Render-Process-Skipping-1024x282.jpg" alt="image"></p>
<ol>
<li>计算<code v-pre>CSS</code>样式</li>
<li>构建<code v-pre>Render Tree</code></li>
<li><code v-pre>Layout</code>：定位坐标和大小，是否换行，各种 position, overflow, z-index 属性等等</li>
<li>正式开画</li>
</ol>
<p><strong>重新<code v-pre>Layout</code></strong><br>
图中有很多连接线，代表<code v-pre>Javascript</code>动态修改了<code v-pre>DOM</code>属性或是<code v-pre>CSS</code>属会导致重新<code v-pre>Layout</code>，有些改变不会，就是那些指到天上的箭头，比如，修改后的<code v-pre>CSS rule</code>没有被匹配到。</p>
<p><strong>1. 重绘（Repaint）</strong><br>
<strong>屏幕的一部分要重画，比如某个 CSS 的背景色变了。但是元素的几何尺寸没有变。</strong></p>
<p><strong>2. 重排（Reflow）</strong><br>
<strong>元件的几何尺寸变了（<code v-pre>Render Tree</code>的一部分或全部发生了变化，<code v-pre>Reflow</code>或<code v-pre>Layout</code>），需要重新验证并计算<code v-pre>Render Tree</code>。</strong><br>
<code v-pre>HTML</code>使用的是流式布局，如果某元件的几何尺寸发生了变化，需要重新布局，也就叫<code v-pre>Reflow</code>。</p>
<p><code v-pre>Reflow</code>会从<code v-pre>&lt;html&gt;</code>这个<code v-pre>root frame</code>开始递归往下，依次计算所有的结点几何尺寸和位置，成本比<code v-pre>Repaint</code>的成本高得多的多。</p>
<p>所以我们要注意以下一些操作，因为可能会导致性能降低：</p>
<ul>
<li>增加、删除、修改<code v-pre>DOM</code>结点</li>
<li>移动<code v-pre>DOM</code>的位置，或是搞个动画</li>
<li>修改<code v-pre>CSS</code>样式</li>
<li><code v-pre>Resize</code>窗口（移动端没有这个问题），或是滚动</li>
</ul>
<p>了解这些以后，我们在写代码的时候就会下意识去比避免啦。当然，现在 MVVM 框架流行，以及 CSS3 普遍之后，手动操作<code v-pre>DOM</code>的场景也越来越少啦。</p>
<h2 id="浏览器加载顺序" tabindex="-1"><a class="header-anchor" href="#浏览器加载顺序" aria-hidden="true">#</a> 浏览器加载顺序</h2>
<h3 id="阻塞的-script-标签" tabindex="-1"><a class="header-anchor" href="#阻塞的-script-标签" aria-hidden="true">#</a> 阻塞的 script 标签</h3>
<p>正常的网页加载流程是这样的：</p>
<ol>
<li>浏览器一边下载 HTML 网页，一边开始解析</li>
<li>解析过程中，发现<code v-pre>&lt;script&gt;</code>标签</li>
<li>暂停解析，网页渲染的控制权转交给<code v-pre>JavaScript</code>引擎</li>
<li>如果<code v-pre>&lt;script&gt;</code>标签引用了外部脚本，就下载该脚本，否则就直接执行</li>
<li>执行完毕，控制权交还渲染引擎，恢复往下解析<code v-pre>HTML</code>网页</li>
</ol>
<p><strong>将<code v-pre>js</code>放在<code v-pre>body</code>的最后面，可以避免资源阻塞，同时使静态的<code v-pre>html</code>页面迅速显示。</strong><br>
如果外部脚本加载时间很长（比如一直无法完成下载），就会造成网页长时间失去响应，浏览器就会呈现“假死”状态，这被称为“阻塞效应”。<br>
<code v-pre>html</code>需要等<code v-pre>head</code>中所有的<code v-pre>js</code>和<code v-pre>css</code>加载完成后才会开始绘制，但是<code v-pre>html</code>不需要等待放在<code v-pre>body</code>最后的<code v-pre>js</code>下载执行就会开始绘制。</p>
<p><strong>将<code v-pre>css</code>放在<code v-pre>head</code>里，可避免浏览器渲染的重复计算。</strong><br>
经过上面的渲染过程，我们知道<code v-pre>Layout</code>的计算是比较消耗性能的，所以我们在开始计算<code v-pre>Render Tree</code>之前，就把所有的<code v-pre>css</code>文件拿到，这样可减少<code v-pre>Repaint</code>和<code v-pre>Reflow</code>。</p>
<h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2>
<ul>
<li><a href="http://taligarsiel.com/Projects/howbrowserswork1.htm" target="_blank" rel="noopener noreferrer">《How browsers work》<ExternalLinkIcon/></a></li>
<li><a href="http://coolshell.cn/articles/9666.html" target="_blank" rel="noopener noreferrer">《浏览器的渲染原理简介》<ExternalLinkIcon/></a></li>
<li><a href="http://www.cnblogs.com/yingsong/p/6170780.html" target="_blank" rel="noopener noreferrer">《html,css,js 加载顺序》<ExternalLinkIcon/></a></li>
</ul>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>这一节我们主要介绍了浏览器的主要结构、一些解析和渲染的机制。至于<code v-pre>js</code>文件的加载顺序、以及<code v-pre>js</code>代码的加载顺序等等，这里没有太多的讲解，小伙伴们可以自行去研究一下。</p>
</div></template>


