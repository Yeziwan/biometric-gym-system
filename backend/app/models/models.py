from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, LargeBinary, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base

class Member(Base):
    """会员表"""
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False, unique=True)
    email = Column(String(100), nullable=True)
    status = Column(String(20), default="active")  # active, inactive
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    # 关系
    fingerprints = relationship("FingerprintTemplate", back_populates="member", cascade="all, delete-orphan")
    recognition_logs = relationship("RecognitionLog", back_populates="member")


class Device(Base):
    """设备表"""
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    ip_address = Column(String(50), nullable=False)
    port = Column(Integer, default=4370)
    status = Column(String(20), default="offline")  # online, offline
    last_heartbeat = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    # 关系
    recognition_logs = relationship("RecognitionLog", back_populates="device")
    enrollment_logs = relationship("EnrollmentLog", back_populates="device")


class FingerprintTemplate(Base):
    """指纹模板表"""
    __tablename__ = "fingerprint_templates"

    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id"))
    template_data = Column(LargeBinary, nullable=False)  # 存储指纹模板数据
    finger_index = Column(Integer, nullable=False)  # 1-10表示不同手指
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

    # 关系
    device = relationship("Device", back_populates="enrollment_logs")


class User(Base):
    """系统用户表"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True)
    role = Column(String(20), default="user")  # admin, user
    created_at = Column(DateTime, default=datetime.now)
