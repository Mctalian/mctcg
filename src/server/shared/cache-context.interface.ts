import { ExtendableContext } from "koa";
import { RedisClientType } from "redis";
import { SetsCache } from "../app/sets/sets-cache";
import { CardsCache } from "../app/cards/cards-cache";

export interface CacheContext extends ExtendableContext {
  redis: RedisClientType;
  setsCache: SetsCache;
  cardsCache: CardsCache;
}