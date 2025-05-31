from fastapi.websockets import WebSocket
from typing import List, Dict
import json

class ConnectionManager:
    """WebSocket连接管理器，处理客户端连接和消息广播"""
    
    def __init__(self):
        # 活跃的WebSocket连接列表
        self.active_connections: List[WebSocket] = []
        
    async def connect(self, websocket: WebSocket):
        """处理新的WebSocket连接"""
        await websocket.accept()
        self.active_connections.append(websocket)
        
    def disconnect(self, websocket: WebSocket):
        """处理WebSocket断开连接"""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            
    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """向特定客户端发送消息"""
        await websocket.send_text(json.dumps(message))
        
    async def broadcast(self, message: dict):
        """向所有连接的客户端广播消息"""
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except Exception as e:
                print(f"广播消息失败: {e}")
                # 如果发送失败，可能是连接已断开，从活跃连接中移除
                self.disconnect(connection)
