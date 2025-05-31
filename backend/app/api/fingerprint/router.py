from fastapi import APIRouter, Depends, HTTPException, status, WebSocket
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import base64
import json

from app.database.database import get_db
from app.models import models
from app.api.fingerprint import schemas
from app.websocket.connection_manager import ConnectionManager

router = APIRouter()
manager = ConnectionManager()

@router.post("/enroll", response_model=schemas.FingerprintEnrollResponse)
async def enroll_fingerprint(
    request: schemas.FingerprintEnrollRequest, 
    db: Session = Depends(get_db)
):
    """指纹录入接口"""
    # 检查会员是否存在
    member = db.query(models.Member).filter(models.Member.id == request.member_id).first()
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="会员不存在"
        )
    
    # 检查设备是否存在
    device = db.query(models.Device).filter(models.Device.id == request.device_id).first()
    if not device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="设备不存在"
        )
    
    # 检查设备是否在线
    if device.status != "online":
        return schemas.FingerprintEnrollResponse(
            success=False,
            message="设备离线，无法录入指纹"
        )
    
    # 检查该手指是否已经录入过指纹
    existing_template = db.query(models.FingerprintTemplate).filter(
        models.FingerprintTemplate.member_id == request.member_id,
        models.FingerprintTemplate.finger_index == request.finger_index
    ).first()
    
    if existing_template:
        return schemas.FingerprintEnrollResponse(
            success=False,
            message=f"该手指(索引: {request.finger_index})已录入指纹，请先删除"
        )
    
    try:
        # 这里应该调用中间件服务来进行指纹录入
        # 模拟调用中间件服务
        middleware_url = "http://localhost:9000/api/fingerprint/enroll"
        payload = {
            "device_id": device.id,
            "finger_index": request.finger_index
        }
        
        # 在实际项目中，这里应该是真实的HTTP请求
        # response = requests.post(middleware_url, json=payload)
        # if response.status_code == 200:
        #     result = response.json()
        
        # 模拟成功响应
        # 在实际项目中，这里应该是从中间件获取的指纹模板数据
        template_data = b"SIMULATED_FINGERPRINT_TEMPLATE_DATA"
        
        # 创建指纹模板记录
        db_template = models.FingerprintTemplate(
            member_id=request.member_id,
            template_data=template_data,
            finger_index=request.finger_index
        )
        db.add(db_template)
        
        # 创建录入记录
        db_enrollment_log = models.EnrollmentLog(
            member_id=request.member_id,
            device_id=request.device_id,
            status="success",
            finger_index=request.finger_index
        )
        db.add(db_enrollment_log)
        
        db.commit()
        db.refresh(db_template)
        
        # 通过WebSocket广播录入成功消息
        await manager.broadcast({
            "type": "enrollment_status",
            "success": True,
            "message": "指纹录入成功",
            "member_id": request.member_id,
            "finger_index": request.finger_index
        })
        
        return schemas.FingerprintEnrollResponse(
            success=True,
            message="指纹录入成功",
            template_id=db_template.id
        )
    
    except Exception as e:
        # 创建录入失败记录
        db_enrollment_log = models.EnrollmentLog(
            member_id=request.member_id,
            device_id=request.device_id,
            status="failed",
            finger_index=request.finger_index
        )
        db.add(db_enrollment_log)
        db.commit()
        
        # 通过WebSocket广播录入失败消息
        await manager.broadcast({
            "type": "enrollment_status",
            "success": False,
            "message": f"指纹录入失败: {str(e)}",
            "member_id": request.member_id,
            "finger_index": request.finger_index
        })
        
        return schemas.FingerprintEnrollResponse(
            success=False,
            message=f"指纹录入失败: {str(e)}"
        )

@router.post("/recognize", response_model=schemas.FingerprintRecognitionResponse)
async def recognize_fingerprint(
    request: schemas.FingerprintRecognitionRequest, 
    db: Session = Depends(get_db)
):
    """指纹识别接口"""
    # 检查设备是否存在
    device = db.query(models.Device).filter(models.Device.id == request.device_id).first()
    if not device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="设备不存在"
        )
    
    # 检查设备是否在线
    if device.status != "online":
        return schemas.FingerprintRecognitionResponse(
            success=False,
            message="设备离线，无法识别指纹",
            timestamp=datetime.now()
        )
    
    try:
        # 这里应该调用中间件服务来进行指纹识别
        # 模拟调用中间件服务
        middleware_url = "http://localhost:9000/api/fingerprint/recognize"
        payload = {
            "device_id": device.id
        }
        
        # 在实际项目中，这里应该是真实的HTTP请求
        # response = requests.post(middleware_url, json=payload)
        # if response.status_code == 200:
        #     result = response.json()
        
        # 模拟成功响应
        # 在实际项目中，这里应该是从中间件获取的识别结果
        # 随机选择一个会员作为识别结果
        member = db.query(models.Member).first()
        
        if member:
            # 创建识别成功记录
            db_recognition_log = models.RecognitionLog(
                member_id=member.id,
                device_id=request.device_id,
                status="success",
                confidence=85  # 模拟置信度
            )
            db.add(db_recognition_log)
            db.commit()
            
            # 通过WebSocket广播识别成功消息
            await manager.broadcast({
                "type": "recognition_status",
                "success": True,
                "message": "指纹识别成功",
                "member": {
                    "id": member.id,
                    "name": member.name,
                    "phone": member.phone
                },
                "confidence": 85,
                "timestamp": datetime.now().isoformat()
            })
            
            return schemas.FingerprintRecognitionResponse(
                success=True,
                message="指纹识别成功",
                member=schemas.RecognizedMember(
                    id=member.id,
                    name=member.name,
                    phone=member.phone,
                    confidence=85
                ),
                timestamp=datetime.now()
            )
        else:
            # 创建识别失败记录
            db_recognition_log = models.RecognitionLog(
                member_id=None,
                device_id=request.device_id,
                status="failed",
                confidence=0
            )
            db.add(db_recognition_log)
            db.commit()
            
            # 通过WebSocket广播识别失败消息
            await manager.broadcast({
                "type": "recognition_status",
                "success": False,
                "message": "未找到匹配的指纹",
                "timestamp": datetime.now().isoformat()
            })
            
            return schemas.FingerprintRecognitionResponse(
                success=False,
                message="未找到匹配的指纹",
                timestamp=datetime.now()
            )
    
    except Exception as e:
        # 创建识别失败记录
        db_recognition_log = models.RecognitionLog(
            member_id=None,
            device_id=request.device_id,
            status="failed",
            confidence=0
        )
        db.add(db_recognition_log)
        db.commit()
        
        # 通过WebSocket广播识别失败消息
        await manager.broadcast({
            "type": "recognition_status",
            "success": False,
            "message": f"指纹识别失败: {str(e)}",
            "timestamp": datetime.now().isoformat()
        })
        
        return schemas.FingerprintRecognitionResponse(
            success=False,
            message=f"指纹识别失败: {str(e)}",
            timestamp=datetime.now()
        )

@router.get("/templates/{member_id}", response_model=List[schemas.FingerprintTemplateResponse])
def get_member_fingerprints(member_id: int, db: Session = Depends(get_db)):
    """获取会员的所有指纹模板"""
    # 检查会员是否存在
    member = db.query(models.Member).filter(models.Member.id == member_id).first()
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="会员不存在"
        )
    
    # 获取会员的所有指纹模板
    templates = db.query(models.FingerprintTemplate).filter(
        models.FingerprintTemplate.member_id == member_id
    ).all()
    
    return templates

@router.delete("/templates/{template_id}", response_model=schemas.FingerprintDeleteResponse)
def delete_fingerprint(template_id: int, db: Session = Depends(get_db)):
    """删除指纹模板"""
    # 检查指纹模板是否存在
    template = db.query(models.FingerprintTemplate).filter(
        models.FingerprintTemplate.id == template_id
    ).first()
    
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="指纹模板不存在"
        )
    
    # 删除指纹模板
    db.delete(template)
    db.commit()
    
    return schemas.FingerprintDeleteResponse(
        success=True,
        message="指纹模板删除成功"
    )
