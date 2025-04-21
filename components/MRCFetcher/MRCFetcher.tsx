import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface MRC {
  number: string;
  title: string;
  summary: string;
  status: 'in progress' | 'implemented' | 'closed' | 'pending';
  url: string;
}

export const updateMRCs = async () => {
  try {
    // Clear local storage cache
    localStorage.removeItem('cachedMRCs');
    localStorage.removeItem('cachedTimestamp');

    // Trigger a fresh fetch from the server
    const response = await axios.post('/api/fetchMRCs', { forceUpdate: true });
    return response.data;
  } catch (error) {
    console.error('Error updating MRCs:', error);
    throw error;
  }
};

const MRCFetcher: React.FC = () => {
  const [mrcs, setMrcs] = useState<MRC[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Most Recent');

  const categories = ['Most Recent', 'In Progress', 'Implemented', 'Closed', 'Pending'];

  const fetchMRCs = async (forceUpdate = false) => {
    setLoading(true);
    try {
      // Check localStorage for cached MRCs
      const cachedMRCs = localStorage.getItem('cachedMRCs');
      const cachedTimestamp = localStorage.getItem('cachedTimestamp');
      
      if (!forceUpdate && cachedMRCs && cachedTimestamp) {
        const parsedMRCs = JSON.parse(cachedMRCs);
        const timestamp = parseInt(cachedTimestamp);
        
        // Use cached data if it's less than 1 hour old
        if (Date.now() - timestamp < 3600000) {
          setMrcs(parsedMRCs);
          setLoading(false);
          return;
        }
      }

      const response = await axios.get('/api/fetchMRCs');
      const fetchedMRCs = response.data;
      
      setMrcs(fetchedMRCs);
      
      // Cache the fetched MRCs
      localStorage.setItem('cachedMRCs', JSON.stringify(fetchedMRCs));
      localStorage.setItem('cachedTimestamp', Date.now().toString());
      
    } catch (err) {
      setError('Failed to fetch MRCs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMRCs();
    // Including fetchMRCs in the dependency array would cause an infinite loop
    // since it's defined inside the component and would be recreated on each render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredMRCs = selectedCategory === 'Most Recent'
    ? mrcs
    : mrcs.filter(mrc => mrc.status.toLowerCase() === selectedCategory.toLowerCase());

  if (loading) return <div className="text-white">Loading MRCs...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-white mb-6">MRC Dashboard</h2>
      <div className="mb-6">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`mr-2 px-4 py-2 rounded ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMRCs.map((mrc) => (
          <div key={mrc.number} className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-white mb-2">
              {mrc.title}
            </h3>
            <p className="text-gray-300 mb-4">
              {mrc.summary.split(' ').slice(0, 50).join(' ')}
              {mrc.summary.split(' ').length > 50 ? '...' : ''}
            </p>
            <div className="flex justify-between items-center">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                mrc.status === 'in progress' ? 'bg-yellow-500 text-yellow-900' :
                mrc.status === 'implemented' ? 'bg-green-500 text-green-900' :
                mrc.status === 'closed' ? 'bg-red-500 text-red-900' :
                'bg-blue-500 text-blue-900'
              }`}>
                {mrc.status.charAt(0).toUpperCase() + mrc.status.slice(1)}
              </span>
              <a href={mrc.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                View on GitHub
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MRCFetcher;