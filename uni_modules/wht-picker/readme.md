# WHT Picker 选择器

一个功能强大、易用的选择器组件，支持单列、多列、级联等多种选择方式。

## 特性
- 支持单列选择
- 支持多列选择
- 支持级联选择
- 支持自定义样式
- 支持地区选择
- 支持清空功能
- 支持代码设置值

## 安装

在插件市场中搜索 `wht-picker` 或直接导入插件到项目中。

## 基础用法

```vue
<template>
    <view>
        <!-- 单列选择器 -->
        <button @tap="openSinglePicker">打开单列选择器</button>
        <wht-picker v-model="selectedValue" :columns="columns" type="single" @confirm="onConfirm" ref="picker" />
		<view>{{ result }}</view>
    </view>
</template>
<script>
    export default {
        data() {
            return {
                selectedValue: [0], // 当前选中值
                columns: [
                    { label: '选项1', value: 1 },
                    { label: '选项2', value: 2 },
                    { label: '选项3', value: 3 }
                ],
				result: ''
            }
        },
        methods: {
            openSinglePicker() {
                this.$refs.picker.open()
            },
            onConfirm(e) {
                console.log('选中值:', e.value)
                console.log('选中项:', e.items)
                console.log('显示文本:', e.display)
				this.result = e.display
            }
        }
    }
</script>
```

## 属性说明

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| type | String | 'single' | 选择器类型，可选值：single/multi/linkage |
| modelValue | Array | [] | 当前选中值，使用v-model绑定 |
| columns | Array | [] | 选择器数据 |
| title | String | '请选择' | 选择器标题 |
| labelKey | String | 'label' | 展示文字的键名 |

## 事件说明

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| confirm | 点击确定按钮时触发 | {value, items, display} |
| cancel | 点击取消按钮时触发 | - |
| change | 选项改变时触发 | {value, items} |

## 方法说明

| 方法名 | 说明 | 参数 |
|--------|------|------|
| open | 打开选择器 | - |
| close | 关闭选择器 | - |
| setValue | 设置选中值 | value: Array |
| clear | 清空选中值 | - |