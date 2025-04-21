import React from 'react';
import dynamic from 'next/dynamic';
import ClientOnly from '../common/ClientOnly';

// Dynamic import with SSR disabled to prevent the RainbowKit provider error
const ImprovedConnectWalletComponent = dynamic(
  () => import('./ImprovedConnectWallet'),
  { ssr: false }
);

/**
 * This wrapper ensures the ConnectWallet button is only rendered client-side
 * to prevent "Transaction hooks must be used within RainbowKitProvider" errors
 */
const ConnectWalletWrapper: React.FC = () => {
  return (
    <ClientOnly>
      <ImprovedConnectWalletComponent />
    </ClientOnly>
  );
};

export default ConnectWalletWrapper;
