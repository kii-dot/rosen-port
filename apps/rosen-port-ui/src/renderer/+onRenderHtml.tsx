// https://vike.dev/onRenderHtml
export { onRenderHtml };

import fs from 'fs';
import ReactDOMServer from 'react-dom/server';
import { PageShell } from './PageShell';
import { escapeInject, dangerouslySkipEscape } from 'vike/server';
import logoUrl from '#/assets/logo.svg';
import type { OnRenderHtmlAsync } from 'vike/types';
import '#/assets/index.css';
import { WalletContainer } from '#/context/walletContext';
import { TokensMapProvider } from '#/context/tokenMapPovider';
import path from 'path';
import { rootPath } from '#/server/root';

const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  const { Page, pageProps } = pageContext;
  const tokensMap = JSON.parse(
    fs.readFileSync(path.resolve(rootPath + '/src/configs/tokensMap.json'), {
      encoding: 'utf-8',
    }),
  );

  // This onRenderHtml() hook only supports SSR, see https://vike.dev/render-modes for how to modify
  // onRenderHtml() to support SPA
  if (!Page) throw new Error('My render() hook expects pageContext.Page to be defined');
  const pageHtml = ReactDOMServer.renderToString(
    <TokensMapProvider tokensMap={tokensMap}>
      <WalletContainer.Provider>
        <PageShell pageContext={pageContext}>
          <Page {...pageProps} />
        </PageShell>
      </WalletContainer.Provider>
    </TokensMapProvider>,
  );

  // See https://vike.dev/head
  const { documentProps } = pageContext.exports;
  const title = (documentProps && documentProps.title) || 'Rosen Port';
  const desc = (documentProps && documentProps.description) || 'Bridging for grassroots';

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
      </head>
      <body>
        <div id="react-root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vike.dev/page-redirection
    },
  };
};
