<template><div><p>项目中需要搭建一个多页面的环境，包括本地路由服务和分页面打包。本节实现单个页面或是完整页面的打包过程的过程。</p>
<!--more-->
<h1 id="打包实现" tabindex="-1"><a class="header-anchor" href="#打包实现" aria-hidden="true">#</a> 打包实现</h1>
<h2 id="逻辑思路" tabindex="-1"><a class="header-anchor" href="#逻辑思路" aria-hidden="true">#</a> 逻辑思路</h2>
<p>我们规划最终打包能实现的效果：</p>
<ol>
<li>可输入目录名，来只打包对应的页面。</li>
<li>不输入目录名的时候，则将全部页面重新打包。</li>
</ol>
<p>如：
输入<code v-pre>npm run build page1</code>时，打包<code v-pre>page1</code>页面。
输入<code v-pre>npm run build page1 page2</code>时，打包<code v-pre>page1</code>和<code v-pre>page2</code>页面。
输入<code v-pre>npm run build</code>时，打包所有<code v-pre>page</code>页面。</p>
<p>这里我们可以通过<code v-pre>process.argv</code>获取命令行参数。</p>
<p>同时我们需要针对每个页面单独打包，这里我们将多个页面拆分成多个并行的任务，每个任务需要设置以下内容：</p>
<ul>
<li><code v-pre>entry</code>：设置单个页面入口</li>
<li><code v-pre>output.path</code>：设置最终生成文件目录</li>
<li><code v-pre>plugins</code>：设置打包后<code v-pre>index.html</code>，这里我们使用相同的模板</li>
</ul>
<h2 id="代码实现" tabindex="-1"><a class="header-anchor" href="#代码实现" aria-hidden="true">#</a> 代码实现</h2>
<p>我们的页面打包代码放置在<code v-pre>build</code>文件夹下的<code v-pre>build.js</code>，则我们的<code v-pre>package.json</code>中的<code v-pre>script</code>：</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"build"</span><span class="token operator">:</span> <span class="token string">"node build/build.js"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样，我们的<code v-pre>process.argv</code>前两个参数分别是<code v-pre>node</code>和<code v-pre>build/build.js</code>，故我们需要先去掉前面两个参数，才能获取剩余页面参数。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> ora <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"ora"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> rm <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"rimraf"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> path <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"path"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> utils <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"./utils"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> chalk <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"chalk"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> webpack <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"webpack"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> webpackConfig <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"./webpack.config"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> HtmlWebpackPlugin <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"html-webpack-plugin"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">var</span> entries <span class="token operator">=</span> utils<span class="token punctuation">.</span>entries<span class="token punctuation">;</span>
<span class="token keyword">var</span> pageArray<span class="token punctuation">;</span>

<span class="token comment">// 取掉前两个参数，分别为node和build</span>
process<span class="token punctuation">.</span>argv<span class="token punctuation">.</span><span class="token function">splice</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">if</span> <span class="token punctuation">(</span>process<span class="token punctuation">.</span>argv<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 若传入页面参数，则单页面打包</span>
  pageArray <span class="token operator">=</span> process<span class="token punctuation">.</span>argv<span class="token punctuation">;</span>
<span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
  <span class="token comment">// 若无传入页面参数，则全块打包</span>
  pageArray <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">keys</span><span class="token punctuation">(</span>entries<span class="token punctuation">)</span><span class="token punctuation">;</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>pageArray<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 开始输出loading状态</span>
<span class="token keyword">var</span> spinner <span class="token operator">=</span> <span class="token function">ora</span><span class="token punctuation">(</span><span class="token string">"building for production...\n"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
spinner<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

pageArray<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">val<span class="token punctuation">,</span> index<span class="token punctuation">,</span> array</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">rm</span><span class="token punctuation">(</span>path<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">".."</span><span class="token punctuation">,</span> <span class="token string">"dist"</span><span class="token punctuation">,</span> val<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token parameter">err</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token keyword">throw</span> err<span class="token punctuation">;</span>
    <span class="token comment">// print pageName[]</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>index <span class="token operator">+</span> <span class="token string">": "</span> <span class="token operator">+</span> val<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 输出目录dist/pageName</span>
    webpackConfig<span class="token punctuation">.</span>output<span class="token punctuation">.</span>path <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">".."</span><span class="token punctuation">,</span> <span class="token string">"dist"</span><span class="token punctuation">,</span> val<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 入口文件设定为指定页面的入口文件</span>
    <span class="token comment">// main.js这里为通用入口文件</span>
    webpackConfig<span class="token punctuation">.</span>entry <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
    webpackConfig<span class="token punctuation">.</span>entry<span class="token punctuation">[</span>index<span class="token punctuation">]</span> <span class="token operator">=</span> path<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span>
      __dirname<span class="token punctuation">,</span>
      <span class="token string">".."</span><span class="token punctuation">,</span>
      <span class="token string">"src"</span><span class="token punctuation">,</span>
      val<span class="token punctuation">,</span>
      <span class="token string">"main.js"</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 添加index.html主文件</span>
    webpackConfig<span class="token punctuation">.</span>plugins <span class="token operator">=</span> <span class="token punctuation">[</span>
      <span class="token keyword">new</span> <span class="token class-name">HtmlWebpackPlugin</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        <span class="token comment">// 生成出来的html文件名</span>
        <span class="token literal-property property">filename</span><span class="token operator">:</span> <span class="token string">"index.html"</span><span class="token punctuation">,</span>
        <span class="token comment">// 每个html的模版，这里多个页面使用同一个模版</span>
        <span class="token literal-property property">template</span><span class="token operator">:</span> <span class="token string">"./index.html"</span><span class="token punctuation">,</span>
        <span class="token comment">// 或使用单独的模版</span>
        <span class="token comment">// template: './src/' + val + '/index.html',</span>
        <span class="token comment">// 自动将引用插入html</span>
        <span class="token literal-property property">inject</span><span class="token operator">:</span> <span class="token boolean">true</span>
        <span class="token comment">// 每个html引用的js模块，也可以在这里加上vendor等公用模块</span>
        <span class="token comment">// chunks: [name]</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token comment">// 开启打包</span>
    <span class="token function">webpack</span><span class="token punctuation">(</span>webpackConfig<span class="token punctuation">,</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">err<span class="token punctuation">,</span> stats</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      spinner<span class="token punctuation">.</span><span class="token function">stop</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token comment">// 输出错误信息</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>err<span class="token punctuation">)</span> <span class="token keyword">throw</span> err<span class="token punctuation">;</span>

      <span class="token comment">// 输出打包完成信息</span>
      process<span class="token punctuation">.</span>stdout<span class="token punctuation">.</span><span class="token function">write</span><span class="token punctuation">(</span>
        stats<span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
          <span class="token literal-property property">colors</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
          <span class="token literal-property property">modules</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
          <span class="token literal-property property">children</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
          <span class="token literal-property property">chunks</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
          <span class="token literal-property property">chunkModules</span><span class="token operator">:</span> <span class="token boolean">false</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"\n\n"</span>
      <span class="token punctuation">)</span><span class="token punctuation">;</span>

      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>chalk<span class="token punctuation">.</span><span class="token function">cyan</span><span class="token punctuation">(</span><span class="token string">"  Build complete.\n"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>
        chalk<span class="token punctuation">.</span><span class="token function">yellow</span><span class="token punctuation">(</span>
          <span class="token string">"  Tip: built files are meant to be served over an HTTP server.\n"</span> <span class="token operator">+</span>
            <span class="token string">"  Opening index.html over file:// won't work.\n"</span>
        <span class="token punctuation">)</span>
      <span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h1>
<p>这里简单实现了打包逻辑，我们可以指定页面打包，也可以整项目分页面分块打包。这里还缺一些错误信息，后面我们还需要完善错误提示呢。<br>
可参考代码<a href="https://github.com/godbasin/vue-multi-pages/blob/master/build/dev-server.js" target="_blank" rel="noopener noreferrer">github-vue-multi-pages<ExternalLinkIcon/></a>，主要是这套环境使用在 vue 上的 demo。</p>
</div></template>


