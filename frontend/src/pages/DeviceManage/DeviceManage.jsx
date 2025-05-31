import React, { useState } from 'react';
import { Plus, Monitor, X } from 'lucide-react';
import DeviceList from '../../components/Device/DeviceList';
import { createDevice, updateDevice } from '../../services/deviceService';

const DeviceManage = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentDevice, setCurrentDevice] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    ip_address: '',
    port: '4370'
  });

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // 打开编辑表单
  const handleEdit = (device) => {
    setCurrentDevice(device);
    setFormData({
      name: device.name,
      ip_address: device.ip_address,
      port: device.port || '4370'
    });
    setShowEditForm(true);
  };

  // 提交新增设备表单
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDevice(formData);
      setShowAddForm(false);
      setFormData({
        name: '',
        ip_address: '',
        port: '4370'
      });
      // 刷新设备列表
      window.location.reload();
    } catch (error) {
      console.error('添加设备失败:', error);
      alert('添加设备失败，请重试');
    }
  };

  // 提交编辑设备表单
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDevice(currentDevice.id, formData);
      setShowEditForm(false);
      setCurrentDevice(null);
      // 刷新设备列表
      window.location.reload();
    } catch (error) {
      console.error('更新设备失败:', error);
      alert('更新设备失败，请重试');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">设备管理</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-1" />
          添加设备
        </button>
      </div>

      {/* 设备列表 */}
      <DeviceList onEdit={handleEdit} />

      {/* 添加设备表单 */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">添加设备</h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    设备名称
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例如：前台指纹机"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IP地址
                  </label>
                  <input
                    type="text"
                    name="ip_address"
                    value={formData.ip_address}
                    onChange={handleInputChange}
                    required
                    pattern="^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例如：192.168.1.100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    端口
                  </label>
                  <input
                    type="text"
                    name="port"
                    value={formData.port}
                    onChange={handleInputChange}
                    required
                    pattern="^[0-9]{1,5}$"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="默认：4370"
                  />
                  <p className="mt-1 text-xs text-gray-500">ZKTeco设备默认端口为4370</p>
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Monitor className="h-5 w-5 mr-1" />
                  添加设备
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 编辑设备表单 */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">编辑设备</h3>
              <button 
                onClick={() => setShowEditForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    设备名称
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IP地址
                  </label>
                  <input
                    type="text"
                    name="ip_address"
                    value={formData.ip_address}
                    onChange={handleInputChange}
                    required
                    pattern="^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    端口
                  </label>
                  <input
                    type="text"
                    name="port"
                    value={formData.port}
                    onChange={handleInputChange}
                    required
                    pattern="^[0-9]{1,5}$"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Monitor className="h-5 w-5 mr-1" />
                  保存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManage;
