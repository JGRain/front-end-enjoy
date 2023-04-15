<template><div><p>第七章主要介绍 api。</p>
<!--more-->
<h2 id="box2d-api" tabindex="-1"><a class="header-anchor" href="#box2d-api" aria-hidden="true">#</a> Box2D api</h2>
<h3 id="box2d-分类" tabindex="-1"><a class="header-anchor" href="#box2d-分类" aria-hidden="true">#</a> Box2D 分类</h3>
<p>Box2D 所有的 api 可参照<a href="http://www.kyucon.com/doc/box2d/" target="_blank" rel="noopener noreferrer">Box2D_api<ExternalLinkIcon/></a>。</p>
<p>可发现，Box2D 具体分为三大类：</p>
<ul>
<li>碰撞类(collision)：碰撞模块定义了形状，broad-phase 算法，碰撞的功能/查询</li>
<li>基础类(common)：包括基础系统配置、数据类型、基础数学运算</li>
<li>动力学类(dynamics)：包括模拟物理世界，刚体(body)，接触管理(contacts)，以及关节(joint)</li>
</ul>
<p>具体的说明是个人整理的，有些参照网上资源，可能不完整且有偏差。</p>
<h2 id="common" tabindex="-1"><a class="header-anchor" href="#common" aria-hidden="true">#</a> common</h2>
<h3 id="math" tabindex="-1"><a class="header-anchor" href="#math" aria-hidden="true">#</a> math</h3>
<ul>
<li><code v-pre>b2Vec2</code>：二维向量</li>
<li><code v-pre>b2Mat22</code>：一个由两个 b2Vec2 组成的 2*2 方阵，可直接由两个 b2Vec2（col1、col2）构造或者由一个角度值构造</li>
<li><code v-pre>b2Math</code>：基本数学运算，如向量和矩阵的计算、产生随机数等</li>
</ul>
<h3 id="bssettings" tabindex="-1"><a class="header-anchor" href="#bssettings" aria-hidden="true">#</a> bsSettings</h3>
<ul>
<li><code v-pre>bsSettings</code>：基础系统配置，如 pi 的值、每秒的时间、每米的大小、睡眠时间等等</li>
</ul>
<h2 id="collisions" tabindex="-1"><a class="header-anchor" href="#collisions" aria-hidden="true">#</a> collisions</h2>
<h3 id="shapes-形状定义" tabindex="-1"><a class="header-anchor" href="#shapes-形状定义" aria-hidden="true">#</a> shapes 形状定义</h3>
<ul>
<li>
<p><code v-pre>b2ShapeDef</code>：形状定义</p>
<ul>
<li>b2ShapeDef 为形状定义</li>
<li>type 来表示形状类型</li>
<li>localPosition 来表示当前位置</li>
<li>localRotation 来表示当前角度</li>
<li>friction、density、restitution 来表示摩擦力、密度、弹性系数</li>
<li>categoryBits 和 maskBits 来表示碰撞位及位标识（可以用来过滤一些碰撞）</li>
<li>groupIndex 来表示组号，这个组号可以用来过滤还比位标识优先</li>
</ul>
</li>
<li>
<p><code v-pre>b2CircleDef</code>：圆形</p>
<ul>
<li>继承于 b2ShapeDef</li>
<li>type 为 e_circleShape</li>
<li>带有一个类型为 float32 的量 radius 来表示半径值</li>
</ul>
</li>
<li>
<p><code v-pre>b2BoxDef</code>：矩形</p>
<ul>
<li>继承于 b2ShapeDef</li>
<li>type 为 e_ boxShape</li>
<li>带有一个类型为 b2Vec2 的量 extents 来表示区域值</li>
</ul>
</li>
<li>
<p><code v-pre>b2PolyDef</code>：凸多边形</p>
<ul>
<li>继承于 b2ShapeDef</li>
<li>type 为 e_ polyShape</li>
<li>带有一个类型为 b2Vec2 的数组 vertices 来表示顶点</li>
<li>带有一个 int32 型的量 vertexCount 来表示顶点数，目前顶点数最多支持 8 个</li>
</ul>
</li>
</ul>
<h3 id="碰撞的功能-查询" tabindex="-1"><a class="header-anchor" href="#碰撞的功能-查询" aria-hidden="true">#</a> 碰撞的功能/查询</h3>
<ul>
<li>
<p><code v-pre>b2AABB</code>：AABB 坐标</p>
<ul>
<li>盒子，由两个向量组成，一个为 minVertex 是最小顶点，另一个为 maxVertex 是最大顶点，通过这两个顶点来表示最为普通的 AABB 框</li>
</ul>
</li>
<li>
<p><code v-pre>b2OBB</code>：OBB 坐标</p>
</li>
<li>
<p><code v-pre>b2ContactID</code>：接触 ID</p>
</li>
<li>
<p><code v-pre>b2ContactPoint</code>：接触点</p>
</li>
</ul>
<h3 id="broad-phase-算法" tabindex="-1"><a class="header-anchor" href="#broad-phase-算法" aria-hidden="true">#</a> broad-phase 算法</h3>
<ul>
<li><code v-pre>b2BroadPhase</code>：通过使用动态树降低了管理数据方面的开销，极大的降低了调用 narrow-phase 算法的次数</li>
</ul>
<h2 id="dynamics" tabindex="-1"><a class="header-anchor" href="#dynamics" aria-hidden="true">#</a> dynamics</h2>
<h3 id="刚体" tabindex="-1"><a class="header-anchor" href="#刚体" aria-hidden="true">#</a> 刚体</h3>
<ul>
<li>
<p><code v-pre>b2BodyDef</code>：</p>
<ul>
<li>刚体定义结构</li>
<li>userData 来表示用户数据</li>
<li>shapes 来表示形状队列，目前形状数最大支持 64 个</li>
<li>position 来表示当前位置</li>
<li>rotation 来表示当前角度</li>
<li>linearVelocity 表示线速度</li>
<li>angularVelocity 来表示角速度</li>
<li>linearDamping 来表示线性阻尼</li>
<li>angularDamping 来表示角阻抗</li>
<li>allowSleep 来表示是否可以允许休眠</li>
<li>isSleeping 来表示是否正在休眠</li>
<li>preventRotation 来表示是否防止旋转</li>
<li>支持方法：AddShape(b2ShapeDef* shape)</li>
</ul>
</li>
<li>
<p><code v-pre>b2CollisionFilters</code>：</p>
<ul>
<li>碰撞过滤是用来防止形状与形状之间进行碰撞的，可以用碰撞种类和组名来区别</li>
<li>Box2D 总共提供 16 种碰撞种类，每个形状都可以提定属于什么种类，那么它就可以和其他不同种类的形状碰撞</li>
</ul>
</li>
</ul>
<h3 id="结点-joints" tabindex="-1"><a class="header-anchor" href="#结点-joints" aria-hidden="true">#</a> 结点(joints)</h3>
<ul>
<li><code v-pre>b2DistanceJoint</code>：距离连接</li>
<li><code v-pre>b2DistanceJointDef</code>：距离连接定义</li>
<li><code v-pre>b2GearJoint</code>：齿轮连接</li>
<li><code v-pre>b2GearJointDef</code>：齿轮连接定义</li>
<li><code v-pre>b2Joint</code>：连接基类</li>
<li><code v-pre>b2JointDef</code>：连接定义基类</li>
<li><code v-pre>b2JointEdge</code>：用于组合刚体或连接到一起.刚体相当于节点,而连接相当于边</li>
<li><code v-pre>b2MouseJoint</code>：鼠标连接</li>
<li><code v-pre>b2MouseJointDef</code>：鼠标连接定义</li>
<li><code v-pre>b2PrismaticJoint</code>：移动连接</li>
<li><code v-pre>b2PrismaticJointDef</code>：移动连接定义</li>
<li><code v-pre>b2PulleyJoint</code>：滑轮连接</li>
<li><code v-pre>b2PulleyJointDef</code>：滑轮连接定义</li>
<li><code v-pre>b2RevoluteJoint</code>：旋转连接</li>
<li><code v-pre>b2RevoluteJointDef</code>：旋转连接定义</li>
</ul>
<h3 id="接触管理-contacts" tabindex="-1"><a class="header-anchor" href="#接触管理-contacts" aria-hidden="true">#</a> 接触管理(contacts)</h3>
<ul>
<li><code v-pre>b2Contact</code>：管理两个外形接触</li>
<li><code v-pre>b2ContactEdge</code>：接触边用来连接多个物体和接触到一个接触表(物体是一个节点而接触相当于一个接触边)</li>
<li><code v-pre>b2ContactResult</code>：记录接触结果</li>
</ul>
</div></template>


