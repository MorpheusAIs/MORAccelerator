import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-dark-onBg">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </motion.main>
      <Footer />
    </div>
  );
};

export default Layout; 