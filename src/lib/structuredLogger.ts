type LogLevel = "info" | "warn" | "error";

type LogData = Record<string, unknown>;

const getErrorData = (error: unknown): Record<string, unknown> => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return { value: String(error) };
};

const writeLog = (level: LogLevel, event: string, data: LogData = {}) => {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...data,
  };

  const line = JSON.stringify(payload);
  if (level === "error") {
    console.error(line);
    return;
  }

  if (level === "warn") {
    console.warn(line);
    return;
  }

  console.log(line);
};

export const structuredLogger = {
  info: (event: string, data?: LogData) => writeLog("info", event, data),
  warn: (event: string, data?: LogData) => writeLog("warn", event, data),
  error: (event: string, data?: LogData) => writeLog("error", event, data),
  errorDetails: getErrorData,
};

