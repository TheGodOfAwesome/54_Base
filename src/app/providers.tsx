"use client";

import { createConfig } from "@alchemy/aa-alchemy/config";
import { AlchemyAccountProvider } from "@alchemy/aa-alchemy/react";
import { createThirdwebClient } from "thirdweb";
import { ThirdwebProvider } from "thirdweb/react";
import { baseSepolia } from "thirdweb/chains";
import { arbitrumSepolia } from "@alchemy/aa-core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, Suspense } from "react";

export const Providers = (props: PropsWithChildren) => {
  const queryClient = new QueryClient();
  const config = createConfig({
    rpcUrl: "/api/rpc", // this will proxy requests through the app's backend via NextJS routing to hide the Alchemy API key
    chain: arbitrumSepolia,
  });
 
  const client = createThirdwebClient({ clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID });

  
  const thirdwebProps = { // make sure all required component's inputs/Props keys&types match
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    activeChain: baseSepolia
  }

  return (
    <Suspense>
      <QueryClientProvider client={queryClient}>
        <AlchemyAccountProvider config={config} queryClient={queryClient}>
          <ThirdwebProvider
            // clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
            // activeChain={baseSepolia}
            {...thirdwebProps}
          >
            {props.children}
          </ThirdwebProvider>
        </AlchemyAccountProvider>
      </QueryClientProvider>
    </Suspense>
  );
};