from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

class MemberBase(BaseModel):
    """会员基础模型"""
    name: str = Field(..., description="会员姓名")
    phone: str = Field(..., description="手机号码")
    email: Optional[EmailStr] = Field(None, description="电子邮箱")
    status: str = Field("active", description="状态: active, inactive")

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
    created_at: datetime

    class Config:
        orm_mode = True

class RecognitionLogInfo(BaseModel):
    """识别记录信息模型"""
    id: int
    device_name: str
    recognized_at: datetime
    status: str
    confidence: Optional[int] = None

    class Config:
        orm_mode = True

class MemberResponse(MemberBase):
    """会员响应模型"""
    id: int
    created_at: datetime
    updated_at: datetime
    fingerprint_count: int
    last_recognition: Optional[datetime] = None

    class Config:
        orm_mode = True

class MemberDetail(MemberResponse):
    """会员详情响应模型"""
    fingerprints: List[FingerprintInfo]
    recognition_logs: List[RecognitionLogInfo]

    class Config:
        orm_mode = True
