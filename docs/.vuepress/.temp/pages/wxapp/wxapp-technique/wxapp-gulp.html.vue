<template><div><p>虽然 webpack 用的比较多，不过在小程序这种场景下，简单的 gulp 也是个不错的选择吧~</p>
<p>最新消息：<strong>官方已经出了小程序 vue 多端（目前支持微信小程序+web）方案，已经在我们“微信开放社区”的小程序和 web 落地。</strong></p>
<p>有想要试试的，可以<a href="https://github.com/wechat-miniprogram/kbone" target="_blank" rel="noopener noreferrer">关注一下: kbone<ExternalLinkIcon/></a>。</p>
<!--more-->
<h1 id="gulp-构建小程序" tabindex="-1"><a class="header-anchor" href="#gulp-构建小程序" aria-hidden="true">#</a> gulp 构建小程序</h1>
<h2 id="简单的-copy" tabindex="-1"><a class="header-anchor" href="#简单的-copy" aria-hidden="true">#</a> 简单的 copy</h2>
<p>对小程序来说，除了<code v-pre>app.js</code>作为程序入口之外，每个<code v-pre>page</code>页面都可以作为一个页面入口，更倾向是固定路径模式的多页应用。</p>
<p>最终提交的代码，便是这种结构的代码：</p>
<div class="language-cmd line-numbers-mode" data-ext="cmd"><pre v-pre class="language-cmd"><code>├── app.js
├── app.json
├── app.wxss
├── pages
│   │── index
│   │   ├── index.wxml
│   │   ├── index.js
│   │   ├── index.json
│   │   └── index.wxss
│   └── logs
│       ├── logs.wxml
│       └── logs.js
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以，在编译的过程，很多文件都是需要简单地 copy 到目标目录的。我们定义复制和变动复制的任务：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 待复制的文件，不包含需要编译的文件</span>
<span class="token keyword">var</span> copyPath <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token string">"src/**/!(_)*.*"</span><span class="token punctuation">,</span>
  <span class="token string">"!src/**/*.less"</span><span class="token punctuation">,</span>
  <span class="token string">"!src/**/*.ts"</span><span class="token punctuation">,</span>
  <span class="token string">"!src/img/**"</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token comment">// 复制不包含需要编译的文件，和图片的文件</span>
gulp<span class="token punctuation">.</span><span class="token function">task</span><span class="token punctuation">(</span><span class="token string">"copy"</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> gulp<span class="token punctuation">.</span><span class="token function">src</span><span class="token punctuation">(</span>copyPath<span class="token punctuation">,</span> option<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">pipe</span><span class="token punctuation">(</span>gulp<span class="token punctuation">.</span><span class="token function">dest</span><span class="token punctuation">(</span>dist<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 复制不包含需要编译的文件，和图片的文件(只改动有变动的文件）</span>
gulp<span class="token punctuation">.</span><span class="token function">task</span><span class="token punctuation">(</span><span class="token string">"copyChange"</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> gulp
    <span class="token punctuation">.</span><span class="token function">src</span><span class="token punctuation">(</span>copyPath<span class="token punctuation">,</span> option<span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">pipe</span><span class="token punctuation">(</span><span class="token function">changed</span><span class="token punctuation">(</span>dist<span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">pipe</span><span class="token punctuation">(</span>gulp<span class="token punctuation">.</span><span class="token function">dest</span><span class="token punctuation">(</span>dist<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="文件编译" tabindex="-1"><a class="header-anchor" href="#文件编译" aria-hidden="true">#</a> 文件编译</h2>
<p>我们想要用高级语法，想要写<code v-pre>async/await</code>，想要用<code v-pre>less</code>来写样式，想要用<code v-pre>typescript</code>来写代码，则需要针对每种文件做编译。</p>
<p>这里用<code v-pre>ts</code>来举例：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> ts <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"gulp-typescript"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> tsProject <span class="token operator">=</span> ts<span class="token punctuation">.</span><span class="token function">createProject</span><span class="token punctuation">(</span><span class="token string">"tsconfig.json"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> sourcemaps <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"gulp-sourcemaps"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> tsPath <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">"src/**/*.ts"</span><span class="token punctuation">,</span> <span class="token string">"src/app.ts"</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token comment">// 定义ts文件</span>
<span class="token comment">// 编译</span>
gulp<span class="token punctuation">.</span><span class="token function">task</span><span class="token punctuation">(</span><span class="token string">"tsCompile"</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> tsProject
    <span class="token punctuation">.</span><span class="token function">src</span><span class="token punctuation">(</span>tsPath<span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">pipe</span><span class="token punctuation">(</span>sourcemaps<span class="token punctuation">.</span><span class="token function">init</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span><span class="token function">pipe</span><span class="token punctuation">(</span><span class="token function">tsProject</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token punctuation">.</span>js<span class="token punctuation">.</span><span class="token function">pipe</span><span class="token punctuation">(</span>sourcemaps<span class="token punctuation">.</span><span class="token function">write</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// 添加sourcemap</span>
    <span class="token punctuation">.</span><span class="token function">pipe</span><span class="token punctuation">(</span>gulp<span class="token punctuation">.</span><span class="token function">dest</span><span class="token punctuation">(</span><span class="token string">"dist"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 最终输出到dist目录对应的位置</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当然，用到 typescript 的话，也记得把<code v-pre>tsconfig.json</code>和<code v-pre>tslint.json</code>加上哇。</p>
<h2 id="watch-任务" tabindex="-1"><a class="header-anchor" href="#watch-任务" aria-hidden="true">#</a> watch 任务</h2>
<p>在我们写代码的时候，就需要监听文件变动并自动复制、编译和更新，这时候我们就需要 watch 任务：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">//监听</span>
gulp<span class="token punctuation">.</span><span class="token function">task</span><span class="token punctuation">(</span><span class="token string">"watch"</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  gulp<span class="token punctuation">.</span><span class="token function">watch</span><span class="token punctuation">(</span>tsPath<span class="token punctuation">,</span> gulp<span class="token punctuation">.</span><span class="token function">series</span><span class="token punctuation">(</span><span class="token string">"tsCompile"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// ts编译</span>
  <span class="token keyword">var</span> watcher <span class="token operator">=</span> gulp<span class="token punctuation">.</span><span class="token function">watch</span><span class="token punctuation">(</span>copyPath<span class="token punctuation">,</span> gulp<span class="token punctuation">.</span><span class="token function">series</span><span class="token punctuation">(</span><span class="token string">"copyChange"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 复制任务</span>
  gulp<span class="token punctuation">.</span><span class="token function">watch</span><span class="token punctuation">(</span>watchLessPath<span class="token punctuation">,</span> gulp<span class="token punctuation">.</span><span class="token function">series</span><span class="token punctuation">(</span><span class="token string">"less"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// less处理</span>
  gulp<span class="token punctuation">.</span><span class="token function">watch</span><span class="token punctuation">(</span>imgPath<span class="token punctuation">,</span> gulp<span class="token punctuation">.</span><span class="token function">series</span><span class="token punctuation">(</span><span class="token string">"imgChange"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 图片处理</span>
  watcher<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">"change"</span><span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">event</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 删除的时候，也更新删除任务到目标文件夹</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>event<span class="token punctuation">.</span>type <span class="token operator">===</span> <span class="token string">"deleted"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">var</span> filepath <span class="token operator">=</span> event<span class="token punctuation">.</span>path<span class="token punctuation">;</span>
      <span class="token keyword">var</span> filePathFromSrc <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token function">relative</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span><span class="token string">"src"</span><span class="token punctuation">)</span><span class="token punctuation">,</span> filepath<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// Concatenating the 'build' absolute path used by gulp.dest in the scripts task</span>
      <span class="token keyword">var</span> destFilePath <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span><span class="token string">"dist"</span><span class="token punctuation">,</span> filePathFromSrc<span class="token punctuation">)</span><span class="token punctuation">;</span>
      del<span class="token punctuation">.</span><span class="token function">sync</span><span class="token punctuation">(</span>destFilePath<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="最终任务" tabindex="-1"><a class="header-anchor" href="#最终任务" aria-hidden="true">#</a> 最终任务</h2>
<p>最后，我们需要把这些任务一个个拼起来，最终对外输出两种：<code v-pre>dev</code>和<code v-pre>build</code>一般就够了：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// dev &amp;&amp; watch</span>
gulp<span class="token punctuation">.</span><span class="token function">task</span><span class="token punctuation">(</span>
  <span class="token string">"default"</span><span class="token punctuation">,</span>
  gulp<span class="token punctuation">.</span><span class="token function">series</span><span class="token punctuation">(</span>
    <span class="token comment">// sync</span>
    gulp<span class="token punctuation">.</span><span class="token function">parallel</span><span class="token punctuation">(</span><span class="token string">"copy"</span><span class="token punctuation">,</span> <span class="token string">"img"</span><span class="token punctuation">,</span> <span class="token string">"less"</span><span class="token punctuation">,</span> <span class="token string">"tsCompile"</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token string">"watch"</span>
  <span class="token punctuation">)</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// build</span>
gulp<span class="token punctuation">.</span><span class="token function">task</span><span class="token punctuation">(</span>
  <span class="token string">"build"</span><span class="token punctuation">,</span>
  gulp<span class="token punctuation">.</span><span class="token function">series</span><span class="token punctuation">(</span>
    <span class="token comment">// 串行任务</span>
    <span class="token comment">// sync</span>
    <span class="token string">"clear"</span><span class="token punctuation">,</span>
    gulp<span class="token punctuation">.</span><span class="token function">parallel</span><span class="token punctuation">(</span>
      <span class="token comment">// 并行任务</span>
      <span class="token comment">// async</span>
      <span class="token string">"copy"</span><span class="token punctuation">,</span>
      <span class="token string">"img"</span><span class="token punctuation">,</span>
      <span class="token string">"less"</span><span class="token punctuation">,</span>
      <span class="token string">"tsCompile"</span>
    <span class="token punctuation">)</span>
  <span class="token punctuation">)</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="项目目录结构" tabindex="-1"><a class="header-anchor" href="#项目目录结构" aria-hidden="true">#</a> 项目目录结构</h2>
<div class="language-cmd line-numbers-mode" data-ext="cmd"><pre v-pre class="language-cmd"><code>├─dist                              //编译之后的项目文件（带 sorcemap，支持生产环境告警定位）
├─src                               //开发目录
│  │  app.ts                        //小程序起始文件
│  │  app.json
│  │  app.less
│  │
│  ├─assets                     	//静态资源
│     ├─less						//公共less
│     ├─img						    //图片资源
│  ├─components                     //组件
│  ├─utils                          //工具库
│  ├─config                         //配置文档
│  ├─pages                          //小程序相关页面
│
│  project.config.json              //小程序配置文件
│  gulpfile.js                      //工具配置
│  package.json                     //项目配置
│  README.md                        //项目说明
│  tsconfig.json                    //typescript配置
│  tslint.json                      //代码风格配置
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最终效果，可以参考<a href="https://github.com/godbasin/wxapp-typescript-demo" target="_blank" rel="noopener noreferrer">wxapp-typescript-demo<ExternalLinkIcon/></a>。</p>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>其实小程序也有人出了框架，像 mpvue 和 wepy，开发风格类似 Vue。<br>
不过个人的想法不一样，小程序开发和浏览器开发不一样，小程序官方的 API 会一直不停地进化和完善。如果再使用二次封装的框架，框架是否能跟上小程序 API 的更新节奏，二次封装带来更多的学习成本，这些都需要考虑的。或许有一天，框架的能力优势，最终会被小程序自身取代呢。<br>
而简单的构建任务，却可以很棒地使用到 ES6/ES7、Less、Typescript 这些好用的语法和工具呢。</p>
</div></template>


