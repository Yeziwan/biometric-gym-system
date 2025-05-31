import React, { useState, useEffect } from 'react';
import { Monitor, Wifi, WifiOff, RefreshCw, Trash2, Plus, Download, Upload } from 'lucide-react';
import { fetchDevices, deleteDevice, connectDevice, syncDevice } from '../../services/deviceService';

const DeviceList = ({ onEdit }) => {
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(null);

  // 加载设备列表
  useEffect(() => {
    const loadDevices = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDevices();
        setDevices(data);
      } catch (error) {
        console.error('获取设备列表失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDevices();
  }, []);

  // 处理删除设备
  const handleDelete = async (deviceId) => {
    try {
      await deleteDevice(deviceId);
      setDevices(devices.filter(device => device.id !== deviceId));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('删除设备失败:', error);
      alert('删除设备失败，请重试');
    }
  };

  // 连接设备
  const handleConnect = async (deviceId) => {
    setActionInProgress(deviceId + '_connect');
    try {
      const result = await connectDevice(deviceId);
      if (result.success) {
        // 更新设备状态
        setDevices(devices.map(device => 
          device.id === deviceId 
            ? { ...device, status: 'online', last_heartbeat: new Date().toISOString() } 
            : device
        ));
      } else {
        alert('连接设备失败: ' + result.message);
      }
    } catch (error) {
      console.error('连接设备失败:', error);
      alert('连接设备失败，请重试');
    } finally {
      setActionInProgress(null);
    }
  };

  // 同步设备数据
  const handleSync = async (deviceId) => {
    setActionInProgress(deviceId + '_sync');
    try {
      const result = await syncDevice(deviceId);
      if (result.success) {
        // 更新设备指纹数量
        setDevices(devices.map(device => 
          device.id === deviceId 
            ? { ...device, fingerprint_count: result.fingerprint_count } 
            : device
        ));
        alert(`同步成功，共同步 ${result.fingerprint_count} 个指纹模板`);
      } else {
        alert('同步设备失败: ' + result.message);
      }
    } catch (error) {
      console.error('同步设备失败:', error);
      alert('同步设备失败，请重试');
    } finally {
      setActionInProgress(null);
    }
  };

  // 格式化时间
  const formatTime = (timestamp) => {
    if (!timestamp) return '未连接';
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">设备列表</h3>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                设备信息
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP地址
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                端口
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                最后连接
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                指纹数量
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  加载中...
                </td>
              </tr>
            ) : devices.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  没有找到设备
                </td>
              </tr>
            ) : (
              devices.map((device) => (
                <tr key={device.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <Monitor className="h-6 w-6 text-gray-500" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{device.name}</div>
                        <div className="text-sm text-gray-500">ID: {device.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{device.ip_address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{device.port || 4370}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {device.status === 'online' ? (
                        <>
                          <Wifi className="h-4 w-4 text-green-500 mr-1.5" />
                          <span className="text-sm text-green-600">在线</span>
                        </>
                      ) : (
                        <>
                          <WifiOff className="h-4 w-4 text-red-500 mr-1.5" />
                          <span className="text-sm text-red-600">离线</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatTime(device.last_heartbeat)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{device.fingerprint_count || 0}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2 justify-end">
                      <button 
                        onClick={() => handleConnect(device.id)}
                        disabled={device.status === 'online' || actionInProgress === device.id + '_connect'}
                        className={`text-blue-600 hover:text-blue-900 ${(device.status === 'online' || actionInProgress === device.id + '_connect') ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="连接设备"
                      >
                        {actionInProgress === device.id + '_connect' ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Wifi className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleSync(device.id)}
                        disabled={device.status !== 'online' || actionInProgress === device.id + '_sync'}
                        className={`text-green-600 hover:text-green-900 ${(device.status !== 'online' || actionInProgress === device.id + '_sync') ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="同步指纹数据"
                      >
                        {actionInProgress === device.id + '_sync' ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                      </button>
                      <button 
                        onClick={() => onEdit(device)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="编辑设备"
                      >
                        <Monitor className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => setShowDeleteConfirm(device.id)}
                        className="text-red-600 hover:text-red-900"
                        title="删除设备"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {/* 删除确认对话框 */}
                    {showDeleteConfirm === device.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                        <p className="px-4 py-2 text-sm text-gray-700">确定要删除吗？</p>
                        <div className="flex justify-end px-4 py-2 space-x-2">
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
                          >
                            取消
                          </button>
                          <button
                            onClick={() => handleDelete(device.id)}
                            className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeviceList;
