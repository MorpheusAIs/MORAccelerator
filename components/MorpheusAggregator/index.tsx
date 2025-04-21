import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useRouter } from 'next/router';

interface Repository {
  name: string;
  description: string;
  html_url: string;
  updated_at: string;
  stargazers_count: number;
}

interface MRC {
  id: string;
  title: string;
  status: string;
  lastUpdate: string;
}

interface NetworkStats {
  totalContributors: number;
  activeAgents: number;
  totalMORBurned: string;
  dailyTransactions: number;
}

const MorpheusAggregator: React.FC = () => {
  const router = useRouter();
  const { filter, sort } = router.query;

  // State management
  const [repos, setRepos] = useState<Repository[]>([]);
  const [mrcs, setMRCs] = useState<MRC[]>([]);
  const [networkStats, setNetworkStats] = useState<NetworkStats>({
    totalContributors: 0,
    activeAgents: 0,
    totalMORBurned: "0",
    dailyTransactions: 0
  });
  const [sortOption, setSortOption] = useState<string>((sort as string) || 'updated');
  const [filterOption, setFilterOption] = useState<string>((filter as string) || 'all');

  // Socket.IO setup for real-time updates
  useEffect(() => {
    const socket = io();

    socket.on('network-stats-update', (stats) => {
      setNetworkStats(stats);
    });

    socket.on('mrc-update', (mrc) => {
      setMRCs(prev => [...prev, mrc]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Data fetching
  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await axios.get('https://api.github.com/orgs/MorpheusAIs/repos');
        setRepos(response.data);
      } catch (error) {
        console.error('Error fetching repos:', error);
      }
    };

    const fetchMRCs = async () => {
      try {
        const response = await axios.get('/api/mrcs');
        setMRCs(response.data);
      } catch (error) {
        console.error('Error fetching MRCs:', error);
      }
    };

    const fetchNetworkStats = async () => {
      try {
        const response = await axios.get('/api/network-stats');
        setNetworkStats(response.data);
      } catch (error) {
        console.error('Error fetching network stats:', error);
      }
    };

    fetchRepos();
    fetchMRCs();
    fetchNetworkStats();
  }, []);

  // Update URL when filter/sort changes
  useEffect(() => {
    router.push({
      pathname: router.pathname,
      query: { filter: filterOption, sort: sortOption },
    }, undefined, { shallow: true });
  }, [filterOption, sortOption]);

  // Filter and sort repositories
  const filteredRepos = useMemo(() => {
    let filtered = [...repos];
    
    // Apply filters
    if (filterOption === 'smart-contracts') {
      filtered = filtered.filter(repo => repo.name.toLowerCase().includes('contract'));
    } else if (filterOption === 'agents') {
      filtered = filtered.filter(repo => repo.name.toLowerCase().includes('agent'));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortOption === 'stars') {
        return (b.stargazers_count || 0) - (a.stargazers_count || 0);
      } else if (sortOption === 'updated') {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
      return 0;
    });

    return filtered;
  }, [repos, filterOption, sortOption]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-white">Morpheus Development Hub</h1>
      
      {/* Repository Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <select
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            className="rounded-lg border border-[#00FF84] px-4 py-2 bg-black text-white focus:ring-2 focus:ring-[#00FF84] focus:border-transparent"
          >
            <option value="all">All Repositories</option>
            <option value="smart-contracts">Smart Contracts</option>
            <option value="agents">Agents</option>
          </select>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="rounded-lg border border-[#00FF84] px-4 py-2 bg-black text-white focus:ring-2 focus:ring-[#00FF84] focus:border-transparent"
          >
            <option value="updated">Recently Updated</option>
            <option value="stars">Most Stars</option>
          </select>
        </div>
      </div>

      {/* Latest GitHub Activities */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-white">Latest Repository Updates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRepos.map((repo) => (
            <div key={repo.name} className="relative overflow-hidden">
              {/* Grid background overlay */}
              <div className="absolute inset-0 bg-[#0C0C0C] bg-opacity-90 rounded-xl">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'linear-gradient(rgba(0, 255, 132, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 132, 0.1) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}></div>
              </div>
              
              {/* Content */}
              <div className="relative p-6 border border-[#00FF84] rounded-xl shadow-neon">
                <h3 className="font-bold text-white mb-2">{repo.name}</h3>
                <p className="text-gray-300 mb-4">{repo.description}</p>
                <p className="text-sm text-[#00FF84] mb-4">
                  Last updated: {new Date(repo.updated_at).toLocaleDateString()}
                </p>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-2 px-4 bg-black border border-[#00FF84] text-[#00FF84] rounded-lg hover:bg-[#00FF84] hover:text-black transition-all duration-300"
                >
                  View Repository →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MRC Updates */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-white">MRC Updates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mrcs.map((mrc) => (
            <div key={mrc.id} className="relative overflow-hidden">
              {/* Grid background overlay */}
              <div className="absolute inset-0 bg-[#0C0C0C] bg-opacity-90 rounded-xl">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'linear-gradient(rgba(0, 255, 132, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 132, 0.1) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}></div>
              </div>
              
              {/* Content */}
              <div className="relative p-6 border border-[#00FF84] rounded-xl shadow-neon">
                <h3 className="font-bold text-white mb-2">{mrc.title}</h3>
                <p className="text-[#00FF84] mb-2">Status: {mrc.status}</p>
                <p className="text-gray-300">
                  Last Update: {mrc.lastUpdate}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Network Statistics */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-white">Network Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'Total Contributors', value: networkStats.totalContributors },
            { title: 'Active Agents', value: networkStats.activeAgents },
            { title: 'Total MOR Burned', value: networkStats.totalMORBurned },
            { title: 'Daily Transactions', value: networkStats.dailyTransactions }
          ].map((stat, index) => (
            <div key={index} className="relative overflow-hidden">
              {/* Grid background overlay */}
              <div className="absolute inset-0 bg-[#0C0C0C] bg-opacity-90 rounded-xl">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'linear-gradient(rgba(0, 255, 132, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 132, 0.1) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}></div>
              </div>
              
              {/* Content */}
              <div className="relative p-6 border border-[#00FF84] rounded-xl shadow-neon text-center">
                <h3 className="font-bold text-white mb-2">{stat.title}</h3>
                <p className="text-2xl text-[#00FF84]">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-white">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'MorLord', url: 'https://morlord.com/' },
            { title: 'MorStats', url: 'https://morstats.info/' },
            { title: 'Ecosystem', url: 'https://mor.org/ecosystem' },
            { title: 'Venice AI', url: 'https://venice.ai/home' }
          ].map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden group"
            >
              {/* Grid background overlay */}
              <div className="absolute inset-0 bg-[#0C0C0C] bg-opacity-90 rounded-xl">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'linear-gradient(rgba(0, 255, 132, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 132, 0.1) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}></div>
              </div>
              
              {/* Content */}
              <div className="relative p-6 border border-[#00FF84] rounded-xl shadow-neon text-center text-white hover:bg-[#00FF84] hover:text-black transition-all duration-300">
                {link.title}
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MorpheusAggregator;