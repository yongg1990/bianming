<template>
	<view class="container">
		<!-- 顶部导航栏 -->
		<view class="navbar">
			<view class="back-btn" @click="navigateBack">
				<text class="back-icon">&lt;</text>
			</view>
			<view class="navbar-title">中药材溯源</view>
			<view class="navbar-right"></view>
		</view>
    <view v-if="qynbzsm" style="height: 100vh;">
      <!-- #ifdef H5 -->
      <iframe
          ref="h5Iframe"
          :src="qynbzsm"
          allowtransparency
          style="width: 100%; height: 100vh; border: none;"
      ></iframe>
      <!-- #endif -->

      <!-- 非 H5 平台（小程序、App）使用 web-view -->
      <!-- #ifndef H5 -->
      <web-view
          ref="appWebview"
          :src="qynbzsm"
      ></web-view>
      <!-- #endif -->
    </view>
    <view v-else-if="titleListFlg">
      <view v-if="showListDt.length">
        <view class="info-card" v-for="(itm, idx) in showListDt" :key="idx">
          <view class="card-header">
            <view class="title-line"></view>
            <text class="card-title">{{ itm.name }}</text>
            <view class="title-line"></view>
          </view>
          <uni-collapse ref="collapse" >
            <uni-collapse-item
                class="card-content"
                v-for="(t, ti) in itm.rowData.filter(w=>w.show)"
                :open="ti === 0"
                :key="ti">
              <view slot="title" class="rowDataList">{{t.name}}</view>
              <view class="info-item-box">
                <view class="card-contents" v-if="ti < 1">
                    <view class="info-item">
                      <text class="info-label">存在哈希（TxID）</text>
                      <text class="info-value">0cs151r21...fd25sd1</text>
                    </view>
                  <view class="info-item">
                    <text class="info-label">区块高度</text>
                    <text class="info-value">#1,265,673</text>
                  </view>
                    <view class="info-item">
                      <text class="info-label">存证时间</text>
                      <text class="info-value">2025-03-21 14:32:18 (UTC+8 )</text>
                    </view>
                    <view class="info-item">
                      <text class="info-label">存证机构</text>
                      <text class="info-value">上海余天成中药饮片有限公司</text>
                    </view>
                  </view>
                <view class="info-item" v-for="(c,ci) in t.itemData" :key="ci" :class="{ on: c.slot === 'zyxx' || c.slot === 'upload'}">
                    <view class="info-label">{{ c.title }}</view>
                    <view v-if="c.slot === 'zyxx'" class="info-value">
                      <view class="flexCCls" v-for="(r,ri) in sourceItmDt.traceYcPlant.plantInfo" :key="ri">
                        <view class="info-item" v-for="(re,rei) in c.itemData" :key="rei">
                          <view class="info-label">{{ re.title }}</view>
                          <view class="info-value">{{ r[re.getV] }}</view>
                        </view>
                      </view>
                    </view>
                    <view v-else-if="c.slot === 'upload'" class="info-value">
                      <view class="image-container">
                        <image
                            class="product-image"
                            v-for="(img, index) in c.val.filter(qw=>qw.type === c.key)"
                            :key="index"
                            :alt="img.alt"
                            :src='`/api/wptp/image/show/${img.path}`' />
                      </view>
                    </view>
                    <view v-else class="info-value">{{ c.val }}</view>
                </view>
              </view>
            </uni-collapse-item>
          </uni-collapse>
        </view>
      </view>
      <view v-else class="noDt">
        暂无数据
      </view>
    </view>
	</view>
</template>

<script>
	import {cfTraceFun} from "../../request";

  export default {
		data() {
			return {
        qynbzsm: '',
        sourceDt: {},
				imageList: [
            {
						url: '/static/ycscb.png',
						alt: '药材图片'
					},
					{
						url: '/static/ycsca.jpeg',
						alt: '药材图片'
					},
					{
						url: '/static/ycscc.png',
						alt: '药材图片'
					}
				],
        titleList: [
          {
            name: '药材信息',
            key: 'medicine',
            show: 'true',
            rowData: [
              {
                name: '基本信息',
                show: 'true',
                showFlg: 'true',
                itemData: [
                  {
                    title: '药材名称',
                    sty: '',
                    getV: 'name',
                    val: undefined
                  },
                  {
                    title: '药材功效',
                    sty: '',
                    getV: 'func',
                    val: undefined
                  },
                  {
                    title: '用药部位',
                    sty: '',
                    getV: 'yybw',
                    val: undefined
                  },
                  {
                    title: '基原',
                    sty: '',
                    getV: 'basicSource',
                    val: undefined
                  },
                  {
                    title: '采收时期',
                    sty: '',
                    getV: 'cssq',
                    val: undefined
                  }
                ]
              }
            ]
          },
          {
            name: '饮片流通',
            key: 'traceYpbSale',
            show: 'true',
            rowData: [
              {
                name: '饮片销售',
                key: 'ypbSale',
                show: 'true',
                showFlg: 'true',
                itemData: [
                  {
                    title: '饮片销售流水号',
                    sty: '',
                    getV: 'saleNumber',
                    val: undefined
                  },
                  {
                    title: '追溯码',
                    sty: '',
                    getV: 'traceCode',
                    val: undefined
                  },
                  {
                    title: '饮片名称',
                    sty: '',
                    getV: 'ypName',
                    val: undefined
                  },
                  {
                    title: '药材产地',
                    sty: '',
                    getV: 'medicinalOrigin',
                    val: undefined
                  },
                  {
                    title: '饮片规格',
                    sty: '',
                    getV: 'ypGuige',
                    val: undefined
                  },
                  {
                    title: '饮片入库流水号',
                    sty: '',
                    getV: 'instockNo',
                    val: undefined
                  },
                  {
                    title: '产品批号',
                    sty: '',
                    getV: 'productBatch',
                    val: undefined
                  },
                  {
                    title: '销售时间',
                    sty: '',
                    getV: 'saleTime',
                    val: undefined
                  },
                  {
                    title: '销售数量',
                    sty: '',
                    getV: 'num',
                    val: undefined
                  },
                  {
                    title: '流向单位',
                    sty: '',
                    getV: 'contact',
                    val: undefined
                  },
                  {
                    title: '流通企业',
                    sty: '',
                    getV: 'entName',
                    val: undefined
                  }
                ]
              },
              {
                name: '饮片入库',
                key: 'ypbInstock',
                show: 'true',
                showFlg: 'true',
                itemData: [
                  {
                    title: '饮片入库流水号',
                    sty: '',
                    getV: 'instockNumber',
                    val: undefined
                  },
                  {
                    title: '饮片名称',
                    sty: '',
                    getV: 'ypName',
                    val: undefined
                  },
                  {
                    title: '包装规格',
                    sty: '',
                    getV: 'packGuige',
                    val: undefined
                  },
                  {
                    title: '来源追溯码',
                    sty: '',
                    getV: 'traceCode',
                    val: undefined
                  },
                  {
                    title: '来源环节',
                    sty: '',
                    getV: 'sourceFlag',
                    vData: ['种植端', '药材流通', '饮片加工', '饮片经营'],
                    val: undefined
                  },
                  {
                    title: '产品批号',
                    sty: '',
                    getV: 'productBatch',
                    val: undefined
                  },
                  {
                    title: '到货时间',
                    sty: '',
                    getV: 'arrivalTime',
                    val: undefined
                  },
                  {
                    title: '采购数量(KG)',
                    sty: '',
                    getV: 'num',
                    val: undefined
                  },
                  {
                    title: '药材产地',
                    sty: '',
                    getV: 'medicinalOrigin',
                    val: undefined
                  },
                  {
                    title: '生产厂商',
                    sty: '',
                    getV: 'manufacturer',
                    val: undefined
                  },
                  {
                    title: '所属企业',
                    sty: '',
                    getV: 'entName',
                    val: undefined
                  },
                  {
                    title: '储存环境',
                    sty: '',
                    getV: 'enviornment',
                    val: undefined
                  }
                ]
              }
            ]
          },
          {
            name: '饮片生产',
            key: 'traceYpProcess',
            show: 'true',
            rowData: [
              {
                name: '饮片销售',
                key: 'ypSale',
                show: 'true',
                showFlg: 'true',
                itemData: [
                  {
                    title: '饮片销售流水号',
                    sty: '',
                    getV: 'saleNumber',
                    val: undefined
                  },
                  {
                    title: '追溯码',
                    sty: '',
                    getV: 'traceCode',
                    val: undefined
                  },
                  {
                    title: '产品来源流水号',
                    sty: '',
                    getV: 'sourceNo',
                    val: undefined
                  },
                  {
                    title: '产品来源',
                    sty: '',
                    getV: 'source',
                    vData: ['包装', '加工'],
                    val: undefined
                  },
                  {
                    title: '产品批号',
                    sty: '',
                    getV: 'batchNo',
                    val: undefined
                  },
                  {
                    title: '饮片名称',
                    sty: '',
                    getV: 'ypName',
                    val: undefined
                  },
                  {
                    title: '药材产地',
                    sty: '',
                    getV: 'medicineOrigin',
                    val: undefined
                  },
                  {
                    title: '发货数量(kg)',
                    sty: '',
                    getV: 'num',
                    val: undefined
                  },
                  {
                    title: '包装规格',
                    sty: '',
                    getV: 'packGuige',
                    val: undefined
                  },
                  {
                    title: '销售时间',
                    sty: '',
                    getV: 'saleTime',

                    val: undefined
                  },
                  {
                    title: '流向单位',
                    sty: '',
                    getV: 'contact',
                    val: undefined
                  },
                  {
                    title: '生产企业',
                    sty: '',
                    getV: 'entName',
                    val: undefined
                  }
                ]
              },
              {
                name: '饮片包装',
                key: 'ypPack',
                show: 'true',
                showFlg: 'true',
                itemData: [
                  {
                    title: '饮片包装流水号',
                    sty: '',
                    getV: 'packNo',
                    val: undefined
                  },
                  {
                    title: '饮片品名',
                    sty: '',
                    getV: 'piecesName',
                    val: undefined
                  },
                  {
                    title: '生产流水号',
                    sty: '',
                    getV: 'processNo',
                    val: undefined
                  },
                  {
                    title: '产品批号',
                    sty: '',
                    getV: 'productBatch',
                    val: undefined
                  },
                  {
                    title: '包装规格',
                    sty: '',
                    getV: 'packGuige',
                    val: undefined
                  },
                  {
                    title: '总重量',
                    sty: '',
                    getV: 'totalWeight',
                    val: undefined
                  },
                  {
                    title: '数量',
                    sty: '',
                    getV: 'number',
                    val: undefined
                  }
                ]
              },
              {
                name: '饮片生产',
                key: 'ypProcess',
                show: 'true',
                showFlg: 'true',
                itemData: [
                  {
                    title: '生产流水号',
                    sty: '',
                    getV: 'processNo',
                    val: undefined
                  },
                  {
                    title: '饮片品名',
                    sty: '',
                    getV: 'ypName',
                    val: undefined
                  },
                  {
                    title: '饮片规格',
                    sty: '',
                    getV: 'ypGuige',
                    val: undefined
                  },
                  {
                    title: '生产批号',
                    sty: '',
                    getV: 'productBatch',
                    val: undefined
                  },
                  {
                    title: '原料来源',
                    sty: '',
                    getV: 'source',
                    vData: ['原料入库', '原料加工'],
                    val: undefined
                  },
                  {
                    title: '药材入库流水号',
                    sty: '',
                    getV: 'instockNo',
                    val: undefined
                  },
                  {
                    title: '原料数量(kg)',
                    sty: '',
                    getV: 'materialNum',
                    val: undefined
                  },
                  {
                    title: '成品数量(kg)',
                    sty: '',
                    getV: 'productNum',
                    val: undefined
                  },
                  {
                    title: '生产日期',
                    sty: '',
                    getV: 'producedDate',
                    val: undefined
                  },
                  {
                    title: '检测依据',
                    sty: '',
                    getV: 'checkBasis',
                    val: undefined
                  },
                  {
                    title: '检测结果',
                    sty: '',
                    getV: 'checkResult',
                    val: undefined
                  },
                  {
                    title: '储存环境',
                    sty: '',
                    getV: 'enviornment',
                    val: undefined
                  },
                  {
                    title: '检测报告',
                    sty: '',
                    getV: 'fileList',
                    slot: 'upload',
                    key: 'YP_PROCESS_TEST',
                    val: []
                  }
                ]
              },
              {
                name: '药材入库',
                key: 'ypInstock',
                show: 'true',
                showFlg: 'true',
                itemData: [
                  {
                    title: '药材入库流水号',
                    sty: '',
                    getV: 'instockNumber',
                    val: undefined
                  },
                  {
                    title: '来源追溯码',
                    sty: '',
                    getV: 'traceCode',
                    val: undefined
                  },
                  {
                    title: '来源环节',
                    sty: '',
                    getV: 'sourceFlag',
                    vData: ['种植端', '药材流通', '饮片加工', '饮片经营'],
                    val: undefined
                  },
                  {
                    title: '原料品名',
                    sty: '',
                    getV: 'materialName',
                    val: undefined
                  },
                  {
                    title: '产品批号',
                    sty: '',
                    getV: 'productBatch',
                    val: undefined
                  },
                  {
                    title: '到货时间',
                    sty: '',
                    getV: 'arrivalTime',
                    val: undefined
                  },
                  {
                    title: '采购数量(kg)',
                    sty: '',
                    getV: 'num',
                    val: undefined
                  },
                  {
                    title: '原料产地',
                    sty: '',
                    getV: 'medicineOrigin',
                    val: undefined
                  },
                  {
                    title: '生产厂商',
                    sty: '',
                    getV: 'manufacturer',
                    val: undefined
                  },
                  {
                    title: '所属企业',
                    sty: '',
                    getV: 'entName',
                    val: undefined
                  },
                  {
                    title: '检测依据',
                    sty: '',
                    getV: 'checkBasis',
                    val: undefined
                  },
                  {
                    title: '检测结果',
                    sty: '',
                    getV: 'checkResult',
                    val: undefined
                  },
                  {
                    title: '检测报告',
                    sty: '',
                    getV: 'fileList',
                    slot: 'upload',
                    key: 'YP_INSTOCK_TEST',
                    val: []
                  }
                ]
              }
            ]
          },
          {
            name: '药材流通',
            key: 'traceYcSale',
            show: 'true',
            rowData: [
              {
                name: '药材销售',
                key: 'ycSale',
                show: 'true',
                showFlg: 'true',
                itemData: [
                  {
                    title: '药材销售流水号',
                    sty: '',
                    getV: 'saleNumber',
                    val: undefined
                  },
                  {
                    title: '销售单号',
                    sty: '',
                    getV: 'saleNo',
                    val: undefined
                  },
                  {
                    title: '追溯码',
                    sty: '',
                    getV: 'traceCode',
                    val: undefined
                  },
                  {
                    title: '产品批号',
                    sty: '',
                    getV: 'productBatch',
                    val: undefined
                  },
                  {
                    title: '药材名称',
                    sty: '',
                    getV: 'medicineName',
                    val: undefined
                  },
                  {
                    title: '药材产地',
                    sty: '',
                    getV: 'medicinalOrigin',
                    val: undefined
                  },
                  {
                    title: '药材入库流水号',
                    sty: '',
                    getV: 'instockNumber',
                    val: undefined
                  },
                  {
                    title: '出库时间',
                    sty: '',
                    getV: 'outTime',
                    val: undefined
                  },
                  {
                    title: '出库数量(kg)',
                    sty: '',
                    getV: 'num',
                    val: undefined
                  },
                  {
                    title: '流向企业',
                    sty: '',
                    getV: 'contact',
                    val: undefined
                  },
                  {
                    title: '流通企业',
                    sty: '',
                    getV: 'entName',
                    val: undefined
                  }
                ]
              },
              {
                name: '药材入库',
                key: 'ycInstock',
                show: 'true',
                showFlg: 'true',
                itemData: [
                  {
                    title: '药材入库流水号',
                    sty: '',
                    getV: 'instockNumber',
                    val: undefined
                  },
                  {
                    title: '入库单号',
                    sty: '',
                    getV: 'instockNo',
                    val: undefined
                  },
                  {
                    title: '来源追溯码',
                    sty: '',
                    getV: 'traceCode',
                    val: undefined
                  },
                  {
                    title: '来源批次号',
                    sty: '',
                    getV: 'sourceBatch',
                    val: undefined
                  },
                  {
                    title: '药材名称',
                    sty: '',
                    getV: 'medicineName',
                    val: undefined
                  },
                  {
                    title: '产品批号',
                    sty: '',
                    getV: 'productBatch',
                    val: undefined
                  },
                  {
                    title: '到货时间',
                    sty: '',
                    getV: 'arriveTime',
                    val: undefined
                  },
                  {
                    title: '采购数量(KG)',
                    sty: '',
                    getV: 'purchaseNum',
                    val: undefined
                  },
                  {
                    title: '药材产地',
                    sty: '',
                    getV: 'medicinalOrigin',
                    val: undefined
                  },
                  {
                    title: '检测结果',
                    sty: '',
                    getV: 'checkResult',
                    val: undefined
                  },
                  {
                    title: '储存环境',
                    sty: '',
                    getV: 'enviornment',
                    val: undefined
                  }
                ]
              }
            ]
          },
          {
            name: '药材生产',
            key: 'traceYcPlant',
            show: 'true',
            rowData: [
              {
                name: '出厂销售',
                key: 'ycSale',
                show: 'true',
                showFlg: 'true',
                itemData: [
                  {
                    title: '平台批次编号',
                    sty: '',
                    getV: 'filingNo',
                    val: undefined
                  },
                  {
                    title: '销售流水号',
                    sty: '',
                    getV: 'saleNumber',
                    val: undefined
                  },
                  {
                    title: '销售时间',
                    sty: '',
                    getV: 'saleTime',
                    val: undefined
                  },
                  {
                    title: '追溯码',
                    sty: '',
                    getV: 'traceCode',
                    val: undefined
                  },
                  {
                    title: '产品批号',
                    sty: '',
                    getV: 'productBatch',
                    val: undefined
                  },
                  {
                    title: '药材名称',
                    sty: '',
                    getV: 'medicineName',
                    val: undefined
                  },
                  {
                    title: '加工单号',
                    sty: '',
                    getV: 'medicineBatch',
                    val: undefined
                  },
                  {
                    title: '药材产地',
                    sty: '',
                    getV: 'medicinalOrigin',
                    val: undefined
                  },
                  {
                    title: '数量(kg)',
                    sty: '',
                    getV: 'num',
                    val: undefined
                  },
                  {
                    title: '流向企业',
                    sty: '',
                    getV: 'contact',
                    val: undefined
                  }
                ]
              },
              {
                name: '初加工',
                key: 'ycProcess',
                show: 'true',
                showFlg: 'true',
                itemData: [
                  {
                    title: '加工单号',
                    sty: '',
                    getV: 'processNo',
                    val: undefined
                  },
                  {
                    title: '加工时间',
                    sty: '',
                    getV: 'startTime',
                    val: undefined
                  },
                  {
                    title: '加工数量(kg)',
                    sty: '',
                    getV: 'num',
                    val: undefined
                  },
                  {
                    title: '加工工艺',
                    sty: '',
                    getV: 'processGy',
                    val: undefined
                  },
                  {
                    title: '产品批号',
                    sty: '',
                    getV: 'productBatch',
                    val: undefined
                  },
                  {
                    title: '加工图片',
                    sty: '',
                    getV: 'fileList',
                    slot: 'upload',
                    key: 'PROCESS_IMG',
                    val: []
                  },
                  {
                    title: '仓储图片',
                    sty: '',
                    getV: 'fileList',
                    slot: 'upload',
                    key: 'PROCESS_STORET',
                    val: []
                  }
                ]
              },
              {
                name: '采收信息',
                key: 'csInfo',
                show: 'true',
                showFlg: 'true',
                itemData: [
                  {
                    title: '采收时间',
                    sty: '',
                    getV: 'csTime',
                    val: undefined
                  },
                  {
                    title: '采收批次号',
                    sty: '',
                    getV: 'csNo',
                    val: undefined
                  },
                  {
                    title: '重量',
                    sty: '',
                    getV: 'weight',
                    val: undefined
                  }
                ]
              },
              {
                name: '种植信息',
                key: 'blockMedicinal',
                show: 'true',
                showFlg: 'true',
                itemData: [ //plantInfo
                  {
                    title: '生产档案编号',
                    sty: '',
                    getV: 'blockMedicinalId',
                    val: undefined
                  },
                  {
                    title: '所属基地',
                    sty: '',
                    getV: 'baseName',
                    val: undefined
                  },
                  {
                    title: '负责人',
                    sty: '',
                    getV: 'baseAdmin',
                    val: undefined
                  },
                  {
                    title: '种植/养殖时间',
                    sty: '',
                    getV: 'lastTime',
                    val: undefined
                  },
                  {
                    title: '种植/养殖面积',
                    sty: '',
                    getV: 'lastArea',
                    val: undefined
                  },
                  {
                    title: '供应商',
                    sty: '',
                    getV: 'entName',
                    val: undefined
                  },
                  {
                    title: '基原',
                    sty: '',
                    getV: 'jy',
                    val: undefined
                  },
                  {
                    title: '原料产地',
                    sty: '',
                    getV: 'medicineOrigin',
                    val: undefined
                  },
                  {
                    title: '生产厂商',
                    sty: '',
                    getV: 'manufacturer',
                    val: undefined
                  },
                  {
                    title: '作业信息',
                    sty: '',
                    getV: 'plantInfo',
                    slot: 'zyxx',
                    val: undefined,
                    itemData: [
                      {
                        title: '作业名称',
                        sty: '',
                        slot: 'A',
                        getV: 'plantStatus',
                        val: undefined
                      },
                      {
                        title: '操作时间',
                        sty: '',
                        slot: 'A',
                        getV: 'operateTime',
                        val: undefined
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        titleListFlg: true,
        showListDt: [],
        sourceItmDt: {}
			}
		},
    onShow(){
      window.parent.postMessage({
        type: 'FROM_CHILD',
        payload: 'ssss',
        timestamp: new Date().toLocaleTimeString()
      }, '*');
      this.sourceDt = uni.getStorageSync('yp_source') || {}
      this.qynbzsm = ''
      if(this.sourceDt.qynbzsm && this.sourceDt.configSuFlg){
        this.qynbzsm = this.sourceDt.qynbzsm
      } else if(Object.keys(this.sourceDt).length){
        this.titleListFlg = false
        cfTraceFun('patientTrace', {
          "cpph": this.sourceDt.cpph,
          "sccj": this.sourceDt.sccj,
          "zsm": this.sourceDt.zsm
        }).then(res=>{
          this.sourceItmDt = res.code === "0" ? res.result : {}
          this.titleList.map((w, wi) => {
            const d = this.sourceItmDt[w.key]
            if (d) {
              w.show = true
              const dl = Array.isArray(d) ? d[0] : d
              if (dl) {
                w.rowData.map(q => {
                  const db = q.key ? dl[q.key] : dl
                  const dt = Array.isArray(db) ? db[0] : db
                  if (dt) {
                    q.show = true
                    q.itemData.map(w => {
                      if (w.getV) w.val = w.vData ? w.vData[dt[w.getV]] : dt[w.getV]
                    })
                  }else {
                    q.show = false
                  }
                })
              }
            }else {
              w.show = false
            }
          })
        }).finally(()=>{
          this.showListDt = this.titleList.filter(itm=>itm.show && itm.rowData.some(q=>q.show))
          this.titleListFlg = true
        })
      }
    },
    onHide() {
      uni.removeStorageSync('yp_source')
    },
		methods: {
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
	}

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

  .noDt {
    text-align: center;
    margin-top: 25%;
  }
	/* 信息卡片 */
	.info-card {
		background-color: white;
		margin: 16rpx 24rpx;
		border-radius: 12rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
		overflow: hidden;
		transition: transform 0.2s, box-shadow 0.2s;
	}
	.card-header {
		padding: 24rpx 32rpx;
		border-bottom: 2rpx solid #dfdada;
		text-align: center;
	}

	.card-title {
		font-size: 28rpx;
		font-weight: bold;
		color: #1976D2;
		position: relative;

		&::before {
			content: '';
			position: absolute;
			top: -24rpx;
			left: 50%;
			transform: translate(-50%);
			width: 120rpx;
			height: 10rpx;
			background: linear-gradient(to right, #137de5, #a9baca);
			z-index: 5;
			border-bottom-left-radius: 10rpx;
			border-bottom-right-radius: 10rpx;
		}

		//&::after {
		//	content: '';
		//	position: absolute;
		//	bottom: -24rpx;
		//	left: 0;
		//	width: 100%;
		//	height: 4rpx;
		//	background: rgba(25, 118, 210, 0.7);
		//	z-index: 5;
		//}
	}

	.card-content {
    display: flex;
    flex-direction: column;
    .rowDataList {
      padding: 24rpx;
      font-size: 30rpx;
    }
    .info-item {
      flex: 1;
      display: flex;
      flex-direction: row;
      align-items: center;
      .flexCCls {
        display: flex;
        flex-direction: row;
        .info-item {
          .info-value {
            text-align: center;
          }
        }
      }
      &.on {
        flex-direction: column;
        align-items: start;
        .info-value {
          width: 100%;
        }
      }
      .info-label {
        font-size: 26rpx;
        color: #666;
        margin: 12rpx 0;
      }

      .info-value {
        padding-left: 10rpx;
        flex: 1;
        text-align: right;
        font-size: 26rpx;
        margin: 12rpx 0;
        color: #222;
      }

    }
    .info-item-box {
      padding: 24rpx ;
      border-top: 2rpx solid #ebeef5;
    }
    .card-contents {
      background: rgba(234, 239, 244, 0.8);
      padding: 16rpx 20rpx;
      border-radius: 18rpx;
      .info-item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 12rpx 0;
        color: #555;
        .info-value {
          color: #333;
          font-weight: 600;
          font-size: 22rpx;
          margin: 0 ;
        }
        .info-label {
          font-size: 22rpx;
          margin: 0;
        }
      }
    }
  }

	/* 图片展示 */
	.image-container {
		display: flex;
		flex-direction: column;
		gap: 32rpx;
	}

	.product-image {
		width: 100%;
		border-radius: 8rpx;
		object-fit: cover;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.58);
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
