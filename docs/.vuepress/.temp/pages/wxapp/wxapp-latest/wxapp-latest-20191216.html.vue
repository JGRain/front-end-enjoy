<template><div><p>今年最后一刊啦~<s>明年见</s>~</p>
<!--more-->
<h1 id="小程序-latest" tabindex="-1"><a class="header-anchor" href="#小程序-latest" aria-hidden="true">#</a> 小程序 latest</h1>
<h2 id="小程序能力" tabindex="-1"><a class="header-anchor" href="#小程序能力" aria-hidden="true">#</a> 小程序能力</h2>
<h3 id="小程序代码包总包上限提升至12m" tabindex="-1"><a class="header-anchor" href="#小程序代码包总包上限提升至12m" aria-hidden="true">#</a> 小程序代码包总包上限提升至12M</h3>
<p>为了让开发者开发出功能更丰富的小程序，小程序或小游戏代码包总包上限<strong>由8M提升到12M</strong>。建议开发者优化小程序性能并将每个分包做得尽可能小，以便提升用户的打开速度，优化用户体验。</p>
<h3 id="可以在位置消息中用小程序打车" tabindex="-1"><a class="header-anchor" href="#可以在位置消息中用小程序打车" aria-hidden="true">#</a> 可以在位置消息中用小程序打车</h3>
<p>为了让用户更便捷地使用小程序的打车服务，我们在位置消息详情页的菜单中，新增了打车小程序入口，详情如下：</p>
<ol>
<li>打开聊天中的位置消息，点击详情页右下角绿色按钮，菜单中会展示符合条件的打车小程序，用户可以直接发起目的地为该位置的打车服务。</li>
<li>小程序的注册类目为“打车（网约车）”，且有用户最近使用的记录，才可以出现在该菜单中。</li>
<li>在此处点击打开小程序后，需要直接进入到发起打车页面。</li>
</ol>
<ul>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/location-message.html" target="_blank" rel="noopener noreferrer">接入方法说明<ExternalLinkIcon/></a></li>
</ul>
<h3 id="ocr识别能力升级-支持付费购买使用" tabindex="-1"><a class="header-anchor" href="#ocr识别能力升级-支持付费购买使用" aria-hidden="true">#</a> OCR识别能力升级&amp;支持付费购买使用</h3>
<ol>
<li>基础能力升级。</li>
</ol>
<ul>
<li>针对少数民族地区身份证进行了识别优化；</li>
<li>针对独特的身份证样式（如长期身份证及超长住址等）进行了能力升级</li>
</ul>
<ol start="2">
<li>OCR能力支持付费购买使用。</li>
</ol>
<ul>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/extended/service-market/intro.html" target="_blank" rel="noopener noreferrer">微信OCR识别说明<ExternalLinkIcon/></a></li>
</ul>
<h3 id="小程序模板消息开发能力调整说明" tabindex="-1"><a class="header-anchor" href="#小程序模板消息开发能力调整说明" aria-hidden="true">#</a> 小程序模板消息开发能力调整说明</h3>
<p>由于小程序模板消息能力将于2020年1月10日下线，请开发者尽快将模板消息切换为订阅消息，以免影响相关业务。近期，我们将对小程序模板消息开发能力进行以下调整：</p>
<ol>
<li>2019年12月6日起，小程序帐号将无法添加旧模板，开发者可使用订阅消息，添加订阅模板来进行新业务开发。</li>
<li>开发者工具将不再支持调试模板消息，仅支持调试订阅消息。</li>
<li>小程序模板消息接口的日调用量上限将以每周25%的比例逐步下调，具体计划如下：</li>
</ol>
<ul>
<li>2019年12月16日：下调至75%</li>
<li>2019年12月23日：下调至50%</li>
<li>2019年12月30日：下调至25%</li>
<li>2020年1月10日：小程序模板消息接口下线</li>
</ul>
<h3 id="微信卡券-刷卡买单-能力即将下线通知" tabindex="-1"><a class="header-anchor" href="#微信卡券-刷卡买单-能力即将下线通知" aria-hidden="true">#</a> 微信卡券“刷卡买单”能力即将下线通知</h3>
<p>微信卡券将于2020年1月2日下线微信卡券-微信支付代金券打通券能力（即微信卡券刷卡买单能力）。下线后，创建微信卡券流程中，“核销方式”将不再支持刷卡买单。本次调整仅针对卡券中的代金券类型，折扣券、兑换券、团购券、通用券等券类型不受影响。
你可尝试直接创建微信支付代金券作为替代，微信支付代金券同样支持覆盖全流程的 API 接口，创建入口：<a href="https://pay.weixin.qq.com/index.php/core/home/login?return_url=%2F" target="_blank" rel="noopener noreferrer">微信支付商户平台/服务商平台<ExternalLinkIcon/></a> - 营销中心。</p>
<ul>
<li><a href="https://pay.weixin.qq.com/wiki/doc/apiv3/wxpay/marketing/convention/chapter1_1.shtml" target="_blank" rel="noopener noreferrer">API接口参考<ExternalLinkIcon/></a></li>
</ul>
<h3 id="关于微信小程序部分类目报备审核说明" tabindex="-1"><a class="header-anchor" href="#关于微信小程序部分类目报备审核说明" aria-hidden="true">#</a> 关于微信小程序部分类目报备审核说明</h3>
<p>自微信小程序平台上线以来，为了保障小程序内容合规，发布时事新闻、具有社交属性或以视频、电台为载体的小程序需在上线前，完成向省/自治区/直辖市属地网信部门申请报备的工作。特别是，为避免小程序违法违规风险，UGC小程序需要对用户发布的内容做好安全审查措施。</p>
<ul>
<li><a href="https://developers.weixin.qq.com/community/operate/doc/00002a6a0b8d98a965993666a51001" target="_blank" rel="noopener noreferrer">查看帖子<ExternalLinkIcon/></a></li>
</ul>
<h3 id="更新日志" tabindex="-1"><a class="header-anchor" href="#更新日志" aria-hidden="true">#</a> 更新日志</h3>
<ul>
<li><a href="https://developers.weixin.qq.com/community/develop/doc/000c8e132c47c8e19b99a4aa85b001" target="_blank" rel="noopener noreferrer">社区问题反馈以及功能优化更新（12.02-12.06）<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/doc/000886cafa82e043029950a5151001" target="_blank" rel="noopener noreferrer">社区问题反馈以及功能优化更新（11.25-11.29）<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/doc/000c42feb30720b672898a1215b001" target="_blank" rel="noopener noreferrer">社区问题反馈以及功能优化更新（11.18-11.22）<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/doc/0008e47f970a5880cf799f32c5ec01" target="_blank" rel="noopener noreferrer">社区问题反馈以及功能优化更新（11.11-11.15）<ExternalLinkIcon/></a></li>
</ul>
<h2 id="小程序·云开发" tabindex="-1"><a class="header-anchor" href="#小程序·云开发" aria-hidden="true">#</a> 小程序·云开发</h2>
<h3 id="小程序·云开发新增自定义数据库读写权限的能力" tabindex="-1"><a class="header-anchor" href="#小程序·云开发新增自定义数据库读写权限的能力" aria-hidden="true">#</a> 小程序·云开发新增自定义数据库读写权限的能力</h3>
<p>小程序·云开发新增自定义前端数据库读写权限的能力。通过自定义规则，开发者可以精细化的控制集合中所有记录的读、写权限，系统会自动拒绝不符合安全规则的前端数据库请求，保障数据安全。
基于该能力，开发者可以：</p>
<ol>
<li>灵活自定义集合记录的读写权限：获得比基础的四种基础权限设置更灵活、强大的读写权限控制，让读写权限控制不再强制依赖于<code v-pre>_openid</code>字段和用户 <code v-pre>openid</code>。</li>
<li>防止越权访问和越权更新：用户只能获取通过安全规则限制的用户所能获取的内容，越权获取数据将被拒绝。</li>
<li>限制新建数据的内容：让新建数据必须符合规则，如可以要求权限标记字段必须为用户<code v-pre>openid</code>开发者可通过下载最新 <a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/nightly.html" target="_blank" rel="noopener noreferrer">Nightly版<ExternalLinkIcon/></a> 开发者工具体验功能。</li>
</ol>
<ul>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database/security-rules.html#%E7%AE%80%E4%BB%8B" target="_blank" rel="noopener noreferrer">数据库安全规则参考<ExternalLinkIcon/></a></li>
</ul>
<h3 id="小程序·云开发新增自定义告警能力" tabindex="-1"><a class="header-anchor" href="#小程序·云开发新增自定义告警能力" aria-hidden="true">#</a> 小程序·云开发新增自定义告警能力</h3>
<p>为了方便开发者及时发现小程序运行过程中发生的异常，小程序·云开发新增自定义告警能力。开发者可以通过告警指标、统计周期、比较条件、持续周期和告警频率等参数的自由组合灵活地配置所需的告警规则。 开发者可通过下载最新 <a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/nightly.html" target="_blank" rel="noopener noreferrer">Nightly版<ExternalLinkIcon/></a> 开发者工具体验功能。</p>
<ul>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/alarm.html" target="_blank" rel="noopener noreferrer">告警设置参考<ExternalLinkIcon/></a></li>
</ul>
<h2 id="开发者工具" tabindex="-1"><a class="header-anchor" href="#开发者工具" aria-hidden="true">#</a> 开发者工具</h2>
<h3 id="微信开发者工具功能更新" tabindex="-1"><a class="header-anchor" href="#微信开发者工具功能更新" aria-hidden="true">#</a> 微信开发者工具功能更新！</h3>
<p>为提高代码编辑效率和优化开发体验，微信开发者工具的编辑器功能进行了全面升级，并对产品 Logo 进行了更新：
<img src="https://mmbiz.qlogo.cn/mmbiz_png/UB2CE27Dppm0h0zPD1HXMSMAjKXDWFTibibhzRueUYptye69ZahU3yzrLrOic1jEYyWJPcYicnsf5PveuJPD5F4ia7Q/0?wx_fmt=png" alt=""></p>
<ol>
<li>编辑器功能优化：</li>
</ol>
<ul>
<li>新增大纲结构视图和文件的面包屑导航，同时编辑区域还支持分栏视图，方便开发者同时查看和编辑多个文件。</li>
<li>优化了文件搜索功能，支持更加精细化地搜索和替换功能，进一步提高了开发者的操作效率。</li>
<li>在编写 JS/TS 文件时，编辑器现在提供完整的项目代码补全和联想功能，使用 TS 的语言服务分析并提供代码错误及警告提示。</li>
</ul>
<ol start="2">
<li>兼容部分 VS Code 扩展 （Beta）：
新版微信开发者工具编辑器兼容了部分 VS Code 扩展插件，目前正在功能完善阶段。开发者可根据需要安装对应插件，进一步提高开发效率。</li>
</ol>
<p>开发者可通过下载最新 <a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/nightly.html" target="_blank" rel="noopener noreferrer">Nightly版<ExternalLinkIcon/></a> 开发者工具体验功能。</p>
<h3 id="内置扩展库支持" tabindex="-1"><a class="header-anchor" href="#内置扩展库支持" aria-hidden="true">#</a> 内置扩展库支持</h3>
<p>方便开发者使用，最新的 <a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/nightly.html" target="_blank" rel="noopener noreferrer">Nightly版<ExternalLinkIcon/></a> 开发者工具支持了内置扩展库，开发者只需在app.json配置文件声明引用指定扩展库即可，无需自行引入相关 npm 包且不计入小程序代码包大小，目前支持了kbone和WeUI两种扩展库，更多详情请参考文档。</p>
<ul>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/extended/weui/" target="_blank" rel="noopener noreferrer">拓展能力说明<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#useExtendedLib" target="_blank" rel="noopener noreferrer">配置使用说明<ExternalLinkIcon/></a></li>
</ul>
<blockquote>
<p>工具里不计入总包大小，但是下载代码包依然会变大噢</p>
</blockquote>
<h3 id="更多更新说明" tabindex="-1"><a class="header-anchor" href="#更多更新说明" aria-hidden="true">#</a> 更多更新说明</h3>
<p>更多的内容可以查看：</p>
<ul>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/stable.html" target="_blank" rel="noopener noreferrer">稳定版 Stable Build 更新日志<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/nightly.html" target="_blank" rel="noopener noreferrer">开发版 Nightly Build 更新日志<ExternalLinkIcon/></a></li>
</ul>
<h1 id="小程序教程" tabindex="-1"><a class="header-anchor" href="#小程序教程" aria-hidden="true">#</a> 小程序教程</h1>
<h2 id="社区精选文章" tabindex="-1"><a class="header-anchor" href="#社区精选文章" aria-hidden="true">#</a> 社区精选文章</h2>
<ul>
<li><a href="https://developers.weixin.qq.com/community/develop/article/doc/0008424ea884e83b47895f5c45b813" target="_blank" rel="noopener noreferrer">揭开微信小程序 Kbone 的神秘面纱<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/article/doc/00088ebe4e0500035999338cb56813" target="_blank" rel="noopener noreferrer">小程序奇技淫巧之 -- globalDataBehavior管理全局状态<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/article/doc/00006c4afb0d28925699bba915b013" target="_blank" rel="noopener noreferrer">小程序奇技淫巧之 -- 日志能力<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/article/doc/000a0a78a582d0e053997a1c05b813" target="_blank" rel="noopener noreferrer">小程序奇技淫巧之 -- 页面跳转管理<ExternalLinkIcon/></a></li>
</ul>
<p>往期内容可以查看<a href="https://developers.weixin.qq.com/community/develop/article" target="_blank" rel="noopener noreferrer">文章分享<ExternalLinkIcon/></a></p>
<h2 id="最新踩坑-tips" tabindex="-1"><a class="header-anchor" href="#最新踩坑-tips" aria-hidden="true">#</a> 最新踩坑 &amp;&amp; Tips</h2>
<h3 id="【同步踩坑信息】-小程序换行会导致多余空格" tabindex="-1"><a class="header-anchor" href="#【同步踩坑信息】-小程序换行会导致多余空格" aria-hidden="true">#</a> 【同步踩坑信息】- 小程序换行会导致多余空格</h3>
<p>一般使用编辑器开发，格式化会导致一些换行，在小程序里会导致多余空格，如图：
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/wxapp-latest-20191015.png" alt="">
经小程序团队定位，win 版换行符 \r\n 会有问题，浏览器也会。可以修改各自的编辑器的换行符使用 \n 可以解决。</p>
<ul>
<li>VS Code：Setting -&gt; Text Editor -&gt; Files -&gt; Eol -&gt; 设置为 \n</li>
</ul>
<h3 id="【同步开发tips】-手机宽高比" tabindex="-1"><a class="header-anchor" href="#【同步开发tips】-手机宽高比" aria-hidden="true">#</a> 【同步开发Tips】- 手机宽高比</h3>
<p>ios最小高宽比一般是960 x 640也就是我们的iPhone 比例是1.5，android最小宽高比960 x 540 比例是1.777777778。所以最小比例我们可以参考iPhone4，最大比例没有限制，因为手机屏幕只会越来越大，但是比例来来回回就是2.16的。</p>
<h3 id="【同步开发tips】-小程序转发" tabindex="-1"><a class="header-anchor" href="#【同步开发tips】-小程序转发" aria-hidden="true">#</a> 【同步开发Tips】- 小程序转发</h3>
<p>小程序里控制右上角的转发行为方式：</p>
<ol>
<li>动态显隐转发按钮<code v-pre>wx.showShareMenu</code>、<code v-pre>wx.hideShareMenu</code>。</li>
<li>不定义<code v-pre>onShareAppMessage</code>，默认不会有转发。</li>
</ol>
<h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>我们倾向于以结果判断决定——而不是当时作决定的过程。这种思维错误又名史学家错误。-- 《清醒思考的艺术》</p>
</div></template>


