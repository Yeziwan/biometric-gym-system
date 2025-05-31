import sys
import os
import asyncio
from sqlalchemy import text

# Add the parent directory to the path so we can import the app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.database import engine
from app.models.models import Base


async def init_db():
    """
    初始化数据库：创建所有表并添加初始数据
    """
    print("正在创建数据库表...")
    
    # 创建所有表
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    
    print("表创建成功！")
    
    # 添加初始数据
    print("正在添加初始数据...")
    
    # 读取SQL脚本
    sql_file_path = os.path.join(os.path.dirname(__file__), 'init_data.sql')
    
    try:
        with open(sql_file_path, 'r', encoding='utf-8') as f:
            sql_script = f.read()
        
        # 执行SQL脚本
        async with engine.begin() as conn:
            # 分割SQL语句并执行
            for statement in sql_script.split(';'):
                if statement.strip():
                    await conn.execute(text(statement))
        
        print("初始数据添加成功！")
        print("数据库初始化完成！")
    
    except FileNotFoundError:
        print(f"警告: 未找到初始数据SQL文件 {sql_file_path}")
        print("数据库表已创建，但未添加初始数据。")
    
    except Exception as e:
        print(f"添加初始数据时出错: {e}")
        print("数据库表已创建，但初始数据添加失败。")


if __name__ == "__main__":
    # 运行数据库初始化
    asyncio.run(init_db())
