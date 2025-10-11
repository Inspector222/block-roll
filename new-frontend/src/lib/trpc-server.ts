import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../../api/src/routers/_app";

/**
 * Server-side tRPC client for use in NextAuth callbacks and server components
 */
export const serverTrpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/trpc`,
      headers() {
        return {};
      },
    }),
  ],
});
