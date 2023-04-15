<template><div><p>小程序官方平台和工具里，其实有很多很好用的能力，你都了解吗？</p>
<!--more-->
<h1 id="小程序管理后台" tabindex="-1"><a class="header-anchor" href="#小程序管理后台" aria-hidden="true">#</a> 小程序管理后台</h1>
<p>微信公众平台里，其实藏着一些好用的能力，一起来看看把。</p>
<h2 id="问题定位辅助" tabindex="-1"><a class="header-anchor" href="#问题定位辅助" aria-hidden="true">#</a> 问题定位辅助</h2>
<h3 id="运维中心" tabindex="-1"><a class="header-anchor" href="#运维中心" aria-hidden="true">#</a> 运维中心</h3>
<p>在小程序管理后台，【开发】-【运维中心】里，可以有以下能力：</p>
<ul>
<li><strong>错误查询</strong>: 可以查到所有小程序运行错误的记录。</li>
<li><strong>性能监控</strong>: 可以监控小程序运行的性能，包括不同时间段的<code v-pre>启动耗时</code>、<code v-pre>下载耗时</code>、<code v-pre>初次渲染耗时</code>等。</li>
<li><strong>告警设置</strong>: 错误告警通过微信群来通知，每个小程序对应唯一的告警群，扫码加入后即可接收告警通知。</li>
</ul>
<blockquote>
<p>微信 7.0 以后：</p>
</blockquote>
<ol>
<li>如果使用工具压缩和编译代码，会自动带上 sourcemap ，运维中心的错误会显示原来文件名字和行号</li>
<li>如果使用第三方框架，在代码中内敛 sourcemap 或者有同名 sourcemap 文件存在，工具会自动合并和解析，从而做到错误会显示原来文件名字和行号。</li>
</ol>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1547096780.jpg" alt="运维中心界面"></p>
<h3 id="日志管理" tabindex="-1"><a class="header-anchor" href="#日志管理" aria-hidden="true">#</a> 日志管理</h3>
<ol>
<li>开发中日志打印，使用日志管理器实例<code v-pre>LogManager</code>。使用方式查看<a href="https://developers.weixin.qq.com/miniprogram/dev/api/LogManager.html" target="_blank" rel="noopener noreferrer">API - LogManager<ExternalLinkIcon/></a>。</li>
<li>用户在使用过程中，可以在小程序的 profile 页面，点击【投诉与反馈】-【功能异常】-【勾选上传日志】，则可以上传日志。</li>
</ol>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1547097426.png" alt="这里需要勾上才会上传"></p>
<ol start="3">
<li>在小程序管理后台，【管理】-【反馈管理】，就可以查看上传的日志。</li>
</ol>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1547097350.jpg" alt="这里可以下载日志"></p>
<h3 id="运营数据" tabindex="-1"><a class="header-anchor" href="#运营数据" aria-hidden="true">#</a> 运营数据</h3>
<p>有两种方式可以方便的看到小程序的<a href="https://developers.weixin.qq.com/miniprogram/dev/quickstart/basic/release.html#%E8%BF%90%E8%90%A5%E6%95%B0%E6%8D%AE" target="_blank" rel="noopener noreferrer">运营数据<ExternalLinkIcon/></a>：</p>
<ol>
<li>在小程序管理后台，【统计】，可以看到常规分析（概况、访问分析、来源分析、用户画像）与自定义分析，点击相应的 tab 可以看到相关的数据。</li>
<li>使用小程序数据助手，在微信中方便的查看运营数据。</li>
</ol>
<p><strong>常规分析（不需要配置或开发）</strong></p>
<blockquote>
<p>参考文档: <a href="https://developers.weixin.qq.com/miniprogram/analysis/regular/" target="_blank" rel="noopener noreferrer">常规分析<ExternalLinkIcon/></a></p>
</blockquote>
<ul>
<li>概况：提供小程序关键指标趋势以及 top 页面访问数据，快速了解小程序发展概况；</li>
<li>访问分析：提供小程序用户访问规模、来源、频次、时长、深度、留存以及页面详情等数据，具体分析用户新增、活跃和留存情况；</li>
<li>实时统计：提供小程序实时访问数据，满足实时监控需求；</li>
<li>用户画像：提供小程序的用户画像数据，包括用户年龄、性别、地区、终端及机型分布。</li>
</ul>
<p>似乎晒点图会更加直观：
<img src="https://developers.weixin.qq.com/miniprogram/analysis/image/weanalytics/2_1.png?t=19010912" alt="昨日概况">
<img src="https://developers.weixin.qq.com/miniprogram/analysis/image/weanalytics/4_2.png?t=19010912" alt="访问分布">
<img src="https://developers.weixin.qq.com/miniprogram/analysis/image/weanalytics/6_4.png?t=19010912" alt="终端及机型分布"></p>
<p><strong>自定义分析（需自行配置和开发）</strong></p>
<blockquote>
<p>参考文档: <a href="https://developers.weixin.qq.com/miniprogram/analysis/custom/" target="_blank" rel="noopener noreferrer">自定义分析<ExternalLinkIcon/></a></p>
</blockquote>
<p>配置自定义上报，精细跟踪用户在小程序内的行为，结合用户属性、系统属性、事件属性进行灵活多维的事件分析和漏斗分析，满足小程序的个性化分析需求。</p>
<p>同样，晒点官方图：
<img src="https://developers.weixin.qq.com/miniprogram/analysis/image/weanalytics/5_14.png?t=19010912" alt="">
<img src="https://developers.weixin.qq.com/miniprogram/analysis/image/weanalytics/5_21.png?t=19010912" alt=""></p>
<h2 id="第三方能力" tabindex="-1"><a class="header-anchor" href="#第三方能力" aria-hidden="true">#</a> 第三方能力</h2>
<h3 id="tgit-代码托管" tabindex="-1"><a class="header-anchor" href="#tgit-代码托管" aria-hidden="true">#</a> TGit 代码托管</h3>
<p><strong>重要 Tips: TGit 能力即将会升级为 git.weixin.qq.com，将全量免费提供给微信的开发者，期待最新消息！~</strong></p>
<p>更多详情，可以参考<a href="https://developers.weixin.qq.com/miniprogram/dev/qcloud/tgit.html" target="_blank" rel="noopener noreferrer">TGit 开通及配置流程<ExternalLinkIcon/></a>。</p>
<h1 id="小程序开发工具" tabindex="-1"><a class="header-anchor" href="#小程序开发工具" aria-hidden="true">#</a> 小程序开发工具</h1>
<h2 id="调试" tabindex="-1"><a class="header-anchor" href="#调试" aria-hidden="true">#</a> 调试</h2>
<h3 id="真机调试" tabindex="-1"><a class="header-anchor" href="#真机调试" aria-hidden="true">#</a> 真机调试</h3>
<blockquote>
<p>参考文档：<a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/remote-debug.html" target="_blank" rel="noopener noreferrer">真机调试<ExternalLinkIcon/></a></p>
</blockquote>
<p>我们经常会遇到小程序开发工具没有问题，但是真机上跑的时候就出翔了，或者某些 UI 歪掉了，这时候真机调试就显得特别方便啦~
真机远程调试功能可以实现直接利用开发者工具，通过网络连接，对手机上运行的小程序进行调试，帮助开发者更好的定位和查找在手机上出现的问题。</p>
<p><strong>使用方式</strong>：
点击开发者工具的工具栏上 “远程调试” 按钮。</p>
<p><strong>实用能力</strong>：</p>
<ul>
<li>调试：断点、单步调试，可在 console 里调试<code v-pre>wx.***</code>能力</li>
<li>查看和 debug 请求</li>
<li>查看 UI 布局和样式（定位奇葩的手机兼容的时候，特别好用）</li>
</ul>
<p><img src="https://developers.weixin.qq.com/miniprogram/dev/devtools/image/devtools2/remote-debug/iphone.jpg?t=19011013" alt="使用效果"></p>
<h2 id="构建" tabindex="-1"><a class="header-anchor" href="#构建" aria-hidden="true">#</a> 构建</h2>
<h3 id="npm-支持" tabindex="-1"><a class="header-anchor" href="#npm-支持" aria-hidden="true">#</a> npm 支持</h3>
<blockquote>
<p>参考文档：<a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html" target="_blank" rel="noopener noreferrer">npm 支持<ExternalLinkIcon/></a></p>
</blockquote>
<p>小程序基础库版本<code v-pre>2.2.1</code>开始，就支持 npm 构建啦。</p>
<ol>
<li>安装 npm 依赖。</li>
<li>点击开发者工具中的菜单栏：【工具】-【构建 npm】，就可以啦。</li>
</ol>
<h3 id="自定义预处理" tabindex="-1"><a class="header-anchor" href="#自定义预处理" aria-hidden="true">#</a> 自定义预处理</h3>
<p>通过自定义预处理，我们可以设置在上传代码之前，做一些什么操作，例如跑测试、编译构建等。可以通过<code v-pre>project.config.json</code>中的<code v-pre>scripts</code>来配置：</p>
<ul>
<li><code v-pre>beforeCompile</code>: 编译前预处理命令</li>
<li><code v-pre>beforePreview</code>: 预览前预处理命令</li>
<li><code v-pre>beforeUpload</code>: 上传前预处理命令</li>
</ul>
<h2 id="测试体验" tabindex="-1"><a class="header-anchor" href="#测试体验" aria-hidden="true">#</a> 测试体验</h2>
<h3 id="小程序开发助手" tabindex="-1"><a class="header-anchor" href="#小程序开发助手" aria-hidden="true">#</a> 小程序开发助手</h3>
<blockquote>
<p>参考文档：<a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/mydev.html" target="_blank" rel="noopener noreferrer">小程序开发助手<ExternalLinkIcon/></a></p>
</blockquote>
<p>微信公众平台发布的官方小程序，帮助开发和运营人员在手机端更方便快捷地查看和预览小程序。
有权限的项目成员，可以直接点击体验任何一个需要测试或体验的版本，而不需要二维码的口口相传。</p>
<p><strong>最新消息：小程序开发助手已经升级为小程序助手了，在移动端可以管理版本了~</strong></p>
<h3 id="体验评分" tabindex="-1"><a class="header-anchor" href="#体验评分" aria-hidden="true">#</a> 体验评分</h3>
<blockquote>
<p>参考文档：<a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/audits.html" target="_blank" rel="noopener noreferrer">体验评分<ExternalLinkIcon/></a></p>
</blockquote>
<p>体验评分是一项给小程序的体验好坏打分的功能，它会在小程序运行过程中实时检查，分析出一些可能导致体验不好的地方，并且定位出哪里有问题，以及给出一些优化建议。
<img src="https://developers.weixin.qq.com/miniprogram/dev/devtools/image/devtools/audits.png?t=19010919" alt="体验评分效果">
<strong>手动启动：</strong></p>
<ol>
<li>在调试器区域切换到 Audits 面板。</li>
<li>点击左上角”开始“按钮，然后自行操作小程序界面，运行过的页面就会被“体验评分”检测到。</li>
<li>点击 “Stop&quot; 停止分析，就会看到一份分析报告，之后便可根据分析报告进行相关优化。</li>
</ol>
<p><strong>自动运行（实时检查）：</strong>
开发者在工具的右上角 “详情” 面板里勾选 “自动运行体验评分” 选项即可开启。</p>
<h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2>
<ul>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/debug.html" target="_blank" rel="noopener noreferrer">小程序调试<ExternalLinkIcon/></a></li>
</ul>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>很多时候，我们觉得小程序的开发和调试总是有哪里不满意，但其实官方在很认真地完善各个环节，不过他们比较低调，很多能力我们都没有用上。
很多 web 开发写小程序，都喜欢用像 mpvue、wepy 这些框架。不用去了解小程序的运行机制、底层原理，其实也很方便。不过作为一个细腻的开发，其实了解一下也能发现小程序它棒在哪里了。</p>
</div></template>


