import express, { Application } from 'express';
import compression from 'compression';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from '#/trpc/routers';
import { renderPage } from 'vike/server';
import { rootPath } from './root.js';
import cookieParser from 'cookie-parser';
import { createOpenApiExpressMiddleware } from 'trpc-openapi';

const isProduction = process.env.NODE_ENV === 'production';

startServer();

async function startServer() {
  const app = express();

  app.use(compression());
  app.use(cookieParser());

  // ...
  // Vite integration
  // ...
  if (isProduction) {
    // In production, we need to serve our static assets ourselves.
    // (In dev, Vite's middleware serves our static assets.)
    const sirv = (await import('sirv')).default;
    app.use(sirv(`${rootPath}/dist/client`));
  } else {
    // We instantiate Vite's development server and integrate its middleware to our server.
    // ⚠️ We instantiate it only in development. (It isn't needed in production and it
    // would unnecessarily bloat our production server.)
    const vite = await import('vite');
    const viteDevMiddleware = (
      await vite.createServer({
        rootPath,
        server: {
          middlewareMode: true,
        },
      })
    ).middlewares;
    app.use(viteDevMiddleware);
  }

  // ...
  // Other middlewares (e.g. some RPC middleware such as Telefunc)
  // ...
  middleware(app);

  /**
   * Vike route
   *
   * @link {@see https://vike.dev}
   **/
  vike(app);

  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

function middleware(app: Application) {
  app.use(
    '/api/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext({ req, res }: trpcExpress.CreateExpressContextOptions) {
        return { req, res };
      },
    }),
  );

  app.use('/api', createOpenApiExpressMiddleware({ router: appRouter }));

  app.use('/ping', async (req, res) => {
    res.status(200).type('application/json');
    res.send({
      ok: 'pong',
    });
  });
}

function vike(app: Application) {
  app.all('*', async (req, res, next) => {
    const pageContextInit = { urlOriginal: req.originalUrl };
    const pageContext = await renderPage(pageContextInit);
    if (pageContext.httpResponse === null) return next();

    const { statusCode, contentType } = pageContext.httpResponse;
    res.status(statusCode).type(contentType);
    pageContext.httpResponse.pipe(res);
  });
}
