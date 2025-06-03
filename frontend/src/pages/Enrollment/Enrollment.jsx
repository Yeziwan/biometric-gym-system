import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, UserPlus, CheckCircle, AlertCircle } from 'lucide-react';
import './Enrollment.css';

const Enrollment = () => {
  const [memberId, setMemberId] = useState('');
  const [name, setName] = useState('');
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
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
  }, []);
  
  const handleEnroll = async (e) => {
    e.preventDefault();
    
    if (!memberId || !name || !selectedDevice) {
      alert('请填写所有必填字段');
      return;
    }
    
    setIsLoading(true);
    setEnrollmentStatus(null);
    
    try {
      const response = await axios.post('http://localhost:8000/api/members/enroll', {
        member_id: memberId,
        name: name,
        device_id: selectedDevice
      });
      
      setEnrollmentStatus({
        success: true,
        message: '会员注册成功！'
      });
      
      // 重置表单
      setMemberId('');
      setName('');
    } catch (error) {
      setEnrollmentStatus({
        success: false,
        message: error.response?.data?.detail || '会员注册失败，请重试。'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="enrollment-container">
      <div className="enrollment-header">
        <h1 className="enrollment-title">会员注册</h1>
        <p className="enrollment-description">
          注册新会员并采集生物特征数据
        </p>
      </div>
      
      <div className="enrollment-content">
        <div className="enrollment-form-container">
          <form className="enrollment-form" onSubmit={handleEnroll}>
            <div className="form-group">
              <label htmlFor="memberId">会员ID</label>
              <input
                type="text"
                id="memberId"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                placeholder="输入会员ID"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="name">会员姓名</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="输入会员姓名"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="device">选择设备</label>
              <select
                id="device"
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                required
              >
                <option value="">选择设备</option>
                {devices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.name} ({device.ip_address})
                  </option>
                ))}
              </select>
            </div>
            
            <button
              type="submit"
              className="enroll-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>处理中...</span>
              ) : (
                <>
                  <UserPlus size={20} />
                  <span>注册会员</span>
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="enrollment-preview">
          <div className="camera-preview">
            <div className="camera-placeholder">
              <Camera size={48} />
              <p>请按下注册按钮开始采集生物特征</p>
            </div>
          </div>
          
          {enrollmentStatus && (
            <div className={`enrollment-status ${enrollmentStatus.success ? 'success' : 'error'}`}>
              {enrollmentStatus.success ? (
                <CheckCircle size={24} />
              ) : (
                <AlertCircle size={24} />
              )}
              <p>{enrollmentStatus.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Enrollment;
