from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class BranchBase(BaseModel):
    name: str
    code: str
    address: Optional[str] = None
    manager: Optional[str] = None
    phone: Optional[str] = None
    status: str = "active"

class BranchCreate(BranchBase):
    pass

class BranchUpdate(BranchBase):
    pass

class BranchResponse(BranchBase):
    id: int
    created_at: datetime
    updated_at: datetime
    device_count: int = 0
    member_count: int = 0

    class Config:
        from_attributes = True

class BranchDetail(BranchResponse):
    devices: List[dict] = []
    members: List[dict] = []

    class Config:
        from_attributes = True 