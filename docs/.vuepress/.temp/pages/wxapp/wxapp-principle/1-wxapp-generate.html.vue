<template><div><p>大家坐稳，我要开始装逼了。说好要讲小程序系列，替埋头苦干低调做事的开发哥哥们多讲讲小程序的故事吧。</p>
<!--more-->
<h1 id="小程序与-webview" tabindex="-1"><a class="header-anchor" href="#小程序与-webview" aria-hidden="true">#</a> 小程序与 WebView</h1>
<h2 id="webview-的飞速发展" tabindex="-1"><a class="header-anchor" href="#webview-的飞速发展" aria-hidden="true">#</a> WebView 的飞速发展</h2>
<p>随着公众号的出现和繁荣，WebView 的使用频率也越来越高。不少的企业或是小商家、外包公司开始做 H5 页面，各式各样的 H5 活动页、小商城、小测试、小游戏满天飞。H5 的劣势也很明显，体验太渣，甚至还不能获取很多底层 APP 拥有的功能。</p>
<p>微信团队也因此提供了一些 JS-SDK 给 Web 开发使用，包括拍摄、录音、语音识别、二维码、地图、支付、分享等能力。从此，Web 开发者可以使用到微信的原生能力，去完成一些之前做不到或者难以做到的事情。</p>
<h2 id="体验不足的-webview" tabindex="-1"><a class="header-anchor" href="#体验不足的-webview" aria-hidden="true">#</a> 体验不足的 WebView</h2>
<p>相信大多数人都经历过这样的糟糕体验——白屏。没错，就是这货：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1535165451(1).png" alt="iamge"></p>
<p>这样的体验直到今天还会出现，有些甚至连加载中的字样都没有。打开一个 WebView 通常会经历以下几个阶段：</p>
<ul>
<li>交互无反馈</li>
<li>到达新的页面，页面白屏</li>
<li>页面基本框架出现，但是没有数据；页面处于 loading 状态</li>
<li>出现所需的数据</li>
</ul>
<p><strong>除了白屏，影响 Web 体验的问题还有缺少操作的反馈，主要表现在两个方面：页面切换的生硬和点击的迟滞感。</strong></p>
<p>如果从程序上观察，WebView 启动过程大概分为以下几个阶段：
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/time.png" alt="iamge"></p>
<p>对于一些有经验的 Web 开发者而言，会使用一些 SPA 的框架，来模拟客户端原生的页面切换过渡，同时使用缓存、CSS 反馈交互、直出页面等技术，来改善体验。</p>
<p>但并不是所有开发者都有精力和能力去做这么多优化，而作为一个平台，优化用户体验也是平台责任的一部分。</p>
<h2 id="小程序的出现" tabindex="-1"><a class="header-anchor" href="#小程序的出现" aria-hidden="true">#</a> 小程序的出现</h2>
<p>曾经有较长一段时间，我都以为小程序是类似 Weex、React Native 这些框架一样，最终呈现的是原生应用。直到开始写小程序，一些疑惑开始不断冒出来：为什么 CSS 样式的编写跟普通 Web 几乎一摸一样呢？</p>
<p>才发现，小程序最终的呈现是 WebView，同时夹杂着一些原生组件。所以，小程序到底做了什么，使得体验比正常 WebView 好太多呢？</p>
<p>我们先来对比下，常见的 <strong>Web 和 Native 的区别</strong>：</p>
<table>
<thead>
<tr>
<th>-</th>
<th>Native</th>
<th>Web</th>
<th>期望</th>
</tr>
</thead>
<tbody>
<tr>
<td>开发门槛</td>
<td>高</td>
<td>低</td>
<td>低</td>
</tr>
<tr>
<td>体验</td>
<td>好</td>
<td>白屏、交互反馈差</td>
<td>接近原生体验</td>
</tr>
<tr>
<td>版本更新</td>
<td>需审核，迭代慢</td>
<td>在线更新</td>
<td>在线更新</td>
</tr>
<tr>
<td>管控性</td>
<td>平台可管控</td>
<td>难管控</td>
<td>可管控</td>
</tr>
</tbody>
</table>
<p>关于最后一点的管控性，其实作为一个平台这是必须具备的能力，不然平台被滥用，对公众或是平台自身都不是什么好事情。就像现在很多云服务的 COS，也开始管控起来，包括域名绑定、备案等，一是防止有心人士使用平台做些不好的事情，二是对平台自身的保护（防止被封禁等）。</p>
<p>在这样的需求和期待中，小程序诞生了。</p>
<h2 id="小程序是期望的产物" tabindex="-1"><a class="header-anchor" href="#小程序是期望的产物" aria-hidden="true">#</a> 小程序是期望的产物</h2>
<p><strong>使用 WebView 开发，门槛低，可云端更新。</strong></p>
<p>不同于 RN、Weex 这些框架，原生组件的开发、样式调整等都和 Web 有太多的不同。对于一个前端开发来说，开发成本较高、调试效率低，若不小心掉到坑里，都不知道该怎么爬出来。</p>
<p>使用 WebView，可最大化前端开发的优势，同时异步加载的方式，也允许开发者进行在线的版本更新和 BUG 修复。</p>
<p><strong>通过提供基础能力、原生组件结合等方式，提升用户体验。</strong></p>
<p>小程序框架提供了完整的基础库，通过微信内置基础库、双线程渲染等方式，提升了小程序启动的体验。同时，开发者可以借用原生组件、API 等能力，做很多普通页面开发做不到的事情，用户也能以此获得原生应用般的体验。</p>
<p><strong>通过平台发布、审核、下架、封禁等能力，具备对小程序的管控能力。</strong></p>
<p>小程序框架提供了云端更新的能力，通过代码上传、审核等方式，增强了对开发者的管控能力。保护用户的同时，也保护了平台，以及平台中的其他开发者。</p>
<p><strong>双线程（逻辑层和渲染层分开），隔离 DOM、BOM 能力，提升体验的同时，可保证 WebView 安全性。</strong></p>
<p>双线程的模式，使得页面渲染和逻辑代码的加载分开，降低了页面卡壳的可能性。</p>
<p>同时，由于逻辑层被隔离 DOM 和 BOM 对象，无法获取渲染层的内容，也在一定程度上保护了用户的数据安全。</p>
<h2 id="打开小程序的新世界" tabindex="-1"><a class="header-anchor" href="#打开小程序的新世界" aria-hidden="true">#</a> 打开小程序的新世界</h2>
<p>二维码扫描、搜索、分享、推送等各种方式，都可以打开一个小程序。依靠轻量无需安装、体验优秀、管控严格、方便快捷等各种优势，小程序给用户打开了一个通向新世界的大门。</p>
<p>而对于开发者，开发成本低、能力齐全、可快速迭代这样的开发模式，又基于大体量的用户数，几乎是无法拒绝的。齐备的底层基础库、自带优化后的体验性能，使得开发者可以专注于业务逻辑的开发，各司其职，一起把产品做好。</p>
<h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2>
<ul>
<li><a href="https://tech.meituan.com/WebViewPerf.html" target="_blank" rel="noopener noreferrer">《WebView 性能、体验分析与优化》<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/ebook?action=get_post_info&amp;token=935589521&amp;volumn=1&amp;lang=zh_CN&amp;book=miniprogram&amp;docid=000668c6910b784b00860870a5ac0a" target="_blank" rel="noopener noreferrer">《小程序开发指南》<ExternalLinkIcon/></a></li>
</ul>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>用心做好一个产品，在如今乱糟糟的社会里其实也不容易呢。而要做一个优秀的作品，需要有很清晰的方向，即使需要不断探索，也不会迷失方向吧。<br>
技术什么的，只要方向正确，总是有办法解决的。后面章节我们也来讲讲小程序的底层框架和设计吧。</p>
</div></template>


