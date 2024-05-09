import KoaRouter from 'koa-router';
import { ExtendableContext } from 'koa';
import { CacheContext } from '../../../shared/cache-context.interface.js';
import { CardSearchDto, CardSearchResponseDto } from '../../../shared/card-search-dto.interface.js';
import { CardFactory } from '../../../app/cards/card-factory.js';

export const cardsRouter = new KoaRouter({
  prefix: "/cards"
});

cardsRouter.post("/search", async (ctx: ExtendableContext, next) => {
  const dto = ctx.request.body as CardSearchDto;
  const cardsCache = (ctx as CacheContext).cardsCache;
  const setsCache = (ctx as CacheContext).setsCache;
  const cardFactory = new CardFactory(setsCache, cardsCache);
  const cards = await cardsCache.getCardsByQuery(dto, cardFactory);
  console.log(`Got cards by query... CACHE_ONLY?${dto.cachedResultsOnly}... LENGTH?${cards.length}`)
  ctx.status = 200;
  ctx.body = {
    cards,
    numberOfCards: cards.length,
    cachedResults: dto.cachedResultsOnly ?? true,
  } as CardSearchResponseDto;
  await next();
});
