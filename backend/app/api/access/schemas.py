from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date, time

class AccessControlBase(BaseModel):
    member_id: Optional[int] = None
    device_id: int
    access_type: str  # entry, exit
    status: str  # allowed, denied
    reason: Optional[str] = None
    recognition_method: str = "fingerprint"

class AccessControlCreate(AccessControlBase):
    pass

class AccessControlResponse(AccessControlBase):
    id: int
    access_time: datetime
    member_name: Optional[str] = None
    device_name: str

    class Config:
        from_attributes = True

class AccessPermissionBase(BaseModel):
    member_id: int
    device_id: Optional[int] = None
    permission_type: str = "full"
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    days_of_week: str = "1234567"
    status: str = "active"

class AccessPermissionCreate(AccessPermissionBase):
    pass

class AccessPermissionUpdate(AccessPermissionBase):
    pass

class AccessPermissionResponse(AccessPermissionBase):
    id: int
    created_at: datetime
    updated_at: datetime
    member_name: str
    device_name: Optional[str] = None

    class Config:
        from_attributes = True

class AccessControlRequest(BaseModel):
    """访问控制请求"""
    member_id: int
    device_id: int
    access_type: str  # entry, exit
    recognition_method: str = "fingerprint"

class AccessControlResult(BaseModel):
    """访问控制结果"""
    allowed: bool
    reason: Optional[str] = None
    member_info: Optional[dict] = None 