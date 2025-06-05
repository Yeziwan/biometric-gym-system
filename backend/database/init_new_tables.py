#!/usr/bin/env python3
"""
数据库初始化脚本 - 创建新的表结构
用于添加分支管理、访问控制、考勤跟踪等新功能的数据表
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from app.database.database import DATABASE_URL, Base
from app.models import models

def create_tables():
    """创建所有数据表"""
    try:
        # 创建数据库引擎
        engine = create_engine(DATABASE_URL, echo=True)
        
        print("正在创建数据表...")
        
        # 创建所有表
        Base.metadata.create_all(bind=engine)
        
        print("数据表创建成功！")
        
        # 插入一些初始数据
        insert_initial_data(engine)
        
    except Exception as e:
        print(f"创建数据表失败: {e}")
        return False
    
    return True

def insert_initial_data(engine):
    """插入初始数据"""
    try:
        with engine.connect() as conn:
            # 插入默认分支
            conn.execute(text("""
                INSERT IGNORE INTO branches (name, code, address, manager, phone, status) 
                VALUES 
                ('总部', 'HQ', '北京市朝阳区', '张经理', '010-12345678', 'active'),
                ('分店1', 'BR001', '北京市海淀区', '李经理', '010-87654321', 'active')
            """))
            
            # 更新现有会员，设置默认分支
            conn.execute(text("""
                UPDATE members SET branch_id = 1 WHERE branch_id IS NULL
            """))
            
            # 更新现有设备，设置默认分支和设备类型
            conn.execute(text("""
                UPDATE devices SET 
                    branch_id = 1,
                    device_type = 'fingerprint',
                    access_direction = 'both'
                WHERE branch_id IS NULL
            """))
            
            conn.commit()
            print("初始数据插入成功！")
            
    except Exception as e:
        print(f"插入初始数据失败: {e}")

def show_table_info():
    """显示表结构信息"""
    try:
        engine = create_engine(DATABASE_URL, echo=False)
        
        with engine.connect() as conn:
            # 获取所有表名
            result = conn.execute(text("SHOW TABLES"))
            tables = [row[0] for row in result]
            
            print("\n数据库表列表:")
            print("=" * 50)
            for table in tables:
                print(f"- {table}")
                
                # 获取表结构
                desc_result = conn.execute(text(f"DESCRIBE {table}"))
                columns = desc_result.fetchall()
                
                print("  字段信息:")
                for col in columns:
                    print(f"    {col[0]} - {col[1]} - {col[2]} - {col[3]} - {col[4]} - {col[5]}")
                print()
                
    except Exception as e:
        print(f"获取表信息失败: {e}")

if __name__ == "__main__":
    print("ZKTeco K40 生物识别系统 - 数据库初始化")
    print("=" * 50)
    
    # 创建表
    if create_tables():
        print("\n数据库初始化完成！")
        
        # 显示表信息
        show_table_info()
        
        print("\n新增功能:")
        print("1. 分支管理 - 支持多分支机构管理")
        print("2. 访问控制 - 基于权限的门禁控制")
        print("3. 考勤跟踪 - 签到签退和考勤统计")
        print("4. 权限管理 - 时间和区域访问限制")
        
    else:
        print("数据库初始化失败！")
        sys.exit(1) 