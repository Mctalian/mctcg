import { createClient } from "redis";
import { logger } from "../logger.js";

export const redis = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: +(process.env.REDIS_PORT || 6379),
    reconnectStrategy,
  }
});

const maximumRetries = 10;
const maximumBackoff = 32 * 1000;

function reconnectStrategy(retries: number): number | Error {
  if (retries <= this.maximumRetries) {
    const randMilliseconds = Math.random() * 1000;
    const wait = Math.min(
      Math.pow(1.5, retries) * randMilliseconds,
      maximumBackoff,
    );
    logger.info(
      `Attempting reconnect #${retries + 1} after a ${Math.trunc(
        wait,
      )}ms wait...`,
    );
    return wait;
  } else {
    const error = `Maxium retries (${maximumRetries}) exceeded!`;
    logger.error(error);
    return new Error(error);
  }
}

redis.on("error", (err: Error | string) => {
  let errString: string;
  if (err instanceof Error) {
    errString = err.message;
  } else {
    errString = err;
  }
  if (errString.includes("Socket closed unexpectedly")) {
    logger.warning(`[REDIS] ${errString}`);
  } else {
    logger.error(`[REDIS] ${errString}`);
  }
});
redis.on("connect", () => logger.debug("[REDIS] Connected"));
redis.on("reconnecting", () =>
  logger.debug("[REDIS] Reconnecting..."),
);
redis.on("ready", () => logger.debug("[REDIS] Ready"));
redis.on("end", () => logger.debug("[REDIS] Connection closed"));


export async function redisConnect() {
  if (redis.isOpen) {
    return redis;
  }
  return redis.connect();
}

export async function redisDisconnect(ctxRedis = redis): Promise<void> {
  if (ctxRedis.isOpen) {
    await ctxRedis.disconnect();
  }
}
