<template><div><p>听说年后会有更多的能力进入开发状态噢，尤其是云开发的能力，大家期待不~</p>
<!--more-->
<h1 id="小程序-latest" tabindex="-1"><a class="header-anchor" href="#小程序-latest" aria-hidden="true">#</a> 小程序 latest</h1>
<h2 id="小程序能力" tabindex="-1"><a class="header-anchor" href="#小程序能力" aria-hidden="true">#</a> 小程序能力</h2>
<h3 id="「微信开发者·代码管理」功能上线" tabindex="-1"><a class="header-anchor" href="#「微信开发者·代码管理」功能上线" aria-hidden="true">#</a> 「微信开发者·代码管理」功能上线</h3>
<p>之前在<RouterLink to="/wxapp-technique/wxapp-official-functions.html">超实用小程序官方能力</RouterLink>中提到过 TGit 代码托管，现在 TGit 能力已升级为<a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/wechatvcs.html" target="_blank" rel="noopener noreferrer">微信开发者·代码管理<ExternalLinkIcon/></a>。</p>
<h3 id="video-组件同层渲染" tabindex="-1"><a class="header-anchor" href="#video-组件同层渲染" aria-hidden="true">#</a> video 组件同层渲染</h3>
<p>小程序 video 组件的同层渲染目前已经全量了，基础库 2.4.0 以上都支持。</p>
<p><strong>啥是同层渲染？下面是辅助理解：</strong></p>
<ul>
<li><RouterLink to="/wxapp-principle/3-wxapp-set-data.html">小程序系列 4--解剖小程序的 setData</RouterLink></li>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/component/native-component.html" target="_blank" rel="noopener noreferrer">原生组件相关说明<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/doc/000aa28d030f60a3c4183eecb5d801" target="_blank" rel="noopener noreferrer">小程序 video 组件同层渲染公测<ExternalLinkIcon/></a></li>
</ul>
<p>总之，同层渲染是利用黑科技让原生组件的层级和非原生组件一样可控，这样我们开发中最蛋疼的原生组件的样式调试就舒服很多了，拜拜<code v-pre>&lt;cover-view&gt;</code>，拜拜<code v-pre>&lt;cover-image&gt;</code></p>
<blockquote>
<p>其他的原生组件后续都计划支持同层渲染的，敬请期待。</p>
</blockquote>
<h3 id="小程序数据需求征集" tabindex="-1"><a class="header-anchor" href="#小程序数据需求征集" aria-hidden="true">#</a> 小程序数据需求征集</h3>
<p>目前小程序已经开放了小程序访问、分享、添加等基础数据，以及用户画像和交易分析等数据。
如果大家在使用小程序后台统计模块和小程序数据助手时，有一些不满足的数据需求，或者不好的体验？如果大家对数据工具有更好的想法和建议，欢迎大家留言给小程序团队。</p>
<blockquote>
<p>例如，你可以说我想要更详细的加载性能的数据，想要用户行为上报的能力，等等。</p>
</blockquote>
<h3 id="更新日志" tabindex="-1"><a class="header-anchor" href="#更新日志" aria-hidden="true">#</a> 更新日志</h3>
<ul>
<li><a href="https://developers.weixin.qq.com/community/develop/doc/000ae8f2264c6855e718440a95b801" target="_blank" rel="noopener noreferrer">周社区问题反馈以及功能优化更新（02.04-02.08）<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/doc/000c8a1f334310a3ab08a7ab950801" target="_blank" rel="noopener noreferrer">周社区问题反馈以及功能优化更新（01.21-01.25）<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/doc/0006a6e1b50c20cb18081c56d5bc01" target="_blank" rel="noopener noreferrer">周社区问题反馈以及功能优化更新（01.14-01.18）<ExternalLinkIcon/></a></li>
</ul>
<h2 id="开发者工具" tabindex="-1"><a class="header-anchor" href="#开发者工具" aria-hidden="true">#</a> 开发者工具</h2>
<h3 id="更新日志-1" tabindex="-1"><a class="header-anchor" href="#更新日志-1" aria-hidden="true">#</a> 更新日志</h3>
<ul>
<li>修复界面调试样式信息显示不全的问题</li>
<li>修复 app.json usingComponent 没有扩散的问题</li>
<li>修复 长路径的项目无法正常打开的问题</li>
<li>更多请查看<a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/uplog.html" target="_blank" rel="noopener noreferrer">工具日志<ExternalLinkIcon/></a></li>
</ul>
<blockquote>
<p>听说云函数的本地调试能力在开发 ing 了，还有很多能力都会在后面支持到，期待~</p>
</blockquote>
<h1 id="小程序教程" tabindex="-1"><a class="header-anchor" href="#小程序教程" aria-hidden="true">#</a> 小程序教程</h1>
<h2 id="最新踩坑-tips" tabindex="-1"><a class="header-anchor" href="#最新踩坑-tips" aria-hidden="true">#</a> 最新踩坑 Tips</h2>
<ol>
<li>小程序有办法类似于通过条件判断然后调用 e.preventDefault 和 stopPropagation 的方法吗？
暂时不支持，只能通过 wxml 里面用 catch-tap 阻断，但是这个是一定阻断的，不能写条件。</li>
</ol>
<blockquote>
<p>暂时没有更多了，之前用来记录的临时文件忘记保存，重启了电脑丢掉了 233333</p>
</blockquote>
<h1 id="tools" tabindex="-1"><a class="header-anchor" href="#tools" aria-hidden="true">#</a> tools</h1>
<h2 id="框架" tabindex="-1"><a class="header-anchor" href="#框架" aria-hidden="true">#</a> 框架</h2>
<blockquote>
<p>Tips 仅供参考: 小程序开发本身就比较方便，个人感觉最好的方式建议直接使用原生开发噢</p>
</blockquote>
<h3 id="taro" tabindex="-1"><a class="header-anchor" href="#taro" aria-hidden="true">#</a> taro</h3>
<ul>
<li>Github: <a href="https://github.com/NervJS/taro" target="_blank" rel="noopener noreferrer">https://github.com/NervJS/taro<ExternalLinkIcon/></a>
<blockquote>
<p>多端统一开发框架，支持用 React 的开发方式编写一次代码，生成能运行在微信/百度/支付宝/字节跳动小程序、H5、React Native 等的应用。</p>
</blockquote>
</li>
</ul>
<h2 id="工具" tabindex="-1"><a class="header-anchor" href="#工具" aria-hidden="true">#</a> 工具</h2>
<h3 id="crypto-js" tabindex="-1"><a class="header-anchor" href="#crypto-js" aria-hidden="true">#</a> crypto-js</h3>
<p>JS 加解码库，小程序适用。</p>
<ul>
<li>Github: <a href="https://github.com/brix/crypto-js" target="_blank" rel="noopener noreferrer">https://github.com/brix/crypto-js<ExternalLinkIcon/></a></li>
</ul>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>本来计划写双周刊的，最后改成了月刊，因为小程序和开发者工具的更新相对而言会慢一些，不像前端每天都有新框架和新工具库。当然，你也可以手动关注小程序社区来获取最新的 bug 和修复信息~欢迎对月刊内容进行留言讨论和推荐~</p>
</div></template>


