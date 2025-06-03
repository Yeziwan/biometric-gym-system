import { create } from 'zustand';
import { recognitionAPI } from '../services/api';

const useRecognitionStore = create((set) => ({
  // 状态
  isScanning: false,
  records: [],
  currentResult: null,
  isLoading: false,
  error: null,
  
  // 开始识别
  startRecognition: async (deviceId) => {
    set({ isLoading: true, error: null });
    try {
      await recognitionAPI.startRecognition(deviceId);
      set({ isScanning: true, isLoading: false });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || '启动识别失败', 
        isLoading: false 
      });
      return false;
    }
  },
  
  // 停止识别
  stopRecognition: async (deviceId) => {
    set({ isLoading: true, error: null });
    try {
      await recognitionAPI.stopRecognition(deviceId);
      set({ isScanning: false, isLoading: false });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || '停止识别失败', 
        isLoading: false 
      });
      return false;
    }
  },
  
  // 获取识别记录
  fetchRecords: async (limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await recognitionAPI.getRecords(limit);
      set({ records: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || '获取识别记录失败', 
        isLoading: false 
      });
    }
  },
  
  // 设置当前识别结果（通常由 WebSocket 更新）
  setCurrentResult: (result) => {
    set({ currentResult: result });
    // 同时更新记录列表
    set(state => ({
      records: [result, ...state.records.slice(0, 9)] // 保持最多10条记录
    }));
  },
  
  // 清除当前识别结果
  clearCurrentResult: () => set({ currentResult: null }),
  
  // 清除错误
  clearError: () => set({ error: null }),
}));

export default useRecognitionStore;
