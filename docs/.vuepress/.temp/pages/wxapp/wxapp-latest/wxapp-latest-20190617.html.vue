<template><div><p>太可惜了这个月啥都没有~~</p>
<!--more-->
<h1 id="小程序-latest" tabindex="-1"><a class="header-anchor" href="#小程序-latest" aria-hidden="true">#</a> 小程序 latest</h1>
<h2 id="小程序能力" tabindex="-1"><a class="header-anchor" href="#小程序能力" aria-hidden="true">#</a> 小程序能力</h2>
<h3 id="「2-7-1-版本基础库」新增功能" tabindex="-1"><a class="header-anchor" href="#「2-7-1-版本基础库」新增功能" aria-hidden="true">#</a> 「2.7.1 版本基础库」新增功能</h3>
<ul>
<li>新增云开发 Network 面板，<a href="https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/debug.html" target="_blank" rel="noopener noreferrer">详情<ExternalLinkIcon/></a></li>
<li>更新组件 cover-view 开发者工具支持</li>
<li>其他社区反馈问题修复</li>
</ul>
<p>更多 2.7.1 版本基础库的新能力及详情，可查看<a href="https://developers.weixin.qq.com/miniprogram/dev/framework/release/" target="_blank" rel="noopener noreferrer">《基础库更新日志》<ExternalLinkIcon/></a>。</p>
<h3 id="「微信开放社区」上线帖子相关问题能力" tabindex="-1"><a class="header-anchor" href="#「微信开放社区」上线帖子相关问题能力" aria-hidden="true">#</a> 「微信开放社区」上线帖子相关问题能力</h3>
<p><img src="http://km.oa.com/files/photos/pictures//20190617//1560737512_91.png" alt="帖子相关"></p>
<h3 id="更新日志" tabindex="-1"><a class="header-anchor" href="#更新日志" aria-hidden="true">#</a> 更新日志</h3>
<ul>
<li><a href="https://developers.weixin.qq.com/community/develop/doc/00048cfe698378e701b86d72c56c01" target="_blank" rel="noopener noreferrer">社区问题反馈以及功能优化更新（06.03-06.06）<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/doc/000e00bc1d81e051aca8b759f56401" target="_blank" rel="noopener noreferrer">社区问题反馈以及功能优化更新（05.27-05.31）<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/doc/0002e212b94b58861ba81bbda56801" target="_blank" rel="noopener noreferrer">社区问题反馈以及功能优化更新（05.20-05.24）<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/doc/00000ec37743f0906a98518df51801" target="_blank" rel="noopener noreferrer">社区问题反馈以及功能优化更新（05.13-05.17）<ExternalLinkIcon/></a></li>
</ul>
<h1 id="小程序教程" tabindex="-1"><a class="header-anchor" href="#小程序教程" aria-hidden="true">#</a> 小程序教程</h1>
<h2 id="社区精选文章" tabindex="-1"><a class="header-anchor" href="#社区精选文章" aria-hidden="true">#</a> 社区精选文章</h2>
<ul>
<li><a href="https://developers.weixin.qq.com/community/develop/article/doc/0000c42fea0668ff36b80d20451813" target="_blank" rel="noopener noreferrer">小程序开发另类小技巧 --用户授权篇<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/article/doc/0008a4c4f28f30fe3eb863b2750813" target="_blank" rel="noopener noreferrer">浅谈小程序运行机制<ExternalLinkIcon/></a></li>
</ul>
<p>更多可以查看<a href="https://developers.weixin.qq.com/community/develop/article" target="_blank" rel="noopener noreferrer">文章分享<ExternalLinkIcon/></a>。</p>
<h2 id="最新踩坑-tips" tabindex="-1"><a class="header-anchor" href="#最新踩坑-tips" aria-hidden="true">#</a> 最新踩坑 &amp;&amp; Tips</h2>
<ol>
<li>Promise.then 有些情况下不被调用。查了一下基础库的 bug 历史，以前确实有发现过部分 iOS 系统版本上原生 Promise then 不触发的情况，具体触发条件不明。建议考虑自己打个 polyfill 试试。</li>
</ol>
<blockquote>
<p>可以写段检测 Promise 是否生效的逻辑，然后考虑兜底兼容例如降级到 H5 之类的...</p>
</blockquote>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>看起来这个月踩坑不多，为啥还是那么忙呢？</p>
</div></template>


