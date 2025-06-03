import API from './api';

/**
 * 获取所有会员列表
 * @param {Object} params - 查询参数
 * @returns {Promise<Array>} 会员列表
 */
export const fetchMembers = async (params = {}) => {
  try {
    const response = await API.get('/members', { params });
    return response.data;
  } catch (error) {
    console.error('获取会员列表失败:', error);
    throw error;
  }
};

/**
 * 获取单个会员详情
 * @param {string} memberId - 会员ID
 * @returns {Promise<Object>} 会员详情
 */
export const fetchMemberById = async (memberId) => {
  try {
    const response = await API.get(`/members/${memberId}`);
    return response.data;
  } catch (error) {
    console.error(`获取会员 ${memberId} 详情失败:`, error);
    throw error;
  }
};

/**
 * 创建新会员
 * @param {Object} memberData - 会员数据
 * @returns {Promise<Object>} 创建的会员
 */
export const createMember = async (memberData) => {
  try {
    const response = await API.post('/members', memberData);
    return response.data;
  } catch (error) {
    console.error('创建会员失败:', error);
    throw error;
  }
};

/**
 * 更新会员信息
 * @param {string} memberId - 会员ID
 * @param {Object} memberData - 更新的会员数据
 * @returns {Promise<Object>} 更新后的会员
 */
export const updateMember = async (memberId, memberData) => {
  try {
    const response = await API.put(`/members/${memberId}`, memberData);
    return response.data;
  } catch (error) {
    console.error(`更新会员 ${memberId} 失败:`, error);
    throw error;
  }
};

/**
 * 删除会员
 * @param {string} memberId - 会员ID
 * @returns {Promise<void>}
 */
export const deleteMember = async (memberId) => {
  try {
    await API.delete(`/members/${memberId}`);
  } catch (error) {
    console.error(`删除会员 ${memberId} 失败:`, error);
    throw error;
  }
};

/**
 * 为会员注册指纹
 * @param {string} memberId - 会员ID
 * @param {Object} fingerprintData - 指纹数据
 * @returns {Promise<Object>} 注册结果
 */
export const enrollFingerprint = async (memberId, fingerprintData) => {
  try {
    const response = await API.post(`/members/${memberId}/fingerprints`, fingerprintData);
    return response.data;
  } catch (error) {
    console.error(`为会员 ${memberId} 注册指纹失败:`, error);
    throw error;
  }
};

/**
 * 获取会员的指纹列表
 * @param {string} memberId - 会员ID
 * @returns {Promise<Array>} 指纹列表
 */
export const fetchMemberFingerprints = async (memberId) => {
  try {
    const response = await API.get(`/members/${memberId}/fingerprints`);
    return response.data;
  } catch (error) {
    console.error(`获取会员 ${memberId} 的指纹列表失败:`, error);
    throw error;
  }
};

/**
 * 删除会员的指纹
 * @param {string} memberId - 会员ID
 * @param {string} fingerprintId - 指纹ID
 * @returns {Promise<void>}
 */
export const deleteMemberFingerprint = async (memberId, fingerprintId) => {
  try {
    await API.delete(`/members/${memberId}/fingerprints/${fingerprintId}`);
  } catch (error) {
    console.error(`删除会员 ${memberId} 的指纹 ${fingerprintId} 失败:`, error);
    throw error;
  }
};
