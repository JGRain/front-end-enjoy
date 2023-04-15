<template><div><p>本文用作对 Angular 中依赖注入的个人理解分享。</p>
<!--more-->
<p>关于依赖注入，Angular 从 1 升级到 4 依然锲而不舍，一定是有它的原因吧。</p>
<h2 id="依赖注入" tabindex="-1"><a class="header-anchor" href="#依赖注入" aria-hidden="true">#</a> 依赖注入</h2>
<h3 id="简要说明" tabindex="-1"><a class="header-anchor" href="#简要说明" aria-hidden="true">#</a> 简要说明</h3>
<ul>
<li><a href="https://zh.wikipedia.org/wiki/%E6%8E%A7%E5%88%B6%E5%8F%8D%E8%BD%AC" target="_blank" rel="noopener noreferrer">控制反转-wiki<ExternalLinkIcon/></a>
控制反转（Inversion of Control，缩写为 IoC），是面向对象编程中的一种设计原则，可以用来减低计算机代码之间的耦合度。</li>
</ul>
<p>其中最常见的方式叫做依赖注入（Dependency Injection，简称 DI）。</p>
<p>本骚年没写过 java，也不清楚 java 的依赖注入是否和 Angular 中的一样，因此以下的分享仅为个人理解，欢迎大家来一起探讨。</p>
<h3 id="理解依赖注入" tabindex="-1"><a class="header-anchor" href="#理解依赖注入" aria-hidden="true">#</a> 理解依赖注入</h3>
<p>为什么需要依赖注入呢？</p>
<p>工程化的设计其实对项目的快速拓展和高效开发是很有帮助的。像多人合作或者是长期维护的代码，如果人员间甚至是自身的时期阶段没有一些较好的约定，那么到后面开发和维护成本只会随着项目的成长而增加。</p>
<p>而这样一些磨合和生成共同约定的过程，也在不断地考验人的性能。像一些经历过无数遍被总结归纳的设定，有人开发了一些工具去帮助我们遵守这样的规则。
而所有的设计和架构，都是为了使得我们的工作更加高效。</p>
<p>依赖注入也是这样一个适配 Angular 应用场景的功能设计，只是把我们从原始代码不断整理、抽象和重构这样一个过程做了归纳，给予我们需要的东西。</p>
<p>不仅是依赖注入，像现在被大家槽得多前端太杂太乱、变化更新太快、工具框架层出不同，其实也都是因为有人发现了这些需求，并设计和整理出来方便使用的。
像这样一些分享的爆发、思维碰撞的高峰，其实都是推进生产力、或是演化历史的一个很棒的过程。</p>
<p>而本骚年是这么理解依赖注入的。</p>
<p>像我们组装台式机，自行选购主板、显卡、内存等等。而这些配件是由其他厂家生产制造包装好，配合说明书就可以直接使用的。</p>
<p>这样我们每组装一台台式机的过程，就会拿到这些成品配件然后拼装。对于具体的主板怎么造出来，里面又使用了什么方法和零件，我们并不需要关心。
当我们组装台式机的初始化过程，就已经提供了主板可以使用。</p>
<p>在项目中，体现为项目提供了这样一个注入机制，有人负责提供服务，有人负责消耗服务，而这样的机制提供了中间的接口，并替使用者进行了创建并初始化这样的处理。
我们只需要知道，拿到的是完整可用的服务就好了，至于这个服务内部的实现，甚至是它又依赖了怎样的其他服务，都不需要关注。</p>
<h2 id="angular-与依赖注入" tabindex="-1"><a class="header-anchor" href="#angular-与依赖注入" aria-hidden="true">#</a> Angular 与依赖注入</h2>
<h3 id="angular-依赖注入" tabindex="-1"><a class="header-anchor" href="#angular-依赖注入" aria-hidden="true">#</a> Angular 依赖注入</h3>
<p>Angular 官网上有句话：Angular 的依赖注入系统能够即时地创建和交付所依赖的服务。</p>
<p>本骚年想了很久，其他框架为什么不使用依赖注入呢？</p>
<p>其实像我们设计一个项目，自行封装的一些组件和服务，然后再对它们的新建和初始化等等，也经常需要用到依赖注入这种设计方式的。</p>
<p>我们的服务也可以分为有记忆的和无记忆的，关键在于抽象完的组件是否内部记录自身状态，以及怎样维护这个状态等等，甚至设计不合理的话，这样的状态管理会经常使我们感到困扰，所以 Redux、Flux 和 Mobx 这样的状态管理框架也就出现了。</p>
<p>而 Angular 在某种程度上替我们做了这样的工作，并提供我们使用。</p>
<p>像 Angular 的 release 版开始，有了<code v-pre>NgModule模块类</code>这样的概念，这跟依赖注入有什么关系呢？不着急，我们可以先简单介绍一下。</p>
<h3 id="ngmodule-模块类" tabindex="-1"><a class="header-anchor" href="#ngmodule-模块类" aria-hidden="true">#</a> NgModule 模块类</h3>
<p>Angular 模块把组件、指令和管道打包成内聚的功能块，每个模块聚焦于一个特性区域、业务领域、工作流或通用工具。
这里对于组件、指令和管道大家也不需要详细了解，暂时可以理解为一些封装好的功能视图组件吧。</p>
<p>我们要组装一个模块类，需要：</p>
<ol>
<li>声明哪些组件属于该模块。</li>
<li>公开某些类，以便其它的组件模板可以使用它们。即一处注册，多处使用。</li>
<li>导入其它模块，从其它模块中获得本模块所需的组件。</li>
<li>在应用程序级提供服务，以便应用中的任何组件都能使用它。</li>
</ol>
<p>第四点我们需要使用<code v-pre>provider</code>这样的参数字段，而作为最浅显的服务依赖注入便是通过<code v-pre>provider</code>进行的。</p>
<h3 id="provider-服务提供" tabindex="-1"><a class="header-anchor" href="#provider-服务提供" aria-hidden="true">#</a> provider 服务提供</h3>
<p>不管是在组件内，还是在模块内，我们使用<code v-pre>providers</code>的时候，就是进行了一次依赖注入的注册和初始化。</p>
<p>举例来说，我们有这样一个结构的应用：</p>
<div class="language-cmd line-numbers-mode" data-ext="cmd"><pre v-pre class="language-cmd"><code>根模块
├── 登录模块
│
├── 内部模块
│      ├── 头部面包屑 （需监听路由）
│      ├── 左侧菜单列 （需触发路由）
│      └── 展示内容
│
└── 其他服务、组件等 （路由服务在这里）
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果说我们分别在面包屑和菜单列使用<code v-pre>providers</code>，就相当于我们分别注册了两次路由服务。
这个时候，问题就会来了。因为我们注册了两次服务，所以我会获得两个实例，而这样的话，将导致我的面包屑和菜单列将无法获取到相同的路由事件。</p>
<p>所以，我们在根模块里面使用<code v-pre>providers</code>传入路由服务，就可以获得一个服务实例。
然后我们在子模块里面就可以直接使用该服务，获取同样的路由状态和事件。</p>
<h3 id="多级依赖注入" tabindex="-1"><a class="header-anchor" href="#多级依赖注入" aria-hidden="true">#</a> 多级依赖注入</h3>
<p>再谈<code v-pre>NgModule</code>和依赖注入的关系，其实模块类（<code v-pre>NgModule</code>）也就和组件一样，在依赖注入中的身份是一个注入器，作为容器提供依赖注入的接口。
在 Angular 更新 release 版本之后，<code v-pre>NgModule</code>的出现使得我们不需要再在一个组件中注入另外一个组件了，通过模块类（<code v-pre>NgModule</code>）的方式可以进行获取和共享。</p>
<p>我们会发现，一个 Angular 应用是一个组件树，同时每个组件实例都有自己的注入器，组件的树与注入器的树平行。</p>
<p>现在树结构已经在前端领域越来越流行了，浏览器的 DOM 树/CSS 规则树、React 的虚拟 DOM、以及 Angular（其实不只是 Angular）的组件树和注入器树。</p>
<p>上面也说道，并不是所有的组件都会注入服务的，所以有了&quot;注入器冒泡&quot;：</p>
<blockquote>
<p>当一个组件申请获得一个依赖时，Angular 先尝试用该组件自己的注入器来满足它。如果该组件的注入器没有找到对应的提供商，它就把这个申请转给它父组件的注入器来处理。</p>
</blockquote>
<h3 id="对比其他框架谈谈依赖注入" tabindex="-1"><a class="header-anchor" href="#对比其他框架谈谈依赖注入" aria-hidden="true">#</a> 对比其他框架谈谈依赖注入</h3>
<p>其实上面也简单提到过，像其他框架（React/Vue）中状态管理是通过组件传递、bus 总线、事件传递、或者是状态管理工具 Redux/Flux/Vuex 等进行。
通过前面几种方法，项目规模大了之后，如果少了一些约束或者是约定，则应用状态将会变得愈发不可控。</p>
<p>故我们有了状态管理系列工具，无非就是将需要共享或者传递的状态，通过公共的通道进行传输和触发更新，然后我们只需要在公共的通道里，找到想要定位的状态即可。
而不同的状态管理工具要结合不同框架使用，也需要对不用框架的组件状态更新方式（<code v-pre>setState()</code>之类的）进行适配和调整。</p>
<p>再回头看看 Angular，你会发现整个框架的设计都很不一样。
即使同样有生命周期、组件、数据绑定等等的东西，也有事件传递和监听。但在 Angular 里面我们常常通过服务来共享一些状态的，而这些管理状态和数据的服务，便是通过依赖注入的方式进行处理的。</p>
<p>所以归根到底，很多时候我们创建服务，是为了维护公用的状态和数据，通过依赖注入的方式来规定哪些组件可共享。
而在其他框架，我们要设计这样一个可根据不同场景单独使用或是共享的服务，则是需要自行添加初始化、新创建实例、共享实例等等方面的考虑和设计了。或者是，使用状态管理工具。</p>
<h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>关于组件和应用的状态管理一直是个比较棘手的问题，尤其是在项目规模变大之后问题就会更加显著。对于 Angular 的依赖注入，以及其他状态管理框架，不同的设计方式其实只是导致不同的约束和使用方法而已。<br>
当然，如果有具体的场景需求，还是可以结合实际需要来进行选型和调整的。</p>
</div></template>


