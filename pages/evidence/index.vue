<template>
	<view class="container">
		<!-- 顶部导航栏 -->
		<view class="navbar">
			<view class="back-btn" @click="navigateBack">
				<text class="back-icon">&lt;</text>
			</view>
			<view class="navbar-title">{{navbarTitle}}</view>
			<view class="navbar-right"></view>
		</view>
		<!-- 溯源信息卡片 -->
		<view class="info-card" v-if="false">
			<view class="card-header flexR ter">
				<view class="card-title flexR ter">
					<SVE name="cunzheng" title="电子处方存证" width="20" height="20"></SVE>
					<text class="tit_txt">电子处方存证</text>
				</view>
<!--				<view class="flexR ter shad">-->
<!--					<SVE name="yishanglian" title="已上链" width="15" height="15"></SVE>-->
<!--					<text class="nclr">已上链</text>-->
<!--				</view>-->
			</view>
			<view class="card-content-Box">
				<view class="card-content">
					<view class="info-item">
						<text class="info-label">存在哈希（TxID）</text>
						<text class="info-value">0cs151r21...fd25sd1</text>
					</view>
<!--					<view class="info-item">-->
<!--						<text class="info-label">区块高度</text>-->
<!--						<text class="info-value">#1,265,673</text>-->
<!--					</view>-->
					<view class="info-item">
						<text class="info-label">存证时间</text>
						<text class="info-value">2025-03-21 14:32:18 (UTC+8 )</text>
					</view>
					<view class="info-item">
						<text class="info-label">存证机构</text>
						<text class="info-value">省级中药流转联盟链</text>
					</view>
				</view>
<!--        <view class="verify-btn flexR ter" >-->
<!--          <SVE name="yanz" title="验证区块链存证真实性" width="16" height="16"></SVE>-->
<!--          <text class="btn-text">验证区块链存证真实性</text>-->
<!--        </view>-->
<!--        <view class="verify-tip card-content" >-->
<!--          <text class="Rx-text">℞</text>-->
<!--          <text class="card-title">处方摘要：黄芪15g，当归10g，白术12g，甘草6g，陈皮8g，升麻6g，柴胡6g，党参12g(共8味) | 中医证候：补中益气</text>-->
<!--        </view>-->
			</view>
		</view>
		<!-- 饮片流通卡片 -->
		<view class="info-card" v-if="false">
      <view class="card-header flexR ter">
        <view class="card-title flexR ter">
          <SVE name="quanliuc" title="全流程溯源" width="20" height="20"></SVE>
          <text class="tit_txt">全流程溯源</text>
        </view>
        <view class="flexR ter shad">
          <SVE name="zhuiz" title="实时追踪" width="15" height="15"></SVE>
          <text class="nclr">实时追踪</text>
        </view>
      </view>
			<view class="card-content-Box">
				<view class="card-item flexR" v-for="(k, i) in imageList" :key="i">
          <view class="itm-left flexC ter">
            <view class="lft-log">
              <SVE :name="k.icon" :title="k.title" width="22" height="22"></SVE>
            </view>
            <view class="lft-line flex"></view>
          </view>
          <view class="itm-right flex">
            <view class="rt-titBox flexR ter">
              <view class="rt-tit flex flexR ter">
                <view class="rt-tit-tet">{{ k.title }}</view>
                <SVE :name="i < imageList.length - 1 ? 'chengg' : 'loading'" width="18" height="18"></SVE>
              </view>
              <view class="rt-time">{{ k.time }} <text style="color: #3cc51f">{{k.tip}}</text></view>
            </view>
            <view class="rt-dec">{{ k.content }}</view>
            <view class="rt-czhx flexR ter shad">
              <SVE name="shanglian" title="存证指纹" width="14" height="14"></SVE>
              <text class="nclr">存证指纹：{{ k.proofIndex }}</text>
            </view>
          </view>
        </view>
        <view class="flexR endLcBox ter">
          <view>
            <SVE name="wuliu" title="实时追踪" width="28" height="28"></SVE>
          </view>
          <view class="tip-ter">
            <text class="tip-ter-tit">当前物流状态:</text>
            药厂已发货，顺丰医药专递已揽件·预计 03月23日18:00前送达</view>
          <view class="tip-lian">温控数据已上链</view>
        </view>
        <view class="endBox flexR ter ">
          <SVE name="shujuku" width="16" height="16"></SVE>
          所有节点数据均经过区块链存证，不可算改.联盟链共识
        </view>
			</view>
		</view>
    <view class="zs_box">
      <view class="bgbox">
        <view class='zs_tit'>证书</view>
        <view class='flexR  zs_list' v-for='(k, l) in serviceFlg ? resultArray : zsList' :key='l' :class="{on: serviceFlg}">
          <view class='list_name'>{{ k.name }}</view>
          <div class='list_val flex' v-if='serviceFlg' style="margin-left: 3px;text-align: justify">{{ k.value }}</div>
          <div class='list_val flex' v-if='!serviceFlg && !k.setK && !k.setV && !k.slot && !k.setT '>{{ cfDtl.prescriptionInfo ? cfDtl.prescriptionInfo[k.val] : '' }}</div>
          <div class='list_val flex' v-if='k.setV'>{{  cfDtl[k.setV] ? cfDtl[k.setV][k.val] : '' }}</div>
          <div class='list_val flex' v-if='k.slot'>{{ cfDtl.prescriptionInfo ? mzzybz[cfDtl.prescriptionInfo[k.val]] : '' }}</div>
          <div class='list_val flex' v-if='k.setT'>{{ cfDtl.prescriptionInfo ? getTime(cfDtl.prescriptionInfo[k.val]) : '' }}</div>
        </view>
      </view>
    </view>
	</view>
</template>

<script>
	import SVE from './sve'
  import {cfListFun, statisticFun} from "../../request";
	export default {
		components: {
			SVE
		},
		data() {
			return {
				sourceName: '',
        navbarTitle: '存证溯源',
        cfDtl: {},
        resultArray: [],
        zsList: [
          {
            name: '处方编号：',
            val: 'yncfbh'
          },
          {
            name: '处方日期：',
            val: 'cfrqTime',
            setT: '1'
          },
          {
            name: '存证哈希：',
            val: 'transHash'
          },
          {
            name: '存证时间：',
            val: 'transTime'
          },
          {
            name: '就诊医院：',
            setV: 'institutionInfo',
            val: 'jgmc'
          },
          {
            name: '代煎企业：',
            val: 'ypcdm'
          },
          {
            name: '患者姓名：',
            val: 'hzxm'
          },
          {
            name: '门诊类型：',
            slot: 'mzzybz',
            val: 'mzzybz'
          },
          {
            name: '就诊科室：',
            val: 'ksmc'
          },
          {
            name: '提交时间：',
            setT: '1',
            val: 'createTime'
          },
        ],
        serviceFlg: false,
        mzzybz:['','门诊','住院','互联网医院'],
				imageList: [
          {
            icon: 'ruku',
            title: "采购入库",
            time: "2025-03-18 09:23",
            content: "地道药材基地直采，黄芪/当归等入库检验合格",
            proofIndex: "d1sd2f...sds5w6d8"
          },
          {
            icon: 'chuku',
            title: "出库",
            time: "2025-03-19 10:15",
            content: "饮片出库至调剂中心，质检报告上链",
            proofIndex: "0x4c5d0e…a2b1"
          },
          {
            icon: 'kaifang',
            title: "开方",
            time: "2025-03-20 09:05",
            content: "主任中医师 张明德 电子签章，处方数据加密",
            proofIndex: "0x7e8f9a…c3d4"
          },
          {
            icon: 'shenfang',
            title: "审方",
            time: "2025-03-20 10:30",
            content: "执业药师 李慧芳 双审核通过，配伍禁忌校验",
            proofIndex: "0x9e0b1c…d6e7"
          },
          {
            icon: 'shoufei',
            title: "收费",
            time: "2025-03-20 10:45",
            content: "医保支付+个人账户，支付凭证上链",
            proofIndex: "0x82c304...e8f9"
          },
          {
            icon: 'peiyao',
            title: "配药",
            time: "2025-03-20 11:20",
            content: "智能调配机精准称重，复核双签",
            proofIndex: "0x84e56f6...g1h2"
          },
          {
            icon: 'jiefang',
            title: "药厂接方",
            time: "2025-03-20 14:10",
            content: "康美药业智慧煎药中心接收电子处方，系统自动匹配药材批次，生成药厂内部溯源码",
            proofIndex: "0xf6g7h8...13j4"
          },
          {
            icon: 'fuhe',
            title: "药厂复核",
            time: "2025-03-20 15:20",
            content: "双人复核饮片品种、剂量，与处方完全一致，复核员数字签名",
            proofIndex: "0x889101...k516"
          },
          {
            icon: 'jinpao',
            title: "药厂温泡",
            time: "2025-03-21 08:30 - 09:45",
            content: "恒温恒湿浸泡车间，黄药等药材浸泡45分钟，水量监控数据上链",
            proofIndex: "0xjn7606...pq9"
          },
          {
            icon: 'jianyao',
            title: "药厂煎药",
            time: "2025-03-21 10:00 - 11:30",
            content: "智能煎药机（先煎后下自动控制），煎煮曲线完整上链，确保药效",
            proofIndex: "0xabcb12...e134"
          },
          {
            icon: 'dabao',
            title: "药厂打包",
            time: "2025-03-21 12:10",
            content: "自动灌装封口，贴区块链追溯二维码，每袋独立标识",
            proofIndex: "0xafgb06...lj78"
          },
          {
            icon: 'fahuo',
            title: "药厂发货",
            time: "2025-03-21 15:40",
            content: "药厂成品出库，扫描发货，物流单号关联处方链上数据",
            proofIndex: "0xklm90...op12"
          },
          {
            icon: 'wuliu',
            title: "物流过程",
            time: "2025-03-21 16:20",
            tip: "已揽件,运输中",
            content: "顺丰医药专递 运单号:SF14256893221·已揽件，运输中，预计03月23日送达",
            proofIndex: "0xqrst34...uv56"
          }
				]
			}
		},
		onLoad(option) {
      if(option.service){
        this.serviceFlg = true
        statisticFun('query', {"groupCode": "mobile_app",
          "bizCode": "certificate_query",
          "params": {
            "service": option.service,
            "hx": option.hx
          }
        }).then(res=>{
          this.cfDtl = res.result.data || {}
          this.navbarTitle = res.result.title || '存证溯源'
          this.resultArray = Object.entries(this.cfDtl).map(([key, value]) => ({
            name: key + ':',
            value
          }))
        })
      }else {
        this.serviceFlg = false
        this.navbarTitle = '存证溯源'
        cfListFun('trace?transHash=' + option.hx, {
        }).then(res => {
          this.cfDtl = res.data ||{}
        })
      }
		},
    onShow(){
      window.parent.postMessage({
        type: 'FROM_CHILD',
        payload: 'ssss',
        timestamp: new Date().toLocaleTimeString()
      }, '*');
    },
		methods: {
      getTime(dateStr){
        if(dateStr){
          const datePart = dateStr.substring(0, 19).replace('T', ' ');
          return `${datePart}`;
        }else {
          return ''
        }
      },
			navigateBack() {
				uni.navigateBack({
					delta: 1
				});
			}
		}
	};
</script>

<style scoped lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background-color: #f5f5f5;
	}

	/* 顶部导航栏 */
	.navbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 88rpx;
		background-color: #1976D2;
		padding: 0 32rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
		position: sticky;
		top: 0;
		z-index: 100;

		.back-btn {
			width: 44rpx;
			height: 44rpx;
			display: flex;
			align-items: center;
			justify-content: center;
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
			font-size: 32rpx;
			font-weight: bold;
			color: white;
		}

		.navbar-right {
			width: 44rpx;
		}
	}

  .zs_box {
    padding: 20rpx 0;
    height: calc(100vh - 88rpx);
    .bgbox {
      background: url("../../static/explorer_zs.png") no-repeat;
      background-size: 100% 100% ;
      height: 100%;
      .zs_tit {
        text-align: center;
        padding-top: 210rpx;
        margin-bottom: 20rpx;
        font-family: AlibabaHealthFont20CN, AlibabaHealthFont20CN;
        font-weight: 600;
        font-size: 60rpx;
        color: #4867A8;
      }
      .zs_list {
        margin-bottom: 28rpx;
        padding: 0 80rpx;
        flex-wrap: wrap;
        white-space: normal;
        word-break: break-all;
        &.on {
          margin-bottom: 20rpx;
        }
        .list_name {
          text-align: right;
          font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
          font-weight: 500;
          font-size: 26rpx;
          color: rgba(0,0,0,0.85);
        }
        .list_val {
          font-family: Alibaba-PuHuiTi, Alibaba-PuHuiTi;
          font-weight: 400;
          font-size: 26rpx;
          color: rgba(0,0,0,0.65);
        }
      }
    }
  }
	/* 信息卡片 */
	.info-card {
		background-color: white;
		margin: 16rpx 32rpx;
		border-radius: 12rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.12);
		overflow: hidden;
		transition: transform 0.2s, box-shadow 0.2s;

		&:hover {
			transform: translateY(-2rpx);
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.12);
		}

		.card-header {
			padding: 24rpx 20rpx 24rpx 32rpx;
			border-bottom: 2rpx solid #dfdada;
			justify-content: space-between;
			font-size: 22rpx;



			.tit_txt {
				font-size: 24rpx;
				font-weight: bold;
				//color: #1976D2;
				margin-left: 5rpx;
			}

			.nclr {
        font-size: 20rpx;
				margin-left: 5rpx;
			}
		}
	}
  .shad {
    padding: 10rpx 20rpx;
    border-radius: 50rpx;
    background: rgba(218, 227, 235, 0.6);
  }
	.card-content-Box {
		padding: 24rpx;

		.card-content {
			background: rgba(234, 239, 244, 0.8);
			padding: 16rpx 20rpx;
			border-radius: 18rpx;

			.info-item {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				margin: 14rpx 0;
				font-size: 22rpx;
				color: #555;

				.info-value {
					color: #333;
					font-weight: 600;
				}
			}
		}

    .verify-btn {
      justify-content: center;
      background-color: #fff;
      border-radius: 50rpx;
      padding: 16rpx 0;
      border: 2rpx solid #e0e0e0;
      //box-shadow: 0 4rpx 6rpx rgba(0,0,0,0.1);
      margin: 21rpx 0;
      .btn-text {
        font-size: 22rpx;
        margin-left: 15rpx;
      }
    }

    .card-item {
      margin-bottom: 15rpx;
      .itm-left {
        margin-right: 20rpx;
        .lft-log {
          padding: 13rpx 18rpx;
          border: 2rpx solid rgba(24, 144, 255, 0.5);
          border-radius: 50%;
          text-align: center;
          background: rgba(24, 144, 255, 0.2);
        }
        .lft-line {
          width: 4rpx;
          background: rgba(24, 144, 255, 0.25);
        }
      }
      .itm-right {
        padding-bottom: 20rpx;
        .rt-tit {
          font-size: 28rpx;
          font-weight: 600;
          .rt-tit-tet {
            margin-right: 12rpx;
          }
        }
        .rt-time {
          font-size: 23rpx;
          color: #666;
        }
        .rt-dec {
          margin: 15rpx 0;
          font-size: 24rpx;
          line-height: 34rpx;
          text-align: justify;
          color: #555;
        }
        .rt-czhx {
          font-size: 20rpx;
        }
      }
    }

	}

  .verify-tip.card-content {
    border-radius: 100rpx;
    font-size: 20rpx;
    padding: 16rpx 24rpx;
    text-align: justify;
    .Rx-text {
      margin-right: 5rpx;
      font-size: 26rpx;
      font-weight: 600;
    }
  }

  .endLcBox {
    padding: 10rpx 20rpx;
    border: 2rpx solid #f9b00f;
    border-radius: 300rpx;
    background: #FBF5EB;
    .tip-ter {
      font-size: 22rpx;
      padding: 0 15rpx;
      .tip-ter-tit {
        font-size: 24rpx;
        line-height: 36rpx;
        font-weight: 600;
      }
    }
    .tip-lian {
      color: #804000;
      font-size: 20rpx;
    }
  }
  .endBox {
    padding: 26rpx 0 0;
    font-size: 22rpx;
    justify-content: center;
    color: #595959;
  }
	/* 滚动条样式 */
	::-webkit-scrollbar {
		width: 6rpx;
	}

	::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 3rpx;
	}

	::-webkit-scrollbar-thumb {
		background: #c1c1c1;
		border-radius: 3rpx;
	}

	::-webkit-scrollbar-thumb:hover {
		background: #a8a8a8;
	}
</style>
