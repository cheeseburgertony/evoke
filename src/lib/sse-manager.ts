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
      if (projectConnections.size === 0) {
        this.connections.delete(projectId);
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
    if (projectConnections && projectConnections.size > 0) {
      const message = JSON.stringify(data);
      projectConnections.forEach((sendEvent) => {
        try {
          sendEvent(message);
        } catch (error) {
          console.error("Error sending SSE event:", error);
        }
      });
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
}

export const sseManager = new SSEManager();
