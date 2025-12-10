"use client";

import { useEffect, useRef } from "react";
import type { ProcessingProgress } from "@/types/progress";

type SSEMessageType =
  | "connected"
  | "message_created"
  | "project_name_updated"
  | "progress_update";

export interface SSEMessage {
  type: SSEMessageType;
  progress?: ProcessingProgress;
  [key: string]: unknown;
}

interface UseSSEOptions {
  onMessage?: (message: SSEMessage) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  enabled?: boolean;
}

export function useSSE(projectId: string, options: UseSSEOptions = {}) {
  const { onMessage, onError, onOpen, enabled = true } = options;
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);
  const onOpenRef = useRef(onOpen);

  // 保持引用最新
  useEffect(() => {
    onMessageRef.current = onMessage;
    onErrorRef.current = onError;
    onOpenRef.current = onOpen;
  }, [onMessage, onError, onOpen]);

  useEffect(() => {
    if (!enabled || !projectId) return;

    const connect = () => {
      // 清理现有连接
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      try {
        const eventSource = new EventSource(`/api/events/${projectId}`);

        eventSource.onopen = () => {
          console.log("SSE connection established");
          reconnectAttemptsRef.current = 0;
          onOpenRef.current?.();
        };

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as SSEMessage;
            onMessageRef.current?.(data);
          } catch (error) {
            console.error("Failed to parse SSE message:", error);
          }
        };

        eventSource.onerror = (error) => {
          console.error("SSE connection error:", error);
          eventSource.close();
          onErrorRef.current?.(error);

          // 尝试重连
          if (reconnectAttemptsRef.current < maxReconnectAttempts) {
            reconnectAttemptsRef.current += 1;
            const delay = Math.min(
              1000 * 2 ** reconnectAttemptsRef.current,
              30000
            );
            console.log(
              `Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current})`
            );

            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, delay);
          } else {
            console.error("Max reconnection attempts reached");
          }
        };

        eventSourceRef.current = eventSource;
      } catch (error) {
        console.error("Failed to create EventSource:", error);
      }
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [projectId, enabled]);
}
