import React, { useState, useEffect } from 'react';
import { Fingerprint, AlertCircle } from 'lucide-react';
import { useWebSocket } from '../../services/websocketService';
import { enrollFingerprint } from '../../services/fingerprintService';

const FingerprintEnrollment = ({ memberId, onComplete }) => {
  const [selectedDevice, setSelectedDevice] = useState('');
  const [devices, setDevices] = useState([]);
  const [enrollmentStatus, setEnrollmentStatus] = useState('');
  const [fingerIndex, setFingerIndex] = useState(1); // 默认为食指
  const [isLoading, setIsLoading] = useState(false);
  const { socket, lastMessage } = useWebSocket();

  // 监听WebSocket消息
  useEffect(() => {
    if (lastMessage && lastMessage.type === 'enrollment_status') {
      setEnrollmentStatus(lastMessage.message);
      
      if (lastMessage.status === 'success') {
        setIsLoading(false);
        if (onComplete) {
          onComplete(lastMessage.data);
        }
      } else if (lastMessage.status === 'error') {
        setIsLoading(false);
      }
    }
  }, [lastMessage, onComplete]);

  // 加载设备列表
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch('/api/devices?status=online');
        const data = await response.json();
        if (data.success) {
          setDevices(data.devices);
        }
      } catch (error) {
        console.error('获取设备列表失败:', error);
      }
    };

    fetchDevices();
  }, []);

  // 开始录入指纹
  const handleStartEnrollment = async () => {
    if (!selectedDevice) {
      alert('请选择设备');
      return;
    }

    setIsLoading(true);
    setEnrollmentStatus('准备开始录入...');

    try {
      await enrollFingerprint({
        memberId,
        deviceId: selectedDevice,
        fingerIndex
      });
    } catch (error) {
      console.error('指纹录入请求失败:', error);
      setEnrollmentStatus('录入请求失败，请重试');
      setIsLoading(false);
    }
  };

  // 指纹位置选项
  const fingerOptions = [
    { value: 1, label: '右手拇指' },
    { value: 2, label: '右手食指' },
    { value: 3, label: '右手中指' },
    { value: 4, label: '右手无名指' },
    { value: 5, label: '右手小指' },
    { value: 6, label: '左手拇指' },
    { value: 7, label: '左手食指' },
    { value: 8, label: '左手中指' },
    { value: 9, label: '左手无名指' },
    { value: 10, label: '左手小指' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">录入指纹</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            选择设备
          </label>
          <select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          >
            <option value="">请选择设备</option>
            {devices.map((device) => (
              <option key={device.id} value={device.id}>
                {device.name} ({device.ip_address})
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            选择手指
          </label>
          <select
            value={fingerIndex}
            onChange={(e) => setFingerIndex(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          >
            {fingerOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <button
          onClick={handleStartEnrollment}
          disabled={!selectedDevice || isLoading}
          className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Fingerprint className="h-5 w-5 mr-2" />
          开始录入指纹
        </button>
        
        {enrollmentStatus && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
              <p className="text-blue-700">{enrollmentStatus}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FingerprintEnrollment;
