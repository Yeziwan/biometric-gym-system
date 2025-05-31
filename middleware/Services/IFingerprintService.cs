using System;
using System.Threading.Tasks;
using ZKTecoMiddleware.Models;

namespace ZKTecoMiddleware.Services
{
    public interface IFingerprintService
    {
        /// <summary>
        /// 启动指纹录入过程
        /// </summary>
        /// <param name="ipAddress">设备IP地址</param>
        /// <param name="fingerIndex">手指索引，1-10</param>
        /// <returns>录入结果</returns>
        Task<FingerprintEnrollmentResult> StartEnrollmentAsync(string ipAddress, int fingerIndex);
        
        /// <summary>
        /// 获取录入进度
        /// </summary>
        /// <param name="ipAddress">设备IP地址</param>
        /// <returns>录入进度</returns>
        Task<EnrollmentProgress> GetEnrollmentProgressAsync(string ipAddress);
        
        /// <summary>
        /// 取消正在进行的指纹录入
        /// </summary>
        /// <param name="ipAddress">设备IP地址</param>
        /// <returns>取消结果</returns>
        Task<bool> CancelEnrollmentAsync(string ipAddress);
        
        /// <summary>
        /// 启动指纹识别过程
        /// </summary>
        /// <param name="ipAddress">设备IP地址</param>
        /// <returns>识别结果</returns>
        Task<FingerprintRecognitionResult> StartRecognitionAsync(string ipAddress);
        
        /// <summary>
        /// 获取设备上的所有指纹模板
        /// </summary>
        /// <param name="ipAddress">设备IP地址</param>
        /// <returns>指纹模板列表</returns>
        Task<FingerprintTemplateCollection> GetAllTemplatesAsync(string ipAddress);
        
        /// <summary>
        /// 删除设备上的指纹模板
        /// </summary>
        /// <param name="ipAddress">设备IP地址</param>
        /// <param name="templateId">模板ID</param>
        /// <returns>删除结果</returns>
        Task<bool> DeleteTemplateAsync(string ipAddress, int templateId);
    }
}
