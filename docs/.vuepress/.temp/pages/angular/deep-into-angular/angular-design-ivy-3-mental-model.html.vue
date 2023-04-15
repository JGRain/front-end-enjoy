<template><div><p>作为“为大型前端项目”而设计的前端框架，Angular 其实有许多值得参考和学习的设计，本系列主要用于研究这些设计和功能的实现原理。本文围绕 Angular 的核心功能 Ivy 编译器，介绍其中 Ivy 的心智模型。</p>
<!--more-->
<p>上一篇<RouterLink to="/angular/deep-into-angular/angular-design-ivy-2-cli-compiler.html">11. Ivy 编译器之 CLI 编译器</RouterLink>中，我们介绍了 Angular 基于 TypeScript 的<code v-pre>tsc</code>编译能力之上，实现了 Angular 本身的一些特性能力，包括支持模板的类型检查、将文件和模块依赖关系生成到<code v-pre>d.ts</code>文件中，等等。</p>
<p>这部分的内容主要从 CLI 脚手架层面的编译出发，介绍在 Angular 中如何通过编译器处理代码的编译过程。本文我们主要关注 Angular 的模板编译过程，具体到装饰器的编译过程等。</p>
<h2 id="view-engine" tabindex="-1"><a class="header-anchor" href="#view-engine" aria-hidden="true">#</a> View Engine</h2>
<p>在 View Engine 中，编译器执行整个程序分析并生成模板和注入器定义，这些定义使用此全局知识来扁平化注入器作用域定义、将指令内联到组件中、预计算查询、预计算内容投影等。全局知识要求在编译模块时生成模块和组件工厂作为最后的全局步骤。如果任何传递信息发生变化，则需要重新生成所有工厂。</p>
<p>单独的组件和模块编译仅在模块定义级别和源代码中受支持。也就是说，npm 包必须包含生成工厂所需的元数据，它们本身不能包含生成的工厂。这是因为如果它们的任何依赖项发生变化，它们的工厂将无效，从而阻止它们在其依赖项中使用版本范围。</p>
<p>在源代码中，Angular 将 View Engine 的这种代码生成风格称为 Renderer2，当我们看到 render2 相关的代码，便是 View Engine 相关实现。相对的，当我们看到 render3 相关的代码，便是 Ivy 编译器的相关实现。</p>
<h2 id="ivy-模板编译" tabindex="-1"><a class="header-anchor" href="#ivy-模板编译" aria-hidden="true">#</a> Ivy 模板编译</h2>
<p>在前面<RouterLink to="/angular/deep-into-angular/angular-design-ivy-0-design.html">9.Ivy编译器整体设计</RouterLink>一文中，我有大概介绍 Ivy 编译的大概过程，包括：</p>
<ol>
<li>标记模板。</li>
<li>将标记内容解析为 HTML AST。</li>
<li>将 HTML AST 转换为 Angular 模板 AST。</li>
<li>将 Angular 模板 AST 转换为模板函数。</li>
</ol>
<p>前面提到，View Engine 中编译器生成模板和注入器时依赖全局知识，因此工厂是在构建最终应用程序时生成的。</p>
<p>Ivy 模板编译可以从字符串生成模板函数，而无需附加信息。但是，该字符串的正确解释需要选择器范围。选择器作用域是在运行时构建的（参考<RouterLink to="/angular/deep-into-angular/angular-design-ivy-1-view-data-and-node-injector.html">《10.Ivy编译器的视图数据和依赖解析》</RouterLink>），允许运行时使用仅从字符串构建的函数，只要给它一个在实例化期间使用的选择器作用域（例如<code v-pre>NgModule</code>）。</p>
<h3 id="ivy-心智模型" tabindex="-1"><a class="header-anchor" href="#ivy-心智模型" aria-hidden="true">#</a> Ivy 心智模型</h3>
<p>在 Ivy 中，运行时的设计允许单独编译，通过在运行时执行之前由编译器预先计算的大部分内容。这允许更改组件的定义，而无需重新编译依赖于它们的模块和组件。</p>
<p><strong>Ivy 的心智模型是：装饰器就是编译器。</strong></p>
<p>也就是说，装饰器可以被认为是类转换器的参数，该类转换器通过基于装饰器参数生成定义来转换类：</p>
<ul>
<li><code v-pre>@Component</code>装饰器通过添加<code v-pre>ɵcmp</code>静态属性来转换类</li>
<li><code v-pre>@Directive</code>添加<code v-pre>ɵdir</code></li>
<li><code v-pre>@Pipe</code>添加<code v-pre>ɵpipe</code>等</li>
</ul>
<p>在大多数情况下，提供给装饰器的值足以生成定义。但是，在解释模板的情况下，编译器需要知道为模板范围内的每个组件、指令和管道定义的选择器。</p>
<p>前面我们说过，Ivy 编译模型是将 Angular 装饰器（<code v-pre>@Injectable</code>等）编译为类 (<code v-pre>ɵprov</code>) 上的静态属性。此操作必须在没有全局程序知识的情况下进行，并且在大多数情况下仅需要知道该单个装饰器。因此在 Ivy 中，每个将单个装饰器转换为静态字段的“编译器”都将充当“纯函数”。</p>
<p>对于这种情况，在 Angular 中可使用元数据来维护这些数据。给定有关特定类型和装饰器的输入元数据，它将生成一个对象，该对象描述要添加到该类型的字段，以及该字段的初始化值（采用 AST 格式）。</p>
<h3 id="元数据" tabindex="-1"><a class="header-anchor" href="#元数据" aria-hidden="true">#</a> 元数据</h3>
<p>前面我在<RouterLink to="/angular/deep-into-angular/angular-design-metadata.html">《1.元数据和装饰器》</RouterLink>一文中介绍了编译时从装饰器产生元数据的过程，而在<RouterLink to="/angular/deep-into-angular/angular-design-ivy-2-cli-compiler.html">11. Ivy 编译器之 CLI 编译器</RouterLink>一文中介绍了 Angular 通过修改了 TypeScript 编译过程，从而将 Angular 中模块和文件间的依赖关系保存在生成的<code v-pre>d.ts</code>。</p>
<p>Angular 会转换<code v-pre>.js</code>文件和<code v-pre>.d.ts</code>文件以反映 Angular 装饰器的内容，然后将其删除。除了在类型检查和引用反转期间，这种转换是逐个文件完成的，没有全局知识。</p>
<p>比如，这样一个<code v-pre>Component</code>文件：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Component<span class="token punctuation">,</span> Input <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@angular/core"</span><span class="token punctuation">;</span>

<span class="token decorator"><span class="token at operator">@</span><span class="token function">Component</span></span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  selector<span class="token operator">:</span> <span class="token string">"greet"</span><span class="token punctuation">,</span>
  template<span class="token operator">:</span> <span class="token string">"&lt;div> Hello, {{name}}! &lt;/div>"</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">GreetComponent</span> <span class="token punctuation">{</span>
  <span class="token decorator"><span class="token at operator">@</span><span class="token function">Input</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span> name<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>经<code v-pre>ngtsc</code>编译后，会包括该组件的<code v-pre>.js</code>文件：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">const</span> i0 <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"@angular/core"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">class</span> <span class="token class-name">GreetComponent</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
GreetComponent<span class="token punctuation">.</span>ɵcmp <span class="token operator">=</span> i0<span class="token punctuation">.</span><span class="token function">ɵɵdefineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">type</span><span class="token operator">:</span> GreetComponent<span class="token punctuation">,</span>
  <span class="token literal-property property">tag</span><span class="token operator">:</span> <span class="token string">"greet"</span><span class="token punctuation">,</span>
  <span class="token function-variable function">factory</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token keyword">new</span> <span class="token class-name">GreetComponent</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token function-variable function">template</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">rf<span class="token punctuation">,</span> ctx</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>rf <span class="token operator">&amp;</span> RenderFlags<span class="token punctuation">.</span>Create<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      i0<span class="token punctuation">.</span><span class="token function">ɵɵelementStart</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token string">"div"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      i0<span class="token punctuation">.</span><span class="token function">ɵɵtext</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      i0<span class="token punctuation">.</span><span class="token function">ɵɵelementEnd</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>rf <span class="token operator">&amp;</span> RenderFlags<span class="token punctuation">.</span>Update<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      i0<span class="token punctuation">.</span><span class="token function">ɵɵadvance</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      i0<span class="token punctuation">.</span><span class="token function">ɵɵtextInterpolate1</span><span class="token punctuation">(</span><span class="token string">"Hello "</span><span class="token punctuation">,</span> ctx<span class="token punctuation">.</span>name<span class="token punctuation">,</span> <span class="token string">"!"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以及带有装饰器元数据信息的<code v-pre>.d.ts</code>文件：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> i0 <span class="token keyword">from</span> <span class="token string">"@angular/core"</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">GreetComponent</span> <span class="token punctuation">{</span>
  <span class="token keyword">static</span> ɵcmp<span class="token operator">:</span> i0<span class="token punctuation">.</span>NgComponentDef<span class="token operator">&lt;</span>GreetComponent<span class="token punctuation">,</span> <span class="token string">"greet"</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> input<span class="token operator">:</span> <span class="token string">"input"</span> <span class="token punctuation">}</span><span class="token operator">></span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>引用反转和类型检查所需的信息包含在<code v-pre>.d.ts</code>中<code v-pre>ɵcmp</code>的类型声明中。</p>
<h3 id="npm-上现有代码的兼容" tabindex="-1"><a class="header-anchor" href="#npm-上现有代码的兼容" aria-hidden="true">#</a> NPM 上现有代码的兼容</h3>
<p>如今存在于 NPM 上的 Angular 库以 Angular 包的格式分发，其中详细说明了所交付的工件，包括 ES2015 和 ESM（ES5 + ES2015 模块）风格的已编译<code v-pre>.js</code>文件、<code v-pre>.d.ts</code>文件和<code v-pre>.metadata.json</code>文件。其中，<code v-pre>.js</code>文件删除了 Angular 装饰器信息，而<code v-pre>.metadata.json</code>文件以替代格式保留装饰器元数据。</p>
<p>我们已经知道，在 Ivy 中，在工厂中生成的信息现在在 Angular 中作为定义生成，在 Angular 装饰类中作为静态字段生成。View Engine(Renderer2) 要求在构建最终应用程序时，还要生成所有库的所有工厂。在 Ivy 中，定义是在编译库时生成的。</p>
<p>Ivy 编译可以通过为它们生成工厂、并在运行时将静态属性回补到类中来适应 View Engine 目标库。比如：</p>
<ul>
<li>当应用程序包含 View Engine 目标库时，Ivy 定义需要回补到组件、指令、模块、管道和可注入类</li>
<li>可以在生成它的同一位置生成<code v-pre>NgModuleFactory</code>的实现，<code v-pre>NgModuleFactory</code>的这个实现将在通过调用函数创建第一个模块实例时，对 View Engine 样式类进行回补丁</li>
</ul>
<p>同样的，Ivy 编译后的产物与 View Engine 的不同之处在于声明包含在生成的输出中，并且应该包含在发布到 npm 的包中。</p>
<p>因此，编译后的产物仍然需要包含<code v-pre>.metadata.json</code>文件，它们会按如下所述进行转换：</p>
<ul>
<li>当编译器向类添加声明时，它也会转换<code v-pre>.metadata.json</code>文件以反映添加到类中的新静态字段</li>
<li>一旦将静态字段添加到元数据中，Ivy 编译器就不再需要装饰器中的信息</li>
</ul>
<h3 id="转换元数据" tabindex="-1"><a class="header-anchor" href="#转换元数据" aria-hidden="true">#</a> 转换元数据</h3>
<p>View Engine 中使用<code v-pre>.metadata.json</code>文件来存储直接从<code v-pre>.ts</code>文件推断的信息，并包含 TypeScript 生成的<code v-pre>.d.ts</code>文件中未包含的值信息。</p>
<p>Ivy 中，某个类的元数据被转换为 Ivy 编译器生成的转换后的<code v-pre>.js</code>文件的元数据。</p>
<p>例如，一个组件的<code v-pre>@Component</code>被编译器删除并替换为<code v-pre>ɵcmp</code>，<code v-pre>.metadata.json</code>文件也进行了类似的转换，但省略了分配值的内容（例如<code v-pre>“ɵcmp”：{}</code>）。 编译器不记录为组件声明的选择器，但需要生成<code v-pre>ngModuleScope</code>以便记录信息。构建所需的信息需要<code v-pre>ngModuleScope</code>从指令和管道传送到声明它们的模块。</p>
<p><code v-pre>@Component</code>组件的元数据通过以下方式转换：</p>
<ol>
<li>删除<code v-pre>@Component</code>指令。</li>
<li>添加<code v-pre>&quot;ɵcmp&quot;: {}</code>静态字段。</li>
<li>添加<code v-pre>&quot;ngSelector&quot;: &lt;selector-value&gt;</code>静态字段。</li>
</ol>
<p>比如以下例子：</p>
<div class="language-typescript line-numbers-mode" data-ext="ts"><pre v-pre class="language-typescript"><code><span class="token comment">// my.component.ts</span>
<span class="token decorator"><span class="token at operator">@</span><span class="token function">Component</span></span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  selector<span class="token operator">:</span> <span class="token string">"my-comp"</span><span class="token punctuation">,</span>
  template<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">&lt;h1>Hello, {{ name }}!&lt;/h1></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">MyComponent</span> <span class="token punctuation">{</span>
  <span class="token decorator"><span class="token at operator">@</span><span class="token function">Input</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span> name<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>会生成：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// my.component.js</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">MyComponent</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> string<span class="token punctuation">;</span>
  <span class="token keyword">static</span> ɵcmp <span class="token operator">=</span> <span class="token function">ɵɵdefineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token operator">...</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以及元数据信息：</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"__symbolic"</span><span class="token operator">:</span> <span class="token string">"module"</span><span class="token punctuation">,</span>
  <span class="token property">"version"</span><span class="token operator">:</span> <span class="token number">4</span><span class="token punctuation">,</span>
  <span class="token property">"metadata"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"MyComponent"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">"__symbolic"</span><span class="token operator">:</span> <span class="token string">"class"</span><span class="token punctuation">,</span>
      <span class="token property">"statics"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">"ɵcmp"</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token property">"ngSelector"</span><span class="token operator">:</span> <span class="token string">"my-comp"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>同样的，<code v-pre>@Directive</code>、<code v-pre>@Pipe</code>等其他装饰器也是相类似的处理，这里不多介绍。</p>
<h3 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h3>
<p>Angular 的设计真的是太多太多啦，研究了好久还没研究到具体编译的地方，不过讲到目前这里，其实我们已经对 Ivy 编译器的整体情况有个大概的了解，包括基于 Ivy 编译模型下的组件、指令、管道等装饰器的编译过程和产物，以及它与 View Engine 更优的地方、兼容的处理。</p>
<p>而关于 Ivy 中的变更检测、AOT/JIT、Tree-shaking 等内容，会在后面继续研究分析~</p>
<h3 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h3>
<ul>
<li><a href="https://github.com/angular/angular/blob/master/packages/compiler/design/architecture.md" target="_blank" rel="noopener noreferrer">DESIGN DOC(Ivy): Compiler Architecture<ExternalLinkIcon/></a></li>
<li><a href="https://github.com/angular/angular/blob/master/packages/compiler/design/separate_compilation.md" target="_blank" rel="noopener noreferrer">DESIGN DOC (Ivy): Separate Compilation<ExternalLinkIcon/></a></li>
<li><a href="https://indepth.dev/posts/1062/ivy-engine-in-angular-first-in-depth-look-at-compilation-runtime-and-change-detection" target="_blank" rel="noopener noreferrer">Ivy engine in Angular: first in-depth look at compilation, runtime and change detection<ExternalLinkIcon/></a></li>
</ul>
</div></template>


