from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# 数据库URL
DATABASE_URL = "mysql+pymysql://root:password@localhost/biometric_gym"

# 创建SQLAlchemy引擎
engine = create_engine(
    DATABASE_URL,
    echo=True,  # 打印SQL语句，生产环境可设为False
    pool_pre_ping=True,  # 自动检测连接是否有效
)

# 创建SessionLocal类
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 创建Base类
Base = declarative_base()

# 获取数据库会话
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
