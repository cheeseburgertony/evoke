"use client";

import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { ErrorFallbackPage } from "./error-fallback-page";

interface IErrorBoundaryProps {
  children: React.ReactNode;
}

export const ErrorBoundary = ({ children }: IErrorBoundaryProps) => {
  return (
    <ReactErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorFallbackPage
          error={error}
          resetErrorBoundary={resetErrorBoundary}
        />
      )}
    >
      {children}
    </ReactErrorBoundary>
  );
};
