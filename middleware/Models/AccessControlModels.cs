using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ZKTecoMiddleware.Models
{
    /// <summary>
    /// 访问验证请求
    /// </summary>
    public class AccessVerificationRequest
    {
        /// <summary>
        /// 设备IP地址
        /// </summary>
        public string IpAddress { get; set; }
        
        /// <summary>
        /// 设备ID
        /// </summary>
        public int DeviceId { get; set; }
        
        /// <summary>
        /// 访问类型（entry, exit）
        /// </summary>
        public string AccessType { get; set; }
    }
    
    /// <summary>
    /// 访问控制结果
    /// </summary>
    public class AccessControlResult
    {
        /// <summary>
        /// 是否允许访问
        /// </summary>
        [JsonPropertyName("allowed")]
        public bool Allowed { get; set; }
        
        /// <summary>
        /// 拒绝原因
        /// </summary>
        [JsonPropertyName("reason")]
        public string Reason { get; set; }
        
        /// <summary>
        /// 会员信息
        /// </summary>
        [JsonPropertyName("member_info")]
        public MemberInfo MemberInfo { get; set; }
    }
    
    /// <summary>
    /// 会员信息
    /// </summary>
    public class MemberInfo
    {
        /// <summary>
        /// 会员ID
        /// </summary>
        [JsonPropertyName("id")]
        public int Id { get; set; }
        
        /// <summary>
        /// 会员姓名
        /// </summary>
        [JsonPropertyName("name")]
        public string Name { get; set; }
        
        /// <summary>
        /// 会员编号
        /// </summary>
        [JsonPropertyName("member_number")]
        public string MemberNumber { get; set; }
        
        /// <summary>
        /// 会员类型
        /// </summary>
        [JsonPropertyName("membership_type")]
        public string MembershipType { get; set; }
    }
    
    /// <summary>
    /// 手动签到签退请求
    /// </summary>
    public class ManualCheckInRequest
    {
        /// <summary>
        /// 会员ID
        /// </summary>
        public int MemberId { get; set; }
        
        /// <summary>
        /// 设备ID
        /// </summary>
        public int DeviceId { get; set; }
        
        /// <summary>
        /// 签到类型（check_in, check_out）
        /// </summary>
        public string CheckType { get; set; }
    }
    
    /// <summary>
    /// 签到签退结果
    /// </summary>
    public class CheckInOutResult
    {
        /// <summary>
        /// 操作是否成功
        /// </summary>
        [JsonPropertyName("success")]
        public bool Success { get; set; }
        
        /// <summary>
        /// 结果消息
        /// </summary>
        [JsonPropertyName("message")]
        public string Message { get; set; }
        
        /// <summary>
        /// 记录ID
        /// </summary>
        [JsonPropertyName("record_id")]
        public int? RecordId { get; set; }
        
        /// <summary>
        /// 签到签退时间
        /// </summary>
        [JsonPropertyName("check_time")]
        public DateTime? CheckTime { get; set; }
    }
    
    /// <summary>
    /// 访问控制日志
    /// </summary>
    public class AccessControlLog
    {
        /// <summary>
        /// 日志ID
        /// </summary>
        public int Id { get; set; }
        
        /// <summary>
        /// 会员ID
        /// </summary>
        public int? MemberId { get; set; }
        
        /// <summary>
        /// 设备ID
        /// </summary>
        public int DeviceId { get; set; }
        
        /// <summary>
        /// 访问类型
        /// </summary>
        public string AccessType { get; set; }
        
        /// <summary>
        /// 访问时间
        /// </summary>
        public DateTime AccessTime { get; set; }
        
        /// <summary>
        /// 访问状态（allowed, denied）
        /// </summary>
        public string Status { get; set; }
        
        /// <summary>
        /// 拒绝原因
        /// </summary>
        public string Reason { get; set; }
        
        /// <summary>
        /// 识别方法
        /// </summary>
        public string RecognitionMethod { get; set; }
        
        /// <summary>
        /// 会员姓名
        /// </summary>
        public string MemberName { get; set; }
        
        /// <summary>
        /// 设备名称
        /// </summary>
        public string DeviceName { get; set; }
    }
    
    /// <summary>
    /// 访问权限
    /// </summary>
    public class AccessPermission
    {
        /// <summary>
        /// 权限ID
        /// </summary>
        public int Id { get; set; }
        
        /// <summary>
        /// 会员ID
        /// </summary>
        public int MemberId { get; set; }
        
        /// <summary>
        /// 设备ID（null表示所有设备）
        /// </summary>
        public int? DeviceId { get; set; }
        
        /// <summary>
        /// 权限类型
        /// </summary>
        public string PermissionType { get; set; }
        
        /// <summary>
        /// 开始时间
        /// </summary>
        public TimeSpan? StartTime { get; set; }
        
        /// <summary>
        /// 结束时间
        /// </summary>
        public TimeSpan? EndTime { get; set; }
        
        /// <summary>
        /// 开始日期
        /// </summary>
        public DateTime? StartDate { get; set; }
        
        /// <summary>
        /// 结束日期
        /// </summary>
        public DateTime? EndDate { get; set; }
        
        /// <summary>
        /// 允许访问的星期几
        /// </summary>
        public string DaysOfWeek { get; set; }
        
        /// <summary>
        /// 权限状态
        /// </summary>
        public string Status { get; set; }
        
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreatedAt { get; set; }
        
        /// <summary>
        /// 更新时间
        /// </summary>
        public DateTime UpdatedAt { get; set; }
    }
    
    /// <summary>
    /// 考勤记录
    /// </summary>
    public class AttendanceRecord
    {
        /// <summary>
        /// 记录ID
        /// </summary>
        public int Id { get; set; }
        
        /// <summary>
        /// 会员ID
        /// </summary>
        public int MemberId { get; set; }
        
        /// <summary>
        /// 设备ID
        /// </summary>
        public int DeviceId { get; set; }
        
        /// <summary>
        /// 日期
        /// </summary>
        public DateTime Date { get; set; }
        
        /// <summary>
        /// 签到时间
        /// </summary>
        public DateTime? CheckInTime { get; set; }
        
        /// <summary>
        /// 签退时间
        /// </summary>
        public DateTime? CheckOutTime { get; set; }
        
        /// <summary>
        /// 停留时长（分钟）
        /// </summary>
        public int? DurationMinutes { get; set; }
        
        /// <summary>
        /// 记录状态
        /// </summary>
        public string Status { get; set; }
        
        /// <summary>
        /// 会员姓名
        /// </summary>
        public string MemberName { get; set; }
        
        /// <summary>
        /// 设备名称
        /// </summary>
        public string DeviceName { get; set; }
    }
} 