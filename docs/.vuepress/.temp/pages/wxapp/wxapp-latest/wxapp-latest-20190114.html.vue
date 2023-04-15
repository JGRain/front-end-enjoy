<template><div><p>小程序的一些能力更新、踩坑历史、以及一些开源工具库和框架的推荐记录第一弹。</p>
<!--more-->
<h1 id="小程序-latest" tabindex="-1"><a class="header-anchor" href="#小程序-latest" aria-hidden="true">#</a> 小程序 latest</h1>
<h2 id="开发者工具" tabindex="-1"><a class="header-anchor" href="#开发者工具" aria-hidden="true">#</a> 开发者工具</h2>
<ul>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/settings.html" target="_blank" rel="noopener noreferrer">新增黑色主题<ExternalLinkIcon/></a></li>
<li><a href="https://developers.weixin.qq.com/miniprogram/dev/devtools/edit.html#typescript-%E6%94%AF%E6%8C%81" target="_blank" rel="noopener noreferrer">支持 Typescript<ExternalLinkIcon/></a></li>
</ul>
<h1 id="小程序教程" tabindex="-1"><a class="header-anchor" href="#小程序教程" aria-hidden="true">#</a> 小程序教程</h1>
<h2 id="使用-tips" tabindex="-1"><a class="header-anchor" href="#使用-tips" aria-hidden="true">#</a> 使用 Tips</h2>
<ul>
<li><RouterLink to="/wxapp-technique/wxapp-official-functions.html">超实用小程序官方能力</RouterLink></li>
</ul>
<blockquote>
<p>目前来说，大多数是我自己的文章，也非常欢迎大家推荐文章来~</p>
</blockquote>
<h2 id="最新踩坑-tips" tabindex="-1"><a class="header-anchor" href="#最新踩坑-tips" aria-hidden="true">#</a> 最新踩坑 Tips</h2>
<ol>
<li>
<p>调试小程序时，有些请求例如上传文件请求，无法再控制台里查看到完整的请求信息。
解决办法：小程序开发工具可以设置网络代理，转发到抓包工具例如 Charles 中即可。</p>
</li>
<li>
<p>在原生页跳转进入小程序场景下（仿原生，没有关闭和后退按钮），有没有内部能力从小程序返回到原生页？
可使用<a href="https://developers.weixin.qq.com/miniprogram/dev/api/wx.navigateBackMiniProgram.html?search-key=navigateBackMiniProgram" target="_blank" rel="noopener noreferrer">navigateBackMiniProgram<ExternalLinkIcon/></a>返回到上一个小程序。只有在当前小程序是被其他小程序打开时可以调用成功</p>
<blockquote>
<p>虽然写的是返回小程序，但是他就是可以用。算是实现的有 bug，目前测试没遇到过不行的情况。
iOS 仿原生点了是切后台，安卓仿原生是关闭，这个无解。
想安心一点就用<code v-pre>&lt;navigator target=&quot;miniProgram&quot; open-type=&quot;exit&quot;&gt;</code>，版本比较高</p>
</blockquote>
</li>
<li>
<p>小程序右上角的关闭按钮，只是将小程序切换到后台并不会关闭小程序。若需要重新加载，需要在微信首页下拉删掉使用过的小程序；另从后台唤醒时，会触发<code v-pre>onShow</code>而不是<code v-pre>onLoad</code>。</p>
</li>
<li>
<p>如果用户通过微信首页下拉删掉使用过的小程序，那么小程序代码里面通过 localStorage 保存的缓存信息以及通过文件管理器保存的文件都会被清掉。</p>
</li>
<li>
<p>小程序工具上传代码，勾选 ES6 转 ES5，只会针对 ES6 进行编译，对 ES7/ES8 代码并不会编译，可能导致兼容性问题（如<code v-pre>Object.values</code>）。
节后工具会上线一个 ES6+ 转 ES5 的能力，一站式全部处理掉。</p>
</li>
</ol>
<blockquote>
<p>后续踩坑相关的，可能会整理到一个地方一起沉淀吧~~~</p>
</blockquote>
<h1 id="tools" tabindex="-1"><a class="header-anchor" href="#tools" aria-hidden="true">#</a> tools</h1>
<h2 id="框架" tabindex="-1"><a class="header-anchor" href="#框架" aria-hidden="true">#</a> 框架</h2>
<blockquote>
<p>Tips 仅供参考: 小程序开发本身就比较方便，个人感觉最好的方式建议直接使用原生开发噢</p>
</blockquote>
<h3 id="wepy" tabindex="-1"><a class="header-anchor" href="#wepy" aria-hidden="true">#</a> wepy</h3>
<ul>
<li>Github: <a href="https://github.com/Tencent/wepy" target="_blank" rel="noopener noreferrer">https://github.com/Tencent/wepy<ExternalLinkIcon/></a></li>
</ul>
<h3 id="mpvue" tabindex="-1"><a class="header-anchor" href="#mpvue" aria-hidden="true">#</a> mpvue</h3>
<ul>
<li>Github: <a href="https://github.com/mpvue" target="_blank" rel="noopener noreferrer">https://github.com/mpvue<ExternalLinkIcon/></a></li>
</ul>
<h2 id="工具" tabindex="-1"><a class="header-anchor" href="#工具" aria-hidden="true">#</a> 工具</h2>
<h3 id="werequest" tabindex="-1"><a class="header-anchor" href="#werequest" aria-hidden="true">#</a> weRequest</h3>
<p>解决繁琐的小程序会话管理，一款自带登录态管理的网络请求组件：</p>
<ul>
<li>
<p>session 登录态管理（静默续期）</p>
</li>
<li>
<p>cache 请求缓存能力</p>
</li>
<li>
<p>封装请求测速能力</p>
</li>
<li>
<p>Github: <a href="https://github.com/IvinWu/weRequest" target="_blank" rel="noopener noreferrer">https://github.com/IvinWu/weRequest<ExternalLinkIcon/></a></p>
</li>
</ul>
<h3 id="we-cropper" tabindex="-1"><a class="header-anchor" href="#we-cropper" aria-hidden="true">#</a> we-cropper</h3>
<p>微信小程序图片裁剪工具。</p>
<ul>
<li>Github: <a href="https://github.com/we-plugin/we-cropper" target="_blank" rel="noopener noreferrer">https://github.com/we-plugin/we-cropper<ExternalLinkIcon/></a></li>
</ul>
<h3 id="westore" tabindex="-1"><a class="header-anchor" href="#westore" aria-hidden="true">#</a> westore</h3>
<p>微信小程序状态管理解决方案</p>
<ul>
<li>Github: <a href="https://github.com/Tencent/westore" target="_blank" rel="noopener noreferrer">https://github.com/Tencent/westore<ExternalLinkIcon/></a></li>
</ul>
<blockquote>
<p>Tips: store 为全局状态，不同组件或页面需要注意数据隔离</p>
</blockquote>
<h2 id="图表" tabindex="-1"><a class="header-anchor" href="#图表" aria-hidden="true">#</a> 图表</h2>
<h3 id="echarts-for-weixin" tabindex="-1"><a class="header-anchor" href="#echarts-for-weixin" aria-hidden="true">#</a> echarts-for-weixin</h3>
<p>ECharts 的微信小程序版本</p>
<ul>
<li>Github: <a href="https://github.com/ecomfe/echarts-for-weixin" target="_blank" rel="noopener noreferrer">https://github.com/ecomfe/echarts-for-weixin<ExternalLinkIcon/></a></li>
</ul>
<blockquote>
<p>注意：移动端中使用 ECharts，折线图的点击事件体验会很差</p>
</blockquote>
<h3 id="wx-f2" tabindex="-1"><a class="header-anchor" href="#wx-f2" aria-hidden="true">#</a> wx-f2</h3>
<p>F2 的微信小程序图表示例</p>
<ul>
<li>Github: <a href="https://github.com/antvis/wx-f2" target="_blank" rel="noopener noreferrer">https://github.com/antvis/wx-f2<ExternalLinkIcon/></a></li>
</ul>
<h3 id="wx-charts" tabindex="-1"><a class="header-anchor" href="#wx-charts" aria-hidden="true">#</a> wx-charts</h3>
<p>微信小程序图表 charts 组件</p>
<ul>
<li>Github: <a href="https://github.com/xiaolin3303/wx-charts" target="_blank" rel="noopener noreferrer">https://github.com/xiaolin3303/wx-charts<ExternalLinkIcon/></a></li>
</ul>
<blockquote>
<p>该图表组件已没有维护，但是源码比较简单清晰，可自定义修改</p>
</blockquote>
<h2 id="ui-库" tabindex="-1"><a class="header-anchor" href="#ui-库" aria-hidden="true">#</a> UI 库</h2>
<h3 id="weui-小程序" tabindex="-1"><a class="header-anchor" href="#weui-小程序" aria-hidden="true">#</a> weui-小程序</h3>
<ul>
<li>Github: <a href="https://github.com/Tencent/weui-wxss" target="_blank" rel="noopener noreferrer">https://github.com/Tencent/weui-wxss<ExternalLinkIcon/></a></li>
</ul>
<h3 id="wux-weapp" tabindex="-1"><a class="header-anchor" href="#wux-weapp" aria-hidden="true">#</a> wux-weapp</h3>
<ul>
<li>Github: <a href="https://github.com/wux-weapp/wux-weapp" target="_blank" rel="noopener noreferrer">https://github.com/wux-weapp/wux-weapp<ExternalLinkIcon/></a></li>
</ul>
<blockquote>
<p>Tips: 表单相关的 input/textarea 稍微有毒，其他暂可正常使用</p>
</blockquote>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>本期作为第一期，所以把目前的一些工具库和文章沉淀一并发出，大家如果有很好的文章、工具推荐，可以一起留言讨论和推荐。</p>
</div></template>


