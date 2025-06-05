from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date

class AttendanceRecordBase(BaseModel):
    member_id: int
    device_id: int
    date: date
    check_in_time: Optional[datetime] = None
    check_out_time: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    status: str = "incomplete"

class AttendanceRecordCreate(BaseModel):
    member_id: int
    device_id: int
    check_type: str  # check_in, check_out

class AttendanceRecordResponse(AttendanceRecordBase):
    id: int
    member_name: str
    device_name: str

    class Config:
        from_attributes = True

class AttendanceStatistics(BaseModel):
    """考勤统计"""
    member_id: int
    member_name: str
    total_days: int
    present_days: int
    absent_days: int
    total_hours: float
    average_hours: float
    attendance_rate: float

class AttendanceReport(BaseModel):
    """考勤报表"""
    start_date: date
    end_date: date
    total_members: int
    statistics: List[AttendanceStatistics]

class CheckInOutRequest(BaseModel):
    """签到签退请求"""
    member_id: int
    device_id: int
    check_type: str  # check_in, check_out

class CheckInOutResult(BaseModel):
    """签到签退结果"""
    success: bool
    message: str
    record_id: Optional[int] = None
    check_time: Optional[datetime] = None 