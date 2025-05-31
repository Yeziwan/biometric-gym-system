using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ZKTecoMiddleware.Models;

namespace ZKTecoMiddleware.Services
{
    public interface IDeviceService
    {
        /// <summary>
        /// 连接到指纹设备
        /// </summary>
        /// <param name="ipAddress">设备IP地址</param>
        /// <param name="port">设备端口号</param>
        /// <returns>连接结果</returns>
        Task<DeviceConnectionResult> ConnectAsync(string ipAddress, int port);
        
        /// <summary>
        /// 断开与指纹设备的连接
        /// </summary>
        /// <param name="ipAddress">设备IP地址</param>
        /// <returns>断开连接结果</returns>
        Task<DeviceConnectionResult> DisconnectAsync(string ipAddress);
        
        /// <summary>
        /// 获取设备信息
        /// </summary>
        /// <param name="ipAddress">设备IP地址</param>
        /// <returns>设备信息</returns>
        Task<DeviceInfo> GetDeviceInfoAsync(string ipAddress);
        
        /// <summary>
        /// 同步设备数据
        /// </summary>
        /// <param name="ipAddress">设备IP地址</param>
        /// <returns>同步结果</returns>
        Task<DeviceSyncResult> SyncDataAsync(string ipAddress);
        
        /// <summary>
        /// 获取设备连接状态
        /// </summary>
        /// <param name="ipAddress">设备IP地址</param>
        /// <returns>设备是否在线</returns>
        bool IsDeviceConnected(string ipAddress);
    }
}
