from sqlalchemy.orm import Session
from sqlalchemy import func, desc, and_
from datetime import datetime, timedelta
from typing import Dict, List, Any
import json

from app.models import models

async def get_dashboard_statistics(db: Session) -> Dict[str, Any]:
    """获取仪表板统计数据"""
    # 获取当前日期和时间
    now = datetime.now()
    today_start = datetime(now.year, now.month, now.day, 0, 0, 0)
    
    # 获取总会员数
    total_members = db.query(func.count(models.Member.id)).scalar()
    
    # 获取总设备数
    total_devices = db.query(func.count(models.Device.id)).scalar()
    
    # 获取在线设备数
    online_devices = db.query(func.count(models.Device.id)).filter(
        models.Device.status == "online"
    ).scalar()
    
    # 获取总指纹数
    total_fingerprints = db.query(func.count(models.FingerprintTemplate.id)).scalar()
    
    # 获取今日识别次数
    today_recognitions = db.query(func.count(models.RecognitionLog.id)).filter(
        models.RecognitionLog.recognized_at >= today_start
    ).scalar()
    
    # 获取今日成功识别次数
    today_success_recognitions = db.query(func.count(models.RecognitionLog.id)).filter(
        models.RecognitionLog.recognized_at >= today_start,
        models.RecognitionLog.status == "success"
    ).scalar()
    
    # 获取按小时分布的识别次数（过去24小时）
    hourly_stats = []
    for i in range(24):
        hour_start = now - timedelta(hours=24-i)
        hour_end = now - timedelta(hours=23-i)
        
        count = db.query(func.count(models.RecognitionLog.id)).filter(
            models.RecognitionLog.recognized_at >= hour_start,
            models.RecognitionLog.recognized_at < hour_end
        ).scalar()
        
        hourly_stats.append({
            "hour": (hour_start.hour),
            "count": count
        })
    
    # 获取按设备分布的识别次数（过去7天）
    seven_days_ago = now - timedelta(days=7)
    device_stats = db.query(
        models.Device.name,
        func.count(models.RecognitionLog.id).label("count")
    ).join(
        models.RecognitionLog,
        models.RecognitionLog.device_id == models.Device.id
    ).filter(
        models.RecognitionLog.recognized_at >= seven_days_ago
    ).group_by(
        models.Device.name
    ).all()
    
    device_recognition_stats = [
        {"device": name, "count": count} for name, count in device_stats
    ]
    
    # 获取最近10条识别记录
    recent_logs = db.query(
        models.RecognitionLog,
        models.Member.name.label("member_name"),
        models.Device.name.label("device_name")
    ).outerjoin(
        models.Member,
        models.RecognitionLog.member_id == models.Member.id
    ).join(
        models.Device,
        models.RecognitionLog.device_id == models.Device.id
    ).order_by(
        desc(models.RecognitionLog.recognized_at)
    ).limit(10).all()
    
    formatted_logs = []
    for log, member_name, device_name in recent_logs:
        formatted_logs.append({
            "id": log.id,
            "member_name": member_name if member_name else "未识别",
            "device_name": device_name,
            "recognized_at": log.recognized_at.isoformat(),
            "status": log.status,
            "confidence": log.confidence
        })
    
    # 返回所有统计数据
    return {
        "stats": {
            "total_members": total_members,
            "total_devices": total_devices,
            "online_devices": online_devices,
            "total_fingerprints": total_fingerprints,
            "today_recognitions": today_recognitions,
            "today_success_rate": (today_success_recognitions / today_recognitions * 100) if today_recognitions > 0 else 0
        },
        "hourly_stats": hourly_stats,
        "device_recognition_stats": device_recognition_stats,
        "recent_logs": formatted_logs
    }
