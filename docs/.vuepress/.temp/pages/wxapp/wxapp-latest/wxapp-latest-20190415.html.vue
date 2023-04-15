<template><div><p>每月都有小程序期刊，这个月新功能特别多~~</p>
<!--more-->
<h1 id="小程序-latest" tabindex="-1"><a class="header-anchor" href="#小程序-latest" aria-hidden="true">#</a> 小程序 latest</h1>
<h2 id="小程序能力" tabindex="-1"><a class="header-anchor" href="#小程序能力" aria-hidden="true">#</a> 小程序能力</h2>
<h3 id="「小程序评测」功能上线" tabindex="-1"><a class="header-anchor" href="#「小程序评测」功能上线" aria-hidden="true">#</a> 「小程序评测」功能上线</h3>
<p>小程序评测能力已上线 beta 版本，登录管理后台-【功能】-【小程序评测】可以查看。
评测达标的小程序，可获得「2 小时极速审核」和「内测功能体验」奖励。</p>
<ul>
<li>常见问题查看：http://kf.qq.com/faq/190108BJnmUN190108RrEnqE.html</li>
</ul>
<h3 id="小程序管理后台新增页面收录设置的开关" tabindex="-1"><a class="header-anchor" href="#小程序管理后台新增页面收录设置的开关" aria-hidden="true">#</a> 小程序管理后台新增页面收录设置的开关</h3>
<p>小程序管理后台新增页面收录设置的开关，开发者可根据业务需要进行设置：</p>
<ol>
<li>小程序管理后台-【设置】-【基本设置】-【页面收录设置】，可对你的小程序帐号进行收录的开启和关闭的设置。</li>
<li>更新 微信开发者工具 ，可对 sitemap 进行特定页面的配置，可参考<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/sitemap.html" target="_blank" rel="noopener noreferrer">小程序开发文档<ExternalLinkIcon/></a>。</li>
<li>此设置默认开启。若小程序中存在不适合展示的内容，或开发者不希望使用微信展示其小程序，建议开发者自行关闭该设置，<a href="https://mp.weixin.qq.com/wxopen/readtemplate?t=config/collection_agreement_tmpl" target="_blank" rel="noopener noreferrer">详情查看<ExternalLinkIcon/></a>。</li>
</ol>
<p>PS: sitemap 功能仿原生目前是不会被收录的。开关的逻辑他们会特殊处理下，默认关闭（目前是默认开启）。同时：</p>
<ol>
<li>如果设置了不允许被搜索，但开启了允许被收录：不会进入搜索。</li>
<li>如果关闭了允许被收录，sitemap 设置会无效。</li>
</ol>
<h3 id="小程序关联公众号策略调整" tabindex="-1"><a class="header-anchor" href="#小程序关联公众号策略调整" aria-hidden="true">#</a> 小程序关联公众号策略调整</h3>
<p>为了降低公众号与小程序间的合作门槛，我们将调整小程序关联公众号策略如下：</p>
<ol>
<li>公众号关联小程序将无需小程序管理员确认。</li>
<li>取消“小程序最多关联 500 个公众号”的限制。</li>
<li>若希望小程序在被关联时保留管理员确认环节，可前往“小程序管理后台-设置-基本设置-关联公众号设置”修改设置项。</li>
<li>公众号文章中可直接使用小程序素材，无需关联小程序。
开发者可在小程序管理后台-【设置】-【关联设置】中管理已关联的公众号。</li>
</ol>
<h3 id="小程序用户访问数据上报优化" tabindex="-1"><a class="header-anchor" href="#小程序用户访问数据上报优化" aria-hidden="true">#</a> 小程序用户访问数据上报优化</h3>
<p>为了提供更准确的用户访问数据，小程序数据上报做了系统优化，由微信客户端上报切换为基础库上报。当用户离开小程序页面，触发<code v-pre>onHide</code>或<code v-pre>onUnload</code>函数时，公共库会上报此次用户访问行为。
优化详情如下：</p>
<ul>
<li>优化了部分小程序存在页面脏数据的问题</li>
<li>优化了部分小程序存在错误小程序跳转数据的问题</li>
<li>当用户点击进入小程序，但小程序框架未加载完成，用户退出小程序，则不做上报，确保每次上报数据均为有效访问行为</li>
</ul>
<h3 id="更新日志" tabindex="-1"><a class="header-anchor" href="#更新日志" aria-hidden="true">#</a> 更新日志</h3>
<ul>
<li><a href="https://developers.weixin.qq.com/community/develop/doc/000c8033998118cb3168228965b401" target="_blank" rel="noopener noreferrer">周社区问题反馈以及功能优化更新（04.01-04.05）<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/doc/0006882b218580bcaf58036f556c01" target="_blank" rel="noopener noreferrer">周社区问题反馈以及功能优化更新（03.25-03.29）<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/doc/000c249a62c968e59648fdcd051001" target="_blank" rel="noopener noreferrer">周社区问题反馈以及功能优化更新（03.11-03.16）<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/doc/000e8a372e0608040c481445956001" target="_blank" rel="noopener noreferrer">周社区问题反馈以及功能优化更新（03.04-03.08）<ExternalLinkIcon/></a></li>
</ul>
<h2 id="开发者工具" tabindex="-1"><a class="header-anchor" href="#开发者工具" aria-hidden="true">#</a> 开发者工具</h2>
<h3 id="「微信开发者工具」新增企业微信小程序插件" tabindex="-1"><a class="header-anchor" href="#「微信开发者工具」新增企业微信小程序插件" aria-hidden="true">#</a> 「微信开发者工具」新增企业微信小程序插件</h3>
<p>企业微信小程序模拟器插件是为了方便用户在微信开发者工具中进行企业微信小程序开发、调试和代码上传。</p>
<ul>
<li>参考文档：https://developers.weixin.qq.com/miniprogram/dev/devtools/qywx-dev.html</li>
</ul>
<h3 id="「小程序·云开发」云函数本地调试功能上线" tabindex="-1"><a class="header-anchor" href="#「小程序·云开发」云函数本地调试功能上线" aria-hidden="true">#</a> 「小程序·云开发」云函数本地调试功能上线</h3>
<p>小程序·云开发提供了云函数本地调试功能，方便开发者在本地进行云函数调试，提高开发效率。开发者可通过右键点击云函数名唤起本地调试界面。目前云函数本地调试的支持手动触发和模拟器触发两种请求方式。</p>
<ul>
<li>参考文档：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/functions/local-debug.html</li>
</ul>
<h3 id="「小程序·云开发」新增云调用" tabindex="-1"><a class="header-anchor" href="#「小程序·云开发」新增云调用" aria-hidden="true">#</a> 「小程序·云开发」新增云调用</h3>
<p>云调用是云开发提供的基于云函数使用小程序开放接口的能力。目前覆盖服务端调用的场景，后续将会陆续开放开放数据调用、消息推送、支付等其他多种使用场景。
云调用需要在云函数中通过<code v-pre>wx-server-sdk</code>使用。在云函数中使用云调用调用服务端接口无需换取<code v-pre>access_token</code>，只要是在从小程序端触发的云函数中发起的云调用都经过微信自动鉴权，可以在登记权限后直接调用如发送模板消息等开放接口。</p>
<ul>
<li>云调用文档：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/functions/openapi.html</li>
</ul>
<h3 id="「小程序·云开发」全新云控制台上线" tabindex="-1"><a class="header-anchor" href="#「小程序·云开发」全新云控制台上线" aria-hidden="true">#</a> 「小程序·云开发」全新云控制台上线</h3>
<p>云开发控制台经过全新设计和改版，优化交互和视觉体验，功能分类更加清晰、各项功能更加易用</p>
<h3 id="其他" tabindex="-1"><a class="header-anchor" href="#其他" aria-hidden="true">#</a> 其他</h3>
<p><strong>开发工具新增版本区分：</strong></p>
<ul>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/nightly.html" target="_blank" rel="noopener noreferrer">开发版 Nightly Build<ExternalLinkIcon/></a>: 日常构建版本，用于尽快修复缺陷和敏捷上线小的特性；开发自测验证，稳定性欠佳</li>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/rc.html" target="_blank" rel="noopener noreferrer">预发布版 RC Build<ExternalLinkIcon/></a>: 预发布版本，包含大的特性；通过内部测试，稳定性尚可</li>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/stable.html" target="_blank" rel="noopener noreferrer">稳定版 Stable Build<ExternalLinkIcon/></a></li>
</ul>
<p>大家可以根据需要，下载对应的版本开发~</p>
<h1 id="小程序教程" tabindex="-1"><a class="header-anchor" href="#小程序教程" aria-hidden="true">#</a> 小程序教程</h1>
<h2 id="社区精选文章" tabindex="-1"><a class="header-anchor" href="#社区精选文章" aria-hidden="true">#</a> 社区精选文章</h2>
<ul>
<li><a href="https://developers.weixin.qq.com/community/develop/article/doc/0004e0543b8878a53b589986451413" target="_blank" rel="noopener noreferrer">小程序自定义组件知多少<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/article/doc/000eaadb944de06374485c3ed51813" target="_blank" rel="noopener noreferrer">小程序多端框架全面测评<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/article/doc/000caad3c4cbc03a5648e01e951013" target="_blank" rel="noopener noreferrer">一种小成本的线下定位方案 ---2019 腾讯数字文创节小程序开发有感<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/article/doc/000aa4e19a0d50bf0f6893b9f56c13" target="_blank" rel="noopener noreferrer">Comi - 小程序 markdown 渲染和代码高亮解决方案<ExternalLinkIcon/></a></li>
</ul>
<p>更多可以查看<a href="https://developers.weixin.qq.com/community/develop/article" target="_blank" rel="noopener noreferrer">文章分享<ExternalLinkIcon/></a>。</p>
<h2 id="最新踩坑-tips" tabindex="-1"><a class="header-anchor" href="#最新踩坑-tips" aria-hidden="true">#</a> 最新踩坑 &amp;&amp; Tips</h2>
<ol>
<li>
<p>如果小程序里已经授权过，例如地理位置信息，取消授权的方法：右上角... -&gt; 关于 xxx -&gt; 设置。</p>
</li>
<li>
<p>【小程序体验评分】遇到性能体验的问题，可以在小程序开发工具里找到协助定位性能的能力。
体验评分是一项给小程序的体验好坏打分的功能，它会在小程序运行过程中实时检查，分析出一些可能导致体验不好的地方，并且定位出哪里有问题，以及给出一些优化建议。</p>
</li>
<li>
<p>小程序里嵌套 web-view，小程序往 web-view 里传数据方法：</p>
</li>
<li>
<p>把参数拼装在 url 中传进去，可通过 hash。</p>
</li>
<li>
<p>通过 postMessage 传递，只会在特定时机（小程序后退、组件销毁、分享）触发并收到消息， 参考：https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html。</p>
</li>
<li>
<p>通过后台拉取。</p>
</li>
<li>
<p>setData 单次设置的数据超过 1024kB，工具上测试正常，手机上会报错。Taro 在 setData 的时候会带上一些不需要的数据。</p>
</li>
<li>
<p>小程序的 setStorage 缓存，会在客户端保存尽量久的时间，以下两种情况（会从最不常用的小程序删起）：</p>
</li>
<li>
<p>客户端空间不够。</p>
</li>
<li>
<p>小程序总体容量超过客户端容量 5%。</p>
</li>
</ol>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>这种没人关注依然狗狗祟祟坚持做的事情，大概是我最喜欢和最擅长的了。^_^</p>
</div></template>


