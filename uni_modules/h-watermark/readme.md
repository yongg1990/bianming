## 水印组件

> **组件名：h-watermark**

### 安装方式

本组件符合[easycom](https://uniapp.dcloud.io/collocation/pages?id=easycom)规范，`HBuilderX 2.5.5`起，只需将本组件导入项目，在页面`template`中即可直接使用，无需在页面中`import`和注册`components`。

### 基本用法

在 ``template`` 中使用组件

```vue
<!-- 基本使用 -->
<h-watermark></h-watermark>

<!-- 自定义标题文字 -->
<h-watermark title="自定义标题文字"></h-watermark>

<!-- 是否显示标题文字 -->
<h-watermark :titleShow="false"></h-watermark>

<!-- 自定义标题文字字号 -->
<h-watermark :titleSize="26"></h-watermark>

<!-- 自定义标题文字颜色 -->
<h-watermark titleColor="#30b6a2"></h-watermark>

<!-- 自定义标题文字透明度 -->
<h-watermark :titleLucency="0.4"></h-watermark>

<!-- 自定义联系电话 -->
<h-watermark mobile="18888888888"></h-watermark>

<!-- 是否显示联系电话 -->
<h-watermark :mobileShow="false"></h-watermark>

<!-- 自定义联系电话字号 -->
<h-watermark :mobileSize="16"></h-watermark>

<!-- 自定义联系电话颜色 -->
<h-watermark mobileColor="#30b6a2"></h-watermark>

<!-- 自定义联系电话透明度 -->
<h-watermark :mobileLucency="0.4"></h-watermark>

<!-- 自定义软件名称 -->
<h-watermark appName="自定义软件名称"></h-watermark>

<!-- 是否显示软件名称 -->
<h-watermark :appNameShow="false"></h-watermark>

<!-- 自定义软件名称字号 -->
<h-watermark :appNameSize="16"></h-watermark>

<!-- 自定义软件名称颜色 -->
<h-watermark appNameColor="#30b6a2"></h-watermark>

<!-- 自定义软件名称透明度 -->
<h-watermark :appNameLucency="0.4"></h-watermark>

<!-- 自定义旋转弧度 -->
<h-watermark :rotate="45"></h-watermark>

<!-- 自定义父级容器 -->// 写在父级容器中
<view style="height: 500px;position: relative;">
    <h-watermark position="absolute"></h-watermark>
</view>

<!-- 自定义放大缩小 -->
<h-watermark :scale="0.5"></h-watermark>

<!-- 自定义水印列数 -->
<h-watermark :column="50"></h-watermark>

```

## API

### Props

|  属性名		|  类型		| 默认值		|           说明			|
| :-------:		| :-----:	| :-----:		| :-----------------------:	|
| title			| String	| 水印组件		| 标题文字					|
| titleShow		| Boolean	| true			| 是否显示标题文字			|
| titleSize		| Number	| 16			| 标题文字字号				|
| titleColor	| String	| #f15723		| 标题文字颜色				|
| titleLucency	| Number	| 0.2			| 标题文字透明度			|
| mobile		| String	| 18761665823	| 联系电话					|
| mobileShow	| Boolean	| true			| 是否显示联系电话			|
| mobileSize	| Number	| 10			| 联系电话字号				|
| mobileColor	| String	| #f15723		| 联系电话颜色				|
| mobileLucency	| Number	| 0.2			| 联系电话透明度			|
| appName		| String	| 组件			| 软件名称					|
| appNameShow	| Boolean	| true			| 是否显示软件名称			|
| appNameSize	| Number	| 10			| 软件名称字号				|
| appNameColor	| String	| #f15723		| 软件名称颜色				|
| appNameLucency| Number	| 0.2			| 软件名称透明度			|
| rotate		| Number	| -45			| 旋转弧度					|
| position	| String	| fixed	| 布局方式（绝对布局-相对布局）	|
| scale	| Number	| 1	| 放大缩小	|
| column	| Number	| 15	| 水印列数	|