import { useEffect, useState, ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * ClientOnly component renders its children only on the client side,
 * preventing hydration errors when server and client render different content.
 * 
 * @param children Content to render on the client side
 * @param fallback Optional content to show during server-side rendering
 */
export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Render fallback (or nothing) on server, children on client
  return isClient ? <>{children}</> : <>{fallback}</>;
}
