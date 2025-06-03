import { create } from 'zustand';
import { deviceAPI } from '../services/api';

const useDeviceStore = create((set, get) => ({
  // 状态
  devices: [],
  selectedDevice: null,
  isLoading: false,
  error: null,
  
  // 获取所有设备
  fetchDevices: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await deviceAPI.getAllDevices();
      set({ devices: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || '获取设备列表失败', 
        isLoading: false 
      });
    }
  },
  
  // 获取单个设备
  fetchDevice: async (deviceId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await deviceAPI.getDevice(deviceId);
      set({ selectedDevice: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || '获取设备详情失败', 
        isLoading: false 
      });
      return null;
    }
  },
  
  // 添加设备
  addDevice: async (deviceData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await deviceAPI.addDevice(deviceData);
      set(state => ({ 
        devices: [...state.devices, response.data], 
        isLoading: false 
      }));
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || '添加设备失败', 
        isLoading: false 
      });
      return null;
    }
  },
  
  // 更新设备
  updateDevice: async (deviceId, deviceData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await deviceAPI.updateDevice(deviceId, deviceData);
      set(state => ({
        devices: state.devices.map(device => 
          device.id === deviceId ? response.data : device
        ),
        selectedDevice: response.data,
        isLoading: false
      }));
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || '更新设备失败', 
        isLoading: false 
      });
      return null;
    }
  },
  
  // 删除设备
  deleteDevice: async (deviceId) => {
    set({ isLoading: true, error: null });
    try {
      await deviceAPI.deleteDevice(deviceId);
      set(state => ({
        devices: state.devices.filter(device => device.id !== deviceId),
        selectedDevice: state.selectedDevice?.id === deviceId ? null : state.selectedDevice,
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || '删除设备失败', 
        isLoading: false 
      });
      return false;
    }
  },
  
  // 连接设备
  connectDevice: async (deviceId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await deviceAPI.connectDevice(deviceId);
      set(state => ({
        devices: state.devices.map(device => 
          device.id === deviceId ? { ...device, status: 'connected' } : device
        ),
        isLoading: false
      }));
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || '连接设备失败', 
        isLoading: false 
      });
      return null;
    }
  },
  
  // 断开设备连接
  disconnectDevice: async (deviceId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await deviceAPI.disconnectDevice(deviceId);
      set(state => ({
        devices: state.devices.map(device => 
          device.id === deviceId ? { ...device, status: 'disconnected' } : device
        ),
        isLoading: false
      }));
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || '断开设备连接失败', 
        isLoading: false 
      });
      return null;
    }
  },
  
  // 选择设备
  selectDevice: (deviceId) => {
    const device = get().devices.find(d => d.id === deviceId) || null;
    set({ selectedDevice: device });
  },
  
  // 清除错误
  clearError: () => set({ error: null }),
}));

export default useDeviceStore;
