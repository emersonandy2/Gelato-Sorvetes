type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private level: LogLevel;
  private context: LogContext;

  constructor(level: LogLevel = "info", context: LogContext = {}) {
    this.level = level;
    this.context = context;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };
    return levels[level] >= levels[this.level];
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const mergedContext = { ...this.context, ...context };
    const contextStr = Object.keys(mergedContext).length > 0
      ? ` ${JSON.stringify(mergedContext)}`
      : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog("debug")) {
      console.debug(this.formatMessage("debug", message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog("info")) {
      console.info(this.formatMessage("info", message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog("warn")) {
      console.warn(this.formatMessage("warn", message, context));
    }
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (this.shouldLog("error")) {
      const errorContext = error instanceof Error
        ? { error: error.message, stack: error.stack }
        : { error: String(error) };
      console.error(this.formatMessage("error", message, { ...errorContext, ...context }));
    }
  }

  child(context: LogContext): Logger {
    return new Logger(this.level, { ...this.context, ...context });
  }
}

export const logger = new Logger(
  (process.env.LOG_LEVEL as LogLevel) || "info"
);

export function createLogger(context: LogContext): Logger {
  return logger.child(context);
}

// Auth-specific loggers
export const authLogger = createLogger({ module: "auth" });
export const adminLogger = createLogger({ module: "admin" });
export const orderLogger = createLogger({ module: "order" });
export const apiLogger = createLogger({ module: "api" });
