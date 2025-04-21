import React from 'react';
import GeometricShapes from './GeometricShapes';
import { motion } from 'framer-motion';
import styles from './GeometricShapes.module.css';
import ClientOnly from '../common/ClientOnly';

interface AnimatedHeaderProps {
  title: string;
  subtitle?: string;
  height?: number;
  width?: number;
  shapeColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  className?: string;
}

const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({
  title,
  subtitle,
  height = 450,
  width = 1200,
  shapeColor = '#00FF84',
  titleColor = 'white',
  subtitleColor = '#f0f0f0',
  className,
}) => {
  return (
    <ClientOnly>
      <div className={`relative ${className || ''}`} style={{ height, width: '100%', maxWidth: width, margin: '0 auto', overflow: 'visible' }}>
        {/* The 3D animation */}
        <div className="absolute inset-0 z-0" style={{ opacity: 0.9 }}>
          <GeometricShapes
            height={height}
            width={width}
            color={shapeColor}
            backgroundColor="transparent"
            autoRotate={true}
            rotation={true}
            wireframe={false}
            enableZoom={false}
            enablePan={false}
          />
        </div>
        
        {/* Overlay text content */}
        <div className={`${styles.absoluteCenter} text-center w-full z-10`}>
          <motion.h1 
            className="text-5xl font-bold mb-4"
            style={{ color: titleColor }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {title}
          </motion.h1>
          
          {subtitle && (
            <motion.p
              className="text-xl"
              style={{ color: subtitleColor }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
        
        {/* Gradient overlay to blend animation with background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-20 z-5"></div>
      </div>
    </ClientOnly>
  );
};

export default AnimatedHeader;
