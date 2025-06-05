from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import List, Optional
from datetime import datetime, date, timedelta

from app.database.database import get_db
from app.models import models
from app.api.attendance import schemas

router = APIRouter()

@router.post("/check", response_model=schemas.CheckInOutResult)
def check_in_out(request: schemas.CheckInOutRequest, db: Session = Depends(get_db)):
    """处理签到签退"""
    # 验证会员和设备
    member = db.query(models.Member).filter(models.Member.id == request.member_id).first()
    if not member:
        return schemas.CheckInOutResult(
            success=False,
            message="会员不存在"
        )
    
    device = db.query(models.Device).filter(models.Device.id == request.device_id).first()
    if not device:
        return schemas.CheckInOutResult(
            success=False,
            message="设备不存在"
        )
    
    current_time = datetime.now()
    current_date = current_time.date()
    
    # 查找今天的考勤记录
    attendance_record = db.query(models.AttendanceRecord).filter(
        models.AttendanceRecord.member_id == request.member_id,
        models.AttendanceRecord.date == current_date
    ).first()
    
    if request.check_type == "check_in":
        if attendance_record and attendance_record.check_in_time:
            return schemas.CheckInOutResult(
                success=False,
                message="今日已签到"
            )
        
        if not attendance_record:
            # 创建新的考勤记录
            attendance_record = models.AttendanceRecord(
                member_id=request.member_id,
                device_id=request.device_id,
                date=current_date,
                check_in_time=current_time,
                status="incomplete"
            )
            db.add(attendance_record)
        else:
            # 更新签到时间
            attendance_record.check_in_time = current_time
            attendance_record.device_id = request.device_id
        
        db.commit()
        db.refresh(attendance_record)
        
        return schemas.CheckInOutResult(
            success=True,
            message="签到成功",
            record_id=attendance_record.id,
            check_time=current_time
        )
    
    elif request.check_type == "check_out":
        if not attendance_record or not attendance_record.check_in_time:
            return schemas.CheckInOutResult(
                success=False,
                message="请先签到"
            )
        
        if attendance_record.check_out_time:
            return schemas.CheckInOutResult(
                success=False,
                message="今日已签退"
            )
        
        # 更新签退时间和计算停留时间
        attendance_record.check_out_time = current_time
        duration = current_time - attendance_record.check_in_time
        attendance_record.duration_minutes = int(duration.total_seconds() / 60)
        attendance_record.status = "complete"
        
        db.commit()
        db.refresh(attendance_record)
        
        return schemas.CheckInOutResult(
            success=True,
            message="签退成功",
            record_id=attendance_record.id,
            check_time=current_time
        )
    
    else:
        return schemas.CheckInOutResult(
            success=False,
            message="无效的操作类型"
        )

@router.get("/records", response_model=List[schemas.AttendanceRecordResponse])
def get_attendance_records(
    skip: int = 0,
    limit: int = 100,
    member_id: Optional[int] = None,
    device_id: Optional[int] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """获取考勤记录"""
    query = db.query(
        models.AttendanceRecord,
        models.Member.name.label("member_name"),
        models.Device.name.label("device_name")
    ).join(
        models.Member,
        models.AttendanceRecord.member_id == models.Member.id
    ).join(
        models.Device,
        models.AttendanceRecord.device_id == models.Device.id
    )
    
    # 应用过滤条件
    if member_id:
        query = query.filter(models.AttendanceRecord.member_id == member_id)
    if device_id:
        query = query.filter(models.AttendanceRecord.device_id == device_id)
    if start_date:
        query = query.filter(models.AttendanceRecord.date >= start_date)
    if end_date:
        query = query.filter(models.AttendanceRecord.date <= end_date)
    if status:
        query = query.filter(models.AttendanceRecord.status == status)
    
    # 按日期倒序排列
    query = query.order_by(models.AttendanceRecord.date.desc())
    
    records = query.offset(skip).limit(limit).all()
    
    result = []
    for record, member_name, device_name in records:
        result.append(schemas.AttendanceRecordResponse(
            id=record.id,
            member_id=record.member_id,
            device_id=record.device_id,
            date=record.date,
            check_in_time=record.check_in_time,
            check_out_time=record.check_out_time,
            duration_minutes=record.duration_minutes,
            status=record.status,
            member_name=member_name,
            device_name=device_name
        ))
    
    return result

@router.get("/statistics", response_model=schemas.AttendanceReport)
def get_attendance_statistics(
    start_date: date,
    end_date: date,
    member_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """获取考勤统计报表"""
    # 计算日期范围内的总天数
    total_days = (end_date - start_date).days + 1
    
    # 构建查询
    query = db.query(models.Member)
    if member_id:
        query = query.filter(models.Member.id == member_id)
    
    members = query.all()
    statistics = []
    
    for member in members:
        # 查询该会员在日期范围内的考勤记录
        attendance_records = db.query(models.AttendanceRecord).filter(
            models.AttendanceRecord.member_id == member.id,
            models.AttendanceRecord.date >= start_date,
            models.AttendanceRecord.date <= end_date
        ).all()
        
        # 计算统计数据
        present_days = len([r for r in attendance_records if r.check_in_time])
        absent_days = total_days - present_days
        
        # 计算总工作时间（分钟）
        total_minutes = sum([r.duration_minutes for r in attendance_records if r.duration_minutes])
        total_hours = total_minutes / 60.0
        average_hours = total_hours / present_days if present_days > 0 else 0
        attendance_rate = (present_days / total_days) * 100 if total_days > 0 else 0
        
        statistics.append(schemas.AttendanceStatistics(
            member_id=member.id,
            member_name=member.name,
            total_days=total_days,
            present_days=present_days,
            absent_days=absent_days,
            total_hours=round(total_hours, 2),
            average_hours=round(average_hours, 2),
            attendance_rate=round(attendance_rate, 2)
        ))
    
    return schemas.AttendanceReport(
        start_date=start_date,
        end_date=end_date,
        total_members=len(members),
        statistics=statistics
    )

@router.get("/member/{member_id}/today")
def get_member_today_attendance(member_id: int, db: Session = Depends(get_db)):
    """获取会员今日考勤状态"""
    member = db.query(models.Member).filter(models.Member.id == member_id).first()
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="会员不存在"
        )
    
    today = date.today()
    attendance_record = db.query(models.AttendanceRecord).filter(
        models.AttendanceRecord.member_id == member_id,
        models.AttendanceRecord.date == today
    ).first()
    
    if not attendance_record:
        return {
            "member_id": member_id,
            "member_name": member.name,
            "date": today,
            "status": "not_checked_in",
            "check_in_time": None,
            "check_out_time": None,
            "duration_minutes": None
        }
    
    status_text = "not_checked_in"
    if attendance_record.check_in_time and not attendance_record.check_out_time:
        status_text = "checked_in"
    elif attendance_record.check_in_time and attendance_record.check_out_time:
        status_text = "checked_out"
    
    return {
        "member_id": member_id,
        "member_name": member.name,
        "date": today,
        "status": status_text,
        "check_in_time": attendance_record.check_in_time,
        "check_out_time": attendance_record.check_out_time,
        "duration_minutes": attendance_record.duration_minutes
    }

@router.get("/daily-summary")
def get_daily_attendance_summary(
    target_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    """获取每日考勤汇总"""
    if not target_date:
        target_date = date.today()
    
    # 获取当日所有考勤记录
    records = db.query(models.AttendanceRecord).filter(
        models.AttendanceRecord.date == target_date
    ).all()
    
    # 统计数据
    total_records = len(records)
    checked_in = len([r for r in records if r.check_in_time])
    checked_out = len([r for r in records if r.check_out_time])
    still_in = checked_in - checked_out
    
    # 计算平均停留时间
    completed_records = [r for r in records if r.duration_minutes]
    average_duration = sum([r.duration_minutes for r in completed_records]) / len(completed_records) if completed_records else 0
    
    return {
        "date": target_date,
        "total_records": total_records,
        "checked_in": checked_in,
        "checked_out": checked_out,
        "still_in": still_in,
        "average_duration_minutes": round(average_duration, 2),
        "average_duration_hours": round(average_duration / 60, 2)
    } 