from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime, date

class MemberBase(BaseModel):
    """会员基础模型"""
    name: str = Field(..., description="会员姓名")
    phone: str = Field(..., description="手机号码")
    email: Optional[EmailStr] = Field(None, description="电子邮箱")
    member_number: Optional[str] = Field(None, description="会员编号")
    branch_id: Optional[int] = Field(None, description="所属分支ID")
    membership_type: str = Field("regular", description="会员类型: regular, vip, premium")
    membership_start: Optional[date] = Field(None, description="会员开始日期")
    membership_end: Optional[date] = Field(None, description="会员结束日期")
    status: str = Field("active", description="状态: active, inactive, expired")

class MemberCreate(MemberBase):
    """创建会员请求模型"""
    pass

class MemberUpdate(MemberBase):
    """更新会员请求模型"""
    pass

class FingerprintInfo(BaseModel):
    """指纹信息模型"""
    id: int
    finger_index: int
    quality: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

class RecognitionLogInfo(BaseModel):
    """识别记录信息模型"""
    id: int
    device_name: str
    recognized_at: datetime
    status: str
    confidence: Optional[int] = None
    recognition_type: str = "fingerprint"

    class Config:
        from_attributes = True

class MemberResponse(MemberBase):
    """会员响应模型"""
    id: int
    created_at: datetime
    updated_at: datetime
    fingerprint_count: int
    last_recognition: Optional[datetime] = None
    branch_name: Optional[str] = None

    class Config:
        from_attributes = True

class MemberDetail(MemberResponse):
    """会员详情响应模型"""
    fingerprints: List[FingerprintInfo]
    recognition_logs: List[RecognitionLogInfo]
    access_permissions: List[dict] = []
    attendance_summary: Optional[dict] = None

    class Config:
        from_attributes = True
