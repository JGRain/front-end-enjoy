import{_ as o,M as r,p as a,q as s,Q as h,R as l,t as e,N as t,a1 as n}from"./framework-5866ffd3.js";const c={},d=l("p",null,"该篇主要整理网络协议相关的概念，包括 TCP/IP、DNS、HTTP 等等基础认识。",-1),p=l("h1",{id:"网络协议",tabindex:"-1"},[l("a",{class:"header-anchor",href:"#网络协议","aria-hidden":"true"},"#"),e(" 网络协议")],-1),u=l("h2",{id:"tcp-ip-协议",tabindex:"-1"},[l("a",{class:"header-anchor",href:"#tcp-ip-协议","aria-hidden":"true"},"#"),e(" TCP/IP 协议")],-1),_=l("br",null,null,-1),P=l("br",null,null,-1),T={href:"https://zh.wikipedia.org/zh-hans/TCP/IP%E5%8D%8F%E8%AE%AE%E6%97%8F",target:"_blank",rel:"noopener noreferrer"},f=n("<li><p>TCP/IP 协议分层</p><ul><li>数据链路层：用来处理连接网络的硬件、设备驱动、网卡、光纤等</li><li>网络层：用来处理在网络上滚动的数据包（选路线）</li><li>传输层：TCP/UDP</li><li>应用层：FTP/DNS 域名系统/HTTP 协议等</li></ul></li><li><p>IP 协议</p><ul><li>把各种数据包准确无误地传递</li><li>ARP 惬意、RARP 协议等</li></ul></li>",2),m=l("p",null,"TCP 协议",-1),b=l("li",null,"可靠传输（对比 UDP）：确认数据送达，把数据安全可靠传输",-1),N=l("li",null,"三次握手：建立一个 TCP 连接需要客户端和服务端总共发送三个包以确认连接存在",-1),D={href:"http://www.cnblogs.com/zmlctt/p/3690998.html",target:"_blank",rel:"noopener noreferrer"},S=n('<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/0_131271823564Rx.gif" alt="images"></p><h2 id="dns-域名系统" tabindex="-1"><a class="header-anchor" href="#dns-域名系统" aria-hidden="true">#</a> DNS 域名系统</h2><p>让用户电脑和服务器（网页存放电脑）连接起来并不是靠域名进行，网络上计算机之间实现连接是通过每台计算机在网络中拥有的惟一的 IP 地址来完成的。<br> DNS 的全称是 Domain Name System。它负责把 FQDN(就是以&quot;.&quot;分隔结尾的名字)翻译成一个 IP。</p><p>DNS 速度优化是网站优化 SEO 中的一部分，优化 DNS 解析就必须了解 DNS 解析原理及过程。</p><p>当用户访问我们网站一个网页时，他需要经过以下步骤：</p><ol><li>找到这个网页的存放服务器；</li><li>服务器将用户的请求信息接入；</li><li>服务器通过文件路径（URL）查找用户请求网页；</li><li>用户将该网页内容下载到自己电脑上。</li></ol><p>我们所讲的 DNS 解析主要是第一个步骤，即让用户通过 URL 找到文件存放的服务器。</p><p>DNS 解析主要有递归查询，就是在某个 DNS 服务器缓存中查找不到相应的域名与 IP 地址对应关系时，自动跳转到到下一步骤通过下一个 DNS 服务器进行查找。</p>',8),w={href:"http://www.ecdoer.com/post/dns.html",target:"_blank",rel:"noopener noreferrer"},C={href:"http://www.jianshu.com/p/4394aaf97492",target:"_blank",rel:"noopener noreferrer"},H=n('<h2 id="http-协议" tabindex="-1"><a class="header-anchor" href="#http-协议" aria-hidden="true">#</a> HTTP 协议</h2><p>关于 HTTP 协议相关的，需要了解和学习的太多太多了，这里本骚年先大概讲讲相关的，后面有空再进行深入分享。</p><p>通常，由 HTTP 客户端发起一个请求，建立一个到服务器指定端口（默认是 80 端口）的 TCP 连接。HTTP 服务器则在那个端口监听客户端发送过来的请求。一旦收到请求，服务器（向客户端）发回一个状态行，比如&quot;HTTP/1.1 200 OK&quot;，和（响应的）消息，消息的消息体可能是请求的文件、错误消息、或者其它一些信息。<br> HTTP 使用 TCP 而不是 UDP 的原因在于（打开）一个网页必须传送很多数据，而 TCP 协议提供传输控制，按顺序组织数据，和错误纠正。</p><p>HTTP 协议的主要特点可概括如下：</p><ol><li>支持客户/服务器模式。</li><li>简单快速：客户向服务器请求服务时，只需传送请求方法和路径。请求方法常用的有 GET、HEAD、POST。每种方法规定了客户与服务器联系的类型不同。由于 HTTP 协议简单，使得 HTTP 服务器的程序规模小，因而通信速度很快。</li><li>灵活：HTTP 允许传输任意类型的数据对象。正在传输的类型由 Content-Type 加以标记。</li><li>无连接：无连接的含义是限制每次连接只处理一个请求。服务器处理完客户的请求，并收到客户的应答后，即断开连接。采用这种方式可以节省传输时间。</li><li>无状态：HTTP 协议是无状态协议。无状态是指协议对于事务处理没有记忆能力。缺少状态意味着如果后续处理需要前面的信息，则它必须重传，这样可能导致每次连接传送的数据量增大。另一方面，在服务器不需要先前信息时它的应答就较快。</li></ol>',5),I=l("br",null,null,-1),g={href:"http://www.cnblogs.com/li0803/archive/2008/11/03/1324746.html",target:"_blank",rel:"noopener noreferrer"},k=l("h2",{id:"代理与反代理",tabindex:"-1"},[l("a",{class:"header-anchor",href:"#代理与反代理","aria-hidden":"true"},"#"),e(" 代理与反代理")],-1),x=n("<li><p>代理</p><ul><li>用户希望代理服务器帮助自己，和要访问服务器通信，为了实现此目标，需要以下工作： <ul><li>用户 IP 报文的目的 IP = 代理服务器 IP</li><li>用户报文端口号 = 代理服务器监听端口号</li><li>HTTP 消息里的 URL 要提供服务器的链接</li></ul></li><li>代理服务器可以根据以上链接与服务器直接通信</li><li>服务器返回网页</li><li>代理服务器打包网页，返回用户</li></ul></li><li><p>反向代理</p><ul><li>反向代理的实现 <ul><li>需要有一个负载均衡设备来分发用户请求，将用户请求分发到空闲的服务器上</li><li>服务器返回自己的服务到负载均衡设备</li><li>负载均衡将服务器的服务返回用户 <blockquote><p>在计算机世界里，由于单个服务器的处理客户端（用户）请求能力有一个极限，当用户的接入请求蜂拥而入时，会造成服务器忙不过来的局面，可以使用多个服务器来共同分担成千上万的用户请求，这些服务器提供相同的服务，对于用户来说，根本感觉不到任何差别。</p></blockquote></li></ul></li></ul></li>",2),E={href:"https://www.zhihu.com/question/24723688",target:"_blank",rel:"noopener noreferrer"},q=l("h1",{id:"结束语",tabindex:"-1"},[l("a",{class:"header-anchor",href:"#结束语","aria-hidden":"true"},"#"),e(" 结束语")],-1),R=l("p",null,"这里面只讲述最简单的一些概念和认识，作为前端，http 相关的还是需要深入理解的呢，后面我们也会一点点补充讲述一下。",-1);function U(A,L){const i=r("ExternalLinkIcon");return a(),s("div",null,[d,h("more"),p,u,l("p",null,[e("TCP/IP 提供点对点的链接机制，将数据应该如何封装、定址、传输、路由以及在目的地如何接收，都加以标准化。"),_,e(" 它将软件通信过程抽象化为四个抽象层，采取协议堆栈的方式，分别实现出不同通信协议。协议套组下的各种协议，依其功能不同，被分别归属到这四个层次结构之中，常被视为是简化的七层 OSI 模型。"),P,e(" 可参考"),l("a",T,[e("Wiki-TCP/IP 协议族"),t(i)]),e("。")]),l("ul",null,[f,l("li",null,[m,l("ul",null,[b,N,l("li",null,[e("四次挥手 "),l("blockquote",null,[l("p",null,[e("可以参考"),l("a",D,[e("《TCP 三次握手四次挥手详解》"),t(i)])])])])])])]),S,l("ul",null,[l("li",null,[e("参考 "),l("ul",null,[l("li",null,[l("a",w,[e("《DNS 解析过程原理【深入浅出详解】》"),t(i)])]),l("li",null,[l("a",C,[e("《DNS 服务原理详解》"),t(i)])])])])]),H,l("p",null,[e("具体的请求、相应等等，后面一章会讲解，这里就大概讲个理解吧。"),I,e(" 这里有篇超详细的讲解："),l("a",g,[e("《HTTP 协议详解（真的很经典）》"),t(i)]),e("。")]),k,l("ul",null,[x,l("li",null,[l("p",null,[e("参考自"),l("a",E,[e("知乎的回答-反向代理为何叫反向代理？"),t(i)])])])]),q,R])}const v=o(c,[["render",U],["__file","front-end-9.html.vue"]]);export{v as default};
