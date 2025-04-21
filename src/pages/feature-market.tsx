import { useState } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import CreateProposal from '../components/FeatureMarket/CreateProposal';
import ProposalList from '../components/FeatureMarket/ProposalList';

export default function FeatureMarket() {
  const [view, setView] = useState<'browse' | 'create'>('browse');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <Head>
        <title>Morpheus AI - Feature Sponsorship Market</title>
        <meta name="description" content="Sponsor or develop features in the Morpheus ecosystem" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Feature Sponsorship Market
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Sponsor new features with MOR tokens or bid on development opportunities
          </motion.p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setView('browse')}
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ${
              view === 'browse'
                ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Browse Proposals
          </button>
          <button
            onClick={() => setView('create')}
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ${
              view === 'create'
                ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Create Proposal
          </button>
        </div>

        <motion.div
          key={view}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {view === 'browse' ? <ProposalList /> : <CreateProposal />}
        </motion.div>
      </main>
    </div>
  );
}