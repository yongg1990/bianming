// src/utils/request.js
// 1. 定义全局请求配置
const bl = process.env.NODE_ENV === "development" ? '' : process.env.BASE_URL.substr(0,process.env.BASE_URL.length - 1)
const BASE_URL = location.origin; // 基础接口域名
const TIMEOUT = 60000; // 请求超时时间（毫秒）

// 2. 封装请求拦截器
const beforeRequest = (config) => {
  // 1. 统一添加请求头，比如鉴权Token
  config.data = {
    "id": "1",
    "jsonrpc": "2.0",
    ...config.data
  }
  const token = uni.getStorageSync('token');
  if (token) {
    config.header = {
      ...config.header,
      'Authorization': `Bearer ${token}`,
      'Access-Token': token,
      'WeAppAuthorization': token,
      'Content-Type': 'application/json',
      'accept': 'application/json'
    };
  }

  // 2. 统一添加loading提示
  uni.showLoading({
    title: '加载中...',
    mask: true
  });

  // 3. 可添加其他拦截逻辑，比如参数校验、请求日志记录
  // if (!config.url) {
  //   throw new Error('请求地址不能为空');
  // }

  return config;
};

// 3. 封装响应拦截器
const afterRequest = (response) => {
  uni.hideLoading();
  const { statusCode, data } = response;

  // 处理HTTP状态码
  if (statusCode >= 200 && statusCode < 300) {
    if(data.error){
      uni.showToast({
        title: data.error.message,
        icon: 'none'
      });
    }
    // error业务成功，直接返回数据
    return data;
  } else {
    // 统一处理业务错误
    uni.showToast({
      title: '请求异常',
      icon: 'none'
    });
    throw new Error(`HTTP ${statusCode} 错误`);
  }
};

// 4. 创建请求实例
const request = (options) => {
  // 执行请求拦截
  const mergedOptions = beforeRequest({
    url: BASE_URL + options.url,
    method: options.method || 'GET',
    data: options.data || {},
    header: options.header || {}
  });

  return new Promise((resolve, reject) => {
    uni.request({
      ...mergedOptions,
      success: (res) => {
        // 执行响应拦截
        const result = afterRequest(res);
        resolve(result);
      },
      fail: (err) => {
        uni.hideLoading();
        uni.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
        reject(err);
      },
      timeout: TIMEOUT
    });
  });
};

// 5. 导出封装后的请求方法
export default {
  get: (url, data = {}) => request({ url, method: 'GET', data }),
  post: (url, data = {}) => request({ url, method: 'POST', data }),
  put: (url, data = {}) => request({ url, method: 'PUT', data }),
  delete: (url, data = {}) => request({ url, method: 'DELETE', data }),
  BASE_URL
};
