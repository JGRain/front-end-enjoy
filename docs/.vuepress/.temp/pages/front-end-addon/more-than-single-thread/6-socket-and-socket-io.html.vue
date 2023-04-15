<template><div><p>该系列主要作为曾经的纯前端，对后台和底层的一些弥补，涉及进程、网络通信，以及对 node.js 和相关框架的学习。本节我们来一起认识认识套接字（Socket）和 socket.io。</p>
<!--more-->
<h1 id="socket-io" tabindex="-1"><a class="header-anchor" href="#socket-io" aria-hidden="true">#</a> socket.io</h1>
<h2 id="套接字-socket-概念" tabindex="-1"><a class="header-anchor" href="#套接字-socket-概念" aria-hidden="true">#</a> 套接字（Socket）概念</h2>
<p>套接字（Socket）起源于 UNIX，在 Unix 一切皆文件哲学的思想下，Socket 是一种&quot;打开—读/写—关闭&quot;模式的实现，服务器和客户端各自维护一个&quot;文件&quot;，在建立连接打开后，可以向自己文件写入内容供对方读取或者读取对方内容，通讯结束时关闭文件。</p>
<p>Socket 是一种进程间通信机制，提供一种供应用程序访问通信协议的操作系统调用，并且通过将 Socket 与 Unix 系统文件描述符相整合，使得网络读写数据（或者服务调用）和读写本地文件一样容易。</p>
<p>Socket 是一序列的“指令” ，按汉语的理解，已经具备了“套接”（建立网络通讯或进程间通讯）和“字”（可交互的有序指令串）的概念，故称套接字。</p>
<h2 id="socket-与网络进程通信" tabindex="-1"><a class="header-anchor" href="#socket-与网络进程通信" aria-hidden="true">#</a> Socket 与网络进程通信</h2>
<p>Socket 是通信的基石，是支持 TCP/IP 协议的网络通信的基本操作单元。它是网络通信过程中端点的抽象表示，包含进行网络通信必须的五种信息：连接使用的协议，本地主机的 IP 地址，本地进程的协议端口，远地主机的 IP 地址，远地进程的协议端口。</p>
<p>Socket 是应用层与 TCP/IP 协议族通信的中间软件抽象层，它是一组接口。在设计模式中，Socket 其实就是一个门面模式，它把复杂的 TCP/IP 协议族隐藏在 Socket 接口后面，对用户来说，一组简单的接口就是全部，让 Socket 去组织数据，以符合指定的协议。</p>
<p>扯回前面<RouterLink to="/front-end-addon/more-than-single-thread/4-network-progress-and-tcp-ip.html">《4. 网络进程通信和 TCP/IP 协议》</RouterLink>中的进程通信，两个进程如果需要进行通讯最基本的一个前提能能够唯一的标示一个进程，在本地进程通讯中我们可以使用 PID 来唯一标示一个进程，但 PID 只在本地唯一。</p>
<p>我们知道 IP 层的 ip 地址可以唯一标示主机，而 TCP 层协议和端口号可以唯一标示主机的一个进程，这样我们可以利用 ip 地址＋协议＋端口号唯一标示网络中的一个进程。</p>
<p>应用层通过传输层进行数据通信时，TCP 会遇到同时为多个应用程序进程提供并发服务的问题。多个 TCP 连接或多个应用程序进程可能需要通过同一个 TCP 协议端口传输数据。为了区别不同的应用程序进程和连接，许多计算机操作系统为应用程序与 TCP／IP 协议交互提供了套接字(Socket)接口。应用层可以和传输层通过 Socket 接口，区分来自不同应用程序进程或网络连接的通信，实现数据传输的并发服务。</p>
<h2 id="建立-socket-连接" tabindex="-1"><a class="header-anchor" href="#建立-socket-连接" aria-hidden="true">#</a> 建立 Socket 连接</h2>
<p>上面提到，Socket 是&quot;打开—读/写—关闭&quot;模式的实现。</p>
<p>建立 Socket 连接至少需要一对套接字，其中一个运行于客户端，称为 ClientSocket，另一个运行于服务器端，称为 ServerSocket。</p>
<p><strong>套接字之间的连接过程分为三个步骤：服务器监听，客户端请求，连接确认。</strong></p>
<h3 id="服务器监听" tabindex="-1"><a class="header-anchor" href="#服务器监听" aria-hidden="true">#</a> 服务器监听</h3>
<p>服务器端套接字并不定位具体的客户端套接字，而是处于等待连接的状态，实时监控网络状态，等待客户端的连接请求。</p>
<h3 id="客户端请求" tabindex="-1"><a class="header-anchor" href="#客户端请求" aria-hidden="true">#</a> 客户端请求</h3>
<p>指客户端的套接字提出连接请求，要连接的目标是服务器端的套接 S 字。为此，客户端的套接字必须首先描述它要连接的服务器的套接字，指出服务器端套接字的地址和端口号，然后就向服务器端套接字提出连接请求。</p>
<h3 id="连接确认" tabindex="-1"><a class="header-anchor" href="#连接确认" aria-hidden="true">#</a> 连接确认</h3>
<p>当服务器端套接字监听到或者说接收到客户端套接字的连接请求时，就响应客户端套接字的请求，建立一个新的线程，把服务器端套接字的描述发 给客户端，一旦客户端确认了此描述，双方就正式建立连接。而服务器端套接字继续处于监听状态，继续接收其他客户端套接字的连接请求。</p>
<p>以使用 TCP 协议通讯的 Socket 为例，其交互流程大概是这样子的：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/05232335-fb19fc7527e944d4845ef40831da4ec2.png" alt="images"></p>
<p>先从服务器端说起。服务器端先初始化 Socket，然后与端口绑定(bind)，对端口进行监听(listen)，调用 accept 阻塞，等待客户端连接。在这时如果有个客户端初始化一个 Socket，然后连接服务器(connect)，如果连接成功，这时客户端与服务器端的连接就建立了。客户端发送数据请求，服务器端接收请求并处理请求，然后把回应数据发送给客户端，客户端读取数据，最后关闭连接，一次交互结束。</p>
<p>通常服务器在启动的时候都会绑定一个众所周知的地址（如 ip 地址+端口号），用于提供服务，客户就可以通过它来接连服务器；而客户端就不用指定，有系统自动分配一个端口号和自身的 ip 地址组合。这就是为什么通常服务器端在 listen 之前会调用 bind()，而客户端就不会调用，而是在 connect()时由系统随机生成一个。</p>
<h2 id="socket-io-1" tabindex="-1"><a class="header-anchor" href="#socket-io-1" aria-hidden="true">#</a> socket.io</h2>
<p>socket.io 是基于 Socket 连接后对网络输入输出流的处理。</p>
<p>socket.io 是一个面向实时 web 应用的 JavaScript 库。它使得服务器和客户端之间实时双向的通信成为可能。socket.io 将 WebSocket 和轮询（Polling）机制以及其它的实时通信方式封装成了通用的接口，并且在服务端实现了这些实时机制的相应代码。</p>
<p>socket.io 有两个部分：在浏览器中运行的客户端库，和一个面向 Node.js 的服务端库。两者有着几乎一样的 API。</p>
<p>像 Node.js 一样，socket.io 也是事件驱动的。</p>
<p>socket.io 主要使用 WebSocket 协议。但是如果需要的话，socket.io 可以回退到几种其它方法，例如 Adobe Flash Sockets，JSONP 拉取，或是传统的 AJAX 拉取，并且在同时提供完全相同的接口。
尽管可以被用作 WebSocket 的包装库，它还是提供了许多其它功能，比如广播至多个套接字，存储与不同客户有关的数据，和异步 io 操作。</p>
<p><strong>优势：socket.io 会自动选择合适双向通信协议</strong> ，仅仅需要程序员对套接字的概念有所了解。</p>
<p><strong>劣势：socket.io 要求客户端与服务器端均须使用该框架</strong><br>
socket.io 并不是一个基本的、独立的、能够回退到其它实时协议的 WebSocket 库，它实际上是一个依赖于其它实时传输协议的自定义实时传输协议的实现。该协议的协商部分使得支持标准 WebSocket 的客户端不能直接连接到 socket.io 服务器，并且支持 socket.io 的客户端也不能与非 socket.io 框架的 WebSocket 或 Comet 服务器通信。</p>
<h2 id="使用-socket-io" tabindex="-1"><a class="header-anchor" href="#使用-socket-io" aria-hidden="true">#</a> 使用 socket.io</h2>
<p><strong>函数</strong></p>
<p>服务器还是客户端都有<code v-pre>emit</code>和<code v-pre>on</code>这两个函数，可以说 socket.io 的核心就是这两个函数了，通过<code v-pre>emit</code>和<code v-pre>on</code>可以轻松地实现服务器与客户端之间的双向通信。</p>
<ul>
<li><code v-pre>emit</code>
<ul>
<li>用来发射一个事件或者说触发一个事件</li>
<li>第一个参数为事件名，第二个参数为要发送的数据，第三个参数为回调函数（一般省略，如需对方接受到信息后立即得到确认时，则需要用到回调函数）</li>
</ul>
</li>
<li><code v-pre>on</code>：
<ul>
<li>用来监听一个<code v-pre>emit</code>发射的事件</li>
<li>第一个参数为要监听的事件名，第二个参数为一个匿名函数用来接收对方发来的数据，该匿名函数的第一个参数为接收的数据，若有第二个参数，则为要返回的函数</li>
</ul>
</li>
</ul>
<p>在服务器端区分以下三种情况：</p>
<ul>
<li><code v-pre>socket.emit()</code>：向建立该连接的客户端广播</li>
<li><code v-pre>socket.broadcast.emit()</code>：向除去建立该连接的客户端的所有客户端广播</li>
<li><code v-pre>io.sockets.emit()</code>：向所有客户端广播，等同于上面两个的和</li>
</ul>
<p><strong>事件</strong></p>
<p>socket.io 提供了三种默认的事件（客户端和服务器都有）：<code v-pre>connect</code>、<code v-pre>message</code>、<code v-pre>disconnect</code>。当与对方建立连接后自动触发<code v-pre>connect</code>事件，当收到对方发来的数据后触发<code v-pre>message</code>事件（通常为<code v-pre>socket.send()</code>触发），当对方关闭连接后触发<code v-pre>disconnect</code>事件。</p>
<p>此外，socket.io 还支持自定义事件。</p>
<h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2>
<ul>
<li><a href="http://www.cnblogs.com/airtcp/p/5230161.html" target="_blank" rel="noopener noreferrer">《Socket 基本原理》<ExternalLinkIcon/></a></li>
<li><a href="http://www.cnblogs.com/dolphinX/p/3460545.html" target="_blank" rel="noopener noreferrer">《简单理解 Socket》<ExternalLinkIcon/></a></li>
<li><a href="http://goodcandle.cnblogs.com/archive/2005/12/10/294652.aspx" target="_blank" rel="noopener noreferrer">《揭开 Socket 编程的面纱》<ExternalLinkIcon/></a></li>
<li><a href="http://www.cnblogs.com/skynet/archive/2010/12/12/1903949.html" target="_blank" rel="noopener noreferrer">《Linux Socket 编程（不限 Linux）》<ExternalLinkIcon/></a></li>
<li><a href="https://zh.wikipedia.org/wiki/Socket.IO" target="_blank" rel="noopener noreferrer">Socket.IO - 维基百科，自由的百科全书<ExternalLinkIcon/></a></li>
<li><a href="https://github.com/nswbmw/N-chat/wiki/%E7%AC%AC%E4%B8%80%E7%AB%A0-socket.io-%E7%AE%80%E4%BB%8B%E5%8F%8A%E4%BD%BF%E7%94%A8" target="_blank" rel="noopener noreferrer">《第一章 socket.io 简介及使用》<ExternalLinkIcon/></a></li>
</ul>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>本节我们主要介绍了套接字（Socket），以及相关的 JavaScript 库--socket.io。<br>
其实前面几节作为知识补充，大部分都是网络搜刮汇总来的，本骚年自身的功力也没成长到能有一定的思考产物，这块或许也需要增长呢。</p>
</div></template>


