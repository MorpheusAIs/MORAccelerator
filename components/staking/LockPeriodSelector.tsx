import React from 'react';
import { motion } from 'framer-motion';

interface LockPeriodOption {
    days: number;
    label: string;
    multiplier: number;
}

interface LockPeriodSelectorProps {
    selectedPeriod: number;
    onChange: (days: number) => void;
    disabled?: boolean;
}

const lockPeriodOptions: LockPeriodOption[] = [
    { days: 30, label: '1 Month', multiplier: 1.0 },
    { days: 90, label: '3 Months', multiplier: 1.2 },
    { days: 180, label: '6 Months', multiplier: 1.5 },
    { days: 365, label: '1 Year', multiplier: 2.0 }
];

export const LockPeriodSelector: React.FC<LockPeriodSelectorProps> = ({
    selectedPeriod,
    onChange,
    disabled = false
}) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Select Lock Period
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Longer lock periods earn higher rewards
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {lockPeriodOptions.map((option, index) => {
                    const isSelected = selectedPeriod === option.days;
                    
                    return (
                        <motion.button
                            key={option.days}
                            onClick={() => !disabled && onChange(option.days)}
                            disabled={disabled}
                            className={`
                                relative p-4 rounded-lg border-2 transition-all
                                ${isSelected 
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800'
                                }
                                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                            `}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="text-left">
                                <span className="block text-lg font-semibold text-gray-900 dark:text-white">
                                    {option.label}
                                </span>
                                <span className="block mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    {option.days} days
                                </span>
                                <span className="block mt-2 text-blue-600 dark:text-blue-400 font-medium">
                                    {option.multiplier}x Rewards
                                </span>
                            </div>

                            {isSelected && (
                                <motion.div
                                    className="absolute -top-2 -right-2 bg-blue-500 text-white p-1 rounded-full"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                >
                                    <svg 
                                        className="w-4 h-4" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M5 13l4 4L19 7" 
                                        />
                                    </svg>
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Note: Tokens will be locked for the entire duration. Early withdrawal is not possible.
            </p>
        </div>
    );
}; 