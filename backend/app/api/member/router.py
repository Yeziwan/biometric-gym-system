from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database.database import get_db
from app.models import models
from app.api.member import schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.MemberResponse])
def get_all_members(
    skip: int = 0, 
    limit: int = 100, 
    status: Optional[str] = None, 
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """获取所有会员列表，支持分页、状态过滤和搜索"""
    query = db.query(models.Member)
    
    # 根据状态过滤
    if status:
        query = query.filter(models.Member.status == status)
    
    # 搜索功能
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (models.Member.name.like(search_term)) | 
            (models.Member.phone.like(search_term)) |
            (models.Member.email.like(search_term))
        )
    
    members = query.offset(skip).limit(limit).all()
    
    # 获取每个会员的指纹数量和最后识别时间
    result = []
    for member in members:
        # 指纹数量
        fingerprint_count = db.query(models.FingerprintTemplate).filter(
            models.FingerprintTemplate.member_id == member.id
        ).count()
        
        # 最后识别时间
        last_recognition = db.query(models.RecognitionLog).filter(
            models.RecognitionLog.member_id == member.id,
            models.RecognitionLog.status == "success"
        ).order_by(models.RecognitionLog.recognized_at.desc()).first()
        
        member_data = schemas.MemberResponse(
            id=member.id,
            name=member.name,
            phone=member.phone,
            email=member.email,
            status=member.status,
            created_at=member.created_at,
            updated_at=member.updated_at,
            fingerprint_count=fingerprint_count,
            last_recognition=last_recognition.recognized_at if last_recognition else None
        )
        result.append(member_data)
    
    return result

@router.post("/", response_model=schemas.MemberResponse, status_code=status.HTTP_201_CREATED)
def create_member(member: schemas.MemberCreate, db: Session = Depends(get_db)):
    """创建新会员"""
    # 检查手机号是否已存在
    existing_member = db.query(models.Member).filter(models.Member.phone == member.phone).first()
    if existing_member:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="手机号已存在"
        )
    
    # 创建新会员
    db_member = models.Member(
        name=member.name,
        phone=member.phone,
        email=member.email,
        status=member.status
    )
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    
    return schemas.MemberResponse(
        id=db_member.id,
        name=db_member.name,
        phone=db_member.phone,
        email=db_member.email,
        status=db_member.status,
        created_at=db_member.created_at,
        updated_at=db_member.updated_at,
        fingerprint_count=0,
        last_recognition=None
    )

@router.get("/{member_id}", response_model=schemas.MemberDetail)
def get_member(member_id: int, db: Session = Depends(get_db)):
    """获取单个会员详情"""
    member = db.query(models.Member).filter(models.Member.id == member_id).first()
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="会员不存在"
        )
    
    # 获取会员指纹列表
    fingerprints = db.query(models.FingerprintTemplate).filter(
        models.FingerprintTemplate.member_id == member_id
    ).all()
    
    # 获取会员识别记录
    recognition_logs = db.query(
        models.RecognitionLog, models.Device.name.label("device_name")
    ).join(
        models.Device, models.RecognitionLog.device_id == models.Device.id
    ).filter(
        models.RecognitionLog.member_id == member_id
    ).order_by(
        models.RecognitionLog.recognized_at.desc()
    ).limit(10).all()
    
    # 格式化识别记录
    formatted_logs = []
    for log, device_name in recognition_logs:
        formatted_logs.append({
            "id": log.id,
            "device_name": device_name,
            "recognized_at": log.recognized_at,
            "status": log.status,
            "confidence": log.confidence
        })
    
    # 格式化指纹信息
    formatted_fingerprints = []
    for fp in fingerprints:
        formatted_fingerprints.append({
            "id": fp.id,
            "finger_index": fp.finger_index,
            "created_at": fp.created_at
        })
    
    return {
        "id": member.id,
        "name": member.name,
        "phone": member.phone,
        "email": member.email,
        "status": member.status,
        "created_at": member.created_at,
        "updated_at": member.updated_at,
        "fingerprints": formatted_fingerprints,
        "recognition_logs": formatted_logs,
        "fingerprint_count": len(fingerprints)
    }

@router.put("/{member_id}", response_model=schemas.MemberResponse)
def update_member(member_id: int, member: schemas.MemberUpdate, db: Session = Depends(get_db)):
    """更新会员信息"""
    db_member = db.query(models.Member).filter(models.Member.id == member_id).first()
    if not db_member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="会员不存在"
        )
    
    # 检查手机号是否与其他会员重复
    if member.phone != db_member.phone:
        existing_member = db.query(models.Member).filter(models.Member.phone == member.phone).first()
        if existing_member:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="手机号已存在"
            )
    
    # 更新会员信息
    db_member.name = member.name
    db_member.phone = member.phone
    db_member.email = member.email
    db_member.status = member.status
    db_member.updated_at = datetime.now()
    
    db.commit()
    db.refresh(db_member)
    
    # 获取指纹数量和最后识别时间
    fingerprint_count = db.query(models.FingerprintTemplate).filter(
        models.FingerprintTemplate.member_id == member_id
    ).count()
    
    last_recognition = db.query(models.RecognitionLog).filter(
        models.RecognitionLog.member_id == member_id,
        models.RecognitionLog.status == "success"
    ).order_by(models.RecognitionLog.recognized_at.desc()).first()
    
    return schemas.MemberResponse(
        id=db_member.id,
        name=db_member.name,
        phone=db_member.phone,
        email=db_member.email,
        status=db_member.status,
        created_at=db_member.created_at,
        updated_at=db_member.updated_at,
        fingerprint_count=fingerprint_count,
        last_recognition=last_recognition.recognized_at if last_recognition else None
    )

@router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_member(member_id: int, db: Session = Depends(get_db)):
    """删除会员"""
    db_member = db.query(models.Member).filter(models.Member.id == member_id).first()
    if not db_member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="会员不存在"
        )
    
    db.delete(db_member)
    db.commit()
    
    return None
