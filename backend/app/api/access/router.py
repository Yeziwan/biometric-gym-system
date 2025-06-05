from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date, time

from app.database.database import get_db
from app.models import models
from app.api.access import schemas

router = APIRouter()

@router.post("/control", response_model=schemas.AccessControlResult)
def check_access_control(request: schemas.AccessControlRequest, db: Session = Depends(get_db)):
    """检查访问控制权限"""
    # 获取会员信息
    member = db.query(models.Member).filter(models.Member.id == request.member_id).first()
    if not member:
        # 记录访问控制日志
        access_log = models.AccessControl(
            member_id=None,
            device_id=request.device_id,
            access_type=request.access_type,
            status="denied",
            reason="会员不存在",
            recognition_method=request.recognition_method
        )
        db.add(access_log)
        db.commit()
        
        return schemas.AccessControlResult(
            allowed=False,
            reason="会员不存在"
        )
    
    # 检查会员状态
    if member.status != "active":
        reason = "会员状态异常"
        if member.status == "expired":
            reason = "会员已过期"
        elif member.status == "inactive":
            reason = "会员已停用"
        
        # 记录访问控制日志
        access_log = models.AccessControl(
            member_id=member.id,
            device_id=request.device_id,
            access_type=request.access_type,
            status="denied",
            reason=reason,
            recognition_method=request.recognition_method
        )
        db.add(access_log)
        db.commit()
        
        return schemas.AccessControlResult(
            allowed=False,
            reason=reason
        )
    
    # 检查会员权限
    current_time = datetime.now().time()
    current_date = date.today()
    current_weekday = str(current_date.weekday() + 1)  # 1-7表示周一到周日
    
    # 查找适用的权限规则
    permissions = db.query(models.AccessPermission).filter(
        models.AccessPermission.member_id == member.id,
        models.AccessPermission.status == "active"
    ).all()
    
    # 如果没有权限规则，默认允许
    if not permissions:
        # 记录访问控制日志
        access_log = models.AccessControl(
            member_id=member.id,
            device_id=request.device_id,
            access_type=request.access_type,
            status="allowed",
            recognition_method=request.recognition_method
        )
        db.add(access_log)
        db.commit()
        
        return schemas.AccessControlResult(
            allowed=True,
            member_info={
                "id": member.id,
                "name": member.name,
                "member_number": member.member_number,
                "membership_type": member.membership_type
            }
        )
    
    # 检查权限规则
    for permission in permissions:
        # 检查设备权限
        if permission.device_id and permission.device_id != request.device_id:
            continue
        
        # 检查日期范围
        if permission.start_date and current_date < permission.start_date:
            continue
        if permission.end_date and current_date > permission.end_date:
            continue
        
        # 检查星期几
        if current_weekday not in permission.days_of_week:
            continue
        
        # 检查时间范围
        if permission.start_time and permission.end_time:
            if not (permission.start_time <= current_time <= permission.end_time):
                continue
        
        # 如果通过所有检查，允许访问
        access_log = models.AccessControl(
            member_id=member.id,
            device_id=request.device_id,
            access_type=request.access_type,
            status="allowed",
            recognition_method=request.recognition_method
        )
        db.add(access_log)
        db.commit()
        
        return schemas.AccessControlResult(
            allowed=True,
            member_info={
                "id": member.id,
                "name": member.name,
                "member_number": member.member_number,
                "membership_type": member.membership_type
            }
        )
    
    # 如果没有匹配的权限规则，拒绝访问
    access_log = models.AccessControl(
        member_id=member.id,
        device_id=request.device_id,
        access_type=request.access_type,
        status="denied",
        reason="无访问权限",
        recognition_method=request.recognition_method
    )
    db.add(access_log)
    db.commit()
    
    return schemas.AccessControlResult(
        allowed=False,
        reason="无访问权限"
    )

@router.get("/logs", response_model=List[schemas.AccessControlResponse])
def get_access_logs(
    skip: int = 0,
    limit: int = 100,
    member_id: Optional[int] = None,
    device_id: Optional[int] = None,
    access_type: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """获取访问控制日志"""
    query = db.query(
        models.AccessControl,
        models.Member.name.label("member_name"),
        models.Device.name.label("device_name")
    ).outerjoin(
        models.Member,
        models.AccessControl.member_id == models.Member.id
    ).join(
        models.Device,
        models.AccessControl.device_id == models.Device.id
    )
    
    # 应用过滤条件
    if member_id:
        query = query.filter(models.AccessControl.member_id == member_id)
    if device_id:
        query = query.filter(models.AccessControl.device_id == device_id)
    if access_type:
        query = query.filter(models.AccessControl.access_type == access_type)
    if status:
        query = query.filter(models.AccessControl.status == status)
    
    # 按时间倒序排列
    query = query.order_by(models.AccessControl.access_time.desc())
    
    logs = query.offset(skip).limit(limit).all()
    
    result = []
    for log, member_name, device_name in logs:
        result.append(schemas.AccessControlResponse(
            id=log.id,
            member_id=log.member_id,
            device_id=log.device_id,
            access_type=log.access_type,
            access_time=log.access_time,
            status=log.status,
            reason=log.reason,
            recognition_method=log.recognition_method,
            member_name=member_name,
            device_name=device_name
        ))
    
    return result

@router.get("/permissions", response_model=List[schemas.AccessPermissionResponse])
def get_access_permissions(
    skip: int = 0,
    limit: int = 100,
    member_id: Optional[int] = None,
    device_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """获取访问权限列表"""
    query = db.query(
        models.AccessPermission,
        models.Member.name.label("member_name"),
        models.Device.name.label("device_name")
    ).join(
        models.Member,
        models.AccessPermission.member_id == models.Member.id
    ).outerjoin(
        models.Device,
        models.AccessPermission.device_id == models.Device.id
    )
    
    # 应用过滤条件
    if member_id:
        query = query.filter(models.AccessPermission.member_id == member_id)
    if device_id:
        query = query.filter(models.AccessPermission.device_id == device_id)
    
    permissions = query.offset(skip).limit(limit).all()
    
    result = []
    for permission, member_name, device_name in permissions:
        result.append(schemas.AccessPermissionResponse(
            id=permission.id,
            member_id=permission.member_id,
            device_id=permission.device_id,
            permission_type=permission.permission_type,
            start_time=permission.start_time,
            end_time=permission.end_time,
            start_date=permission.start_date,
            end_date=permission.end_date,
            days_of_week=permission.days_of_week,
            status=permission.status,
            created_at=permission.created_at,
            updated_at=permission.updated_at,
            member_name=member_name,
            device_name=device_name
        ))
    
    return result

@router.post("/permissions", response_model=schemas.AccessPermissionResponse, status_code=status.HTTP_201_CREATED)
def create_access_permission(permission: schemas.AccessPermissionCreate, db: Session = Depends(get_db)):
    """创建访问权限"""
    # 检查会员是否存在
    member = db.query(models.Member).filter(models.Member.id == permission.member_id).first()
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="会员不存在"
        )
    
    # 检查设备是否存在（如果指定了设备）
    if permission.device_id:
        device = db.query(models.Device).filter(models.Device.id == permission.device_id).first()
        if not device:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="设备不存在"
            )
    
    # 创建权限
    db_permission = models.AccessPermission(
        member_id=permission.member_id,
        device_id=permission.device_id,
        permission_type=permission.permission_type,
        start_time=permission.start_time,
        end_time=permission.end_time,
        start_date=permission.start_date,
        end_date=permission.end_date,
        days_of_week=permission.days_of_week,
        status=permission.status
    )
    db.add(db_permission)
    db.commit()
    db.refresh(db_permission)
    
    # 获取关联信息
    member_name = member.name
    device_name = None
    if permission.device_id:
        device = db.query(models.Device).filter(models.Device.id == permission.device_id).first()
        device_name = device.name if device else None
    
    return schemas.AccessPermissionResponse(
        id=db_permission.id,
        member_id=db_permission.member_id,
        device_id=db_permission.device_id,
        permission_type=db_permission.permission_type,
        start_time=db_permission.start_time,
        end_time=db_permission.end_time,
        start_date=db_permission.start_date,
        end_date=db_permission.end_date,
        days_of_week=db_permission.days_of_week,
        status=db_permission.status,
        created_at=db_permission.created_at,
        updated_at=db_permission.updated_at,
        member_name=member_name,
        device_name=device_name
    )

@router.put("/permissions/{permission_id}", response_model=schemas.AccessPermissionResponse)
def update_access_permission(
    permission_id: int,
    permission: schemas.AccessPermissionUpdate,
    db: Session = Depends(get_db)
):
    """更新访问权限"""
    db_permission = db.query(models.AccessPermission).filter(models.AccessPermission.id == permission_id).first()
    if not db_permission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="权限不存在"
        )
    
    # 更新权限信息
    db_permission.member_id = permission.member_id
    db_permission.device_id = permission.device_id
    db_permission.permission_type = permission.permission_type
    db_permission.start_time = permission.start_time
    db_permission.end_time = permission.end_time
    db_permission.start_date = permission.start_date
    db_permission.end_date = permission.end_date
    db_permission.days_of_week = permission.days_of_week
    db_permission.status = permission.status
    db_permission.updated_at = datetime.now()
    
    db.commit()
    db.refresh(db_permission)
    
    # 获取关联信息
    member = db.query(models.Member).filter(models.Member.id == permission.member_id).first()
    member_name = member.name if member else "未知"
    
    device_name = None
    if permission.device_id:
        device = db.query(models.Device).filter(models.Device.id == permission.device_id).first()
        device_name = device.name if device else None
    
    return schemas.AccessPermissionResponse(
        id=db_permission.id,
        member_id=db_permission.member_id,
        device_id=db_permission.device_id,
        permission_type=db_permission.permission_type,
        start_time=db_permission.start_time,
        end_time=db_permission.end_time,
        start_date=db_permission.start_date,
        end_date=db_permission.end_date,
        days_of_week=db_permission.days_of_week,
        status=db_permission.status,
        created_at=db_permission.created_at,
        updated_at=db_permission.updated_at,
        member_name=member_name,
        device_name=device_name
    )

@router.delete("/permissions/{permission_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_access_permission(permission_id: int, db: Session = Depends(get_db)):
    """删除访问权限"""
    db_permission = db.query(models.AccessPermission).filter(models.AccessPermission.id == permission_id).first()
    if not db_permission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="权限不存在"
        )
    
    db.delete(db_permission)
    db.commit()
    
    return None 