<template><div><p>作为“为大型前端项目”而设计的前端框架，Angular 其实有许多值得参考和学习的设计，本系列主要用于研究这些设计和功能的实现原理。本文主要围绕 Angular 中的模块设计、模块化组织等内容进行介绍。</p>
<!--more-->
<h2 id="angular-中的模块" tabindex="-1"><a class="header-anchor" href="#angular-中的模块" aria-hidden="true">#</a> Angular 中的模块</h2>
<p>在 AngularJS 升级到 Angular（2+ 版本）之后，引入了模块的设计。在我们进行 Angular 应用开发时，总是离不开模块，包括 Angular 自带的通用模块，以及应用启动的根模块等等。</p>
<p>说到模块化，前端开发首先会想到 <a href="https://hacks.mozilla.org/2015/08/es6-in-depth-modules/" target="_blank" rel="noopener noreferrer">ES6 的模块<ExternalLinkIcon/></a>，这两者其实并没有什么关联：</p>
<ul>
<li>ES6 模块以文件为单位；Angular 模块则是以 NgModule 为单位。</li>
<li>ES6 模块用于跨文件的功能调用；Angular 模块用于组织有特定意义的功能块。</li>
<li>ES6 模块在编译阶段确认各个模块的依赖关系，模块间关系扁平；Angular 模块则可以带有深度的层次结构。</li>
</ul>
<h3 id="ngmodules-定义" tabindex="-1"><a class="header-anchor" href="#ngmodules-定义" aria-hidden="true">#</a> NgModules 定义</h3>
<p>在 Angular 中，会使用 NgModules 来进行模块组织和管理。</p>
<p>NgModule 是一个带有<code v-pre>@NgModule</code>装饰器的类，<code v-pre>@NgModule</code>的参数是一个元数据对象，用于描述如何编译组件的模板，以及如何在运行时创建注入器。 它会标出该模块自己的组件、指令和管道，通过<code v-pre>exports</code>属性公开其中的一部分，以便外部组件使用它们。 关于元数据和装饰器，可参考<RouterLink to="/angular/deep-into-angular/angular-design-metadata.html">Angular框架解读--元数据和装饰器</RouterLink>一节。</p>
<p>NgModule 把组件、指令和管道打包成内聚的功能块，每个模块聚焦于一个特性区域、业务领域、工作流或通用工具。运行时，模块相关的信息存储在<code v-pre>NgModuleDef</code>中：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token comment">// NgModuleDef 是运行时用于组装组件、指令、管道和注入器的内部数据结构</span>
<span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">NgModuleDef<span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">></span></span> <span class="token punctuation">{</span>
  <span class="token comment">// 表示模块的令牌，由DI使用</span>
  type<span class="token operator">:</span> <span class="token constant">T</span><span class="token punctuation">;</span>
  <span class="token comment">// 要引导的组件列表</span>
  bootstrap<span class="token operator">:</span> Type<span class="token operator">&lt;</span><span class="token builtin">any</span><span class="token operator">></span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">|</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> Type<span class="token operator">&lt;</span><span class="token builtin">any</span><span class="token operator">></span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 此模块声明的组件、指令和管道的列表</span>
  declarations<span class="token operator">:</span> Type<span class="token operator">&lt;</span><span class="token builtin">any</span><span class="token operator">></span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">|</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> Type<span class="token operator">&lt;</span><span class="token builtin">any</span><span class="token operator">></span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 此模块导入的模块列表或 ModuleWithProviders </span>
  imports<span class="token operator">:</span> Type<span class="token operator">&lt;</span><span class="token builtin">any</span><span class="token operator">></span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">|</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> Type<span class="token operator">&lt;</span><span class="token builtin">any</span><span class="token operator">></span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 该模块导出的模块、ModuleWithProviders、组件、指令或管道的列表</span>
  exports<span class="token operator">:</span> Type<span class="token operator">&lt;</span><span class="token builtin">any</span><span class="token operator">></span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">|</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> Type<span class="token operator">&lt;</span><span class="token builtin">any</span><span class="token operator">></span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 为该模块计算的 transitiveCompileScopes 的缓存值</span>
  transitiveCompileScopes<span class="token operator">:</span> NgModuleTransitiveScopes<span class="token operator">|</span><span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token comment">// 声明 NgModule 中允许的元素的一组模式</span>
  schemas<span class="token operator">:</span> SchemaMetadata<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token operator">|</span><span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token comment">// 应为其注册模块的唯一ID</span>
  id<span class="token operator">:</span> <span class="token builtin">string</span><span class="token operator">|</span><span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>宏观来讲，NgModule 是组织 Angular 应用的一种方式，它们通过<code v-pre>@NgModule</code>装饰器中的元数据来实现这一点，这些元数据可以分成三类：</p>
<ul>
<li>静态的：编译器配置，通过<code v-pre>declarations</code>数组来配置。用于告诉编译器指令的选择器，并通过选择器匹配的方式，决定要把该指令应用到模板中的什么位置</li>
<li>运行时：通过<code v-pre>providers</code>数组提供给注入器的配置</li>
<li>组合/分组：通过<code v-pre>imports</code>和<code v-pre>exports</code>数组来把多个 NgModule 放在一起，并让它们可用</li>
</ul>
<p>可以看到，一个 NgModules 模块通过<code v-pre>declarations</code>声明该模块的组件、指令和管道，同时通过<code v-pre>import</code>导入其他模块和服务，以此来构成内聚的功能块。NgModule 还能把一些服务提供者添加到应用的依赖注入器中，具体可参考后续依赖注入部分内容。</p>
<h3 id="模块化组织" tabindex="-1"><a class="header-anchor" href="#模块化组织" aria-hidden="true">#</a> 模块化组织</h3>
<p>每个 Angular 应用有至少一个模块，该模块称为根模块（AppModule）。Angular 应用的启动，便是由根模块开始的，可以参考后续的依赖注入的引导过程内容。</p>
<p>对于一个简单的 Angular 应用来说，一个根模块就足以管理整个应用的功能。对于复杂的应用来说，则可以根据功能来划分成不同的模块，每个模块可专注于某项功能或业务领域、工作流程或导航流程、通用工具集，或者成为一个或多个服务提供者。</p>
<p>在 Angular 中，推荐的模块可以根据类型划分为：</p>
<ul>
<li>领域模块：领域模块围绕特性、业务领域或用户体验进行组织</li>
<li>带路由的模块：模块的顶层组件充当路由器访问这部分路由时的目的地</li>
<li>路由配置模块：路由配置模块为另一个模块提供路由配置</li>
<li>服务模块：服务模块提供实用服务，比如数据访问和消息传递</li>
<li>小部件：小部件模块可以为其它模块提供某些组件、指令或管道</li>
<li>共享模块：共享模块可以为其它的模块提供组件，指令和管道的集合</li>
</ul>
<p>可见，模块可以以不同的方式进行组织，可以包括组件、指令和管道和服务，也可以仅提供其中一种，比如<code v-pre>HttpClientModule</code>便是仅由提供者组织的模块：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token decorator"><span class="token at operator">@</span><span class="token function">NgModule</span></span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token comment">// XSRF 保护的可选配置</span>
  imports<span class="token operator">:</span> <span class="token punctuation">[</span>
    HttpClientXsrfModule<span class="token punctuation">.</span><span class="token function">withOptions</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      cookieName<span class="token operator">:</span> <span class="token string">'XSRF-TOKEN'</span><span class="token punctuation">,</span>
      headerName<span class="token operator">:</span> <span class="token string">'X-XSRF-TOKEN'</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token comment">// 配置 DI，并在其中将其与 HTTP 通信的支持服务一起导入</span>
  providers<span class="token operator">:</span> <span class="token punctuation">[</span>
    HttpClient<span class="token punctuation">,</span>
    <span class="token punctuation">{</span>provide<span class="token operator">:</span> HttpHandler<span class="token punctuation">,</span> useClass<span class="token operator">:</span> HttpInterceptingHandler<span class="token punctuation">}</span><span class="token punctuation">,</span>
    HttpXhrBackend<span class="token punctuation">,</span>
    <span class="token punctuation">{</span>provide<span class="token operator">:</span> HttpBackend<span class="token punctuation">,</span> useExisting<span class="token operator">:</span> HttpXhrBackend<span class="token punctuation">}</span><span class="token punctuation">,</span>
    BrowserXhr<span class="token punctuation">,</span>
    <span class="token punctuation">{</span>provide<span class="token operator">:</span> XhrFactory<span class="token punctuation">,</span> useExisting<span class="token operator">:</span> BrowserXhr<span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">HttpClientModule</span> <span class="token punctuation">{</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="模块能力" tabindex="-1"><a class="header-anchor" href="#模块能力" aria-hidden="true">#</a> 模块能力</h2>
<p>现在我们已经知道，NgModule 是把组件、指令和管道打包成内聚的功能块，那么在 NgModule 里面是怎么管理这些内容的呢？</p>
<h3 id="模块与组件" tabindex="-1"><a class="header-anchor" href="#模块与组件" aria-hidden="true">#</a> 模块与组件</h3>
<p>在 Angular 中，每个组件都应该（且只能）声明（declare）在一个 NgModule 类中。属于相同 NgModule 的组件会共享同一个编译上下文环境，该环境信息由<code v-pre>LocalModuleScopeRegistry</code>维护：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">LocalModuleScopeRegistry</span> <span class="token keyword">implements</span> <span class="token class-name">MetadataRegistry</span><span class="token punctuation">,</span> ComponentScopeReader <span class="token punctuation">{</span>
  <span class="token operator">...</span>
  <span class="token comment">// 从当前编译单元到声明它们的 NgModule 的组件映射</span>
  <span class="token keyword">private</span> declarationToModule <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map<span class="token operator">&lt;</span>ClassDeclaration<span class="token punctuation">,</span> DeclarationData<span class="token operator">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 这从指令/管道类映射到声明该指令/管道的每个 NgModule 的数据映射</span>
  <span class="token keyword">private</span> duplicateDeclarations <span class="token operator">=</span>
      <span class="token keyword">new</span> <span class="token class-name">Map<span class="token operator">&lt;</span>ClassDeclaration<span class="token punctuation">,</span> Map<span class="token operator">&lt;</span>ClassDeclaration<span class="token punctuation">,</span> DeclarationData<span class="token operator">>></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">private</span> moduleToRef <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map<span class="token operator">&lt;</span>ClassDeclaration<span class="token punctuation">,</span> Reference<span class="token operator">&lt;</span>ClassDeclaration<span class="token operator">>></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 为当前程序中声明的每个 NgModule 计算的 LocalModuleScope 的缓存</span>
  <span class="token keyword">private</span> cache <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map<span class="token operator">&lt;</span>ClassDeclaration<span class="token punctuation">,</span> LocalModuleScope<span class="token operator">|</span><span class="token keyword">null</span><span class="token operator">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  
  <span class="token comment">// 将 NgModule 的数据添加到注册表中</span>
  <span class="token function">registerNgModuleMetadata</span><span class="token punctuation">(</span>data<span class="token operator">:</span> NgModuleMeta<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
  <span class="token comment">// 为组件获取作用域</span>
  <span class="token function">getScopeForComponent</span><span class="token punctuation">(</span>clazz<span class="token operator">:</span> ClassDeclaration<span class="token punctuation">)</span><span class="token operator">:</span> LocalModuleScope<span class="token operator">|</span><span class="token keyword">null</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> scope <span class="token operator">=</span> <span class="token operator">!</span><span class="token keyword">this</span><span class="token punctuation">.</span>declarationToModule<span class="token punctuation">.</span><span class="token function">has</span><span class="token punctuation">(</span>clazz<span class="token punctuation">)</span> <span class="token operator">?</span>
        <span class="token keyword">null</span> <span class="token operator">:</span>
        <span class="token comment">// 返回 NgModule 的作用域</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getScopeOfModule</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>declarationToModule<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>clazz<span class="token punctuation">)</span><span class="token operator">!</span><span class="token punctuation">.</span>ngModule<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> scope<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 收集模块及其指令/管道的注册数据，并将其转换为完整的 LocalModuleScope</span>
  <span class="token function">getScopeOfModule</span><span class="token punctuation">(</span>clazz<span class="token operator">:</span> ClassDeclaration<span class="token punctuation">)</span><span class="token operator">:</span> LocalModuleScope<span class="token operator">|</span><span class="token keyword">null</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>moduleToRef<span class="token punctuation">.</span><span class="token function">has</span><span class="token punctuation">(</span>clazz<span class="token punctuation">)</span> <span class="token operator">?</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getScopeOfModuleReference</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>moduleToRef<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>clazz<span class="token punctuation">)</span><span class="token operator">!</span><span class="token punctuation">)</span> <span class="token operator">:</span>
        <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>LocalModuleScopeRegistry</code>类实现 NgModule 声明、导入和导出的逻辑，并且可以为给定组件生成在该组件的模板中“可见”的一组指令和管道。它收集有关本地的 NgModules，指令、组件和管道的信息，并且可以生成<code v-pre>LocalModuleScope</code>，概括了组件的编译范围。</p>
<p>每个 NgModule 在编译<code v-pre>@NgModule</code>装饰器的元数据时，会向<code v-pre>LocalModuleScopeRegistry</code>注册该模块的信息：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">NgModuleDecoratorHandler</span> <span class="token keyword">implements</span>
    <span class="token class-name">DecoratorHandler<span class="token operator">&lt;</span>Decorator<span class="token punctuation">,</span> NgModuleAnalysis<span class="token punctuation">,</span> NgModuleResolution<span class="token operator">></span></span> <span class="token punctuation">{</span>
  <span class="token function">register</span><span class="token punctuation">(</span>node<span class="token operator">:</span> ClassDeclaration<span class="token punctuation">,</span> analysis<span class="token operator">:</span> NgModuleAnalysis<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
    <span class="token comment">// 这样可以确保在 compile() 阶段，模块的元数据可用于选择器作用域计算</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>metaRegistry<span class="token punctuation">.</span><span class="token function">registerNgModuleMetadata</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      ref<span class="token operator">:</span> <span class="token keyword">new</span> <span class="token class-name">Reference</span><span class="token punctuation">(</span>node<span class="token punctuation">)</span><span class="token punctuation">,</span>
      schemas<span class="token operator">:</span> analysis<span class="token punctuation">.</span>schemas<span class="token punctuation">,</span>
      declarations<span class="token operator">:</span> analysis<span class="token punctuation">.</span>declarations<span class="token punctuation">,</span>
      imports<span class="token operator">:</span> analysis<span class="token punctuation">.</span>imports<span class="token punctuation">,</span>
      exports<span class="token operator">:</span> analysis<span class="token punctuation">.</span>exports<span class="token punctuation">,</span>
      rawDeclarations<span class="token operator">:</span> analysis<span class="token punctuation">.</span>rawDeclarations<span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token operator">...</span>
  <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当组件在编译<code v-pre>@Component</code>装饰器的元数据时，会检查该组件是否已在 NgModule 中注册。如果已在某个模块中注册，则向<code v-pre>LocalModuleScopeRegistry</code>获取模块的编译范围，在该模块的编译范围内对其进行编译：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">ComponentDecoratorHandler</span> <span class="token keyword">implements</span>
    <span class="token class-name">DecoratorHandler<span class="token operator">&lt;</span>Decorator<span class="token punctuation">,</span> ComponentAnalysisData<span class="token punctuation">,</span> ComponentResolutionData<span class="token operator">></span></span> <span class="token punctuation">{</span>
  <span class="token function">resolve</span><span class="token punctuation">(</span>node<span class="token operator">:</span> ClassDeclaration<span class="token punctuation">,</span> analysis<span class="token operator">:</span> Readonly<span class="token operator">&lt;</span>ComponentAnalysisData<span class="token operator">></span><span class="token punctuation">)</span><span class="token operator">:</span>
      ResolveResult<span class="token operator">&lt;</span>ComponentResolutionData<span class="token operator">></span> <span class="token punctuation">{</span>
    <span class="token operator">...</span>
    <span class="token comment">// 获取模块的作用域</span>
    <span class="token keyword">const</span> scope <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>scopeReader<span class="token punctuation">.</span><span class="token function">getScopeForComponent</span><span class="token punctuation">(</span>node<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token operator">...</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>scope <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">(</span><span class="token operator">!</span>scope<span class="token punctuation">.</span>compilation<span class="token punctuation">.</span>isPoisoned <span class="token operator">||</span> <span class="token keyword">this</span><span class="token punctuation">.</span>usePoisonedData<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 对模块的作用域中的信息进行处理</span>
      <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> dir <span class="token keyword">of</span> scope<span class="token punctuation">.</span>compilation<span class="token punctuation">.</span>directives<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>dir<span class="token punctuation">.</span>selector <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          matcher<span class="token punctuation">.</span><span class="token function">addSelectables</span><span class="token punctuation">(</span>CssSelector<span class="token punctuation">.</span><span class="token function">parse</span><span class="token punctuation">(</span>dir<span class="token punctuation">.</span>selector<span class="token punctuation">)</span><span class="token punctuation">,</span> dir <span class="token keyword">as</span> MatchedDirective<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">const</span> pipes <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map<span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token punctuation">,</span> Reference<span class="token operator">&lt;</span>ClassDeclaration<span class="token operator">>></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> pipe <span class="token keyword">of</span> scope<span class="token punctuation">.</span>compilation<span class="token punctuation">.</span>pipes<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        pipes<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>pipe<span class="token punctuation">.</span>name<span class="token punctuation">,</span> pipe<span class="token punctuation">.</span>ref<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token operator">...</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在获取到作用域之后，接下来组件会使用<code v-pre>R3TargetBinder</code>绑定组件模板 AST，这些内容会在 Ivy 编译器部分进行更多的介绍。</p>
<p>默认情况下，NgModule 都是急性加载的，也就是说它会在应用加载时尽快加载，所有模块都是如此，无论是否立即要用。对于带有很多路由的大型应用，考虑使用惰性加载：一种按需加载 NgModule 的模式。惰性加载可以减小初始包的尺寸，从而减少加载时间。</p>
<p>要惰性加载 Angular 模块，则需要用到<code v-pre>AppRoutingModule</code>，同时惰性加载还支持预加载的能力。</p>
<h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h2>
<p>在 Angular 中，使用模块是最佳的组织方式。模块提供了聚焦于特定应用需求的一组功能，可以把应用划分成一些聚焦的功能区，比如用户工作流、路由或表单。</p>
<p>对于 NgModule 模块，可以通过模块提供的服务以及共享出的组件、指令和管道来与根模块和其它 NgModule 模块进行合作。通过设置模块的导入和导出，Angular 可以解析出各个模块间的依赖关系。Angular 模块之间不允许出现循环依赖，因此一个 Angular 应用中的模块最终是呈现为以根模块为根节点的树状结构的。</p>
<h3 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h3>
<ul>
<li><a href="https://angular.cn/guide/ngmodules" target="_blank" rel="noopener noreferrer">Angular-NgModules<ExternalLinkIcon/></a></li>
</ul>
</div></template>


