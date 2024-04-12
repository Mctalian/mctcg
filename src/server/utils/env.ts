import { join } from "node:path";
import * as dotenv from "dotenv";
import { logger } from "./logger.js";

export namespace env {
  export function load() {
    const __dirname = import.meta.dirname;
    const out = dotenv.config({ path: process.env.IS_PROD ? join(__dirname, '..', '.env.prod') : join(__dirname, '..', '.env') });
    if (out.parsed) {
      logger.info("Environment variables loaded successfully");
    } else {
      logger.error(`Environment variables failed to load: ${out.error}`);
      process.exit(1);
    }
  }
  
  export const isDev = !process.env.IS_PROD;
}

