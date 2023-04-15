<template><div><p>作为“为大型前端项目”而设计的前端框架，Angular 其实有许多值得参考和学习的设计，本系列主要用于研究这些设计和功能的实现原理。本文主要围绕 Angular 中的最大特点——依赖注入，首先来介绍一些 Angular 依赖注入体系中的基本概念。</p>
<!--more-->
<h2 id="依赖注入" tabindex="-1"><a class="header-anchor" href="#依赖注入" aria-hidden="true">#</a> 依赖注入</h2>
<p>既然要介绍 Angular 框架的依赖注入设计，那么先铺垫一下依赖注入的基本概念。我们常常会搞混依赖倒置原则（DIP）、控制反转（IoC）、依赖注入（DI）这几个概念，因此这里会先简单介绍一下。</p>
<h3 id="依赖倒置原则、控制反转、依赖注入" tabindex="-1"><a class="header-anchor" href="#依赖倒置原则、控制反转、依赖注入" aria-hidden="true">#</a> 依赖倒置原则、控制反转、依赖注入</h3>
<p>低耦合、高内聚大概是每个系统的设计目标之一，而为此产生了很多的设计模式和理念，其中便包括依赖倒置原则、控制反转的设计思想。</p>
<p><strong>(1) 依赖倒置原则（DIP）。</strong></p>
<p>依赖倒置原则的原始定义为：</p>
<ul>
<li>高层模块不应该依赖低层模块，两者都应该依赖其抽象；</li>
<li>抽象不应该依赖细节，细节应该依赖抽象。</li>
</ul>
<p>简单说便是：模块间不应该直接依赖对方，应该依赖一个抽象的规则（接口或者时抽象类）。</p>
<p><strong>(2) 控制反转（IoC）。</strong></p>
<p>控制反转的定义为：模块间的依赖关系从程序内部提到外部来实例化管理。即对象在被创建的时候，由一个调控系统内所有对象的外界实体控制，并将其所依赖的对象的引用传递(注入)给它。</p>
<p>实现控制反转主要有两种方式：</p>
<ul>
<li>依赖注入：被动的接收依赖对象</li>
<li>依赖查找：主动索取依赖的对象</li>
</ul>
<p><strong>(3) 依赖注入。</strong></p>
<p>依赖注入，是控制反转的最为常见的一种技术。</p>
<p>依赖倒置和控制反转两者相辅相成，常常可以一起使用，可有效地降低模块间的耦合。</p>
<h2 id="angular-中的依赖注入" tabindex="-1"><a class="header-anchor" href="#angular-中的依赖注入" aria-hidden="true">#</a> Angular 中的依赖注入</h2>
<p>在 Angular 中，同样使用了依赖注入的技术，DI 框架会在实例化某个类时，向其提供这个类所声明的依赖项（依赖项：指当类需要执行其功能时，所需要的服务或对象）。</p>
<p>Angular 中的依赖注入基本上是围绕着组件或者是模块展开的，主要用于给新建的组件提供依赖。</p>
<p>Angular 中主要的依赖注入机制是<strong>注入器机制</strong>：</p>
<ul>
<li>应用中所需的任何依赖，都必须使用该应用的注入器来注册一个提供者，以便注入器可以使用这个提供者来创建新实例</li>
<li>Angular 会在启动过程中，创建全应用级注入器以及所需的其它注入器</li>
</ul>
<p>这里面主要涉及两个概念，分别是<strong>Injector 注入器</strong>和<strong>Provider 提供商</strong>，我们来看看。</p>
<h3 id="injector-注入器" tabindex="-1"><a class="header-anchor" href="#injector-注入器" aria-hidden="true">#</a> Injector 注入器</h3>
<p>Injector 注入器用于创建依赖，会维护一个容器来管理这些依赖，并尽可能地复用它们。注入器会提供依赖的一个单例，并把这个单例对象注入到多个组件中。</p>
<p>显然，作为一个用来创建、管理、维护依赖的容器，注入器的功能很简单：创建依赖实例、获取依赖实例、管理依赖实例。我们也可以从抽象类<code v-pre>Injector</code>的源码中看出来：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">abstract</span> <span class="token keyword">class</span> <span class="token class-name">Injector</span> <span class="token punctuation">{</span>
  <span class="token comment">// 找不到依赖</span>
  <span class="token keyword">static</span> <span class="token constant">THROW_IF_NOT_FOUND</span> <span class="token operator">=</span> <span class="token constant">THROW_IF_NOT_FOUND</span><span class="token punctuation">;</span>
  <span class="token comment">// NullInjector 是树的顶部</span>
  <span class="token comment">// 如果你在树中向上走了很远，以至于要在 NullInjector 中寻找服务，那么将收到错误消息，或者对于 @Optional()，返回 null</span>
  <span class="token keyword">static</span> <span class="token constant">NULL</span><span class="token operator">:</span> Injector <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">NullInjector</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 根据提供的 Token 从 Injector 检索实例</span>
  <span class="token keyword">abstract</span> <span class="token generic-function"><span class="token function">get</span><span class="token generic class-name"><span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">></span></span></span><span class="token punctuation">(</span>
    token<span class="token operator">:</span> Type<span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">></span> <span class="token operator">|</span> AbstractType<span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">></span> <span class="token operator">|</span> InjectionToken<span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">></span><span class="token punctuation">,</span>
    notFoundValue<span class="token operator">?</span><span class="token operator">:</span> <span class="token constant">T</span><span class="token punctuation">,</span>
    flags<span class="token operator">?</span><span class="token operator">:</span> InjectFlags
  <span class="token punctuation">)</span><span class="token operator">:</span> <span class="token constant">T</span><span class="token punctuation">;</span>

  <span class="token comment">// 创建一个新的 Injector 实例，该实例提供一个或多个依赖项</span>
  <span class="token keyword">static</span> <span class="token function">create</span><span class="token punctuation">(</span>options<span class="token operator">:</span> <span class="token punctuation">{</span>
    providers<span class="token operator">:</span> StaticProvider<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    parent<span class="token operator">?</span><span class="token operator">:</span> Injector<span class="token punctuation">;</span>
    name<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token operator">:</span> Injector<span class="token punctuation">;</span>

  <span class="token comment">// ɵɵdefineInjectable 用于构造一个 InjectableDef</span>
  <span class="token comment">// 它定义 DI 系统将如何构造 Token，并且在哪些 Injector 中可用</span>
  <span class="token keyword">static</span> ɵprov <span class="token operator">=</span> <span class="token function">ɵɵdefineInjectable</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    token<span class="token operator">:</span> Injector<span class="token punctuation">,</span>
    providedIn<span class="token operator">:</span> <span class="token string">"any"</span> <span class="token keyword">as</span> <span class="token builtin">any</span><span class="token punctuation">,</span>
    <span class="token comment">// ɵɵinject 生成的指令：从当前活动的 Injector 注入 Token</span>
    <span class="token function-variable function">factory</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token function">ɵɵinject</span><span class="token punctuation">(</span><span class="token constant">INJECTOR</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">static</span> __NG_ELEMENT_ID__ <span class="token operator">=</span> InjectorMarkers<span class="token punctuation">.</span>Injector<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>也就是说，我们可以将需要共享的依赖实例添加到注入器中，并通过 Token 查询和检索注入器来获取相应的依赖实例。</p>
<p>需要注意的是，Angular 中的注入器是分层的，因此查找依赖的过程也是向上遍历注入器树的过程。</p>
<p>这是因为在 Angular 中，应用是以模块的方式组织的，具体可以参考<RouterLink to="/angular/deep-into-angular/angular-design-module.html">5.模块化组织</RouterLink>篇。一般来说，页面的 DOM 是以<code v-pre>html</code>作为根节点的树状结构，以此为基础，Angular 应用中的组件和模块也是与之相伴的树状结构。</p>
<p>而注入器服务于组件和模块，同样是挂载与模块和组织上的树状结构。因此，Injector 也划分为模块和组件级别，可分别为组件和模块提供依赖的具体实例。注入器是可继承的，这意味着如果指定的注入器无法解析某个依赖，它就会请求父注入器来解析它，我们同样可以从上面的创建注入器代码中看到：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token comment">// 创建一个新的 Injector 实例，可传入 parent 父注入器</span>
<span class="token keyword">static</span> <span class="token function">create</span><span class="token punctuation">(</span>options<span class="token operator">:</span> <span class="token punctuation">{</span>providers<span class="token operator">:</span> StaticProvider<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> parent<span class="token operator">?</span><span class="token operator">:</span> Injector<span class="token punctuation">,</span> name<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token operator">:</span> Injector<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>在某个注入器的范围内，服务是单例的。也就是说，在指定的注入器中最多只有某个服务的最多一个实例。如果不希望在所有地方都使用该服务的同一个实例，则可以通过注册多个注入器、并按照需要关联到组件和模块中的方式，来按需共享某个服务依赖的实例。</p>
<p>我们可以看到创建一个新的<code v-pre>Injector</code>实例时，传入的参数包括<code v-pre>Provider</code>，这是因为<code v-pre>Injector</code>不会直接创建依赖，而是通过<code v-pre>Provider</code>来完成的。每个注入器会维护一个提供者的列表，并根据组件或其它服务的需要，用它们来提供服务的实例。</p>
<h3 id="provider-提供者" tabindex="-1"><a class="header-anchor" href="#provider-提供者" aria-hidden="true">#</a> Provider 提供者</h3>
<p>Provider 提供者用来告诉注入器应该如何获取或创建依赖，要想让注入器能够创建服务（或提供其它类型的依赖），必须使用某个提供者配置好注入器。</p>
<p>一个提供者对象定义了如何获取与 DI 令牌（token） 相关联的可注入依赖，而注入器会使用这个提供者来创建它所依赖的那些类的实例。</p>
<blockquote>
<p>关于 DI 令牌：</p>
<ul>
<li>当使用提供者配置注入器时，就会把提供者和一个 DI 令牌关联起来；</li>
<li>注入器维护一个内部令牌-提供者的映射表，当请求一个依赖项时就会引用它，令牌就是这个映射表的键。</li>
</ul>
</blockquote>
<p>提供者的类型很多，从<a href="https://angular.cn/guide/dependency-injection-providers" target="_blank" rel="noopener noreferrer">官方文档<ExternalLinkIcon/></a>中可以阅读它们的具体定义：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">type</span> <span class="token class-name">Provider</span> <span class="token operator">=</span>
  <span class="token operator">|</span> TypeProvider
  <span class="token operator">|</span> ValueProvider
  <span class="token operator">|</span> ClassProvider
  <span class="token operator">|</span> ConstructorProvider
  <span class="token operator">|</span> ExistingProvider
  <span class="token operator">|</span> FactoryProvider
  <span class="token operator">|</span> <span class="token builtin">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>提供者的解析过程如下：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">function</span> <span class="token function">resolveReflectiveFactory</span><span class="token punctuation">(</span>
  provider<span class="token operator">:</span> NormalizedProvider
<span class="token punctuation">)</span><span class="token operator">:</span> ResolvedReflectiveFactory <span class="token punctuation">{</span>
  <span class="token keyword">let</span> factoryFn<span class="token operator">:</span> <span class="token builtin">Function</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> resolvedDeps<span class="token operator">:</span> ReflectiveDependency<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>provider<span class="token punctuation">.</span>useClass<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 使用类来提供依赖</span>
    <span class="token keyword">const</span> useClass <span class="token operator">=</span> <span class="token function">resolveForwardRef</span><span class="token punctuation">(</span>provider<span class="token punctuation">.</span>useClass<span class="token punctuation">)</span><span class="token punctuation">;</span>
    factoryFn <span class="token operator">=</span> reflector<span class="token punctuation">.</span><span class="token function">factory</span><span class="token punctuation">(</span>useClass<span class="token punctuation">)</span><span class="token punctuation">;</span>
    resolvedDeps <span class="token operator">=</span> <span class="token function">_dependenciesFor</span><span class="token punctuation">(</span>useClass<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>provider<span class="token punctuation">.</span>useExisting<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 使用已有依赖</span>
    <span class="token function-variable function">factoryFn</span> <span class="token operator">=</span> <span class="token punctuation">(</span>aliasInstance<span class="token operator">:</span> <span class="token builtin">any</span><span class="token punctuation">)</span> <span class="token operator">=></span> aliasInstance<span class="token punctuation">;</span>
    <span class="token comment">// 从根据 token 获取具体的依赖</span>
    resolvedDeps <span class="token operator">=</span> <span class="token punctuation">[</span>
      ReflectiveDependency<span class="token punctuation">.</span><span class="token function">fromKey</span><span class="token punctuation">(</span>ReflectiveKey<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>provider<span class="token punctuation">.</span>useExisting<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>provider<span class="token punctuation">.</span>useFactory<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 使用工厂方法提供依赖</span>
    factoryFn <span class="token operator">=</span> provider<span class="token punctuation">.</span>useFactory<span class="token punctuation">;</span>
    resolvedDeps <span class="token operator">=</span> <span class="token function">constructDependencies</span><span class="token punctuation">(</span>provider<span class="token punctuation">.</span>useFactory<span class="token punctuation">,</span> provider<span class="token punctuation">.</span>deps<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token comment">// 使用提供者具体的值作为依赖</span>
    <span class="token function-variable function">factoryFn</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> provider<span class="token punctuation">.</span>useValue<span class="token punctuation">;</span>
    resolvedDeps <span class="token operator">=</span> _EMPTY_LIST<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">//</span>
  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">ResolvedReflectiveFactory</span><span class="token punctuation">(</span>factoryFn<span class="token punctuation">,</span> resolvedDeps<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>根据不同类型的提供者，通过解析之后，得到由注入器 Injector 使用的提供者的内部解析表示形式：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">ResolvedReflectiveProvider</span> <span class="token punctuation">{</span>
  <span class="token comment">// 键，包括系统范围内的唯一 id，以及一个 token</span>
  key<span class="token operator">:</span> ReflectiveKey<span class="token punctuation">;</span>
  <span class="token comment">// 可以返回由键表示的对象的实例的工厂函数</span>
  resolvedFactories<span class="token operator">:</span> ResolvedReflectiveFactory<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token comment">// 指示提供者是多提供者，还是常规提供者</span>
  multiProvider<span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>提供者可以是服务类<code v-pre>ClassProvider</code>本身，如果把服务类指定为提供者令牌，那么注入器的默认行为是用<code v-pre>new</code>来实例化那个类。</p>
<h3 id="angular-中的依赖注入服务" tabindex="-1"><a class="header-anchor" href="#angular-中的依赖注入服务" aria-hidden="true">#</a> Angular 中的依赖注入服务</h3>
<p>在 Angular 中，服务就是一个带有<code v-pre>@Injectable</code>装饰器的类，它封装了可以在应用程序中复用的非 UI 逻辑和代码。Angular 把组件和服务分开，是为了增进模块化程度和可复用性。</p>
<p>用<code v-pre>@Injectable</code>标记一个类，以确保编译器将在注入类时生成必要的<RouterLink to="/angular/deep-into-angular/angular-design-metadata.html">元数据</RouterLink>（元数据在 Angular 中也是很重要的一部分），以创建类的依赖项。</p>
<p><code v-pre>@Injectable</code>装饰器的类会在编译之后，得到 Angular 可注入对象：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token comment">// 根据其 Injectable 元数据，编译 Angular 可注入对象，并对结果进行修补</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">compileInjectable</span><span class="token punctuation">(</span>type<span class="token operator">:</span> Type<span class="token operator">&lt;</span><span class="token builtin">any</span><span class="token operator">></span><span class="token punctuation">,</span> srcMeta<span class="token operator">?</span><span class="token operator">:</span> Injectable<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
  <span class="token comment">// 该编译过程依赖 @angular/compiler</span>
  <span class="token comment">// 可参考编译器中的 compileFactoryFunction compileInjectable 实现</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Angular 中可注入对象（<code v-pre>InjectableDef</code>）定义 DI 系统将如何构造 token 令牌，以及在哪些注入器（如果有）中可用：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">ɵɵInjectableDef<span class="token operator">&lt;</span><span class="token constant">T</span><span class="token operator">></span></span> <span class="token punctuation">{</span>
  <span class="token comment">// 指定给定类型属于特定注入器，包括 root/platform/any/null 以及特定的 NgModule</span>
  providedIn<span class="token operator">:</span> InjectorType<span class="token operator">&lt;</span><span class="token builtin">any</span><span class="token operator">></span> <span class="token operator">|</span> <span class="token string">"root"</span> <span class="token operator">|</span> <span class="token string">"platform"</span> <span class="token operator">|</span> <span class="token string">"any"</span> <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token comment">// 此定义所属的令牌</span>
  token<span class="token operator">:</span> <span class="token builtin">unknown</span><span class="token punctuation">;</span>
  <span class="token comment">// 要执行以创建可注入实例的工厂方法</span>
  <span class="token function-variable function">factory</span><span class="token operator">:</span> <span class="token punctuation">(</span>t<span class="token operator">?</span><span class="token operator">:</span> Type<span class="token operator">&lt;</span><span class="token builtin">any</span><span class="token operator">></span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token constant">T</span><span class="token punctuation">;</span>
  <span class="token comment">// 在没有显式注入器的情况下，存储可注入实例的位置</span>
  value<span class="token operator">:</span> <span class="token constant">T</span> <span class="token operator">|</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用<code v-pre>@Injectable()</code>的<code v-pre>providedIn</code>时，优化工具可以进行 Tree-shaking 优化，从而删除应用程序中未使用的服务，以减小捆绑包尺寸。</p>
<h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h2>
<p>本文简单介绍了在 Angular 依赖注入体系中比较关键的几个概念，主要包括<code v-pre>Injector</code>、<code v-pre>Provider</code>和<code v-pre>Injectable</code>。</p>
<p>对于注入器、提供者和可注入服务，我们可以简单地这样理解：</p>
<ol>
<li>注入器用于创建依赖，会维护一个容器来管理这些依赖，并尽可能地复用它们。</li>
<li>一个注入器中的依赖服务，只有一个实例。</li>
<li>注入器需要使用提供者来管理依赖，并通过 token（DI 令牌）来进行关联。</li>
<li>提供者用于高速注入器应该如何获取或创建依赖。</li>
<li>可注入服务类会根据元数据编译后，得到可注入对象，该对象可用于创建实例。</li>
</ol>
<h3 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h3>
<ul>
<li><a href="https://angular.cn/guide/dependency-injection" target="_blank" rel="noopener noreferrer">Angular-Angular 中的依赖注入<ExternalLinkIcon/></a></li>
<li><a href="https://angular.cn/guide/dependency-injection-providers" target="_blank" rel="noopener noreferrer">Angular-依赖提供者<ExternalLinkIcon/></a></li>
</ul>
</div></template>


