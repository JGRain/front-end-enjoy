<template><div><p>这些年也有不少的面试别人和面试自己的经历，也有好些人来咨询一些前端的面试题目和准备，所以整理一下记录下来。本文概括地描述一下，面试过程中前端项目经验相关的问题。</p>
<!--more-->
<p>上一篇我们介绍了前端面试中常见的一些基础专业知识，这些是面试的门槛。那要如何考察面试者的能力呢，通常会从对方的简历下手，询问相关的项目经验。</p>
<h2 id="项目经验" tabindex="-1"><a class="header-anchor" href="#项目经验" aria-hidden="true">#</a> 项目经验</h2>
<p>项目经验通常和个人经历关系比较大，前端业务相关的的一些项目经验通常包括管理端、H5直出、Node.js、可视化，另外还包括参与工具开发的经验，方案选型、架构设计等。</p>
<h3 id="前端框架与工具库" tabindex="-1"><a class="header-anchor" href="#前端框架与工具库" aria-hidden="true">#</a> 前端框架与工具库</h3>
<p>首先我们来看看前端框架，不管你开发管理端、PC Web、H5，还是现在比较流行的小程序，总会面临要使用某一个框架来开发。因此，以下的问题可能与你有关：</p>
<ul>
<li>谈谈你对前端常见的框架（Angular/React/Vue）的理解</li>
<li>该项目使用 Angular/React/Vue 的原因是</li>
<li>如果现在你重新决策，你会使用什么框架</li>
<li>你有了解过这些框架都做了哪些事情，介绍一下是怎么实现的</li>
<li>Vue 中的双向绑定是怎么实现的？</li>
<li>介绍下 Angular 中的依赖注入</li>
<li>讲讲 React 的虚拟 DOM</li>
<li>如何进行状态管理，Vuex/Redux/Mobx 等工具是怎么做的</li>
<li>单页应用是什么？路由是如何实现的</li>
<li>如何进行 SEO 优化</li>
</ul>
<p>如果你使用到了小程序，还可能会问到：</p>
<ul>
<li>小程序和 H5 有什么不一样，为什么选小程序而不是 H5</li>
<li>有考虑在小程序里嵌 H5 实现吗，为什么</li>
<li>为什么小程序的性能要好一些</li>
<li>小程序开发有用到哪些框架吗、为什么</li>
</ul>
<p>而工具库相关的就太多啦，一般会这么问：</p>
<ul>
<li>有实际使用过哪些第三方库</li>
<li>这些工具库有什么特性和优缺点</li>
</ul>
<h3 id="node-js" tabindex="-1"><a class="header-anchor" href="#node-js" aria-hidden="true">#</a> Node.js</h3>
<p>Node.js 相关的可能包括：</p>
<ul>
<li>为什么要用 Node.js（而不是 PHP/JAVA/GO/C++ 等）</li>
<li>Node.js 有哪些特点，单线程的优势和缺点是什么</li>
<li>Node.js 有哪些定时功能</li>
<li>Process.nextTick 和 setImmediate 的区别</li>
<li>Node.js 中的异步和同步怎么理解，异步流程如何控制</li>
<li>简单介绍一下 Node.js 中的核心内置类库(事件，流，文件，网络等)</li>
<li>express 是如何从一个中间件执行到下一个中间件的</li>
<li>express、koa、egg 之间的区别</li>
<li>Rest API 有使用过吗，介绍一下</li>
</ul>
<h3 id="前端工程化" tabindex="-1"><a class="header-anchor" href="#前端工程化" aria-hidden="true">#</a> 前端工程化</h3>
<p>如今前端工程化的趋势越来越重，通常从脚手架开始：</p>
<ul>
<li>为什么我们开发的时候要使用脚手架</li>
<li>如何理解模块化</li>
<li>为什么要使用 Webpack，它和 Gulp 的区别是</li>
<li>讲一下 Webpack 中常用的一些配置、Loader、插件</li>
<li>Babel 的作用是什么，如何选择合适的 Babel 版本</li>
<li>Webpack 是怎么将多个文件打包成一个，依赖问题如何解决</li>
<li>CSS 文件打包过程中，如何避免 CSS 全局污染</li>
<li>本地开发和代码打包的流程分别是怎样的</li>
</ul>
<p>除了脚手架相关，如今自动化、流程化的使用也越来越多了：</p>
<ul>
<li>你们的项目有使用 CI/CD 吗，为什么</li>
<li>你们的代码有写单元测试/自动化测试吗，为什么</li>
</ul>
<h3 id="性能优化" tabindex="-1"><a class="header-anchor" href="#性能优化" aria-hidden="true">#</a> 性能优化</h3>
<p>性能优化的其实跟项目比较相关，常见的包括：</p>
<ul>
<li>常见的性能优化包括哪些内容</li>
<li>如何理解性能瓶颈</li>
<li>图片加载性能有哪些可以优化的地方</li>
<li>要怎么做好代码分割</li>
<li>首屏页面加载很慢，要怎么优化</li>
<li>Tree Shaking 是怎样一个过程</li>
<li>页面有没有做什么柔性降级的处理</li>
</ul>
<h3 id="效能提升" tabindex="-1"><a class="header-anchor" href="#效能提升" aria-hidden="true">#</a> 效能提升</h3>
<p>效能提升的意识在工作中很重要，大家都不喜欢低效的加班。通常可能问到的问题包括：</p>
<ul>
<li>做了很多的管理端/H5，有考虑过怎么提升开发效率吗</li>
<li>你的项目里，有没有哪些工作是可以用工具完成的</li>
<li>项目中有进行组件和公共库的封装吗</li>
<li>如何管理这些公共组件/工具的兼容问题</li>
<li>日常工作中，如何提升自己的工作效率</li>
</ul>
<h3 id="监控与灰度发布" tabindex="-1"><a class="header-anchor" href="#监控与灰度发布" aria-hidden="true">#</a> 监控与灰度发布</h3>
<p>发布和监控这部分，可能较大的业务才会有，涉及的问题可以有:</p>
<ul>
<li>日常开发过程中，怎么保证页面质量</li>
<li>版本发布有进行灰度吗？灰度的过程是怎样的</li>
<li>版本发布过程中，如何及时地发现问题</li>
<li>发生异常，要怎么快速地定位到具体位置</li>
<li>如何观察线上代码的运行质量</li>
</ul>
<h3 id="多人协作" tabindex="-1"><a class="header-anchor" href="#多人协作" aria-hidden="true">#</a> 多人协作</h3>
<p>一些较大的项目，通常由多个开发合作完成。而多人协作的经验也很有帮助：</p>
<ul>
<li>多人开发过程中，代码冲突如何解决</li>
<li>介绍一下 git flow 流程</li>
<li>如果项目频繁交接，如果提升开发效率</li>
<li>有遇到代码习惯差异的问题吗，如何解决</li>
<li>有哪些常用的代码校验的工具</li>
<li>怎么强制进行 Code Review</li>
</ul>
<h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>看到这么多内容不要慌，一般来说面试官只会根据你的工作经历来询问对应的问题，所以如果你并没有完全掌握某一块的内容，请不要写在简历上，你永远也不知道面试官会延伸到哪。</p>
</div></template>


