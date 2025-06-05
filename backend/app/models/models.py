from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, LargeBinary, Text, Date, Time
from sqlalchemy.orm import relationship
from datetime import datetime, date
from app.database.database import Base

class Branch(Base):
    """分支机构表"""
    __tablename__ = "branches"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    code = Column(String(20), nullable=False, unique=True)  # 分支代码
    address = Column(String(200), nullable=True)
    manager = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    status = Column(String(20), default="active")  # active, inactive
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    # 关系
    devices = relationship("Device", back_populates="branch")
    members = relationship("Member", back_populates="branch")

class Member(Base):
    """会员表"""
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False, unique=True)
    email = Column(String(100), nullable=True)
    member_number = Column(String(50), nullable=True, unique=True)  # 会员编号
    branch_id = Column(Integer, ForeignKey("branches.id"), nullable=True)  # 所属分支
    membership_type = Column(String(50), default="regular")  # regular, vip, premium
    membership_start = Column(Date, nullable=True)  # 会员开始日期
    membership_end = Column(Date, nullable=True)  # 会员结束日期
    status = Column(String(20), default="active")  # active, inactive, expired
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    # 关系
    branch = relationship("Branch", back_populates="members")
    fingerprints = relationship("FingerprintTemplate", back_populates="member", cascade="all, delete-orphan")
    recognition_logs = relationship("RecognitionLog", back_populates="member")
    access_controls = relationship("AccessControl", back_populates="member")
    attendance_records = relationship("AttendanceRecord", back_populates="member")
    access_permissions = relationship("AccessPermission", back_populates="member")

class Device(Base):
    """设备表"""
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    ip_address = Column(String(50), nullable=False)
    port = Column(Integer, default=4370)
    device_type = Column(String(50), default="fingerprint")  # fingerprint, face, card, mixed
    location = Column(String(100), nullable=True)  # 设备位置描述
    branch_id = Column(Integer, ForeignKey("branches.id"), nullable=True)  # 所属分支
    access_direction = Column(String(20), default="both")  # entry, exit, both
    status = Column(String(20), default="offline")  # online, offline
    last_heartbeat = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    # 关系
    branch = relationship("Branch", back_populates="devices")
    recognition_logs = relationship("RecognitionLog", back_populates="device")
    enrollment_logs = relationship("EnrollmentLog", back_populates="device")
    access_controls = relationship("AccessControl", back_populates="device")
    attendance_records = relationship("AttendanceRecord", back_populates="device")

class FingerprintTemplate(Base):
    """指纹模板表"""
    __tablename__ = "fingerprint_templates"

    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id"))
    template_data = Column(LargeBinary, nullable=False)  # 存储指纹模板数据
    finger_index = Column(Integer, nullable=False)  # 1-10表示不同手指
    quality = Column(Integer, nullable=True)  # 指纹质量评分
    created_at = Column(DateTime, default=datetime.now)

    # 关系
    member = relationship("Member", back_populates="fingerprints")

class RecognitionLog(Base):
    """识别记录表"""
    __tablename__ = "recognition_logs"

    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id"), nullable=True)  # 可能识别失败，没有对应会员
    device_id = Column(Integer, ForeignKey("devices.id"))
    recognized_at = Column(DateTime, default=datetime.now)
    status = Column(String(20), nullable=False)  # success, failed
    confidence = Column(Integer, nullable=True)  # 识别置信度，0-100
    recognition_type = Column(String(20), default="fingerprint")  # fingerprint, face, card

    # 关系
    member = relationship("Member", back_populates="recognition_logs")
    device = relationship("Device", back_populates="recognition_logs")

class EnrollmentLog(Base):
    """录入记录表"""
    __tablename__ = "enrollment_logs"

    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id"))
    device_id = Column(Integer, ForeignKey("devices.id"))
    enrolled_at = Column(DateTime, default=datetime.now)
    status = Column(String(20), nullable=False)  # success, failed
    finger_index = Column(Integer, nullable=False)  # 1-10表示不同手指
    enrollment_type = Column(String(20), default="fingerprint")  # fingerprint, face

    # 关系
    device = relationship("Device", back_populates="enrollment_logs")

class AccessControl(Base):
    """访问控制记录表"""
    __tablename__ = "access_controls"

    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id"), nullable=True)
    device_id = Column(Integer, ForeignKey("devices.id"))
    access_type = Column(String(20), nullable=False)  # entry, exit
    access_time = Column(DateTime, default=datetime.now)
    status = Column(String(20), nullable=False)  # allowed, denied
    reason = Column(String(200), nullable=True)  # 拒绝原因
    recognition_method = Column(String(20), default="fingerprint")  # fingerprint, face, card

    # 关系
    member = relationship("Member", back_populates="access_controls")
    device = relationship("Device", back_populates="access_controls")

class AttendanceRecord(Base):
    """考勤记录表"""
    __tablename__ = "attendance_records"

    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id"))
    device_id = Column(Integer, ForeignKey("devices.id"))
    date = Column(Date, default=date.today)
    check_in_time = Column(DateTime, nullable=True)
    check_out_time = Column(DateTime, nullable=True)
    duration_minutes = Column(Integer, nullable=True)  # 停留时间（分钟）
    status = Column(String(20), default="incomplete")  # complete, incomplete, abnormal

    # 关系
    member = relationship("Member", back_populates="attendance_records")
    device = relationship("Device", back_populates="attendance_records")

class AccessPermission(Base):
    """访问权限表"""
    __tablename__ = "access_permissions"

    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id"))
    device_id = Column(Integer, ForeignKey("devices.id"), nullable=True)  # 空表示所有设备
    permission_type = Column(String(20), default="full")  # full, time_limited, area_limited
    start_time = Column(Time, nullable=True)  # 允许访问开始时间
    end_time = Column(Time, nullable=True)  # 允许访问结束时间
    start_date = Column(Date, nullable=True)  # 权限开始日期
    end_date = Column(Date, nullable=True)  # 权限结束日期
    days_of_week = Column(String(20), default="1234567")  # 允许访问的星期几，1-7表示周一到周日
    status = Column(String(20), default="active")  # active, inactive
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    # 关系
    member = relationship("Member", back_populates="access_permissions")

class User(Base):
    """系统用户表"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True)
    role = Column(String(20), default="user")  # admin, user, manager
    branch_id = Column(Integer, ForeignKey("branches.id"), nullable=True)  # 用户所属分支
    created_at = Column(DateTime, default=datetime.now)
