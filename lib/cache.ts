// Simple in-memory cache implementation
const cache = new Map<string, { data: any; expiry: number }>();

export const cacheMiddleware = async (key: string, getData: () => Promise<any>, expireTime = 300) => {
  try {
    const now = Date.now();
    const cached = cache.get(key);

    // Return cached data if it exists and hasn't expired
    if (cached && cached.expiry > now) {
      return cached.data;
    }

    // If not in cache or expired, fetch new data
    const newData = await getData();
    
    // Store in cache with expiry
    cache.set(key, {
      data: newData,
      expiry: now + (expireTime * 1000) // Convert seconds to milliseconds
    });
    
    return newData;
  } catch (error) {
    console.error('Cache error:', error);
    // If cache fails, just get the data directly
    return await getData();
  }
};

export const invalidateCache = async (key: string) => {
  try {
    cache.delete(key);
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
};

// Optional: Clean up expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (value.expiry <= now) {
      cache.delete(key);
    }
  }
}, 60000); // Clean up every minute