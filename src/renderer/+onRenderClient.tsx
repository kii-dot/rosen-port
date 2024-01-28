// https://vike.dev/onRenderClient
export { onRenderClient };

import { PageShell } from './PageShell';
import type { OnRenderClientAsync } from 'vike/types';
import { createRoot, hydrateRoot, type Root } from 'react-dom/client';
import { AuthContainer } from '#/context/authContext';

let root: Root;

// This onRenderClient() hook only supports SSR, see https://vike.dev/render-modes for how to modify onRenderClient()
// to support SPA
const onRenderClient: OnRenderClientAsync = async (pageContext): ReturnType<OnRenderClientAsync> => {
  const { Page, pageProps } = pageContext;
  if (!Page) throw new Error('Client-side render() hook expects pageContext.Page to be defined');
  const container = document.getElementById('react-root');
  if (!container) throw new Error('DOM element #react-root not found');

  const page = (
    <AuthContainer.Provider>
      <PageShell pageContext={pageContext}>
        <Page {...pageProps} />
      </PageShell>
    </AuthContainer.Provider>
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
