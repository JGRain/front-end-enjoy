<template><div><p>这个月大家都开始陆陆续续回去上班了，远程办公的环境也有了一大突破，线上会议的各种延迟和回音有时候依然让人尴尬。不过情况已经慢慢好转，希望各位的日子也会越来越好。</p>
<!--more-->
<hr>
<h2 id="title-小程序开发月刊第14期-20200314-date-2020-03-14-20-46-50categories-小程序双皮奶tags-教程" tabindex="-1"><a class="header-anchor" href="#title-小程序开发月刊第14期-20200314-date-2020-03-14-20-46-50categories-小程序双皮奶tags-教程" aria-hidden="true">#</a> title: 小程序开发月刊第14期（20200314）
date: 2020-03-14 20:46:50
categories: 小程序双皮奶
tags: 教程</h2>
<p>这个月大家都开始陆陆续续回去上班了，远程办公的环境也有了一大突破，线上会议的各种延迟和回音有时候依然让人尴尬。不过情况已经慢慢好转，希望各位的日子也会越来越好。</p>
<!--more-->
<h1 id="小程序-latest" tabindex="-1"><a class="header-anchor" href="#小程序-latest" aria-hidden="true">#</a> 小程序 latest</h1>
<h2 id="小程序能力" tabindex="-1"><a class="header-anchor" href="#小程序能力" aria-hidden="true">#</a> 小程序能力</h2>
<h3 id="安卓微信7-0-12" tabindex="-1"><a class="header-anchor" href="#安卓微信7-0-12" aria-hidden="true">#</a> 安卓微信7.0.12</h3>
<p>本次小程序更新概要如下:</p>
<ul>
<li>小程序启动耗时优化，请关注小程序启动是否受影响；</li>
<li>菜单增加“重新进入小程序”入口，请关注重启后是否正常；</li>
<li>解决 connectWifi android 10下失败的问题；</li>
<li>文件接口 readFile 改动，请关注功能是否正常。</li>
</ul>
<h2 id="小程序·云开发" tabindex="-1"><a class="header-anchor" href="#小程序·云开发" aria-hidden="true">#</a> 小程序·云开发</h2>
<h3 id="小程序·云开发支持数据库回档" tabindex="-1"><a class="header-anchor" href="#小程序·云开发支持数据库回档" aria-hidden="true">#</a> 小程序·云开发支持数据库回档</h3>
<p>从开发者工具1.02.202002282版本开始，云开发提供了数据库回档功能。系统会自动开启数据库备份，并于每日凌晨自动进行一次数据备份，最长保存 7 天的备份数据。如有需要，开发者可在云控制台上通过新建回档任务将集合回档（还原）至指定时间点。
回档期间，数据库的数据访问不受影响。回档完成后，开发者可在集合列表中看到原有数据库集合和回档后的集合。</p>
<ul>
<li>详细功能介绍请参考文档<a href="https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database/backup.html" target="_blank" rel="noopener noreferrer">《数据库回档》<ExternalLinkIcon/></a></li>
</ul>
<h3 id="小程序·云开发支持按量付费" tabindex="-1"><a class="header-anchor" href="#小程序·云开发支持按量付费" aria-hidden="true">#</a> 小程序·云开发支持按量付费</h3>
<p>为助力开发者以更低的资源成本实现小程序的功能迭代，从开发者工具1.02.2003022版本开始，小程序·云开发新增按量付费功能。在按量付费模式下，系统每月会提供一定的免费额度供开发者使用，超过免费额度的资源消耗将按照对应的刊例价扣除费用。</p>
<ul>
<li>具体按量付费计费策略请参考文档<a href="https://developers.weixin.qq.com/miniprogram/dev/wxcloud/billing/postpayment.html" target="_blank" rel="noopener noreferrer">《小程序·云开发按量付费》<ExternalLinkIcon/></a></li>
</ul>
<p>按量付费功能适用于：</p>
<ul>
<li>对于无法准确预估资源使用量的小程序，按量付费功能在保证了正常资源使用的同时，也避免了当用户访问量突增时，由于资源储备不足所导致的超限停服等问题；</li>
<li>对于仅使用部分云开发资源类型的小程序，按量付费功能按消耗收费的模式将极大地降低资源成本。</li>
</ul>
<p>开发者可通过登录微信开发者工具的云开发控制台，在环境设置中直接开通按量付费功能。</p>
<h2 id="开发者工具" tabindex="-1"><a class="header-anchor" href="#开发者工具" aria-hidden="true">#</a> 开发者工具</h2>
<h3 id="代码编译和上传-ci-模块" tabindex="-1"><a class="header-anchor" href="#代码编译和上传-ci-模块" aria-hidden="true">#</a> 代码编译和上传 CI 模块</h3>
<p><a href="https://www.npmjs.com/package/miniprogram-ci" target="_blank" rel="noopener noreferrer">miniprogram-ci<ExternalLinkIcon/></a> 是从微信开发者工具中抽离的关于小程序/小游戏项目代码的编译模块。该npm 模块，封装了以下逻辑：</p>
<ul>
<li>对源代码进行校验</li>
<li>对源代码进行预编译</li>
<li>使用证书生成签名</li>
<li>上传</li>
</ul>
<p>使用前需要使用小程序管理员身份访问&quot;微信公众平台-开发-开发设置&quot;后下载代码上传密钥，并配置 IP 白名单（可选，需要注意风险），才能进行上传、预览操作。</p>
<ul>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html" target="_blank" rel="noopener noreferrer">参考文档地址<ExternalLinkIcon/></a></li>
</ul>
<h3 id="微信开发者工具提供-api-mock-能力" tabindex="-1"><a class="header-anchor" href="#微信开发者工具提供-api-mock-能力" aria-hidden="true">#</a> 微信开发者工具提供 API Mock 能力</h3>
<p>为了方便开发者进行功能开发和调试，从 1.02.202003062 版本开始，微信开发者工具提供 API Mock 功能，可模拟如wx.request 、wx.downloadFile 以及 wx.getBackgroundFetchData 等API 的调用结果，极大地降低了小程序的开发成本。</p>
<ul>
<li>详细功能介绍请参考文档<a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/api-mock.html" target="_blank" rel="noopener noreferrer">《API Mock》<ExternalLinkIcon/></a></li>
</ul>
<p>API Mock 功能可覆盖的应用场景包括但不限于：</p>
<ul>
<li>模拟特定用户场景数据，如通过配置 wx.getLocation 的返回数据，从而模拟位置信息；</li>
<li>模拟各类异常情况，如通过配置wx.request的回调为 fail，从而模拟网络异常；</li>
<li>模拟部分微信开发者工具中暂不支持调试的 API，如发票相关的 wx.chooseInvoic等接口。</li>
<li>开发者可通过登录微信开发者工具，在调试器的 Mock 面板中使用该功能。</li>
</ul>
<h3 id="更多更新说明" tabindex="-1"><a class="header-anchor" href="#更多更新说明" aria-hidden="true">#</a> 更多更新说明</h3>
<p>参考<a href="https://developers.weixin.qq.com/community/develop/doc/0004064f12424003b90a1758f56c01" target="_blank" rel="noopener noreferrer">微信开发者工具 1.02.2003121 RC 更新说明<ExternalLinkIcon/></a>，这期新增能力包括：</p>
<ol>
<li>支持 API Mock。</li>
<li>编辑器支持重命名多个文件。</li>
<li>支持显示灰度中的基础库、下发测试基础库（该功能只能推送到登录到开发者工具的微信号的手机上，会影响到手机上所有的小程序）。</li>
</ol>
<ul>
<li>新增显示灰度中的基础库以及基础库支持的客户端版本。</li>
<li>同时新增推送按钮，将选定版本的基础库下发到客户端上，推送结果可以在开发版小程序的调试面板中查看。</li>
<li>微信客户端对开发版的小程序打开调试，可以看到测试版基础库的生效时间。</li>
</ul>
<ol start="4">
<li>模拟器支持终止。</li>
</ol>
<ul>
<li>模拟器是工具的主要功能之一，如果小程序/小游戏的业务代码中出现死循环、复杂运算、频繁调用某些 API 的情况下都会导致工具出现卡顿或者 CPU 占用比较高的情况。模拟器新增终止按钮，点击后可以暂时终止模拟器运行，节省系统资源占用。</li>
</ul>
<ol start="5">
<li>打开项目时展示 Loading 状态。
工具增加开启加载 loading 弹窗，显示加载状态情况。</li>
<li>CLI/HTTP V2 更新。</li>
</ol>
<ul>
<li>CLI &amp; HTTP 接口升级 v2 版本，在 v2 版本中，旧版命令仍然可以使用，但已废弃并会在未来移除，请使用 v2 命令。v2 版本增加了云开发管理操作支持、优化命令形式、增加细致状态提示、支持长时间命令执行、支持国际化（中英文选择）等。详细文档。</li>
</ul>
<ol start="7">
<li>优化云控制台用户访问统计和监控图表的数据展示。
支持按照近 7 天、近 30 天以及自定义时间段来筛选 DAU。</li>
<li>数据库备份回档。</li>
</ol>
<p>更多的内容可以查看：</p>
<ul>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/stable.html" target="_blank" rel="noopener noreferrer">稳定版 Stable Build 更新日志<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/nightly.html" target="_blank" rel="noopener noreferrer">开发版 Nightly Build 更新日志<ExternalLinkIcon/></a></li>
</ul>
<h1 id="小程序教程" tabindex="-1"><a class="header-anchor" href="#小程序教程" aria-hidden="true">#</a> 小程序教程</h1>
<h2 id="社区精选文章" tabindex="-1"><a class="header-anchor" href="#社区精选文章" aria-hidden="true">#</a> 社区精选文章</h2>
<ul>
<li><a href="https://developers.weixin.qq.com/community/develop/article/doc/000240bb188098d767f9b299956013" target="_blank" rel="noopener noreferrer">[填坑手册]小程序新版订阅消息+云开发实战与跳坑<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/article/doc/0006245c108bf0cd56e9da13651813" target="_blank" rel="noopener noreferrer">业务数据怎么查，我用云开发高级日志服务<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/article/doc/00080c6e3746d8a940f9b43e55fc13" target="_blank" rel="noopener noreferrer">只有三行代码的神奇云函数的功能之一：获取openid<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/article/doc/000c6c23708fe0ad46e9dcd215b013" target="_blank" rel="noopener noreferrer">借助云开发实现小程序订阅消息和模板消息的推送功能<ExternalLinkIcon/></a></li>
</ul>
<p>往期内容可以查看<a href="https://developers.weixin.qq.com/community/develop/article" target="_blank" rel="noopener noreferrer">文章分享<ExternalLinkIcon/></a></p>
<h2 id="最新踩坑-tips" tabindex="-1"><a class="header-anchor" href="#最新踩坑-tips" aria-hidden="true">#</a> 最新踩坑 &amp;&amp; Tips</h2>
<h3 id="【同步踩坑信息】-云函数" tabindex="-1"><a class="header-anchor" href="#【同步踩坑信息】-云函数" aria-hidden="true">#</a> 【同步踩坑信息】- 云函数</h3>
<p>1、小程序冷启动可能导致无状态云函数变成有状态
2、避免使用<code v-pre>setTimeout</code>等异步调用，而应使用明确状态管理的<code v-pre>await</code>或<code v-pre>Promise</code>
3、避免使用<code v-pre>cloud.getWXContext()</code>，而使用<code v-pre>cloud.getWXContext(context)</code>代替
4、用到<code v-pre>Date</code>对象的函数应当设置时区环境变量，TZ=Asia/Shanghai</p>
<h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>如果你也使用Typescript的话，不妨看看我用各种踩坑经验整理的这个<a href="https://github.com/godbasin/wxapp-typescript-demo" target="_blank" rel="noopener noreferrer">小程序 typescript 最佳实践 demo<ExternalLinkIcon/></a>。</p>
</div></template>


