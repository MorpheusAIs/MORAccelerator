import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic import of the AnimatedHeader component to avoid server-side rendering issues
const AnimatedHeader = dynamic(
  () => import('../components/animation/AnimatedHeader'),
  { ssr: false }
);

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Morpheus Builder - Open Source Accelerator</title>
        <meta name="description" content="Stake MOR tokens to support builders in the Morpheus ecosystem" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative min-h-screen bg-dark-bg bg-grid-pattern">
        <div className="bg-gradient-glow" />
        
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section with Animated 3D Header */}
          <div className="text-center mb-16">
            <AnimatedHeader 
              title="Welcome to Morpheus Builder"
              subtitle="An open-source accelerator designed to empower Smart Agents within the MorpheusAI ecosystem."
              height={400}
              shapeColor="#00FF84"
            />
            <div className="flex justify-center gap-4 mt-8">
              <Link href="/builder-pools" className="px-8 py-3 bg-[#00FF84] text-gray-900 rounded-lg font-semibold hover-glow">
                Start Building
              </Link>
              <Link href="/stake" className="px-8 py-3 glassmorphism text-white rounded-lg font-semibold hover-glow">
                Stake MOR
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <motion.div 
              className="relative glassmorphism p-6 rounded-xl hover-glow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-white mb-2">Project Creation</h3>
              <p className="text-gray-300">Create and manage builder pools with customizable parameters</p>
            </motion.div>

            <motion.div 
              className="relative glassmorphism p-6 rounded-xl hover-glow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-white mb-2">Staking & Deposits</h3>
              <p className="text-gray-300">Stake MOR tokens with flexible lock periods</p>
            </motion.div>

            <motion.div 
              className="relative glassmorphism p-6 rounded-xl hover-glow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-white mb-2">Rewards Distribution</h3>
              <p className="text-gray-300">Track and claim your rewards in real-time</p>
            </motion.div>

            <motion.div 
              className="relative glassmorphism p-6 rounded-xl hover-glow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-white mb-2">Cross-chain</h3>
              <p className="text-gray-300">Seamless operations across Arbitrum and Base</p>
            </motion.div>
          </div>

          {/* Why Stake Section */}
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Stake with Mor Builders?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="glassmorphism p-6 rounded-xl hover-glow">
                <h3 className="text-xl font-semibold text-[#00FF84] mb-4">Earn Competitive Rewards</h3>
                <p className="text-gray-300">Share of 100K MOR per month distributed among Builders</p>
              </div>
              <div className="glassmorphism p-6 rounded-xl hover-glow">
                <h3 className="text-xl font-semibold text-[#00FF84] mb-4">Support AI Innovation</h3>
                <p className="text-gray-300">Fund Smart Agents that push the boundaries of AI</p>
              </div>
              <div className="glassmorphism p-6 rounded-xl hover-glow">
                <h3 className="text-xl font-semibold text-[#00FF84] mb-4">Fair & Open Economy</h3>
                <p className="text-gray-300">Fully decentralized with transparent reward distribution</p>
              </div>
            </div>
          </motion.section>

          {/* Funding Section */}
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Funding & Operating Budget</h2>
            <div className="glassmorphism p-8 rounded-xl">
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-center">
                  <span className="text-[#00FF84] mr-2">🔹</span>
                  100K MOR rewards allocated per month
                </li>
                <li className="flex items-center">
                  <span className="text-[#00FF84] mr-2">🔹</span>
                  Rewards distributed evenly across Arbitrum & Base
                </li>
                <li className="flex items-center">
                  <span className="text-[#00FF84] mr-2">🔹</span>
                  Mentors receive fully liquid rewards
                </li>
                <li className="flex items-center">
                  <span className="text-[#00FF84] mr-2">🔹</span>
                  Maintainers stake 50% of their earnings
                </li>
              </ul>
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">Join the Movement</h2>
            <p className="text-xl text-gray-300 mb-8">
              Stake MOR today and be part of the next generation of AI innovation
            </p>
            <Link href="/register" className="px-8 py-3 bg-[#00FF84] text-gray-900 rounded-lg font-semibold hover-glow inline-block">
              Become a Builder
            </Link>
          </motion.section>
        </main>
      </div>
    </>
  );
};

export default Home;
