<template><div><p>又一个月过去了，大家也快习惯了带着口罩上班，饭堂也在慢慢恢复菜单供打包，捡树枝活动异常火热，我们来看看小程序又更新了哪些能力吧~</p>
<!--more-->
<h1 id="小程序-latest" tabindex="-1"><a class="header-anchor" href="#小程序-latest" aria-hidden="true">#</a> 小程序 latest</h1>
<h2 id="小程序能力" tabindex="-1"><a class="header-anchor" href="#小程序能力" aria-hidden="true">#</a> 小程序能力</h2>
<h3 id="关于收回小程序-用户实名信息授权-接口的相关说明" tabindex="-1"><a class="header-anchor" href="#关于收回小程序-用户实名信息授权-接口的相关说明" aria-hidden="true">#</a> 关于收回小程序&quot;用户实名信息授权&quot;接口的相关说明</h3>
<p>小程序将回收小程序“用户实名信息授权”接口，计划于2020年05月31日下线。对于以往已经接入了本接口的小程序，但依然有业务场景有相关需求，平台侧建设了替代接口方案——实名信息校验接口，提供给满足一定条件的业务方，相关接口：</p>
<ol>
<li>实名信息校验接口。</li>
</ol>
<ul>
<li>本接口可实现：在用户同意情况下，校验用户（或业务方）输入的实名信息是否正确（仅支持身份证信息）。对于接入微信城市服务的业务，或满足以下地址中的文档说明的范围，可以申请城市服务实名信息校验接口。</li>
<li><a href="https://developers.weixin.qq.com/community/business/doc/000e06614ac74068f3d9237eb5440d" target="_blank" rel="noopener noreferrer">申请方式地址<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/framework/cityservice/cityservice-checkrealnameinfo.html" target="_blank" rel="noopener noreferrer">接口文档地址<ExternalLinkIcon/></a></li>
</ul>
<ol start="2">
<li>地址组件接口。</li>
</ol>
<ul>
<li>本接口可实现：拉起微信原生的地址选择及编辑界面，可以编辑已有地址，也可以在编辑完成后，返回用户选择的地址。</li>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/api/open-api/address/wx.chooseAddress.html" target="_blank" rel="noopener noreferrer">接口文档地址<ExternalLinkIcon/></a></li>
</ul>
<ol start="3">
<li>快速填写组件接口。</li>
</ol>
<ul>
<li>本接口可实现： 小程序开发者可以获取用户首次填写过的表单的信息，并快速快速填充本次需要填写的表单。减少用户输入的压力。</li>
<li><a href="https://developers.weixin.qq.com/community/business/doc/0004c23556c43074dde973aeb5bc0d" target="_blank" rel="noopener noreferrer">接口介绍、开放范围及申请指引<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/framework/cityservice/cityservice-auto-fill.html" target="_blank" rel="noopener noreferrer">接口文档地址<ExternalLinkIcon/></a></li>
</ul>
<h3 id="小程序测速功能上线" tabindex="-1"><a class="header-anchor" href="#小程序测速功能上线" aria-hidden="true">#</a> 小程序测速功能上线</h3>
<p>“小程序测速”功能可以简单方便地统计小程序内某一事件的实时耗时情况，并可根据地域、运营商、操作系统、网络类型、机型等关键维度进行交叉分析。对于更复杂的用户场景，还可以使用自定义维度进行分析。从基础库2.9.2开始，开发者通过“测速上报”接口上报某一指标的耗时情况后，可在小程序管理后台&quot;开发 -运维中心 -小程序测速&quot; 查看各指标耗时趋势，并支持分钟级数据实时查看。</p>
<ul>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/framework/performanceReport/" target="_blank" rel="noopener noreferrer">《小程序测速》使用指南<ExternalLinkIcon/></a></li>
</ul>
<h2 id="小程序·云开发" tabindex="-1"><a class="header-anchor" href="#小程序·云开发" aria-hidden="true">#</a> 小程序·云开发</h2>
<blockquote>
<p>暂无更新</p>
</blockquote>
<h2 id="开发者工具" tabindex="-1"><a class="header-anchor" href="#开发者工具" aria-hidden="true">#</a> 开发者工具</h2>
<h3 id="代码编译和上传-ci-模块" tabindex="-1"><a class="header-anchor" href="#代码编译和上传-ci-模块" aria-hidden="true">#</a> 代码编译和上传 CI 模块</h3>
<blockquote>
<p>该部分内容上期更新补充过，但官方更新时间属于本期，因此再发一次。</p>
</blockquote>
<p>为助力开发者进行小程序开发的自动化，实现功能的持续集成，小程序团队抽离了开发者工具中的代码编译以及上传能力，新增 <a href="https://www.npmjs.com/package/miniprogram-ci" target="_blank" rel="noopener noreferrer">miniprogram-ci<ExternalLinkIcon/></a> 模块。该模块可以极大地方便开发者将小程序代码上传和预览操作同已有系统相结合。
miniprogram-ci 是从微信开发者工具中抽离的关于小程序/小游戏项目代码的编译模块，目前提供以下能力：</p>
<ol>
<li>上传代码，对应小程序开发者工具的上传</li>
<li>预览代码，对应小程序开发者工具的预览</li>
<li>构建 npm，对应小程序开发者工具的: 菜单-工具-构建npm</li>
<li>代理，配置 miniprogram-ci 的网络请求代理方式</li>
<li>支持 node 脚本调用方式和 命令行 调用方式
使用 miniprogram-ci 模块前需要在微信公众平台-开发-开发设置中下载对应的代码上传密钥和配置 IP 白名单。</li>
</ol>
<ul>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html" target="_blank" rel="noopener noreferrer">参考文档地址<ExternalLinkIcon/></a></li>
</ul>
<p>更多的内容可以查看：</p>
<ul>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/stable.html" target="_blank" rel="noopener noreferrer">稳定版 Stable Build 更新日志<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/nightly.html" target="_blank" rel="noopener noreferrer">开发版 Nightly Build 更新日志<ExternalLinkIcon/></a></li>
</ul>
<h1 id="小程序教程" tabindex="-1"><a class="header-anchor" href="#小程序教程" aria-hidden="true">#</a> 小程序教程</h1>
<h2 id="社区精选文章" tabindex="-1"><a class="header-anchor" href="#社区精选文章" aria-hidden="true">#</a> 社区精选文章</h2>
<ul>
<li><a href="https://developers.weixin.qq.com/community/develop/article/doc/000224ac24882059eb2a0775f51013" target="_blank" rel="noopener noreferrer">网页端管理系统在小程序上的实现<ExternalLinkIcon/></a></li>
</ul>
<p>往期内容可以查看<a href="https://developers.weixin.qq.com/community/develop/article" target="_blank" rel="noopener noreferrer">文章分享<ExternalLinkIcon/></a></p>
<blockquote>
<p>最近社区的精选文章都木有怎么更新来着。</p>
</blockquote>
<h2 id="最新踩坑-tips" tabindex="-1"><a class="header-anchor" href="#最新踩坑-tips" aria-hidden="true">#</a> 最新踩坑 &amp;&amp; Tips</h2>
<h3 id="ios-下promise-finally-异常" tabindex="-1"><a class="header-anchor" href="#ios-下promise-finally-异常" aria-hidden="true">#</a> iOS 下<code v-pre>Promise.finally()</code>异常</h3>
<p><code v-pre>Promise.finally()</code>在iOS下会出现故障，安卓下表现良好，若使用需要注意。</p>
<ul>
<li><a href="https://developers.weixin.qq.com/community/develop/doc/000caaefe54f70567a4933aaa56000" target="_blank" rel="noopener noreferrer">参考<ExternalLinkIcon/></a></li>
</ul>
<h3 id="wx-choosecontact-拉起通信录接口异常" tabindex="-1"><a class="header-anchor" href="#wx-choosecontact-拉起通信录接口异常" aria-hidden="true">#</a> <code v-pre>wx.chooseContact()</code>拉起通信录接口异常</h3>
<p>小程序中调用过<code v-pre>wx.chooseContact()</code> api后，再调用其他 api 都会失败。</p>
<ul>
<li>出现异常版本：iOS 13.3.1 + 微信 7.0.12</li>
</ul>
<h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>本期木有结束语，祝各位的大头菜都涨涨涨。</p>
</div></template>


