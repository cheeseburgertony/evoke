"use client";

import { ErrorFallbackPage } from "@/components/error-boundary/error-fallback-page";

interface IErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage = ({ error, reset }: IErrorPageProps) => {
  return <ErrorFallbackPage error={error} resetErrorBoundary={reset} />;
};

export default ErrorPage;
