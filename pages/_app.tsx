import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from 'next-themes';
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { http } from "viem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig } from "wagmi";
import { arbitrum, base } from 'wagmi/chains';
import Layout from "../components/layout/Layout";
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Use a valid project ID for development
// In production, you should set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in .env.local
const PLACEHOLDER_PROJECT_ID = "3a8170812b534d0ff9d794f19a901d64";

const { connectors } = getDefaultWallets({
  appName: "Morpheus Builder",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || PLACEHOLDER_PROJECT_ID,
});

const config = createConfig({
  chains: [arbitrum, base],
  transports: {
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
  connectors
});

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  // Fix hydration errors by only mounting on client-side
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {mounted ? (
            <RainbowKitProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </RainbowKitProvider>
          ) : (
            // Simple placeholder during server-side rendering to prevent hydration errors
            <div style={{ visibility: 'hidden' }}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </div>
          )}
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
