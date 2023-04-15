<template><div><p>该系列主要作为曾经的纯前端，对后台和底层的一些弥补，涉及进程、网络通信，以及对 node.js 和相关框架的学习。本节紧接着网络通信和 TCP/IP，介绍一下 HTTP 和 Websocket。</p>
<!--more-->
<h1 id="关于-http" tabindex="-1"><a class="header-anchor" href="#关于-http" aria-hidden="true">#</a> 关于 HTTP</h1>
<h2 id="http-请求" tabindex="-1"><a class="header-anchor" href="#http-请求" aria-hidden="true">#</a> HTTP 请求</h2>
<p>很多时候，尤其面试的时候我们会遇到这样的问题：打开浏览器，从输入地址按回车后发生的一系列过程是怎样的。</p>
<p>通常来说，一个完整的 HTTP 请求过程是这样的：</p>
<ul>
<li>域名解析（此处涉及 DNS 的寻址过程）</li>
<li>发起 TCP 的 3 次握手</li>
<li>建立 TCP 连接后发起 http 请求</li>
<li>服务器响应 http 请求，浏览器得到 html 代码</li>
<li>浏览器解析 html 代码，并请求 html 代码中的资源（如 js、css、图片等，此处可能涉及 HTTP 缓存）</li>
<li>浏览器对页面进行渲染呈现给用户（此处涉及浏览器的渲染原理）</li>
</ul>
<h2 id="无连接的-http" tabindex="-1"><a class="header-anchor" href="#无连接的-http" aria-hidden="true">#</a> 无连接的 HTTP</h2>
<h3 id="无连接" tabindex="-1"><a class="header-anchor" href="#无连接" aria-hidden="true">#</a> 无连接</h3>
<p>无连接的含义是限制每次连接只处理一个请求。服务器处理完客户的请求，并收到客户的应答后，即断开连接。<br>
采用这种方式可以节省传输时间。</p>
<h3 id="keep-alive" tabindex="-1"><a class="header-anchor" href="#keep-alive" aria-hidden="true">#</a> Keep-Alive</h3>
<p>随着时间的推移，网页变得越来越复杂，里面可能嵌入了很多图片，这时候每次访问图片都需要建立一次 TCP 连接就显得很低效。后来，Keep-Alive 被提出用来解决这效率低的问题。</p>
<p>Keep-Alive 功能使客户端到服务器端的连接持续有效，当出现对服务器的后继请求时，Keep-Alive 功能避免了建立或者重新建立连接。</p>
<h2 id="长连接的-http" tabindex="-1"><a class="header-anchor" href="#长连接的-http" aria-hidden="true">#</a> 长连接的 HTTP</h2>
<p>实现长连接有几个方式：ajax 轮询、长轮询、websocket 等。</p>
<h3 id="_1-轮询" tabindex="-1"><a class="header-anchor" href="#_1-轮询" aria-hidden="true">#</a> 1. 轮询</h3>
<p>客户端定时向服务器发送 Ajax 请求，服务器接到请求后马上返回响应信息并关闭连接。</p>
<ul>
<li>优点：后端程序编写比较容易。</li>
<li>缺点：请求中有大半是无用，浪费带宽和服务器资源。</li>
<li>实例：适于小型应用。</li>
</ul>
<h3 id="_2-长轮询" tabindex="-1"><a class="header-anchor" href="#_2-长轮询" aria-hidden="true">#</a> 2. 长轮询</h3>
<p>客户端向服务器发送 Ajax 请求，服务器接到请求后 hold 住连接，直到有新消息才返回响应信息并关闭连接，客户端处理完响应信息后再向服务器发送新的请求。</p>
<ul>
<li>优点：在无消息的情况下不会频繁的请求，耗费资源小。</li>
<li>缺点：服务器 hold 连接会消耗资源，返回数据顺序无保证，难于管理维护。</li>
<li>实例：WebQQ、Hi 网页版、Facebook IM。</li>
</ul>
<h3 id="_3-长连接" tabindex="-1"><a class="header-anchor" href="#_3-长连接" aria-hidden="true">#</a> 3. 长连接</h3>
<p>在页面里嵌入一个隐蔵 iframe，将这个隐蔵 iframe 的 src 属性设为对一个长连接的请求或是采用 xhr 请求，服务器端就能源源不断地往客户端输入数据。</p>
<ul>
<li>优点：消息即时到达，不发无用请求；管理起来也相对方便。</li>
<li>缺点：服务器维护一个长连接会增加开销。</li>
<li>实例：Gmail 聊天</li>
</ul>
<h3 id="_4-flash-socket" tabindex="-1"><a class="header-anchor" href="#_4-flash-socket" aria-hidden="true">#</a> 4. Flash Socket</h3>
<p>在页面中内嵌入一个使用了 Socket 类的 Flash 程序。JavaScript 通过调用此 Flash 程序提供的 Socket 接口与服务器端的 Socket 接口进行通信，JavaScript 在收到服务器端传送的信息后控制页面的显示。</p>
<ul>
<li>优点：实现真正的即时通信，而不是伪即时。</li>
<li>缺点：客户端必须安装 Flash 插件；非 HTTP 协议，无法自动穿越防火墙。</li>
<li>实例：网络互动游戏。</li>
</ul>
<p>以上一些是基于 HTTP 协议的长连接实现方案，而下面讲到的 Websocket 则是基于 HTTP 协议上的另外一种通信协议。</p>
<h1 id="websocket" tabindex="-1"><a class="header-anchor" href="#websocket" aria-hidden="true">#</a> Websocket</h1>
<h2 id="什么是-websocket" tabindex="-1"><a class="header-anchor" href="#什么是-websocket" aria-hidden="true">#</a> 什么是 Websocket</h2>
<p>WebSocket 是 HTML5 下一种新的协议。它实现了浏览器与服务器全双工通信，能更好的节省服务器资源和带宽并达到实时通讯的目的。</p>
<p>Websocket 为持久化协议，基于 HTTP 协议（借用 HTTP 协议完成一部分握手）。</p>
<p>WebSocket 是一种双向通信协议。在建立连接后，WebSocket 服务器端和客户端都能主动向对方发送或接收数据，就像 Socket 一样。它与 HTTP 一样通过已建立的 TCP 连接来传输数据。</p>
<h2 id="websocket-与-http" tabindex="-1"><a class="header-anchor" href="#websocket-与-http" aria-hidden="true">#</a> Websocket 与 HTTP</h2>
<p>相比 HTTP 长连接，WebSocket 有以下特点：</p>
<ol>
<li>是真正的全双工方式，建立连接后客户端与服务器端是完全平等的，可以互相主动请求。</li>
</ol>
<p>HTTP 长连接基于 HTTP，是传统的客户端对服务器发起请求的模式。<br>
HTTP 的生命周期通过 Request 来界定，也就是一个 Request 一个 Response，且 response 也是被动的，不能主动发起。</p>
<ol start="2">
<li>HTTP 长连接中，每次数据交换除了真正的数据部分外，服务器和客户端还要大量交换 HTTP header，信息交换效率很低。</li>
</ol>
<p>Websocket 协议通过第一个 request 建立了 TCP 连接之后，之后交换的数据都不需要发送 HTTP header 就能交换数据，这显然和原有的 HTTP 协议有区别。所以它需要对服务器和客户端都进行升级才能实现（主流浏览器都已支持 HTML5）。<br>
还有 multiplexing、不同的 URL 可以复用同一个 WebSocket 连接等功能。这些都是 HTTP 长连接不能做到的。</p>
<h2 id="websocket-特点" tabindex="-1"><a class="header-anchor" href="#websocket-特点" aria-hidden="true">#</a> Websocket 特点</h2>
<p>Websocket 的其他特点包括：</p>
<ol>
<li>建立在 TCP 协议之上，服务器端的实现比较容易。</li>
<li>与 HTTP 协议有着良好的兼容性。默认端口也是 80 和 443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器。</li>
<li>数据格式比较轻量，性能开销小，通信高效。</li>
<li>可以发送文本，也可以发送二进制数据。</li>
<li>没有同源限制，客户端可以与任意服务器通信。</li>
<li>协议标识符是 ws（如果加密，则为 wss），服务器网址就是 URL。</li>
</ol>
<h2 id="使用-websocket" tabindex="-1"><a class="header-anchor" href="#使用-websocket" aria-hidden="true">#</a> 使用 Websocket</h2>
<ul>
<li>WebSocket 构造函数<br>
WebSocket 对象作为一个构造函数，用于新建 WebSocket 实例。</li>
</ul>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> ws <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">WebSocket</span><span class="token punctuation">(</span><span class="token string">"ws://localhost:8080"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li>
<p><code v-pre>ws.readyState</code><br>
readyState 属性返回实例对象的当前状态，共有四种。</p>
<ul>
<li>CONNECTING：值为 0，表示正在连接。</li>
<li>OPEN：值为 1，表示连接成功，可以通信了。</li>
<li>CLOSING：值为 2，表示连接正在关闭。</li>
<li>CLOSED：值为 3，表示连接已经关闭，或者打开连接失败。</li>
</ul>
</li>
<li>
<p><code v-pre>onopen</code>属性：用于指定连接成功后的回调函数</p>
</li>
<li>
<p><code v-pre>onclose</code>属性：用于指定连接关闭后的回调函数</p>
</li>
<li>
<p><code v-pre>onmessage</code>属性：用于指定收到服务器数据后的回调函数</p>
</li>
<li>
<p><code v-pre>send()</code>方法：用于向服务器发送数据</p>
</li>
<li>
<p><code v-pre>bufferedAmount</code>属性：表示还有多少字节的二进制数据没有发送出去，它可以用来判断发送是否结束</p>
</li>
<li>
<p><code v-pre>onerror</code>属性：用于指定报错时的回调函数</p>
</li>
</ul>
<p>更多的可以参考<a href="https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket" target="_blank" rel="noopener noreferrer">MDN<ExternalLinkIcon/></a>。</p>
<h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2>
<ul>
<li><a href="http://www.cnblogs.com/hoojo/p/longPolling_comet_jquery_iframe_ajax.html" target="_blank" rel="noopener noreferrer">《Web 通信之长连接、长轮询（long polling）》<ExternalLinkIcon/></a></li>
<li><a href="https://godbasin.github.io/2017/05/20/front-end-notes-7-init-http/" target="_blank" rel="noopener noreferrer">《前端阶段性总结之「理解 HTTP 协议」》<ExternalLinkIcon/></a></li>
<li><a href="https://www.qcloud.com/document/product/214/4150?fromSource=gwzcw.93403.93403.93403" target="_blank" rel="noopener noreferrer">WebSocket 原理说明<ExternalLinkIcon/></a></li>
<li><a href="https://www.zhihu.com/question/20215561" target="_blank" rel="noopener noreferrer">知乎--WebSocket 是什么原理？为什么可以实现持久连接？<ExternalLinkIcon/></a></li>
<li><a href="http://www.ruanyifeng.com/blog/2017/05/websocket.html" target="_blank" rel="noopener noreferrer">WebSocket 教程<ExternalLinkIcon/></a></li>
</ul>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>本节主要介绍了 HTTP 通信和 Websocket 协议相关，关于 HTTP 协议的内容和知识点还有很多，大家有兴趣可以去补充一下。</p>
</div></template>


