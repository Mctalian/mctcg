import { join } from "node:path";
import next from "next";
import { logger, env } from "../utils/index.js";

const __dirname = import.meta.dirname;
export const app = next({ dev: env.isDev, dir: join(__dirname, "../../client") });
export const handle = app.getRequestHandler();