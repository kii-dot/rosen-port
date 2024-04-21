import { router, publicProcedure } from '#/trpc/generic';

// Router Polymorphism Guide:
// https://dev.to/nicklucas/trpc-patterns-router-factories-and-polymorphism-30b0
interface EntityBase {
  id: number;
  name: string;
}

// We define a config type to set the factory up
interface CrudRouterConfig<T extends EntityBase> {
  // We provide some way to select an ORM repository
  routerName: string;
}

function createPingRouter<TEntity extends EntityBase>(config: CrudRouterConfig<TEntity>) {
  return router({
    ping: publicProcedure.query(async () => {
      return { reply: `pong: ${config.routerName} is working` };
    }),
  });
}
