<template>
	<view class="container">
		<!-- 顶部导航栏 -->
		<view class="navbar">
			<view class="navbar-left" @click="navigateBack">
				<text class="back-icon">&lt;</text>
			</view>
			<view class="navbar-title">地址管理</view>
			<view class="navbar-right"></view>
		</view>

		<!-- 患者信息区域 -->
		<view class="patient-infoBox">
			<view class="patient-header">
				<view class="patient-info">
					<text class="patient-label">当前患者： </text>
					<text
						class="patient-name">{{ Object.keys(info).length ? !eyeFlg ? '**' + info.userName.slice(-1) : info.userName : '***' }}</text>
					<uni-icons :type="eyeFlg ? 'eye' : 'eye-slash'" color="#fff" size="22" @tap="togEyeFun"></uni-icons>
				</view>
				<view class="basic-info-btn" @tap="showDrawer('新增', {})">新增地址</view>
			</view>
		</view>

		<!-- 处方记录列表 -->
		<view class="prescription-list">
			<view class="prescription-item" v-for="(prescription, index) in prescriptions" :key="index">
				<view class="prescription-header">
					<text class="prescription-type">{{ prescription.shrxm }} {{ prescription.shrsjh }}</text>
					<text class="prescription-status" @tap="setDufFun(prescription)"
						:class="{'status-received': prescription.isDefault}">{{ prescription.isDefault ? '默认' : '设为默认' }}</text>
				</view>
				<view class="prescription-body">
					<view class="prescription-infoL">
						<view class="info-label">
							{{ prescription.shrdzsheng }} {{ prescription.shrdzshi }} {{ prescription.shrdzxian }}
						</view>
						<view class="info-value">{{ prescription.shrdzxxdz }}</view>
					</view>
					<view class="prescription-infoR">
						<uni-icons type="compose" size="22" @tap="showDrawer('编辑', prescription)"></uni-icons>
						<uni-icons class="delIcon" type="trash" @tap="delFun(prescription)" color="red"
							size="22"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="popup" background-color="#fff" :mask-click="false" type="dialog">
			<uni-popup-dialog v-if="popupTit === '删除'" type="warn" title="删除提醒" cancelText="取消" confirmText="确定"
				content="确定要删除该条收货地址吗" @confirm="dialogConfirm" @close="closeDrawer">
			</uni-popup-dialog>
			<view v-else class="popup-content popup-height">
				<view class="popup-tit">
					<view class="p-tit">{{popupTit}}</view>
					<view class="p-cos" @tap="closeDrawer">
						<uni-icons type="closeempty" size="22"></uni-icons>
					</view>
				</view>
				<view class="add-content">
					<view class="add-item" v-for="(v, i) in addressDt" :key="i">
						<view class="itm-label">{{v.name}}</view>：
						<view class="itm-value">
											<input v-if="i !== 3 && i !== 5" placeholder-class="inputP" v-model="v[v.key]" class="puCls"
										:placeholder="v.placeholder" />
									<view v-if="i === 3" class="puCls" :class="{on: !addressDt[3].address.length }"
								@tap="showConfirm">
										{{addressDt[3].address.length ? addressDt[3].address : addressDt[3].placeholder}}
							</view>
									<switch v-if="i === 5" :checked="addressDt[5].isDefault" @change="switchChange" />
						</view>
					</view>
					<view class="add-btn">
						<button type="primary" :loading="popupLoading"
									:disabled="!canSubmit" @tap="saveAddFun">保存</button>
					</view>
				</view>
			</view>
		</uni-popup>
		<wht-picker ref="picker" :columns="mapJson" :value="addressVal" :model-value="addressVal" type="linkage" @cancel="closeConfirm"
			@confirm="onConfirm" />
	</view>
</template>

<script>
	import mapJson from './map.json'
	import { cfListFun } from '../../request'

	const createAddressForm = () => [{
		name: '收货人', placeholder: '请输入收货人', shrxm: '', key: 'shrxm'
	}, {
		name: '联系电话', placeholder: '请输入联系电话', shrsjh: '', key: 'shrsjh'
	}, {
		name: '固定电话', placeholder: '请输入固定电话（选填）', shrgh: '', key: 'shrgh'
	}, {
		name: '所在地区', placeholder: '请选择所在省市区', address: '', key: 'address'
	}, {
		name: '详情地址', placeholder: '请输入详情地址', shrdzxxdz: '', key: 'shrdzxxdz'
	}, {
		name: '设为默认', isDefault: false, key: 'isDefault'
	}]

	export default {
		data() {
			return { mapJson, info: {}, editDt: {}, popupLoading: false, eyeFlg: false, addressVal: [], popupTit: '新增地址', addressDt: createAddressForm(), prescriptions: [] }
		},
		computed: {
			canSubmit() {
				return !!(this.addressDt[0].shrxm && this.addressDt[1].shrsjh && this.addressDt[3].address && this.addressDt[4].shrdzxxdz)
			}
		},
		onLoad() {
			this.info = uni.getStorageSync('userInfo') || {}
			if (this.info.idCard) this.getListFun()
		},
		onShow() {
			if (typeof window !== 'undefined' && window.parent) {
				window.parent.postMessage({ type: 'FROM_CHILD', payload: 'ssss', timestamp: new Date().toLocaleTimeString() }, '*')
			}
		},
		methods: {
			navigateBack() { uni.navigateBack({ delta: 1 }) },
			getListFun() {
				cfListFun('getConsignee', { zjhm: this.info.idCard }).then(res => { this.prescriptions = Array.isArray(res.data) ? res.data : [] })
			},
			isSuccess(res) { return !!res && [200, 0, '200', '0'].indexOf(res.code) !== -1 },
			showResult(res) { uni.showToast({ icon: 'none', title: (res && res.msg) || '操作失败' }) },
			buildParams() {
				const region = (this.addressDt[3].address || '').split('/')
				return { shrxm: String(this.addressDt[0].shrxm || '').trim(), shrsjh: String(this.addressDt[1].shrsjh || '').trim(), shrgh: String(this.addressDt[2].shrgh || '').trim(), shrdzsheng: region[0] || '', shrdzshi: region[1] || '', shrdzxian: region[2] || '', shrdzxxdz: String(this.addressDt[4].shrdzxxdz || '').trim(), isDefault: this.addressDt[5].isDefault ? 1 : 0 }
			},
			saveAddFun() {
				if (!this.canSubmit || this.popupLoading) return
				this.popupLoading = true
				const isEdit = !!this.editDt.recordId
				const params = { zjhm: this.info.idCard, hzxm: this.info.userName, ...this.buildParams() }
				if (isEdit) params.recordId = this.editDt.recordId
				cfListFun(isEdit ? 'updateConsignee' : 'addConsignee', params).then(res => {
					this.showResult(res)
					if (this.isSuccess(res)) { this.closeDrawer(); this.getListFun() }
				}).finally(() => { this.popupLoading = false })
			},
			switchChange(e) { this.addressDt[5].isDefault = !!e.detail.value },
			togEyeFun() { this.eyeFlg = !this.eyeFlg },
			setDufFun(v) {
				if (v.isDefault || this.popupLoading) return
				this.popupLoading = true
				cfListFun('updateConsignee', { zjhm: this.info.idCard, hzxm: this.info.userName, recordId: v.recordId, shrxm: v.shrxm || '', shrsjh: v.shrsjh || '', shrgh: v.shrgh || '', shrdzsheng: v.shrdzsheng || '', shrdzshi: v.shrdzshi || '', shrdzxian: v.shrdzxian || '', shrdzxxdz: v.shrdzxxdz || '', isDefault: 1 }).then(res => { this.showResult(res); if (this.isSuccess(res)) this.getListFun() }).finally(() => { this.popupLoading = false })
			},
			delFun(v) { this.editDt = v; this.popupTit = '删除'; this.$refs.popup.open() },
			showDrawer(k, item) {
				this.popupTit = k + '收货地址'; this.editDt = item || {}; this.addressVal = []
				this.addressDt = createAddressForm()
				if (k === '编辑') {
					this.addressDt[0].shrxm = item.shrxm || ''; this.addressDt[1].shrsjh = item.shrsjh || ''; this.addressDt[2].shrgh = item.shrgh || ''; this.addressDt[4].shrdzxxdz = item.shrdzxxdz || ''; this.addressDt[5].isDefault = item.isDefault > 0
					this.setRegion(item)
				}
				this.$refs.popup.open('bottom')
			},
			setRegion(item) {
				const province = this.mapJson.findIndex(v => v.label === item.shrdzsheng); if (province < 0) return
				this.addressVal = [province]; this.addressDt[3].address = item.shrdzsheng
				const city = this.mapJson[province].children || []; const cityIndex = city.findIndex(v => v.label === item.shrdzshi); if (cityIndex < 0) return
				this.addressVal.push(cityIndex); this.addressDt[3].address += '/' + item.shrdzshi
				const county = city[cityIndex].children || []; const countyIndex = county.findIndex(v => v.label === item.shrdzxian); if (countyIndex >= 0) { this.addressVal.push(countyIndex); this.addressDt[3].address += '/' + item.shrdzxian }
			},
			closeDrawer() { this.$refs.popup.close(); this.addressDt = createAddressForm(); this.editDt = {} },
			dialogConfirm() {
				cfListFun('deleteConsignee', { recordId: this.editDt.recordId }).then(res => { this.showResult(res); if (this.isSuccess(res)) { this.closeDrawer(); this.getListFun() } })
			},
			showConfirm() {
				const value = this.addressVal.slice()
				let columns = this.mapJson
				let level = 0
				while (columns && columns.length) {
					const index = value[level] == null ? 0 : value[level]
					value[level] = index
					columns = columns[index].children
					level++
				}
				this.$refs.picker.setValue(value)
				this.$refs.picker.open()
			},
			closeConfirm() { this.$refs.picker.close(); this.$refs.picker.clear() },
			onConfirm(e) { this.addressVal = e.value.slice(); this.addressDt[3].address = e.display; this.closeConfirm() }
		}
	}
</script>

<style scoped lang="scss">
	.container {
		width: 100%;
		min-height: 100vh;
		background-color: #f5f5f5;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	}

	/* 顶部导航栏 */
	.navbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100rpx;
		background-color: #1890ff;
		padding: 0 30rpx;
		color: #fff;
		position: relative;
		z-index: 100;

		.navbar-left {
			width: 80rpx;

			.back-icon {
        font-size: 60rpx;
        color: white;
        font-weight: bold;
        position: absolute;
        left: 26px;
        top: -2px;
			}
		}

		.navbar-title {
			font-size: 36rpx;
			font-weight: 500;
		}

		.navbar-right {
			width: 80rpx;
		}
	}

	/* 患者信息区域 */
	.patient-infoBox {
		background-color: #1890ff;
		padding: 30rpx;
		color: #fff;
		position: relative;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.18);

		.patient-header {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 30rpx;

			.patient-info {
				flex: 1;

				.patient-name {
					font-size: 36rpx;
					font-weight: 500;
					margin-right: 20rpx;
				}
			}

			.basic-info-btn {
				background-color: rgba(255, 255, 255, 0.2);
				padding: 8rpx 20rpx;
				border-radius: 20rpx;
				font-size: 24rpx;
			}
		}
	}

	.prescription-item {
		background-color: #fff;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);

		.prescription-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20rpx;

			.prescription-type {
				font-size: 28rpx;
				font-weight: 500;
				color: #333;
			}

			.prescription-status {
				font-size: 24rpx;
				padding: 4rpx 16rpx;
				border-radius: 16rpx;
				background-color: #eee;
				color: #666;

				&.status-received {
					background-color: #e6f7ff;
					color: #1890ff;
				}
			}
		}

		.prescription-body {
			border-top: 2rpx solid #f0f0f0;
			padding-top: 20rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;

			.prescription-infoL {
				flex: 1;

				.info-label {
					font-size: 26rpx;
					color: #333;
					margin-bottom: 12rpx;
				}

				.info-value {
					font-size: 26rpx;
					color: #666;
				}
			}

			.prescription-infoR {
				.delIcon {
					margin-left: 12rpx;
				}
			}
		}
	}

	.popup-content {
		//height: calc(100vh - 100rpx);
		height: 60vh;

		.inputP {
			font-size: 22rpx;
		}

		.popup-tit {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding: 22rpx;
			font-size: 30rpx;
			color: #222;
			border-bottom: 2rpx solid #dcd6d6;
		}

		.add-item {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			border-bottom: 2rpx solid #dcd6d6;
			padding: 16rpx;

			.itm-label {
				width: 140rpx;
				text-align: justify;
				text-align-last: justify;
				font-size: 26rpx;
			}

			.itm-value {
				flex: 1;
				text-align: right;

				.puCls {
					font-size: 26rpx;
					color: #444;

					&.on {
						color: #777;
						font-size: 22rpx;
					}
				}
			}
		}

		.add-btn {
			padding: 30rpx 5%;
		}
	}
</style>
