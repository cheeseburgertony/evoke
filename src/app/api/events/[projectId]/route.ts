import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { sseManager } from "@/lib/sse-manager";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth();
  const { projectId } = await params;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
      userId,
    },
  });

  if (!project) {
    return new Response("Project not found", { status: 404 });
  }

  // 创建SSE流
  const encoder = new TextEncoder();
  let isClosed = false; // 添加状态追踪

  const stream = new ReadableStream({
    start(controller) {
      // 发送初始连接消息
      const initialMessage = `data: ${JSON.stringify({
        type: "connected",
        projectId,
        timestamp: Date.now(),
      })}\n\n`;
      controller.enqueue(encoder.encode(initialMessage));

      // 安全的发送函数
      const sendEvent = (data: string) => {
        if (isClosed) return; // 防止在关闭后发送
        
        try {
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        } catch (error) {
          console.error(`[SSE] Failed to send event to ${projectId}:`, error);
          isClosed = true;
          sseManager.removeConnection(projectId, sendEvent);
        }
      };

      sseManager.addConnection(projectId, sendEvent);
      console.log(`[SSE] Connection established for project ${projectId}`);

      // 缩短心跳间隔到15秒
      const heartbeat = setInterval(() => {
        if (isClosed) {
          clearInterval(heartbeat);
          return;
        }
        
        try {
          controller.enqueue(encoder.encode(`: heartbeat ${Date.now()}\n\n`));
        } catch (error) {
          console.error(`[SSE] Heartbeat failed for ${projectId}:`, error);
          clearInterval(heartbeat);
          isClosed = true;
        }
      }, 15000); // 改为15秒

      // 清理函数
      const cleanup = () => {
        if (isClosed) return;
        isClosed = true;
        
        clearInterval(heartbeat);
        sseManager.removeConnection(projectId, sendEvent);
        console.log(`[SSE] Connection closed for project ${projectId}`);
        
        try {
          controller.close();
        } catch (error) {
          console.error(`[SSE] Error closing controller:`, error);
        }
      };

      request.signal.addEventListener("abort", cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
      "X-SSE-Timeout": "300", // 5分钟
    },
  });
}
