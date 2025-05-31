using System;
using System.Collections.Generic;

namespace ZKTecoMiddleware.Models
{
    /// <summary>
    /// 指纹录入结果
    /// </summary>
    public class FingerprintEnrollmentResult
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
        /// 指纹模板数据（Base64编码）
        /// </summary>
        public string TemplateData { get; set; }
        
        /// <summary>
        /// 指纹质量评分（0-100）
        /// </summary>
        public int Quality { get; set; }
    }
    
    /// <summary>
    /// 指纹录入进度
    /// </summary>
    public class EnrollmentProgress
    {
        /// <summary>
        /// 当前录入阶段（1-3）
        /// </summary>
        public int CurrentStage { get; set; }
        
        /// <summary>
        /// 总阶段数
        /// </summary>
        public int TotalStages { get; set; }
        
        /// <summary>
        /// 录入状态
        /// </summary>
        public string Status { get; set; }
        
        /// <summary>
        /// 录入是否完成
        /// </summary>
        public bool IsCompleted { get; set; }
    }
    
    /// <summary>
    /// 指纹识别结果
    /// </summary>
    public class FingerprintRecognitionResult
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
        /// 识别到的用户ID
        /// </summary>
        public int? UserId { get; set; }
        
        /// <summary>
        /// 识别置信度（0-100）
        /// </summary>
        public int Confidence { get; set; }
        
        /// <summary>
        /// 识别时间
        /// </summary>
        public DateTime RecognitionTime { get; set; }
    }
    
    /// <summary>
    /// 指纹模板
    /// </summary>
    public class FingerprintTemplate
    {
        /// <summary>
        /// 模板ID
        /// </summary>
        public int TemplateId { get; set; }
        
        /// <summary>
        /// 用户ID
        /// </summary>
        public int UserId { get; set; }
        
        /// <summary>
        /// 手指索引（1-10）
        /// </summary>
        public int FingerIndex { get; set; }
        
        /// <summary>
        /// 模板数据（Base64编码）
        /// </summary>
        public string TemplateData { get; set; }
        
        /// <summary>
        /// 模板质量（0-100）
        /// </summary>
        public int Quality { get; set; }
        
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreatedAt { get; set; }
    }
    
    /// <summary>
    /// 指纹模板集合
    /// </summary>
    public class FingerprintTemplateCollection
    {
        /// <summary>
        /// 模板列表
        /// </summary>
        public List<FingerprintTemplate> Templates { get; set; } = new List<FingerprintTemplate>();
        
        /// <summary>
        /// 总数
        /// </summary>
        public int Count => Templates.Count;
    }
    
    /// <summary>
    /// 指纹录入请求
    /// </summary>
    public class FingerprintEnrollmentRequest
    {
        /// <summary>
        /// 设备IP地址
        /// </summary>
        public string IpAddress { get; set; }
        
        /// <summary>
        /// 手指索引（1-10）
        /// </summary>
        public int FingerIndex { get; set; }
    }
    
    /// <summary>
    /// 指纹识别请求
    /// </summary>
    public class FingerprintRecognitionRequest
    {
        /// <summary>
        /// 设备IP地址
        /// </summary>
        public string IpAddress { get; set; }
    }
}
