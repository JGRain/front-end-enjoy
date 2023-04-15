<template><div><p>该系列用于探索一些 Angular 中灵活或者新的用法。本文简单介绍封装使用 ngModol 实现自定义表单控件的过程。</p>
<!--more-->
<h2 id="ngmodel-相关" tabindex="-1"><a class="header-anchor" href="#ngmodel-相关" aria-hidden="true">#</a> NgModel 相关</h2>
<h3 id="ngmodel" tabindex="-1"><a class="header-anchor" href="#ngmodel" aria-hidden="true">#</a> NgModel</h3>
<p><code v-pre>NgModel</code>用于从作用域创建一个<code v-pre>FormControl</code>实例，并将它绑定到一个表单控制元素。</p>
<ul>
<li><code v-pre>[ngModel]</code>: 单向绑定，作用域变更将同步到 UI 木板</li>
<li><code v-pre>[(ngModel)]</code>: 双向绑定，UI 模版的变更也将同步到作用域</li>
</ul>
<p><code v-pre>NgModel</code>继承自<code v-pre>NgControl</code>。</p>
<h3 id="ngcontrol" tabindex="-1"><a class="header-anchor" href="#ngcontrol" aria-hidden="true">#</a> NgControl</h3>
<p><code v-pre>NgControl</code>是所有控制指令继承的基础类。它将一个<code v-pre>FormControl</code>绑定到 DOM 元素。</p>
<p><code v-pre>FormControl</code>、<code v-pre>FormGroup</code>和<code v-pre>FormArray</code>，三者都用于 angular 表单的值和状态的跟踪，区别在于是一个控件、一组控件或者是它们的组合。</p>
<p><code v-pre>AbstractControl</code>是三个具体表单类的抽象基类。并为它们提供了一些共同的行为和属性，其中有些是可观察对象（<code v-pre>Observable</code>）。
<code v-pre>FormControl</code>用于跟踪一个单独的表单控件的值和有效性状态。它对应于一个 HTML 表单控件，比如输入框和下拉框。
<code v-pre>FormGroup</code>用于跟踪一组<code v-pre>AbstractControl</code>的实例的值和有效性状态。该组的属性中包含了它的子控件。组件中的顶级表单就是一个<code v-pre>FormGroup</code>。
<code v-pre>FormArray</code>用于跟踪<code v-pre>AbstractControl</code>实例组成的有序数组的值和有效性状态。</p>
<h3 id="controlvalueaccessor" tabindex="-1"><a class="header-anchor" href="#controlvalueaccessor" aria-hidden="true">#</a> ControlValueAccessor</h3>
<p><code v-pre>ControlValueAccessor</code>用于在控制和原生元素之间建立联系，它封装了赋值到一个表现为<code v-pre>input</code>元素的 DOM 元素。</p>
<p>简单说，就是 angular 中的 input 是带有<code v-pre>[(ngModel)]</code>这个属性的，而我们想要自己控制这个 input 的写入过程，使用<code v-pre>ControlValueAccessor</code>就可以做到。</p>
<p><code v-pre>ControlValueAccessor</code>提供以下接口：</p>
<ul>
<li><code v-pre>writeValue(obj: any) : void</code>: 写入值到元素</li>
<li><code v-pre>registerOnChange(fn: any) : void</code>: 设置当控件接收到<code v-pre>change</code>事件时触发的回调</li>
<li><code v-pre>registerOnTouched(fn: any) : void</code>: 设置当控件接收到<code v-pre>touch</code>事件时触发的回调</li>
<li><code v-pre>setDisabledState(isDisabled: boolean) : void</code>: 该函数将在控件状态或者<code v-pre>disabled</code>值变化，根据值来对元素启用或失效</li>
</ul>
<p><code v-pre>ControlValueAccessor</code>继承自<code v-pre>DefaultValueAccessor</code>。</p>
<h3 id="defaultvalueaccessor" tabindex="-1"><a class="header-anchor" href="#defaultvalueaccessor" aria-hidden="true">#</a> DefaultValueAccessor</h3>
<p><code v-pre>DefaultValueAccessor</code>提供值写入和监听变化的默认访问，像<code v-pre>NgModel</code>, <code v-pre>FormControlDirective</code>, 和<code v-pre>FormControlName</code>指令会使用。</p>
<p><code v-pre>DefaultValueAccessor</code>提供类包括：</p>
<ul>
<li><code v-pre>onChange : (_: any) =&gt; {}</code>: <code v-pre>change</code>事件变化监听</li>
<li><code v-pre>onTouched : () =&gt; {}</code>: <code v-pre>touch</code>事件变化监听</li>
</ul>
<p>以及<code v-pre>ControlValueAccessor</code>（上面）的接口。</p>
<h3 id="ng-value-accessor" tabindex="-1"><a class="header-anchor" href="#ng-value-accessor" aria-hidden="true">#</a> NG_VALUE_ACCESSOR</h3>
<p><code v-pre>NG_VALUE_ACCESSOR</code>提供一个<code v-pre>ControlValueAccessor</code>供表单控制使用。</p>
<h2 id="时间选择控件" tabindex="-1"><a class="header-anchor" href="#时间选择控件" aria-hidden="true">#</a> 时间选择控件</h2>
<h3 id="datetimepicker" tabindex="-1"><a class="header-anchor" href="#datetimepicker" aria-hidden="true">#</a> datetimepicker</h3>
<p>这里我们主要使用一个 Bootstrap 和 jQuery 的日期时间选择器插件--<a href="http://www.bootcss.com/p/bootstrap-datetimepicker/" target="_blank" rel="noopener noreferrer">bootstrap-datetimepick<ExternalLinkIcon/></a>。</p>
<p>先简单介绍一下，我们可以使用该插件方便地进行日期和时间选择，从最大的十年视图到最小的分钟选择都可以自行调整。
具体一些配置项大家可以到官网上查看，这里就不详细介绍了，后面代码用到的会简单进行说明。</p>
<p>首先我们需要下载代码，这里放在了<code v-pre>assets/plugins/datepicker</code>文件夹里面。</p>
<p>然后添加进我们的应用程序就可以使用了：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// boostrap.ts</span>
<span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"./assets/plugins/datepicker/bootstrap-datetimepicker.min.js"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"./assets/plugins/datepicker/bootstrap-datetimepicker.zh-CN.js"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="创建自定义-input-控件" tabindex="-1"><a class="header-anchor" href="#创建自定义-input-控件" aria-hidden="true">#</a> 创建自定义 input 控件</h3>
<p>我们想要封装后的组件跟原生的 angular 组件一样，像表现为 input 的自定义控件，我们想要使用<code v-pre>[(ngModel)]</code>来进行双向绑定，我们需要使用<code v-pre>ControlValueAccessor</code>来拓展。</p>
<p>而这里<code v-pre>ControlValueAccessor</code>只是一个接口，我们应用它，还需要获取一些可用的服务，这时候需要注入<code v-pre>NG_VALUE_ACCESSOR</code>。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token constant">CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR</span><span class="token operator">:</span> any <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">provide</span><span class="token operator">:</span> <span class="token constant">NG_VALUE_ACCESSOR</span><span class="token punctuation">,</span>
  <span class="token literal-property property">useExisting</span><span class="token operator">:</span> <span class="token function">forwardRef</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> CustomInputComponent<span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token literal-property property">multi</span><span class="token operator">:</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里简单讲讲几个概念：</p>
<ol>
<li>我们自定义了一个访问控制服务，该服务包装为<code v-pre>NG_VALUE_ACCESSOR</code>服务，主要用于控制<code v-pre>ControlValueAccessor</code>相关的访问。</li>
<li>我们需要将自定义 input 控件提供给<code v-pre>NG_VALUE_ACCESSOR</code>，以便通过自定义方式控制父组件的<code v-pre>[(ngModel)]</code>以及其他表单相关的访问。</li>
<li><code v-pre>forwardRef</code>用于将目前还未获取到的依赖关联起来，这里我们关联后面的自定义 Input 组件。</li>
</ol>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>@<span class="token function">Component</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token literal-property property">selector</span><span class="token operator">:</span> <span class="token string">'custom-input'</span><span class="token punctuation">,</span>
    <span class="token literal-property property">template</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">&lt;input [(ngModel)]="value" class="form-control" (blur)="onBlur()" /></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>
    <span class="token literal-property property">providers</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token constant">CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR</span><span class="token punctuation">]</span> <span class="token comment">// 注入访问控制服务</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token comment">// 继承ControlValueAccessor接口</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">CustomInputComponent</span> <span class="token keyword">implements</span> <span class="token class-name">ControlValueAccessor</span><span class="token punctuation">{</span>

    <span class="token comment">// 内部model值</span>
    <span class="token keyword">private</span> <span class="token literal-property property">innerValue</span><span class="token operator">:</span> any <span class="token operator">=</span> <span class="token string">''</span><span class="token punctuation">;</span>

    <span class="token comment">// 定义ControlValueAccessor提供的事件回调</span>
    <span class="token keyword">private</span> <span class="token function-variable function">onTouched</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token keyword">void</span> <span class="token operator">=</span> noop<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token function-variable function">onChange</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">_</span><span class="token operator">:</span> any</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token keyword">void</span> <span class="token operator">=</span> noop<span class="token punctuation">;</span>

    <span class="token comment">// 获取值的访问</span>
    <span class="token keyword">get</span> <span class="token function">value</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> any <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>innerValue<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>

    <span class="token comment">// 设置值，同时触发change回调</span>
    <span class="token keyword">set</span> <span class="token function">value</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">v</span><span class="token operator">:</span> any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>v <span class="token operator">!==</span> <span class="token keyword">this</span><span class="token punctuation">.</span>innerValue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>innerValue <span class="token operator">=</span> v<span class="token punctuation">;</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">onChange</span><span class="token punctuation">(</span>v<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 失焦时触发回调</span>
    <span class="token function">onBlur</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">onTouched</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 表单ControlValueAccessor接口</span>
    <span class="token function">writeValue</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">value</span><span class="token operator">:</span> any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>value <span class="token operator">!==</span> <span class="token keyword">this</span><span class="token punctuation">.</span>innerValue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>innerValue <span class="token operator">=</span> value<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 表单ControlValueAccessor接口</span>
    <span class="token function">registerOnChange</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">fn</span><span class="token operator">:</span> any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>onChange <span class="token operator">=</span> fn<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 表单ControlValueAccessor接口</span>
    <span class="token function">registerOnTouched</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">fn</span><span class="token operator">:</span> any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>onTouched <span class="token operator">=</span> fn<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>具体的实现实例参考<a href="https://embed.plnkr.co/nqKUSPWb6w5QXr8a0wEu/?show=preview" target="_blank" rel="noopener noreferrer">Angular2 + Connect custom component to ngModel<ExternalLinkIcon/></a>。</p>
<h3 id="创建自定义时间选择控件" tabindex="-1"><a class="header-anchor" href="#创建自定义时间选择控件" aria-hidden="true">#</a> 创建自定义时间选择控件</h3>
<p>像我们定义一个时间选择控件，一般需要对外提供一些配置：</p>
<ul>
<li>选择精度（或自定义视图范围）
<ul>
<li>这里提供：分钟（默认）、小时和天</li>
</ul>
</li>
<li>可选日期范围</li>
<li>是否禁用</li>
<li>是否必填</li>
<li>...</li>
</ul>
<p>以及通常我们提供一个值变更的回调，像<code v-pre>(change)</code>这样的事件。
下面看看代码实现：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span>Component<span class="token punctuation">,</span> Input<span class="token punctuation">,</span> AfterViewInit<span class="token punctuation">,</span> ElementRef<span class="token punctuation">,</span> EventEmitter<span class="token punctuation">,</span> Output<span class="token punctuation">,</span> forwardRef<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>ControlValueAccessor<span class="token punctuation">,</span> <span class="token constant">NG_VALUE_ACCESSOR</span><span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/forms'</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token constant">CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR</span><span class="token operator">:</span> any <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">provide</span><span class="token operator">:</span> <span class="token constant">NG_VALUE_ACCESSOR</span><span class="token punctuation">,</span>
  <span class="token literal-property property">useExisting</span><span class="token operator">:</span> <span class="token function">forwardRef</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> DateTimePickerComponent<span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token literal-property property">multi</span><span class="token operator">:</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

@<span class="token function">Component</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">selector</span><span class="token operator">:</span> <span class="token string">'date-time-picker'</span><span class="token punctuation">,</span>
  <span class="token literal-property property">template</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">&lt;input type="text" class="form-control" [disabled]="disabled" [(ngModel)]="value" (blur)="onBlur()" /></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>
  <span class="token literal-property property">providers</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token constant">CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token comment">// ControlValueAccessor: A bridge between a control and a native element.</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">DateTimePickerComponent</span> <span class="token keyword">implements</span> <span class="token class-name">AfterViewInit</span><span class="token punctuation">,</span> ControlValueAccessor <span class="token punctuation">{</span>
  @<span class="token function">Input</span><span class="token punctuation">(</span><span class="token punctuation">)</span> accuracy<span class="token operator">:</span> string<span class="token punctuation">;</span>  <span class="token comment">// 日期选择的精度，默认分钟，可选 (hour | day)</span>
  @<span class="token function">Input</span><span class="token punctuation">(</span><span class="token punctuation">)</span> startDate<span class="token operator">:</span> string<span class="token punctuation">;</span> <span class="token comment">// 可选最早日期</span>
  @<span class="token function">Input</span><span class="token punctuation">(</span><span class="token punctuation">)</span> endDate<span class="token operator">:</span> string<span class="token punctuation">;</span> <span class="token comment">// 可选最晚日期</span>
  @<span class="token function">Input</span><span class="token punctuation">(</span><span class="token punctuation">)</span> maxView<span class="token operator">:</span> string<span class="token punctuation">;</span> <span class="token comment">// 最大视图</span>
  @<span class="token function">Input</span><span class="token punctuation">(</span><span class="token punctuation">)</span> disabled<span class="token operator">:</span> boolean <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span> <span class="token comment">// 是否禁用</span>

  @<span class="token function">Output</span><span class="token punctuation">(</span><span class="token punctuation">)</span> change <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">EventEmitter</span><span class="token operator">&lt;</span>any<span class="token operator">></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// input的change事件回调</span>

  <span class="token keyword">private</span> el<span class="token punctuation">;</span> <span class="token comment">// 控件元素</span>
  <span class="token keyword">private</span> <span class="token literal-property property">model</span><span class="token operator">:</span> any<span class="token punctuation">;</span> <span class="token comment">// 内部model值</span>

  <span class="token comment">// 定义ControlValueAccessor提供的事件回调</span>
  <span class="token keyword">private</span> <span class="token function-variable function">onChange</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">_</span><span class="token operator">:</span> any</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token keyword">void</span><span class="token punctuation">;</span>
  <span class="token keyword">private</span> <span class="token function-variable function">onTouched</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token keyword">void</span><span class="token punctuation">;</span>

  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">el</span><span class="token operator">:</span> ElementRef</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>el <span class="token operator">=</span> el<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// Lifecycle hook that is called after a component's view has been fully initialized.</span>
  <span class="token function">ngAfterViewInit</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">/*
     source:http://www.bootcss.com/p/bootstrap-datetimepicker/
     minView: default 2
     maxView: default 4
     0 or 'hour' for the hour view （小时视图）
     1 or 'day' for the day view 0-24h （日视图）
     2 or 'month' for month view (the default) （月视图）
     3 or 'year' for the 12-month overview （年视图）
     4 or 'decade' for the 10-year overview. Useful for date-of-birth datetimepickers. （十年视图）
     */</span>
    <span class="token keyword">let</span> format <span class="token operator">=</span> <span class="token string">'yyyy-mm-dd hh:ii:00'</span><span class="token punctuation">;</span> <span class="token comment">// 默认选择分钟，故秒数为00，datetimepicker不支持秒数的选择</span>
    <span class="token keyword">let</span> minView <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> <span class="token comment">// 默认最小视图为分钟</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>accuracy <span class="token operator">===</span> <span class="token string">'hour'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      format <span class="token operator">=</span> <span class="token string">'yyyy-mm-dd hh:00'</span><span class="token punctuation">;</span> <span class="token comment">// 设置为小时，分钟和秒数需为00</span>
      minView <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span> <span class="token comment">// 最小视图为小时</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>accuracy <span class="token operator">===</span> <span class="token string">'day'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      format <span class="token operator">=</span> <span class="token string">'yyyy-mm-dd 00:00:00'</span><span class="token punctuation">;</span> <span class="token comment">// 设置为天</span>
      minView <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span> <span class="token comment">// 最小视图为日期</span>
    <span class="token punctuation">}</span>

    <span class="token function">$</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>el<span class="token punctuation">.</span>nativeElement<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">find</span><span class="token punctuation">(</span><span class="token string">'input'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">datetimepicker</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">language</span><span class="token operator">:</span> <span class="token string">'zh-CN'</span><span class="token punctuation">,</span>
      <span class="token literal-property property">autoclose</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">// 选择日期后自动关闭</span>
      <span class="token literal-property property">maxView</span><span class="token operator">:</span> <span class="token function">parseInt</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>maxView<span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token number">4</span><span class="token punctuation">,</span> <span class="token comment">// 选择的最大视图，4为十年视图</span>
      <span class="token literal-property property">startDate</span><span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>startDate <span class="token operator">||</span> <span class="token string">''</span><span class="token punctuation">,</span> <span class="token comment">// 最早可选日期，默认不限制</span>
      <span class="token literal-property property">endDate</span><span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>endDate <span class="token operator">||</span> <span class="token string">''</span><span class="token punctuation">,</span> <span class="token comment">// 最晚可选日期，默认不限制</span>
      format<span class="token punctuation">,</span> <span class="token comment">// 格式化</span>
      minView<span class="token punctuation">,</span> <span class="token comment">// 选择的最小视图</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">'hide'</span><span class="token punctuation">,</span> <span class="token parameter">ev</span> <span class="token operator">=></span> <span class="token punctuation">{</span> <span class="token comment">// 这里需要注意，我们使用箭头函数() => {}，则不会更改this的指向</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> <span class="token function">$</span><span class="token punctuation">(</span>ev<span class="token punctuation">.</span>target<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">val</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 更新值</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>change<span class="token punctuation">.</span><span class="token function">emit</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token literal-property property">value</span><span class="token operator">:</span> <span class="token function">$</span><span class="token punctuation">(</span>ev<span class="token punctuation">.</span>target<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">val</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 触发回调</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 获取值的访问</span>
  <span class="token keyword">get</span> <span class="token function">value</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> any <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>model<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 设置值，同时触发change回调</span>
  <span class="token keyword">set</span> <span class="token function">value</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">v</span><span class="token operator">:</span> any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>v <span class="token operator">!==</span> <span class="token keyword">this</span><span class="token punctuation">.</span>model<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>model <span class="token operator">=</span> v<span class="token punctuation">;</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">onChange</span><span class="token punctuation">(</span>v<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 失焦时触发回调</span>
  <span class="token function">onBlur</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">onTouched</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 父组件的值变更时，更新model的值</span>
  <span class="token function">writeValue</span><span class="token punctuation">(</span>value<span class="token operator">:</span> string<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span><span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>value <span class="token operator">!==</span> <span class="token keyword">this</span><span class="token punctuation">.</span>model<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>model <span class="token operator">=</span> value<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 表单ControlValueAccessor接口</span>
  <span class="token function">registerOnChange</span><span class="token punctuation">(</span><span class="token function-variable function">fn</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">_</span><span class="token operator">:</span> any</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>onChange <span class="token operator">=</span> fn<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 表单ControlValueAccessor接口</span>
  <span class="token function">registerOnTouched</span><span class="token punctuation">(</span><span class="token function-variable function">fn</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>onTouched <span class="token operator">=</span> fn<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="抽象出-class-继承" tabindex="-1"><a class="header-anchor" href="#抽象出-class-继承" aria-hidden="true">#</a> 抽象出 class 继承</h3>
<p>我们可以把相同的方法抽象出来，通过继承的方式，这样就能在多个相似组件通用了。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span>forwardRef<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/core'</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>ControlValueAccessor<span class="token punctuation">,</span> <span class="token constant">NG_VALUE_ACCESSOR</span><span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@angular/forms'</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">customInputAccessor</span><span class="token punctuation">(</span><span class="token parameter">component</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">provide</span><span class="token operator">:</span> <span class="token constant">NG_VALUE_ACCESSOR</span><span class="token punctuation">,</span>
        <span class="token literal-property property">useExisting</span><span class="token operator">:</span> <span class="token function">forwardRef</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> component<span class="token punctuation">)</span><span class="token punctuation">,</span>
        <span class="token literal-property property">multi</span><span class="token operator">:</span> <span class="token boolean">true</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">CustomInputComponent</span> <span class="token keyword">implements</span> <span class="token class-name">ControlValueAccessor</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token literal-property property">model</span><span class="token operator">:</span> any<span class="token punctuation">;</span> <span class="token comment">// 控件的值</span>
    <span class="token keyword">private</span> <span class="token function-variable function">onChange</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">_</span><span class="token operator">:</span> any</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token function-variable function">onTouched</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token keyword">void</span><span class="token punctuation">;</span>

    <span class="token comment">// get accessor</span>
    <span class="token keyword">get</span> <span class="token function">value</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> any <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>model<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// set accessor including call the onchange callback</span>
    <span class="token keyword">set</span> <span class="token function">value</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">v</span><span class="token operator">:</span> any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>v <span class="token operator">!==</span> <span class="token keyword">this</span><span class="token punctuation">.</span>model<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>model <span class="token operator">=</span> v<span class="token punctuation">;</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">onChange</span><span class="token punctuation">(</span>v<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// Set touched on blur</span>
    <span class="token function">onBlur</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">onTouched</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token function">writeValue</span><span class="token punctuation">(</span>value<span class="token operator">:</span> string<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span><span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>value <span class="token operator">!==</span> <span class="token keyword">this</span><span class="token punctuation">.</span>model<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>model <span class="token operator">=</span> value<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// Set the function to be called when the control receives a change event.</span>
    <span class="token function">registerOnChange</span><span class="token punctuation">(</span><span class="token function-variable function">fn</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">_</span><span class="token operator">:</span> any</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>onChange <span class="token operator">=</span> fn<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// registerOnTouched(fn: any) : void</span>
    <span class="token function">registerOnTouched</span><span class="token punctuation">(</span><span class="token function-variable function">fn</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>onTouched <span class="token operator">=</span> fn<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 datetimepick 中继承：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span>CustomInputComponent<span class="token punctuation">,</span> customInputAccessor<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'../class/custom-input.class'</span><span class="token punctuation">;</span>

@<span class="token function">Component</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">selector</span><span class="token operator">:</span> <span class="token string">'date-time-picker'</span><span class="token punctuation">,</span>
  <span class="token literal-property property">template</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">&lt;input type="text" class="form-control" [disabled]="disabled" [(ngModel)]="value" (blur)="onBlur()" /></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>
  <span class="token literal-property property">providers</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token function">customInputAccessor</span><span class="token punctuation">(</span>DateTimePickerComponent<span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">DateTimePickerComponent</span> <span class="token keyword">extends</span> <span class="token class-name">CustomInputComponent</span> <span class="token keyword">implements</span> <span class="token class-name">AfterViewInit</span> <span class="token punctuation">{</span>
  @<span class="token function">Input</span><span class="token punctuation">(</span><span class="token punctuation">)</span> accuracy<span class="token operator">:</span> string<span class="token punctuation">;</span>  <span class="token comment">// 日期选择的精度，默认分钟，可选 (hour | day)</span>
  @<span class="token function">Input</span><span class="token punctuation">(</span><span class="token punctuation">)</span> startDate<span class="token operator">:</span> string<span class="token punctuation">;</span> <span class="token comment">// 可选最早日期</span>
  @<span class="token function">Input</span><span class="token punctuation">(</span><span class="token punctuation">)</span> endDate<span class="token operator">:</span> string<span class="token punctuation">;</span> <span class="token comment">// 可选最晚日期</span>
  @<span class="token function">Input</span><span class="token punctuation">(</span><span class="token punctuation">)</span> maxView<span class="token operator">:</span> string<span class="token punctuation">;</span> <span class="token comment">// 最大视图</span>
  @<span class="token function">Input</span><span class="token punctuation">(</span><span class="token punctuation">)</span> disabled<span class="token operator">:</span> boolean <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span> <span class="token comment">// 是否禁用</span>

  @<span class="token function">Output</span><span class="token punctuation">(</span><span class="token punctuation">)</span> change <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">EventEmitter</span><span class="token operator">&lt;</span>any<span class="token operator">></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// input的change事件回调</span>

  <span class="token keyword">private</span> el<span class="token punctuation">;</span> <span class="token comment">// 控件元素</span>

  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">el</span><span class="token operator">:</span> ElementRef</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">super</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 继承</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>el <span class="token operator">=</span> el<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">ngAfterViewInit</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 原本的内容</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>效果图：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1495970682(1).png" alt="image"></p>
<h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>这节我们讲了自定义表单相关的一些概念，以及自定义一个时间选择 input 表单的实现过程。<br>
很多时候我们都需要对不同的 input 自行封装，所以也可以单独抽象出来 Class 方便继承，又或者封装成指令等方式都是可以的。<br>
<a href="https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular2-free/5-custom-input-component" target="_blank" rel="noopener noreferrer">此处查看项目代码<ExternalLinkIcon/></a><br>
<a href="http://angular2-free.godbasin.com/5-custom-input-component/index.html#/home/page-setting" target="_blank" rel="noopener noreferrer">此处查看页面效果<ExternalLinkIcon/></a></p>
</div></template>


