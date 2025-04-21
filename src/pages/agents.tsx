import { useState } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';

interface Agent {
  id: string;
  name: string;
  team: string[];
  website: string;
  documentation: string;
  socials: {
    twitter?: string;
    discord?: string;
  };
  description: string;
  audits?: string;
  token: {
    symbol: string;
    contract: string;
    circulatingSupply: number;
    maxSupply: number;
    stakingAmount: number;
  };
  stakingProgram: {
    duration: number;
    startDate: string;
    schedule: string;
  };
  image: string;
}

const sampleAgents: Agent[] = [
  {
    id: '1',
    name: 'Neural Navigator',
    team: ['Dr. Sarah Chen', 'Alex Rivera', 'Maria Thompson'],
    website: 'https://neuralnavigator.ai',
    documentation: 'https://github.com/neural-navigator',
    socials: {
      twitter: '@NeuralNavigator',
      discord: 'discord.gg/neuralnavigator',
    },
    description: 'An advanced AI agent specialized in deep learning optimization and neural architecture search, helping developers build more efficient AI models.',
    audits: 'Audited by SecureAI Labs - www.secureailabs.com',
    token: {
      symbol: 'NNV',
      contract: '0x123...abc',
      circulatingSupply: 10000000,
      maxSupply: 20000000,
      stakingAmount: 500000,
    },
    stakingProgram: {
      duration: 90,
      startDate: '2024-07-15',
      schedule: '5,556 NNV distributed daily to MOR stakers',
    },
    image: '/agents/neural-navigator.png',
  },
  {
    id: '2',
    name: 'Quantum Quill',
    team: ['James Watson', 'Lisa Chen', 'Mike O\'Brien'],
    website: 'https://quantumquill.io',
    documentation: 'https://docs.quantumquill.io',
    socials: {
      twitter: '@QuantumQuill',
      discord: 'discord.gg/quantumquill',
    },
    description: 'A sophisticated AI writing assistant that leverages quantum computing principles for enhanced natural language processing and generation.',
    audits: 'Audited by CryptoGuard - www.cryptoguard.io',
    token: {
      symbol: 'QQL',
      contract: '0x456...def',
      circulatingSupply: 15000000,
      maxSupply: 25000000,
      stakingAmount: 750000,
    },
    stakingProgram: {
      duration: 120,
      startDate: '2024-08-01',
      schedule: '6,250 QQL distributed daily to MOR stakers',
    },
    image: '/agents/quantum-quill.png',
  },
];

export default function AgentsMarketplace() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <Head>
        <title>Morpheus AI - Agent Marketplace</title>
        <meta name="description" content="Discover and stake in AI agents in the Morpheus ecosystem" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-white mb-12 backdrop-blur-sm py-4">
          Morpheus AI Agent Marketplace
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleAgents.map((agent) => (
            <motion.div
              key={agent.id}
              className="relative backdrop-blur-md bg-white/10 rounded-2xl p-6 shadow-neuromorphic hover:shadow-neuromorphic-hover transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedAgent(agent)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl" />
              <div className="relative">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 shadow-lg" />
                <h2 className="text-2xl font-bold text-white text-center mb-3">{agent.name}</h2>
                <p className="text-gray-200 mb-4">{agent.description}</p>
                
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Token:</span>
                    <span className="font-mono">{agent.token.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Staking Amount:</span>
                    <span>{agent.token.stakingAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{agent.stakingProgram.duration} days</span>
                  </div>
                </div>

                <button className="mt-6 w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg text-white font-semibold hover:from-purple-600 hover:to-violet-600 transition-colors duration-300 shadow-neuromorphic-sm">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedAgent && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-white">{selectedAgent.name}</h2>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6 text-gray-200">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Team</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAgent.team.map((member, index) => (
                      <span
                        key={index}
                        className="bg-white/10 px-3 py-1 rounded-full text-sm"
                      >
                        {member}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Token Details</h3>
                    <div className="space-y-2">
                      <p>Symbol: {selectedAgent.token.symbol}</p>
                      <p>Circulating Supply: {selectedAgent.token.circulatingSupply.toLocaleString()}</p>
                      <p>Max Supply: {selectedAgent.token.maxSupply.toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Staking Program</h3>
                    <div className="space-y-2">
                      <p>Duration: {selectedAgent.stakingProgram.duration} days</p>
                      <p>Start Date: {selectedAgent.stakingProgram.startDate}</p>
                      <p>Schedule: {selectedAgent.stakingProgram.schedule}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <a
                    href={selectedAgent.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg font-semibold hover:from-purple-600 hover:to-violet-600 transition-colors"
                  >
                    Visit Website
                  </a>
                  <a
                    href={selectedAgent.documentation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 bg-white/10 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                  >
                    View Documentation
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}

// Add these styles to your global CSS or tailwind.config.js
/* 
.shadow-neuromorphic {
  box-shadow: 
    20px 20px 60px #1a1b2e,
    -20px -20px 60px #24263f;
}

.shadow-neuromorphic-hover {
  box-shadow: 
    25px 25px 75px #1a1b2e,
    -25px -25px 75px #24263f;
}

.shadow-neuromorphic-sm {
  box-shadow: 
    10px 10px 30px #1a1b2e,
    -10px -10px 30px #24263f;
}
*/