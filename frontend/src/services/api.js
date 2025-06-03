import axios from 'axios';

// 获取环境变量中的 API 基础 URL，如果未设置则使用默认值
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

// 创建一个 axios 实例，配置基本 URL 和默认请求头
const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器，可以在这里添加认证令牌等
API.interceptors.request.use(
  (config) => {
    // 从本地存储获取令牌（如果有的话）
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器，处理常见错误
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 处理常见错误，如 401 未授权、500 服务器错误等
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401) {
        // 未授权，可能需要重新登录
        console.error('未授权，请重新登录');
        // 可以在这里执行登出操作或重定向到登录页面
      } else if (status >= 500) {
        // 服务器错误
        console.error('服务器错误，请稍后重试');
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('网络错误，无法连接到服务器');
    } else {
      // 请求配置出错
      console.error('请求配置错误', error.message);
    }
    
    return Promise.reject(error);
  }
);

// 设备相关 API
export const deviceAPI = {
  // 获取所有设备
  getAllDevices: () => API.get('/devices'),
  
  // 获取单个设备
  getDevice: (deviceId) => API.get(`/devices/${deviceId}`),
  
  // 添加设备
  addDevice: (deviceData) => API.post('/devices', deviceData),
  
  // 更新设备
  updateDevice: (deviceId, deviceData) => API.put(`/devices/${deviceId}`, deviceData),
  
  // 删除设备
  deleteDevice: (deviceId) => API.delete(`/devices/${deviceId}`),
  
  // 连接设备
  connectDevice: (deviceId) => API.post(`/devices/${deviceId}/connect`),
  
  // 断开设备连接
  disconnectDevice: (deviceId) => API.post(`/devices/${deviceId}/disconnect`),
};

// 会员相关 API
export const memberAPI = {
  // 获取所有会员
  getAllMembers: () => API.get('/members'),
  
  // 获取单个会员
  getMember: (memberId) => API.get(`/members/${memberId}`),
  
  // 添加会员
  addMember: (memberData) => API.post('/members', memberData),
  
  // 更新会员
  updateMember: (memberId, memberData) => API.put(`/members/${memberId}`, memberData),
  
  // 删除会员
  deleteMember: (memberId) => API.delete(`/members/${memberId}`),
  
  // 注册会员生物特征
  enrollMember: (enrollData) => API.post('/members/enroll', enrollData),
};

// 识别相关 API
export const recognitionAPI = {
  // 开始识别
  startRecognition: (deviceId) => API.post('/recognition/start', { device_id: deviceId }),
  
  // 停止识别
  stopRecognition: (deviceId) => API.post('/recognition/stop', { device_id: deviceId }),
  
  // 获取识别记录
  getRecords: (limit = 10) => API.get(`/recognition/records?limit=${limit}`),
};

// 仪表盘相关 API
export const dashboardAPI = {
  // 获取统计数据
  getStats: () => API.get('/dashboard/stats'),
  
  // 获取最近活动
  getRecentActivity: (limit = 10) => API.get(`/dashboard/recent-activity?limit=${limit}`),
};

export default API;
