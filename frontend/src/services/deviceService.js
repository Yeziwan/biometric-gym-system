import API from './api';

/**
 * 获取所有设备列表
 * @returns {Promise<Array>} 设备列表
 */
export const fetchDevices = async () => {
  try {
    const response = await API.get('/devices');
    return response.data;
  } catch (error) {
    console.error('获取设备列表失败:', error);
    throw error;
  }
};

/**
 * 获取单个设备详情
 * @param {string} deviceId - 设备ID
 * @returns {Promise<Object>} 设备详情
 */
export const fetchDeviceById = async (deviceId) => {
  try {
    const response = await API.get(`/devices/${deviceId}`);
    return response.data;
  } catch (error) {
    console.error(`获取设备 ${deviceId} 详情失败:`, error);
    throw error;
  }
};

/**
 * 创建新设备
 * @param {Object} deviceData - 设备数据
 * @returns {Promise<Object>} 创建的设备
 */
export const createDevice = async (deviceData) => {
  try {
    const response = await API.post('/devices', deviceData);
    return response.data;
  } catch (error) {
    console.error('创建设备失败:', error);
    throw error;
  }
};

/**
 * 更新设备信息
 * @param {string} deviceId - 设备ID
 * @param {Object} deviceData - 更新的设备数据
 * @returns {Promise<Object>} 更新后的设备
 */
export const updateDevice = async (deviceId, deviceData) => {
  try {
    const response = await API.put(`/devices/${deviceId}`, deviceData);
    return response.data;
  } catch (error) {
    console.error(`更新设备 ${deviceId} 失败:`, error);
    throw error;
  }
};

/**
 * 删除设备
 * @param {string} deviceId - 设备ID
 * @returns {Promise<void>}
 */
export const deleteDevice = async (deviceId) => {
  try {
    await API.delete(`/devices/${deviceId}`);
  } catch (error) {
    console.error(`删除设备 ${deviceId} 失败:`, error);
    throw error;
  }
};

/**
 * 连接设备
 * @param {string} deviceId - 设备ID
 * @returns {Promise<Object>} 连接结果
 */
export const connectDevice = async (deviceId) => {
  try {
    const response = await API.post(`/devices/${deviceId}/connect`);
    return response.data;
  } catch (error) {
    console.error(`连接设备 ${deviceId} 失败:`, error);
    throw error;
  }
};

/**
 * 断开设备连接
 * @param {string} deviceId - 设备ID
 * @returns {Promise<Object>} 断开连接结果
 */
export const disconnectDevice = async (deviceId) => {
  try {
    const response = await API.post(`/devices/${deviceId}/disconnect`);
    return response.data;
  } catch (error) {
    console.error(`断开设备 ${deviceId} 连接失败:`, error);
    throw error;
  }
};

/**
 * 获取设备状态
 * @param {string} deviceId - 设备ID
 * @returns {Promise<Object>} 设备状态
 */
export const getDeviceStatus = async (deviceId) => {
  try {
    const response = await API.get(`/devices/${deviceId}/status`);
    return response.data;
  } catch (error) {
    console.error(`获取设备 ${deviceId} 状态失败:`, error);
    throw error;
  }
};
