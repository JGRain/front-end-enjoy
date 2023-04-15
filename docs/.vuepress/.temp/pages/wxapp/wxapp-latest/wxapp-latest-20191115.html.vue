<template><div><p>这个月的新内容还不错噢~<s>你值得拥有</s></p>
<!--more-->
<h1 id="小程序-latest" tabindex="-1"><a class="header-anchor" href="#小程序-latest" aria-hidden="true">#</a> 小程序 latest</h1>
<h2 id="小程序能力" tabindex="-1"><a class="header-anchor" href="#小程序能力" aria-hidden="true">#</a> 小程序能力</h2>
<h3 id="小程序·服务商订阅消息设置接口上线" tabindex="-1"><a class="header-anchor" href="#小程序·服务商订阅消息设置接口上线" aria-hidden="true">#</a> 小程序·服务商订阅消息设置接口上线</h3>
<p>为便于服务商代小程序更快设置订阅消息，提高开发效率，降低沟通成本。 现在向服务商提供订阅消息设置接口，具体详见：<a href="https://developers.weixin.qq.com/community/develop/doc/000c8a142ac080094779976b550801" target="_blank" rel="noopener noreferrer">《订阅消息设置》<ExternalLinkIcon/></a></p>
<h3 id="同层渲染进度同步" tabindex="-1"><a class="header-anchor" href="#同层渲染进度同步" aria-hidden="true">#</a> 同层渲染进度同步</h3>
<p>为了解决小程序原生组件存在的一些<a href="https://developers.weixin.qq.com/miniprogram/dev/component/native-component.html" target="_blank" rel="noopener noreferrer">使用限制<ExternalLinkIcon/></a>，我们对原生组件引入了同层渲染。支持同层渲染的原生组件层级与非原生组件一致，可直接使用非原生组件（如 view、image）结合 z-index 对原生组件进行覆盖，而无需使用 cover-view 或 cover-image。此外，同层渲染的原生组件也可被放置在 scroll-view、swiper 或 movable-view 容器中。目前，以下组件已支持同层渲染：</p>
<table>
<thead>
<tr>
<th>支持同层渲染的原生组件</th>
<th>最低版本</th>
</tr>
</thead>
<tbody>
<tr>
<td>video</td>
<td>v2.4.0</td>
</tr>
<tr>
<td>map</td>
<td>v2.7.0</td>
</tr>
<tr>
<td>canvas 2d（新接口）</td>
<td>v2.9.0</td>
</tr>
<tr>
<td>live-player</td>
<td>v2.9.1</td>
</tr>
<tr>
<td>live-pusher</td>
<td>v2.9.1</td>
</tr>
</tbody>
</table>
<p>其他原生组件（textarea、camera、webgl 及 input）也会在近期逐步支持同层渲染。</p>
<h3 id="小程序实时日志功能更新" tabindex="-1"><a class="header-anchor" href="#小程序实时日志功能更新" aria-hidden="true">#</a> 小程序实时日志功能更新</h3>
<ol>
<li>为满足第三方服务商和开发者分析日志的需求，小程序新增实时日志查询接口，开发者可通过实时日志查询接口查询小程序打印的实时日志。详情可查看<a href="https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/operation/operation.realtimelogSearch.html" target="_blank" rel="noopener noreferrer">《实时日志查询接口》<ExternalLinkIcon/></a>和<a href="https://developers.weixin.qq.com/miniprogram/dev/extended/log/" target="_blank" rel="noopener noreferrer">《实时日志开发文档》<ExternalLinkIcon/></a>。</li>
<li>每个小程序账号每天可打印的日志条数提升至500万条，日志保存天数提升至7天。</li>
</ol>
<h3 id="ocr-能力更新" tabindex="-1"><a class="header-anchor" href="#ocr-能力更新" aria-hidden="true">#</a> OCR 能力更新</h3>
<p>OCR 能力方面，有两处更新点。其一，是身份证 OCR 新增性别和民族字段的支持。其二，是身份证和银行卡 OCR去除了 type（拍照、扫描模式）字段，简化统一调用。新调用这两个接口不再需要 type 字段，而之前使用 type 字段的调用仍然继续兼容。详细介绍请参考<a href="https://developers.weixin.qq.com/doc/offiaccount/Intelligent_Interface/OCR.html" target="_blank" rel="noopener noreferrer">OCR接口文档<ExternalLinkIcon/></a>。</p>
<h3 id="更新日志" tabindex="-1"><a class="header-anchor" href="#更新日志" aria-hidden="true">#</a> 更新日志</h3>
<ul>
<li><a href="https://developers.weixin.qq.com/community/develop/doc/000c8a142ac080094779976b550801" target="_blank" rel="noopener noreferrer">社区问题反馈以及功能优化更新（11.04-11.08）<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/doc/000c4e5f4fc080923569a391356c01" target="_blank" rel="noopener noreferrer">社区问题反馈以及功能优化更新（10.21-10.25）<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/doc/0004c4e9dc408058b659da9bf56801" target="_blank" rel="noopener noreferrer">社区问题反馈以及功能优化更新（10.14-10.18）<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/doc/000608bc8d46d0d7125941cb157801" target="_blank" rel="noopener noreferrer">社区问题反馈以及功能优化更新（10.07-10.11）<ExternalLinkIcon/></a></li>
</ul>
<h2 id="小程序·云开发" tabindex="-1"><a class="header-anchor" href="#小程序·云开发" aria-hidden="true">#</a> 小程序·云开发</h2>
<blockquote>
<p>云开发峰会: 本次小程序云开发峰会的干货 PPT 已经发布在 <a href="http://km.oa.com/articles/show/429844?ts=1571884911" target="_blank" rel="noopener noreferrer">KM<ExternalLinkIcon/></a> 中，大家可以去查看。</p>
</blockquote>
<h3 id="小程序·云开发新增高级日志服务" tabindex="-1"><a class="header-anchor" href="#小程序·云开发新增高级日志服务" aria-hidden="true">#</a> 小程序·云开发新增高级日志服务</h3>
<p>为方便开发者通过日志快速的发现和定位问题，小程序·云开发提供了高级日志服务。通过高级日志服务，开发者可以更加灵活地采集和检索日志，每条日志可最长存储30天。</p>
<ul>
<li>详细介绍请参考: <a href="https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/functions/logservice.html" target="_blank" rel="noopener noreferrer">高级日志<ExternalLinkIcon/></a></li>
</ul>
<h3 id="云开发代金券" tabindex="-1"><a class="header-anchor" href="#云开发代金券" aria-hidden="true">#</a> 云开发代金券</h3>
<p>为了惠及到更多的小程序开发者，云开发增加了代金券申请功能。达到一定 uv 的小程序可以申请专业版（104 元/月）或旗舰版（860 元/月）的代金券，申请成功后每月发放一张，持续12个月。获取的代金券可用于抵扣相应套餐的购买金额。</p>
<ul>
<li>功能介绍：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/billing/voucher.html</li>
<li>最新开发者工具：https://developers.weixin.qq.com/miniprogram/dev/devtools/nightly.html</li>
</ul>
<h3 id="云函数优化" tabindex="-1"><a class="header-anchor" href="#云函数优化" aria-hidden="true">#</a> 云函数优化</h3>
<p>10月11日 - 12日上线了1个优化点：对执行时间小于200ms的云函数请求进行同步化，链路耗时下降了75ms左右</p>
<h2 id="开发者工具" tabindex="-1"><a class="header-anchor" href="#开发者工具" aria-hidden="true">#</a> 开发者工具</h2>
<h3 id="微信开发者工具新增文档搜索功能" tabindex="-1"><a class="header-anchor" href="#微信开发者工具新增文档搜索功能" aria-hidden="true">#</a> 微信开发者工具新增文档搜索功能</h3>
<p>微信开发者工具新增文档搜索功能，方便开发者在开发过程中查询相关开发文档。开发者可通过下载最新 Nightly 版本工具体验功能。</p>
<ul>
<li>详细介绍请参考: <a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/search.html" target="_blank" rel="noopener noreferrer">文档搜索<ExternalLinkIcon/></a></li>
</ul>
<h3 id="更多更新说明" tabindex="-1"><a class="header-anchor" href="#更多更新说明" aria-hidden="true">#</a> 更多更新说明</h3>
<p>参考<a href="https://developers.weixin.qq.com/community/develop/doc/000aaef24f4ee0b36e59755895b801" target="_blank" rel="noopener noreferrer">微信开发者工具稳定版 1.02.1910120 更新说明<ExternalLinkIcon/></a>，这期新增能力包括：</p>
<ol>
<li>本地编译时进行合并编译。</li>
</ol>
<ul>
<li>本地编译时使用合并编译可以加快小程序加载的速度，通过【项目详情 - 本地设置 - 本地编译时进行合并编译】可以打开此功能</li>
</ul>
<ol start="2">
<li>真机调试支持直接触发更新周期性缓存数据。</li>
</ol>
<ul>
<li>开发者工具【设置 - 通用设置 - 启用 PC 端自动预览】，可以将开发版小程序通过自动预览推送到同登录态的 PC 微信上</li>
</ul>
<ol start="3">
<li>自动真机调试。</li>
</ol>
<ul>
<li>增加自动真机调试功能，减少真机调试扫码的交互</li>
</ul>
<ol start="4">
<li>使用测试号进行多帐号调试。</li>
</ol>
<ul>
<li>在【菜单 - 工具 - 多帐号调试】，可以打开多帐号调试帐号管理面板</li>
<li>本次为所有 appid 添加了 4 个测试帐号，可以使用测试号进行多帐号调试</li>
</ul>
<ol start="5">
<li>支持多线程 worker 的单步调试。</li>
</ol>
<ul>
<li>本次更新优化了多线程 worker 的编译和代码加载的方式，从而支持了单步调试</li>
</ul>
<ol start="6">
<li>公众号网页调试增加 url 收藏功能。</li>
<li>云开发套餐支持代金券支付。<br>
等等。</li>
</ol>
<h1 id="小程序教程" tabindex="-1"><a class="header-anchor" href="#小程序教程" aria-hidden="true">#</a> 小程序教程</h1>
<h2 id="社区精选文章" tabindex="-1"><a class="header-anchor" href="#社区精选文章" aria-hidden="true">#</a> 社区精选文章</h2>
<ul>
<li><a href="https://developers.weixin.qq.com/community/develop/article/doc/000200eb844228d72f79291a651c13" target="_blank" rel="noopener noreferrer">小程序多平台同构方案分析-kbone 与 remax<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/article/doc/000c2279bf8f60f31d79854c85bc13" target="_blank" rel="noopener noreferrer">做了一个颜色选择器<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/article/doc/0004a20a114a28608669881bc5c013" target="_blank" rel="noopener noreferrer">基于Kbone使用React同构小程序开发实践总结<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/article/doc/0004686e3c8980b53469f176e51413" target="_blank" rel="noopener noreferrer">使用 MobX 来管理小程序的跨页面数据<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/article/doc/000e48820100100f2269be0975b813" target="_blank" rel="noopener noreferrer">kbone，十分钟让 Vue 项目同时支持小程序<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/article/doc/00048e5ed784b037b959757385b413" target="_blank" rel="noopener noreferrer">小程序顶部自定义导航组件实现原理及坑分享<ExternalLinkIcon/></a>
往期内容可以查看<a href="https://developers.weixin.qq.com/community/develop/article" target="_blank" rel="noopener noreferrer">文章分享<ExternalLinkIcon/></a>。</li>
</ul>
<h2 id="最新踩坑-tips" tabindex="-1"><a class="header-anchor" href="#最新踩坑-tips" aria-hidden="true">#</a> 最新踩坑 &amp;&amp; Tips</h2>
<h3 id="【同步踩坑信息】-安卓7-0-8内测版本白屏问题" tabindex="-1"><a class="header-anchor" href="#【同步踩坑信息】-安卓7-0-8内测版本白屏问题" aria-hidden="true">#</a> 【同步踩坑信息】- 安卓7.0.8内测版本白屏问题</h3>
<p>该版本下做了内存优化，在页面不可见时回收渲染资源（也就是会白屏）。如果使用navigateBack了多层页面，这个路径下没有正确恢复第一个页面的渲染，会导致白屏。
目前小程序团队已修复该问题，后续遇到相似的问题可以往该方向考虑定位下。</p>
<h3 id="【同步踩坑信息】-安卓wx-getstorage" tabindex="-1"><a class="header-anchor" href="#【同步踩坑信息】-安卓wx-getstorage" aria-hidden="true">#</a> 【同步踩坑信息】- 安卓wx.getStorage</h3>
<p>7.0.6开始，部分安卓手机，wx.getStorage会有意料外的回调发生。在获取缓存失败的情况下，可能不会回调fail，而是回调了success，且 res.data 是 undefined。</p>
<h3 id="【同步踩坑信息】-小程序换行会导致多余空格" tabindex="-1"><a class="header-anchor" href="#【同步踩坑信息】-小程序换行会导致多余空格" aria-hidden="true">#</a> 【同步踩坑信息】- 小程序换行会导致多余空格</h3>
<p>一般使用编辑器开发，格式化会导致一些换行，在小程序里会导致多余空格，如图：
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-latest-20191015.png" alt=""></p>
<h3 id="【同步收集信息】-首页逻辑" tabindex="-1"><a class="header-anchor" href="#【同步收集信息】-首页逻辑" aria-hidden="true">#</a> 【同步收集信息】- 首页逻辑</h3>
<p>微信7.0.7版本起，当用户打开的小程序最底层页面是非首页时，默认展示“返回首页”按钮。
开发者可在页面 onShow 中调用 hideHomeButton 进行隐藏。</p>
<ul>
<li>参考地址: https://developers.weixin.qq.com/miniprogram/dev/api/ui/navigation-bar/wx.hideHomeButton.html</li>
</ul>
<h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>最近好像没什么好文好句，推荐几本好书吧~</p>
<ul>
<li>《数学之美》</li>
<li>《算法图解》</li>
<li>《清醒思考的艺术》</li>
</ul>
</div></template>


