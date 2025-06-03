/**
 * 格式化和验证相关的工具函数
 */

/**
 * 格式化设备状态为中文描述
 * @param {string} status - 设备状态
 * @returns {string} 格式化后的状态描述
 */
export const formatDeviceStatus = (status) => {
  const statusMap = {
    'connected': '已连接',
    'disconnected': '未连接',
    'error': '错误',
    'initializing': '初始化中'
  };
  
  return statusMap[status] || status || '未知';
};

/**
 * 格式化识别结果状态为中文描述
 * @param {string} status - 识别结果状态
 * @returns {string} 格式化后的状态描述
 */
export const formatRecognitionStatus = (status) => {
  const statusMap = {
    'success': '识别成功',
    'failed': '识别失败',
    'error': '错误',
    'timeout': '超时'
  };
  
  return statusMap[status] || status || '未知';
};

/**
 * 验证IP地址格式是否正确
 * @param {string} ip - IP地址
 * @returns {boolean} 是否为有效的IP地址
 */
export const isValidIPAddress = (ip) => {
  if (!ip) return false;
  
  // IPv4地址正则表达式
  const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  
  return ipv4Pattern.test(ip);
};

/**
 * 验证端口号是否有效
 * @param {string|number} port - 端口号
 * @returns {boolean} 是否为有效的端口号
 */
export const isValidPort = (port) => {
  const portNumber = parseInt(port, 10);
  return !isNaN(portNumber) && portNumber >= 0 && portNumber <= 65535;
};

/**
 * 截断文本并添加省略号
 * @param {string} text - 原始文本
 * @param {number} maxLength - 最大长度
 * @returns {string} 截断后的文本
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength) + '...';
};
