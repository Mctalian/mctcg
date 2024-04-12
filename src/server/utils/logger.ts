enum LogLevel {
  silly = 0x0,
  debug = 0x1,
  info = 0x2,
  warn = 0x4,
  error = 0x8,
  fatal = 0x10,
};

const logLevelMap = new Map<string, LogLevel>([
  ['fatal', LogLevel.fatal],
  ['error', LogLevel.error],
  ['warn', LogLevel.warn],
  ['info', LogLevel.info],
  ['debug', LogLevel.debug],
  ['silly', LogLevel.silly],
]);

const LOG_LEVEL = logLevelMap.get(process.env.LOG_LEVEL || 'info') || LogLevel.info;

export const logger = {
  silly: (message: string) => {
    if (LOG_LEVEL <= LogLevel.silly) {
      console.debug(`[SILLY] ${message}`);
    }
  },
  debug: (message: string) => {
    if (LOG_LEVEL <= LogLevel.debug) {
      console.debug(`[DEBUG] ${message}`);
    }
  },
  info: (message: string) => {
    if (LOG_LEVEL <= LogLevel.info) {
      console.log(`[INFO] ${message}`);
    }
  },
  warn: (message: string) => {
    logger.warning(message);
  },
  warning: (message: string) => {
    if (LOG_LEVEL <= LogLevel.warn) {
      console.warn(`[WARNING] ${message}`);
    }
  },
  error: (message: string) => {
    if (LOG_LEVEL <= LogLevel.error) {
      console.error(`[ERROR] ${message}`);
    }
  },
  fatal: (message: string) => {
    console.error(`[FATAL] ${message}`);
  },
}