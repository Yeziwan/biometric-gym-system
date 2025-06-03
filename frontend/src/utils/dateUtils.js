/**
 * 日期和时间相关的工具函数
 */

/**
 * 格式化日期时间为本地字符串
 * @param {string|Date} dateTime - 日期时间字符串或Date对象
 * @returns {string} 格式化后的日期时间字符串
 */
export const formatDateTime = (dateTime) => {
  if (!dateTime) return '';
  
  const date = dateTime instanceof Date ? dateTime : new Date(dateTime);
  
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return '';
  }
  
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

/**
 * 格式化日期为本地字符串
 * @param {string|Date} date - 日期字符串或Date对象
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // 检查日期是否有效
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  return dateObj.toLocaleDateString();
};

/**
 * 格式化时间为本地字符串
 * @param {string|Date} time - 时间字符串或Date对象
 * @returns {string} 格式化后的时间字符串
 */
export const formatTime = (time) => {
  if (!time) return '';
  
  const dateObj = time instanceof Date ? time : new Date(time);
  
  // 检查日期是否有效
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  return dateObj.toLocaleTimeString();
};

/**
 * 获取相对时间描述（例如：5分钟前、1小时前等）
 * @param {string|Date} dateTime - 日期时间字符串或Date对象
 * @returns {string} 相对时间描述
 */
export const getRelativeTime = (dateTime) => {
  if (!dateTime) return '';
  
  const date = dateTime instanceof Date ? dateTime : new Date(dateTime);
  
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return '';
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds}秒前`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}小时前`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}天前`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}个月前`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}年前`;
};
