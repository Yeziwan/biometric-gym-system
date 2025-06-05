from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class DeviceBase(BaseModel):
    """设备基础模型"""
    name: str = Field(..., description="设备名称")
    ip_address: str = Field(..., description="IP地址")
    port: int = Field(4370, description="端口号，默认4370")
    device_type: str = Field("fingerprint", description="设备类型: fingerprint, face, card, mixed")
    location: Optional[str] = Field(None, description="设备位置描述")
    branch_id: Optional[int] = Field(None, description="所属分支ID")
    access_direction: str = Field("both", description="访问方向: entry, exit, both")

class DeviceCreate(DeviceBase):
    """创建设备请求模型"""
    pass

class DeviceUpdate(DeviceBase):
    """更新设备请求模型"""
    pass

class DeviceResponse(DeviceBase):
    """设备响应模型"""
    id: int
    status: str
    last_heartbeat: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    fingerprint_count: int = 0
    branch_name: Optional[str] = None

    class Config:
        from_attributes = True

class DeviceDetail(DeviceResponse):
    """设备详情响应模型"""
    access_logs_today: int = 0
    recognition_logs_today: int = 0
    
    class Config:
        from_attributes = True

class DeviceConnectRequest(BaseModel):
    """连接设备请求模型"""
    device_id: int

class DeviceConnectResponse(BaseModel):
    """连接设备响应模型"""
    success: bool
    message: str
    device: Optional[DeviceResponse] = None

class DeviceSyncRequest(BaseModel):
    """同步设备数据请求模型"""
    device_id: int

class DeviceSyncResponse(BaseModel):
    """同步设备数据响应模型"""
    success: bool
    message: str
    fingerprint_count: int = 0
    user_count: int = 0
    log_count: int = 0
