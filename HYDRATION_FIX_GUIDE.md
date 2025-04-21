# Fixing Hydration Errors in MOR Accelerator

This guide contains information on how we fixed the hydration errors in the MOR Accelerator project.

## What are Hydration Errors?

Hydration errors occur in Next.js when the HTML content served by the server doesn't match what React tries to render on the client side. This is a common issue with Next.js applications, especially when using:

1. Random values or dates
2. User-specific data
3. Browser-only APIs
4. Dynamic content that depends on client state

The error message typically looks like this:

```
Error: Hydration failed because the initial UI does not match what was rendered on the server.

Warning: Expected server HTML to contain a matching <div> in <div>.

See more info here: https://nextjs.org/docs/messages/react-hydration-error
```

## Root Causes in MOR Accelerator

We identified several root causes for hydration errors in our application:

### 1. Duplicate Routes

Pages like `pages/rewards.tsx` and `pages/rewards/index.tsx` were both resolving to the same `/rewards` route, causing conflicts.

**Solution:** We removed the duplicate page (`pages/rewards/index.tsx`).

### 2. Client-Side Only Components

Components using browser-only APIs (like Web3 libraries, window object, localStorage, etc.) were rendering differently on server vs. client.

**Solution:** We created a `ClientOnly` component that only renders its children on the client side:

```tsx
// components/common/ClientOnly.tsx
import { useEffect, useState } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <>{children}</> : <>{fallback}</>;
}
```

### 3. Conditional Rendering Based on Client State

Components that conditionally rendered different content based on client state (like wallet connection status) were causing mismatches.

**Solution:** We added additional checks to ensure components only render when client-side state is ready:

```tsx
// Only load data client-side
const [isClient, setIsClient] = useState(false);

useEffect(() => {
    setIsClient(true);
}, []);

// In the JSX
{isClient && (
    // Content that depends on client-side state
)}
```

### 4. Improved Wallet Connect Component

The default wallet connect component was causing styling inconsistencies between server and client.

**Solution:** We created a custom `ImprovedConnectWallet` component that provides a more consistent UI between server and client:

```tsx
// components/ConnectWallet/ImprovedConnectWallet.tsx
import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

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
            {/* Custom wallet connect UI */}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
```

## Consistent Pattern for Fixing Hydration Issues

We followed this consistent pattern to fix hydration issues across the application:

1. Wrap dynamic components with `ClientOnly`
2. Add an `isClient` state variable initialized to `false`
3. Set `isClient` to `true` in a `useEffect` hook
4. Use conditional rendering with `isClient && (...)` for client-dependent content
5. Provide appropriate fallback UI for server-side rendering
6. Use the improved wallet connect component for consistent UI

## Pages Fixed

We've applied these fixes to the following pages:

- `/pages/rewards.tsx`
- `/pages/builder-pools/index.tsx`
- `/pages/stake.tsx`
- `/pages/register.tsx`

## Additional Improvements

1. **Mockup Data for Development**: We've added safe fallback mock data for development when contract calls are not available.

2. **Simplified Component Structure**: We've simplified component nesting to reduce the chance of hydration mismatches.

3. **Consistent Type Checking**: We've improved TypeScript types across the application to catch potential issues earlier.

## Resources

For more information on hydration errors and their solutions, refer to:

- [Next.js Documentation on Hydration](https://nextjs.org/docs/messages/react-hydration-error)
- [React Documentation on Server Components](https://reactjs.org/docs/react-api.html#reactdomserver)
- [Vercel Guide to Client-Side Only Components](https://vercel.com/guides/how-to-implement-client-only-components-in-next-js)
