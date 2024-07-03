// https://vike.dev/onRenderClient
export { onRenderClient };

import { PageShell } from './PageShell';
import type { OnRenderClientAsync } from 'vike/types';
import { createRoot, hydrateRoot, type Root } from 'react-dom/client';
import { WalletContainer } from '#/context/walletContext';
import { TokensMapProvider } from '#/context/tokenMapPovider';
import fs from 'vite-plugin-fs/browser';

let root: Root;

// This onRenderClient() hook only supports SSR, see https://vike.dev/render-modes for how to modify onRenderClient()
// to support SPA
const onRenderClient: OnRenderClientAsync = async (pageContext): ReturnType<OnRenderClientAsync> => {
  const { Page, pageProps } = pageContext;
  if (!Page) throw new Error('Client-side render() hook expects pageContext.Page to be defined');
  const container = document.getElementById('react-root');
  if (!container) throw new Error('DOM element #react-root not found');

  const tokensMap = JSON.parse(await fs.readFile('/src/configs/tokensMap.json'));

  const page = (
    <TokensMapProvider tokensMap={tokensMap}>
      <WalletContainer.Provider>
        <PageShell pageContext={pageContext}>
          <Page {...pageProps} />
        </PageShell>
      </WalletContainer.Provider>
    </TokensMapProvider>
  );
  if (pageContext.isHydration) {
    root = hydrateRoot(container, page);
  } else {
    if (!root) {
      root = createRoot(container);
    }
    root.render(page);
  }
};
