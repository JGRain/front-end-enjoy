<template><div><p>该系列用于探索一些 Angular 中灵活或者新的用法。本文结合上一节讲的响应式表单表单，记录创建动态表单的过程。</p>
<!--more-->
<h2 id="响应式表单" tabindex="-1"><a class="header-anchor" href="#响应式表单" aria-hidden="true">#</a> 响应式表单</h2>
<h3 id="上节回顾" tabindex="-1"><a class="header-anchor" href="#上节回顾" aria-hidden="true">#</a> 上节回顾</h3>
<p>上一节<RouterLink to="/angular/angular-free/6-two-form-building.html">《6. 模型驱动和模板驱动的表单》</RouterLink>中有介绍我们创建响应式表单，大家也应该知道响应式表单的灵活性、同步性、测试性都比模板驱动表单要好。</p>
<p>这里先简单回顾一下：</p>
<ol>
<li>在 html 模板中</li>
</ol>
<ul>
<li><code v-pre>form</code>元素需添加<code v-pre>formGroup</code>属性，其关联到<code v-pre>form</code>元素上的<code v-pre>FormGroup</code>实例</li>
<li>每个表单控件只需添加<code v-pre>formControlName</code>属性，来绑定<code v-pre>FormGroup</code>对应的的控件名</li>
<li>使用<code v-pre>ngSubmit</code>可触发表单提交</li>
<li>使用<code v-pre>FormGroup</code>实例的<code v-pre>valid</code>属性可获取表单的校验状态</li>
</ul>
<ol start="2">
<li>在 js 中</li>
</ol>
<ul>
<li>需要引入<code v-pre>ReactiveFormsModule</code>，来使用模型驱动的一些模板语法</li>
<li><code v-pre>FormGroup</code>用于注册多个<code v-pre>FormControl</code></li>
<li><code v-pre>FormBuilder</code>类能通过处理控件创建的细节问题来帮我们减少重复劳动</li>
<li><code v-pre>valueChanges</code>可以订阅表单控件变化</li>
</ul>
<p>然后我们开始将它整理为一个可动态生成的表单吧。</p>
<h2 id="动态表单" tabindex="-1"><a class="header-anchor" href="#动态表单" aria-hidden="true">#</a> 动态表单</h2>
<hr>
<h3 id="html-模板" tabindex="-1"><a class="header-anchor" href="#html-模板" aria-hidden="true">#</a> HTML 模板</h3>
<p>首先，我们需要定义我们要生成怎样的表单。
这里暂时只考虑两种：<code v-pre>&lt;input&gt;</code>以及<code v-pre>&lt;select&gt;</code>。</p>
<p>对于<code v-pre>&lt;input&gt;</code>元素，我们只需要一个<code v-pre>formControlName</code>属性，剩下的通过响应式处理。
对于<code v-pre>&lt;select&gt;</code>元素，我们除了<code v-pre>formControlName</code>属性，还需提供<code v-pre>option</code>选项的内容。</p>
<p>然后通过响应式处理，我们可以统一获取各自的错误提示，后面我们会讲到。目前我们可以获得代码：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>form</span>
  <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>form-horizontal<span class="token punctuation">"</span></span>
  <span class="token attr-name">[formGroup]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>dynamicForm<span class="token punctuation">"</span></span>
  <span class="token attr-name">(ngSubmit)</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>submit()<span class="token punctuation">"</span></span>
  <span class="token special-attr"><span class="token attr-name">style</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value css language-css"><span class="token property">border</span><span class="token punctuation">:</span> solid 1px #ccc<span class="token punctuation">;</span> <span class="token property">padding</span><span class="token punctuation">:</span> 20px 0<span class="token punctuation">;</span></span><span class="token punctuation">"</span></span></span>
<span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">*ngFor</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>let control of customForms<span class="token punctuation">"</span></span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>form-group<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>form-group<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>label</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>col-md-2 control-label<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>{{control.label}}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>label</span><span class="token punctuation">></span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>col-md-6<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span>
          <span class="token attr-name">*ngIf</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>control.type === 'input'<span class="token punctuation">"</span></span>
          <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>form-control<span class="token punctuation">"</span></span>
          <span class="token attr-name">[formControlName]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>control.key<span class="token punctuation">"</span></span>
        <span class="token punctuation">/></span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>select</span>
          <span class="token attr-name">*ngIf</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>control.type === 'select'<span class="token punctuation">"</span></span>
          <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>form-control<span class="token punctuation">"</span></span>
          <span class="token attr-name">[formControlName]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>control.key<span class="token punctuation">"</span></span>
        <span class="token punctuation">></span></span>
          <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>option</span> <span class="token attr-name">*ngFor</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>let op of control.options<span class="token punctuation">"</span></span> <span class="token attr-name">[value]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>op.id<span class="token punctuation">"</span></span>
            <span class="token punctuation">></span></span>{{op.text}}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>option</span>
          <span class="token punctuation">></span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>select</span><span class="token punctuation">></span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span>
      <span class="token attr-name">*ngIf</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>formErrors[control.key]<span class="token punctuation">"</span></span>
      <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>alert alert-danger col-md-6 col-md-offset-2<span class="token punctuation">"</span></span>
    <span class="token punctuation">></span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">></span></span>{{ formErrors[control.key] }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>col-md-offset-2<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
    {{dynamicForm.value | json}}
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>form-group<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>col-sm-offset-2 col-sm-10<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span>
        <span class="token attr-name">[disabled]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>!dynamicForm.valid<span class="token punctuation">"</span></span>
        <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>submit<span class="token punctuation">"</span></span>
        <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>btn btn-info<span class="token punctuation">"</span></span>
      <span class="token punctuation">></span></span>
        提交
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>form</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可见，我们通过<code v-pre>customForms</code>来设定所有的表单控件，其中每个控件：</p>
<ul>
<li><code v-pre>type</code>为控件类型，字符串表示</li>
<li><code v-pre>key</code>为唯一标识，字符串表示</li>
<li><code v-pre>options</code>为选项，为<code v-pre>{id:id, text: text}</code>组成的数组</li>
</ul>
<h3 id="接口定义" tabindex="-1"><a class="header-anchor" href="#接口定义" aria-hidden="true">#</a> 接口定义</h3>
<p>在我们的响应式表单中，有个很重要的校验，这里我们使用<code v-pre>validations</code>来保存每个控件的校验：</p>
<ul>
<li><code v-pre>type</code>为校验类型，包括'required'/'maxLength'/'minLength'/'email'/'pattern'等，具体参考<code v-pre>Validators</code></li>
<li><code v-pre>param</code>为参数，像'maxLength'可带 Number 的参数，'pattern'可带正则字符串，同样参考<code v-pre>Validators</code></li>
<li><code v-pre>message</code>为错误提示</li>
</ul>
<p>到这里我们的控件主要包括以下内容：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// validation接口</span>
<span class="token keyword">interface</span> <span class="token class-name">IValidations</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">type</span><span class="token operator">:</span> string<span class="token punctuation">;</span>
  param<span class="token operator">?</span><span class="token operator">:</span> any<span class="token punctuation">;</span>
  <span class="token literal-property property">message</span><span class="token operator">:</span> string<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// option接口</span>
<span class="token keyword">interface</span> <span class="token class-name">IOptions</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">id</span><span class="token operator">:</span> string<span class="token punctuation">;</span>
  <span class="token literal-property property">text</span><span class="token operator">:</span> string<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 控件接口</span>
<span class="token keyword">interface</span> <span class="token class-name">ICustomControl</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">type</span><span class="token operator">:</span> string<span class="token punctuation">;</span>
  <span class="token literal-property property">label</span><span class="token operator">:</span> string<span class="token punctuation">;</span>
  <span class="token literal-property property">key</span><span class="token operator">:</span> string<span class="token punctuation">;</span>
  validations<span class="token operator">?</span><span class="token operator">:</span> IValidations<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  options<span class="token operator">?</span><span class="token operator">:</span> IOptions<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="逻辑实现" tabindex="-1"><a class="header-anchor" href="#逻辑实现" aria-hidden="true">#</a> 逻辑实现</h3>
<p>到了这里，我们的基本数据结构定义完毕了，我们则可以通过这个数据结构生成需要的数据，包括：</p>
<ul>
<li><code v-pre>FormGroup</code>: 包括每个<code v-pre>FormControl</code>控件的细节控制</li>
<li><code v-pre>model</code>: 表单的控件 model 集合</li>
<li><code v-pre>formErrors</code>: 表单控件校验总错误信息集合</li>
<li><code v-pre>validationMessages</code>: 表单控件单个错误信息集合</li>
</ul>
<p>结合上一节内容，调整后我们的代码：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>@<span class="token function">Component</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token literal-property property">selector</span><span class="token operator">:</span> <span class="token string">'dynamic-form'</span><span class="token punctuation">,</span>
    <span class="token literal-property property">templateUrl</span><span class="token operator">:</span> <span class="token string">'./dynamic-form.component.html'</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">CustomFormComponent</span> <span class="token punctuation">{</span>
    @<span class="token function">Input</span><span class="token punctuation">(</span><span class="token punctuation">)</span> config<span class="token operator">:</span> any<span class="token punctuation">;</span> <span class="token comment">// 保存配置内容</span>
    <span class="token literal-property property">customGroup</span><span class="token operator">:</span> any <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span> <span class="token comment">// 用于创建FormGroup</span>
    <span class="token literal-property property">model</span><span class="token operator">:</span> any <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span> <span class="token comment">// 保存每个控件值的model，主要用于提交等</span>
    <span class="token literal-property property">dynamicForm</span><span class="token operator">:</span> FormGroup<span class="token punctuation">;</span> <span class="token comment">// FormGroup</span>

    formErrors <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
    validationMessages <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>

    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter"><span class="token keyword">private</span> <span class="token literal-property property">fb</span><span class="token operator">:</span> FormBuilder</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token punctuation">}</span>

    <span class="token function">ngOnInit</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 遍历配置中的控件</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>config<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">control</span><span class="token operator">:</span> ICustomControl<span class="token punctuation">,</span> i</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
            <span class="token comment">// 初始化控件错误信息</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>formErrors<span class="token punctuation">[</span>control<span class="token punctuation">.</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token string">''</span><span class="token punctuation">;</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>validationMessages<span class="token punctuation">[</span>control<span class="token punctuation">.</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
            <span class="token comment">// 初始化model，若有初始值可在这里处理</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>model<span class="token punctuation">[</span>control<span class="token punctuation">.</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span>
            <span class="token comment">// 校验器设置</span>
            <span class="token keyword">const</span> validations <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
            control<span class="token punctuation">.</span>validations<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">valid</span><span class="token operator">:</span> IValidations</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
                <span class="token keyword">this</span><span class="token punctuation">.</span>validationMessages<span class="token punctuation">[</span>control<span class="token punctuation">.</span>key<span class="token punctuation">]</span><span class="token punctuation">[</span>valid<span class="token punctuation">.</span>type<span class="token punctuation">.</span><span class="token function">toLowerCase</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">]</span> <span class="token operator">=</span> valid<span class="token punctuation">.</span>message<span class="token punctuation">;</span>
                <span class="token keyword">if</span> <span class="token punctuation">(</span>valid<span class="token punctuation">.</span>param<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    <span class="token comment">// 若有参数，则作为函数调用参数</span>
                    validations<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>Validators<span class="token punctuation">[</span>valid<span class="token punctuation">.</span>type<span class="token punctuation">]</span><span class="token punctuation">(</span>valid<span class="token punctuation">.</span>param<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
                    validations<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>Validators<span class="token punctuation">[</span>valid<span class="token punctuation">.</span>type<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>customGroup<span class="token punctuation">[</span>control<span class="token punctuation">.</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token keyword">this</span><span class="token punctuation">.</span>model<span class="token punctuation">[</span>control<span class="token punctuation">.</span>key<span class="token punctuation">]</span><span class="token punctuation">,</span> validations<span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">createForm</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token function">createForm</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 有多个FormControl，把它们注册进一个父FormGroup中</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>dynamicForm <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>fb<span class="token punctuation">.</span><span class="token function">group</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>customGroup<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// 监听变化，更新校验信息</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>dynamicForm<span class="token punctuation">.</span>valueChanges
            <span class="token punctuation">.</span><span class="token function">subscribe</span><span class="token punctuation">(</span><span class="token parameter">data</span> <span class="token operator">=></span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">onValueChanged</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">onValueChanged</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 更新校验信息</span>
    <span class="token punctuation">}</span>

    <span class="token function">onValueChanged</span><span class="token punctuation">(</span><span class="token parameter">data<span class="token operator">?</span><span class="token operator">:</span> any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token keyword">this</span><span class="token punctuation">.</span>dynamicForm<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">const</span> form <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>dynamicForm<span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> field <span class="token keyword">in</span> <span class="token keyword">this</span><span class="token punctuation">.</span>formErrors<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 清除控件错误信息</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>formErrors<span class="token punctuation">[</span>field<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token string">''</span><span class="token punctuation">;</span>
            <span class="token keyword">const</span> control <span class="token operator">=</span> form<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>field<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>control <span class="token operator">&amp;&amp;</span> control<span class="token punctuation">.</span>dirty <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>control<span class="token punctuation">.</span>valid<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">const</span> messages <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>validationMessages<span class="token punctuation">[</span>field<span class="token punctuation">]</span><span class="token punctuation">;</span>
                <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> key <span class="token keyword">in</span> control<span class="token punctuation">.</span>errors<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    <span class="token keyword">this</span><span class="token punctuation">.</span>formErrors<span class="token punctuation">[</span>field<span class="token punctuation">]</span> <span class="token operator">+=</span> messages<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">+</span> <span class="token string">' '</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token function">submit</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 赋值model，可用于修改提交</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>model <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token operator">...</span><span class="token keyword">this</span><span class="token punctuation">.</span>dynamicForm<span class="token punctuation">.</span>value<span class="token punctuation">}</span><span class="token punctuation">;</span>
        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>model<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token function">alert</span><span class="token punctuation">(</span><span class="token string">'成功！'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="注入配置" tabindex="-1"><a class="header-anchor" href="#注入配置" aria-hidden="true">#</a> 注入配置</h3>
<p>我们可以模拟一个配置文件，注入到这个动态表单控件中：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token literal-property property">customForms</span><span class="token operator">:</span> ICustomControl<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token punctuation">{</span>
    <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"input"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">label</span><span class="token operator">:</span> <span class="token string">"名字"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">"name"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">validations</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"required"</span><span class="token punctuation">,</span>
        <span class="token literal-property property">message</span><span class="token operator">:</span> <span class="token string">"名字必填"</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"maxLength"</span><span class="token punctuation">,</span>
        <span class="token literal-property property">param</span><span class="token operator">:</span> <span class="token number">8</span><span class="token punctuation">,</span>
        <span class="token literal-property property">message</span><span class="token operator">:</span> <span class="token string">"名字最多8个字符"</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"minLength"</span><span class="token punctuation">,</span>
        <span class="token literal-property property">param</span><span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span>
        <span class="token literal-property property">message</span><span class="token operator">:</span> <span class="token string">"名字最少3个字符"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span>
    <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"input"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">label</span><span class="token operator">:</span> <span class="token string">"Email"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">"email"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">validations</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"required"</span><span class="token punctuation">,</span>
        <span class="token literal-property property">message</span><span class="token operator">:</span> <span class="token string">"Email必填"</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"email"</span><span class="token punctuation">,</span>
        <span class="token literal-property property">message</span><span class="token operator">:</span> <span class="token string">"Email格式不正确"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span>
    <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"select"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">label</span><span class="token operator">:</span> <span class="token string">"职业"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">"job"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">validations</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"required"</span><span class="token punctuation">,</span>
        <span class="token literal-property property">message</span><span class="token operator">:</span> <span class="token string">"职业必选"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token literal-property property">options</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span> <span class="token literal-property property">id</span><span class="token operator">:</span> <span class="token string">""</span><span class="token punctuation">,</span> <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">""</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span> <span class="token literal-property property">id</span><span class="token operator">:</span> <span class="token string">"1"</span><span class="token punctuation">,</span> <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">"医生"</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span> <span class="token literal-property property">id</span><span class="token operator">:</span> <span class="token string">"2"</span><span class="token punctuation">,</span> <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">"程序员"</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span> <span class="token literal-property property">id</span><span class="token operator">:</span> <span class="token string">"3"</span><span class="token punctuation">,</span> <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">"公务员"</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span> <span class="token literal-property property">id</span><span class="token operator">:</span> <span class="token string">"4"</span><span class="token punctuation">,</span> <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">"其他"</span> <span class="token punctuation">}</span>
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到最终效果图：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1495985927(1).png" alt="image"></p>
<h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>本节我们将之前的响应式表单进行改造，做成了动态表单，通过配置去生成我们需要的表单，包括校验等等。<br>
这里只是个基本雏形，后面若需要完善，例如表单的初始化状态加载，或是其他类型表单的拓展，也是需要花些心思的呢。<br>
<a href="https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular2-free/7-dynamic-form" target="_blank" rel="noopener noreferrer">此处查看项目代码<ExternalLinkIcon/></a><br>
<a href="http://angular2-free.godbasin.com/7-dynamic-form/index.html#/home/page-setting" target="_blank" rel="noopener noreferrer">此处查看页面效果<ExternalLinkIcon/></a></p>
</div></template>


