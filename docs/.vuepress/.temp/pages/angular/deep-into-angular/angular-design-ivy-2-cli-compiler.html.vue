<template><div><p>作为“为大型前端项目”而设计的前端框架，Angular 其实有许多值得参考和学习的设计，本系列主要用于研究这些设计和功能的实现原理。本文围绕 Angular 的核心功能 Ivy 编译器，介绍其中CLI层面的编译器编译过程。</p>
<!--more-->
<p>在 Angular 中实现了自己的编译器，来处理 TypeScript 编译器无法完全做到的一些事情。在 Ivy 编译器中，这部分的能力又做了进一步的提升，比如模板类型检查、模块依赖解析等等。</p>
<h2 id="ivy-编译器" tabindex="-1"><a class="header-anchor" href="#ivy-编译器" aria-hidden="true">#</a> Ivy 编译器</h2>
<p>在前面<RouterLink to="/angular/deep-into-angular/angular-design-ivy-0-design.html">9.Ivy 编译器整体设计</RouterLink>一文中，我有介绍 Ivy 编译器主要包括两部分：</p>
<ol>
<li><code v-pre>ngtsc</code>：作为主要的 Ivy 编译器，将 Angular 装饰器化为静态属性。</li>
<li><code v-pre>ngcc</code>：作为兼容性的 Ivy 编译器，主要负责处理来自 NPM 的代码并生成等效的 Ivy 版本。</li>
</ol>
<p>本文将会主要围绕<code v-pre>ngtsc</code>该编译器进行介绍。</p>
<h3 id="angular-中的-ast-解析" tabindex="-1"><a class="header-anchor" href="#angular-中的-ast-解析" aria-hidden="true">#</a> Angular 中的 AST 解析</h3>
<p>要实现 AST 的解析和转换，离不开解析器。对于 Typescript 代码来说，编译器的整体流程为：</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>                                                                |------------|
                           |----------------------------------> | TypeScript |
                           |                                    |   .d.ts    |
                           |                                    |------------|
                           |
|------------|          |-----|               |-----|           |------------|
| TypeScript | -parse-> | AST | ->transform-> | AST | ->print-> | JavaScript |
|   source   |    |     |-----|       |       |-----|           |   source   |
|------------|    |        |          |                         |------------|
                  |    type-check     |
                  |        |          |
                  |        v          |
                  |    |--------|     |
                  |--> | errors | &lt;---|
                       |--------|
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>该过程包括四个步骤：</p>
<ol>
<li>parse 解析：它是一个传统的递归下降解析器，稍微调整以支持增量解析，它发出一个抽象语法树 (AST)，有助于识别文件中导入了哪些文件。</li>
<li>type-check 类型检查器：类型检查器构建一个符号表，然后对文件中的每个表达式进行类型分析，报告它发现的错误。</li>
<li>transform 转换：转换步骤是一组 AST 到 AST 转换，它们执行各种任务，例如删除类型声明、将模块和类声明降低到 ES5、将异步方法转换为状态机等。</li>
<li>print 打印：TS 到 JS 的实际转换是整个过程中最昂贵的操作。</li>
</ol>
<p>在了解 Angular 是如何处理之前，我们需要知道，对 TypeScript 编译器 API 的任何使用都遵循一个多步骤过程，包括：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/angular-design-ivy-2-ast-1.jpg" alt=""></p>
<ul>
<li>一个<code v-pre>ts.CompilerHost</code>被创建</li>
<li><code v-pre>ts.CompilerHost</code>加上一组“根文件”，用于创建<code v-pre>ts.Program</code>,<code v-pre>ts.Program</code>用于收集各种诊断（类型检查）</li>
<li><code v-pre>ts.Program</code>被要求<code v-pre>emit</code>，并生成 JavaScript 代码</li>
</ul>
<p>将 Angular 编译集成到此过程中的编译器遵循非常相似的流程，但有一些额外的步骤：</p>
<ul>
<li>一个<code v-pre>ts.CompilerHost</code>被创建</li>
<li><code v-pre>ts.CompilerHost</code>包含在<code v-pre>NgCompilerHost</code>中，它将 Angular 特定文件添加到编译中</li>
<li><code v-pre>ts.Program</code>是从<code v-pre>NgCompilerHost</code>及其增强的根文件集创建的</li>
<li>一个<code v-pre>CompilationTicket</code>被创建，可选择合并来自先前编译运行的任何状态</li>
<li><code v-pre>NgCompiler</code>是使用<code v-pre>CompilationTicket</code>创建的</li>
<li>诊断信息可以正常从<code v-pre>ts.Program</code>收集，也可以从<code v-pre>NgCompiler</code>收集</li>
<li>在发射之前，调用<code v-pre>NgCompiler.prepareEmit</code>以检索需要馈送到<code v-pre>ts.Program.emit</code>的 Angular 转换器</li>
<li>使用上面的 Angular 转换器在<code v-pre>ts.Program</code>上调用发射，它生成带有 Angular 扩展的 JavaScript 代码</li>
</ul>
<p>在这些 Angular 特定的步骤中，主要进行几件事：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/angular-design-ivy-2-ast-2.jpg" alt=""></p>
<ol>
<li>会将特定于 Angular 的文件添加到编译过程中，比如<code v-pre>NgModele</code>、<code v-pre>Component</code>的解析。</li>
<li>修改生成的<code v-pre>d.ts</code>，来保存 Angular 中模块和文件间的依赖关系。</li>
<li>会增加 Angular 中的类型校验，包括<code v-pre>&lt;tmeplate&gt;</code>模板的类型校验。</li>
</ol>
<p>而在自定义 TypeScript 编译器中执行 Angular 编译，主要依赖于<code v-pre>NgCompiler</code>，我们来看一下核心的一些方法：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">NgCompiler</span> <span class="token punctuation">{</span>
  <span class="token comment">// 将一个 CompilationTicket 转换为一个用于请求编译的 NgCompiler 实例</span>
  <span class="token comment">// 根据编译请求的性质，NgCompiler 实例可能会从以前的编译中重用并随着任何更改进行更新</span>
  <span class="token comment">// 它可能是一个新实例，它可以增量地重用以前编译中的状态，或者它可能代表一个完全新的编译 </span>
  <span class="token keyword">static</span> <span class="token function">fromTicket</span><span class="token punctuation">(</span>ticket<span class="token operator">:</span> CompilationTicket<span class="token punctuation">,</span> adapter<span class="token operator">:</span> NgCompilerAdapter<span class="token punctuation">,</span> perfRecorder<span class="token operator">?</span><span class="token operator">:</span> PerfRecorder<span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token comment">// 获取文件的资源依赖</span>
  <span class="token function">getResourceDependencies</span><span class="token punctuation">(</span>file<span class="token operator">:</span> ts<span class="token punctuation">.</span>SourceFile<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token comment">// 获取此编译的所有与 Angular 相关的诊断信息</span>
  <span class="token function">getDiagnostics</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> ts<span class="token punctuation">.</span>Diagnostic<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token comment">// 将 Angular.io 错误指南链接添加到此编译的诊断中</span>
  <span class="token keyword">private</span> <span class="token function">addMessageTextDetails</span><span class="token punctuation">(</span>diagnostics<span class="token operator">:</span> ts<span class="token punctuation">.</span>Diagnostic<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token operator">:</span> ts<span class="token punctuation">.</span>Diagnostic<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
  
  <span class="token comment">// 获取 ts.Program 以用作生成后续增量编译的起点</span>
  <span class="token comment">// NgCompiler 产生一个内部增量 TypeScript 编译（为了模板类型检查的目的，将消费者的 `ts.Program` 继承到一个新的编译器中）</span>
  <span class="token comment">// 此操作后，消费者的 ts.Program 不再可用于启动新的增量编译，getNextProgram 检索可以替代使用的 ts.Program</span>
  <span class="token function">getNextProgram</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> ts<span class="token punctuation">.</span>Program <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token comment">// 异步执行 Angular 的分析步骤</span>
  <span class="token comment">// 通常，每当调用 getDiagnostics 或 prepareEmit 时，都会延迟执行此操作</span>
  <span class="token comment">// 然而，某些消费者可能希望允许分析的异步阶段，其中诸如 “styleUrls” 之类的资源被异步解析</span>
  <span class="token comment">// 在这些情况下，必须首先调用 analyzeAsync，并且在调用 NgCompiler 的任何其他 API 之前等待它的 Promise</span>
  <span class="token keyword">async</span> <span class="token function">analyzeAsync</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token keyword">void</span><span class="token operator">></span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token comment">// 列出在分析过程中检测到的惰性路由</span>
  <span class="token function">listLazyRoutes</span><span class="token punctuation">(</span>entryRoute<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> LazyRoute<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可见，<code v-pre>NgCompiler</code>主要负责将 Angular 编译集成到 TypeScript 编译器的编译流程中，并支持了上述提到的错误信息诊断（类型检查）、依赖关系检索，其中的设计还支持了增量编译、异步编译等能力。</p>
<h2 id="ngtsc-编译器" tabindex="-1"><a class="header-anchor" href="#ngtsc-编译器" aria-hidden="true">#</a> ngtsc 编译器</h2>
<p><code v-pre>ngtsc</code>是一个 Typescript-to-Javascript 编译器。它是一个最小包装器，包裹在<code v-pre>tsc</code>之外，而<code v-pre>tsc</code>中则包含一系列的 Angular 变换。</p>
<h3 id="编译器流程" tabindex="-1"><a class="header-anchor" href="#编译器流程" aria-hidden="true">#</a> 编译器流程</h3>
<p>和<code v-pre>tsc</code>一样，当<code v-pre>ngtsc</code>开始运行时，它首先解析<code v-pre>tsconfig.json</code>文件，然后创建一个<code v-pre>ts.Program</code>。在上述转换可以运行之前，需要进行几件事情：</p>
<ul>
<li>为包含修饰符的输入源文件收集元数据</li>
<li><code v-pre>@Component</code>装饰器中列出的资源文件必须异步解析
<ul>
<li>例如 CLI 中，可能希望运行的 WebPack 以产生<code v-pre>.css</code>输入到<code v-pre>styleUrls</code>的属性<code v-pre>@Component</code></li>
</ul>
</li>
<li>运行诊断程序，这会创建<code v-pre>TypeChecker</code>并触及程序中的每个节点（一个相当昂贵的操作）</li>
</ul>
<p>因为资源加载是异步的（特别是可能通过子进程并发），所以最好在做任何昂贵的事情之前启动尽可能多的资源加载。</p>
<p><code v-pre>ngtsc</code>的运行入口位于<code v-pre>NgtscProgram</code>中，可直接替代传统的 View Engine 编译器到诸如命令行<code v-pre>main()</code>函数或 Angular 之类的工具命令行界面。</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">NgtscProgram</span> <span class="token keyword">implements</span> <span class="token class-name">api</span><span class="token punctuation">.</span>Program <span class="token punctuation">{</span>
  <span class="token keyword">readonly</span> compiler<span class="token operator">:</span> NgCompiler<span class="token punctuation">;</span>
  <span class="token comment">// 主要的 TypeScript 程序，用于分析和发出</span>
  <span class="token keyword">private</span> tsProgram<span class="token operator">:</span> ts<span class="token punctuation">.</span>Program<span class="token punctuation">;</span>

  <span class="token keyword">private</span> closureCompilerEnabled<span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">;</span>
  <span class="token keyword">private</span> host<span class="token operator">:</span> NgCompilerHost<span class="token punctuation">;</span>
  <span class="token keyword">private</span> incrementalStrategy<span class="token operator">:</span> TrackedIncrementalBuildStrategy<span class="token punctuation">;</span>

  <span class="token comment">// 其他方法</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>编译器流程如下所示：</p>
<ol>
<li>创建<code v-pre>ts.Program</code>。</li>
<li>扫描源文件以查找具有微不足道的可检测<code v-pre>@Component</code>注释的顶级声明，这避免了创建<code v-pre>TypeChecker</code>。</li>
</ol>
<ul>
<li>对于每个具有<code v-pre>templateUrlor</code>的此类声明<code v-pre>styleUrls</code>，启动该 URL 的资源加载并将加入<code v-pre>Promise</code>队列</li>
</ul>
<ol start="3">
<li>获取诊断信息并报告任何初始错误消息。此时，<code v-pre>TypeChecker</code>已准备就绪。</li>
<li>对<code v-pre>@Component</code>注释进行彻底扫描，使用<code v-pre>TypeChecker</code>和元数据系统来解析任何复杂的表达式。</li>
<li>等待所有资源得到解决。</li>
<li>计算需要应用的一组变换。</li>
<li>启动<code v-pre>Tsickle</code>发射，它运行变换。</li>
<li>在<code v-pre>.d.ts</code>文件的发出回调期间，重新解析发出的<code v-pre>.d.ts</code>并合并来自<code v-pre>Angular</code>编译器的任何请求更改。</li>
</ol>
<p>Angular 编译涉及将 Angular 装饰器转换为静态定义字段。在构建时，这是在 TypeScript 编译的整个过程中完成的，其中 TypeScript 代码经过类型检查，然后降级为 JavaScript 代码。在此过程中，还可以生成特定于 Angular 的诊断。</p>
<h3 id="增量编译" tabindex="-1"><a class="header-anchor" href="#增量编译" aria-hidden="true">#</a> 增量编译</h3>
<p>前面我们介绍了 Ivy 编译器的一些特性，其中包括了通过增加增量编译，来缩短构建时间。</p>
<p>作为在 TypeScript 编译器中执行 Angular 编译的核心 API，<code v-pre>NgCompiler</code>的每个实例都支持单个编译，因此也支持增量编译。</p>
<p>Angular 编译器能够进行增量编译，其中来自先前编译的信息用于加速下一次编译。在编译期间，编译器产生两种主要信息：本地信息（如组件和指令元数据）和全局信息（如具体化的<code v-pre>NgModule</code>范围）。增量编译通过两种方式进行管理：</p>
<ol>
<li>对于大多数更改，新的<code v-pre>NgCompiler</code>可以有选择地从以前的实例继承本地信息，并且只需要在底层 TypeScript 文件发生更改的地方重新计算它。在这种情况下，全局信息总是从头开始重新计算。</li>
<li>对于特定的更改，例如组件资源中的更改，<code v-pre>NgCompiler</code>可以整体重用，并更新以合并此类更改的影响，而无需重新计算任何其他信息。</li>
</ol>
<p>请注意，这两种模式在是否需要新<code v-pre>NgCompiler</code>实例或是否可以重用之前的实例方面有所不同。为了防止泄漏这种实现的复杂性并保护消费者不必管理<code v-pre>NgCompiler</code>如此具体的生命周期，这个过程通过<code v-pre>CompilationTicket</code>进行了抽象。</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">type</span> <span class="token class-name">CompilationTicket</span> <span class="token operator">=</span>
  <span class="token comment">// 从头开始 Angular 编译操作</span>
  FreshCompilationTicket <span class="token operator">|</span> 
  <span class="token comment">// 开始包含对 TypeScript 代码的更改的 Angular 编译操作</span>
  IncrementalTypeScriptCompilationTicket <span class="token operator">|</span> 
  IncrementalResourceCompilationTicket<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>CompilationTicket</code>用于初始化（或更新）<code v-pre>NgCompiler</code>实例，该实例为 Angular 编译器的核心。<code v-pre>CompilationTicket</code>抽象了编译的起始状态，并允许独立于任何增量编译生命周期管理<code v-pre>NgCompiler</code>。</p>
<p>消费者首先获得一个<code v-pre>CompilationTicket</code>（取决于传入更改的性质），然后使用该票据获取<code v-pre>NgCompiler</code>实例。在创建<code v-pre>CompilationTicket</code>时，编译器可以决定是重用旧<code v-pre>NgCompiler</code>实例还是创建新实例。</p>
<h3 id="异步编译" tabindex="-1"><a class="header-anchor" href="#异步编译" aria-hidden="true">#</a> 异步编译</h3>
<p>在某些编译环境（例如 Angular CLI 中的 Webpack 驱动编译）中，编译的各种输入只能以异步方式生成。例如，<code v-pre>styleUrls</code>链接到 SASS 文件的 SASS 编译需要产生一个子 Webpack 编译。为了支持这一点，Angular 有一个异步接口来加载这些资源。</p>
<p>如果使用此接口，则<code v-pre>NgCompiler</code>创建后的另一个异步步骤是调用<code v-pre>NgCompiler.analyzeAsync</code>并等待其<code v-pre>Promise</code>：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">NgtscProgram</span> <span class="token keyword">implements</span> <span class="token class-name">api</span><span class="token punctuation">.</span>Program <span class="token punctuation">{</span>
   <span class="token operator">...</span>
  <span class="token doc-comment comment">/**
    * 确保 NgCompiler 已正确分析程序，并允许在此过程中异步加载任何资源。
    * Angular CLI 使用它来允许为 styleUrls 中使用的 SASS 文件等内容生成（异步）子编译。
    */</span>
  <span class="token function">loadNgStructureAsync</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">Promise</span><span class="token operator">&lt;</span><span class="token keyword">void</span><span class="token operator">></span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>compiler<span class="token punctuation">.</span><span class="token function">analyzeAsync</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此操作完成后，所有资源均已加载，其余<code v-pre>NgCompilerAPI</code>可以同步使用。</p>
<h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h2>
<p>Angular 是一套大而全的解决方案，想必大家早已对此有所了解。但实际上 Angular 做了很多深度的设计和能力，包括给开发者更好的体验，比如模板类型检查中，是如何将这些 Angular 特定的类型检查能力添加到 TypeScript 编译过程中，并且能通过文件映射能准确反馈给用户具体的代码位置，这些都是作为开发者的我未曾考虑过的。</p>
<p>感觉 Angular 里面还有特别多值得学习的东西。</p>
<h3 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h3>
<ul>
<li><a href="https://github.com/angular/angular/blob/master/packages/compiler/design/architecture.md" target="_blank" rel="noopener noreferrer">DESIGN DOC(Ivy): Compiler Architecture<ExternalLinkIcon/></a></li>
<li><a href="https://indepth.dev/posts/1151/a-deep-dive-into-injectable-and-providedin-in-ivy" target="_blank" rel="noopener noreferrer">A Deep Dive into @Injectable and providedIn in Ivy<ExternalLinkIcon/></a></li>
<li><a href="https://indepth.dev/posts/1062/ivy-engine-in-angular-first-in-depth-look-at-compilation-runtime-and-change-detection" target="_blank" rel="noopener noreferrer">Ivy engine in Angular: first in-depth look at compilation, runtime and change detection<ExternalLinkIcon/></a></li>
<li><a href="https://indepth.dev/posts/1053/everything-you-need-to-know-about-change-detection-in-angular" target="_blank" rel="noopener noreferrer">Everything you need to know about change detection in Angular<ExternalLinkIcon/></a></li>
<li><a href="https://www.youtube.com/watch?v=anphffaCZrQ" target="_blank" rel="noopener noreferrer">Deep Dive into the Angular Compiler | Alex Rickabaugh<ExternalLinkIcon/></a></li>
</ul>
</div></template>


