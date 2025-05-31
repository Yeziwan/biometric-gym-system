using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using ZKTecoMiddleware.Models;
using ZKTecoMiddleware.Services;

namespace ZKTecoMiddleware.Controllers
{
    [ApiController]
    [Route("api/fingerprint")]
    public class FingerprintController : ControllerBase
    {
        private readonly IFingerprintService _fingerprintService;
        private readonly IDeviceService _deviceService;
        
        public FingerprintController(IFingerprintService fingerprintService, IDeviceService deviceService)
        {
            _fingerprintService = fingerprintService;
            _deviceService = deviceService;
        }
        
        /// <summary>
        /// 启动指纹录入过程
        /// </summary>
        [HttpPost("enroll")]
        public async Task<IActionResult> StartEnrollment([FromBody] FingerprintEnrollmentRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.IpAddress))
                {
                    return BadRequest(new { success = false, message = "IP地址不能为空" });
                }
                
                if (request.FingerIndex < 1 || request.FingerIndex > 10)
                {
                    return BadRequest(new { success = false, message = "手指索引必须在1-10之间" });
                }
                
                if (!_deviceService.IsDeviceConnected(request.IpAddress))
                {
                    return BadRequest(new { success = false, message = "设备未连接，请先连接设备" });
                }
                
                var result = await _fingerprintService.StartEnrollmentAsync(request.IpAddress, request.FingerIndex);
                
                if (result.Success)
                {
                    return Ok(new { 
                        success = true, 
                        message = "指纹录入成功", 
                        templateData = result.TemplateData,
                        quality = result.Quality
                    });
                }
                else
                {
                    return BadRequest(new { success = false, message = result.Message });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"指纹录入异常: {ex.Message}" });
            }
        }
        
        /// <summary>
        /// 获取录入进度
        /// </summary>
        [HttpGet("enroll/progress/{ipAddress}")]
        public async Task<IActionResult> GetEnrollmentProgress(string ipAddress)
        {
            try
            {
                if (string.IsNullOrEmpty(ipAddress))
                {
                    return BadRequest(new { success = false, message = "IP地址不能为空" });
                }
                
                if (!_deviceService.IsDeviceConnected(ipAddress))
                {
                    return BadRequest(new { success = false, message = "设备未连接，请先连接设备" });
                }
                
                var progress = await _fingerprintService.GetEnrollmentProgressAsync(ipAddress);
                
                return Ok(new { 
                    success = true, 
                    currentStage = progress.CurrentStage,
                    totalStages = progress.TotalStages,
                    status = progress.Status,
                    isCompleted = progress.IsCompleted
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"获取录入进度异常: {ex.Message}" });
            }
        }
        
        /// <summary>
        /// 取消正在进行的指纹录入
        /// </summary>
        [HttpPost("enroll/cancel/{ipAddress}")]
        public async Task<IActionResult> CancelEnrollment(string ipAddress)
        {
            try
            {
                if (string.IsNullOrEmpty(ipAddress))
                {
                    return BadRequest(new { success = false, message = "IP地址不能为空" });
                }
                
                if (!_deviceService.IsDeviceConnected(ipAddress))
                {
                    return BadRequest(new { success = false, message = "设备未连接，请先连接设备" });
                }
                
                var result = await _fingerprintService.CancelEnrollmentAsync(ipAddress);
                
                if (result)
                {
                    return Ok(new { success = true, message = "指纹录入已取消" });
                }
                else
                {
                    return BadRequest(new { success = false, message = "取消指纹录入失败" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"取消指纹录入异常: {ex.Message}" });
            }
        }
        
        /// <summary>
        /// 启动指纹识别过程
        /// </summary>
        [HttpPost("recognize")]
        public async Task<IActionResult> StartRecognition([FromBody] FingerprintRecognitionRequest request)
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
                
                if (result.Success)
                {
                    return Ok(new { 
                        success = true, 
                        message = "指纹识别成功", 
                        userId = result.UserId,
                        confidence = result.Confidence,
                        recognitionTime = result.RecognitionTime
                    });
                }
                else
                {
                    return Ok(new { 
                        success = false, 
                        message = result.Message
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"指纹识别异常: {ex.Message}" });
            }
        }
        
        /// <summary>
        /// 获取设备上的所有指纹模板
        /// </summary>
        [HttpGet("templates/{ipAddress}")]
        public async Task<IActionResult> GetAllTemplates(string ipAddress)
        {
            try
            {
                if (string.IsNullOrEmpty(ipAddress))
                {
                    return BadRequest(new { success = false, message = "IP地址不能为空" });
                }
                
                if (!_deviceService.IsDeviceConnected(ipAddress))
                {
                    return BadRequest(new { success = false, message = "设备未连接，请先连接设备" });
                }
                
                var templates = await _fingerprintService.GetAllTemplatesAsync(ipAddress);
                
                return Ok(new { 
                    success = true, 
                    count = templates.Count,
                    templates = templates.Templates
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"获取指纹模板异常: {ex.Message}" });
            }
        }
        
        /// <summary>
        /// 删除设备上的指纹模板
        /// </summary>
        [HttpDelete("templates/{ipAddress}/{templateId}")]
        public async Task<IActionResult> DeleteTemplate(string ipAddress, int templateId)
        {
            try
            {
                if (string.IsNullOrEmpty(ipAddress))
                {
                    return BadRequest(new { success = false, message = "IP地址不能为空" });
                }
                
                if (!_deviceService.IsDeviceConnected(ipAddress))
                {
                    return BadRequest(new { success = false, message = "设备未连接，请先连接设备" });
                }
                
                var result = await _fingerprintService.DeleteTemplateAsync(ipAddress, templateId);
                
                if (result)
                {
                    return Ok(new { success = true, message = "指纹模板删除成功" });
                }
                else
                {
                    return BadRequest(new { success = false, message = "指纹模板删除失败" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"删除指纹模板异常: {ex.Message}" });
            }
        }
    }
}
