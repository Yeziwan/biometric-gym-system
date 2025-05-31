using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using ZKTecoMiddleware.Models;
using ZKTecoMiddleware.Services;

namespace ZKTecoMiddleware.Controllers
{
    [ApiController]
    [Route("api/device")]
    public class DeviceController : ControllerBase
    {
        private readonly IDeviceService _deviceService;
        
        public DeviceController(IDeviceService deviceService)
        {
            _deviceService = deviceService;
        }
        
        /// <summary>
        /// 连接到指纹设备
        /// </summary>
        [HttpPost("connect")]
        public async Task<IActionResult> Connect([FromBody] DeviceConnectRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.IpAddress))
                {
                    return BadRequest(new { success = false, message = "IP地址不能为空" });
                }
                
                var result = await _deviceService.ConnectAsync(request.IpAddress, request.Port);
                
                if (result.Success)
                {
                    return Ok(new { success = true, message = "设备连接成功", deviceInfo = result.DeviceInfo });
                }
                else
                {
                    return BadRequest(new { success = false, message = result.Message });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"设备连接异常: {ex.Message}" });
            }
        }
        
        /// <summary>
        /// 断开与指纹设备的连接
        /// </summary>
        [HttpPost("disconnect")]
        public async Task<IActionResult> Disconnect([FromBody] DeviceConnectRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.IpAddress))
                {
                    return BadRequest(new { success = false, message = "IP地址不能为空" });
                }
                
                var result = await _deviceService.DisconnectAsync(request.IpAddress);
                
                if (result.Success)
                {
                    return Ok(new { success = true, message = "设备断开连接成功" });
                }
                else
                {
                    return BadRequest(new { success = false, message = result.Message });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"设备断开连接异常: {ex.Message}" });
            }
        }
        
        /// <summary>
        /// 获取设备信息
        /// </summary>
        [HttpGet("info/{ipAddress}")]
        public async Task<IActionResult> GetDeviceInfo(string ipAddress)
        {
            try
            {
                if (string.IsNullOrEmpty(ipAddress))
                {
                    return BadRequest(new { success = false, message = "IP地址不能为空" });
                }
                
                var deviceInfo = await _deviceService.GetDeviceInfoAsync(ipAddress);
                
                if (deviceInfo != null)
                {
                    return Ok(new { success = true, deviceInfo });
                }
                else
                {
                    return NotFound(new { success = false, message = "未找到设备信息" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"获取设备信息异常: {ex.Message}" });
            }
        }
        
        /// <summary>
        /// 同步设备数据
        /// </summary>
        [HttpPost("sync")]
        public async Task<IActionResult> SyncData([FromBody] DeviceConnectRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.IpAddress))
                {
                    return BadRequest(new { success = false, message = "IP地址不能为空" });
                }
                
                if (!_deviceService.IsDeviceConnected(request.IpAddress))
                {
                    return BadRequest(new { success = false, message = "设备未连接，请先连接设备" });
                }
                
                var result = await _deviceService.SyncDataAsync(request.IpAddress);
                
                if (result.Success)
                {
                    return Ok(new { 
                        success = true, 
                        message = "数据同步成功", 
                        fingerprintCount = result.FingerprintCount,
                        userCount = result.UserCount,
                        logCount = result.LogCount
                    });
                }
                else
                {
                    return BadRequest(new { success = false, message = result.Message });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"数据同步异常: {ex.Message}" });
            }
        }
        
        /// <summary>
        /// 检查设备连接状态
        /// </summary>
        [HttpGet("status/{ipAddress}")]
        public IActionResult GetDeviceStatus(string ipAddress)
        {
            try
            {
                if (string.IsNullOrEmpty(ipAddress))
                {
                    return BadRequest(new { success = false, message = "IP地址不能为空" });
                }
                
                bool isConnected = _deviceService.IsDeviceConnected(ipAddress);
                
                return Ok(new { success = true, isConnected });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"获取设备状态异常: {ex.Message}" });
            }
        }
    }
}
