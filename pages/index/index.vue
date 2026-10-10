<template>
	<view class="container">
    <view v-if="homeFlg">
      <!-- 最近1处方详情 -->
      <Home :prescription="prescriptionDt" @backFun="backFun"></Home>
    </view>
    <view v-else>
      <!-- 顶部导航栏 -->
      <view class="navbar">
        <view class="navbar-left" @click="navigateBack">
          <text v-if="isMobile" class="back-icon">&lt;</text>
        </view>
        <view class="navbar-title">就诊记录</view>
        <view class="navbar-right"></view>
      </view>
      <!-- 患者信息区域 -->
      <view class="patient-info">
        <view class="patient-header">
          <image class="patient-avatar" :src="`/static/${avatarImg}.png`"></image>
          <view class="patient-details">
            <view class="name-section">
              <view>
                <text class="patient-name">{{ Object.keys(info).length ? !eyeFlg ? '**' + info.userName.slice(-1) : info.userName : '***'}}</text>
                <uni-icons :type="eyeFlg ? 'eye' : 'eye-slash'" color="#fff" size="22" @tap="togEyeFun"></uni-icons>
              </view>
              <view class="basic-info-btn" @tap="toPageFun">地址管理</view>
            </view>
            <view class="patient-meta">
              <text class="patient-gender" v-if="info.sex > -1 && info.sex < 3">{{ ['未知','男','女'][info.sex] }}</text>
              <text class="divider"></text>
              <!--						<text class="patient-age" v-if="info.idCard">{{ calculateAgeByIdCard(info.idCard) }}岁</text>-->
              <text class="record-history">近三个月记录</text>
            </view>
          </view>
        </view>
        <!-- 证件信息区域 -->
        <view class="id-info">
          <view class="id-item">
            <text class="id-label">证件号码</text>
            <text class="id-value" v-if="Object.keys(info).length">{{ !eyeFlg ? '**********' + info.idCard.slice(-4) : info.idCard }}</text>
          </view>
          <view class="id-line"></view>
          <view class="id-item">
            <text class="id-label">最近就诊</text>
            <text class="id-value">
                <uni-dateformat
                    v-if="prescriptions.length && prescriptions[0].prescriptionInfo"
                    :date="prescriptions[0].prescriptionInfo.cfrqTime"
                    :threshold="[0, 0]"
                    format="yyyy-MM-dd hh:mm:ss"
                />
            </text>
          </view>
        </view>
      </view>
      <scroll-view scroll-y="true" @scrolltolower="onScrollToLower" refresher-enabled="true"
                   :refresher-triggered="isRefresh" @refresherrefresh="onRefresh" class="prescription-list">
        <view class="prescription-item" v-for="(prescription, index) in prescriptions"
              @tap="gotoPageFun(prescription)" :key="index">
          <view class="prescription-header">
            <text class="prescription-type">院内处方码：{{ prescription.prescriptionInfo.yncfbh ? prescription.prescriptionInfo.yncfbh.split('.')[0] : '' }}</text>
            <text class="prescription-status"
                  :class="{'status-received': prescription.prescriptionInfo && prescription.prescriptionInfo.statusName === '已签收'}">{{ prescription.prescriptionInfo.statusName }}</text>
          </view>
          <view class="prescription-body">
            <view class="prescription-info">
              <text class="info-label">医疗机构</text>
              <text class="info-value">{{ prescription.institutionInfo ? prescription.institutionInfo.jgmc : '' }}</text>
            </view>
            <view class="prescription-info">
              <text class="info-label">开具日期</text>
              <text
                  v-if="prescription.prescriptionInfo.cfrqTime"
                  class="info-value"><uni-dateformat
                  :date="prescription.prescriptionInfo.cfrqTime"
                  :threshold="[0, 0]"
                  format="yyyy-MM-dd hh:mm:ss"
              /></text>
            </view>
            <view class="prescription-info">
              <text class="info-label">配送地址</text>
              <text
                  class="info-value">{{ prescription.consigneeInfo ? prescription.consigneeInfo.shrdzsheng + prescription.consigneeInfo.shrdzshi + prescription.consigneeInfo.shrdzxian + prescription.consigneeInfo.shrdzxxdz : '' }}</text>
            </view>
          </view>
        </view>
        <view class="loading-status" v-if="loading">
          <text>正在加载更多...</text>
        </view>
        <view class="no-more" v-if="noMoreData && !loading && prescriptions.length > 3">
          <text>没有更多数据了</text>
        </view>
        <view v-if="!prescriptions.length" style="text-align: center;color: #666;margin-top: 20%">
          <svg t="1776323976928" class="icon" viewBox="0 0 1561 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15500" width="200" height="200"><path d="M156.16 699.763h21.03a10.432 10.432 0 0 1 10.202 10.445c0 5.76-4.48 10.445-10.202 10.445h-21.03v21.094a10.432 10.432 0 0 1-10.406 10.24 10.227 10.227 0 0 1-10.42-10.24V720.64h-21.03a10.432 10.432 0 0 1-10.202-10.445c0-5.76 4.48-10.445 10.202-10.445h21.03v-21.094c0.128-5.683 4.736-10.24 10.42-10.24 5.747 0 10.406 4.506 10.406 10.24v21.107z m1374.208-83.558V595.11a10.291 10.291 0 0 0-10.406-10.24 10.432 10.432 0 0 0-10.42 10.24v21.095h-21.03a10.24 10.24 0 0 0-10.202 10.445c0 5.593 4.583 10.444 10.202 10.444h21.03v21.095c0 5.747 4.672 10.24 10.42 10.24a10.432 10.432 0 0 0 10.406-10.24v-21.095h21.03a10.266 10.266 0 0 0 10.202-10.444 10.432 10.432 0 0 0-10.202-10.445h-21.03zM773.965 960.858h-524.16a20.757 20.757 0 0 1-14.72-6.106 20.915 20.915 0 0 1 14.707-35.66h94.426a83.213 83.213 0 0 1-11.072-41.678V271.45a83.528 83.528 0 0 1 24.448-59.072 83.085 83.085 0 0 1 58.918-24.384h62.374v-20.992a83.629 83.629 0 0 1 24.448-59.06 83.085 83.085 0 0 1 58.932-24.384h499.532a83.046 83.046 0 0 1 58.944 24.372 83.584 83.584 0 0 1 24.436 59.072v605.964a83.251 83.251 0 0 1-11.098 41.677h115.174c11.52 0 20.852 9.28 20.852 20.89 0 11.52-9.268 20.89-20.826 20.89H999.424v20.991a83.251 83.251 0 0 1-11.098 41.677h11.162c11.456 0 20.762 9.267 20.762 20.877 0 11.533-9.434 20.89-20.762 20.89H889.946a41.754 41.754 0 0 1-6.4 50.867 41.472 41.472 0 0 1-58.88 0l-50.688-50.867z m76.134-41.767h66.202c22.912 0 41.472-18.598 41.472-41.881V270.464c0-22.566-17.984-40.704-40.18-40.704H414.977c-22.195 0-40.18 18.227-40.18 40.704V877.21c0 23.116 18.74 41.881 41.46 41.881h316.032l-10.7-10.752a41.78 41.78 0 0 1-10.817-40.384l-19.66-19.737a145.46 145.46 0 0 1-197.261-21.581c-49.984-57.895-46.976-144.666 6.886-198.938 54.029-54.4 140.8-57.6 198.656-7.321 57.869 50.265 67.11 136.883 21.158 198.297l19.674 19.738a41.408 41.408 0 0 1 40.256 10.841l69.606 69.837z m149.325-104.448h62.656a41.728 41.728 0 0 0 41.446-41.779v-605.76c0-23.142-18.56-41.78-41.446-41.78H561.971a41.728 41.728 0 0 0-41.433 41.78v20.89h395.52a83.046 83.046 0 0 1 58.93 24.37 83.584 83.584 0 0 1 24.436 59.086v543.193zM265.472 47.002h31.027c8.743 0 15.821 6.95 15.821 15.667a15.744 15.744 0 0 1-15.82 15.667h-31.028v31.104c0 8.78-6.938 15.872-15.616 15.872a15.693 15.693 0 0 1-15.616-15.872V78.336h-31.027a15.654 15.654 0 1 1 0-31.334h31.027v-31.13C234.24 7.104 241.178 0 249.856 0c8.614 0 15.616 7.104 15.616 15.872v31.13zM20.826 939.968c0-11.52 9.433-20.877 20.748-20.877H166.63c11.456 0 20.762 9.267 20.762 20.877 0 11.533-9.434 20.89-20.762 20.89H41.574a20.772 20.772 0 0 1-14.707-6.106 20.838 20.838 0 0 1-6.041-14.784zM677.44 804.954a104.691 104.691 0 0 0 26.957-100.903 104.294 104.294 0 0 0-73.626-73.856A103.898 103.898 0 0 0 530.19 657.23c-40.653 40.793-40.653 106.931 0 147.712a103.885 103.885 0 0 0 147.251 0zM458.074 313.318c0-11.52 9.305-20.864 20.8-20.876H707.93c11.494 0 20.812 9.344 20.812 20.876a20.864 20.864 0 0 1-20.812 20.89H478.886a20.736 20.736 0 0 1-14.732-6.093 20.864 20.864 0 0 1-6.08-14.797z m0 104.448c0-11.52 9.267-20.89 20.672-20.89h333.44a20.736 20.736 0 0 1 20.672 20.89c0 11.52-9.268 20.89-20.685 20.89h-333.44a20.8 20.8 0 0 1-20.672-20.89z m0 104.448c0-11.532 9.28-20.89 20.774-20.89h145.83c11.482 0 20.788 9.268 20.788 20.878 0 11.532-9.293 20.89-20.788 20.89h-145.83a20.672 20.672 0 0 1-14.72-6.106 20.838 20.838 0 0 1-6.054-14.784z m-395.61-125.35A62.426 62.426 0 0 1 8.371 365.53a62.848 62.848 0 0 1 0-62.656 62.426 62.426 0 0 1 54.093-31.335c34.496 0 62.464 28.058 62.464 62.656 0 34.611-27.968 62.669-62.464 62.669z m0-31.334a31.178 31.178 0 0 0 27.046-15.668 31.424 31.424 0 0 0 0-31.334 31.22 31.22 0 0 0-58.278 15.68 31.283 31.283 0 0 0 31.232 31.334z m1290.918-93.99c-34.496 0-62.464-28.058-62.464-62.67 0-34.61 27.968-62.668 62.464-62.668s62.464 28.057 62.464 62.668c0 34.612-27.968 62.67-62.464 62.67z m0-31.335c11.162 0 21.479-5.978 27.06-15.667a31.424 31.424 0 0 0 0-31.335 31.22 31.22 0 0 0-58.279 15.667 31.283 31.283 0 0 0 31.232 31.335z" p-id="15501"></path></svg>
        </view>
      </scroll-view>
    </view>
    <uni-popup
        v-if="reminderPrescriptions.length"
        ref="prescriptionReminder"
        class="reminder-popup"
        type="center"
        :is-mask-click="false">
      <view class="reminder-dialog">
        <view class="reminder-title">
          <uni-icons type="info-filled" color="#fff" size="18"></uni-icons>
          <text>中药处方提醒</text>
        </view>
        <scroll-view scroll-y="true" class="reminder-scroll">
          <view class="reminder-content">
            <view class="reminder-greeting">尊敬的患者，您好！</view>
            <view class="reminder-description">经系统查询，您当前有 {{ reminderPrescriptions.length }} 条中药饮片处方尚未完成全部煎配处理，请尽快联系中药房完成剩余调配。</view>
            <uni-collapse :key="reminderRequestId" accordion @change="reminderActivePanel = $event">
              <uni-collapse-item
                  v-for="(item, index) in reminderPrescriptions"
                  :key="item.prescriptionInfo.recordId || index"
                  class="reminder-panel"
                  :name="String(index)"
                  :open="index === 0"
                  :show-arrow="false"
                  :border="false"
                  title-border="none">
                <template v-slot:title>
                  <view class="reminder-panel-title" :class="{ 'reminder-panel-title-active': reminderActivePanel === String(index) }">
                    <view class="reminder-panel-heading">
                      <text class="reminder-panel-label">处方编号</text>
                      <text class="reminder-number">{{ item.prescriptionInfo.yncfbh ? item.prescriptionInfo.yncfbh.split('.')[0] : item.prescriptionInfo.recordId }}</text>
                    </view>
                    <view class="reminder-panel-arrow">
                      <uni-icons :type="reminderActivePanel === String(index) ? 'up' : 'down'" color="#1890ff" size="16"></uni-icons>
                    </view>
                  </view>
                </template>
                <view class="reminder-panel-content">
                  <view class="reminder-status-row">
                    <text class="reminder-label">处方状态</text>
                    <text class="reminder-status">{{ item.prescriptionInfo.statusName || '未完成' }}{{ item.splitPrescription || item.prescriptionInfo.splitPrescription ? ' · 拆分方' : '' }}</text>
                  </view>
                  <view class="reminder-status-row">
                    <text class="reminder-label">医院名称</text>
                    <text class="reminder-phone">{{ item.institutionInfo.jgmc }}</text>
                  </view>
                  <view class="reminder-status-row">
                    <text class="reminder-label">工作日 </text>
                    <text class="reminder-phone">08:00 — 12:00 14:30 — 17:30</text>
                  </view>
                  <view class="reminder-status-row">
                    <text class="reminder-label">联系电话</text>
                    <text class="reminder-phone">{{ item.institutionInfo.lxdh }}</text>
                  </view>
                  <view class="reminder-pharmacy">{{ item.institutionInfo.xxdz }}</view>
                </view>
              </uni-collapse-item>
            </uni-collapse>
          </view>
        </scroll-view>
        <view class="reminder-footer">
          <button class="reminder-confirm" @tap="closeReminder">我已知晓</button>
          <checkbox-group @change="changeReminderPreference">
            <label class="reminder-preference">
              <checkbox value="today" :checked="reminderSkipToday" color="#1890ff"></checkbox>
              <text>今日不再提醒</text>
            </label>
          </checkbox-group>
        </view>
      </view>
    </uni-popup>
	</view>
</template>

<script>
	import {
		login
	} from '@/request';
  import {
    cfListFun, configModuleFun, userFun
  } from "../../request";
  import Home from "./home";
	export default {
    components: {Home},
		data() {
			return {
				info: {},
        prescriptionDt: {},
				isMobile: false,
				loading: false,
				isRefresh: false,
				noMoreData: false,
        avatarImg: 'gb',
				homeFlg: false,
        ldFLg: false,
				eyeFlg: false,
				page: 1,
				pageSize: 10,
				total: 0,
				prescriptions: [],
        reminderPrescriptions: [],
        reminderActivePanel: '0',
        reminderSkipToday: false,
        reminderPatientId: '',
        reminderRequestId: 0,
        reminderDays: null
			};
		},
		onLoad(option) {
      this.getReminderDays().then(() => {
        return configModuleFun('get',{
          "moduleName" : "处方流转",
          "configGroup" : "患者端",
          "configName" :"版本"
        }).then(res=>{
          this.ldFLg = res.data === '兰大'
        })
      }).finally(()=>{
        if (option.AppId){
          this.getOptFun(option)
        } else if(option.zjhm){
          uni.setStorageSync('token', option.sessionKey || '')
          this.getListFun(option.zjhm)
        }
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i;
        this.isMobile = mobileRegex.test(userAgent)
      })
    },
    onShow(){
      this.postMessageFun( 'bbbb')
    },
    onHide(){
      this.postMessageFun('bbbb')
    },
    onUnload(){
      this.reminderRequestId++
    },
		methods: {
      getReminderDays(){
        return configModuleFun('get', {
          moduleName: '处方流转',
          configGroup: '患者端',
          configName: '处方提醒天数'
        }).then(res => {
          const value = res.data
          const days = Number(value)
          this.reminderDays = (res.code != null && res.code !== 0) || value == null || String(value).trim() === '' || !Number.isFinite(days) || days < 0
            ? null : days
        }).catch(() => {
          this.reminderDays = null
        })
      },
      getReminderDate(date = new Date()){
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      },
      getReminderStorageKey(patientId){
        return 'prescriptionReminderSkipDate:' + patientId
      },
      checkPrescriptionReminder(records, patientId, requestId){
        if (requestId !== this.reminderRequestId) return
        if (!Array.isArray(records) || !records.length) {
          this.reminderPrescriptions = []
          if (this.$refs.prescriptionReminder) this.$refs.prescriptionReminder.close()
          return
        }
        this.reminderPatientId = patientId
        const storageKey = this.getReminderStorageKey(patientId)
        this.reminderSkipToday = uni.getStorageSync(storageKey) === this.getReminderDate()
        if (this.reminderSkipToday) return
          const days = this.reminderDays
          if (days === null) {
            this.reminderPrescriptions = []
            if (this.$refs.prescriptionReminder) this.$refs.prescriptionReminder.close()
            return
          }
          const today = new Date()
          const todayTime = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
          this.reminderPrescriptions = records.filter(item => {
            if (!item || !item.prescriptionInfo) return false
            const info = item.prescriptionInfo || {}
            if (info.status == null || String(info.status).trim() === '' || !(Number(info.status) < 4) || !info.cfrqTime) return false
            const date = new Date(info.cfrqTime)
            if (Number.isNaN(date.getTime())) return false
            // 按自然日比较，避免开方时分秒影响提醒天数。
            const prescriptionTime = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
            return (todayTime - prescriptionTime) / 86400000 > days
          })
        console.log(this.reminderPrescriptions);
          if (this.reminderPrescriptions.length) {
            this.reminderActivePanel = '0'
            this.$nextTick(() => {
              if (requestId === this.reminderRequestId && this.reminderPrescriptions.length && uni.getStorageSync(storageKey) !== this.getReminderDate()) {
                this.$refs.prescriptionReminder.open()
              }
            })
          } else {
            if (this.$refs.prescriptionReminder) this.$refs.prescriptionReminder.close()
          }
      },
      changeReminderPreference(event){
        this.reminderSkipToday = event.detail.value.includes('today')
        const storageKey = this.getReminderStorageKey(this.reminderPatientId)
        if (this.reminderSkipToday) {
          uni.setStorageSync(storageKey, this.getReminderDate())
        } else {
          uni.removeStorageSync(storageKey)
        }
      },
      closeReminder(){
        if (this.$refs.prescriptionReminder) this.$refs.prescriptionReminder.close()
      },
      backFun(){
        this.homeFlg =false
        this.postMessageFun('bbbb')
      },
			onScrollToLower() {
				if (this.loading || this.noMoreData) return;
				this.loadMore();
			},
			loadMore() {
				if (this.prescriptions.length >= this.total) {
					this.noMoreData = true;
					return;
				}
				this.loading = true;
				this.page++;
				this.getListFun();
			},
			onRefresh() {
				if (this.isRefresh) return;
				this.isRefresh = true;
				this.page = 1;
				this.noMoreData = false;
				this.getListFun();
			},

			navigateBack() {
				if(this.isMobile){
					uni.navigateBack({
						delta: 1
					});
				}else{
					 localStorage.setItem('web_data', '这是Web端缓存的数据');
				}
			},
			gotoPageFun(data) {
				uni.setStorageSync('prescriptionData', data)
				uni.navigateTo({
					url: '/pages/prescriptionDtl/index'
				})
			},
			toPageFun() {
				uni.navigateTo({
					url: '/pages/address/index'
				})
			},
			togEyeFun() {
				this.eyeFlg = !this.eyeFlg
			},
      bindUserFun(){
        userFun('bindUser', {
          userId : this.info.userId,
          orgType: "4",
          idCard : this.info.idCard
        }).then(res=>{
          console.log(res, 'bindUser');
        })
      },
			getListFun(v) {
        const patientId = v || this.info.idCard || ''
        const reminderRequestId = ++this.reminderRequestId
				cfListFun('list', {
					"zjhm": patientId,
					"pageSize": this.pageSize,
					"pageNum": this.page
				}).then(res => {
					const newData = res.data.records || []
          if(v && this.page < 2 && newData.length){
            const dt = newData[0].patientInfo || {}
            this.avatarImg = this.getSexFun(dt.zjhm)
            this.avatarImg = dt.hzxb > 1 ? "g" : dt.hzxb > 0 ? "b" : 'gb';
            uni.setStorageSync('userAvatar', this.avatarImg)
            dt.userName = dt.hzxm
            dt.sex = dt.hzxb
            dt.idCard = dt.zjhm
            this.info = dt || {}
            uni.setStorageSync('userInfo', dt)
            if(this.ldFLg) {
              cfListFun('detail?recordId=' + newData[0].prescriptionInfo.recordId).then(res => {
                if (res.code === 0) {
                  this.prescriptionDt = res.data ||{}
                  this.homeFlg = this.prescriptionDt.prescriptionInfo.status < 11
                }
              })
            }
            this.postMessageFun(this.ldFLg ? 'aaaa' : 'bbbb')
          }else {
            this.homeFlg = false
            this.postMessageFun('bbbb')
          }
					this.prescriptions = this.page > 1 ? this.prescriptions.concat(newData) : newData;
          this.checkPrescriptionReminder(this.prescriptions, patientId, reminderRequestId)
					this.total = res.data.total
					this.isRefresh = false;
					uni.stopPullDownRefresh();
					this.loading = false;
					if (this.prescriptions.length >= this.total) {
						this.noMoreData = true;
					}
				}).catch(()=>this.postMessageFun('bbbb'))
			},
      postMessageFun(f){
        window.parent.postMessage({
          type: 'FROM_CHILD',
          payload: f,
          timestamp: new Date().toLocaleTimeString()
        }, '*');
      },
      getSexFun(idNumber){
        const idStr = String(idNumber);
        if (idStr.length === 15) {
          const genderDigit = parseInt(idStr.charAt(14));
          return genderDigit % 2 === 0 ? "g" : "b";
        } else if (idStr.length === 18) {
          const genderDigit = parseInt(idStr.charAt(16));
          return genderDigit % 2 === 0 ? "g" : "b";
        } else {
          return 'gb'
        }
      },
			getOptFun(dt) {
				login('ThirdLogin', [{
					"appId": dt.AppId,
					"userInfo": encodeURIComponent(dt.PatientInfo)
				}]).then(res => {
					const result = res.result
					if (result.sessionKey) {
						uni.setStorageSync('token', result.sessionKey)
						uni.setStorageSync('userInfo', result.user)
            this.avatarImg = this.getSexFun(result.user.idCard)
						uni.setStorageSync('userAvatar', this.avatarImg)
						this.info = result.user || {}
					} else {
						uni.clearStorageSync('token')
						uni.clearStorageSync('userInfo')
					}
				}).finally(() => {
					if (this.info.idCard){
            this.getListFun()
            this.bindUserFun()
          }
				})
			},

			calculateAgeByIdCard(idCard) {
				// 验证身份证号码格式
				if (!/^\d{15}(\d{2}[\dXx])?$/.test(idCard)) {
					throw new Error('身份证号码格式不正确');
				}

				let birthDateString;
				if (idCard.length === 15) {
					// 15位身份证：第7-12位是出生日期(YYMMDD)
					birthDateString = '19' + idCard.substring(6, 12); // 假设1900-1999年
				} else {
					// 18位身份证：第7-14位是出生日期(YYYYMMDD)
					birthDateString = idCard.substring(6, 14);
				}

				const year = parseInt(birthDateString.substring(0, 4));
				const month = parseInt(birthDateString.substring(4, 6)) - 1;
				const day = parseInt(birthDateString.substring(6, 8));

				// 创建出生日期对象
				const birthDate = new Date(year, month, day);

				// 获取当前日期
				const currentDate = new Date();

				// 计算年龄
				let age = currentDate.getFullYear() - birthDate.getFullYear();

				// 检查是否已过生日
				const currentMonth = currentDate.getMonth();
				const currentDay = currentDate.getDate();

				if (currentMonth < month || (currentMonth === month && currentDay < day)) {
					age--;
				}

				return age;
			}

		}
	};
</script>

<style scoped>
  .reminder-popup {
    z-index: 1000;
  }

  .reminder-dialog {
    width: calc(100vw - 80rpx);
    max-width: 920rpx;
    max-height: calc(100vh - 80rpx);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 16rpx;
    background: #fff;
    color: #333;
    box-shadow: 0 16rpx 64rpx rgba(0, 0, 0, 0.16);
  }

  .reminder-title {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    gap: 20rpx;
    padding: 30rpx 40rpx;
    background: #1890ff;
    color: #fff;
    font-size: 36rpx;
    font-weight: 600;
  }

  .reminder-scroll {
    min-height: 0;
    height: 840rpx;
    max-height: calc(100vh - 520rpx);
  }

  .reminder-content {
    padding: 40rpx 36rpx 0;
  }

  .reminder-greeting {
    margin-bottom: 16rpx;
    font-size: 32rpx;
    line-height: 1.6;
  }

  .reminder-description {
    margin-bottom: 20rpx;
    color: #666;
    font-size: 28rpx;
    line-height: 1.8;
    text-indent: 2em;
  }

  .reminder-panel-title {
    display: flex;
    align-items: center;
    gap: 20rpx;
    min-height: 112rpx;
    padding: 24rpx;
    box-sizing: border-box;
    background: #fff;
    font-size: 26rpx;
  }

  .reminder-panel {
    margin-bottom: 16rpx;
    border: 2rpx solid #e8edf2;
    border-radius: 8rpx;
    overflow: hidden;
  }

  .reminder-panel-title-active {
    background: #e6f7ff;
  }

  .reminder-panel-heading {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
  }

  .reminder-panel-label {
    color: #89939e;
    font-size: 22rpx;
    line-height: 1.4;
  }

  .reminder-panel-arrow {
    flex-shrink: 0;
    width: 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .reminder-label {
    flex-shrink: 0;
    color: #777;
  }

  .reminder-number {
    min-width: 0;
    color: #333;
    font-weight: 500;
    font-size: 26rpx;
    line-height: 1.5;
    text-align: left;
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  .reminder-panel-title-active .reminder-number {
    color: #1890ff;
  }

  .reminder-panel-content {
    padding: 28rpx 24rpx 36rpx;
    font-size: 28rpx;
  }

  .reminder-status-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 20rpx;
    margin-bottom: 20rpx;
  }

  .reminder-status-row {
    justify-content: space-between;
  }

  .reminder-status {
    padding: 8rpx 20rpx;
    border-radius: 8rpx;
    background: #fff7e6;
    color: #d48806;
    line-height: 1.5;
    font-size: 24rpx;
    word-break: break-all;
  }

  .reminder-phone {
    color: #1890ff;
    font-weight: 600;
    cursor: pointer;
  }

  .reminder-pharmacy {
    color: #999;
    font-size: 26rpx;
    line-height: 1.7;
  }

  .reminder-footer {
    flex-shrink: 0;
    padding: 32rpx 36rpx;
    border-top: 2rpx solid #f0f0f0;
  }

  .reminder-confirm {
    width: 100%;
    height: 80rpx;
    border-radius: 12rpx;
    background: #1890ff;
    color: #fff;
    font-size: 30rpx;
    font-weight: 600;
    letter-spacing: 2rpx;
    line-height: 80rpx;
  }

  .reminder-confirm::after {
    border: none;
  }

  .reminder-preference {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
    margin-top: 28rpx;
    color: #666;
    font-size: 28rpx;
  }

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
	}

	.navbar-left {
		width: 80rpx;
	}

	.back-icon {
		font-size: 60rpx;
		font-weight: bold;
    position: absolute;
    left: 26px;
    top: -2px;
    color: #fff;
	}

	.navbar-title {
		font-size: 36rpx;
		font-weight: 500;
	}

	.navbar-right {
		width: 80rpx;
	}

	/* 患者信息区域 */
	.patient-info {
		background-color: #1890ff;
		padding: 30rpx;
		color: #fff;
		position: relative;
		margin-bottom: 30rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.18);
	}

	.patient-header {
		display: flex;
		margin-bottom: 30rpx;
	}

	.patient-avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		/*background-color: rgba(255, 255, 255, 0.05);*/
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 30rpx;
	}

	.avatar-text {
		font-size: 48rpx;
		font-weight: 500;
	}

	.patient-details {
		flex: 1;
	}

	.name-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 10rpx 0;
	}

	.patient-name {
		font-size: 36rpx;
		font-weight: 500;
		margin-right: 20rpx;
	}

	.basic-info-btn {
		background-color: rgba(255, 255, 255, 0.2);
		padding: 8rpx 20rpx;
		border-radius: 20rpx;
		font-size: 24rpx;
	}

	.patient-meta {
		display: flex;
		align-items: center;
		margin-top: 10rpx;
		font-size: 28rpx;
	}

	.divider {
		margin: 0 10rpx;
	}

	.record-history {
		font-size: 24rpx;
		opacity: 0.8;
		margin: 20rpx;
	}

	/* 证件信息区域 */
	.id-info {
		background-color: rgba(255, 255, 255, 0.15);
		border-radius: 20rpx;
		padding: 20rpx;
		width: 90%;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
	}

	.id-item {
		flex: 1;
	}

	.id-label {
		display: block;
		font-size: 24rpx;
		opacity: 0.8;
		margin-bottom: 8rpx;
		text-align: center;
	}

	.id-value {
		display: block;
		font-size: 26rpx;
		font-weight: 500;
		text-align: center;
	}

	.id-line {
		width: 3rpx;
		height: 80rpx;
		opacity: 0.6;
		background: #fff;
	}

	/* 处方记录列表 */
	.prescription-list {
		padding: 0 30rpx;
		height: calc(100vh - 520rpx)
	}

	.prescription-item {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
	}

	.prescription-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.prescription-type {
		font-size: 28rpx;
		font-weight: 500;
		color: #333;
	}

	.prescription-status {
		font-size: 24rpx;
		padding: 4rpx 16rpx;
		border-radius: 16rpx;
    white-space: nowrap;
	}

	.status-received {
		background-color: #e6f7ff;
		color: #1890ff;
	}

	.prescription-body {
		border-top: 1rpx solid #f0f0f0;
		padding-top: 20rpx;
	}

	.prescription-info {
		display: flex;
		margin-bottom: 10rpx;
	}

	.info-label {
		width: 120rpx;
		font-size: 26rpx;
		color: #333;
	}

	.info-value {
		flex: 1;
		font-size: 26rpx;
		color: #666;
	}

	.loading-status,
	.no-more {
		text-align: center;
		font-size: 22rpx;
		color: #333;
	}
</style>
