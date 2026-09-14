<template>
	<view class="container">
    <!-- 顶部导航栏 -->
		<view class="navbar">
			<view class="navbar-left" @click="navigateBack">
				<text class="back-icon">&lt;</text>
			</view>
			<view class="navbar-title">处方明细</view>
			<view class="navbar-right">
			</view>
		</view>

		<!-- 患者信息区域 -->
		<view class="patient-info">
			<view class="patient-header">
        <image class="patient-avatar" :src="`/static/${avatarImg}.png`"></image>
        <view class="patient-details">
					<view class="name-section">
						<view>
							<text
								class="patient-name">{{Object.keys(info).length? !eyeFlg ? '**' + info.userName.slice(-1) : info.userName : '***'}}</text>
							<uni-icons :type="eyeFlg ? 'eye' : 'eye-slash'" color="#fff" size="22"
								@tap="togEyeFun"></uni-icons>
						</view>
						<view class="basic-info-btn" @tap="toPageFun">地址管理</view>
					</view>
				</view>
			</view>
			<!-- 医院信息 -->
			<view class="hospital-info">
				<text class="hospital-name">{{ institutionInfo.jgmc }}</text>
				<text
					class="date">
          <uni-dateformat
              v-if="itemDt.prescriptionInfo.cfrqTime"
              :date="itemDt.prescriptionInfo.cfrqTime"
              :threshold="[0, 0]"
              format="yyyy-MM-dd hh:mm:ss"
          /></text>
			</view>
		</view>

		<!-- 标签页导航 -->
		<view class="tab-nav">
			<view class="tab-item" :class="{active: currentTab === '0'}" @click="currentTab = '0'">处方内容</view>
			<view class="tab-item" :class="{active: currentTab === '1'}" @click="currentTab = '1'">处方状态</view>
			<view class="tab-item" :class="{active: currentTab === '2'}" @click="currentTab = '2'">物流信息</view>
		</view>


		<!-- 标签页内容 -->
<!--		<view class="tab-content">-->
      <scroll-view scroll-y="true" class="tab-content">
        <h-watermark
            :title="institutionInfo.jgmc"
            :titleSize="12"
            :mobileSize="12"
            :appNameSize="12"
            :mobile="info.userName"
            :appName="watermark"
            titleColor="#666"
            appNameColor="#666"
            mobileColor="#666"
            :column="10"
            :rotate="-30">
        </h-watermark>

        <!-- 处方内容 -->
			<view v-if="currentTab === '0'" class="prescription-content">
				<view class="prescription-header">
					处方总贴数：<text class="num">{{ medicines.length }}</text>，单帖处方内容如下
          <view class="uni-share-image" @tap="togZFun">
            <SVE name="cunz" title="存证" ></SVE>
          </view>
				</view>
        <view v-if="medicines.length">
          <view class="medicine-table">
            <view class="medicine-row medicine-table-header">
              <text class="medicine-name">名称</text>
              <text class="medicine-dose">重量</text>
              <text class="medicine-trace">溯源</text>
            </view>
            <view class="medicine-row" v-for="(medicine, index) in medicines" :key="index">
              <text class="medicine-name">{{ medicine.ypmc || '-' }}</text>
              <text class="medicine-dose">{{ formatMedicineWeight(medicine) }}</text>
              <view class="medicine-trace">
                <text
                  v-if="medicine.qynbzsm || medicine.zsm || medicine.sccj && medicine.cpph"
                  class="trace-link"
                  @tap="gotoPageFun(medicine)"
                >溯源</text>
                <text v-else class="trace-disabled">-</text>
              </view>
            </view>
          </view>
        </view>
        <view v-else style="text-align: center;color: #d9d9d9;margin-top: 20%">
          <svg t="1776323976928" class="icon" viewBox="0 0 1561 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15500" width="200" height="200"><path d="M156.16 699.763h21.03a10.432 10.432 0 0 1 10.202 10.445c0 5.76-4.48 10.445-10.202 10.445h-21.03v21.094a10.432 10.432 0 0 1-10.406 10.24 10.227 10.227 0 0 1-10.42-10.24V720.64h-21.03a10.432 10.432 0 0 1-10.202-10.445c0-5.76 4.48-10.445 10.202-10.445h21.03v-21.094c0.128-5.683 4.736-10.24 10.42-10.24 5.747 0 10.406 4.506 10.406 10.24v21.107z m1374.208-83.558V595.11a10.291 10.291 0 0 0-10.406-10.24 10.432 10.432 0 0 0-10.42 10.24v21.095h-21.03a10.24 10.24 0 0 0-10.202 10.445c0 5.593 4.583 10.444 10.202 10.444h21.03v21.095c0 5.747 4.672 10.24 10.42 10.24a10.432 10.432 0 0 0 10.406-10.24v-21.095h21.03a10.266 10.266 0 0 0 10.202-10.444 10.432 10.432 0 0 0-10.202-10.445h-21.03zM773.965 960.858h-524.16a20.757 20.757 0 0 1-14.72-6.106 20.915 20.915 0 0 1 14.707-35.66h94.426a83.213 83.213 0 0 1-11.072-41.678V271.45a83.528 83.528 0 0 1 24.448-59.072 83.085 83.085 0 0 1 58.918-24.384h62.374v-20.992a83.629 83.629 0 0 1 24.448-59.06 83.085 83.085 0 0 1 58.932-24.384h499.532a83.046 83.046 0 0 1 58.944 24.372 83.584 83.584 0 0 1 24.436 59.072v605.964a83.251 83.251 0 0 1-11.098 41.677h115.174c11.52 0 20.852 9.28 20.852 20.89 0 11.52-9.268 20.89-20.826 20.89H999.424v20.991a83.251 83.251 0 0 1-11.098 41.677h11.162c11.456 0 20.762 9.267 20.762 20.877 0 11.533-9.434 20.89-20.762 20.89H889.946a41.754 41.754 0 0 1-6.4 50.867 41.472 41.472 0 0 1-58.88 0l-50.688-50.867z m76.134-41.767h66.202c22.912 0 41.472-18.598 41.472-41.881V270.464c0-22.566-17.984-40.704-40.18-40.704H414.977c-22.195 0-40.18 18.227-40.18 40.704V877.21c0 23.116 18.74 41.881 41.46 41.881h316.032l-10.7-10.752a41.78 41.78 0 0 1-10.817-40.384l-19.66-19.737a145.46 145.46 0 0 1-197.261-21.581c-49.984-57.895-46.976-144.666 6.886-198.938 54.029-54.4 140.8-57.6 198.656-7.321 57.869 50.265 67.11 136.883 21.158 198.297l19.674 19.738a41.408 41.408 0 0 1 40.256 10.841l69.606 69.837z m149.325-104.448h62.656a41.728 41.728 0 0 0 41.446-41.779v-605.76c0-23.142-18.56-41.78-41.446-41.78H561.971a41.728 41.728 0 0 0-41.433 41.78v20.89h395.52a83.046 83.046 0 0 1 58.93 24.37 83.584 83.584 0 0 1 24.436 59.086v543.193zM265.472 47.002h31.027c8.743 0 15.821 6.95 15.821 15.667a15.744 15.744 0 0 1-15.82 15.667h-31.028v31.104c0 8.78-6.938 15.872-15.616 15.872a15.693 15.693 0 0 1-15.616-15.872V78.336h-31.027a15.654 15.654 0 1 1 0-31.334h31.027v-31.13C234.24 7.104 241.178 0 249.856 0c8.614 0 15.616 7.104 15.616 15.872v31.13zM20.826 939.968c0-11.52 9.433-20.877 20.748-20.877H166.63c11.456 0 20.762 9.267 20.762 20.877 0 11.533-9.434 20.89-20.762 20.89H41.574a20.772 20.772 0 0 1-14.707-6.106 20.838 20.838 0 0 1-6.041-14.784zM677.44 804.954a104.691 104.691 0 0 0 26.957-100.903 104.294 104.294 0 0 0-73.626-73.856A103.898 103.898 0 0 0 530.19 657.23c-40.653 40.793-40.653 106.931 0 147.712a103.885 103.885 0 0 0 147.251 0zM458.074 313.318c0-11.52 9.305-20.864 20.8-20.876H707.93c11.494 0 20.812 9.344 20.812 20.876a20.864 20.864 0 0 1-20.812 20.89H478.886a20.736 20.736 0 0 1-14.732-6.093 20.864 20.864 0 0 1-6.08-14.797z m0 104.448c0-11.52 9.267-20.89 20.672-20.89h333.44a20.736 20.736 0 0 1 20.672 20.89c0 11.52-9.268 20.89-20.685 20.89h-333.44a20.8 20.8 0 0 1-20.672-20.89z m0 104.448c0-11.532 9.28-20.89 20.774-20.89h145.83c11.482 0 20.788 9.268 20.788 20.878 0 11.532-9.293 20.89-20.788 20.89h-145.83a20.672 20.672 0 0 1-14.72-6.106 20.838 20.838 0 0 1-6.054-14.784z m-395.61-125.35A62.426 62.426 0 0 1 8.371 365.53a62.848 62.848 0 0 1 0-62.656 62.426 62.426 0 0 1 54.093-31.335c34.496 0 62.464 28.058 62.464 62.656 0 34.611-27.968 62.669-62.464 62.669z m0-31.334a31.178 31.178 0 0 0 27.046-15.668 31.424 31.424 0 0 0 0-31.334 31.22 31.22 0 0 0-58.278 15.68 31.283 31.283 0 0 0 31.232 31.334z m1290.918-93.99c-34.496 0-62.464-28.058-62.464-62.67 0-34.61 27.968-62.668 62.464-62.668s62.464 28.057 62.464 62.668c0 34.612-27.968 62.67-62.464 62.67z m0-31.335c11.162 0 21.479-5.978 27.06-15.667a31.424 31.424 0 0 0 0-31.335 31.22 31.22 0 0 0-58.279 15.667 31.283 31.283 0 0 0 31.232 31.335z" p-id="15501"></path></svg>
        </view>
			</view>
			<!-- 处方状态 -->
       <view class="timelineBox" v-if="currentTab === '1'" >
         <view class="timeline" v-if="timelineData.length">
           <view v-for="(item, index) in timelineData" :key="index" class="timeline-item"
                 :class="{ 'active': index < 1 }">
             <view class="timeline-left">
               <text class="timeline-date" > <uni-dateformat
                   v-if="item.updateTimeShow"
                   :date="item.updateTimeShow"
                   :threshold="[0, 0]"
                   format="yyyy-MM-dd hh:mm:ss"
               /></text>
             </view>
             <view class="timeline-center">
               <view class="timeline-dot"></view>
               <view class="timeline-line" v-if="index < timelineData.length - 1"></view>
             </view>
             <view class="timeline-right">
               <view class="timeline-content">
                 <view class="flex">{{ item.ztmc }}</view>
                 <view v-if="configNameFlg" style="flex-direction: row;">
<!--                     <image class="patient-avatars" src="/static/b.png" @click="showPg(item.item)"></image>-->
                     <image
                         v-for="(w,wi) in item.fileList"
                         :key="wi" class="patient-avatars"
                         :src="formatImageUrl(w.filePath)"
                         @error="onImageError"
                         @click="showPg(item.fileList, wi)"></image>
<!--                   <img v-for="(w,wi) in item.fileList" :key="wi" class="patient-avatars" :src="formatImageUrl(w.filePath)" :alt="item.ztmc" @click="showPg(w.filePath)">-->
                 </view>
               </view>
             </view>
           </view>
         </view>
         <view v-else style="text-align: center;color: #d9d9d9;margin-top: 20%">
           <svg t="1776323976928" class="icon" viewBox="0 0 1561 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15500" width="200" height="200"><path d="M156.16 699.763h21.03a10.432 10.432 0 0 1 10.202 10.445c0 5.76-4.48 10.445-10.202 10.445h-21.03v21.094a10.432 10.432 0 0 1-10.406 10.24 10.227 10.227 0 0 1-10.42-10.24V720.64h-21.03a10.432 10.432 0 0 1-10.202-10.445c0-5.76 4.48-10.445 10.202-10.445h21.03v-21.094c0.128-5.683 4.736-10.24 10.42-10.24 5.747 0 10.406 4.506 10.406 10.24v21.107z m1374.208-83.558V595.11a10.291 10.291 0 0 0-10.406-10.24 10.432 10.432 0 0 0-10.42 10.24v21.095h-21.03a10.24 10.24 0 0 0-10.202 10.445c0 5.593 4.583 10.444 10.202 10.444h21.03v21.095c0 5.747 4.672 10.24 10.42 10.24a10.432 10.432 0 0 0 10.406-10.24v-21.095h21.03a10.266 10.266 0 0 0 10.202-10.444 10.432 10.432 0 0 0-10.202-10.445h-21.03zM773.965 960.858h-524.16a20.757 20.757 0 0 1-14.72-6.106 20.915 20.915 0 0 1 14.707-35.66h94.426a83.213 83.213 0 0 1-11.072-41.678V271.45a83.528 83.528 0 0 1 24.448-59.072 83.085 83.085 0 0 1 58.918-24.384h62.374v-20.992a83.629 83.629 0 0 1 24.448-59.06 83.085 83.085 0 0 1 58.932-24.384h499.532a83.046 83.046 0 0 1 58.944 24.372 83.584 83.584 0 0 1 24.436 59.072v605.964a83.251 83.251 0 0 1-11.098 41.677h115.174c11.52 0 20.852 9.28 20.852 20.89 0 11.52-9.268 20.89-20.826 20.89H999.424v20.991a83.251 83.251 0 0 1-11.098 41.677h11.162c11.456 0 20.762 9.267 20.762 20.877 0 11.533-9.434 20.89-20.762 20.89H889.946a41.754 41.754 0 0 1-6.4 50.867 41.472 41.472 0 0 1-58.88 0l-50.688-50.867z m76.134-41.767h66.202c22.912 0 41.472-18.598 41.472-41.881V270.464c0-22.566-17.984-40.704-40.18-40.704H414.977c-22.195 0-40.18 18.227-40.18 40.704V877.21c0 23.116 18.74 41.881 41.46 41.881h316.032l-10.7-10.752a41.78 41.78 0 0 1-10.817-40.384l-19.66-19.737a145.46 145.46 0 0 1-197.261-21.581c-49.984-57.895-46.976-144.666 6.886-198.938 54.029-54.4 140.8-57.6 198.656-7.321 57.869 50.265 67.11 136.883 21.158 198.297l19.674 19.738a41.408 41.408 0 0 1 40.256 10.841l69.606 69.837z m149.325-104.448h62.656a41.728 41.728 0 0 0 41.446-41.779v-605.76c0-23.142-18.56-41.78-41.446-41.78H561.971a41.728 41.728 0 0 0-41.433 41.78v20.89h395.52a83.046 83.046 0 0 1 58.93 24.37 83.584 83.584 0 0 1 24.436 59.086v543.193zM265.472 47.002h31.027c8.743 0 15.821 6.95 15.821 15.667a15.744 15.744 0 0 1-15.82 15.667h-31.028v31.104c0 8.78-6.938 15.872-15.616 15.872a15.693 15.693 0 0 1-15.616-15.872V78.336h-31.027a15.654 15.654 0 1 1 0-31.334h31.027v-31.13C234.24 7.104 241.178 0 249.856 0c8.614 0 15.616 7.104 15.616 15.872v31.13zM20.826 939.968c0-11.52 9.433-20.877 20.748-20.877H166.63c11.456 0 20.762 9.267 20.762 20.877 0 11.533-9.434 20.89-20.762 20.89H41.574a20.772 20.772 0 0 1-14.707-6.106 20.838 20.838 0 0 1-6.041-14.784zM677.44 804.954a104.691 104.691 0 0 0 26.957-100.903 104.294 104.294 0 0 0-73.626-73.856A103.898 103.898 0 0 0 530.19 657.23c-40.653 40.793-40.653 106.931 0 147.712a103.885 103.885 0 0 0 147.251 0zM458.074 313.318c0-11.52 9.305-20.864 20.8-20.876H707.93c11.494 0 20.812 9.344 20.812 20.876a20.864 20.864 0 0 1-20.812 20.89H478.886a20.736 20.736 0 0 1-14.732-6.093 20.864 20.864 0 0 1-6.08-14.797z m0 104.448c0-11.52 9.267-20.89 20.672-20.89h333.44a20.736 20.736 0 0 1 20.672 20.89c0 11.52-9.268 20.89-20.685 20.89h-333.44a20.8 20.8 0 0 1-20.672-20.89z m0 104.448c0-11.532 9.28-20.89 20.774-20.89h145.83c11.482 0 20.788 9.268 20.788 20.878 0 11.532-9.293 20.89-20.788 20.89h-145.83a20.672 20.672 0 0 1-14.72-6.106 20.838 20.838 0 0 1-6.054-14.784z m-395.61-125.35A62.426 62.426 0 0 1 8.371 365.53a62.848 62.848 0 0 1 0-62.656 62.426 62.426 0 0 1 54.093-31.335c34.496 0 62.464 28.058 62.464 62.656 0 34.611-27.968 62.669-62.464 62.669z m0-31.334a31.178 31.178 0 0 0 27.046-15.668 31.424 31.424 0 0 0 0-31.334 31.22 31.22 0 0 0-58.278 15.68 31.283 31.283 0 0 0 31.232 31.334z m1290.918-93.99c-34.496 0-62.464-28.058-62.464-62.67 0-34.61 27.968-62.668 62.464-62.668s62.464 28.057 62.464 62.668c0 34.612-27.968 62.67-62.464 62.67z m0-31.335c11.162 0 21.479-5.978 27.06-15.667a31.424 31.424 0 0 0 0-31.335 31.22 31.22 0 0 0-58.279 15.667 31.283 31.283 0 0 0 31.232 31.335z" p-id="15501"></path></svg>
         </view>
       </view>
			<!-- 物品信息 -->
        <view class="timelineBox" v-if="currentTab === '2'" >
          <view class="timeline" v-if="timelineDataB.length">
            <view v-for="(item, index) in timelineDataB" :key="index" class="timeline-item"
                  :class="{ 'active': index < 1 }">
              <view class="timeline-left OB">
                <view class="timeline-dot"></view>
                <view class="timeline-line" v-if="index < timelineDataB.length - 1"></view>
              </view>
              <view class="timeline-right">
                <text class="timeline-time">
                <uni-dateformat
                    v-if="item.updateTimeShow"
                    :date="item.updateTimeShow"
                    :threshold="[0, 0]"
                    format="yyyy-MM-dd hh:mm:ss"
                /></text>
                <text class="timeline-content OB">{{ item.context }}</text>
              </view>
            </view>
        </view>
          <view v-else style="text-align: center;color: #d9d9d9;margin-top: 20%">
            <svg t="1776323976928" class="icon" viewBox="0 0 1561 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15500" width="200" height="200"><path d="M156.16 699.763h21.03a10.432 10.432 0 0 1 10.202 10.445c0 5.76-4.48 10.445-10.202 10.445h-21.03v21.094a10.432 10.432 0 0 1-10.406 10.24 10.227 10.227 0 0 1-10.42-10.24V720.64h-21.03a10.432 10.432 0 0 1-10.202-10.445c0-5.76 4.48-10.445 10.202-10.445h21.03v-21.094c0.128-5.683 4.736-10.24 10.42-10.24 5.747 0 10.406 4.506 10.406 10.24v21.107z m1374.208-83.558V595.11a10.291 10.291 0 0 0-10.406-10.24 10.432 10.432 0 0 0-10.42 10.24v21.095h-21.03a10.24 10.24 0 0 0-10.202 10.445c0 5.593 4.583 10.444 10.202 10.444h21.03v21.095c0 5.747 4.672 10.24 10.42 10.24a10.432 10.432 0 0 0 10.406-10.24v-21.095h21.03a10.266 10.266 0 0 0 10.202-10.444 10.432 10.432 0 0 0-10.202-10.445h-21.03zM773.965 960.858h-524.16a20.757 20.757 0 0 1-14.72-6.106 20.915 20.915 0 0 1 14.707-35.66h94.426a83.213 83.213 0 0 1-11.072-41.678V271.45a83.528 83.528 0 0 1 24.448-59.072 83.085 83.085 0 0 1 58.918-24.384h62.374v-20.992a83.629 83.629 0 0 1 24.448-59.06 83.085 83.085 0 0 1 58.932-24.384h499.532a83.046 83.046 0 0 1 58.944 24.372 83.584 83.584 0 0 1 24.436 59.072v605.964a83.251 83.251 0 0 1-11.098 41.677h115.174c11.52 0 20.852 9.28 20.852 20.89 0 11.52-9.268 20.89-20.826 20.89H999.424v20.991a83.251 83.251 0 0 1-11.098 41.677h11.162c11.456 0 20.762 9.267 20.762 20.877 0 11.533-9.434 20.89-20.762 20.89H889.946a41.754 41.754 0 0 1-6.4 50.867 41.472 41.472 0 0 1-58.88 0l-50.688-50.867z m76.134-41.767h66.202c22.912 0 41.472-18.598 41.472-41.881V270.464c0-22.566-17.984-40.704-40.18-40.704H414.977c-22.195 0-40.18 18.227-40.18 40.704V877.21c0 23.116 18.74 41.881 41.46 41.881h316.032l-10.7-10.752a41.78 41.78 0 0 1-10.817-40.384l-19.66-19.737a145.46 145.46 0 0 1-197.261-21.581c-49.984-57.895-46.976-144.666 6.886-198.938 54.029-54.4 140.8-57.6 198.656-7.321 57.869 50.265 67.11 136.883 21.158 198.297l19.674 19.738a41.408 41.408 0 0 1 40.256 10.841l69.606 69.837z m149.325-104.448h62.656a41.728 41.728 0 0 0 41.446-41.779v-605.76c0-23.142-18.56-41.78-41.446-41.78H561.971a41.728 41.728 0 0 0-41.433 41.78v20.89h395.52a83.046 83.046 0 0 1 58.93 24.37 83.584 83.584 0 0 1 24.436 59.086v543.193zM265.472 47.002h31.027c8.743 0 15.821 6.95 15.821 15.667a15.744 15.744 0 0 1-15.82 15.667h-31.028v31.104c0 8.78-6.938 15.872-15.616 15.872a15.693 15.693 0 0 1-15.616-15.872V78.336h-31.027a15.654 15.654 0 1 1 0-31.334h31.027v-31.13C234.24 7.104 241.178 0 249.856 0c8.614 0 15.616 7.104 15.616 15.872v31.13zM20.826 939.968c0-11.52 9.433-20.877 20.748-20.877H166.63c11.456 0 20.762 9.267 20.762 20.877 0 11.533-9.434 20.89-20.762 20.89H41.574a20.772 20.772 0 0 1-14.707-6.106 20.838 20.838 0 0 1-6.041-14.784zM677.44 804.954a104.691 104.691 0 0 0 26.957-100.903 104.294 104.294 0 0 0-73.626-73.856A103.898 103.898 0 0 0 530.19 657.23c-40.653 40.793-40.653 106.931 0 147.712a103.885 103.885 0 0 0 147.251 0zM458.074 313.318c0-11.52 9.305-20.864 20.8-20.876H707.93c11.494 0 20.812 9.344 20.812 20.876a20.864 20.864 0 0 1-20.812 20.89H478.886a20.736 20.736 0 0 1-14.732-6.093 20.864 20.864 0 0 1-6.08-14.797z m0 104.448c0-11.52 9.267-20.89 20.672-20.89h333.44a20.736 20.736 0 0 1 20.672 20.89c0 11.52-9.268 20.89-20.685 20.89h-333.44a20.8 20.8 0 0 1-20.672-20.89z m0 104.448c0-11.532 9.28-20.89 20.774-20.89h145.83c11.482 0 20.788 9.268 20.788 20.878 0 11.532-9.293 20.89-20.788 20.89h-145.83a20.672 20.672 0 0 1-14.72-6.106 20.838 20.838 0 0 1-6.054-14.784z m-395.61-125.35A62.426 62.426 0 0 1 8.371 365.53a62.848 62.848 0 0 1 0-62.656 62.426 62.426 0 0 1 54.093-31.335c34.496 0 62.464 28.058 62.464 62.656 0 34.611-27.968 62.669-62.464 62.669z m0-31.334a31.178 31.178 0 0 0 27.046-15.668 31.424 31.424 0 0 0 0-31.334 31.22 31.22 0 0 0-58.278 15.68 31.283 31.283 0 0 0 31.232 31.334z m1290.918-93.99c-34.496 0-62.464-28.058-62.464-62.67 0-34.61 27.968-62.668 62.464-62.668s62.464 28.057 62.464 62.668c0 34.612-27.968 62.67-62.464 62.67z m0-31.335c11.162 0 21.479-5.978 27.06-15.667a31.424 31.424 0 0 0 0-31.335 31.22 31.22 0 0 0-58.279 15.667 31.283 31.283 0 0 0 31.232 31.335z" p-id="15501"></path></svg>
          </view>
			</view>
      </scroll-view>
<!--		</view>-->
	</view>
</template>

<script>
import SVE from '../evidence/sve'
import {cfListFun, configModuleFun, viewLogFun} from "../../request";
import request from '@/request/request';
	export default {
    components: {SVE},
		data() {
			return {
        request,
				currentTab: '0',
        avatarImg: '',
        watermark: '',
        configNameFlg: false,
				eyeFlg: false,
				info: {},
				timelineDataB: [
            {
						date: '2022-06-14',
						time: '15:17:37',
						content: '[上海市]您的快件已签收，如有疑问请联系快递员董海沥，联系电话15994334664。',
						isActive: true
					},
					{
						date: '2022-06-14',
						time: '15:17:37',
						content: '[上海市]您的快件正在派件，快递员董海沥，联系电话15994334664。',
						isActive: false
					},
					{
						date: '2022-06-14',
						time: '15:17:37',
						content: '您的快递已到达上海市',
						isActive: false
					},
					{
						date: '2022-06-14',
						time: '12:17:37',
						content: '您的快递已完成分拣，正在装车',
						isActive: false
					}
				],
				medicines: [],
				medicineUnits: [
					{ dicName: '克', dicValue: '1' },
					{ dicName: '包', dicValue: '2' },
					{ dicName: '帖', dicValue: '3' },
					{ dicName: '条', dicValue: '4' },
					{ dicName: '支', dicValue: '5' },
					{ dicName: '个', dicValue: '6' },
					{ dicName: '盒', dicValue: '7' },
					{ dicName: '对', dicValue: '8' },
					{ dicName: '瓶', dicValue: '9' },
					{ dicName: '袋', dicValue: '10' },
					{ dicName: '只', dicValue: '11' },
					{ dicName: '毫升', dicValue: '12' }
				],
				timelineData: [],
				institutionInfo: {},
				itemDt: {}
			};
		},
		onLoad(option) {
      this.avatarImg = uni.getStorageSync('userAvatar') || 'gb'
			this.info = uni.getStorageSync('userInfo') || {}
			const itemDt = uni.getStorageSync('prescriptionData') || {}
      this.currentTab = option.index || '0'
      cfListFun('detail?recordId=' + itemDt.prescriptionInfo.recordId).then(res => {
        if (res.code === 0) {
          this.itemDt = res.data ||{}
        }else {
          this.itemDt = Object.assign(itemDt, {})
        }
      }).finally(()=>{
        this.institutionInfo = this.itemDt.institutionInfo || {}
        this.timelineData = this.itemDt.statusList || []
        this.timelineDataB = this.itemDt.logisticDetailList || []
        this.timelineData.map(w=>{
          w.updateTimeShow = w.sjfssj ? this.formatDateString(w.sjfssj) : ''
          w.fileList = w.fileList ? w.fileList : []
        })
        this.timelineDataB.map(w=>{
          w.updateTimeShow = w.time ? this.formatDateString(w.time) : ''
        })
        this.medicines = this.itemDt.detailInfoList || []
        this.timelineData.sort((a, b) => a.updateTimeShow > b.updateTimeShow ? -1 : a.updateTimeShow < b.updateTimeShow ? 1 : 0)
        this.timelineDataB.sort((a, b) => a.updateTimeShow > b.updateTimeShow ? -1 : a.updateTimeShow < b.updateTimeShow ? 1 : 0)
        this.watermark = this.info.userName + this.formatDate()
        uni.onUserCaptureScreen(() => {
          console.log('用户执行了截屏操作');
          this.setViewLogFun(1)
        });
        let lastHeight = window.innerHeight
        window.addEventListener('resize', () => {
          if (window.innerHeight !== lastHeight) {
            this.setViewLogFun(1)
            lastHeight = window.innerHeight
          }
        })
        this.setViewLogFun(0)
        configModuleFun('get',{
          "moduleName" : "处方流转",
          "configGroup" : "患者端",
          "configName" :"显示代煎照片"
        }).then(res=>{
          this.configNameFlg = res.data === '0'
        })
      })
    },
    onUnload() {
      uni.offUserCaptureScreen();
    },
    onShow(){
      window.parent.postMessage({
        type: 'FROM_CHILD',
        payload: 'ssss',
        timestamp: new Date().toLocaleTimeString()
      }, '*');
    },
		methods: {
			formatMedicineWeight(medicine) {
				if (!medicine || medicine.zl === undefined || medicine.zl === null || medicine.zl === '') return '-'
				const unit = this.medicineUnits.find(item => String(item.dicValue) === String(medicine.ypdw))
				return String(medicine.zl) + (unit ? unit.dicName : '')
			},
      formatImageUrl(path){
        if (!path) return '';
        return path.startsWith('http') ? path : request.BASE_URL +'/prescription' + path;
      },
      onImageError(e) {
        console.log('图片加载失败详情:', e.detail.errMsg);
      },
      showPg(fileList,current){
      		  const dt = fileList.map(w=>{
      			  return request.BASE_URL +'/prescription' + w.filePath
      		  })
        uni.previewImage({
      			current: current,
          urls: dt // 必须是数组，即使单图也要用数组格式
        })
      },
      setViewLogFun(viewType){
        viewLogFun('add', {
          "userName": this.info.userName, //登录用户名
          "recordId": this.info.recordId, //处方号 ，如果是详情才有，列表没有传空
          "recordName": "中药处方", //中药处方写死
          "patientName": this.itemDt.patientInfo.hzxm, //患者姓名
          "userAccount": this.info.userName, //登录账号名
          "viewChannel": "公众号", //公众号写死
          "patientIdCard": this.info.idCard, //患者身份证号
          "hospitalName": this.institutionInfo.jgmc,//医疗机构名
          "visitType": this.itemDt.prescriptionInfo.mzzybz, // 1是门诊 2是住院，如果是详情才有，列表没有传空
          "viewType": viewType,  // 0 是查看 1是截屏
          "visitNo": null, //传空
          "fileDept": this.itemDt.prescriptionInfo.ksmc, //科室，如果是详情才有，列表没有传空
          "fileType": "详情", //点详情传详情，点列表传列表
          "hospitalId": this.institutionInfo.jgdm //医疗机构代码
        }).then(res=>{
          console.log(res, 'res');
        })
      },
      formatDate(dat) {
        const date = dat ? dat : new Date()
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const h = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const s = String(date.getSeconds()).padStart(2, '0');
        return `${y}-${m}-${d} ${h}:${min}:${s}`;
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
			toPageFun() {
				uni.navigateTo({
					url: '/pages/address/index'
				})
			},
      togZFun() {
        uni.navigateTo({
					url: '/pages/evidence/index?hx='+ this.itemDt.prescriptionInfo.transHash
				})
			},
			navigateBack() {
				uni.navigateBack({
					delta: 1
				});
			},
			gotoPageFun(data) {
				if(data.qynbzsm || data.zsm || data.sccj && data.cpph){
          uni.setStorageSync('yp_source', data);
				uni.navigateTo({
					url: '/pages/source/index'
				})
				}
			},
			togEyeFun() {
				this.eyeFlg = !this.eyeFlg
			},
		}
	};
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
	}

	.navbar-left {
		width: 80rpx;
	}

	.back-icon {
    font-size: 60rpx;
    color: white;
    font-weight: bold;
    position: absolute;
    left: 26px;
    top: -2px;
	}

	.navbar-title {
		font-size: 36rpx;
		font-weight: 500;
	}

	.navbar-right {
		width: 80rpx;
		display: flex;
		justify-content: flex-end;
	}

	.star-icon {
		font-size: 32rpx;
	}

	/* 患者信息区域 */
	.patient-info {
		background-color: #1890ff;
		padding: 30rpx;
		color: #fff;
		position: relative;
	}

	.patient-header {
		display: flex;
		margin-bottom: 30rpx;
	}

	.patient-avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		//background-color: rgba(255, 255, 255, 0.2);
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
		margin-bottom: 10rpx;
		height: 100%;
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

	/* 医院信息 */
	.hospital-info {
		background-color: rgba(255, 255, 255, 0.15);
		border-radius: 20rpx;
		padding: 20rpx;
		width: 90%;
		margin: 0 auto;
	}

	.hospital-name {
		display: block;
		font-size: 28rpx;
		font-weight: 500;
		margin-bottom: 10rpx;
	}

	.date {
		font-size: 26rpx;
		opacity: 0.8;
	}

	/* 标签页导航 */
	.tab-nav {
		display: flex;
		background-color: #fff;
		//margin-bottom: 30rpx;
		/* border-bottom: 1rpx solid #f0f0f0; */
	}

	.tab-item {
		flex: 1;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #666;
		position: relative;
	}

	.tab-item.active {
		color: #1890ff;
		font-weight: 500;
	}

	.tab-item.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 25%;
		width: 50%;
		height: 4rpx;
		background-color: #1890ff;
	}

	/* 标签页内容 */
	.tab-content {
    height: calc(100vh - 540rpx)
	}

	.tab-pane {
		padding: 30rpx;
		min-height: 600rpx;
	}

	/* 处方内容 */
	.prescription-content {
		padding: 0 30rpx 30rpx;
	}

	.prescription-header {
		font-size: 26rpx;
		color: #666;
    padding: 30rpx 0;
    position: relative;
    .num {
      color: red;
    }
    .uni-share-image {
      position: absolute;
      right: 0;
      top: 20rpx;
      z-index: 999;
    }
	}

	/* 药材列表 */
	.medicine-table {
		background: #fff;
		border: 1rpx solid #e5e5e5;
		border-radius: 8rpx;
		overflow: hidden;
	}

	.medicine-row {
		display: flex;
		align-items: center;
		min-height: 88rpx;
		border-bottom: 1rpx solid #ededed;
		font-size: 26rpx;
		color: #333;

		&:last-child {
			border-bottom: none;
		}
	}

	.medicine-table-header {
		min-height: 76rpx;
		background: #fafafa;
		color: #666;
		font-size: 24rpx;
	}

	.medicine-name {
		flex: 1;
		padding: 18rpx 20rpx;
		word-break: break-all;
	}

	.medicine-dose {
		width: 160rpx;
		padding: 18rpx 10rpx;
		text-align: center;
		color: #555;
	}

	.medicine-trace {
		width: 130rpx;
		padding: 18rpx 10rpx;
		text-align: center;
	}

	.trace-link {
		color: #1890ff;
	}

	.trace-disabled {
		color: #bbb;
	}

	.timelineBox {
		padding-top: 30rpx;
  }

	.timeline {
    padding-top: 30rpx;
    background-color: #fff;
  }

	.timeline-item {
		display: flex;
		position: relative;
    padding: 0 30rpx 25rpx 30rpx;
	}

	.timeline-left {
		width: 140rpx;
		flex-shrink: 0;
		margin-right: 20rpx;

		&.OB {
			width: 40rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			.timeline-line {
				flex: 1;
			}
		}
	}

	.timeline-date {
		display: block;
		font-size: 24rpx;
		color: #666;
		margin-bottom: 4rpx;
	}

	.timeline-time {
		display: block;
		font-size: 22rpx;
		color: #999;
	}

	.timeline-center {
		width: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-right: 20rpx;
	}

	.timeline-dot {
		width: 22rpx;
		height: 22rpx;
		border-radius: 50%;
		background-color: #d9d9d9;
		position: relative;
		z-index: 1;
	}

	.timeline-line {
		flex: 1;
		width: 2rpx;
		background-color: #d9d9d9;
		margin-top: 4rpx;
	}

	.timeline-right {
		flex: 1;
	}

	.timeline-content {
		background-color: #f0f0f0;
		padding: 20rpx;
		border-radius: 8rpx;
		font-size: 26rpx;
		color: #333;
		position: relative;
		text-align: justify;
    display: flex;
    flex-direction: row;
    align-items: center;
    .patient-avatars {
      width: 36rpx;
      height: 36rpx;
      cursor: pointer;
      margin-left: 10rpx;
    }
		&.OB {
			background: none;
		}
	}

	/* 激活状态 */
	.timeline-item.active .timeline-dot {
		background-color: #1890ff;
		width: 20rpx;
		height: 20rpx;
	}

	.timeline-item.active .timeline-content {
		background-color: #e6f7ff;
		color: #1890ff;

		&.OB {
			background: none;
		}
	}

	.timeline-item.active .timeline-date {
		color: #1890ff;
		font-weight: 500;
	}

	.timeline-item.active .timeline-time {
		color: #69c0ff;
	}

	.timeline-item.active .timeline-line {
		background-color: #1890ff;
	}

	/* 最后一个节点 */
	.timeline-item:last-child .timeline-line {
		display: none;
	}
</style>
