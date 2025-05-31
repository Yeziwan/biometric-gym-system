from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import requests
import json

from app.database.database import get_db
from app.models import models
from app.api.device import schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.DeviceResponse])
def get_all_devices(
    skip: int = 0, 
    limit: int = 100, 
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """获取所有设备列表，支持分页和状态过滤"""
    query = db.query(models.Device)
    
    # 根据状态过滤
    if status:
        query = query.filter(models.Device.status == status)
    
    devices = query.offset(skip).limit(limit).all()
    
    # 获取每个设备的指纹数量
    result = []
    for device in devices:
        # 计算设备上的指纹数量
        fingerprint_count = db.query(models.FingerprintTemplate).join(
            models.EnrollmentLog,
            models.EnrollmentLog.member_id == models.FingerprintTemplate.member_id
        ).filter(
            models.EnrollmentLog.device_id == device.id,
            models.EnrollmentLog.status == "success"
        ).count()
        
        device_data = schemas.DeviceResponse(
            id=device.id,
            name=device.name,
            ip_address=device.ip_address,
            port=device.port,
            status=device.status,
            last_heartbeat=device.last_heartbeat,
            created_at=device.created_at,
            updated_at=device.updated_at,
            fingerprint_count=fingerprint_count
        )
        result.append(device_data)
    
    return result

@router.post("/", response_model=schemas.DeviceResponse, status_code=status.HTTP_201_CREATED)
def create_device(device: schemas.DeviceCreate, db: Session = Depends(get_db)):
    """创建新设备"""
    # 检查IP地址是否已存在
    existing_device = db.query(models.Device).filter(models.Device.ip_address == device.ip_address).first()
    if existing_device:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="IP地址已存在"
        )
    
    # 创建新设备
    db_device = models.Device(
        name=device.name,
        ip_address=device.ip_address,
        port=device.port
    )
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    
    return schemas.DeviceResponse(
        id=db_device.id,
        name=db_device.name,
        ip_address=db_device.ip_address,
        port=db_device.port,
        status=db_device.status,
        last_heartbeat=db_device.last_heartbeat,
        created_at=db_device.created_at,
        updated_at=db_device.updated_at,
        fingerprint_count=0
    )

@router.get("/{device_id}", response_model=schemas.DeviceDetail)
def get_device(device_id: int, db: Session = Depends(get_db)):
    """获取单个设备详情"""
    device = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="设备不存在"
        )
    
    # 计算设备上的指纹数量
    fingerprint_count = db.query(models.FingerprintTemplate).join(
        models.EnrollmentLog,
        models.EnrollmentLog.member_id == models.FingerprintTemplate.member_id
    ).filter(
        models.EnrollmentLog.device_id == device.id,
        models.EnrollmentLog.status == "success"
    ).count()
    
    return schemas.DeviceDetail(
        id=device.id,
        name=device.name,
        ip_address=device.ip_address,
        port=device.port,
        status=device.status,
        last_heartbeat=device.last_heartbeat,
        created_at=device.created_at,
        updated_at=device.updated_at,
        fingerprint_count=fingerprint_count
    )

@router.put("/{device_id}", response_model=schemas.DeviceResponse)
def update_device(device_id: int, device: schemas.DeviceUpdate, db: Session = Depends(get_db)):
    """更新设备信息"""
    db_device = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not db_device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="设备不存在"
        )
    
    # 检查IP地址是否与其他设备重复
    if device.ip_address != db_device.ip_address:
        existing_device = db.query(models.Device).filter(models.Device.ip_address == device.ip_address).first()
        if existing_device:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="IP地址已存在"
            )
    
    # 更新设备信息
    db_device.name = device.name
    db_device.ip_address = device.ip_address
    db_device.port = device.port
    db_device.updated_at = datetime.now()
    
    db.commit()
    db.refresh(db_device)
    
    # 计算设备上的指纹数量
    fingerprint_count = db.query(models.FingerprintTemplate).join(
        models.EnrollmentLog,
        models.EnrollmentLog.member_id == models.FingerprintTemplate.member_id
    ).filter(
        models.EnrollmentLog.device_id == device_id,
        models.EnrollmentLog.status == "success"
    ).count()
    
    return schemas.DeviceResponse(
        id=db_device.id,
        name=db_device.name,
        ip_address=db_device.ip_address,
        port=db_device.port,
        status=db_device.status,
        last_heartbeat=db_device.last_heartbeat,
        created_at=db_device.created_at,
        updated_at=db_device.updated_at,
        fingerprint_count=fingerprint_count
    )

@router.delete("/{device_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_device(device_id: int, db: Session = Depends(get_db)):
    """删除设备"""
    db_device = db.query(models.Device).filter(models.Device.id == device_id).first()
    if not db_device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="设备不存在"
        )
    
    db.delete(db_device)
    db.commit()
    
    return None

@router.post("/connect", response_model=schemas.DeviceConnectResponse)
async def connect_device(request: schemas.DeviceConnectRequest, db: Session = Depends(get_db)):
    """连接设备"""
    device = db.query(models.Device).filter(models.Device.id == request.device_id).first()
    if not device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="设备不存在"
        )
    
    try:
        # 这里应该调用中间件服务来连接设备
        # 模拟调用中间件服务
        middleware_url = "http://localhost:9000/api/device/connect"
        payload = {
            "ip": device.ip_address,
            "port": device.port
        }
        
        # 在实际项目中，这里应该是真实的HTTP请求
        # response = requests.post(middleware_url, json=payload)
        # if response.status_code == 200:
        #     result = response.json()
        
        # 模拟成功响应
        result = {"success": True, "message": "设备连接成功"}
        
        if result["success"]:
            # 更新设备状态
            device.status = "online"
            device.last_heartbeat = datetime.now()
            db.commit()
            db.refresh(device)
            
            # 计算设备上的指纹数量
            fingerprint_count = db.query(models.FingerprintTemplate).join(
                models.EnrollmentLog,
                models.EnrollmentLog.member_id == models.FingerprintTemplate.member_id
            ).filter(
                models.EnrollmentLog.device_id == device.id,
                models.EnrollmentLog.status == "success"
            ).count()
            
            return schemas.DeviceConnectResponse(
                success=True,
                message="设备连接成功",
                device=schemas.DeviceResponse(
                    id=device.id,
                    name=device.name,
                    ip_address=device.ip_address,
                    port=device.port,
                    status=device.status,
                    last_heartbeat=device.last_heartbeat,
                    created_at=device.created_at,
                    updated_at=device.updated_at,
                    fingerprint_count=fingerprint_count
                )
            )
        else:
            return schemas.DeviceConnectResponse(
                success=False,
                message=result.get("message", "设备连接失败")
            )
    
    except Exception as e:
        return schemas.DeviceConnectResponse(
            success=False,
            message=f"设备连接失败: {str(e)}"
        )

@router.post("/sync", response_model=schemas.DeviceSyncResponse)
async def sync_device(request: schemas.DeviceSyncRequest, db: Session = Depends(get_db)):
    """同步设备数据"""
    device = db.query(models.Device).filter(models.Device.id == request.device_id).first()
    if not device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="设备不存在"
        )
    
    if device.status != "online":
        return schemas.DeviceSyncResponse(
            success=False,
            message="设备离线，无法同步"
        )
    
    try:
        # 这里应该调用中间件服务来同步设备数据
        # 模拟调用中间件服务
        middleware_url = "http://localhost:9000/api/device/sync"
        payload = {
            "device_id": device.id
        }
        
        # 在实际项目中，这里应该是真实的HTTP请求
        # response = requests.post(middleware_url, json=payload)
        # if response.status_code == 200:
        #     result = response.json()
        
        # 模拟成功响应
        result = {"success": True, "message": "数据同步成功", "fingerprint_count": 10}
        
        if result["success"]:
            return schemas.DeviceSyncResponse(
                success=True,
                message="数据同步成功",
                fingerprint_count=result.get("fingerprint_count", 0)
            )
        else:
            return schemas.DeviceSyncResponse(
                success=False,
                message=result.get("message", "数据同步失败")
            )
    
    except Exception as e:
        return schemas.DeviceSyncResponse(
            success=False,
            message=f"数据同步失败: {str(e)}"
        )
