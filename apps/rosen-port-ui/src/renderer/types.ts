import { ConnectorAPI } from '#/tools/wallet/types';
import { EipWalletApi } from '@rosen-ui/wallet-api';

export type { PageProps };

// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      Page: Page;
      pageProps?: PageProps;
      urlPathname: string;
      exports: {
        documentProps?: {
          title?: string;
          description?: string;
        };
      };
    }
  }
}

declare global {
  let cardano: { [key: string]: ConnectorAPI };
}

declare global {
  let ergoConnector: {
    [key: string]: {
      connect: (params: { createErgoObject: boolean }) => Promise<boolean>;
      getContext: () => Promise<EipWalletApi>;
    };
  };
}

type Page = (pageProps: PageProps) => React.ReactElement;
type PageProps = Record<string, unknown>;
