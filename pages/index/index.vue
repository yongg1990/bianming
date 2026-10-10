<template>
	<view class="container">
    <view v-if="homeFlg">
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
				prescriptions: []
			};
		},
		onLoad(option) {
      configModuleFun('get',{
        "moduleName" : "处方流转",
        "configGroup" : "患者端",
        "configName" :"版本"
      }).then(res=>{
        this.ldFLg = res.data === '兰大'
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
		methods: {
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
				cfListFun('list', {
					"zjhm":  v || this.info.idCard,
					"pageSize": this.pageSize,
					"pageNum": this.page
				}).then(resP => {
          const res = {
            "code": 0,
            "msg": "成功",
            "data": {
              "records": [
                {
                  "prescriptionInfo": {
                    "recordId": "2106545783187853312",
                    "id": 0,
                    "createTime": "2026-10-04T00:43:47.000+00:00",
                    "updateTime": "2026-10-08T09:54:11.000+00:00",
                    "jgid": "QA20261004AH1",
                    "mzzybz": "1",
                    "fph": null,
                    "qyh": null,
                    "yncfbh": "QA20261004A-SC-recall-SUP3",
                    "bq": null,
                    "cwh": null,
                    "hznn": "30",
                    "ksmc": "中医科",
                    "ksbm": null,
                    "sfrs": null,
                    "fyfsyf": "1",
                    "jyffqt": null,
                    "fyfslx": "2",
                    "cfrq": 20261004,
                    "jfrq": "20261004/000000",
                    "cfscrq": "20261004",
                    "cfts": 7,
                    "zje": 7,
                    "sffb": null,
                    "shsjd": null,
                    "wlbz": null,
                    "sfjj": null,
                    "ypcdm": "QA20261004AF1",
                    "sfbz": null,
                    "cfzl": null,
                    "ztbm": "0",
                    "ztmc": "待处理",
                    "jyhx": null,
                    "hzid": "2106545782793588736",
                    "ysid": "2106420420256354304",
                    "shrid": "6faaa995-bbea-466c-af34-c3651e33e58c",
                    "ylklx": "0",
                    "ylkh": "QA20261004ACARDSC-recall",
                    "cfdmbj": 0,
                    "zyzzzdbmlx": null,
                    "zyzzzdbm": null,
                    "zyzzzdnr": null,
                    "zyzizdbmlx": null,
                    "zyzizdbm": null,
                    "zyzizdnr": null,
                    "xyzdzdbmlx": null,
                    "xyzdzdbm": null,
                    "xyzdzdnr": null,
                    "jyff": "2",
                    "cfsj": "00:00:00",
                    "yljgdm": "QA20261004AH1",
                    "cfrqTime": "2026-10-03T16:00:00.000+00:00",
                    "hzxm": "测*l",
                    "isDelete": 0,
                    "xzzt": null,
                    "djrq": null,
                    "fsycsj": null,
                    "jls": 1,
                    "encrypted": null,
                    "hzxb": "1",
                    "status": 3,
                    "sendStatus": 0,
                    "sendTime": null,
                    "downloadTime": null,
                    "withdrawStatus": 0,
                    "refuseWithdrawTime": null,
                    "suspendStatus": null,
                    "yq": null,
                    "fysj": null,
                    "sjyq": null,
                    "zylx": null,
                    "pc": null,
                    "fyms": null,
                    "syrq": null,
                    "bz1": null,
                    "bz2": null,
                    "bz3": null,
                    "bz4": null,
                    "bz5": null,
                    "fyl": null,
                    "mrjl": null,
                    "bzl": null,
                    "sfTime": null,
                    "djTime": null,
                    "psTime": null,
                    "isException": null,
                    "lastStatusUpdateTime": null,
                    "lastLogisticUpdateTime": null,
                    "zjhm": "QA-ID-********SUP3",
                    "hzcsrq": "+0000-12-31T16:00:00.000+00:00",
                    "yljgmc": "测试医院1",
                    "ypcmc": "测试代煎企业1",
                    "sfsj": null,
                    "sfjg": null,
                    "sfysgh": null,
                    "sfysxm": null,
                    "splitSendStatus": 2,
                    "splitPrescription": true,
                    "hasWithdrawHistory": false,
                    "lastWithdrawTime": null,
                    "zx": null,
                    "statusName": "已确认",
                    "transHash": "82cc0afe582cde4e817c87a2ce0dd525f1827566842fd9b100ab6fa3454f7946",
                    "transTime": "2026-10-04T00:43:47.000+00:00",
                    "splitSendStatusName": "拆分部分已发送"
                  },
                  "detailInfoList": [
                    {
                      "recordId": "2106545783452094464",
                      "id": null,
                      "createTime": "2026-10-04T00:43:47.000+00:00",
                      "updateTime": "2026-10-04T00:43:47.000+00:00",
                      "sxh": "1",
                      "ypybdm": "QA20261004ADRUG1",
                      "ypmc": "黄芪",
                      "pch": null,
                      "cd": null,
                      "scsj": null,
                      "yycgsj": null,
                      "ypsybm": null,
                      "ypgg": "10g",
                      "ypdw": "1",
                      "ypdj": 1,
                      "ypjs": null,
                      "jl": 1,
                      "zl": 7,
                      "yynbypmc": "黄芪",
                      "yynbypbm": "QA20261004ADRUG1",
                      "dxzj": "7",
                      "tsjf": "无",
                      "ypsffb": null,
                      "qytbdm": null,
                      "dtsl": 1,
                      "jyhx": null,
                      "yncfbh": "QA20261004A-SC-recall-SUP3",
                      "cfts": null,
                      "mainRecordId": "2106545783187853312",
                      "dmbj": 0,
                      "cfrq": 20261004,
                      "yljgdm": "QA20261004AH1",
                      "isDelete": 0,
                      "rkdh": null,
                      "ypfph": null,
                      "zsm": null,
                      "qynbzsm": null,
                      "cpph": null,
                      "sccj": null,
                      "gysdw": null,
                      "yxsj": null,
                      "rksj": null,
                      "ckdh": null,
                      "ckyf": null,
                      "cksj": null,
                      "ckcpph": null,
                      "withdrawStatus": null
                    }
                  ],
                  "patientInfo": {
                    "recordId": "2106545782793588736",
                    "zjlx": "1",
                    "zjhm": "QA-ID-********SUP3",
                    "hzxm": "测*l",
                    "hzxb": "1",
                    "hzcsrq": "+0000-12-31T16:00:00.000+00:00",
                    "id": 0,
                    "createTime": "2026-10-04T00:43:47.000+00:00",
                    "updateTime": "2026-10-04T00:43:47.000+00:00",
                    "zhjzjgdm": "QA20261004AH1",
                    "zhjzshrsjh": "13900000002",
                    "zhjzshrdzxxdz": "模拟患者地址SC-recall",
                    "zhjzshrxm": "测试收货人",
                    "encrypted": null,
                    "hzid": null
                  },
                  "doctorInfo": {
                    "recordId": "2106420420256354304",
                    "jgid": "QA20261004AH1",
                    "ysxm": "测试医生",
                    "ysgh": "QA20261004ADOC",
                    "lxdh": "13900000000",
                    "email": null,
                    "id": 0,
                    "createTime": "2026-10-03T16:25:38.000+00:00",
                    "updateTime": "2026-10-03T16:25:38.000+00:00",
                    "ysca": null,
                    "encrypted": null
                  },
                  "consigneeInfo": {
                    "recordId": "6faaa995-bbea-466c-af34-c3651e33e58c",
                    "shrxm": "测试收货人",
                    "shrdzxxdz": "模拟患者地址SC-recall",
                    "shrsjh": "13900000002",
                    "shrgh": null,
                    "psfs": null,
                    "wlgs": null,
                    "qjsj": null,
                    "bz": null,
                    "id": null,
                    "createTime": "2026-10-04T00:43:48.000+00:00",
                    "updateTime": "2026-10-04T00:43:48.000+00:00",
                    "hzid": "2106545782793588736",
                    "shrdzsheng": "上海市",
                    "shrdzshi": "上海市",
                    "shrdzxian": "浦东新区",
                    "encrypted": null,
                    "isDefault": 1
                  },
                  "statusList": [],
                  "flowList": null,
                  "logisticInfo": null,
                  "logisticDetailList": null,
                  "institutionInfo": {
                    "recordId": "QA20261004AH1",
                    "jgdm": "QA20261004AH1",
                    "jgmc": "测试医院1",
                    "jgjc": null,
                    "jglx": 1,
                    "szq": "浦东新区",
                    "szs": "上海市",
                    "szp": "上海市",
                    "szpCode": null,
                    "szsCode": null,
                    "szqCode": null,
                    "szjCode": null,
                    "szj": null,
                    "xxdz": "模拟医院地址",
                    "lxr": "模拟医院联系人",
                    "lxdh": "13900000001",
                    "mrshdzlx": 2,
                    "mac": null,
                    "jgzh": null,
                    "jgmm": null,
                    "id": null,
                    "createTime": "2026-10-03T16:10:35.000+00:00",
                    "updateTime": "2026-10-03T16:10:35.000+00:00",
                    "startUploadTime": null,
                    "mqQueueName": null,
                    "lastHeartbeatTime": "2026-10-03T16:10:35.000+00:00",
                    "tzmode": null,
                    "gtqd": null,
                    "used": null
                  },
                  "operationLogList": null,
                  "exceptionInfo": null,
                  "hasLogisticOrder": false,
                  "logisticsType": null,
                  "logisticsTypeName": null,
                  "logisticsStatus": null,
                  "logisticsStatusName": null,
                  "lockerDisplay": null,
                  "splitPrescription": true,
                  "originalDoseCount": null,
                  "allocatedDoseCount": null,
                  "remainingDoseCount": null,
                  "executionList": null,
                  "prescriptionFile": null
                },
                {
                  "prescriptionInfo": {
                    "recordId": "2106545675142582272",
                    "id": 0,
                    "createTime": "2026-10-04T00:43:21.000+00:00",
                    "updateTime": "2026-10-04T07:14:53.000+00:00",
                    "jgid": "QA20261004AH1",
                    "mzzybz": "1",
                    "fph": null,
                    "qyh": null,
                    "yncfbh": "QA20261004A-SC-save-SUP3",
                    "bq": null,
                    "cwh": null,
                    "hznn": "30",
                    "ksmc": "中医科",
                    "ksbm": null,
                    "sfrs": null,
                    "fyfsyf": "1",
                    "jyffqt": null,
                    "fyfslx": "2",
                    "cfrq": 20261004,
                    "jfrq": "20261004/000000",
                    "cfscrq": "20261004",
                    "cfts": 7,
                    "zje": 7,
                    "sffb": null,
                    "shsjd": null,
                    "wlbz": null,
                    "sfjj": null,
                    "ypcdm": "QA20261004AF1",
                    "sfbz": null,
                    "cfzl": null,
                    "ztbm": "0",
                    "ztmc": "待处理",
                    "jyhx": null,
                    "hzid": "2106545674626682880",
                    "ysid": "2106420420256354304",
                    "shrid": "ff14f103-fd24-457e-bfcd-5df73b901550",
                    "ylklx": "0",
                    "ylkh": "QA20261004ACARDSC-save",
                    "cfdmbj": 0,
                    "zyzzzdbmlx": null,
                    "zyzzzdbm": null,
                    "zyzzzdnr": null,
                    "zyzizdbmlx": null,
                    "zyzizdbm": null,
                    "zyzizdnr": null,
                    "xyzdzdbmlx": null,
                    "xyzdzdbm": null,
                    "xyzdzdnr": null,
                    "jyff": "2",
                    "cfsj": "00:00:00",
                    "yljgdm": "QA20261004AH1",
                    "cfrqTime": "2026-10-03T16:00:00.000+00:00",
                    "hzxm": "测*e",
                    "isDelete": 0,
                    "xzzt": null,
                    "djrq": null,
                    "fsycsj": null,
                    "jls": 1,
                    "encrypted": null,
                    "hzxb": "1",
                    "status": 3,
                    "sendStatus": 0,
                    "sendTime": null,
                    "downloadTime": null,
                    "withdrawStatus": null,
                    "refuseWithdrawTime": null,
                    "suspendStatus": null,
                    "yq": null,
                    "fysj": null,
                    "sjyq": null,
                    "zylx": null,
                    "pc": null,
                    "fyms": null,
                    "syrq": null,
                    "bz1": null,
                    "bz2": null,
                    "bz3": null,
                    "bz4": null,
                    "bz5": null,
                    "fyl": null,
                    "mrjl": null,
                    "bzl": null,
                    "sfTime": null,
                    "djTime": null,
                    "psTime": null,
                    "isException": null,
                    "lastStatusUpdateTime": null,
                    "lastLogisticUpdateTime": null,
                    "zjhm": "QA-ID-********SUP3",
                    "hzcsrq": "+0000-12-31T16:00:00.000+00:00",
                    "yljgmc": "测试医院1",
                    "ypcmc": "测试代煎企业1",
                    "sfsj": null,
                    "sfjg": null,
                    "sfysgh": null,
                    "sfysxm": null,
                    "splitSendStatus": 0,
                    "splitPrescription": true,
                    "hasWithdrawHistory": false,
                    "lastWithdrawTime": null,
                    "zx": null,
                    "statusName": "已确认",
                    "transHash": "6b481a5c931c4ecdf98589ea78cbe54f6f76b389ae02fe57f0b935f26c5fa969",
                    "transTime": "2026-10-04T00:43:21.000+00:00",
                    "splitSendStatusName": "拆分未发送"
                  },
                  "detailInfoList": [
                    {
                      "recordId": "2106545675402629120",
                      "id": null,
                      "createTime": "2026-10-04T00:43:21.000+00:00",
                      "updateTime": "2026-10-04T00:43:21.000+00:00",
                      "sxh": "1",
                      "ypybdm": "QA20261004ADRUG1",
                      "ypmc": "黄芪",
                      "pch": null,
                      "cd": null,
                      "scsj": null,
                      "yycgsj": null,
                      "ypsybm": null,
                      "ypgg": "10g",
                      "ypdw": "1",
                      "ypdj": 1,
                      "ypjs": null,
                      "jl": 1,
                      "zl": 7,
                      "yynbypmc": "黄芪",
                      "yynbypbm": "QA20261004ADRUG1",
                      "dxzj": "7",
                      "tsjf": "无",
                      "ypsffb": null,
                      "qytbdm": null,
                      "dtsl": 1,
                      "jyhx": null,
                      "yncfbh": "QA20261004A-SC-save-SUP3",
                      "cfts": null,
                      "mainRecordId": "2106545675142582272",
                      "dmbj": 0,
                      "cfrq": 20261004,
                      "yljgdm": "QA20261004AH1",
                      "isDelete": 0,
                      "rkdh": null,
                      "ypfph": null,
                      "zsm": null,
                      "qynbzsm": null,
                      "cpph": null,
                      "sccj": null,
                      "gysdw": null,
                      "yxsj": null,
                      "rksj": null,
                      "ckdh": null,
                      "ckyf": null,
                      "cksj": null,
                      "ckcpph": null,
                      "withdrawStatus": null
                    }
                  ],
                  "patientInfo": {
                    "recordId": "2106545674626682880",
                    "zjlx": "1",
                    "zjhm": "QA-ID-********SUP3",
                    "hzxm": "测*e",
                    "hzxb": "1",
                    "hzcsrq": "+0000-12-31T16:00:00.000+00:00",
                    "id": 0,
                    "createTime": "2026-10-04T00:43:21.000+00:00",
                    "updateTime": "2026-10-04T00:43:21.000+00:00",
                    "zhjzjgdm": "QA20261004AH1",
                    "zhjzshrsjh": "13900000002",
                    "zhjzshrdzxxdz": "模拟患者地址SC-save",
                    "zhjzshrxm": "测试收货人",
                    "encrypted": null,
                    "hzid": null
                  },
                  "doctorInfo": {
                    "recordId": "2106420420256354304",
                    "jgid": "QA20261004AH1",
                    "ysxm": "测试医生",
                    "ysgh": "QA20261004ADOC",
                    "lxdh": "13900000000",
                    "email": null,
                    "id": 0,
                    "createTime": "2026-10-03T16:25:38.000+00:00",
                    "updateTime": "2026-10-03T16:25:38.000+00:00",
                    "ysca": null,
                    "encrypted": null
                  },
                  "consigneeInfo": {
                    "recordId": "ff14f103-fd24-457e-bfcd-5df73b901550",
                    "shrxm": "测试收货人",
                    "shrdzxxdz": "模拟患者地址SC-save",
                    "shrsjh": "13900000002",
                    "shrgh": null,
                    "psfs": null,
                    "wlgs": null,
                    "qjsj": null,
                    "bz": null,
                    "id": null,
                    "createTime": "2026-10-04T00:43:22.000+00:00",
                    "updateTime": "2026-10-04T00:43:22.000+00:00",
                    "hzid": "2106545674626682880",
                    "shrdzsheng": "上海市",
                    "shrdzshi": "上海市",
                    "shrdzxian": "浦东新区",
                    "encrypted": null,
                    "isDefault": 1
                  },
                  "statusList": [],
                  "flowList": null,
                  "logisticInfo": null,
                  "logisticDetailList": null,
                  "institutionInfo": {
                    "recordId": "QA20261004AH1",
                    "jgdm": "QA20261004AH1",
                    "jgmc": "测试医院1",
                    "jgjc": null,
                    "jglx": 1,
                    "szq": "浦东新区",
                    "szs": "上海市",
                    "szp": "上海市",
                    "szpCode": null,
                    "szsCode": null,
                    "szqCode": null,
                    "szjCode": null,
                    "szj": null,
                    "xxdz": "模拟医院地址",
                    "lxr": "模拟医院联系人",
                    "lxdh": "13900000001",
                    "mrshdzlx": 2,
                    "mac": null,
                    "jgzh": null,
                    "jgmm": null,
                    "id": null,
                    "createTime": "2026-10-03T16:10:35.000+00:00",
                    "updateTime": "2026-10-03T16:10:35.000+00:00",
                    "startUploadTime": null,
                    "mqQueueName": null,
                    "lastHeartbeatTime": "2026-10-03T16:10:35.000+00:00",
                    "tzmode": null,
                    "gtqd": null,
                    "used": null
                  },
                  "operationLogList": null,
                  "exceptionInfo": null,
                  "hasLogisticOrder": false,
                  "logisticsType": null,
                  "logisticsTypeName": null,
                  "logisticsStatus": null,
                  "logisticsStatusName": null,
                  "lockerDisplay": null,
                  "splitPrescription": true,
                  "originalDoseCount": null,
                  "allocatedDoseCount": null,
                  "remainingDoseCount": null,
                  "executionList": null,
                  "prescriptionFile": null
                },
                {
                  "prescriptionInfo": {
                    "recordId": "2106431688031752192",
                    "id": 0,
                    "createTime": "2026-10-03T17:10:25.000+00:00",
                    "updateTime": "2026-10-04T07:14:53.000+00:00",
                    "jgid": "QA20261004AH1",
                    "mzzybz": "1",
                    "fph": null,
                    "qyh": null,
                    "yncfbh": "QA20261004A-ST-RECALL-SUP2",
                    "bq": null,
                    "cwh": null,
                    "hznn": "30",
                    "ksmc": "中医科",
                    "ksbm": null,
                    "sfrs": null,
                    "fyfsyf": "1",
                    "jyffqt": null,
                    "fyfslx": "2",
                    "cfrq": 20261004,
                    "jfrq": "20261004/000000",
                    "cfscrq": "20261004",
                    "cfts": 7,
                    "zje": 7,
                    "sffb": null,
                    "shsjd": null,
                    "wlbz": null,
                    "sfjj": null,
                    "ypcdm": "QA20261004AF1",
                    "sfbz": null,
                    "cfzl": null,
                    "ztbm": "0",
                    "ztmc": "待处理",
                    "jyhx": null,
                    "hzid": "2106431687645876224",
                    "ysid": "2106420420256354304",
                    "shrid": "cb7e3798-4ed7-4741-b283-6a6dde6f842d",
                    "ylklx": "0",
                    "ylkh": "QA20261004ACARDST-RECALL",
                    "cfdmbj": 0,
                    "zyzzzdbmlx": null,
                    "zyzzzdbm": null,
                    "zyzzzdnr": null,
                    "zyzizdbmlx": null,
                    "zyzizdbm": null,
                    "zyzizdnr": null,
                    "xyzdzdbmlx": null,
                    "xyzdzdbm": null,
                    "xyzdzdnr": null,
                    "jyff": "2",
                    "cfsj": "00:00:00",
                    "yljgdm": "QA20261004AH1",
                    "cfrqTime": "2026-10-03T16:00:00.000+00:00",
                    "hzxm": "测*L",
                    "isDelete": 0,
                    "xzzt": null,
                    "djrq": null,
                    "fsycsj": null,
                    "jls": 1,
                    "encrypted": null,
                    "hzxb": "1",
                    "status": 3,
                    "sendStatus": 0,
                    "sendTime": null,
                    "downloadTime": null,
                    "withdrawStatus": 0,
                    "refuseWithdrawTime": null,
                    "suspendStatus": null,
                    "yq": null,
                    "fysj": null,
                    "sjyq": null,
                    "zylx": null,
                    "pc": null,
                    "fyms": null,
                    "syrq": null,
                    "bz1": null,
                    "bz2": null,
                    "bz3": null,
                    "bz4": null,
                    "bz5": null,
                    "fyl": null,
                    "mrjl": null,
                    "bzl": null,
                    "sfTime": null,
                    "djTime": null,
                    "psTime": null,
                    "isException": null,
                    "lastStatusUpdateTime": null,
                    "lastLogisticUpdateTime": null,
                    "zjhm": "QA-ID-********SUP2",
                    "hzcsrq": "+0000-12-31T16:00:00.000+00:00",
                    "yljgmc": "测试医院1",
                    "ypcmc": "测试代煎企业1",
                    "sfsj": null,
                    "sfjg": null,
                    "sfysgh": null,
                    "sfysxm": null,
                    "splitSendStatus": 0,
                    "splitPrescription": true,
                    "hasWithdrawHistory": false,
                    "lastWithdrawTime": null,
                    "zx": null,
                    "statusName": "已确认",
                    "transHash": "be741801645bb851da943d71a9d67c9264482f8c60aaea47d683deb148094bd0",
                    "transTime": "2026-10-03T17:10:25.000+00:00",
                    "splitSendStatusName": "拆分未发送"
                  },
                  "detailInfoList": [
                    {
                      "recordId": "2106431688287604736",
                      "id": null,
                      "createTime": "2026-10-03T17:10:24.000+00:00",
                      "updateTime": "2026-10-03T17:10:24.000+00:00",
                      "sxh": "1",
                      "ypybdm": "QA20261004ADRUG1",
                      "ypmc": "黄芪",
                      "pch": null,
                      "cd": null,
                      "scsj": null,
                      "yycgsj": null,
                      "ypsybm": null,
                      "ypgg": "10g",
                      "ypdw": "1",
                      "ypdj": 1,
                      "ypjs": null,
                      "jl": 1,
                      "zl": 7,
                      "yynbypmc": "黄芪",
                      "yynbypbm": "QA20261004ADRUG1",
                      "dxzj": "7",
                      "tsjf": "无",
                      "ypsffb": null,
                      "qytbdm": null,
                      "dtsl": 1,
                      "jyhx": null,
                      "yncfbh": "QA20261004A-ST-RECALL-SUP2",
                      "cfts": null,
                      "mainRecordId": "2106431688031752192",
                      "dmbj": 0,
                      "cfrq": 20261004,
                      "yljgdm": "QA20261004AH1",
                      "isDelete": 0,
                      "rkdh": null,
                      "ypfph": null,
                      "zsm": null,
                      "qynbzsm": null,
                      "cpph": null,
                      "sccj": null,
                      "gysdw": null,
                      "yxsj": null,
                      "rksj": null,
                      "ckdh": null,
                      "ckyf": null,
                      "cksj": null,
                      "ckcpph": null,
                      "withdrawStatus": null
                    }
                  ],
                  "patientInfo": {
                    "recordId": "2106431687645876224",
                    "zjlx": "1",
                    "zjhm": "QA-ID-********SUP2",
                    "hzxm": "测*L",
                    "hzxb": "1",
                    "hzcsrq": "+0000-12-31T16:00:00.000+00:00",
                    "id": 0,
                    "createTime": "2026-10-03T17:10:25.000+00:00",
                    "updateTime": "2026-10-03T17:10:25.000+00:00",
                    "zhjzjgdm": "QA20261004AH1",
                    "zhjzshrsjh": "13900000002",
                    "zhjzshrdzxxdz": "模拟患者地址ST-RECALL",
                    "zhjzshrxm": "测试收货人",
                    "encrypted": null,
                    "hzid": null
                  },
                  "doctorInfo": {
                    "recordId": "2106420420256354304",
                    "jgid": "QA20261004AH1",
                    "ysxm": "测试医生",
                    "ysgh": "QA20261004ADOC",
                    "lxdh": "13900000000",
                    "email": null,
                    "id": 0,
                    "createTime": "2026-10-03T16:25:38.000+00:00",
                    "updateTime": "2026-10-03T16:25:38.000+00:00",
                    "ysca": null,
                    "encrypted": null
                  },
                  "consigneeInfo": {
                    "recordId": "cb7e3798-4ed7-4741-b283-6a6dde6f842d",
                    "shrxm": "测试收货人",
                    "shrdzxxdz": "模拟患者地址ST-RECALL",
                    "shrsjh": "13900000002",
                    "shrgh": null,
                    "psfs": null,
                    "wlgs": null,
                    "qjsj": null,
                    "bz": null,
                    "id": null,
                    "createTime": "2026-10-03T17:10:25.000+00:00",
                    "updateTime": "2026-10-03T17:10:25.000+00:00",
                    "hzid": "2106431687645876224",
                    "shrdzsheng": "上海市",
                    "shrdzshi": "上海市",
                    "shrdzxian": "浦东新区",
                    "encrypted": null,
                    "isDefault": 1
                  },
                  "statusList": [],
                  "flowList": null,
                  "logisticInfo": null,
                  "logisticDetailList": null,
                  "institutionInfo": {
                    "recordId": "QA20261004AH1",
                    "jgdm": "QA20261004AH1",
                    "jgmc": "测试医院1",
                    "jgjc": null,
                    "jglx": 1,
                    "szq": "浦东新区",
                    "szs": "上海市",
                    "szp": "上海市",
                    "szpCode": null,
                    "szsCode": null,
                    "szqCode": null,
                    "szjCode": null,
                    "szj": null,
                    "xxdz": "模拟医院地址",
                    "lxr": "模拟医院联系人",
                    "lxdh": "13900000001",
                    "mrshdzlx": 2,
                    "mac": null,
                    "jgzh": null,
                    "jgmm": null,
                    "id": null,
                    "createTime": "2026-10-03T16:10:35.000+00:00",
                    "updateTime": "2026-10-03T16:10:35.000+00:00",
                    "startUploadTime": null,
                    "mqQueueName": null,
                    "lastHeartbeatTime": "2026-10-03T16:10:35.000+00:00",
                    "tzmode": null,
                    "gtqd": null,
                    "used": null
                  },
                  "operationLogList": null,
                  "exceptionInfo": null,
                  "hasLogisticOrder": false,
                  "logisticsType": null,
                  "logisticsTypeName": null,
                  "logisticsStatus": null,
                  "logisticsStatusName": null,
                  "lockerDisplay": null,
                  "splitPrescription": true,
                  "originalDoseCount": null,
                  "allocatedDoseCount": null,
                  "remainingDoseCount": null,
                  "executionList": null,
                  "prescriptionFile": null
                },
                {
                  "prescriptionInfo": {
                    "recordId": "2106430548267388928",
                    "id": 0,
                    "createTime": "2026-10-03T17:05:53.000+00:00",
                    "updateTime": "2026-10-04T07:14:53.000+00:00",
                    "jgid": "QA20261004AH1",
                    "mzzybz": "1",
                    "fph": null,
                    "qyh": null,
                    "yncfbh": "QA20261004A-STATE-RECALLED-STATUS-SUP",
                    "bq": null,
                    "cwh": null,
                    "hznn": "30",
                    "ksmc": "中医科",
                    "ksbm": null,
                    "sfrs": null,
                    "fyfsyf": "1",
                    "jyffqt": null,
                    "fyfslx": "2",
                    "cfrq": 20261004,
                    "jfrq": "20261004/000000",
                    "cfscrq": "20261004",
                    "cfts": 7,
                    "zje": 7,
                    "sffb": null,
                    "shsjd": null,
                    "wlbz": null,
                    "sfjj": null,
                    "ypcdm": "QA20261004AF1",
                    "sfbz": null,
                    "cfzl": null,
                    "ztbm": "0",
                    "ztmc": "待处理",
                    "jyhx": null,
                    "hzid": "2106430547873124352",
                    "ysid": "2106420420256354304",
                    "shrid": "2ee62ccf-d1f9-4806-bf19-7a03e7385462",
                    "ylklx": "0",
                    "ylkh": "QA20261004ACARDSTATE-RECALLED-STATUS",
                    "cfdmbj": 0,
                    "zyzzzdbmlx": null,
                    "zyzzzdbm": null,
                    "zyzzzdnr": null,
                    "zyzizdbmlx": null,
                    "zyzizdbm": null,
                    "zyzizdnr": null,
                    "xyzdzdbmlx": null,
                    "xyzdzdbm": null,
                    "xyzdzdnr": null,
                    "jyff": "2",
                    "cfsj": "00:00:00",
                    "yljgdm": "QA20261004AH1",
                    "cfrqTime": "2026-10-03T16:00:00.000+00:00",
                    "hzxm": "测*S",
                    "isDelete": 0,
                    "xzzt": null,
                    "djrq": null,
                    "fsycsj": null,
                    "jls": 1,
                    "encrypted": null,
                    "hzxb": "1",
                    "status": 3,
                    "sendStatus": 0,
                    "sendTime": null,
                    "downloadTime": null,
                    "withdrawStatus": 0,
                    "refuseWithdrawTime": null,
                    "suspendStatus": null,
                    "yq": null,
                    "fysj": null,
                    "sjyq": null,
                    "zylx": null,
                    "pc": null,
                    "fyms": null,
                    "syrq": null,
                    "bz1": null,
                    "bz2": null,
                    "bz3": null,
                    "bz4": null,
                    "bz5": null,
                    "fyl": null,
                    "mrjl": null,
                    "bzl": null,
                    "sfTime": null,
                    "djTime": null,
                    "psTime": null,
                    "isException": null,
                    "lastStatusUpdateTime": null,
                    "lastLogisticUpdateTime": null,
                    "zjhm": "QA-ID-********-SUP",
                    "hzcsrq": "+0000-12-31T16:00:00.000+00:00",
                    "yljgmc": "测试医院1",
                    "ypcmc": "测试代煎企业1",
                    "sfsj": null,
                    "sfjg": null,
                    "sfysgh": null,
                    "sfysxm": null,
                    "splitSendStatus": 2,
                    "splitPrescription": true,
                    "hasWithdrawHistory": false,
                    "lastWithdrawTime": null,
                    "zx": null,
                    "statusName": "已确认",
                    "transHash": "87af3813e375c673c0b7c6b4b3b9a261629768a2afb8a97a96b677ea842a24a4",
                    "transTime": "2026-10-03T17:05:53.000+00:00",
                    "splitSendStatusName": "拆分部分已发送"
                  },
                  "detailInfoList": [
                    {
                      "recordId": "2106430548527435776",
                      "id": null,
                      "createTime": "2026-10-03T17:05:53.000+00:00",
                      "updateTime": "2026-10-03T17:05:53.000+00:00",
                      "sxh": "1",
                      "ypybdm": "QA20261004ADRUG1",
                      "ypmc": "黄芪",
                      "pch": null,
                      "cd": null,
                      "scsj": null,
                      "yycgsj": null,
                      "ypsybm": null,
                      "ypgg": "10g",
                      "ypdw": "1",
                      "ypdj": 1,
                      "ypjs": null,
                      "jl": 1,
                      "zl": 7,
                      "yynbypmc": "黄芪",
                      "yynbypbm": "QA20261004ADRUG1",
                      "dxzj": "7",
                      "tsjf": "无",
                      "ypsffb": null,
                      "qytbdm": null,
                      "dtsl": 1,
                      "jyhx": null,
                      "yncfbh": "QA20261004A-STATE-RECALLED-STATUS-SUP",
                      "cfts": null,
                      "mainRecordId": "2106430548267388928",
                      "dmbj": 0,
                      "cfrq": 20261004,
                      "yljgdm": "QA20261004AH1",
                      "isDelete": 0,
                      "rkdh": null,
                      "ypfph": null,
                      "zsm": null,
                      "qynbzsm": null,
                      "cpph": null,
                      "sccj": null,
                      "gysdw": null,
                      "yxsj": null,
                      "rksj": null,
                      "ckdh": null,
                      "ckyf": null,
                      "cksj": null,
                      "ckcpph": null,
                      "withdrawStatus": null
                    }
                  ],
                  "patientInfo": {
                    "recordId": "2106430547873124352",
                    "zjlx": "1",
                    "zjhm": "QA-ID-********-SUP",
                    "hzxm": "测*S",
                    "hzxb": "1",
                    "hzcsrq": "+0000-12-31T16:00:00.000+00:00",
                    "id": 0,
                    "createTime": "2026-10-03T17:05:53.000+00:00",
                    "updateTime": "2026-10-03T17:05:53.000+00:00",
                    "zhjzjgdm": "QA20261004AH1",
                    "zhjzshrsjh": "13900000002",
                    "zhjzshrdzxxdz": "模拟患者地址STATE-RECALLED-STATUS",
                    "zhjzshrxm": "测试收货人",
                    "encrypted": null,
                    "hzid": null
                  },
                  "doctorInfo": {
                    "recordId": "2106420420256354304",
                    "jgid": "QA20261004AH1",
                    "ysxm": "测试医生",
                    "ysgh": "QA20261004ADOC",
                    "lxdh": "13900000000",
                    "email": null,
                    "id": 0,
                    "createTime": "2026-10-03T16:25:38.000+00:00",
                    "updateTime": "2026-10-03T16:25:38.000+00:00",
                    "ysca": null,
                    "encrypted": null
                  },
                  "consigneeInfo": {
                    "recordId": "2ee62ccf-d1f9-4806-bf19-7a03e7385462",
                    "shrxm": "测试收货人",
                    "shrdzxxdz": "模拟患者地址STATE-RECALLED-STATUS",
                    "shrsjh": "13900000002",
                    "shrgh": null,
                    "psfs": null,
                    "wlgs": null,
                    "qjsj": null,
                    "bz": null,
                    "id": null,
                    "createTime": "2026-10-03T17:05:54.000+00:00",
                    "updateTime": "2026-10-03T17:05:54.000+00:00",
                    "hzid": "2106430547873124352",
                    "shrdzsheng": "上海市",
                    "shrdzshi": "上海市",
                    "shrdzxian": "浦东新区",
                    "encrypted": null,
                    "isDefault": 1
                  },
                  "statusList": [],
                  "flowList": null,
                  "logisticInfo": null,
                  "logisticDetailList": null,
                  "institutionInfo": {
                    "recordId": "QA20261004AH1",
                    "jgdm": "QA20261004AH1",
                    "jgmc": "测试医院1",
                    "jgjc": null,
                    "jglx": 1,
                    "szq": "浦东新区",
                    "szs": "上海市",
                    "szp": "上海市",
                    "szpCode": null,
                    "szsCode": null,
                    "szqCode": null,
                    "szjCode": null,
                    "szj": null,
                    "xxdz": "模拟医院地址",
                    "lxr": "模拟医院联系人",
                    "lxdh": "13900000001",
                    "mrshdzlx": 2,
                    "mac": null,
                    "jgzh": null,
                    "jgmm": null,
                    "id": null,
                    "createTime": "2026-10-03T16:10:35.000+00:00",
                    "updateTime": "2026-10-03T16:10:35.000+00:00",
                    "startUploadTime": null,
                    "mqQueueName": null,
                    "lastHeartbeatTime": "2026-10-03T16:10:35.000+00:00",
                    "tzmode": null,
                    "gtqd": null,
                    "used": null
                  },
                  "operationLogList": null,
                  "exceptionInfo": null,
                  "hasLogisticOrder": false,
                  "logisticsType": null,
                  "logisticsTypeName": null,
                  "logisticsStatus": null,
                  "logisticsStatusName": null,
                  "lockerDisplay": null,
                  "splitPrescription": true,
                  "originalDoseCount": null,
                  "allocatedDoseCount": null,
                  "remainingDoseCount": null,
                  "executionList": null,
                  "prescriptionFile": null
                },
                {
                  "prescriptionInfo": {
                    "recordId": "2106430380218404864",
                    "id": 0,
                    "createTime": "2026-10-03T17:05:13.000+00:00",
                    "updateTime": "2026-10-04T07:14:53.000+00:00",
                    "jgid": "QA20261004AH1",
                    "mzzybz": "1",
                    "fph": null,
                    "qyh": null,
                    "yncfbh": "QA20261004A-IDEMP-split-SUP",
                    "bq": null,
                    "cwh": null,
                    "hznn": "30",
                    "ksmc": "中医科",
                    "ksbm": null,
                    "sfrs": null,
                    "fyfsyf": "1",
                    "jyffqt": null,
                    "fyfslx": "2",
                    "cfrq": 20261004,
                    "jfrq": "20261004/000000",
                    "cfscrq": "20261004",
                    "cfts": 7,
                    "zje": 7,
                    "sffb": null,
                    "shsjd": null,
                    "wlbz": null,
                    "sfjj": null,
                    "ypcdm": "QA20261004AF1",
                    "sfbz": null,
                    "cfzl": null,
                    "ztbm": "0",
                    "ztmc": "待处理",
                    "jyhx": null,
                    "hzid": "2106430379832528896",
                    "ysid": "2106420420256354304",
                    "shrid": "4a274947-4ddc-4dfb-917a-4bc8e9ff529a",
                    "ylklx": "0",
                    "ylkh": "QA20261004ACARDIDEMP-split",
                    "cfdmbj": 0,
                    "zyzzzdbmlx": null,
                    "zyzzzdbm": null,
                    "zyzzzdnr": null,
                    "zyzizdbmlx": null,
                    "zyzizdbm": null,
                    "zyzizdnr": null,
                    "xyzdzdbmlx": null,
                    "xyzdzdbm": null,
                    "xyzdzdnr": null,
                    "jyff": "2",
                    "cfsj": "00:00:00",
                    "yljgdm": "QA20261004AH1",
                    "cfrqTime": "2026-10-03T16:00:00.000+00:00",
                    "hzxm": "测*t",
                    "isDelete": 0,
                    "xzzt": null,
                    "djrq": null,
                    "fsycsj": null,
                    "jls": 1,
                    "encrypted": null,
                    "hzxb": "1",
                    "status": 3,
                    "sendStatus": 0,
                    "sendTime": null,
                    "downloadTime": null,
                    "withdrawStatus": null,
                    "refuseWithdrawTime": null,
                    "suspendStatus": null,
                    "yq": null,
                    "fysj": null,
                    "sjyq": null,
                    "zylx": null,
                    "pc": null,
                    "fyms": null,
                    "syrq": null,
                    "bz1": null,
                    "bz2": null,
                    "bz3": null,
                    "bz4": null,
                    "bz5": null,
                    "fyl": null,
                    "mrjl": null,
                    "bzl": null,
                    "sfTime": null,
                    "djTime": null,
                    "psTime": null,
                    "isException": null,
                    "lastStatusUpdateTime": null,
                    "lastLogisticUpdateTime": null,
                    "zjhm": "QA-ID-********-SUP",
                    "hzcsrq": "+0000-12-31T16:00:00.000+00:00",
                    "yljgmc": "测试医院1",
                    "ypcmc": "测试代煎企业1",
                    "sfsj": null,
                    "sfjg": null,
                    "sfysgh": null,
                    "sfysxm": null,
                    "splitSendStatus": 0,
                    "splitPrescription": true,
                    "hasWithdrawHistory": false,
                    "lastWithdrawTime": null,
                    "zx": null,
                    "statusName": "已确认",
                    "transHash": "65bc692b6c2912dd277ac9f94841e3e07282785c4738ab84a846d4e6edd32eb5",
                    "transTime": "2026-10-03T17:05:13.000+00:00",
                    "splitSendStatusName": "拆分未发送"
                  },
                  "detailInfoList": [
                    {
                      "recordId": "2106430380470063104",
                      "id": null,
                      "createTime": "2026-10-03T17:05:13.000+00:00",
                      "updateTime": "2026-10-03T17:05:13.000+00:00",
                      "sxh": "1",
                      "ypybdm": "QA20261004ADRUG1",
                      "ypmc": "黄芪",
                      "pch": null,
                      "cd": null,
                      "scsj": null,
                      "yycgsj": null,
                      "ypsybm": null,
                      "ypgg": "10g",
                      "ypdw": "1",
                      "ypdj": 1,
                      "ypjs": null,
                      "jl": 1,
                      "zl": 7,
                      "yynbypmc": "黄芪",
                      "yynbypbm": "QA20261004ADRUG1",
                      "dxzj": "7",
                      "tsjf": "无",
                      "ypsffb": null,
                      "qytbdm": null,
                      "dtsl": 1,
                      "jyhx": null,
                      "yncfbh": "QA20261004A-IDEMP-split-SUP",
                      "cfts": null,
                      "mainRecordId": "2106430380218404864",
                      "dmbj": 0,
                      "cfrq": 20261004,
                      "yljgdm": "QA20261004AH1",
                      "isDelete": 0,
                      "rkdh": null,
                      "ypfph": null,
                      "zsm": null,
                      "qynbzsm": null,
                      "cpph": null,
                      "sccj": null,
                      "gysdw": null,
                      "yxsj": null,
                      "rksj": null,
                      "ckdh": null,
                      "ckyf": null,
                      "cksj": null,
                      "ckcpph": null,
                      "withdrawStatus": null
                    }
                  ],
                  "patientInfo": {
                    "recordId": "2106430379832528896",
                    "zjlx": "1",
                    "zjhm": "QA-ID-********-SUP",
                    "hzxm": "测*t",
                    "hzxb": "1",
                    "hzcsrq": "+0000-12-31T16:00:00.000+00:00",
                    "id": 0,
                    "createTime": "2026-10-03T17:05:13.000+00:00",
                    "updateTime": "2026-10-03T17:05:13.000+00:00",
                    "zhjzjgdm": "QA20261004AH1",
                    "zhjzshrsjh": "13900000002",
                    "zhjzshrdzxxdz": "模拟患者地址IDEMP-split",
                    "zhjzshrxm": "测试收货人",
                    "encrypted": null,
                    "hzid": null
                  },
                  "doctorInfo": {
                    "recordId": "2106420420256354304",
                    "jgid": "QA20261004AH1",
                    "ysxm": "测试医生",
                    "ysgh": "QA20261004ADOC",
                    "lxdh": "13900000000",
                    "email": null,
                    "id": 0,
                    "createTime": "2026-10-03T16:25:38.000+00:00",
                    "updateTime": "2026-10-03T16:25:38.000+00:00",
                    "ysca": null,
                    "encrypted": null
                  },
                  "consigneeInfo": {
                    "recordId": "4a274947-4ddc-4dfb-917a-4bc8e9ff529a",
                    "shrxm": "测试收货人",
                    "shrdzxxdz": "模拟患者地址IDEMP-split",
                    "shrsjh": "13900000002",
                    "shrgh": null,
                    "psfs": null,
                    "wlgs": null,
                    "qjsj": null,
                    "bz": null,
                    "id": null,
                    "createTime": "2026-10-03T17:05:14.000+00:00",
                    "updateTime": "2026-10-03T17:05:14.000+00:00",
                    "hzid": "2106430379832528896",
                    "shrdzsheng": "上海市",
                    "shrdzshi": "上海市",
                    "shrdzxian": "浦东新区",
                    "encrypted": null,
                    "isDefault": 1
                  },
                  "statusList": [],
                  "flowList": null,
                  "logisticInfo": null,
                  "logisticDetailList": null,
                  "institutionInfo": {
                    "recordId": "QA20261004AH1",
                    "jgdm": "QA20261004AH1",
                    "jgmc": "测试医院1",
                    "jgjc": null,
                    "jglx": 1,
                    "szq": "浦东新区",
                    "szs": "上海市",
                    "szp": "上海市",
                    "szpCode": null,
                    "szsCode": null,
                    "szqCode": null,
                    "szjCode": null,
                    "szj": null,
                    "xxdz": "模拟医院地址",
                    "lxr": "模拟医院联系人",
                    "lxdh": "13900000001",
                    "mrshdzlx": 2,
                    "mac": null,
                    "jgzh": null,
                    "jgmm": null,
                    "id": null,
                    "createTime": "2026-10-03T16:10:35.000+00:00",
                    "updateTime": "2026-10-03T16:10:35.000+00:00",
                    "startUploadTime": null,
                    "mqQueueName": null,
                    "lastHeartbeatTime": "2026-10-03T16:10:35.000+00:00",
                    "tzmode": null,
                    "gtqd": null,
                    "used": null
                  },
                  "operationLogList": null,
                  "exceptionInfo": null,
                  "hasLogisticOrder": false,
                  "logisticsType": null,
                  "logisticsTypeName": null,
                  "logisticsStatus": null,
                  "logisticsStatusName": null,
                  "lockerDisplay": null,
                  "splitPrescription": true,
                  "originalDoseCount": null,
                  "allocatedDoseCount": null,
                  "remainingDoseCount": null,
                  "executionList": null,
                  "prescriptionFile": null
                },
                {
                  "prescriptionInfo": {
                    "recordId": "2106429762963656704",
                    "id": 0,
                    "createTime": "2026-10-03T17:02:46.000+00:00",
                    "updateTime": "2026-10-04T07:14:53.000+00:00",
                    "jgid": "QA20261004AH1",
                    "mzzybz": "1",
                    "fph": null,
                    "qyh": null,
                    "yncfbh": "QA20261004A-IDEMP-confirm-SUP",
                    "bq": null,
                    "cwh": null,
                    "hznn": "30",
                    "ksmc": "中医科",
                    "ksbm": null,
                    "sfrs": null,
                    "fyfsyf": "1",
                    "jyffqt": null,
                    "fyfslx": "2",
                    "cfrq": 20261004,
                    "jfrq": "20261004/000000",
                    "cfscrq": "20261004",
                    "cfts": 7,
                    "zje": 7,
                    "sffb": null,
                    "shsjd": null,
                    "wlbz": null,
                    "sfjj": null,
                    "ypcdm": "QA20261004AF1",
                    "sfbz": null,
                    "cfzl": null,
                    "ztbm": "0",
                    "ztmc": "待处理",
                    "jyhx": null,
                    "hzid": "2106429762569392128",
                    "ysid": "2106420420256354304",
                    "shrid": "cf3944a9-9d4f-4f7e-9b3c-b8ce800e129b",
                    "ylklx": "0",
                    "ylkh": "QA20261004ACARDIDEMP-confirm",
                    "cfdmbj": 0,
                    "zyzzzdbmlx": null,
                    "zyzzzdbm": null,
                    "zyzzzdnr": null,
                    "zyzizdbmlx": null,
                    "zyzizdbm": null,
                    "zyzizdnr": null,
                    "xyzdzdbmlx": null,
                    "xyzdzdbm": null,
                    "xyzdzdnr": null,
                    "jyff": "2",
                    "cfsj": "00:00:00",
                    "yljgdm": "QA20261004AH1",
                    "cfrqTime": "2026-10-03T16:00:00.000+00:00",
                    "hzxm": "测*m",
                    "isDelete": 0,
                    "xzzt": null,
                    "djrq": null,
                    "fsycsj": null,
                    "jls": 1,
                    "encrypted": null,
                    "hzxb": "1",
                    "status": 3,
                    "sendStatus": 0,
                    "sendTime": null,
                    "downloadTime": null,
                    "withdrawStatus": null,
                    "refuseWithdrawTime": null,
                    "suspendStatus": null,
                    "yq": null,
                    "fysj": null,
                    "sjyq": null,
                    "zylx": null,
                    "pc": null,
                    "fyms": null,
                    "syrq": null,
                    "bz1": null,
                    "bz2": null,
                    "bz3": null,
                    "bz4": null,
                    "bz5": null,
                    "fyl": null,
                    "mrjl": null,
                    "bzl": null,
                    "sfTime": null,
                    "djTime": null,
                    "psTime": null,
                    "isException": null,
                    "lastStatusUpdateTime": null,
                    "lastLogisticUpdateTime": null,
                    "zjhm": "QA-ID-********-SUP",
                    "hzcsrq": "+0000-12-31T16:00:00.000+00:00",
                    "yljgmc": "测试医院1",
                    "ypcmc": "测试代煎企业1",
                    "sfsj": null,
                    "sfjg": null,
                    "sfysgh": null,
                    "sfysxm": null,
                    "splitSendStatus": null,
                    "splitPrescription": false,
                    "hasWithdrawHistory": false,
                    "lastWithdrawTime": null,
                    "zx": null,
                    "statusName": "已确认",
                    "transHash": "71dbcae63ba5e521fbe996f1be795e743611bba2db4103d3f4e055a7a114b6f3",
                    "transTime": "2026-10-03T17:02:46.000+00:00",
                    "splitSendStatusName": null
                  },
                  "detailInfoList": [
                    {
                      "recordId": "2106429763219509248",
                      "id": null,
                      "createTime": "2026-10-03T17:02:46.000+00:00",
                      "updateTime": "2026-10-03T17:02:46.000+00:00",
                      "sxh": "1",
                      "ypybdm": "QA20261004ADRUG1",
                      "ypmc": "黄芪",
                      "pch": null,
                      "cd": null,
                      "scsj": null,
                      "yycgsj": null,
                      "ypsybm": null,
                      "ypgg": "10g",
                      "ypdw": "1",
                      "ypdj": 1,
                      "ypjs": null,
                      "jl": 1,
                      "zl": 7,
                      "yynbypmc": "黄芪",
                      "yynbypbm": "QA20261004ADRUG1",
                      "dxzj": "7",
                      "tsjf": "无",
                      "ypsffb": null,
                      "qytbdm": null,
                      "dtsl": 1,
                      "jyhx": null,
                      "yncfbh": "QA20261004A-IDEMP-confirm-SUP",
                      "cfts": null,
                      "mainRecordId": "2106429762963656704",
                      "dmbj": 0,
                      "cfrq": 20261004,
                      "yljgdm": "QA20261004AH1",
                      "isDelete": 0,
                      "rkdh": null,
                      "ypfph": null,
                      "zsm": null,
                      "qynbzsm": null,
                      "cpph": null,
                      "sccj": null,
                      "gysdw": null,
                      "yxsj": null,
                      "rksj": null,
                      "ckdh": null,
                      "ckyf": null,
                      "cksj": null,
                      "ckcpph": null,
                      "withdrawStatus": null
                    }
                  ],
                  "patientInfo": {
                    "recordId": "2106429762569392128",
                    "zjlx": "1",
                    "zjhm": "QA-ID-********-SUP",
                    "hzxm": "测*m",
                    "hzxb": "1",
                    "hzcsrq": "+0000-12-31T16:00:00.000+00:00",
                    "id": 0,
                    "createTime": "2026-10-03T17:02:46.000+00:00",
                    "updateTime": "2026-10-03T17:02:46.000+00:00",
                    "zhjzjgdm": "QA20261004AH1",
                    "zhjzshrsjh": "13900000002",
                    "zhjzshrdzxxdz": "模拟患者地址IDEMP-confirm",
                    "zhjzshrxm": "测试收货人",
                    "encrypted": null,
                    "hzid": null
                  },
                  "doctorInfo": {
                    "recordId": "2106420420256354304",
                    "jgid": "QA20261004AH1",
                    "ysxm": "测试医生",
                    "ysgh": "QA20261004ADOC",
                    "lxdh": "13900000000",
                    "email": null,
                    "id": 0,
                    "createTime": "2026-10-03T16:25:38.000+00:00",
                    "updateTime": "2026-10-03T16:25:38.000+00:00",
                    "ysca": null,
                    "encrypted": null
                  },
                  "consigneeInfo": {
                    "recordId": "cf3944a9-9d4f-4f7e-9b3c-b8ce800e129b",
                    "shrxm": "测试收货人",
                    "shrdzxxdz": "模拟患者地址IDEMP-confirm",
                    "shrsjh": "13900000002",
                    "shrgh": null,
                    "psfs": null,
                    "wlgs": null,
                    "qjsj": null,
                    "bz": null,
                    "id": null,
                    "createTime": "2026-10-03T17:02:46.000+00:00",
                    "updateTime": "2026-10-03T17:02:46.000+00:00",
                    "hzid": "2106429762569392128",
                    "shrdzsheng": "上海市",
                    "shrdzshi": "上海市",
                    "shrdzxian": "浦东新区",
                    "encrypted": null,
                    "isDefault": 1
                  },
                  "statusList": [],
                  "flowList": null,
                  "logisticInfo": null,
                  "logisticDetailList": null,
                  "institutionInfo": {
                    "recordId": "QA20261004AH1",
                    "jgdm": "QA20261004AH1",
                    "jgmc": "测试医院1",
                    "jgjc": null,
                    "jglx": 1,
                    "szq": "浦东新区",
                    "szs": "上海市",
                    "szp": "上海市",
                    "szpCode": null,
                    "szsCode": null,
                    "szqCode": null,
                    "szjCode": null,
                    "szj": null,
                    "xxdz": "模拟医院地址",
                    "lxr": "模拟医院联系人",
                    "lxdh": "13900000001",
                    "mrshdzlx": 2,
                    "mac": null,
                    "jgzh": null,
                    "jgmm": null,
                    "id": null,
                    "createTime": "2026-10-03T16:10:35.000+00:00",
                    "updateTime": "2026-10-03T16:10:35.000+00:00",
                    "startUploadTime": null,
                    "mqQueueName": null,
                    "lastHeartbeatTime": "2026-10-03T16:10:35.000+00:00",
                    "tzmode": null,
                    "gtqd": null,
                    "used": null
                  },
                  "operationLogList": null,
                  "exceptionInfo": null,
                  "hasLogisticOrder": false,
                  "logisticsType": null,
                  "logisticsTypeName": null,
                  "logisticsStatus": null,
                  "logisticsStatusName": null,
                  "lockerDisplay": null,
                  "splitPrescription": false,
                  "originalDoseCount": null,
                  "allocatedDoseCount": null,
                  "remainingDoseCount": null,
                  "executionList": null,
                  "prescriptionFile": null
                },
                {
                  "prescriptionInfo": {
                    "recordId": "2106428602907250688",
                    "id": 0,
                    "createTime": "2026-10-03T16:58:09.000+00:00",
                    "updateTime": "2026-10-04T07:14:53.000+00:00",
                    "jgid": "QA20261004AH1",
                    "mzzybz": "1",
                    "fph": null,
                    "qyh": null,
                    "yncfbh": "QA20261004A-CON-confirm-50-SUP",
                    "bq": null,
                    "cwh": null,
                    "hznn": "30",
                    "ksmc": "中医科",
                    "ksbm": null,
                    "sfrs": null,
                    "fyfsyf": "1",
                    "jyffqt": null,
                    "fyfslx": "2",
                    "cfrq": 20261004,
                    "jfrq": "20261004/000000",
                    "cfscrq": "20261004",
                    "cfts": 7,
                    "zje": 7,
                    "sffb": null,
                    "shsjd": null,
                    "wlbz": null,
                    "sfjj": null,
                    "ypcdm": "QA20261004AF1",
                    "sfbz": null,
                    "cfzl": null,
                    "ztbm": "0",
                    "ztmc": "待处理",
                    "jyhx": null,
                    "hzid": "2106428602445877248",
                    "ysid": "2106420420256354304",
                    "shrid": "cf6873fa-eccb-499f-b688-513b75a3e396",
                    "ylklx": "0",
                    "ylkh": "QA20261004ACARDCON-confirm-50",
                    "cfdmbj": 0,
                    "zyzzzdbmlx": null,
                    "zyzzzdbm": null,
                    "zyzzzdnr": null,
                    "zyzizdbmlx": null,
                    "zyzizdbm": null,
                    "zyzizdnr": null,
                    "xyzdzdbmlx": null,
                    "xyzdzdbm": null,
                    "xyzdzdnr": null,
                    "jyff": "2",
                    "cfsj": "00:00:00",
                    "yljgdm": "QA20261004AH1",
                    "cfrqTime": "2026-10-03T16:00:00.000+00:00",
                    "hzxm": "测*0",
                    "isDelete": 0,
                    "xzzt": null,
                    "djrq": null,
                    "fsycsj": null,
                    "jls": 1,
                    "encrypted": null,
                    "hzxb": "1",
                    "status": 3,
                    "sendStatus": 0,
                    "sendTime": null,
                    "downloadTime": null,
                    "withdrawStatus": null,
                    "refuseWithdrawTime": null,
                    "suspendStatus": null,
                    "yq": null,
                    "fysj": null,
                    "sjyq": null,
                    "zylx": null,
                    "pc": null,
                    "fyms": null,
                    "syrq": null,
                    "bz1": null,
                    "bz2": null,
                    "bz3": null,
                    "bz4": null,
                    "bz5": null,
                    "fyl": null,
                    "mrjl": null,
                    "bzl": null,
                    "sfTime": null,
                    "djTime": null,
                    "psTime": null,
                    "isException": null,
                    "lastStatusUpdateTime": null,
                    "lastLogisticUpdateTime": null,
                    "zjhm": "QA-ID-********-SUP",
                    "hzcsrq": "+0000-12-31T16:00:00.000+00:00",
                    "yljgmc": "测试医院1",
                    "ypcmc": "测试代煎企业1",
                    "sfsj": null,
                    "sfjg": null,
                    "sfysgh": null,
                    "sfysxm": null,
                    "splitSendStatus": null,
                    "splitPrescription": false,
                    "hasWithdrawHistory": false,
                    "lastWithdrawTime": null,
                    "zx": null,
                    "statusName": "已确认",
                    "transHash": "a5dba40634efa09b08b5fc55718dc4bbfc46a22ca4e2eca3548b8252f888538b",
                    "transTime": "2026-10-03T16:58:09.000+00:00",
                    "splitSendStatusName": null
                  },
                  "detailInfoList": [
                    {
                      "recordId": "2106428603230212096",
                      "id": null,
                      "createTime": "2026-10-03T16:58:09.000+00:00",
                      "updateTime": "2026-10-03T16:58:09.000+00:00",
                      "sxh": "1",
                      "ypybdm": "QA20261004ADRUG1",
                      "ypmc": "黄芪",
                      "pch": null,
                      "cd": null,
                      "scsj": null,
                      "yycgsj": null,
                      "ypsybm": null,
                      "ypgg": "10g",
                      "ypdw": "1",
                      "ypdj": 1,
                      "ypjs": null,
                      "jl": 1,
                      "zl": 7,
                      "yynbypmc": "黄芪",
                      "yynbypbm": "QA20261004ADRUG1",
                      "dxzj": "7",
                      "tsjf": "无",
                      "ypsffb": null,
                      "qytbdm": null,
                      "dtsl": 1,
                      "jyhx": null,
                      "yncfbh": "QA20261004A-CON-confirm-50-SUP",
                      "cfts": null,
                      "mainRecordId": "2106428602907250688",
                      "dmbj": 0,
                      "cfrq": 20261004,
                      "yljgdm": "QA20261004AH1",
                      "isDelete": 0,
                      "rkdh": null,
                      "ypfph": null,
                      "zsm": null,
                      "qynbzsm": null,
                      "cpph": null,
                      "sccj": null,
                      "gysdw": null,
                      "yxsj": null,
                      "rksj": null,
                      "ckdh": null,
                      "ckyf": null,
                      "cksj": null,
                      "ckcpph": null,
                      "withdrawStatus": null
                    }
                  ],
                  "patientInfo": {
                    "recordId": "2106428602445877248",
                    "zjlx": "1",
                    "zjhm": "QA-ID-********-SUP",
                    "hzxm": "测*0",
                    "hzxb": "1",
                    "hzcsrq": "+0000-12-31T16:00:00.000+00:00",
                    "id": 0,
                    "createTime": "2026-10-03T16:58:09.000+00:00",
                    "updateTime": "2026-10-03T16:58:09.000+00:00",
                    "zhjzjgdm": "QA20261004AH1",
                    "zhjzshrsjh": "13900000002",
                    "zhjzshrdzxxdz": "模拟患者地址CON-confirm-50",
                    "zhjzshrxm": "测试收货人",
                    "encrypted": null,
                    "hzid": null
                  },
                  "doctorInfo": {
                    "recordId": "2106420420256354304",
                    "jgid": "QA20261004AH1",
                    "ysxm": "测试医生",
                    "ysgh": "QA20261004ADOC",
                    "lxdh": "13900000000",
                    "email": null,
                    "id": 0,
                    "createTime": "2026-10-03T16:25:38.000+00:00",
                    "updateTime": "2026-10-03T16:25:38.000+00:00",
                    "ysca": null,
                    "encrypted": null
                  },
                  "consigneeInfo": {
                    "recordId": "cf6873fa-eccb-499f-b688-513b75a3e396",
                    "shrxm": "测试收货人",
                    "shrdzxxdz": "模拟患者地址CON-confirm-50",
                    "shrsjh": "13900000002",
                    "shrgh": null,
                    "psfs": null,
                    "wlgs": null,
                    "qjsj": null,
                    "bz": null,
                    "id": null,
                    "createTime": "2026-10-03T16:58:10.000+00:00",
                    "updateTime": "2026-10-03T16:58:10.000+00:00",
                    "hzid": "2106428602445877248",
                    "shrdzsheng": "上海市",
                    "shrdzshi": "上海市",
                    "shrdzxian": "浦东新区",
                    "encrypted": null,
                    "isDefault": 1
                  },
                  "statusList": [],
                  "flowList": null,
                  "logisticInfo": null,
                  "logisticDetailList": null,
                  "institutionInfo": {
                    "recordId": "QA20261004AH1",
                    "jgdm": "QA20261004AH1",
                    "jgmc": "测试医院1",
                    "jgjc": null,
                    "jglx": 1,
                    "szq": "浦东新区",
                    "szs": "上海市",
                    "szp": "上海市",
                    "szpCode": null,
                    "szsCode": null,
                    "szqCode": null,
                    "szjCode": null,
                    "szj": null,
                    "xxdz": "模拟医院地址",
                    "lxr": "模拟医院联系人",
                    "lxdh": "13900000001",
                    "mrshdzlx": 2,
                    "mac": null,
                    "jgzh": null,
                    "jgmm": null,
                    "id": null,
                    "createTime": "2026-10-03T16:10:35.000+00:00",
                    "updateTime": "2026-10-03T16:10:35.000+00:00",
                    "startUploadTime": null,
                    "mqQueueName": null,
                    "lastHeartbeatTime": "2026-10-03T16:10:35.000+00:00",
                    "tzmode": null,
                    "gtqd": null,
                    "used": null
                  },
                  "operationLogList": null,
                  "exceptionInfo": null,
                  "hasLogisticOrder": false,
                  "logisticsType": null,
                  "logisticsTypeName": null,
                  "logisticsStatus": null,
                  "logisticsStatusName": null,
                  "lockerDisplay": null,
                  "splitPrescription": false,
                  "originalDoseCount": null,
                  "allocatedDoseCount": null,
                  "remainingDoseCount": null,
                  "executionList": null,
                  "prescriptionFile": null
                },
                {
                  "prescriptionInfo": {
                    "recordId": "2106428582229331968",
                    "id": 0,
                    "createTime": "2026-10-03T16:58:04.000+00:00",
                    "updateTime": "2026-10-04T07:14:53.000+00:00",
                    "jgid": "QA20261004AH1",
                    "mzzybz": "1",
                    "fph": null,
                    "qyh": null,
                    "yncfbh": "QA20261004A-CON-confirm-10-SUP",
                    "bq": null,
                    "cwh": null,
                    "hznn": "30",
                    "ksmc": "中医科",
                    "ksbm": null,
                    "sfrs": null,
                    "fyfsyf": "1",
                    "jyffqt": null,
                    "fyfslx": "2",
                    "cfrq": 20261004,
                    "jfrq": "20261004/000000",
                    "cfscrq": "20261004",
                    "cfts": 7,
                    "zje": 7,
                    "sffb": null,
                    "shsjd": null,
                    "wlbz": null,
                    "sfjj": null,
                    "ypcdm": "QA20261004AF1",
                    "sfbz": null,
                    "cfzl": null,
                    "ztbm": "0",
                    "ztmc": "待处理",
                    "jyhx": null,
                    "hzid": "2106428581705043968",
                    "ysid": "2106420420256354304",
                    "shrid": "fca741ce-bbed-4f46-a663-616be36de483",
                    "ylklx": "0",
                    "ylkh": "QA20261004ACARDCON-confirm-10",
                    "cfdmbj": 0,
                    "zyzzzdbmlx": null,
                    "zyzzzdbm": null,
                    "zyzzzdnr": null,
                    "zyzizdbmlx": null,
                    "zyzizdbm": null,
                    "zyzizdnr": null,
                    "xyzdzdbmlx": null,
                    "xyzdzdbm": null,
                    "xyzdzdnr": null,
                    "jyff": "2",
                    "cfsj": "00:00:00",
                    "yljgdm": "QA20261004AH1",
                    "cfrqTime": "2026-10-03T16:00:00.000+00:00",
                    "hzxm": "测*0",
                    "isDelete": 0,
                    "xzzt": null,
                    "djrq": null,
                    "fsycsj": null,
                    "jls": 1,
                    "encrypted": null,
                    "hzxb": "1",
                    "status": 3,
                    "sendStatus": 0,
                    "sendTime": null,
                    "downloadTime": null,
                    "withdrawStatus": null,
                    "refuseWithdrawTime": null,
                    "suspendStatus": null,
                    "yq": null,
                    "fysj": null,
                    "sjyq": null,
                    "zylx": null,
                    "pc": null,
                    "fyms": null,
                    "syrq": null,
                    "bz1": null,
                    "bz2": null,
                    "bz3": null,
                    "bz4": null,
                    "bz5": null,
                    "fyl": null,
                    "mrjl": null,
                    "bzl": null,
                    "sfTime": null,
                    "djTime": null,
                    "psTime": null,
                    "isException": null,
                    "lastStatusUpdateTime": null,
                    "lastLogisticUpdateTime": null,
                    "zjhm": "QA-ID-********-SUP",
                    "hzcsrq": "+0000-12-31T16:00:00.000+00:00",
                    "yljgmc": "测试医院1",
                    "ypcmc": "测试代煎企业1",
                    "sfsj": null,
                    "sfjg": null,
                    "sfysgh": null,
                    "sfysxm": null,
                    "splitSendStatus": null,
                    "splitPrescription": false,
                    "hasWithdrawHistory": false,
                    "lastWithdrawTime": null,
                    "zx": null,
                    "statusName": "已确认",
                    "transHash": "706bfbb09f671c8571099649902357efdc2cc663dcf514be313903fdce704f8b",
                    "transTime": "2026-10-03T16:58:04.000+00:00",
                    "splitSendStatusName": null
                  },
                  "detailInfoList": [
                    {
                      "recordId": "2106428582489378816",
                      "id": null,
                      "createTime": "2026-10-03T16:58:04.000+00:00",
                      "updateTime": "2026-10-03T16:58:04.000+00:00",
                      "sxh": "1",
                      "ypybdm": "QA20261004ADRUG1",
                      "ypmc": "黄芪",
                      "pch": null,
                      "cd": null,
                      "scsj": null,
                      "yycgsj": null,
                      "ypsybm": null,
                      "ypgg": "10g",
                      "ypdw": "1",
                      "ypdj": 1,
                      "ypjs": null,
                      "jl": 1,
                      "zl": 7,
                      "yynbypmc": "黄芪",
                      "yynbypbm": "QA20261004ADRUG1",
                      "dxzj": "7",
                      "tsjf": "无",
                      "ypsffb": null,
                      "qytbdm": null,
                      "dtsl": 1,
                      "jyhx": null,
                      "yncfbh": "QA20261004A-CON-confirm-10-SUP",
                      "cfts": null,
                      "mainRecordId": "2106428582229331968",
                      "dmbj": 0,
                      "cfrq": 20261004,
                      "yljgdm": "QA20261004AH1",
                      "isDelete": 0,
                      "rkdh": null,
                      "ypfph": null,
                      "zsm": null,
                      "qynbzsm": null,
                      "cpph": null,
                      "sccj": null,
                      "gysdw": null,
                      "yxsj": null,
                      "rksj": null,
                      "ckdh": null,
                      "ckyf": null,
                      "cksj": null,
                      "ckcpph": null,
                      "withdrawStatus": null
                    }
                  ],
                  "patientInfo": {
                    "recordId": "2106428581705043968",
                    "zjlx": "1",
                    "zjhm": "QA-ID-********-SUP",
                    "hzxm": "测*0",
                    "hzxb": "1",
                    "hzcsrq": "+0000-12-31T16:00:00.000+00:00",
                    "id": 0,
                    "createTime": "2026-10-03T16:58:04.000+00:00",
                    "updateTime": "2026-10-03T16:58:04.000+00:00",
                    "zhjzjgdm": "QA20261004AH1",
                    "zhjzshrsjh": "13900000002",
                    "zhjzshrdzxxdz": "模拟患者地址CON-confirm-10",
                    "zhjzshrxm": "测试收货人",
                    "encrypted": null,
                    "hzid": null
                  },
                  "doctorInfo": {
                    "recordId": "2106420420256354304",
                    "jgid": "QA20261004AH1",
                    "ysxm": "测试医生",
                    "ysgh": "QA20261004ADOC",
                    "lxdh": "13900000000",
                    "email": null,
                    "id": 0,
                    "createTime": "2026-10-03T16:25:38.000+00:00",
                    "updateTime": "2026-10-03T16:25:38.000+00:00",
                    "ysca": null,
                    "encrypted": null
                  },
                  "consigneeInfo": {
                    "recordId": "fca741ce-bbed-4f46-a663-616be36de483",
                    "shrxm": "测试收货人",
                    "shrdzxxdz": "模拟患者地址CON-confirm-10",
                    "shrsjh": "13900000002",
                    "shrgh": null,
                    "psfs": null,
                    "wlgs": null,
                    "qjsj": null,
                    "bz": null,
                    "id": null,
                    "createTime": "2026-10-03T16:58:05.000+00:00",
                    "updateTime": "2026-10-03T16:58:05.000+00:00",
                    "hzid": "2106428581705043968",
                    "shrdzsheng": "上海市",
                    "shrdzshi": "上海市",
                    "shrdzxian": "浦东新区",
                    "encrypted": null,
                    "isDefault": 1
                  },
                  "statusList": [],
                  "flowList": null,
                  "logisticInfo": null,
                  "logisticDetailList": null,
                  "institutionInfo": {
                    "recordId": "QA20261004AH1",
                    "jgdm": "QA20261004AH1",
                    "jgmc": "测试医院1",
                    "jgjc": null,
                    "jglx": 1,
                    "szq": "浦东新区",
                    "szs": "上海市",
                    "szp": "上海市",
                    "szpCode": null,
                    "szsCode": null,
                    "szqCode": null,
                    "szjCode": null,
                    "szj": null,
                    "xxdz": "模拟医院地址",
                    "lxr": "模拟医院联系人",
                    "lxdh": "13900000001",
                    "mrshdzlx": 2,
                    "mac": null,
                    "jgzh": null,
                    "jgmm": null,
                    "id": null,
                    "createTime": "2026-10-03T16:10:35.000+00:00",
                    "updateTime": "2026-10-03T16:10:35.000+00:00",
                    "startUploadTime": null,
                    "mqQueueName": null,
                    "lastHeartbeatTime": "2026-10-03T16:10:35.000+00:00",
                    "tzmode": null,
                    "gtqd": null,
                    "used": null
                  },
                  "operationLogList": null,
                  "exceptionInfo": null,
                  "hasLogisticOrder": false,
                  "logisticsType": null,
                  "logisticsTypeName": null,
                  "logisticsStatus": null,
                  "logisticsStatusName": null,
                  "lockerDisplay": null,
                  "splitPrescription": false,
                  "originalDoseCount": null,
                  "allocatedDoseCount": null,
                  "remainingDoseCount": null,
                  "executionList": null,
                  "prescriptionFile": null
                },
                {
                  "prescriptionInfo": {
                    "recordId": "2106428562834870272",
                    "id": 0,
                    "createTime": "2026-10-03T16:57:59.000+00:00",
                    "updateTime": "2026-10-04T07:14:53.000+00:00",
                    "jgid": "QA20261004AH1",
                    "mzzybz": "1",
                    "fph": null,
                    "qyh": null,
                    "yncfbh": "QA20261004A-CON-confirm-5-SUP",
                    "bq": null,
                    "cwh": null,
                    "hznn": "30",
                    "ksmc": "中医科",
                    "ksbm": null,
                    "sfrs": null,
                    "fyfsyf": "1",
                    "jyffqt": null,
                    "fyfslx": "2",
                    "cfrq": 20261004,
                    "jfrq": "20261004/000000",
                    "cfscrq": "20261004",
                    "cfts": 7,
                    "zje": 7,
                    "sffb": null,
                    "shsjd": null,
                    "wlbz": null,
                    "sfjj": null,
                    "ypcdm": "QA20261004AF1",
                    "sfbz": null,
                    "cfzl": null,
                    "ztbm": "0",
                    "ztmc": "待处理",
                    "jyhx": null,
                    "hzid": "2106428562440605696",
                    "ysid": "2106420420256354304",
                    "shrid": "994b5ff3-4718-4669-b593-fa85f0f37b8d",
                    "ylklx": "0",
                    "ylkh": "QA20261004ACARDCON-confirm-5",
                    "cfdmbj": 0,
                    "zyzzzdbmlx": null,
                    "zyzzzdbm": null,
                    "zyzzzdnr": null,
                    "zyzizdbmlx": null,
                    "zyzizdbm": null,
                    "zyzizdnr": null,
                    "xyzdzdbmlx": null,
                    "xyzdzdbm": null,
                    "xyzdzdnr": null,
                    "jyff": "2",
                    "cfsj": "00:00:00",
                    "yljgdm": "QA20261004AH1",
                    "cfrqTime": "2026-10-03T16:00:00.000+00:00",
                    "hzxm": "测*5",
                    "isDelete": 0,
                    "xzzt": null,
                    "djrq": null,
                    "fsycsj": null,
                    "jls": 1,
                    "encrypted": null,
                    "hzxb": "1",
                    "status": 3,
                    "sendStatus": 0,
                    "sendTime": null,
                    "downloadTime": null,
                    "withdrawStatus": null,
                    "refuseWithdrawTime": null,
                    "suspendStatus": null,
                    "yq": null,
                    "fysj": null,
                    "sjyq": null,
                    "zylx": null,
                    "pc": null,
                    "fyms": null,
                    "syrq": null,
                    "bz1": null,
                    "bz2": null,
                    "bz3": null,
                    "bz4": null,
                    "bz5": null,
                    "fyl": null,
                    "mrjl": null,
                    "bzl": null,
                    "sfTime": null,
                    "djTime": null,
                    "psTime": null,
                    "isException": null,
                    "lastStatusUpdateTime": null,
                    "lastLogisticUpdateTime": null,
                    "zjhm": "QA-ID-********-SUP",
                    "hzcsrq": "+0000-12-31T16:00:00.000+00:00",
                    "yljgmc": "测试医院1",
                    "ypcmc": "测试代煎企业1",
                    "sfsj": null,
                    "sfjg": null,
                    "sfysgh": null,
                    "sfysxm": null,
                    "splitSendStatus": null,
                    "splitPrescription": false,
                    "hasWithdrawHistory": false,
                    "lastWithdrawTime": null,
                    "zx": null,
                    "statusName": "已确认",
                    "transHash": "aa3ec0f0ef53ebd3cb4fcbdb937b8d057d74302fb745b64829984a2e30734770",
                    "transTime": "2026-10-03T16:58:00.000+00:00",
                    "splitSendStatusName": null
                  },
                  "detailInfoList": [
                    {
                      "recordId": "2106428563094917120",
                      "id": null,
                      "createTime": "2026-10-03T16:57:59.000+00:00",
                      "updateTime": "2026-10-03T16:57:59.000+00:00",
                      "sxh": "1",
                      "ypybdm": "QA20261004ADRUG1",
                      "ypmc": "黄芪",
                      "pch": null,
                      "cd": null,
                      "scsj": null,
                      "yycgsj": null,
                      "ypsybm": null,
                      "ypgg": "10g",
                      "ypdw": "1",
                      "ypdj": 1,
                      "ypjs": null,
                      "jl": 1,
                      "zl": 7,
                      "yynbypmc": "黄芪",
                      "yynbypbm": "QA20261004ADRUG1",
                      "dxzj": "7",
                      "tsjf": "无",
                      "ypsffb": null,
                      "qytbdm": null,
                      "dtsl": 1,
                      "jyhx": null,
                      "yncfbh": "QA20261004A-CON-confirm-5-SUP",
                      "cfts": null,
                      "mainRecordId": "2106428562834870272",
                      "dmbj": 0,
                      "cfrq": 20261004,
                      "yljgdm": "QA20261004AH1",
                      "isDelete": 0,
                      "rkdh": null,
                      "ypfph": null,
                      "zsm": null,
                      "qynbzsm": null,
                      "cpph": null,
                      "sccj": null,
                      "gysdw": null,
                      "yxsj": null,
                      "rksj": null,
                      "ckdh": null,
                      "ckyf": null,
                      "cksj": null,
                      "ckcpph": null,
                      "withdrawStatus": null
                    }
                  ],
                  "patientInfo": {
                    "recordId": "2106428562440605696",
                    "zjlx": "1",
                    "zjhm": "QA-ID-********-SUP",
                    "hzxm": "测*5",
                    "hzxb": "1",
                    "hzcsrq": "+0000-12-31T16:00:00.000+00:00",
                    "id": 0,
                    "createTime": "2026-10-03T16:57:59.000+00:00",
                    "updateTime": "2026-10-03T16:57:59.000+00:00",
                    "zhjzjgdm": "QA20261004AH1",
                    "zhjzshrsjh": "13900000002",
                    "zhjzshrdzxxdz": "模拟患者地址CON-confirm-5",
                    "zhjzshrxm": "测试收货人",
                    "encrypted": null,
                    "hzid": null
                  },
                  "doctorInfo": {
                    "recordId": "2106420420256354304",
                    "jgid": "QA20261004AH1",
                    "ysxm": "测试医生",
                    "ysgh": "QA20261004ADOC",
                    "lxdh": "13900000000",
                    "email": null,
                    "id": 0,
                    "createTime": "2026-10-03T16:25:38.000+00:00",
                    "updateTime": "2026-10-03T16:25:38.000+00:00",
                    "ysca": null,
                    "encrypted": null
                  },
                  "consigneeInfo": {
                    "recordId": "994b5ff3-4718-4669-b593-fa85f0f37b8d",
                    "shrxm": "测试收货人",
                    "shrdzxxdz": "模拟患者地址CON-confirm-5",
                    "shrsjh": "13900000002",
                    "shrgh": null,
                    "psfs": null,
                    "wlgs": null,
                    "qjsj": null,
                    "bz": null,
                    "id": null,
                    "createTime": "2026-10-03T16:58:00.000+00:00",
                    "updateTime": "2026-10-03T16:58:00.000+00:00",
                    "hzid": "2106428562440605696",
                    "shrdzsheng": "上海市",
                    "shrdzshi": "上海市",
                    "shrdzxian": "浦东新区",
                    "encrypted": null,
                    "isDefault": 1
                  },
                  "statusList": [],
                  "flowList": null,
                  "logisticInfo": null,
                  "logisticDetailList": null,
                  "institutionInfo": {
                    "recordId": "QA20261004AH1",
                    "jgdm": "QA20261004AH1",
                    "jgmc": "测试医院1",
                    "jgjc": null,
                    "jglx": 1,
                    "szq": "浦东新区",
                    "szs": "上海市",
                    "szp": "上海市",
                    "szpCode": null,
                    "szsCode": null,
                    "szqCode": null,
                    "szjCode": null,
                    "szj": null,
                    "xxdz": "模拟医院地址",
                    "lxr": "模拟医院联系人",
                    "lxdh": "13900000001",
                    "mrshdzlx": 2,
                    "mac": null,
                    "jgzh": null,
                    "jgmm": null,
                    "id": null,
                    "createTime": "2026-10-03T16:10:35.000+00:00",
                    "updateTime": "2026-10-03T16:10:35.000+00:00",
                    "startUploadTime": null,
                    "mqQueueName": null,
                    "lastHeartbeatTime": "2026-10-03T16:10:35.000+00:00",
                    "tzmode": null,
                    "gtqd": null,
                    "used": null
                  },
                  "operationLogList": null,
                  "exceptionInfo": null,
                  "hasLogisticOrder": false,
                  "logisticsType": null,
                  "logisticsTypeName": null,
                  "logisticsStatus": null,
                  "logisticsStatusName": null,
                  "lockerDisplay": null,
                  "splitPrescription": false,
                  "originalDoseCount": null,
                  "allocatedDoseCount": null,
                  "remainingDoseCount": null,
                  "executionList": null,
                  "prescriptionFile": null
                },
                {
                  "prescriptionInfo": {
                    "recordId": "2106428545118130176",
                    "id": 0,
                    "createTime": "2026-10-03T16:57:55.000+00:00",
                    "updateTime": "2026-10-04T07:14:53.000+00:00",
                    "jgid": "QA20261004AH1",
                    "mzzybz": "1",
                    "fph": null,
                    "qyh": null,
                    "yncfbh": "QA20261004A-CON-confirm-1-SUP",
                    "bq": null,
                    "cwh": null,
                    "hznn": "30",
                    "ksmc": "中医科",
                    "ksbm": null,
                    "sfrs": null,
                    "fyfsyf": "1",
                    "jyffqt": null,
                    "fyfslx": "2",
                    "cfrq": 20261004,
                    "jfrq": "20261004/000000",
                    "cfscrq": "20261004",
                    "cfts": 7,
                    "zje": 7,
                    "sffb": null,
                    "shsjd": null,
                    "wlbz": null,
                    "sfjj": null,
                    "ypcdm": "QA20261004AF1",
                    "sfbz": null,
                    "cfzl": null,
                    "ztbm": "0",
                    "ztmc": "待处理",
                    "jyhx": null,
                    "hzid": "2106428544539316224",
                    "ysid": "2106420420256354304",
                    "shrid": "4b1eb4d7-bd68-4b61-973f-74825e31d964",
                    "ylklx": "0",
                    "ylkh": "QA20261004ACARDCON-confirm-1",
                    "cfdmbj": 0,
                    "zyzzzdbmlx": null,
                    "zyzzzdbm": null,
                    "zyzzzdnr": null,
                    "zyzizdbmlx": null,
                    "zyzizdbm": null,
                    "zyzizdnr": null,
                    "xyzdzdbmlx": null,
                    "xyzdzdbm": null,
                    "xyzdzdnr": null,
                    "jyff": "2",
                    "cfsj": "00:00:00",
                    "yljgdm": "QA20261004AH1",
                    "cfrqTime": "2026-10-03T16:00:00.000+00:00",
                    "hzxm": "测*1",
                    "isDelete": 0,
                    "xzzt": null,
                    "djrq": null,
                    "fsycsj": null,
                    "jls": 1,
                    "encrypted": null,
                    "hzxb": "1",
                    "status": 3,
                    "sendStatus": 0,
                    "sendTime": null,
                    "downloadTime": null,
                    "withdrawStatus": null,
                    "refuseWithdrawTime": null,
                    "suspendStatus": null,
                    "yq": null,
                    "fysj": null,
                    "sjyq": null,
                    "zylx": null,
                    "pc": null,
                    "fyms": null,
                    "syrq": null,
                    "bz1": null,
                    "bz2": null,
                    "bz3": null,
                    "bz4": null,
                    "bz5": null,
                    "fyl": null,
                    "mrjl": null,
                    "bzl": null,
                    "sfTime": null,
                    "djTime": null,
                    "psTime": null,
                    "isException": null,
                    "lastStatusUpdateTime": null,
                    "lastLogisticUpdateTime": null,
                    "zjhm": "QA-ID-********-SUP",
                    "hzcsrq": "+0000-12-31T16:00:00.000+00:00",
                    "yljgmc": "测试医院1",
                    "ypcmc": "测试代煎企业1",
                    "sfsj": null,
                    "sfjg": null,
                    "sfysgh": null,
                    "sfysxm": null,
                    "splitSendStatus": null,
                    "splitPrescription": false,
                    "hasWithdrawHistory": false,
                    "lastWithdrawTime": null,
                    "zx": null,
                    "statusName": "已确认",
                    "transHash": "1e742f6809964853863ffa5507647ce6cdcc8aef1a9ec63c81a31670374b2118",
                    "transTime": "2026-10-03T16:57:55.000+00:00",
                    "splitSendStatusName": null
                  },
                  "detailInfoList": [
                    {
                      "recordId": "2106428545378177024",
                      "id": null,
                      "createTime": "2026-10-03T16:57:55.000+00:00",
                      "updateTime": "2026-10-03T16:57:55.000+00:00",
                      "sxh": "1",
                      "ypybdm": "QA20261004ADRUG1",
                      "ypmc": "黄芪",
                      "pch": null,
                      "cd": null,
                      "scsj": null,
                      "yycgsj": null,
                      "ypsybm": null,
                      "ypgg": "10g",
                      "ypdw": "1",
                      "ypdj": 1,
                      "ypjs": null,
                      "jl": 1,
                      "zl": 7,
                      "yynbypmc": "黄芪",
                      "yynbypbm": "QA20261004ADRUG1",
                      "dxzj": "7",
                      "tsjf": "无",
                      "ypsffb": null,
                      "qytbdm": null,
                      "dtsl": 1,
                      "jyhx": null,
                      "yncfbh": "QA20261004A-CON-confirm-1-SUP",
                      "cfts": null,
                      "mainRecordId": "2106428545118130176",
                      "dmbj": 0,
                      "cfrq": 20261004,
                      "yljgdm": "QA20261004AH1",
                      "isDelete": 0,
                      "rkdh": null,
                      "ypfph": null,
                      "zsm": null,
                      "qynbzsm": null,
                      "cpph": null,
                      "sccj": null,
                      "gysdw": null,
                      "yxsj": null,
                      "rksj": null,
                      "ckdh": null,
                      "ckyf": null,
                      "cksj": null,
                      "ckcpph": null,
                      "withdrawStatus": null
                    }
                  ],
                  "patientInfo": {
                    "recordId": "2106428544539316224",
                    "zjlx": "1",
                    "zjhm": "QA-ID-********-SUP",
                    "hzxm": "测*1",
                    "hzxb": "1",
                    "hzcsrq": "+0000-12-31T16:00:00.000+00:00",
                    "id": 0,
                    "createTime": "2026-10-03T16:57:55.000+00:00",
                    "updateTime": "2026-10-03T16:57:55.000+00:00",
                    "zhjzjgdm": "QA20261004AH1",
                    "zhjzshrsjh": "13900000002",
                    "zhjzshrdzxxdz": "模拟患者地址CON-confirm-1",
                    "zhjzshrxm": "测试收货人",
                    "encrypted": null,
                    "hzid": null
                  },
                  "doctorInfo": {
                    "recordId": "2106420420256354304",
                    "jgid": "QA20261004AH1",
                    "ysxm": "测试医生",
                    "ysgh": "QA20261004ADOC",
                    "lxdh": "13900000000",
                    "email": null,
                    "id": 0,
                    "createTime": "2026-10-03T16:25:38.000+00:00",
                    "updateTime": "2026-10-03T16:25:38.000+00:00",
                    "ysca": null,
                    "encrypted": null
                  },
                  "consigneeInfo": {
                    "recordId": "4b1eb4d7-bd68-4b61-973f-74825e31d964",
                    "shrxm": "测试收货人",
                    "shrdzxxdz": "模拟患者地址CON-confirm-1",
                    "shrsjh": "13900000002",
                    "shrgh": null,
                    "psfs": null,
                    "wlgs": null,
                    "qjsj": null,
                    "bz": null,
                    "id": null,
                    "createTime": "2026-10-03T16:57:56.000+00:00",
                    "updateTime": "2026-10-03T16:57:56.000+00:00",
                    "hzid": "2106428544539316224",
                    "shrdzsheng": "上海市",
                    "shrdzshi": "上海市",
                    "shrdzxian": "浦东新区",
                    "encrypted": null,
                    "isDefault": 1
                  },
                  "statusList": [],
                  "flowList": null,
                  "logisticInfo": null,
                  "logisticDetailList": null,
                  "institutionInfo": {
                    "recordId": "QA20261004AH1",
                    "jgdm": "QA20261004AH1",
                    "jgmc": "测试医院1",
                    "jgjc": null,
                    "jglx": 1,
                    "szq": "浦东新区",
                    "szs": "上海市",
                    "szp": "上海市",
                    "szpCode": null,
                    "szsCode": null,
                    "szqCode": null,
                    "szjCode": null,
                    "szj": null,
                    "xxdz": "模拟医院地址",
                    "lxr": "模拟医院联系人",
                    "lxdh": "13900000001",
                    "mrshdzlx": 2,
                    "mac": null,
                    "jgzh": null,
                    "jgmm": null,
                    "id": null,
                    "createTime": "2026-10-03T16:10:35.000+00:00",
                    "updateTime": "2026-10-03T16:10:35.000+00:00",
                    "startUploadTime": null,
                    "mqQueueName": null,
                    "lastHeartbeatTime": "2026-10-03T16:10:35.000+00:00",
                    "tzmode": null,
                    "gtqd": null,
                    "used": null
                  },
                  "operationLogList": null,
                  "exceptionInfo": null,
                  "hasLogisticOrder": false,
                  "logisticsType": null,
                  "logisticsTypeName": null,
                  "logisticsStatus": null,
                  "logisticsStatusName": null,
                  "lockerDisplay": null,
                  "splitPrescription": false,
                  "originalDoseCount": null,
                  "allocatedDoseCount": null,
                  "remainingDoseCount": null,
                  "executionList": null,
                  "prescriptionFile": null
                }
              ],
              "total": 66,
              "size": 10,
              "current": 1,
              "orders": [],
              "optimizeCountSql": true,
              "searchCount": true,
              "countId": null,
              "maxLimit": null,
              "pages": 7
            }
          }
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
