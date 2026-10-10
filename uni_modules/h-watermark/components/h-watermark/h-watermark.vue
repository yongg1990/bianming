<!-- 水印组件 -->

<template>
	<view class="watermark" :style="{position: position}">
		<canvas canvas-id="watermark" style="position: absolute;"
			:style="{transform: 'scale(' + scale + ')',width: canvasWidth + '%',height: canvasWidth + '%',top: canvasTop + '%',left: canvasTop + '%'}"></canvas>
	</view>
</template>

<script>
	/**
	 * @description 水印
	 * @example <h-watermark></h-watermark>
	 * 
	 * @property {String}			title				标题文字（默认 水印组件 ）
	 * @property {Boolean}			titleShow			是否显示标题文字（默认 true ）
	 * @property {Number}			titleSize			标题文字字号（默认 16 ）
	 * @property {String}			titleColor			标题文字颜色（默认 #f15723 ）
	 * @property {Number}			titleLucency		标题文字透明度（默认 0.2 ）
	 * @property {String}			mobile				联系电话（默认 18761665823 ）
	 * @property {Boolean}			mobileShow			是否显示联系电话（默认 true ）
	 * @property {Number}			mobileSize			联系电话字号（默认 10 ）
	 * @property {String}			mobileColor			联系电话颜色（默认 #f15723 ）
	 * @property {Number}			mobileLucency		联系电话透明度（默认 0.2 ）
	 * @property {String}			appName				软件名称（默认 组件 ）
	 * @property {Boolean}			appNameShow			是否显示软件名称（默认 true ）
	 * @property {Number}			appNameSize			软件名称字号（默认 10 ）
	 * @property {String}			appNameColor		软件名称颜色（默认 #f15723 ）
	 * @property {Number}			appNameLucency		软件名称透明度（默认 0.2 ）
	 * @property {Number}			rotate				旋转弧度（默认 -45 ）
	 * @property {Object}			position			布局方式（绝对布局-相对布局）（默认 'fixed-绝对布局' ）
	 * @property {Number}			scale				放大缩小（默认1）
	 * @property {Number}			column				水印列数（默认15）
	 * 
	 */

	export default {
		// 小程序样式穿透
		options: {
			styleIsolation: 'shared'
		},
		props: {
			// 标题文字
			title: {
				type: String,
				default: '水印组件'
			},
			// 是否显示标题文字
			titleShow: {
				type: Boolean,
				default: true
			},
			// 标题文字字号
			titleSize: {
				type: Number,
				default: 16
			},
			// 标题文字颜色
			titleColor: {
				type: String,
				default: '#f15723'
			},
			// 标题文字透明度
			titleLucency: {
				type: Number,
				default: 0.2
			},
			// 联系电话
			mobile: {
				type: String,
				default: '18761665823'
			},
			// 是否显示联系电话
			mobileShow: {
				type: Boolean,
				default: true
			},
			// 联系电话字号
			mobileSize: {
				type: Number,
				default: 10
			},
			// 联系电话颜色
			mobileColor: {
				type: String,
				default: '#f15723'
			},
			// 联系电话透明度
			mobileLucency: {
				type: Number,
				default: 0.2
			},
			// 软件名称
			appName: {
				type: String,
				default: '组件'
			},
			// 是否显示软件名称
			appNameShow: {
				type: Boolean,
				default: true
			},
			// 软件名称字号
			appNameSize: {
				type: Number,
				default: 10
			},
			// 软件名称颜色
			appNameColor: {
				type: String,
				default: '#f15723'
			},
			// 软件名称透明度
			appNameLucency: {
				type: Number,
				default: 0.2
			},
			// 旋转弧度
			rotate: {
				type: Number,
				default: -45
			},
			// 布局方式（绝对布局-相对布局）
			position: {
				type: String,
				default: 'fixed'
			},
			// 放大缩小
			scale: {
				type: Number,
				default: 1
			},
			// 水印列数
			column: {
				type: Number,
				default: 15
			},
		},
		mounted() {
			this.$nextTick(() => {
				this.createWatemark();
			})
		},
		watch: {
			all(val) {
				this.$nextTick(() => {
					this.createWatemark();
				})
			}
		},
		computed: {
			// 画布宽度 
			canvasWidth() {
				return 100 / this.scale
			},
			// 画布距离顶部高度
			canvasTop() {
				return -((100 / this.scale) - 100) / 2
			},
			all() {
				const {
					title,
					titleShow,
					titleSize,
					titleColor,
					titleLucency,
					mobile,
					mobileShow,
					mobileSize,
					mobileColor,
					mobileLucency,
					appName,
					appNameShow,
					appNameSize,
					appNameColor,
					appNameLucency,
					rotate,
					position,
					scale,
					column,
				} = this
				return {
					title,
					titleShow,
					titleSize,
					titleColor,
					titleLucency,
					mobile,
					mobileShow,
					mobileSize,
					mobileColor,
					mobileLucency,
					appName,
					appNameShow,
					appNameSize,
					appNameColor,
					appNameLucency,
					rotate,
					position,
					scale,
					column,
				};
			}
		},
		methods: {
			createWatemark() {
				let ctx = uni.createCanvasContext('watermark', this);
				const title = this.title
				const mobile = this.mobile
				const appName = this.appName
				const titleColor = this.colorRgba(this.titleColor, this.titleLucency)
				const mobileColor = this.colorRgba(this.mobileColor, this.mobileLucency)
				const appNameColor = this.colorRgba(this.appNameColor, this.appNameLucency)
				// 旋转弧度
				ctx.rotate((this.rotate * Math.PI) / 180);
				// 设置字体颜色
				ctx.setFillStyle('#000');
				for (let j = 0; j < this.column; j++) {
					for (let i = 1; i < this.column; i++) {
						//这个for循环代表横向循环，
						let num = 0
						ctx.beginPath();
						if (this.titleShow) {
							ctx.setFontSize(this.titleSize);
							ctx.setFillStyle(titleColor);
							ctx.fillText(title, 135 * -i, 150 * j);
							num++
						}
						if (this.mobileShow) {
							ctx.setFontSize(this.mobileSize);
							ctx.setFillStyle(mobileColor);
							ctx.fillText(mobile, 135 * -i + 20 * num, 150 * j + 20 * num);
							num++
						}
						if (this.appNameShow) {
							ctx.setFontSize(this.appNameSize);
							ctx.setFillStyle(appNameColor);
							ctx.fillText(appName, 135 * -i + 20 * num, 150 * j + 20 * num);
						}
					}
					for (let i = 1; i < this.column; i++) {
						//这个for循环代表横向循环，
						let num = 0
						ctx.beginPath();
						if (this.titleShow) {
							ctx.setFontSize(this.titleSize);
							ctx.setFillStyle(titleColor);
							ctx.fillText(title, 135 * i, -150 * j);
							num++
						}
						if (this.mobileShow) {
							ctx.setFontSize(this.mobileSize);
							ctx.setFillStyle(mobileColor);
							ctx.fillText(mobile, 135 * i + 20 * num, -150 * j + 20 * num);
							num++
						}
						if (this.appNameShow) {
							ctx.setFontSize(this.appNameSize);
							ctx.setFillStyle(appNameColor);
							ctx.fillText(appName, 135 * i + 20 * num, -150 * j + 20 * num);
						}
					}
					for (let i = 1; i < this.column; i++) {
						//这个for循环代表横向循环，
						let num = 0
						ctx.beginPath();
						if (this.titleShow) {
							ctx.setFontSize(this.titleSize);
							ctx.setFillStyle(titleColor);
							ctx.fillText(title, -135 * i, -150 * j);
							num++
						}
						if (this.mobileShow) {
							ctx.setFontSize(this.mobileSize);
							ctx.setFillStyle(mobileColor);
							ctx.fillText(mobile, -135 * i + 20 * num, -150 * j + 20 * num);
							num++
						}
						if (this.appNameShow) {
							ctx.setFontSize(this.appNameSize);
							ctx.setFillStyle(appNameColor);
							ctx.fillText(appName, -135 * i + 20 * num, -150 * j + 20 * num);
						}
					}
					for (let i = 0; i < this.column; i++) {
						//这个for循环代表横向循环，
						let num = 0
						ctx.beginPath();
						if (this.titleShow) {
							ctx.setFontSize(this.titleSize);
							ctx.setFillStyle(titleColor);
							ctx.fillText(title, 135 * i, 150 * j);
							num++
						}
						if (this.mobileShow) {
							ctx.setFontSize(this.mobileSize);
							ctx.setFillStyle(mobileColor);
							ctx.fillText(mobile, 135 * i + 20 * num, 150 * j + 20 * num);
							num++
						}
						if (this.appNameShow) {
							ctx.setFontSize(this.appNameSize);
							ctx.setFillStyle(appNameColor);
							ctx.fillText(appName, 135 * i + 20 * num, 150 * j + 20 * num);
						}
					}
				}
				ctx.draw();
			},
			// 颜色转换
			colorRgba(sHex, alpha = 1) {
				// 十六进制颜色值的正则表达式
				var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
				/* 16进制颜色转为RGB格式 */
				let sColor = sHex.toLowerCase()
				if (sColor && reg.test(sColor)) {
					if (sColor.length === 4) {
						var sColorNew = '#'
						for (let i = 1; i < 4; i += 1) {
							sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
						}
						sColor = sColorNew
					}
					//  处理六位的颜色值
					var sColorChange = []
					for (let i = 1; i < 7; i += 2) {
						sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
					}
					if (alpha == 1) {
						return sColorChange.join(',')
					} else {
						return 'rgba(' + sColorChange.join(',') + ',' + alpha + ')'
					}
				} else {
					return sColor
				}
			}
		}
	};
</script>

<style>
	.watermark {
		pointer-events: none;
		z-index: 0;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}
</style>