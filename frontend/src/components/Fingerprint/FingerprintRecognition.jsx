import React, { useState, useEffect } from 'react';
import { Eye, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useWebSocket } from '../../services/websocketService';
import { startRecognition } from '../../services/fingerprintService';

const FingerprintRecognition = () => {
  const [selectedDevice, setSelectedDevice] = useState('');
  const [devices, setDevices] = useState([]);
  const [recognitionStatus, setRecognitionStatus] = useState('');
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { socket, lastMessage } = useWebSocket();

  // 监听WebSocket消息
  useEffect(() => {
    if (lastMessage && lastMessage.type === 'recognition_status') {
      setRecognitionStatus(lastMessage.message);
      
      if (lastMessage.status === 'success' || lastMessage.status === 'failed') {
        setIsLoading(false);
        setRecognitionResult(lastMessage.data);
      } else if (lastMessage.status === 'error') {
        setIsLoading(false);
      }
    }
  }, [lastMessage]);

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

  // 开始指纹识别
  const handleStartRecognition = async () => {
    if (!selectedDevice) {
      alert('请选择设备');
      return;
    }

    setIsLoading(true);
    setRecognitionStatus('准备开始识别...');
    setRecognitionResult(null);

    try {
      await startRecognition({
        deviceId: selectedDevice
      });
    } catch (error) {
      console.error('指纹识别请求失败:', error);
      setRecognitionStatus('识别请求失败，请重试');
      setIsLoading(false);
    }
  };

  // 格式化时间
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">指纹识别</h3>
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
        
        <button
          onClick={handleStartRecognition}
          disabled={!selectedDevice || isLoading}
          className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Eye className="h-5 w-5 mr-2" />
          开始识别
        </button>
        
        {recognitionStatus && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-green-700">{recognitionStatus}</p>
            </div>
          </div>
        )}
        
        {recognitionResult && (
          <div className={`p-4 ${recognitionResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-lg mt-4`}>
            <div className="flex items-start">
              {recognitionResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              )}
              <div>
                <p className={`font-medium ${recognitionResult.success ? 'text-green-700' : 'text-red-700'}`}>
                  {recognitionResult.success ? '识别成功' : '识别失败'}
                </p>
                {recognitionResult.success && (
                  <>
                    <p className="text-sm text-gray-700 mt-1">会员: {recognitionResult.member.name}</p>
                    <p className="text-sm text-gray-700">手机: {recognitionResult.member.phone}</p>
                    <p className="text-sm text-gray-500 mt-2">识别时间: {formatTime(recognitionResult.timestamp)}</p>
                    <p className="text-sm text-gray-500">置信度: {Math.round(recognitionResult.confidence * 100)}%</p>
                  </>
                )}
                {!recognitionResult.success && (
                  <p className="text-sm text-gray-700 mt-1">
                    未能识别此指纹，请确保指纹已录入系统
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FingerprintRecognition;
