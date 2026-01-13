class SSEManager {
  private connections = new Map<string, Set<(data: string) => void>>();

  /**
   * 注册连接
   * @param projectId 项目ID
   * @param sendEvent 发送事件的回调函数
   */
  addConnection(projectId: string, sendEvent: (data: string) => void) {
    if (!this.connections.has(projectId)) {
      this.connections.set(projectId, new Set());
    }
    this.connections.get(projectId)!.add(sendEvent);
    console.log(`[SSEManager] Added connection for ${projectId}. Total: ${this.getConnectionCount(projectId)}`);
  }

  /**
   * 移除连接
   * @param projectId 项目ID
   * @param sendEvent 发送事件的回调函数
   */
  removeConnection(projectId: string, sendEvent: (data: string) => void) {
    const projectConnections = this.connections.get(projectId);
    if (projectConnections) {
      projectConnections.delete(sendEvent);
      console.log(`[SSEManager] Removed connection for ${projectId}. Remaining: ${projectConnections.size}`);
      
      if (projectConnections.size === 0) {
        this.connections.delete(projectId);
        console.log(`[SSEManager] No more connections for ${projectId}, cleaned up`);
      }
    }
  }

  /**
   * 发送事件到指定项目的所有连接
   * @param projectId 项目ID
   * @param data 发送的数据
   */
  sendEvent(projectId: string, data: unknown) {
    const projectConnections = this.connections.get(projectId);
    const count = projectConnections?.size || 0;
    
    console.log(`[SSEManager] Sending event to ${projectId}. Active connections: ${count}`);
    
    if (projectConnections && projectConnections.size > 0) {
      const message = JSON.stringify(data);
      let successCount = 0;
      let failCount = 0;
      
      projectConnections.forEach((sendEvent) => {
        try {
          sendEvent(message);
          successCount++;
        } catch (error) {
          failCount++;
          console.error(`[SSEManager] Error sending to ${projectId}:`, error);
          // 移除失败的连接
          this.removeConnection(projectId, sendEvent);
        }
      });
      
      console.log(`[SSEManager] Sent to ${projectId}: ${successCount} succeeded, ${failCount} failed`);
    } else {
      console.warn(`[SSEManager] No active connections for ${projectId}, event dropped`);
    }
  }

  /**
   * 获取连接数量
   * @param projectId 项目ID
   * @returns 连接数量
   */
  getConnectionCount(projectId: string): number {
    return this.connections.get(projectId)?.size || 0;
  }

  /**
   * 获取所有项目的连接数量（用于调试）
   * @returns 所有项目的连接数量映射
   */
  getAllConnections() {
    const result: Record<string, number> = {};
    this.connections.forEach((conns, projectId) => {
      result[projectId] = conns.size;
    });
    return result;
  }
}

export const sseManager = new SSEManager();
