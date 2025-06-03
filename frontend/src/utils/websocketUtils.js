/**
 * WebSocket 通信工具类
 */

// 获取环境变量中的 WebSocket URL，如果未设置则使用默认值
const WS_BASE_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectTimeout = null;
    this.messageHandlers = {};
    this.connectionHandlers = {
      onOpen: [],
      onClose: [],
      onError: []
    };
  }

  /**
   * 连接到 WebSocket 服务器
   * @param {string} url - WebSocket 服务器 URL
   * @returns {Promise} 连接成功或失败的 Promise
   */
  connect(url) {
    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
          console.log('WebSocket 连接已建立');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.connectionHandlers.onOpen.forEach(handler => handler());
          resolve();
        };

        this.socket.onclose = (event) => {
          console.log(`WebSocket 连接已关闭: ${event.code} ${event.reason}`);
          this.isConnected = false;
          this.connectionHandlers.onClose.forEach(handler => handler(event));
          this.attemptReconnect(url);
        };

        this.socket.onerror = (error) => {
          console.error('WebSocket 错误:', error);
          this.connectionHandlers.onError.forEach(handler => handler(error));
          reject(error);
        };

        this.socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            const messageType = data.type || 'default';
            
            if (this.messageHandlers[messageType]) {
              this.messageHandlers[messageType].forEach(handler => handler(data));
            }
          } catch (error) {
            console.error('处理 WebSocket 消息时出错:', error);
          }
        };
      } catch (error) {
        console.error('创建 WebSocket 连接时出错:', error);
        reject(error);
      }
    });
  }

  /**
   * 尝试重新连接
   * @param {string} url - WebSocket 服务器 URL
   * @private
   */
  attemptReconnect(url) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('达到最大重连次数，停止重连');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    console.log(`${delay}ms 后尝试重连 (尝试 ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    clearTimeout(this.reconnectTimeout);
    this.reconnectTimeout = setTimeout(() => {
      console.log('正在尝试重新连接...');
      this.connect(url).catch(() => {
        // 连接失败，将在 onclose 事件中再次尝试
      });
    }, delay);
  }

  /**
   * 断开 WebSocket 连接
   */
  disconnect() {
    if (this.socket && this.isConnected) {
      this.socket.close();
      this.isConnected = false;
      clearTimeout(this.reconnectTimeout);
      console.log('WebSocket 连接已手动断开');
    }
  }

  /**
   * 发送消息到服务器
   * @param {Object} data - 要发送的数据对象
   * @returns {boolean} 发送是否成功
   */
  send(data) {
    if (!this.socket || !this.isConnected) {
      console.error('WebSocket 未连接，无法发送消息');
      return false;
    }

    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      this.socket.send(message);
      return true;
    } catch (error) {
      console.error('发送 WebSocket 消息时出错:', error);
      return false;
    }
  }

  /**
   * 添加消息处理函数
   * @param {string} messageType - 消息类型
   * @param {Function} handler - 处理函数
   */
  addMessageHandler(messageType, handler) {
    if (!this.messageHandlers[messageType]) {
      this.messageHandlers[messageType] = [];
    }
    this.messageHandlers[messageType].push(handler);
  }

  /**
   * 移除消息处理函数
   * @param {string} messageType - 消息类型
   * @param {Function} handler - 要移除的处理函数
   */
  removeMessageHandler(messageType, handler) {
    if (this.messageHandlers[messageType]) {
      this.messageHandlers[messageType] = this.messageHandlers[messageType].filter(h => h !== handler);
    }
  }

  /**
   * 添加连接事件处理函数
   * @param {string} eventType - 事件类型 ('onOpen', 'onClose', 'onError')
   * @param {Function} handler - 处理函数
   */
  addConnectionHandler(eventType, handler) {
    if (this.connectionHandlers[eventType]) {
      this.connectionHandlers[eventType].push(handler);
    }
  }

  /**
   * 移除连接事件处理函数
   * @param {string} eventType - 事件类型 ('onOpen', 'onClose', 'onError')
   * @param {Function} handler - 要移除的处理函数
   */
  removeConnectionHandler(eventType, handler) {
    if (this.connectionHandlers[eventType]) {
      this.connectionHandlers[eventType] = this.connectionHandlers[eventType].filter(h => h !== handler);
    }
  }
}

// 创建单例实例
const websocketService = new WebSocketService();

export default websocketService;
