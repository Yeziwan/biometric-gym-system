using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using ZKTecoMiddleware.Models;
using ZKTecoMiddleware.Services;

namespace ZKTecoMiddleware.Controllers
{
    [ApiController]
    [Route("api/access")]
    public class AccessControlController : ControllerBase
    {
        private readonly IFingerprintService _fingerprintService;
        private readonly IDeviceService _deviceService;
        private readonly HttpClient _httpClient;
        private readonly string _backendApiUrl = "http://localhost:8000/api";
        
        public AccessControlController(IFingerprintService fingerprintService, IDeviceService deviceService, HttpClient httpClient)
        {
            _fingerprintService = fingerprintService;
            _deviceService = deviceService;
            _httpClient = httpClient;
        }
        
        /// <summary>
        /// 处理访问控制请求（指纹识别 + 权限验证）
        /// </summary>
        [HttpPost("verify")]
        public async Task<IActionResult> VerifyAccess([FromBody] AccessVerificationRequest request)
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
                
                // 1. 进行指纹识别
                var recognitionResult = await _fingerprintService.StartRecognitionAsync(request.IpAddress);
                
                if (!recognitionResult.Success)
                {
                    // 记录访问控制日志（识别失败）
                    await LogAccessControl(null, request.DeviceId, request.AccessType, "denied", "指纹识别失败", "fingerprint");
                    
                    return Ok(new { 
                        success = false, 
                        message = "指纹识别失败",
                        allowed = false,
                        reason = "指纹识别失败"
                    });
                }
                
                // 2. 调用后端API进行权限验证
                var accessControlRequest = new
                {
                    member_id = recognitionResult.UserId,
                    device_id = request.DeviceId,
                    access_type = request.AccessType,
                    recognition_method = "fingerprint"
                };
                
                var json = JsonSerializer.Serialize(accessControlRequest);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                
                var response = await _httpClient.PostAsync($"{_backendApiUrl}/access/control", content);
                
                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var accessResult = JsonSerializer.Deserialize<AccessControlResult>(responseContent, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                    
                    // 3. 处理考勤记录（如果访问被允许）
                    if (accessResult.Allowed)
                    {
                        await ProcessAttendance(recognitionResult.UserId, request.DeviceId, request.AccessType);
                    }
                    
                    return Ok(new { 
                        success = true, 
                        message = accessResult.Allowed ? "访问允许" : "访问拒绝",
                        allowed = accessResult.Allowed,
                        reason = accessResult.Reason,
                        memberInfo = accessResult.MemberInfo,
                        userId = recognitionResult.UserId,
                        confidence = recognitionResult.Confidence,
                        recognitionTime = recognitionResult.RecognitionTime
                    });
                }
                else
                {
                    // 后端API调用失败，记录日志
                    await LogAccessControl(recognitionResult.UserId, request.DeviceId, request.AccessType, "denied", "系统错误", "fingerprint");
                    
                    return StatusCode(500, new { 
                        success = false, 
                        message = "访问控制系统错误",
                        allowed = false,
                        reason = "系统错误"
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"访问控制异常: {ex.Message}" });
            }
        }
        
        /// <summary>
        /// 仅进行指纹识别（不进行权限验证）
        /// </summary>
        [HttpPost("recognize-only")]
        public async Task<IActionResult> RecognizeOnly([FromBody] FingerprintRecognitionRequest request)
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
                
                var result = await _fingerprintService.StartRecognitionAsync(request.IpAddress);
                
                return Ok(new { 
                    success = result.Success, 
                    message = result.Success ? "指纹识别成功" : result.Message,
                    userId = result.UserId,
                    confidence = result.Confidence,
                    recognitionTime = result.RecognitionTime
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"指纹识别异常: {ex.Message}" });
            }
        }
        
        /// <summary>
        /// 手动签到签退
        /// </summary>
        [HttpPost("manual-checkin")]
        public async Task<IActionResult> ManualCheckIn([FromBody] ManualCheckInRequest request)
        {
            try
            {
                var checkInRequest = new
                {
                    member_id = request.MemberId,
                    device_id = request.DeviceId,
                    check_type = request.CheckType
                };
                
                var json = JsonSerializer.Serialize(checkInRequest);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                
                var response = await _httpClient.PostAsync($"{_backendApiUrl}/attendance/check", content);
                
                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var checkResult = JsonSerializer.Deserialize<CheckInOutResult>(responseContent, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
                    
                    return Ok(new { 
                        success = checkResult.Success, 
                        message = checkResult.Message,
                        recordId = checkResult.RecordId,
                        checkTime = checkResult.CheckTime
                    });
                }
                else
                {
                    return StatusCode(500, new { success = false, message = "考勤系统错误" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"手动签到签退异常: {ex.Message}" });
            }
        }
        
        /// <summary>
        /// 记录访问控制日志
        /// </summary>
        private async Task LogAccessControl(int? memberId, int deviceId, string accessType, string status, string reason, string recognitionMethod)
        {
            try
            {
                var logRequest = new
                {
                    member_id = memberId,
                    device_id = deviceId,
                    access_type = accessType,
                    status = status,
                    reason = reason,
                    recognition_method = recognitionMethod
                };
                
                var json = JsonSerializer.Serialize(logRequest);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                
                // 异步记录日志，不等待结果
                _ = Task.Run(async () =>
                {
                    try
                    {
                        await _httpClient.PostAsync($"{_backendApiUrl}/access/logs", content);
                    }
                    catch
                    {
                        // 忽略日志记录错误
                    }
                });
            }
            catch
            {
                // 忽略日志记录错误
            }
        }
        
        /// <summary>
        /// 处理考勤记录
        /// </summary>
        private async Task ProcessAttendance(int memberId, int deviceId, string accessType)
        {
            try
            {
                // 根据访问类型确定签到或签退
                string checkType = accessType == "entry" ? "check_in" : "check_out";
                
                var attendanceRequest = new
                {
                    member_id = memberId,
                    device_id = deviceId,
                    check_type = checkType
                };
                
                var json = JsonSerializer.Serialize(attendanceRequest);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                
                // 异步处理考勤，不等待结果
                _ = Task.Run(async () =>
                {
                    try
                    {
                        await _httpClient.PostAsync($"{_backendApiUrl}/attendance/check", content);
                    }
                    catch
                    {
                        // 忽略考勤记录错误
                    }
                });
            }
            catch
            {
                // 忽略考勤记录错误
            }
        }
        
        /// <summary>
        /// 获取设备今日访问统计
        /// </summary>
        [HttpGet("device-stats/{deviceId}")]
        public async Task<IActionResult> GetDeviceStats(int deviceId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_backendApiUrl}/access/logs?device_id={deviceId}&limit=1000");
                
                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    // 这里可以进一步处理统计数据
                    
                    return Ok(new { success = true, data = responseContent });
                }
                else
                {
                    return StatusCode(500, new { success = false, message = "获取设备统计失败" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"获取设备统计异常: {ex.Message}" });
            }
        }
    }
} 