import{_ as r,M as o,p as n,q as h,Q as s,R as e,t as a,N as i,a1 as l}from"./framework-5866ffd3.js";const d={},p=e("p",null,"该篇主要整理初认识 http 时的一些概念和内容分享，以及 HTTP 缓存、同源和跨域。",-1),c=l(`<h2 id="http-协议" tabindex="-1"><a class="header-anchor" href="#http-协议" aria-hidden="true">#</a> HTTP 协议</h2><h3 id="基本概念" tabindex="-1"><a class="header-anchor" href="#基本概念" aria-hidden="true">#</a> 基本概念</h3><p>协议是指计算机通信网络中两台计算机之间进行通信所必须共同遵守的规定或规则，超文本传输协议(HTTP)是一种通信协议，它允许将超文本标记语言(HTML)文档从 Web 服务器传送到客户端的浏览器。</p><h4 id="一个完整的-http-请求过程" tabindex="-1"><a class="header-anchor" href="#一个完整的-http-请求过程" aria-hidden="true">#</a> 一个完整的 HTTP 请求过程</h4><ul><li>域名解析（此处涉及 DNS 的寻址过程）</li><li>发起 TCP 的 3 次握手</li><li>建立 TCP 连接后发起 http 请求</li><li>服务器响应 http 请求，浏览器得到 html 代码</li><li>浏览器解析 html 代码，并请求 html 代码中的资源（如 js、css、图片等，此处可能涉及 HTTP 缓存）</li><li>浏览器对页面进行渲染呈现给用户（此处涉及浏览器的渲染原理）</li></ul><h3 id="url-详解" tabindex="-1"><a class="header-anchor" href="#url-详解" aria-hidden="true">#</a> URL 详解</h3><p>URL(Uniform Resource Locator) 地址用于描述一个网络上的资源, 基本格式如下：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token literal-property property">schema</span><span class="token operator">:</span><span class="token operator">/</span><span class="token operator">/</span>host<span class="token punctuation">[</span><span class="token operator">:</span>port#<span class="token punctuation">]</span><span class="token operator">/</span>path<span class="token operator">/</span><span class="token operator">...</span><span class="token operator">/</span><span class="token punctuation">[</span><span class="token operator">?</span>query<span class="token operator">-</span>string<span class="token punctuation">]</span><span class="token punctuation">[</span>#anchor<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>包括：</p><ul><li>scheme: 指定低层使用的协议(例如：http, https, ftp)</li><li>host: HTTP 服务器的 IP 地址或者域名</li><li>port#: HTTP 服务器的默认端口是 80，这种情况下端口号可以省略。如果使用了别的端口，必须指明，例如 http://www.cnblogs.com:8080/</li><li>path: 访问资源的路径</li><li>query-string: 发送给 http 服务器的数据</li><li>anchor: 锚</li></ul><h3 id="http-消息的结构" tabindex="-1"><a class="header-anchor" href="#http-消息的结构" aria-hidden="true">#</a> HTTP 消息的结构</h3><h4 id="request-请求" tabindex="-1"><a class="header-anchor" href="#request-请求" aria-hidden="true">#</a> Request 请求</h4><ul><li>Request line <ul><li>包括：请求方法、请求的资源、HTTP 协议的版本号</li></ul></li><li>Request header <ul><li>包括：Cache 头域、Client 头域、Cookie/Login 头域、Entity 头域、Miscellaneous 头域、Transport 头域等</li></ul></li><li>空行</li><li>Request body</li></ul><h4 id="response-响应" tabindex="-1"><a class="header-anchor" href="#response-响应" aria-hidden="true">#</a> Response 响应</h4><ul><li>Response line <ul><li>包括：HTTP 协议的版本号、状态码、消息</li></ul></li><li>Response header <ul><li>包括：Cache 头域、Cookie/Login 头域、Entity 头域、Miscellaneous 头域、Transport 头域、Location 头域等</li></ul></li><li>空行</li><li>Response body</li></ul><p>对于无论是 Request 还是 Response 的 header 头部，每个字段都需要去理解的，大家平时可多留意一下浏览器的请求。</p><h3 id="状态码" tabindex="-1"><a class="header-anchor" href="#状态码" aria-hidden="true">#</a> 状态码</h3><p>HTTP/1.1 中定义了 5 类状态码， 状态码由三位数字组成，第一个数字定义了响应的类别。</p><table><thead><tr><th>状态码</th><th>类别</th><th>表达内容</th></tr></thead><tbody><tr><td>1XX</td><td>提示信息</td><td>表示请求已被成功接收，继续处理</td></tr><tr><td>2XX</td><td>成功</td><td>表示请求已被成功接收，理解，接受</td></tr><tr><td>3XX</td><td>重定向</td><td>要完成请求必须进行更进一步的处理</td></tr><tr><td>4XX</td><td>客户端错误</td><td>请求有语法错误或请求无法实现</td></tr><tr><td>5XX</td><td>服务器端错误</td><td>服务器未能实现合法的请求</td></tr></tbody></table><p>常见状态码：</p><ul><li>200 OK</li><li>302 Found 重定向</li><li>304 Not Modified 缓存</li><li>400 Bad Request 客户端请求与语法错误/403 Forbidden 服务器拒绝提供服务/404 Not Found 请求资源不存在</li><li>500 Internal Server Error 服务器发生了不可预期的错误/503 Server Unavailable 服务器当前不能处理客户端的请求，一段时间后可能恢复正常</li></ul><h3 id="请求方法" tabindex="-1"><a class="header-anchor" href="#请求方法" aria-hidden="true">#</a> 请求方法</h3><p>常用方法：</p><ul><li><code>GET/POST/PUT/DELETE/OPTION</code></li><li>理解 GET 和 POST 的区别：包括是否有 body、长度限制、是否可缓存等等</li></ul><h3 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h3>`,25),u={href:"https://www.cnblogs.com/TankXiao/archive/2012/02/13/2342672.html",target:"_blank",rel:"noopener noreferrer"},T={href:"http://blog.csdn.net/yipiankongbai/article/details/25029183",target:"_blank",rel:"noopener noreferrer"},b=l('<h2 id="http-的特性" tabindex="-1"><a class="header-anchor" href="#http-的特性" aria-hidden="true">#</a> HTTP 的特性</h2><p>HTTP 是一个属于应用层的面向对象的协议，HTTP 协议一共有五大特点：</p><ol><li>支持客户/服务器模式；</li><li>简单快速；</li><li>灵活；</li><li>无连接；</li><li>无状态。</li></ol><h3 id="无连接的-http" tabindex="-1"><a class="header-anchor" href="#无连接的-http" aria-hidden="true">#</a> 无连接的 HTTP</h3><h4 id="无连接" tabindex="-1"><a class="header-anchor" href="#无连接" aria-hidden="true">#</a> 无连接</h4><p>无连接的含义是限制每次连接只处理一个请求。服务器处理完客户的请求，并收到客户的应答后，即断开连接。<br> 采用这种方式可以节省传输时间。</p><h4 id="keep-alive" tabindex="-1"><a class="header-anchor" href="#keep-alive" aria-hidden="true">#</a> Keep-Alive</h4><p>随着时间的推移，网页变得越来越复杂，里面可能嵌入了很多图片，这时候每次访问图片都需要建立一次 TCP 连接就显得很低效。后来，Keep-Alive 被提出用来解决这效率低的问题。</p><p>Keep-Alive 功能使客户端到服务器端的连接持续有效，当出现对服务器的后继请求时，Keep-Alive 功 能避免了建立或者重新建立连接。</p><h4 id="长连接" tabindex="-1"><a class="header-anchor" href="#长连接" aria-hidden="true">#</a> 长连接</h4><p>实现长连接有几个方式：ajax 轮询、long pull、websocket 等。<br> Websocket 为持久化协议，基于 HTTP 协议（借用 HTTP 协议完成一部分握手）。</p><h3 id="无状态的-http" tabindex="-1"><a class="header-anchor" href="#无状态的-http" aria-hidden="true">#</a> 无状态的 HTTP</h3><h4 id="无状态" tabindex="-1"><a class="header-anchor" href="#无状态" aria-hidden="true">#</a> 无状态</h4><p>无状态是指协议对于事务处理没有记忆能力，服务器不知道客户端是什么状态。即我们给服务器发送 HTTP 请求之后，服务器根据请求，会给我们发送数据过来，但是，发送完，不会记录任何信息。</p><p>HTTP 协议这种特性有优点也有缺点，优点在于解放了服务器，每一次请求“点到为止”不会造成不必要连接占用，缺点在于每次请求会传输大量重复的内容信息。</p><p>客户端与服务器进行动态交互的 Web 应用程序出现之后，HTTP 无状态的特性严重阻碍了这些应用程序的实现，毕竟交互是需要承前启后的，简单的购物车程序也要知道用户到底在之前选择了什么商品。<br> 于是，两种用于保持 HTTP 连接状态的技术就应运而生了，一个是 Cookie，而另一个则是 Session。</p><h4 id="cookie" tabindex="-1"><a class="header-anchor" href="#cookie" aria-hidden="true">#</a> Cookie</h4><p>Cookie 可以保持登录信息到用户下次与服务器的会话，换句话说，下次访问同一网站时，用户会发现不必输入用户名和密码就已经登录了（当然，不排除用户手工删除 Cookie）。<br> 而还有一些 Cookie 在用户退出会话的时候就被删除了，这样可以有效保护个人隐私。</p><h4 id="session" tabindex="-1"><a class="header-anchor" href="#session" aria-hidden="true">#</a> Session</h4><p>与 Cookie 相对的一个解决方案是 Session，它是通过服务器来保持状态的。</p><p>当客户端访问服务器时，服务器根据需求设置 Session，将会话信息保存在服务器上，同时将标示 Session 的 SessionId 传递给客户端浏览器，浏览器将这个 SessionId 保存在内存中，我们称之为无过期时间的 Cookie。浏览器关闭后，这个 Cookie 就会被清掉，它不会存在于用户的 Cookie 临时文件。<br> 以后浏览器每次请求都会额外加上这个参数值，服务器会根据这个 SessionId，就能取得客户端的数据信息。</p><h4 id="token" tabindex="-1"><a class="header-anchor" href="#token" aria-hidden="true">#</a> Token</h4><p>其实 Token 更多是在用户授权中使用，例如移动 App 通常采用 Token 进行验证。<br> Token 和 Session 有第一定的类似，但是服务器不保存状态，而是生成一个 Token 保存在客户端，这个 Token 是加密并确保完整性和不变性的，也就是修改后无效的，所以是安全的，可以保存在客户端。<br> 同时 Token 支持跨域访问、无状态等，也能解决 Cookie 劫持(CSRF)的安全问题。</p><p>这里的一些只是也是本骚年搜集来的，不能保证准确性的，仅供参考哈。</p><h2 id="http-与浏览器缓存" tabindex="-1"><a class="header-anchor" href="#http-与浏览器缓存" aria-hidden="true">#</a> HTTP 与浏览器缓存</h2><h3 id="web-缓存" tabindex="-1"><a class="header-anchor" href="#web-缓存" aria-hidden="true">#</a> Web 缓存</h3><p>Web 缓存存在于服务器和客户端之间。<br> Web 缓存密切注视着服务器-客户端之间的通信，监控请求，并且把请求输出的内容（例如 html 页面、 图片和文件）另存一份；然后，如果下一个请求是相同的 URL，则直接使用保存的副本，而不是再次请求源服务器。</p><p>在 Web 应用领域，Web 缓存大致可以分为以下几种类型：</p><ul><li>数据库数据缓存</li><li>服务器端缓存 <ul><li>代理服务器缓存</li><li>CDN 缓存</li></ul></li><li>浏览器端缓存</li><li>Web 应用层缓存</li></ul><h3 id="浏览器缓存" tabindex="-1"><a class="header-anchor" href="#浏览器缓存" aria-hidden="true">#</a> 浏览器缓存</h3><p>当一个客户端请求 web 服务器, 请求的内容可以从以下几个地方获取：服务器、浏览器缓存中或缓存服务器中。这取决于服务器端输出的页面信息。</p><h4 id="页面文件的三种缓存状态" tabindex="-1"><a class="header-anchor" href="#页面文件的三种缓存状态" aria-hidden="true">#</a> 页面文件的三种缓存状态</h4><ul><li>最新的：选择不缓存页面，每次请求时都从服务器获取最新的内容</li><li>未过期的：在给定的时间内缓存，如果用户刷新或页面过期则去服务器请求，否则将读取本地的缓存，这样可以提高浏览速度</li><li>过期的：也就是陈旧的页面，当请求这个页面时，必须进行重新获取</li></ul><p>浏览器会在第一次请求完服务器后得到响应，我们可以在服务器中设置这些响应，从而达到在以后的请求中尽量减少甚至不从服务器获取资源的目的。<br> 浏览器是依靠请求和响应中的的头信息来控制缓存的。</p><h4 id="无法被浏览器缓存的请求" tabindex="-1"><a class="header-anchor" href="#无法被浏览器缓存的请求" aria-hidden="true">#</a> 无法被浏览器缓存的请求</h4><ul><li>HTTP 信息头中包含 Cache-Control:no-cache，pragma:no-cache（HTTP1.0），或 Cache-Control:max-age=0 等告诉浏览器不用缓存的请求</li><li>需要根据 Cookie，认证信息等决定输入内容的动态请求是不能被缓存的</li><li>经过 HTTPS 安全加密的请求（有人也经过测试发现，ie 其实在头部加入 Cache-Control：max-age 信息，firefox 在头部加入 Cache-Control:Public 之后，能够对 HTTPS 的资源进行缓存，参考《HTTPS 的七误解》）</li><li>POST 请求无法被缓存</li><li>HTTP 响应头中不包含 Last-Modified/Etag，也不包含 Cache-Control/Expires 的请求无法被缓存</li></ul><h3 id="http-头信息" tabindex="-1"><a class="header-anchor" href="#http-头信息" aria-hidden="true">#</a> HTTP 头信息</h3><ul><li><strong>Expires 与 Cache-Control</strong></li></ul><p>Expires 和 Cache-Control 就是服务端用来约定和客户端的有效时间的。规定如果 max-age 和 Expires 同时存在，前者优先级高于后者。<br> 若符合，浏览器相应 HTTP200(from cache)。</p><ul><li><strong>Last-Modified/If-Modified-Since</strong></li><li><strong>ETag/If-None-Match</strong></li></ul><p>而 Last-Modified/If-Modified-Since 就是上面说的当有效期过后，check 服务端文件是否更新的第一种方式，要配合 Cache-Control 使用。<br> ETag 值，该值在服务端和服务端代表该文件唯一的字符串对比（如果服务端该文件改变了，该值就会变）。<br> 如果相同，则响应 HTTP304，从缓存读数据；如果不相同文件更新了，HTTP200，返回数据，同时通过响应头更新 last-Modified 的值（以备下次对比）。</p><ul><li><strong>浏览器请求流程</strong></li></ul><p>这里直接使用网上找来的描述很棒的图片。</p><p>第一次请求：</p><p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/015343_psx2_568818.png" alt="image"></p><p>再次请求：</p><p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/015353_P04w_568818.png" alt="image"></p><h2 id="http-与跨域" tabindex="-1"><a class="header-anchor" href="#http-与跨域" aria-hidden="true">#</a> HTTP 与跨域</h2><h3 id="浏览器同源政策" tabindex="-1"><a class="header-anchor" href="#浏览器同源政策" aria-hidden="true">#</a> 浏览器同源政策</h3><p>同源政策的目的，是为了保证用户信息的安全，防止恶意的网站窃取数据。</p><p>所谓&quot;同源&quot;指的是&quot;三个相同&quot;: 协议相同、域名相同、端口相同。</p><p>随着互联网的发展，&quot;同源政策&quot;越来越严格。目前，如果非同源，共有三种行为受到限制。</p><ol><li>Cookie、LocalStorage 和 IndexDB 无法读取。</li><li>DOM 无法获得。</li><li>AJAX 请求不能发送。</li></ol><h3 id="前端解决跨域问题" tabindex="-1"><a class="header-anchor" href="#前端解决跨域问题" aria-hidden="true">#</a> 前端解决跨域问题</h3><ul><li>document.domain + iframe(只有在主域相同的时候才能使用该方法)</li><li>动态创建 script(JSONP) <blockquote><p>JSONP 包含两部分：回调函数和数据。 回调函数是当响应到来时要放在当前页面被调用的函数。 数据就是传入回调函数中的 json 数据，也就是回调函数的参数了。</p></blockquote></li><li>location.hash + iframe <blockquote><p>原理是利用 location.hash 来进行传值。</p></blockquote></li><li>window.name + iframe <blockquote><p>window.name 的美妙之处：name 值在不同的页面（甚至不同域名）加载后依旧存在，并且可以支持非常长的 name 值（2MB）。</p></blockquote></li><li>postMessage（HTML5 中的 XMLHttpRequest Level 2 中的 API）</li><li>CORS</li><li>websockets <blockquote><p>websockets 是一种浏览器的 API，它的目标是在一个单独的持久连接上提供全双工、双向通信。(同源策略对 web sockets 不适用) websockets 原理：在 JS 创建了 web socket 之后，会有一个 HTTP 请求发送到浏览器以发起连接。取得服务器响应后，建立的连接会使用 HTTP 升级从 HTTP 协议交换为 websockt 协议。</p></blockquote></li></ul>',55),f=e("br",null,null,-1),k={href:"http://www.cnblogs.com/JChen666/p/3399951.html",target:"_blank",rel:"noopener noreferrer"},P=l('<h3 id="cors" tabindex="-1"><a class="header-anchor" href="#cors" aria-hidden="true">#</a> CORS</h3><p>CORS 是一个 W3C 标准，全称是&quot;跨域资源共享&quot;（Cross-origin resource sharing）。<br> 它允许浏览器向跨源服务器，发出 XMLHttpRequest 请求，从而克服了 AJAX 只能同源使用的限制。</p><p>实现 CORS 通信的关键是服务器。只要服务器实现了 CORS 接口，就可以跨源通信。</p><p>只要同时满足以下两大条件，就属于简单请求，不满足则属于非简单请求。</p><ol><li>请求方法是以下三种方法之一：HEAD/GET/POST。</li><li>HTTP 的头信息不超出以下几种字段：Accept/Accept-Language/Content-Language/Last-Event-ID/Content-Type（只限于三个值 application/x-www-form-urlencoded、multipart/form-data、text/plain）。</li></ol><ul><li>简单请求</li></ul><p>对于简单请求，浏览器直接发出 CORS 请求。具体来说，就是在头信息之中，增加一个 Origin 字段。<br> 如果 Origin 指定的域名在许可范围内，服务器返回的响应，会多出几个头信息字段(Access-Control-**等等)。</p><ul><li>非简单请求</li></ul><p>非简单请求的 CORS 请求，会在正式通信之前，增加一次 HTTP 查询请求，称为&quot;预检&quot;请求（preflight）（请求方法是 OPTIONS）。<br> 浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些 HTTP 动词和头信息字段。只有得到肯定答复，浏览器才会发出正式的 XMLHttpRequest 请求，否则就报错。</p><h3 id="https" tabindex="-1"><a class="header-anchor" href="#https" aria-hidden="true">#</a> HTTPS</h3><p>HTTPS 其实是有两部分组成：HTTP + SSL / TLS，也就是在 HTTP 上又加了一层处理加密信息的模块。服务端和客户端的信息传输都会通过 TLS 进行加密，所以传输的数据都是加密后的数据。</p><p>HTTPS 和 HTTP 协议相比提供了：</p><ul><li>数据完整性：内容传输经过完整性校验</li><li>数据隐私性：内容经过对称加密，每个连接生成一个唯一的加密密钥</li><li>身份认证：第三方无法伪造服务端（客户端）身份</li></ul><p>其中，数据完整性和隐私性由 TLS Record Protocol 保证，身份认证由 TLS Handshaking Protocols 实现。</p><p>HTTPS 在传输数据之前需要客户端（浏览器）与服务端（网站）之间进行一次握手，在握手过程中将确立双方加密传输数据的密码信息。<br> TLS/SSL 协议不仅仅是一套加密传输的协议，更是一件经过艺术家精心设计的艺术品，TLS/SSL 中使用了非对称加密，对称加密以及 HASH 算法。</p><h3 id="http2" tabindex="-1"><a class="header-anchor" href="#http2" aria-hidden="true">#</a> HTTP2</h3><p>要注意，以上的 Keep-Alive 主要是指 TCP 的连接，而 HTTP 依然是一个请求对应一个回应，当然在这个在 HTTP2 里面不再适用了。</p><p>HTTPS 的出现，带来安全以及可靠之外，同时也大量的编码等增加了服务器的压力。HTTP2 则针对资源的优化做了一些新的改变。</p><p>HTTP2 特点：</p><ul><li>二进制：http2 是一个二进制协议</li><li>二进制格式：http2 发送二进制帧</li><li>多路复用的流：每个单独的 http2 连接都可以包含多个并发的流，这些流中交错的包含着来自两端的帧 <blockquote><p>流既可以被客户端/服务器端单方面的建立和使用，也可以被双方共享，或者被任意一边关闭。 在流里面，每一帧发送的顺序非常关键。接收方会按照收到帧的顺序来进行处理。</p></blockquote></li><li>优先级和依赖性：每个流都包含一个优先级，优先级被用来告诉对端哪个流更重要</li><li>头压缩：一致的请求可被压缩</li><li>重置：只终止当前传输的消息并重新发送一个新的，从而避免浪费带宽和中断已有的连接</li><li>服务器推送：“缓存推送” <blockquote><p>主要的思想是：当一个客户端请求资源 X，而服务器知道它很可能也需要资源 Z 的情况下，服务器可以在客户端发送请求前，主动将资源 Z 推送给客户端。这个功能帮助客户端将 Z 放进缓存以备将来之需。</p></blockquote></li></ul><h2 id="参考-1" tabindex="-1"><a class="header-anchor" href="#参考-1" aria-hidden="true">#</a> 参考</h2>',21),g={href:"http://www.cnblogs.com/JChen666/p/3399951.html",target:"_blank",rel:"noopener noreferrer"},_={href:"http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html",target:"_blank",rel:"noopener noreferrer"},m={href:"http://www.ruanyifeng.com/blog/2016/04/cors.html",target:"_blank",rel:"noopener noreferrer"},H={href:"http://www.cnblogs.com/vajoy/p/5341664.html",target:"_blank",rel:"noopener noreferrer"},x={href:"http://web.jobbole.com/82997/",target:"_blank",rel:"noopener noreferrer"},C={href:"http://www.cnblogs.com/520yang/articles/4807408.html",target:"_blank",rel:"noopener noreferrer"},S={href:"http://blog.csdn.net/tennysonsky/article/details/44562435",target:"_blank",rel:"noopener noreferrer"},w={href:"http://www.cnblogs.com/svan/p/5090201.html",target:"_blank",rel:"noopener noreferrer"},q={href:"http://blog.csdn.net/clh604/article/details/22179907",target:"_blank",rel:"noopener noreferrer"},L={href:"http://wiki.jikexueyuan.com/project/http-2-explained/protocol.html",target:"_blank",rel:"noopener noreferrer"},R=e("h2",{id:"结束语",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#结束语","aria-hidden":"true"},"#"),a(" 结束语")],-1),v=e("p",null,"这里面主要讲述 HTTP 协议相关的一些基本原理和概念，然后是浏览器缓存和同源机制。其实上面提到的每一个点，都是仍然需要深入理解的。HTTP 相关的内容实在很多，最好的方式是结合实践，平时多关注和思考，来加深相关的理解吧。",-1);function y(E,O){const t=o("ExternalLinkIcon");return n(),h("div",null,[p,s("more"),c,e("ul",null,[e("li",null,[e("a",u,[a("《HTTP 协议详解》"),i(t)])]),e("li",null,[e("a",T,[a("《一次完整的 HTTP 事务是怎样一个过程？》"),i(t)])])]),b,e("p",null,[a("上面是从网上参考和整理的，当然还有服务端代理这样的方法了，毕竟服务端不受同源策略的约束。"),f,a(" 大家可以参考"),e("a",k,[a("《前端解决跨域问题的 8 种方案（最新最全）》"),i(t)]),a("。")]),P,e("ul",null,[e("li",null,[e("a",g,[a("《前端解决跨域问题的 8 种方案（最新最全）》"),i(t)])]),e("li",null,[e("a",_,[a("《浏览器同源政策及其规避方法》"),i(t)])]),e("li",null,[e("a",m,[a("《跨域资源共享 CORS 详解》"),i(t)])]),e("li",null,[e("a",H,[a("《浅谈浏览器 http 的缓存机制》"),i(t)])]),e("li",null,[e("a",x,[a("《浏览器缓存机制浅析》"),i(t)])]),e("li",null,[e("a",C,[a("《浏览器 HTTP 协议缓存机制详解》"),i(t)])]),e("li",null,[e("a",S,[a("《如何理解 HTTP 协议的 “无连接，无状态” 特点？》"),i(t)])]),e("li",null,[e("a",w,[a("《HTTPS 工作原理》"),i(t)])]),e("li",null,[e("a",q,[a("《https 原理：证书传递、验证和数据加密、解密过程解析》"),i(t)])]),e("li",null,[e("a",L,[a("《http2 协议》"),i(t)])])]),R,v])}const A=r(d,[["render",y],["__file","front-end-10.html.vue"]]);export{A as default};
