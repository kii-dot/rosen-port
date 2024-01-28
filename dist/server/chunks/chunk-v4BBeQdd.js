import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
function getBaseUrl() {
  if (typeof window !== "undefined")
    return "";
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL}`;
  if (process.env.RENDER_INTERNAL_HOSTNAME)
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  return `http://localhost:${process.env.PORT ?? 3e3}`;
}
const trpc = createTRPCProxyClient({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`
    })
  ],
  /**
   * @link https://trpc.io/docs/data-transformers
   */
  transformer: superjson
});
export {
  trpc as t
};
