import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';

/**
 * ImprovedConnectWallet component provides a cleaner UI for wallet connections
 * It handles different states: not connected, connecting, connected
 */
const ImprovedConnectWallet: React.FC = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="connect-wallet-button bg-gradient-to-r from-[#00DD73] to-[#00FF84] text-black font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-[#00FF84]/30 transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <span>Connect Wallet</span>
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="wrong-network-button bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Wrong Network</span>
                  </button>
                );
              }

              return (
                <div className="connected-wallet-container flex items-center space-x-3">
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="network-button flex items-center space-x-1 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white text-sm font-medium py-1.5 px-3 rounded-lg transition-all duration-200"
                  >
                    {chain.hasIcon && (
                      <div className="network-icon w-4 h-4 mr-1">
                        {chain.iconUrl && (
                          <Image
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            width={16}
                            height={16}
                            className="w-full h-full rounded-full"
                          />
                        )}
                      </div>
                    )}
                    <span>{chain.name}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="address-button flex items-center space-x-2 bg-gradient-to-r from-[#00DD73]/10 to-[#00FF84]/10 hover:from-[#00DD73]/20 hover:to-[#00FF84]/20 text-[#00FF84] border border-[#00FF84]/30 text-sm font-semibold py-1.5 px-3 rounded-lg transition-all duration-200"
                  >
                    <div className="wallet-balance text-sm mr-1 font-normal">
                      {account.displayBalance
                        ? account.displayBalance
                        : ''}
                    </div>
                    <span>{account.displayName}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ImprovedConnectWallet;
