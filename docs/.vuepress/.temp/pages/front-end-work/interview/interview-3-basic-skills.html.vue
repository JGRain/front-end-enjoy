<template><div><p>这些年也有不少的面试别人和面试自己的经历，也有好些人来咨询一些前端的面试题目和准备，所以整理一下记录下来。本文概括地描述一下，面试中可能会遇到的一些基础专业知识。</p>
<!--more-->
<p>在进行面试前复习的时候，我们需要有结构、有逻辑地进行知识的梳理，那么大概有哪些知识点需要准备呢？面试官又可能会问到哪些内容呢？</p>
<h2 id="专业知识" tabindex="-1"><a class="header-anchor" href="#专业知识" aria-hidden="true">#</a> 专业知识</h2>
<p>这里会针对前端小伙伴来进行相关专业知识的准备说明，本文只做范围的概述，后面再有详细的文章来一个个讲解。</p>
<h3 id="javascript" tabindex="-1"><a class="header-anchor" href="#javascript" aria-hidden="true">#</a> Javascript</h3>
<p>前端最基础的技能包括 Javascript、CSS 和 HTML，新手比较容易遇到这方面的考察。对于Javascript会问到多一些，通常包括：</p>
<table>
<thead>
<tr>
<th>考察范围</th>
<th>具体问题</th>
</tr>
</thead>
<tbody>
<tr>
<td>对单线程 Javascript 的理解</td>
<td>单线程来源<br />Web Workers 和 Service Workers 的理解</td>
</tr>
<tr>
<td>异步事件机制</td>
<td>为什么使用异步事件机制<br />在实际使用中异步事件可能会导致什么问题<br />关于 setTimeout、setInterval 的时间精确性</td>
</tr>
<tr>
<td>对 EventLoop 的理解</td>
<td>介绍浏览器的 EventLoop<br />macrotask 和 microtask 的区别<br />setTimeout 和 Promise 在不同浏览器的执行顺序</td>
</tr>
<tr>
<td>Javascript 的原型和继承</td>
<td>如何理解 Javascript 中的“一切皆对象”<br />如何创建一个对象<br />proto 与 prototype 的区别</td>
</tr>
<tr>
<td>作用域与闭包</td>
<td>请描述以下代码的执行输出内容（考察作用域）<br />什么场景需要使用闭包<br />闭包的缺陷</td>
</tr>
<tr>
<td>this</td>
<td>简单描述 this 在不同场景下的指向<br />apply 和 call 的使用<br />箭头函数与普通函数的区别</td>
</tr>
<tr>
<td>ES6+</td>
<td>对 Promise 的理解<br />使用 async、await 的好处<br />浏览器兼容性与 Babel<br />Set 和 Map 数据结构</td>
</tr>
</tbody>
</table>
<p>对 Javascript 的考察，也可以通过写代码的方式来进行，例如：</p>
<ul>
<li>手写代码实现 call/apply/bind</li>
<li>手写代码实现 Promise、async/await</li>
<li>Javascript 中 0.1+0.2 为什么等于 0.30000000000000004，如何通过代码解决这个问题</li>
</ul>
<h3 id="html与css" tabindex="-1"><a class="header-anchor" href="#html与css" aria-hidden="true">#</a> HTML与CSS</h3>
<p>关于 HTML 的内容会较少单独地问，更多是结合浏览器的渲染机制等一起考察。关于 CSS，也有以下的一些考察点：</p>
<ul>
<li>介绍盒子模型</li>
<li>内联元素与块状元素、display</li>
<li>文档流的理解：static/relative/absolute/fixed等</li>
<li>元素堆叠：z-index 与 position 的作用关系</li>
<li>Flex 布局方式的理解和使用</li>
<li>BFC 的优点和缺点</li>
<li>CSS 动画考察：关键帧、animate、transition 等</li>
</ul>
<h3 id="网络相关" tabindex="-1"><a class="header-anchor" href="#网络相关" aria-hidden="true">#</a> 网络相关</h3>
<p>网络相关的知识在日常开发中也是挺常用的，相关的问题可以从“一个完整的HTTP请求过程”来讲述，包括：</p>
<ul>
<li>域名解析（此处涉及 DNS 的寻址过程）</li>
<li>TCP 的 3 次握手</li>
<li>建立 TCP 连接后发起 HTTP 请求</li>
<li>服务器响应 HTTP 请求</li>
</ul>
<p>以上的内容都需要尽数掌握，除此以外，关于 HTTP 的还有以下常见内容：</p>
<ul>
<li>HTTP 消息的结构，包括 Request请求、Response响应</li>
<li>HTTP 请求方法，使用 PUT、DELETE 等方法时为什么有时候在浏览器会看到两次请求（涉及 CROS 中的简单请求和复杂请求）</li>
<li>常见的 HTTP 状态码</li>
<li>浏览器是如何控制缓存的：相应的头信息、状态码</li>
<li>如何对请求进行抓包和改造</li>
<li>Websocket 与 HTTP 请求的区别</li>
<li>HTTPS、HTTP2 与 HTTP 的对比</li>
</ul>
<h3 id="浏览器相关" tabindex="-1"><a class="header-anchor" href="#浏览器相关" aria-hidden="true">#</a> 浏览器相关</h3>
<p>关于浏览器，有很多的机制需要掌握。通常来说，面试官会从一个叫“在浏览器里面输入url，按下 enter 键，会发生什么？”中进行考察，首先会经过上面提到的 HTTP 请求过程，然后还会涉及以下内容：</p>
<table>
<thead>
<tr>
<th>考察内容</th>
<th>相关问题</th>
</tr>
</thead>
<tbody>
<tr>
<td>浏览器的同源策略</td>
<td>“同源”指什么<br />那些行为受到同源策略的限制<br />常见的跨域方案有哪些</td>
</tr>
<tr>
<td>浏览器的缓存相关</td>
<td>Web 缓存通常包括哪些<br />浏览器什么情况下会使用本地缓存<br />强缓存和协商缓存的区别<br />强制 ctrl + F5 刷新会发生什么<br />session、cookie 以及 storage 的区别</td>
</tr>
<tr>
<td>浏览器加载顺序</td>
<td>为什么我们通常将 javascript 放在 <code v-pre>&lt;body&gt;</code> 的最后面<br />为什么我们将 CSS 放在 <code v-pre>&lt;head&gt;</code> 里</td>
</tr>
<tr>
<td>浏览器的渲染原理</td>
<td>HTML/CSS/JS 的解析过程<br />Render Tree 是怎样生成的<br />Repaint 和 Reflow 是怎样的过程<br />日常开发中要注意哪些渲染性能问题<br /></td>
</tr>
<tr>
<td>虚拟 DOM 机制</td>
<td>为什么要使用虚拟 DOM<br />为什么要使用 JS 对象来描述 DOM 结构<br />简单描述下虚拟 DOM 的实现原理</td>
</tr>
<tr>
<td>浏览器事件</td>
<td>DOM 事件流包括几个阶段（点击后会发生什么）<br />事件委托是什么</td>
</tr>
</tbody>
</table>
<h3 id="安全相关" tabindex="-1"><a class="header-anchor" href="#安全相关" aria-hidden="true">#</a> 安全相关</h3>
<p>安全在实际开发中是最重要的，作为前端开发，同样需要掌握：</p>
<ul>
<li>前端安全中，需要注意的有哪些问题</li>
<li>XSS/CSRF 是怎样的攻击过程，要怎么防范</li>
<li>除了 XSS 和 CSRF，你还了解哪些网络安全相关的问题呢</li>
<li>SQL 注入、命令行注入是怎样进行的</li>
<li>DDoS 攻击是什么</li>
<li>流量劫持包括哪些内容</li>
</ul>
<h3 id="算法基础" tabindex="-1"><a class="header-anchor" href="#算法基础" aria-hidden="true">#</a> 算法基础</h3>
<p>很多大公司会考察算法基础，大家其实也可以多上 leetcode 去刷题，这些题目刷多了就有感觉了。前端比较爱考的包括：</p>
<ul>
<li>各种排序算法、稳定排序与原地排序、JS 中的 sort 使用的是什么排序</li>
<li>查找算法（顺序、二分查找）</li>
<li>递归、分治的理解和应用</li>
<li>动态规划</li>
</ul>
<p>除此之外，常见的数据结构也需要掌握：</p>
<ul>
<li>链表与数组</li>
<li>栈与队列</li>
<li>二叉树、平衡树、红黑树等</li>
</ul>
<h3 id="计算机通用知识" tabindex="-1"><a class="header-anchor" href="#计算机通用知识" aria-hidden="true">#</a> 计算机通用知识</h3>
<p>虽然在日常工作中我们接触到的内容比较局限于前端开发，但以下内容如果能掌握，对个人成长和面试过程也会有所帮助：</p>
<ul>
<li>理解计算机资源，认识进程与线程（单线程、单进程、多线程、多进程）</li>
<li>了解阻塞与非阻塞、同步与异步任务等</li>
<li>进程间通信（IPC）常包括哪些方式，进程间同步机制又包括哪些方式</li>
<li>Socket与网络进程通信是怎样的关系、Socket连接过程是怎样的</li>
<li>简单了解数据库（事务、索引）</li>
<li>常见的设计模式有哪些、列举实际使用过的一些设计模式</li>
<li>如何理解面向对象编程、对函数式编程的看法</li>
</ul>
<h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>基础知识相关的内容真的不少呢，但是这块其实只要准备足够充分就可以掌握。参加过高考的我们，理解和记忆这么些内容，其实没有想象中那么难的。</p>
</div></template>


