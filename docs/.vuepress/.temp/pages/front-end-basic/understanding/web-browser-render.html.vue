<template><div><p>作为前端开发，我们的日常工作中除了写代码之外，几乎大多数的时间都在跟浏览器打交道。当然，现在我们甚至写代码都可以直接在浏览器里完成，一个浏览器走天下。</p>
<p>因此，我们应该对浏览器的了解要更加深入，除了了解怎么使用和调试浏览器，我们还要掌握它是怎样将我们编写的代码渲染到页面中的。</p>
<!--more-->
<h2 id="认识浏览器" tabindex="-1"><a class="header-anchor" href="#认识浏览器" aria-hidden="true">#</a> 认识浏览器</h2>
<p>浏览器的主要功能，是通过向服务器请求并在浏览器窗口中展示 Web 资源内容，通常包括 HTML 文档、PDF、图片等，我们也可以通过插件的方式加载更多其他的资源类型（比如播放视频）。</p>
<p>对于浏览器的问题，HTTP 请求相关的，想必各位在面试的时候都被问烂了吧，这里直接过一下浏览器中的 HTTP 请求过程：</p>
<ol>
<li>DNS 域名解析（此处涉及 DNS 的寻址过程），找到网页的存放服务器。</li>
<li>浏览器与服务器建立 TCP 连接。</li>
<li>浏览器发起 HTTP 请求。</li>
<li>服务器响应 HTTP 请求，返回该页面的 HTML 内容。</li>
<li>浏览器解析 HTML 代码，并请求 HTML 代码中的资源（如 JavaScript、CSS、图片等，此处可能涉及 HTTP 缓存）。</li>
<li>浏览器对页面进行渲染呈现给用户。</li>
</ol>
<p>这篇文章会重点介绍第 6 步，该步骤涉及浏览器的渲染过程和原理。除了初次加载页面，用户的很多操作都同样涉及到浏览器渲染，比如以下功能：</p>
<ul>
<li>地址栏输入 URL</li>
<li>点击刷新和停止按钮，控制页面加载</li>
<li>点击后退和前进按钮，快速实现页面跳转</li>
<li>书签和收藏，快速打开页面</li>
</ul>
<p>除了这些，实际上我们和浏览器的几乎所有操作，都涉及到浏览器的渲染过程。为了更深刻地认识这些过程，我们先来认识下浏览器的结构。</p>
<p>HTML 和 CSS 规范中规定了浏览器解析和渲染 HTML 文档的方式，曾经各个浏览器都只遵循其中一部分，因此前端开发经常需要兼容各种浏览器。现在这些问题已经得到改善，同时配合 Babel 等一些兼容性处理编译过程，我们可以更加关注网站的功能实现和优化。</p>
<h3 id="浏览器的结构" tabindex="-1"><a class="header-anchor" href="#浏览器的结构" aria-hidden="true">#</a> 浏览器的结构</h3>
<p>从结构上来说，浏览器主要包括了八个子系统：用户界面、浏览器引擎、渲染引擎、网络子系统、JavaScript 解释器、XML 解析器、显示后端、数据持久性子系统。</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/how-browser-works-1.jpg" alt=""></p>
<p>这些子系统组合构成了我们的浏览器，而谈到页面的加载和渲染，则离不开网络子系统、渲染引擎、JavaScript 解释器和浏览器引擎等。</p>
<p>如今大多数用户主要使用的浏览器包括两类：</p>
<ul>
<li>台式机：Chrome、Internet Explorer、Firefox、Safari、Opera 等</li>
<li>移动设备：Android 浏览器、iPhone、Opera Mini、Opera Mobile、UC 浏览器、Chrome 等。</li>
</ul>
<p>下面我们以前端开发最常使用的 Chrome 浏览器为例（因为 Chrome 浏览器太牛啦，而且它们还要官方文章介绍做参考），进行更详细的介绍。</p>
<h3 id="chrome-多进程架构" tabindex="-1"><a class="header-anchor" href="#chrome-多进程架构" aria-hidden="true">#</a> Chrome 多进程架构</h3>
<p>应该很多前端开发都知道，Chrome 浏览器使用了多进程架构，包括浏览器进程、渲染器进程、插件进程和 GPU 进程：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/browserui.png" alt=""></p>
<p>如今，基本上所有的浏览器都支持多个选项卡。在 Chrome 中，每个选项卡在单独的渲染器进程中运行，渲染器进程主要用于控制和处理选项卡中的网站内容显示。渲染器进程支持多线程，包括：</p>
<ul>
<li>GUI 渲染线程：负责对浏览器界面进行渲染</li>
<li>JavaScript 引擎线程：负责解析和执行 JavaScript 脚本</li>
<li>浏览器定时器触发线程：<code v-pre>setTimeout</code>和<code v-pre>setInterval</code>所在的线程</li>
<li>浏览器事件触发线程：该线程负责处理浏览器事件，并将事件触发后需要执行的代码放置到 JavaScript 引擎中执行</li>
</ul>
<p>选项卡之外的所有内容都由浏览器进程处理，浏览器进程则主要用于控制和处理用户可见的 UI 部分（包括地址栏，书签，后退和前进按钮）和用户不可见的隐藏部分（例如网络请求和文件访问）。浏览器进程同样支持多线程，包括：</p>
<ul>
<li>UI 线程：用于绘制浏览器的按钮和输入字段</li>
<li>网络线程：用于处理网络请求，以及从服务器接收数据</li>
<li>存储线程：用于控制对文件的访问</li>
</ul>
<p>这些线程其实我们在学习其他内容的时候也会涉及到，比如在页面的加载过程中，涉及 GUI 渲染线程与 JavaScript 引擎线程间的互斥关系，因此页面中的<code v-pre>&lt;script&gt;</code>和<code v-pre>&lt;style&gt;</code>元素设计不合理会影响页面加载速度。</p>
<p>除此之外，UI 线程、网络线程、存储线程、浏览器事件触发线程、浏览器定时器触发线程中 I/O 事件通过异步任务完成时触发的函数回调，解决了单线程的 Javascript 阻塞问题。结合 Event Loop 的并发模型设计，解决了 Javascript 中同步任务和异步任务的管理问题。</p>
<p>下面我们来介绍浏览器中页面的渲染过程，该部分内容同样基于 Chrome 浏览器，更加详细地介绍浏览器进程和线程如何通信来显示页面。</p>
<h2 id="浏览器中页面的渲染过程" tabindex="-1"><a class="header-anchor" href="#浏览器中页面的渲染过程" aria-hidden="true">#</a> 浏览器中页面的渲染过程</h2>
<p>首先我们将浏览器中页面的渲染过程分为两部分：</p>
<ol>
<li>页面导航：用户输入 URL，浏览器进程进行请求和准备处理。</li>
<li>页面渲染：获取到相关资源后，渲染器进程负责选项卡内部的渲染处理。</li>
</ol>
<h3 id="_1-页面导航" tabindex="-1"><a class="header-anchor" href="#_1-页面导航" aria-hidden="true">#</a> 1. 页面导航</h3>
<p>前面我们介绍了一个 HTTP 的请求过程，该部分内容更倾向于将浏览器当成一个完整的对象，来介绍浏览器与外界的交互过程。</p>
<p>下面，我们来深入浏览器内部来进行分析，当用户在地址栏中输入内容时：</p>
<ol>
<li>首先浏览器进程的 UI 线程会进行处理：如果是 URI，则会发起网络请求来获取网站内容；如果不是，则进入搜索引擎。</li>
<li>如果需要发起网络请求，请求过程由网络线程来完成。HTTP 请求响应如果是 HTML 文件，则将数据传递到渲染器进程；如果是其他文件则意味着这是下载请求，此时会将数据传递到下载管理器。</li>
<li>如果请求响应为 HTML 内容，此时浏览器应导航到请求站点，网络线程便通知 UI 线程数据准备就绪。</li>
<li>接下来，UI 线程会寻找一个渲染器进程来进行网页渲染。当数据和渲染器进程都准备好后，HTML 数据通过 IPC 从浏览器进程传递到渲染器进程中。</li>
<li>渲染器进程接收 HTML 数据后，将开始加载资源并渲染页面。</li>
<li>渲染器进程完成渲染后，通过 IPC 通知浏览器进程页面已加载。</li>
</ol>
<p>以上是用户在地址栏输入网站地址，到页面开始渲染的整体过程。如果当前页面跳转到其他网站，浏览器将调用一个单独的渲染进程来处理新导航，同时保留当前渲染进程来处理像<code v-pre>unload</code>这类事件。</p>
<p>可以看到，页面导航的过程主要依赖浏览器进程。其中，上述过程中的步骤 5 便是页面的渲染部分，该过程同样依赖渲染器进程，我们一起来看看。</p>
<h3 id="_2-页面渲染" tabindex="-1"><a class="header-anchor" href="#_2-页面渲染" aria-hidden="true">#</a> 2. 页面渲染</h3>
<p>前面说过，渲染器进程负责选项卡内部发生的所有事情，它的核心工作是将 HTML、CSS 和 JavaScript 转换为可交互的页面。整体上，渲染器进程渲染页面的流程基本如下：</p>
<ul>
<li>解析(Parser)：解析 HTML/CSS/JavaScript 代码</li>
<li>布局(Layout)：定位坐标和大小、是否换行、各种<code v-pre>position</code>/<code v-pre>overflow</code>/<code v-pre>z-index</code>属性等计算</li>
<li>绘制(Paint)：判断元素渲染层级顺序</li>
<li>光栅化(Raster)：将计算后的信息转换为屏幕上的像素</li>
</ul>
<p>大致流程如下图：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/flow.png" alt="浏览器构造渲染树流程"></p>
<p>我们来分别看下。</p>
<h4 id="解析" tabindex="-1"><a class="header-anchor" href="#解析" aria-hidden="true">#</a> 解析</h4>
<p>渲染器进程的主线程会解析以下内容：</p>
<ul>
<li>解析 HTML 内容，产生一个 DOM 节点树</li>
<li>解析 CSS，产生 CSS 规则树</li>
<li>解析 Javascript 脚本。由于 Javascript 脚本可以通过 DOM API 和 CSSOM API 来操作 DOM 节点树和 CSS 规则树，因此该过程中会等待 JavaScript 运行完成才继续解析 HTML</li>
</ul>
<p>解析完成后，我们得到了 DOM 节点树和 CSS 规则树，布局过程便是通过 DOM 节点树和 CSS 规则树来构造渲染树（Render Tree）。</p>
<h4 id="布局" tabindex="-1"><a class="header-anchor" href="#布局" aria-hidden="true">#</a> 布局</h4>
<p>通过解析之后，渲染器进程知道每个节点的结构和样式，但如果需要渲染页面，浏览器还需要进行布局，布局过程其实便是我们常说的渲染树的创建过程。</p>
<p>在这个过程中，像<code v-pre>header</code>或<code v-pre>display:none</code>的元素，它们会存在 DOM 节点树中，但不会被添加到渲染树里。</p>
<p>布局完成后，将会进入绘制环节。</p>
<h4 id="绘制" tabindex="-1"><a class="header-anchor" href="#绘制" aria-hidden="true">#</a> 绘制</h4>
<p>在绘制步骤中，渲染器主线程会遍历渲染树来创建绘制记录。</p>
<p>需要注意的是，如果渲染树发生了改变，则渲染器会触发重绘（Repaint）和重排（Reflow）：</p>
<ul>
<li>重绘：屏幕的一部分要重画，比如某个 CSS 的背景色变了，但是元素的几何尺寸没有变</li>
<li>重排：元素的几何尺寸变了（渲染树的一部分或全部发生了变化），需要重新验证并计算渲染树</li>
</ul>
<p>为了不对每个小的变化都进行完整的布局计算，渲染器会将更改的元素和它的子元素进行脏位标记，表示该元素需要重新布局。其中，全局样式更改会触发全局布局，部分样式或元素更改会触发增量布局，增量布局是异步完成的，全局布局则会同步触发。</p>
<p>重排需要涉及变更的所有的结点几何尺寸和位置，成本比重绘的成本高得多的多。所以我们要注意以避免频繁地进行增加、删除、修改 DOM 结点、移动 DOM 的位置、Resize 窗口、滚动等操作，因为可能会导致性能降低。</p>
<h4 id="光栅化" tabindex="-1"><a class="header-anchor" href="#光栅化" aria-hidden="true">#</a> 光栅化</h4>
<p>通过解析、布局和绘制过程，浏览器获得了文档的结构、每个元素的样式、绘制顺序等信息。将这些信息转换为屏幕上的像素，这个过程被称为光栅化。</p>
<p>光栅化可以被 GPU 加速，光栅化后的位图会被存储在 GPU 内存中。根据前面介绍的渲染流程，当页面布局变更了会触发重排和重绘，还需要重新进行光栅化。此时如果页面中有动画，则主线程中过多的计算任务很可能会影响动画的性能。</p>
<p>因此，现代的浏览器通常使用合成的方式，将页面的各个部分分成若干层，分别对其进行栅格化（将它们分割成了不同的瓦片），并通过合成器线程进行页面的合成：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/how-browser-works-2.jpg" alt=""></p>
<p>合成过程如下：</p>
<ol>
<li>当主线程创建了合成层并确定了绘制顺序，便将这些信息提交给合成线程。</li>
<li>合成器线程将每个图层栅格化，然后将每个图块发送给光栅线程。</li>
<li>光栅线程栅格化每个瓦片，并将它们存储在 GPU 内存中。</li>
<li>合成器线程通过 IPC 提交给浏览器进程，这些合成器帧被发送到 GPU 进程处理，并显示在屏幕上。</li>
</ol>
<p>合成的真正目的是，在移动合成层的时候不用重新光栅化。因为有了合成器线程，页面才可以独立于主线程进行流畅的滚动。</p>
<p>到这里，页面才真正渲染到屏幕上。</p>
<p>我们在绘制页面的时候，也可能会遇到很多奇怪的渲染问题，比如使用了<code v-pre>transform:scale</code>可能会导致某些浏览器中渲染模糊，究其原因则是由于光栅化过程导致的。像前面所说，前端开发需要频繁跟浏览器打交道，所谓知己知彼百战不殆，我们应该对其运行过程有更好的了解。</p>
<h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>这里主要介绍了浏览器的组成和结构，并从浏览器内部分工角度来介绍页面的渲染过程。掌握页面的渲染过程，有利于我们进行一些性能优化，尤其如果涉及动画、游戏等频繁绘制的场景，渲染性能往往是需要不断进行优化的瓶颈。</p>
<h3 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h3>
<p>对于介绍浏览器的渲染过程相关的内容，非常推荐大家参考两篇文章：</p>
<ul>
<li><a href="https://www.html5rocks.com/en/tutorials/internals/howbrowserswork/" target="_blank" rel="noopener noreferrer">《How Browsers Work: Behind the scenes of modern web browsers》<ExternalLinkIcon/></a></li>
<li><a href="https://developers.google.com/web/updates/2018/09/inside-browser-part1" target="_blank" rel="noopener noreferrer">《Inside look at modern web browser》<ExternalLinkIcon/></a>（分为四篇，左侧导航栏可以找到）</li>
</ul>
<p>这篇文章也是参考了这两篇文章以及一些论文，以我自己的理解来进行总结输出，推荐大家也要阅读原文哦。</p>
</div></template>


