using System;
using System.Collections.Generic;

namespace ZKTecoMiddleware.Models
{
    /// <summary>
    /// 设备连接结果
    /// </summary>
    public class DeviceConnectionResult
    {
        /// <summary>
        /// 操作是否成功
        /// </summary>
        public bool Success { get; set; }
        
        /// <summary>
        /// 结果消息
        /// </summary>
        public string Message { get; set; }
        
        /// <summary>
        /// 设备信息（如果连接成功）
        /// </summary>
        public DeviceInfo DeviceInfo { get; set; }
    }
    
    /// <summary>
    /// 设备信息
    /// </summary>
    public class DeviceInfo
    {
        /// <summary>
        /// 设备IP地址
        /// </summary>
        public string IpAddress { get; set; }
        
        /// <summary>
        /// 设备端口号
        /// </summary>
        public int Port { get; set; }
        
        /// <summary>
        /// 设备序列号
        /// </summary>
        public string SerialNumber { get; set; }
        
        /// <summary>
        /// 设备型号
        /// </summary>
        public string Model { get; set; }
        
        /// <summary>
        /// 设备固件版本
        /// </summary>
        public string FirmwareVersion { get; set; }
        
        /// <summary>
        /// 设备上的指纹数量
        /// </summary>
        public int FingerprintCount { get; set; }
        
        /// <summary>
        /// 设备连接状态
        /// </summary>
        public bool IsConnected { get; set; }
        
        /// <summary>
        /// 最后连接时间
        /// </summary>
        public DateTime LastConnected { get; set; }
    }
    
    /// <summary>
    /// 设备同步结果
    /// </summary>
    public class DeviceSyncResult
    {
        /// <summary>
        /// 操作是否成功
        /// </summary>
        public bool Success { get; set; }
        
        /// <summary>
        /// 结果消息
        /// </summary>
        public string Message { get; set; }
        
        /// <summary>
        /// 同步的指纹数量
        /// </summary>
        public int FingerprintCount { get; set; }
        
        /// <summary>
        /// 同步的用户数量
        /// </summary>
        public int UserCount { get; set; }
        
        /// <summary>
        /// 同步的记录数量
        /// </summary>
        public int LogCount { get; set; }
    }
    
    /// <summary>
    /// 设备连接请求
    /// </summary>
    public class DeviceConnectRequest
    {
        /// <summary>
        /// 设备IP地址
        /// </summary>
        public string IpAddress { get; set; }
        
        /// <summary>
        /// 设备端口号
        /// </summary>
        public int Port { get; set; }
    }
}
