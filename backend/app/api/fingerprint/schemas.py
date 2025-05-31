from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class FingerprintEnrollRequest(BaseModel):
    """指纹录入请求模型"""
    member_id: int = Field(..., description="会员ID")
    device_id: int = Field(..., description="设备ID")
    finger_index: int = Field(..., description="手指索引，1-10")

class FingerprintEnrollResponse(BaseModel):
    """指纹录入响应模型"""
    success: bool
    message: str
    template_id: Optional[int] = None

class FingerprintRecognitionRequest(BaseModel):
    """指纹识别请求模型"""
    device_id: int = Field(..., description="设备ID")

class RecognizedMember(BaseModel):
    """识别到的会员信息"""
    id: int
    name: str
    phone: str
    confidence: int

class FingerprintRecognitionResponse(BaseModel):
    """指纹识别响应模型"""
    success: bool
    message: str
    member: Optional[RecognizedMember] = None
    timestamp: datetime = Field(default_factory=datetime.now)

class FingerprintTemplateResponse(BaseModel):
    """指纹模板响应模型"""
    id: int
    member_id: int
    finger_index: int
    created_at: datetime

    class Config:
        orm_mode = True

class FingerprintDeleteRequest(BaseModel):
    """删除指纹请求模型"""
    template_id: int = Field(..., description="指纹模板ID")

class FingerprintDeleteResponse(BaseModel):
    """删除指纹响应模型"""
    success: bool
    message: str
