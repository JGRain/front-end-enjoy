<template><div><p>该系列用于探索一些 Angular 中灵活或者新的用法。本文介绍向表单添加简单的条件控制的过程。</p>
<!--more-->
<h2 id="表单条件" tabindex="-1"><a class="header-anchor" href="#表单条件" aria-hidden="true">#</a> 表单条件</h2>
<h3 id="常用表单条件" tabindex="-1"><a class="header-anchor" href="#常用表单条件" aria-hidden="true">#</a> 常用表单条件</h3>
<p>很多时候，我们的表单需要添加一些条件，例如：</p>
<ul>
<li>选择是否订阅邮件，是则需要填写邮件</li>
<li>针对不同的选择展示不同的表单控件</li>
</ul>
<p>这里我们只考虑比较容易实现的：</p>
<ul>
<li>校验
<ul>
<li>通过某个控件值的比较，来作为判断标准</li>
<li>传入其他控件的<code v-pre>key</code>，通过常用比较<code v-pre>&gt;</code>/<code v-pre>&gt;=</code>/<code v-pre>==</code>等，来控制显示</li>
</ul>
</li>
<li>条件（只能二选一），作为以上校验的叠加方式选择
<ul>
<li>'&amp;&amp;': 与，需同时满足多个条件</li>
<li>'||': 或，满足其中一个条件即可</li>
</ul>
</li>
</ul>
<p>通过以上我们可以定义基本配置接口结构：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 校验配置</span>
<span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">IHiddenValidate</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">key</span><span class="token operator">:</span> string<span class="token punctuation">;</span>
  <span class="token literal-property property">validate</span><span class="token operator">:</span> string<span class="token punctuation">;</span>
  <span class="token literal-property property">param</span><span class="token operator">:</span> string <span class="token operator">|</span> number<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token comment">// 条件配置</span>
<span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">IHiddenCondition</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">condition</span><span class="token operator">:</span> <span class="token string">"||"</span> <span class="token operator">|</span> <span class="token string">"&amp;&amp;"</span><span class="token punctuation">;</span>
  <span class="token literal-property property">validations</span><span class="token operator">:</span> IHiddenValidate<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token comment">// 自定义单个控件配置</span>
<span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">ICustomControl</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">type</span><span class="token operator">:</span> string<span class="token punctuation">;</span>
  <span class="token literal-property property">label</span><span class="token operator">:</span> string<span class="token punctuation">;</span>
  <span class="token literal-property property">key</span><span class="token operator">:</span> string<span class="token punctuation">;</span>
  validations<span class="token operator">?</span><span class="token operator">:</span> IValidations<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  options<span class="token operator">?</span><span class="token operator">:</span> IOptions<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  limit<span class="token operator">?</span><span class="token operator">:</span> ILimit<span class="token punctuation">;</span>
  hiddenWhen<span class="token operator">?</span><span class="token operator">:</span> IHiddenCondition<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="条件判断" tabindex="-1"><a class="header-anchor" href="#条件判断" aria-hidden="true">#</a> 条件判断</h3>
<p>我们针对上面的数据结构，需要进行条件判断，返回布尔值来控制表单的显示或隐藏。</p>
<p>首先，我们添加一个用于计算条件的函数：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">validate</span><span class="token punctuation">(</span><span class="token parameter">a<span class="token punctuation">,</span> b<span class="token punctuation">,</span> condition</span><span class="token punctuation">)</span><span class="token operator">:</span> boolean <span class="token punctuation">{</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>condition<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token string">">"</span><span class="token operator">:</span>
      <span class="token keyword">return</span> a <span class="token operator">></span> b<span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token string">">="</span><span class="token operator">:</span>
      <span class="token keyword">return</span> a <span class="token operator">>=</span> b<span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token string">"=="</span><span class="token operator">:</span>
      <span class="token keyword">return</span> a <span class="token operator">==</span> b<span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token string">"==="</span><span class="token operator">:</span>
      <span class="token keyword">return</span> a <span class="token operator">===</span> b<span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token string">">"</span><span class="token operator">:</span>
      <span class="token keyword">return</span> a <span class="token operator">></span> b<span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token string">">="</span><span class="token operator">:</span>
      <span class="token keyword">return</span> a <span class="token operator">>=</span> b<span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token string">"&amp;&amp;"</span><span class="token operator">:</span>
      <span class="token keyword">return</span> a <span class="token operator">&amp;&amp;</span> b<span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token string">"||"</span><span class="token operator">:</span>
      <span class="token keyword">return</span> a <span class="token operator">||</span> b<span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token string">"indexOf"</span><span class="token operator">:</span> <span class="token comment">// 用于数组判断</span>
      <span class="token keyword">return</span> a<span class="token punctuation">.</span><span class="token function">indexOf</span><span class="token punctuation">(</span>b<span class="token punctuation">)</span> <span class="token operator">></span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token keyword">default</span><span class="token operator">:</span>
      <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后我们开始处理较复杂的条件和校验，先将多个校验计算出来，再使用条件合并：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>    <span class="token function">isHidden</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">control</span><span class="token operator">:</span> ICustomControl</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">let</span> hidden <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span> <span class="token comment">// 初始化显示</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>control<span class="token punctuation">.</span>hiddenWhen <span class="token operator">&amp;&amp;</span> control<span class="token punctuation">.</span>hiddenWhen<span class="token punctuation">.</span>validations <span class="token operator">&amp;&amp;</span> control<span class="token punctuation">.</span>hiddenWhen<span class="token punctuation">.</span>validations<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            control<span class="token punctuation">.</span>hiddenWhen<span class="token punctuation">.</span>validations<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token parameter">valid</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
                <span class="token comment">// 条件计算</span>
                hidden <span class="token operator">=</span> <span class="token function">validate</span><span class="token punctuation">(</span>
                    hidden<span class="token punctuation">,</span>
                    <span class="token function">validate</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>dynamicForm<span class="token punctuation">.</span>value<span class="token punctuation">[</span>valid<span class="token punctuation">.</span>key<span class="token punctuation">]</span><span class="token punctuation">,</span> valid<span class="token punctuation">.</span>param<span class="token punctuation">,</span> valid<span class="token punctuation">.</span>validate<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token comment">// 校验计算</span>
                    control<span class="token punctuation">.</span>hiddenWhen<span class="token punctuation">.</span>condition
                <span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> hidden<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过这个方法我们就能控制是否显示对应表单控件了：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">*ngFor</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>let control of config<span class="token punctuation">"</span></span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>form-group<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">*ngIf</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>!isHidden(control)<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
    <span class="token comment">&lt;!--具体控件--></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="实例配置" tabindex="-1"><a class="header-anchor" href="#实例配置" aria-hidden="true">#</a> 实例配置</h3>
<p>我们可以通过一个简单的邮件接收配置来检验：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token literal-property property">customForms</span><span class="token operator">:</span> ICustomControl<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token punctuation">{</span>
    <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"radio"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">label</span><span class="token operator">:</span> <span class="token string">"是否接收邮件"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">"emailReceived"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">options</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">{</span> <span class="token literal-property property">id</span><span class="token operator">:</span> <span class="token string">"1"</span><span class="token punctuation">,</span> <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">"是"</span> <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">id</span><span class="token operator">:</span> <span class="token string">"0"</span><span class="token punctuation">,</span> <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">"否"</span> <span class="token punctuation">}</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span>
    <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"text"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">label</span><span class="token operator">:</span> <span class="token string">"Email"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">"email"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">validations</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"email"</span><span class="token punctuation">,</span>
        <span class="token literal-property property">message</span><span class="token operator">:</span> <span class="token string">"Email格式不正确"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token literal-property property">hiddenWhen</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">condition</span><span class="token operator">:</span> <span class="token string">"||"</span><span class="token punctuation">,</span>
      <span class="token literal-property property">validations</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
          <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">"emailReceived"</span><span class="token punctuation">,</span>
          <span class="token literal-property property">validate</span><span class="token operator">:</span> <span class="token string">"=="</span><span class="token punctuation">,</span>
          <span class="token literal-property property">param</span><span class="token operator">:</span> <span class="token string">"0"</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">]</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">]</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>效果如下：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1496326365(1).png" alt="iamge">
<img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1496326383(1).png" alt="iamge"></p>
<h2 id="带输入的选择" tabindex="-1"><a class="header-anchor" href="#带输入的选择" aria-hidden="true">#</a> 带输入的选择</h2>
<p>很多时候我们需要有这样的表单控件：</p>
<ul>
<li>checkbox 勾选后可自定义填写</li>
<li>radio 选择自定义填写</li>
</ul>
<p>这里我们简单做个组件封装吧。</p>
<h3 id="带输入的-checkbox" tabindex="-1"><a class="header-anchor" href="#带输入的-checkbox" aria-hidden="true">#</a> 带输入的 checkbox</h3>
<p>我们先来定义我们想要的效果：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">*ngFor</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>let op of options<span class="token punctuation">"</span></span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>form-check<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span>
    <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>checkbox<span class="token punctuation">"</span></span>
    <span class="token attr-name">[name]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>value<span class="token punctuation">"</span></span>
    <span class="token attr-name">[checked]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>model[op.id] &amp;&amp; model[op.id].checked<span class="token punctuation">"</span></span>
    <span class="token attr-name">(click)</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>setValue(op)<span class="token punctuation">"</span></span>
    <span class="token attr-name">[disabled]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>disabled<span class="token punctuation">"</span></span>
    <span class="token attr-name">[value]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>op.id<span class="token punctuation">"</span></span>
  <span class="token punctuation">/></span></span>{{op.text}}
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span>
    <span class="token attr-name">*ngIf</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>op.withInput<span class="token punctuation">"</span></span>
    <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>form-control form-inline-input<span class="token punctuation">"</span></span>
    <span class="token attr-name">[type]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>type<span class="token punctuation">"</span></span>
    <span class="token attr-name">[disabled]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>!(model[op.id] &amp;&amp; model[op.id].checked)<span class="token punctuation">"</span></span>
    <span class="token attr-name">[(ngModel)]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>model[op.id].value<span class="token punctuation">"</span></span>
  <span class="token punctuation">/></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>由于多了自定义填写，通过绑定选中数组的形式也不适用了，我们需要通过对象的方式来绑定返回值：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// 这里为了方便表达清楚结构，使用了不合规范的表示，莫介意</span>
model <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">id</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">checked</span><span class="token operator">:</span> boolen<span class="token punctuation">,</span>
    <span class="token literal-property property">value</span><span class="token operator">:</span> string <span class="token operator">|</span> number
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>用的实现还是前面自定义表单的那一套：</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>@<span class="token function">Component</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token literal-property property">selector</span><span class="token operator">:</span> <span class="token string">'checkbox-with-input'</span><span class="token punctuation">,</span>
    <span class="token literal-property property">template</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">...同上</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>
    <span class="token literal-property property">providers</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token function">customInputAccessor</span><span class="token punctuation">(</span>CheckboxWithTextComponent<span class="token punctuation">)</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">CheckboxWithTextComponent</span> <span class="token keyword">implements</span> <span class="token class-name">OnInit</span> <span class="token punctuation">{</span>
    @<span class="token function">Input</span><span class="token punctuation">(</span><span class="token punctuation">)</span> options<span class="token operator">:</span> IOptions<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token comment">// object: {id, text} or array: []</span>
    @<span class="token function">Input</span><span class="token punctuation">(</span><span class="token punctuation">)</span> disabled<span class="token operator">:</span> boolean <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
    @<span class="token function">Input</span><span class="token punctuation">(</span><span class="token punctuation">)</span> type<span class="token operator">:</span> string <span class="token operator">=</span> <span class="token string">'text'</span><span class="token punctuation">;</span>

    <span class="token keyword">private</span> <span class="token literal-property property">model</span><span class="token operator">:</span> any <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span> <span class="token comment">// 控件的值</span>
    <span class="token keyword">private</span> <span class="token function-variable function">onChange</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">_</span><span class="token operator">:</span> any</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token function-variable function">onTouched</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token keyword">void</span><span class="token punctuation">;</span>

    <span class="token function">ngOnInit</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 初始化model的值</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>options<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token parameter">op</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>model<span class="token punctuation">[</span>op<span class="token punctuation">.</span>id<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
                <span class="token literal-property property">checked</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
            <span class="token punctuation">}</span><span class="token punctuation">;</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>op<span class="token punctuation">.</span>withInput<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">this</span><span class="token punctuation">.</span>model<span class="token punctuation">[</span>op<span class="token punctuation">.</span>id<span class="token punctuation">]</span><span class="token punctuation">.</span>value <span class="token operator">=</span> <span class="token string">''</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token function">setValue</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">op</span><span class="token operator">:</span> any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 选择某选项的时候处理</span>
        <span class="token keyword">const</span> isChecked <span class="token operator">=</span> <span class="token operator">!</span><span class="token keyword">this</span><span class="token punctuation">.</span>model<span class="token punctuation">[</span>op<span class="token punctuation">.</span>id<span class="token punctuation">]</span><span class="token punctuation">.</span>checked<span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>model<span class="token punctuation">[</span>op<span class="token punctuation">.</span>id<span class="token punctuation">]</span><span class="token punctuation">.</span>checked <span class="token operator">=</span> isChecked<span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">onChange</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>model<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 下面的方法参照前面几节</span>
    <span class="token comment">// onBlur</span>
    <span class="token comment">// writeValue</span>
    <span class="token comment">// registerOnChange</span>
    <span class="token comment">// registerOnTouched</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后我们在动态表单里面添加进去：</p>
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>checkbox-with-input</span>
  <span class="token attr-name">*ngIf</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>control.type === 'checkbox-with-text'<span class="token punctuation">"</span></span>
  <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text<span class="token punctuation">"</span></span>
  <span class="token attr-name">[options]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>control.options<span class="token punctuation">"</span></span>
  <span class="token attr-name">[formControlName]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>control.key<span class="token punctuation">"</span></span>
<span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>checkbox-with-input</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>checkbox-with-input</span>
  <span class="token attr-name">*ngIf</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>control.type === 'checkbox-with-number'<span class="token punctuation">"</span></span>
  <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>number<span class="token punctuation">"</span></span>
  <span class="token attr-name">[options]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>control.options<span class="token punctuation">"</span></span>
  <span class="token attr-name">[formControlName]</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>control.key<span class="token punctuation">"</span></span>
<span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>checkbox-with-input</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>而带输入的<code v-pre>radio</code>大家就自己解决吧，本骚年的项目代码里面有，基本与 checkbox 的很相像。</p>
<p>结合上面，最终我们的效果图如下：</p>
<p><img src="https://github-imglib-1255459943.cos.ap-chengdu.myqcloud.com/1496325904(1).png" alt="image"></p>
<h2 id="结束语" tabindex="-1"><a class="header-anchor" href="#结束语" aria-hidden="true">#</a> 结束语</h2>
<p>这里我们只针对简单的条件进行表单校验，并且这里只能匹配一些简单绑定的值，像多选等因为绑定的值为对象，暂无法进行条件判断。<br>
一些复杂的控制功能或许需要我们通过其他方式进行吧，毕竟很多时候更广的通用性也会增加设计的复杂度、消耗使用的简便性。<br>
<a href="https://github.com/godbasin/godbasin.github.io/tree/blog-codes/angular2-free/10-add-conditions" target="_blank" rel="noopener noreferrer">此处查看项目代码<ExternalLinkIcon/></a><br>
<a href="http://angular2-free.godbasin.com/10-add-conditions/index.html#/home/page-setting" target="_blank" rel="noopener noreferrer">此处查看页面效果<ExternalLinkIcon/></a></p>
</div></template>


