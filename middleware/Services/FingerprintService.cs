using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ZKTecoMiddleware.Models;

namespace ZKTecoMiddleware.Services
{
    public class FingerprintService : IFingerprintService
    {
        private readonly IDeviceService _deviceService;
        private readonly Dictionary<string, EnrollmentProgress> _enrollmentProgress = new Dictionary<string, EnrollmentProgress>();
        
        public FingerprintService(IDeviceService deviceService)
        {
            _deviceService = deviceService;
        }
        
        /// <summary>
        /// 启动指纹录入过程
        /// </summary>
        public async Task<FingerprintEnrollmentResult> StartEnrollmentAsync(string ipAddress, int fingerIndex)
        {
            // 检查设备是否已连接
            if (!_deviceService.IsDeviceConnected(ipAddress))
            {
                return new FingerprintEnrollmentResult
                {
                    Success = false,
                    Message = "设备未连接"
                };
            }
            
            try
            {
                // 这里应该使用ZKTeco SDK启动指纹录入过程
                // 由于SDK是COM组件，需要使用PInvoke或COM Interop
                // 以下是模拟指纹录入过程
                
                // 初始化录入进度
                _enrollmentProgress[ipAddress] = new EnrollmentProgress
                {
                    CurrentStage = 1,
                    TotalStages = 3,
                    Status = "开始录入指纹，请将手指放在指纹传感器上",
                    IsCompleted = false
                };
                
                // 模拟录入过程
                await Task.Delay(1000); // 模拟第一次采集
                
                _enrollmentProgress[ipAddress].CurrentStage = 2;
                _enrollmentProgress[ipAddress].Status = "请再次将手指放在指纹传感器上";
                
                await Task.Delay(1000); // 模拟第二次采集
                
                _enrollmentProgress[ipAddress].CurrentStage = 3;
                _enrollmentProgress[ipAddress].Status = "请最后一次将手指放在指纹传感器上";
                
                await Task.Delay(1000); // 模拟第三次采集
                
                _enrollmentProgress[ipAddress].IsCompleted = true;
                _enrollmentProgress[ipAddress].Status = "指纹录入完成";
                
                // 模拟生成指纹模板
                var templateData = Convert.ToBase64String(new byte[2048]); // 模拟指纹模板数据
                var quality = new Random().Next(60, 100); // 模拟指纹质量
                
                return new FingerprintEnrollmentResult
                {
                    Success = true,
                    Message = "指纹录入成功",
                    TemplateData = templateData,
                    Quality = quality
                };
            }
            catch (Exception ex)
            {
                // 重置录入进度
                _enrollmentProgress.Remove(ipAddress);
                
                return new FingerprintEnrollmentResult
                {
                    Success = false,
                    Message = $"指纹录入失败: {ex.Message}"
                };
            }
        }
        
        /// <summary>
        /// 获取录入进度
        /// </summary>
        public async Task<EnrollmentProgress> GetEnrollmentProgressAsync(string ipAddress)
        {
            // 检查设备是否已连接
            if (!_deviceService.IsDeviceConnected(ipAddress))
            {
                return new EnrollmentProgress
                {
                    CurrentStage = 0,
                    TotalStages = 0,
                    Status = "设备未连接",
                    IsCompleted = false
                };
            }
            
            // 检查是否有录入进度
            if (!_enrollmentProgress.ContainsKey(ipAddress))
            {
                return new EnrollmentProgress
                {
                    CurrentStage = 0,
                    TotalStages = 3,
                    Status = "未开始录入",
                    IsCompleted = false
                };
            }
            
            return _enrollmentProgress[ipAddress];
        }
        
        /// <summary>
        /// 取消正在进行的指纹录入
        /// </summary>
        public async Task<bool> CancelEnrollmentAsync(string ipAddress)
        {
            // 检查设备是否已连接
            if (!_deviceService.IsDeviceConnected(ipAddress))
            {
                return false;
            }
            
            // 检查是否有录入进度
            if (!_enrollmentProgress.ContainsKey(ipAddress))
            {
                return false;
            }
            
            try
            {
                // 这里应该使用ZKTeco SDK取消指纹录入过程
                // 由于SDK是COM组件，需要使用PInvoke或COM Interop
                // 以下是模拟取消指纹录入过程
                
                // 移除录入进度
                _enrollmentProgress.Remove(ipAddress);
                
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        
        /// <summary>
        /// 启动指纹识别过程
        /// </summary>
        public async Task<FingerprintRecognitionResult> StartRecognitionAsync(string ipAddress)
        {
            // 检查设备是否已连接
            if (!_deviceService.IsDeviceConnected(ipAddress))
            {
                return new FingerprintRecognitionResult
                {
                    Success = false,
                    Message = "设备未连接"
                };
            }
            
            try
            {
                // 这里应该使用ZKTeco SDK启动指纹识别过程
                // 由于SDK是COM组件，需要使用PInvoke或COM Interop
                // 以下是模拟指纹识别过程
                
                await Task.Delay(2000); // 模拟识别过程
                
                var random = new Random();
                var recognitionSuccess = random.Next(0, 10) > 2; // 80%的概率识别成功
                
                if (recognitionSuccess)
                {
                    return new FingerprintRecognitionResult
                    {
                        Success = true,
                        Message = "指纹识别成功",
                        UserId = random.Next(1, 100),
                        Confidence = random.Next(70, 100),
                        RecognitionTime = DateTime.Now
                    };
                }
                else
                {
                    return new FingerprintRecognitionResult
                    {
                        Success = false,
                        Message = "未找到匹配的指纹",
                        UserId = null,
                        Confidence = 0,
                        RecognitionTime = DateTime.Now
                    };
                }
            }
            catch (Exception ex)
            {
                return new FingerprintRecognitionResult
                {
                    Success = false,
                    Message = $"指纹识别失败: {ex.Message}",
                    UserId = null,
                    Confidence = 0,
                    RecognitionTime = DateTime.Now
                };
            }
        }
        
        /// <summary>
        /// 获取设备上的所有指纹模板
        /// </summary>
        public async Task<FingerprintTemplateCollection> GetAllTemplatesAsync(string ipAddress)
        {
            // 检查设备是否已连接
            if (!_deviceService.IsDeviceConnected(ipAddress))
            {
                return new FingerprintTemplateCollection();
            }
            
            try
            {
                // 这里应该使用ZKTeco SDK获取设备上的所有指纹模板
                // 由于SDK是COM组件，需要使用PInvoke或COM Interop
                // 以下是模拟获取指纹模板过程
                
                var templates = new FingerprintTemplateCollection();
                var random = new Random();
                var count = random.Next(5, 20);
                
                for (int i = 0; i < count; i++)
                {
                    templates.Templates.Add(new FingerprintTemplate
                    {
                        TemplateId = i + 1,
                        UserId = random.Next(1, 100),
                        FingerIndex = random.Next(1, 10),
                        TemplateData = Convert.ToBase64String(new byte[512]), // 模拟指纹模板数据
                        Quality = random.Next(60, 100),
                        CreatedAt = DateTime.Now.AddDays(-random.Next(0, 30))
                    });
                }
                
                return templates;
            }
            catch (Exception)
            {
                return new FingerprintTemplateCollection();
            }
        }
        
        /// <summary>
        /// 删除设备上的指纹模板
        /// </summary>
        public async Task<bool> DeleteTemplateAsync(string ipAddress, int templateId)
        {
            // 检查设备是否已连接
            if (!_deviceService.IsDeviceConnected(ipAddress))
            {
                return false;
            }
            
            try
            {
                // 这里应该使用ZKTeco SDK删除设备上的指纹模板
                // 由于SDK是COM组件，需要使用PInvoke或COM Interop
                // 以下是模拟删除指纹模板过程
                
                await Task.Delay(500); // 模拟删除过程
                
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
