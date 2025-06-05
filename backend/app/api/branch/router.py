from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database.database import get_db
from app.models import models
from app.api.branch import schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.BranchResponse])
def get_all_branches(
    skip: int = 0, 
    limit: int = 100, 
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """获取所有分支列表，支持分页和状态过滤"""
    query = db.query(models.Branch)
    
    # 根据状态过滤
    if status:
        query = query.filter(models.Branch.status == status)
    
    branches = query.offset(skip).limit(limit).all()
    
    # 获取每个分支的设备和会员数量
    result = []
    for branch in branches:
        device_count = db.query(models.Device).filter(models.Device.branch_id == branch.id).count()
        member_count = db.query(models.Member).filter(models.Member.branch_id == branch.id).count()
        
        branch_data = schemas.BranchResponse(
            id=branch.id,
            name=branch.name,
            code=branch.code,
            address=branch.address,
            manager=branch.manager,
            phone=branch.phone,
            status=branch.status,
            created_at=branch.created_at,
            updated_at=branch.updated_at,
            device_count=device_count,
            member_count=member_count
        )
        result.append(branch_data)
    
    return result

@router.post("/", response_model=schemas.BranchResponse, status_code=status.HTTP_201_CREATED)
def create_branch(branch: schemas.BranchCreate, db: Session = Depends(get_db)):
    """创建新分支"""
    # 检查分支代码是否已存在
    existing_branch = db.query(models.Branch).filter(models.Branch.code == branch.code).first()
    if existing_branch:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="分支代码已存在"
        )
    
    # 创建新分支
    db_branch = models.Branch(
        name=branch.name,
        code=branch.code,
        address=branch.address,
        manager=branch.manager,
        phone=branch.phone,
        status=branch.status
    )
    db.add(db_branch)
    db.commit()
    db.refresh(db_branch)
    
    return schemas.BranchResponse(
        id=db_branch.id,
        name=db_branch.name,
        code=db_branch.code,
        address=db_branch.address,
        manager=db_branch.manager,
        phone=db_branch.phone,
        status=db_branch.status,
        created_at=db_branch.created_at,
        updated_at=db_branch.updated_at,
        device_count=0,
        member_count=0
    )

@router.get("/{branch_id}", response_model=schemas.BranchDetail)
def get_branch(branch_id: int, db: Session = Depends(get_db)):
    """获取单个分支详情"""
    branch = db.query(models.Branch).filter(models.Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="分支不存在"
        )
    
    # 获取分支下的设备
    devices = db.query(models.Device).filter(models.Device.branch_id == branch_id).all()
    device_list = []
    for device in devices:
        device_list.append({
            "id": device.id,
            "name": device.name,
            "ip_address": device.ip_address,
            "device_type": device.device_type,
            "location": device.location,
            "status": device.status
        })
    
    # 获取分支下的会员
    members = db.query(models.Member).filter(models.Member.branch_id == branch_id).all()
    member_list = []
    for member in members:
        member_list.append({
            "id": member.id,
            "name": member.name,
            "phone": member.phone,
            "member_number": member.member_number,
            "membership_type": member.membership_type,
            "status": member.status
        })
    
    return {
        "id": branch.id,
        "name": branch.name,
        "code": branch.code,
        "address": branch.address,
        "manager": branch.manager,
        "phone": branch.phone,
        "status": branch.status,
        "created_at": branch.created_at,
        "updated_at": branch.updated_at,
        "device_count": len(device_list),
        "member_count": len(member_list),
        "devices": device_list,
        "members": member_list
    }

@router.put("/{branch_id}", response_model=schemas.BranchResponse)
def update_branch(branch_id: int, branch: schemas.BranchUpdate, db: Session = Depends(get_db)):
    """更新分支信息"""
    db_branch = db.query(models.Branch).filter(models.Branch.id == branch_id).first()
    if not db_branch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="分支不存在"
        )
    
    # 检查分支代码是否与其他分支重复
    if branch.code != db_branch.code:
        existing_branch = db.query(models.Branch).filter(models.Branch.code == branch.code).first()
        if existing_branch:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="分支代码已存在"
            )
    
    # 更新分支信息
    db_branch.name = branch.name
    db_branch.code = branch.code
    db_branch.address = branch.address
    db_branch.manager = branch.manager
    db_branch.phone = branch.phone
    db_branch.status = branch.status
    db_branch.updated_at = datetime.now()
    
    db.commit()
    db.refresh(db_branch)
    
    # 获取设备和会员数量
    device_count = db.query(models.Device).filter(models.Device.branch_id == branch_id).count()
    member_count = db.query(models.Member).filter(models.Member.branch_id == branch_id).count()
    
    return schemas.BranchResponse(
        id=db_branch.id,
        name=db_branch.name,
        code=db_branch.code,
        address=db_branch.address,
        manager=db_branch.manager,
        phone=db_branch.phone,
        status=db_branch.status,
        created_at=db_branch.created_at,
        updated_at=db_branch.updated_at,
        device_count=device_count,
        member_count=member_count
    )

@router.delete("/{branch_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_branch(branch_id: int, db: Session = Depends(get_db)):
    """删除分支"""
    db_branch = db.query(models.Branch).filter(models.Branch.id == branch_id).first()
    if not db_branch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="分支不存在"
        )
    
    # 检查是否有关联的设备或会员
    device_count = db.query(models.Device).filter(models.Device.branch_id == branch_id).count()
    member_count = db.query(models.Member).filter(models.Member.branch_id == branch_id).count()
    
    if device_count > 0 or member_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="无法删除分支，存在关联的设备或会员"
        )
    
    db.delete(db_branch)
    db.commit()
    
    return None 