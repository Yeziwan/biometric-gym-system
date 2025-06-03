import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, Scan, UserCheck, Clock } from 'lucide-react';
import './Recognition.css';

const Recognition = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [recentRecords, setRecentRecords] = useState([]);
  
  useEffect(() => {
    // 获取可用设备列表
    const fetchDevices = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/devices');
        setDevices(response.data);
        if (response.data.length > 0) {
          setSelectedDevice(response.data[0].id);
        }
      } catch (error) {
        console.error('获取设备列表失败:', error);
      }
    };
    
    fetchDevices();
    
    // 获取最近的识别记录
    const fetchRecentRecords = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/recognition/records?limit=5');
        setRecentRecords(response.data);
      } catch (error) {
        console.error('获取最近记录失败:', error);
      }
    };
    
    fetchRecentRecords();
    
    // 获取环境变量中的 WebSocket URL
    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws';
    
    // 设置WebSocket连接以接收实时识别结果
    const socket = new WebSocket(`${wsUrl}/recognition`);
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'recognition_result') {
        setRecognitionResult(data.result);
        // 更新最近记录
        setRecentRecords(prevRecords => [data.result, ...prevRecords.slice(0, 4)]);
      }
    };
    
    return () => {
      socket.close();
    };
  }, []);
  
  const startRecognition = async () => {
    if (!selectedDevice) {
      alert('请选择设备');
      return;
    }
    
    setIsScanning(true);
    setRecognitionResult(null);
    
    try {
      await axios.post('http://localhost:8000/api/recognition/start', {
        device_id: selectedDevice
      });
      // 实际结果将通过WebSocket接收
    } catch (error) {
      console.error('启动识别失败:', error);
      setIsScanning(false);
    }
  };
  
  const stopRecognition = async () => {
    try {
      await axios.post('http://localhost:8000/api/recognition/stop', {
        device_id: selectedDevice
      });
      setIsScanning(false);
    } catch (error) {
      console.error('停止识别失败:', error);
    }
  };
  
  // 格式化日期时间
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };
  
  return (
    <div className="recognition-container">
      <div className="recognition-header">
        <h1 className="recognition-title">会员识别</h1>
        <p className="recognition-description">
          使用生物特征识别系统验证会员身份
        </p>
      </div>
      
      <div className="recognition-content">
        <div className="recognition-control-panel">
          <div className="device-selector">
            <label htmlFor="device">选择设备</label>
            <select
              id="device"
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              disabled={isScanning}
            >
              <option value="">选择设备</option>
              {devices.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.name} ({device.ip_address})
                </option>
              ))}
            </select>
          </div>
          
          <div className="recognition-actions">
            {!isScanning ? (
              <button 
                className="start-button"
                onClick={startRecognition}
                disabled={!selectedDevice}
              >
                <Scan size={20} />
                <span>开始识别</span>
              </button>
            ) : (
              <button 
                className="stop-button"
                onClick={stopRecognition}
              >
                <span>停止识别</span>
              </button>
            )}
          </div>
        </div>
        
        <div className="recognition-display">
          <div className="camera-feed">
            {isScanning ? (
              <div className="scanning-indicator">
                <Scan size={48} className="scanning-icon" />
                <p>正在扫描...</p>
              </div>
            ) : (
              <div className="camera-placeholder">
                <Camera size={48} />
                <p>请选择设备并开始识别</p>
              </div>
            )}
          </div>
          
          {recognitionResult && (
            <div className="recognition-result">
              <div className="result-header">
                <UserCheck size={24} />
                <h3>识别结果</h3>
              </div>
              <div className="result-details">
                <div className="result-item">
                  <span className="result-label">会员ID:</span>
                  <span className="result-value">{recognitionResult.member_id}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">姓名:</span>
                  <span className="result-value">{recognitionResult.name}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">时间:</span>
                  <span className="result-value">{formatDateTime(recognitionResult.timestamp)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">状态:</span>
                  <span className={`result-status ${recognitionResult.status === 'success' ? 'success' : 'error'}`}>
                    {recognitionResult.status === 'success' ? '识别成功' : '识别失败'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="recent-records">
          <div className="records-header">
            <Clock size={20} />
            <h3>最近识别记录</h3>
          </div>
          
          {recentRecords.length > 0 ? (
            <div className="records-list">
              {recentRecords.map((record, index) => (
                <div key={index} className="record-item">
                  <div className="record-info">
                    <span className="record-name">{record.name}</span>
                    <span className="record-id">ID: {record.member_id}</span>
                  </div>
                  <div className="record-time">
                    {formatDateTime(record.timestamp)}
                  </div>
                  <div className={`record-status ${record.status === 'success' ? 'success' : 'error'}`}>
                    {record.status === 'success' ? '成功' : '失败'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-records">
              <p>暂无识别记录</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recognition;
