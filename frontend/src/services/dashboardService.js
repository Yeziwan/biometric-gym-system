import API from './api';

/**
 * 获取仪表板统计数据
 * @returns {Promise<Object>} 包含各种统计数据的对象
 */
export const fetchDashboardStats = async () => {
  try {
    const response = await API.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('获取仪表板统计数据失败:', error);
    throw error;
  }
};

/**
 * 获取最近的识别记录
 * @param {number} limit - 限制返回的记录数量
 * @returns {Promise<Array>} 最近的识别记录数组
 */
export const fetchRecentRecognitions = async (limit = 10) => {
  try {
    const response = await API.get(`/dashboard/recent-recognitions?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('获取最近识别记录失败:', error);
    throw error;
  }
};

/**
 * 获取按小时分布的识别统计
 * @returns {Promise<Object>} 按小时分布的识别统计数据
 */
export const fetchRecognitionsByHour = async () => {
  try {
    const response = await API.get('/dashboard/recognitions-by-hour');
    return response.data;
  } catch (error) {
    console.error('获取按小时分布的识别统计失败:', error);
    throw error;
  }
};

/**
 * 获取按设备分布的识别统计
 * @returns {Promise<Object>} 按设备分布的识别统计数据
 */
export const fetchRecognitionsByDevice = async () => {
  try {
    const response = await API.get('/dashboard/recognitions-by-device');
    return response.data;
  } catch (error) {
    console.error('获取按设备分布的识别统计失败:', error);
    throw error;
  }
};

/**
 * 获取系统概览数据
 * @returns {Promise<Object>} 系统概览数据
 */
export const fetchSystemOverview = async () => {
  try {
    const response = await API.get('/dashboard/overview');
    return response.data;
  } catch (error) {
    console.error('获取系统概览数据失败:', error);
    throw error;
  }
};
