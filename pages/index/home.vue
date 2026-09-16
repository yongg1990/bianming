<template>
  <view class="page">
    <!-- 顶部导航 -->
    <view class="navbar">
      <view class="navbar-left" @click="navigateBack">
        <text class="back-icon">&lt;</text>
      </view>
      <view class="navbar-title">处方处理流程</view>
      <view class="navbar-right"></view>
    </view>
    <!-- 问候 -->
    <view class="welcome">
      <view class="person-icon">
        <view class="person-head"></view>
        <view class="person-body"></view>
      </view>
      <view>
        <view class="welcome-title">尊敬的患者您好：</view>
        <view class="welcome-desc">您的处方正在处理中，以下是当前进度：</view>
      </view>
    </view>

    <view class="content" v-if="Object.keys(prescription).length">
      <!-- 处方信息 -->
      <scroll-view scroll-y="true" class="tab-content">
      <view class="info-card">
        <view class="info-row">
          <text class="info-icon">⌂</text>
          <view class="info-main">
            <text class="info-label">就诊机构</text>
            <text class="info-value">{{ prescription.institutionInfo ? prescription.institutionInfo.jgmc : '' }}</text>
          </view>
        </view>
        <view class="info-row">
          <text class="info-icon document-icon">▤</text>
          <view class="info-main">
            <text class="info-label">处方号</text>
            <text class="info-value">{{ prescription.prescriptionInfo.yncfbh ? prescription.prescriptionInfo.yncfbh.split('.')[0] : '' }}</text>
          </view>
        </view>
        <view class="info-row no-border">
          <text class="info-icon location-icon">◎</text>
          <view class="info-main">
            <text class="info-label">配送地址</text>
            <text class="info-value address">
              {{ prescription.consigneeInfo ? prescription.consigneeInfo.shrdzsheng + prescription.consigneeInfo.shrdzshi + prescription.consigneeInfo.shrdzxian + prescription.consigneeInfo.shrdzxxdz : '' }}
            </text>
          </view>
        </view>
      </view>
      <view class="section-title">处理流程</view>
      <view v-if="splitPrescription && executionList.length" class="execution-switch">
        <scroll-view scroll-x="true" class="execution-tabs-scroll" :show-scrollbar="false">
          <view class="execution-tabs">
            <view
              v-for="(execution, index) in executionList"
              :key="execution.recordId || index"
              class="execution-tab"
              :class="{ active: currentExecutionIndex === index }"
              @tap="selectExecution(index)"
            >
              {{ getExecutionTabText(execution, index) }}
            </view>
          </view>
        </scroll-view>
        <view class="execution-tip">
          <uni-icons type="info-filled" color="#1890ff" size="16"></uni-icons>
          <text>当前展示{{ getExecutionTabText(currentExecution, currentExecutionIndex) }}处方的处理流程</text>
        </view>
      </view>
        <view class="timeline" v-if="currentStatusList.length">
          <view class="timeline-line"></view>
          <view class="timeline-item" v-for="(k, i) in currentStatusList" :key="i"
                :class="{'active-item' : isProcessingStatus(k) && i >= currentStatusList.length - 1}">
            <view class="active-line" v-if="isProcessingStatus(k) && i >= currentStatusList.length - 1"></view>
            <view class="timeline-dot"
                :class="{
              done: i < currentStatusList.length -1,
              'active-dot': i >= currentStatusList.length -1,
               'muted-dot': isLogisticsStatus(k)}">
              {{ isProcessingStatus(k) && i >= currentStatusList.length - 1 ? '▣' : '✓'}}
            </view>
            <view class="step-card"
                  :class="{
              'active-card': i >= currentStatusList.length -1 }">
              <view class="step-head">
                <text class="step-title">{{ i + 1 }}. {{k.ztmc}}</text>
                <text class="status " :class="{
              finished: i < currentStatusList.length -1,
              'processing': i >= currentStatusList.length -1 }">
                  {{ isProcessingStatus(k) && i >= currentStatusList.length - 1 ? '进行中' : '已完成'}}
                </text>
              </view>
              <text class="step-desc">{{ k.sjfssj ? formatDateString(k.sjfssj) : '' }}</text>
            </view>
            <view v-if="isLogisticsStatus(k) && currentLogisticDetailList.length" class="logistics-card">
              <view class="logistics-head">
                <view class="logistics-title">
                  <text class="truck-icon">▣</text>
                  <text>物流轨迹</text>
                </view>
                <view style="flex-direction: row;display: flex;align-items: center">
                  <text class="delivery-name">{{ getLogisticCompany(currentLogisticInfo) }}</text>
                  <uni-icons :type="kdgsmcFlg ? 'down' : 'up'" color="#676c6f"  size="16" style="cursor: pointer" @tap="kdgsmcFlg = !kdgsmcFlg"></uni-icons>
                </view>
              </view>

              <view class="track-list" v-if="!kdgsmcFlg">
                <view class="track-item" v-for="(k, i) in currentLogisticDetailList" :key="i" :class="{last: i >= currentLogisticDetailList.length - 1}">
                  <view class="track-dot " :class="{latest: i >= currentLogisticDetailList.length - 1}"></view>
                  <view>
                    <text class="track-title">{{ k.context }}</text>
                    <text class="track-time"> {{ k.time ? formatDateString(k.time) : '' }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
<!--          <view class="timeline-item">-->
<!--            <view class="timeline-dot pending-dot">◎</view>-->
<!--            <view class="step-card pending-card">-->
<!--              <view class="step-head">-->
<!--                <text class="step-title">4. 签收</text>-->
<!--                <text class="status pending">待处理</text>-->
<!--              </view>-->
<!--              <text class="step-desc">请保持手机畅通，注意查收配送员电话。</text>-->
<!--            </view>-->
<!--          </view>-->
        </view>
      <button class="detail-button" @click="togPage">
        <text>查看详细进度</text>
      </button>
<!--      <view class="service-tip">如有疑问请联系客服热线 400-XXX-XXXX</view>-->
      </scroll-view>
    </view>
  </view>
</template>

<script>
import {cfListFun} from "../../request";

export default {
  name: 'PrescriptionProcess',
  props:{
    prescription: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  data() {
    return {
      kdgsmcFlg: false,
      currentExecutionIndex: 0
    }
  },
  computed: {
    splitPrescription() {
      return this.prescription && this.prescription.splitPrescription === true
    },
    executionList() {
      if (!this.splitPrescription || !Array.isArray(this.prescription.executionList)) return []
      return this.prescription.executionList.slice().sort((a, b) => Number(a.executionNo || 0) - Number(b.executionNo || 0))
    },
    currentExecution() {
      return this.executionList[this.currentExecutionIndex] || {}
    },
    currentStatusList() {
      return this.splitPrescription
        ? (Array.isArray(this.currentExecution.statusList) ? this.currentExecution.statusList : [])
        : (Array.isArray(this.prescription.statusList) ? this.prescription.statusList : [])
    },
    currentLogisticDetailList() {
      return this.splitPrescription
        ? (Array.isArray(this.currentExecution.logisticDetailList) ? this.currentExecution.logisticDetailList : [])
        : (Array.isArray(this.prescription.logisticDetailList) ? this.prescription.logisticDetailList : [])
    },
    currentLogisticInfo() {
      if (!this.splitPrescription) return this.prescription.logisticInfo || {}
      const logisticList = this.currentExecution.logisticList
      if (Array.isArray(logisticList) && logisticList.length) {
        return logisticList[0].logisticInfo || logisticList[0] || {}
      }
      return this.currentExecution.logisticInfo || {}
    }
  },
  watch: {
    prescription: {
      deep: true,
      handler() {
        this.currentExecutionIndex = 0
        this.kdgsmcFlg = false
      }
    }
  },
  methods:{
    selectExecution(index) {
      this.currentExecutionIndex = index
      this.kdgsmcFlg = false
    },
    isProcessingStatus(item) {
      return Number(item && item.ztbm) < 11
    },
    isLogisticsStatus(item) {
      return String(item && item.ztbm) === '9'
    },
    getLogisticCompany(logistic) {
      return logistic.kdgsmc || logistic.logisticCompanyName || logistic.logisticsCompany || logistic.companyName || ''
    },
    getExecutionTabText(execution, index) {
      const no = execution.executionNo || index + 1
      const date = this.getExecutionDate(execution)
      return '第' + no + '次' + (date ? '  ' + date : '')
    },
    getExecutionDate(execution) {
      const statusList = Array.isArray(execution.statusList) ? execution.statusList : []
      const logisticDetailList = Array.isArray(execution.logisticDetailList) ? execution.logisticDetailList : []
      const value = execution.sendTime || execution.downloadTime ||
        (statusList[0] && statusList[0].sjfssj) ||
        (logisticDetailList[0] && logisticDetailList[0].time) || ''
      const date = this.normalizeBackendDate(value)
      const match = date.match(/^(\d{4})-(\d{2})-(\d{2})/)
      return match ? match[2] + '-' + match[3] : ''
    },
    normalizeBackendDate(value) {
      if (!value) return ''
      const date = String(value)
      if (/^\d{8}\/\d{6}$/.test(date)) return this.formatDateString(date)
      if (/^\d{14}$/.test(date)) return this.formatDateString(date.slice(0, 8) + '/' + date.slice(8))
      return date
    },
    navigateBack() {
      this.$emit('backFun')
      },
    togPage(){
      uni.navigateTo({
        url: '/pages/prescriptionDtl/index?index=1'
      })
      this.$emit('backFun')
    },
    formatDateString(dateStr) {
      const datePart = dateStr.substring(0, 8);
      const timePart = dateStr.substring(9, 15);
      const year = datePart.substring(0, 4);
      const month = datePart.substring(4, 6);
      const day = datePart.substring(6, 8);
      const hour = timePart.substring(0, 2);
      const minute = timePart.substring(2, 4);
      const second = timePart.substring(4, 6);
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    },
    },
}
</script>

<style scoped>
page {
  background: #f5f6f6;
}

.page {
  min-height: 100vh;
  color: #30343b;
  background: #f5f6f6;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC",
  "Microsoft YaHei", sans-serif;
}

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
  top: 4px;
  color: #fff;
}

.navbar-title {
  font-size: 36rpx;
  font-weight: 500;
}

.navbar-right {
  width: 80rpx;
}

.welcome {
  padding: 26rpx 36rpx 20rpx;
  display: flex;
  align-items: flex-start;
  background: #effbf4;
  box-sizing: border-box;
}

.person-icon {
  position: relative;
  width: 34rpx;
  height: 42rpx;
  margin: 2rpx 22rpx 0 0;
  flex-shrink: 0;
}

.person-head {
  width: 12rpx;
  height: 12rpx;
  margin: 0 auto;
  border: 3rpx solid #45996c;
  border-radius: 50%;
  box-sizing: border-box;
}

.person-body {
  width: 25rpx;
  height: 16rpx;
  margin: 6rpx auto 0;
  border: 3rpx solid #45996c;
  border-bottom: 0;
  border-radius: 14rpx 14rpx 0 0;
  box-sizing: border-box;
}

.welcome-title {
  margin-bottom: 10rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: #293039;
}

.welcome-desc {
  color: #879097;
  font-size: 23rpx;
  line-height: 32rpx;
}

.content {
  height: calc(100vh - 220rpx);
  padding: 28rpx 28rpx 34rpx;
}
.tab-content {
  height: 100%;
}

.info-card {
  padding: 8rpx 28rpx;
  background: #ffffff;
  border-radius: 20rpx;
  box-shadow: 0 3rpx 12rpx rgba(34, 47, 43, 0.04);
}

.info-row {
  display: flex;
  padding: 22rpx 0;
  border-bottom: 1rpx solid #eceeef;
}

.info-row.no-border {
  border-bottom: 0;
}

.info-icon {
  width: 36rpx;
  margin: 2rpx 18rpx 0 0;
  flex-shrink: 0;
  color: #4ba173;
  font-size: 31rpx;
  line-height: 32rpx;
  text-align: center;
}

.document-icon {
  font-size: 27rpx;
}

.location-icon {
  font-size: 30rpx;
}

.info-main {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
}

.info-label {
  margin-bottom: 8rpx;
  color: #768087;
  font-size: 24rpx;
  line-height: 28rpx;
}

.info-value {
  color: #424851;
  font-size: 26rpx;
  line-height: 40rpx;
}

.info-value.address {
  text-align: justify;
}

.section-title {
  margin: 22rpx 0;
  color: #343a42;
  font-size: 29rpx;
  font-weight: 600;
}

.execution-switch {
  margin-bottom: 22rpx;
}

.execution-tabs-scroll {
  width: 100%;
  white-space: nowrap;
}

.execution-tabs {
  display: flex;
  gap: 12rpx;
  min-width: 100%;
}

.execution-tab {
  flex: 1;
  min-width: 220rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  color: #666;
  background: #ffffff;
  border-radius: 8rpx;
  font-size: 24rpx;
}

.execution-tab.active {
  color: #ffffff;
  background: #1890ff;
}

.execution-tip {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-top: 16rpx;
  padding: 14rpx 18rpx;
  color: #4285c5;
  background: #eef7ff;
  border-radius: 8rpx;
  font-size: 22rpx;
}

.timeline {
  position: relative;
}

.timeline-line {
  position: absolute;
  top: 30rpx;
  bottom: 64rpx;
  left: 21rpx;
  width: 3rpx;
  background: #dfe3e5;
}

.timeline-item {
  position: relative;
  /*display: flex;*/
  /*align-items: flex-start;*/
  margin-bottom: 22rpx;
  padding-left: 68rpx;
}

.timeline-dot {
  position: absolute;
  z-index: 2;
  left: 2rpx;
  top: 26rpx;
  width: 38rpx;
  height: 38rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-sizing: border-box;
  font-size: 20rpx;
  font-weight: 600;
}

.timeline-dot.done,
.muted-dot {
  color: #ffffff;
  background: #aeb5bf;
  border: 5rpx solid #f5f6f6;
}

.step-card,
.logistics-card {
  width: 100%;
  padding: 23rpx 26rpx;
  background: #ffffff;
  border-radius: 18rpx;
  box-sizing: border-box;
  box-shadow: 0 4rpx 12rpx rgba(34, 47, 43, 0.06);
}

.step-head,
.logistics-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.step-title {
  color: #333941;
  font-size: 29rpx;
  line-height: 38rpx;
  font-weight: 600;
}

.step-desc {
  display: block;
  margin-top: 10rpx;
  color: #808990;
  font-size: 22rpx;
  line-height: 32rpx;
}

.status {
  min-width: 78rpx;
  padding: 5rpx 13rpx;
  color: #ffffff;
  border-radius: 20rpx;
  font-size: 20rpx;
  line-height: 26rpx;
  text-align: center;
  box-sizing: border-box;
}

.finished {
  background: #aab0ba;
}

.processing {
  background: #58c86f;
}

.active-item {
  margin-top: 4rpx;
  margin-bottom: 28rpx;
}

.active-line {
  position: absolute;
  left: 20rpx;
  top: 42rpx;
  width: 4rpx;
  height: 76rpx;
  background: #43d267;
  box-shadow: 0 0 10rpx rgba(67, 210, 103, 0.4);
}

.active-dot {
  top: 22rpx;
  color: #ffffff;
  background: #50d06d;
  border: 7rpx solid #c9f5d3;
  box-shadow: 0 0 10rpx rgba(74, 206, 105, 0.35);
}

.active-card {
  background: #f3fff6;
  border-left: 6rpx solid #4dca6b;
}

.logistics-item .muted-dot {
  top: 22rpx;
}

.logistics-card {
  margin-top: 26rpx;
  padding: 22rpx 25rpx 14rpx;
}

.logistics-head {
  padding-bottom: 17rpx;
  border-bottom: 1rpx solid #edf0ef;
}

.logistics-title {
  display: flex;
  align-items: center;
  color: #2f363d;
  font-size: 25rpx;
  font-weight: 600;
}

.truck-icon {
  margin-right: 12rpx;
  color: #4aaa70;
  font-size: 25rpx;
}

.delivery-name {
  color: #676c6f;
  font-size: 20rpx;
  margin-right: 5rpx;
}

.track-list {
  padding-top: 17rpx;
}

.track-item {
  position: relative;
  display: flex;
  padding: 0 0 17rpx 35rpx;
}

.track-item::before {
  position: absolute;
  top: 15rpx;
  bottom: -6rpx;
  left: 8rpx;
  width: 2rpx;
  background: #e2e6e5;
  content: "";
}

.track-item.last::before {
  display: none;
}

.track-dot {
  position: absolute;
  z-index: 1;
  top: 8rpx;
  left: 1rpx;
  width: 14rpx;
  height: 14rpx;
  background: #aeb5bf;
  border: 4rpx solid #ffffff;
  border-radius: 50%;
}

.track-dot.latest {
  background: #54d071;
}

.track-title,
.track-desc,
.track-time {
  display: block;
}

.track-title {
  margin-bottom: 6rpx;
  color: #3f464c;
  font-size: 21rpx;
  line-height: 28rpx;
  font-weight: 500;
  text-align: justify;
}

.track-desc {
  color: #818a91;
  font-size: 20rpx;
  margin: 3rpx 0;
  line-height: 26rpx;
}

.track-time {
  color: #818a91;
  font-size: 20rpx;
  line-height: 25rpx;
}

.pending-dot {
  top: 23rpx;
  color: #f5ad2f;
  background: #ffffff;
  border: 4rpx solid #f5ad2f;
}

.pending-card {
  background: #fffdf5;
  border-left: 5rpx solid #f3b33d;
}

.pending {
  background: #f1ad32;
}

.detail-button {
  height: 92rpx;
  margin: 36rpx 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: #1890ff;
  border: 0;
  border-radius: 18rpx;
  font-size: 31rpx;
  font-weight: 600;
  line-height: 92rpx;
  letter-spacing: 2rpx;
}

.detail-button::after {
  border: 0;
}

.button-arrow {
  margin-left: 18rpx;
  font-size: 40rpx;
  font-weight: 400;
  transform: translateY(-2rpx);
}

.service-tip {
  padding: 24rpx 0 10rpx;
  color: #798086;
  font-size: 24rpx;
  text-align: center;
}
</style>
