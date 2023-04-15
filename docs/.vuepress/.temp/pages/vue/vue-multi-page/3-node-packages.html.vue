<template><div><p>最近项目中需要搭建一个多页面的环境，包括本地路由服务和分页面打包。
本节实现单个页面或是完整页面的打包过程的过程。</p>
<!--more-->
<h2 id="npm-模块" tabindex="-1"><a class="header-anchor" href="#npm-模块" aria-hidden="true">#</a> npm 模块</h2>
<p>打包页面需要用到一些 npm 模块（需单独安装），这里我们简单介绍一下。</p>
<h3 id="ora模块" tabindex="-1"><a class="header-anchor" href="#ora模块" aria-hidden="true">#</a> <a href="https://www.npmjs.com/package/ora" target="_blank" rel="noopener noreferrer"><code v-pre>ora</code>模块<ExternalLinkIcon/></a></h3>
<p>主要用来实现<code v-pre>node.js</code>命令行环境的 loading 效果，和显示各种状态的图标等。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">const</span> ora <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"ora"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 开始显示</span>
<span class="token keyword">const</span> spinner <span class="token operator">=</span> <span class="token function">ora</span><span class="token punctuation">(</span><span class="token string">"Loading unicorns"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token comment">// 一秒后设置颜色和内容</span>
  spinner<span class="token punctuation">.</span>color <span class="token operator">=</span> <span class="token string">"yellow"</span><span class="token punctuation">;</span>
  spinner<span class="token punctuation">.</span>text <span class="token operator">=</span> <span class="token string">"Loading rainbows"</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>更多的选项，大家到<a href="https://www.npmjs.com/package/ora" target="_blank" rel="noopener noreferrer">官方说明<ExternalLinkIcon/></a>上面看吧。</p>
<h3 id="rimraf模块" tabindex="-1"><a class="header-anchor" href="#rimraf模块" aria-hidden="true">#</a> <a href="https://www.npmjs.com/package/rimraf" target="_blank" rel="noopener noreferrer"><code v-pre>rimraf</code>模块<ExternalLinkIcon/></a></h3>
<p>实现<code v-pre>node.js</code>环境的 UNIX 命令<code v-pre>rm -rf</code>。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token function">rimraf</span><span class="token punctuation">(</span>f<span class="token punctuation">,</span> <span class="token punctuation">[</span>opts<span class="token punctuation">]</span><span class="token punctuation">,</span> callback<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li><code v-pre>f</code>，可为<code v-pre>glob</code>匹配规则的文件</li>
<li><code v-pre>[opts]</code>，一些选项，具体可参考<a href="https://www.npmjs.com/package/rimraf" target="_blank" rel="noopener noreferrer">官方说明<ExternalLinkIcon/></a></li>
<li><code v-pre>callback</code>，若执行过程中出错，则回调参数为<code v-pre>error</code></li>
</ul>
<p>如果大家用过<code v-pre>shalljs</code>，这是一个<code v-pre>node.js</code>环境的<code v-pre>Unix shell</code>命令，里面当然已经包括<code v-pre>rm</code>命令了。</p>
<h3 id="chalk模块" tabindex="-1"><a class="header-anchor" href="#chalk模块" aria-hidden="true">#</a> <a href="https://www.npmjs.com/package/chalk" target="_blank" rel="noopener noreferrer"><code v-pre>chalk</code>模块<ExternalLinkIcon/></a></h3>
<p>命令行输出各种样式的字符串。</p>
<ul>
<li>使用方式</li>
</ul>
<p><code v-pre>chalk.&lt;style&gt;[.&lt;style&gt;...](string, [string...])</code></p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 例如，红色带下划线的粗体字</span>
chalk<span class="token punctuation">.</span>red<span class="token punctuation">.</span>bold<span class="token punctuation">.</span><span class="token function">underline</span><span class="token punctuation">(</span><span class="token string">"Hello"</span><span class="token punctuation">,</span> <span class="token string">"world"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="node-js-模块" tabindex="-1"><a class="header-anchor" href="#node-js-模块" aria-hidden="true">#</a> node.js 模块</h2>
<p>介绍将使用到的 node.js 自带 API 和内置模块（无需安装）。</p>
<h3 id="path模块" tabindex="-1"><a class="header-anchor" href="#path模块" aria-hidden="true">#</a> <a href="https://nodejs.org/api/path.html" target="_blank" rel="noopener noreferrer"><code v-pre>path</code>模块<ExternalLinkIcon/></a></h3>
<p><code v-pre>path</code>模块提供了一些工具函数，用于处理文件与目录的路径。这是<code v-pre>node.js</code>一个自带的模块。</p>
<p><code v-pre>path</code>模块的默认操作会根据<code v-pre>Node.js</code>应用程序运行的操作系统的不同而变化。比如，当运行在<code v-pre>Windows</code>操作系统上时，<code v-pre>path</code>模块会认为使用的是<code v-pre>Windows</code>风格的路径。</p>
<ul>
<li><code v-pre>path.join([...paths])</code></li>
</ul>
<p>使用平台特定的分隔符把全部给定的<code v-pre>path</code>片段连接到一起，并规范化生成的路径。
这个大概是我们写 webpack 配置的时候，最常用的一个方法啦，像<code v-pre>path.join(__dirname, 'src')</code>。</p>
<ul>
<li><code v-pre>path.parse(path)</code></li>
</ul>
<p>返回一个对象，对象的属性表示<code v-pre>path</code>的元素。返回属性包括：<code v-pre>dir</code>, <code v-pre>root</code>, <code v-pre>base</code>, <code v-pre>name</code>, <code v-pre>ext</code>。</p>
<ul>
<li><code v-pre>path.format(pathObject)</code></li>
</ul>
<p>会从一个对象返回一个路径字符串，与<code v-pre>path.parse()</code>相反。</p>
<ul>
<li><code v-pre>path.dirname(path)</code></li>
</ul>
<p>返回一个<code v-pre>path</code>的目录名，类似于<code v-pre>Unix</code>中的<code v-pre>dirname</code>命令。</p>
<h3 id="process模块" tabindex="-1"><a class="header-anchor" href="#process模块" aria-hidden="true">#</a> <a href="https://nodejs.org/api/process.html" target="_blank" rel="noopener noreferrer"><code v-pre>process</code>模块<ExternalLinkIcon/></a></h3>
<p><code v-pre>process</code>对象是一个<code v-pre>global</code>（全局变量），提供有关信息，控制当前<code v-pre>Node.js</code>进程。
作为一个对象，它对于<code v-pre>Node.js</code>应用程序始终是可用的，故无需使用<code v-pre>require()</code>。</p>
<ul>
<li><code v-pre>process.execPath</code></li>
</ul>
<p>返回启动<code v-pre>Node.js</code>进程的可执行文件所在的绝对路径。</p>
<ul>
<li><code v-pre>process.argv</code></li>
</ul>
<p><code v-pre>process.argv</code>属性返回一个数组，这个数组包含了启动<code v-pre>Node.js</code>进程时的命令行参数。第一个元素为<code v-pre>process.execPath</code>。
如果需要获取<code v-pre>argv[0]</code>的值请参见<code v-pre>process.argv0</code>。第二个元素为当前执行的 JavaScript 文件路径，剩余的元素为其他命令行参数。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 运行以下命令，启动进程：</span>
$ node process<span class="token operator">-</span>args<span class="token punctuation">.</span>js one two<span class="token operator">=</span>three four

<span class="token comment">// 将输出：</span>
<span class="token number">0</span><span class="token operator">:</span> <span class="token operator">/</span>usr<span class="token operator">/</span>local<span class="token operator">/</span>bin<span class="token operator">/</span>node
<span class="token number">1</span><span class="token operator">:</span> <span class="token operator">/</span>Users<span class="token operator">/</span>mjr<span class="token operator">/</span>work<span class="token operator">/</span>node<span class="token operator">/</span>process<span class="token operator">-</span>args<span class="token punctuation">.</span>js
<span class="token number">2</span><span class="token operator">:</span> one
<span class="token number">3</span><span class="token operator">:</span> two<span class="token operator">=</span>three
<span class="token number">4</span><span class="token operator">:</span> four
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>process.env</code></li>
</ul>
<p><code v-pre>process.env</code>属性返回一个包含用户环境信息的对象。
像我们经常看到生产环境<code v-pre>process.env.NODE_ENV = 'production'</code>和开发环境<code v-pre>process.env.NODE_ENV = 'dev'</code>。</p>
<ul>
<li>输入流<code v-pre>process.stdin</code>和输出流<code v-pre>process.stdout</code></li>
</ul>
<p><code v-pre>process</code>还有更多的进程管理相关的方法和参数，大家可以参考<a href="http://nodejs.cn/api/process.html" target="_blank" rel="noopener noreferrer">官方说明<ExternalLinkIcon/></a>。</p>
<h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>本节主要介绍了后面打包页面时会使用到的一些 node.js 内置和依赖模块，包括终端输出样式、命令、<code v-pre>path</code>、<code v-pre>process</code>等。后面一节也会用到来进行页面的打包。<br>
可参考代码<a href="https://github.com/godbasin/vue-multi-pages/blob/master/build/build.js" target="_blank" rel="noopener noreferrer">github-vue-multi-pages<ExternalLinkIcon/></a>，主要是这套环境使用在 vue 上的 demo。</p>
</div></template>


