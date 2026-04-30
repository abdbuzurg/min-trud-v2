import { NextRequest, NextResponse } from "next/server";
import { structuredLogger } from "./structuredLogger";
import type { ApiErrorTag } from "./apiErrorTypes";

type RouteHandler<TContext = unknown> = (
  request: NextRequest,
  context: TContext
) => Promise<Response>;

const createRequestId = (): string => {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
};

const getQueryParams = (requestUrl: string): Record<string, string> => {
  const url = new URL(requestUrl);
  return Object.fromEntries(url.searchParams.entries());
};

export function withApiLogging<TContext = unknown>(
  endpoint: string,
  handler: RouteHandler<TContext>
) {
  return async (request: NextRequest, context: TContext): Promise<Response> => {
    const startedAt = Date.now();
    const requestId = request.headers.get("x-request-id") ?? createRequestId();
    const path = new URL(request.url).pathname;

    structuredLogger.info("api.request.start", {
      requestId,
      endpoint,
      method: request.method,
      path,
      query: getQueryParams(request.url),
    });

    try {
      const response = await handler(request, context);
      const durationMs = Date.now() - startedAt;
      const status = response.status;
      const tag: ApiErrorTag | undefined =
        status >= 500 ? "INTERNAL" : status >= 400 ? "VALIDATION" : undefined;

      if (status >= 500) {
        structuredLogger.error("api.request.finish", {
          requestId,
          endpoint,
          method: request.method,
          path,
          status,
          durationMs,
          tag,
        });
      } else if (status >= 400) {
        structuredLogger.warn("api.request.finish", {
          requestId,
          endpoint,
          method: request.method,
          path,
          status,
          durationMs,
          tag,
        });
      } else {
        structuredLogger.info("api.request.finish", {
          requestId,
          endpoint,
          method: request.method,
          path,
          status,
          durationMs,
        });
      }

      try {
        response.headers.set("x-request-id", requestId);
      } catch {
        // Some response objects may have immutable headers.
      }

      return response;
    } catch (error) {
      const durationMs = Date.now() - startedAt;
      structuredLogger.error("api.request.unhandled_error", {
        requestId,
        endpoint,
        method: request.method,
        path,
        durationMs,
        tag: "INTERNAL",
        error: structuredLogger.errorDetails(error),
      });

      return NextResponse.json(
        { tag: "INTERNAL", message: "Internal server error", requestId },
        { status: 500 }
      );
    }
  };
}
