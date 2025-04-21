import React from 'react';
import { motion } from 'framer-motion';

export type SortOption = 'totalStaked' | 'rewardSplit' | 'lockPeriod' | 'participants';
export type FilterOption = 'all' | 'active' | 'inactive';

interface PoolFiltersProps {
  sortBy: SortOption;
  filterBy: FilterOption;
  onSortChange: (sort: SortOption) => void;
  onFilterChange: (filter: FilterOption) => void;
  minStake?: string;
  onMinStakeChange?: (value: string) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'totalStaked', label: 'Total Staked' },
  { value: 'rewardSplit', label: 'Reward Split' },
  { value: 'lockPeriod', label: 'Lock Period' },
  { value: 'participants', label: 'Participants' }
];

const filterOptions: { value: FilterOption; label: string }[] = [
  { value: 'all', label: 'All Pools' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

export const PoolFilters: React.FC<PoolFiltersProps> = ({
  sortBy,
  filterBy,
  onSortChange,
  onFilterChange,
  minStake,
  onMinStakeChange
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-4"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Sort Options */}
        <div className="flex-1">
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Sort By
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Options */}
        <div className="flex-1">
          <label htmlFor="filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter By
          </label>
          <select
            id="filter"
            value={filterBy}
            onChange={(e) => onFilterChange(e.target.value as FilterOption)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Min Stake Filter */}
        {onMinStakeChange && (
          <div className="flex-1">
            <label htmlFor="minStake" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Minimum Stake (MOR)
            </label>
            <input
              type="number"
              id="minStake"
              value={minStake}
              onChange={(e) => onMinStakeChange(e.target.value)}
              min="0"
              step="0.1"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Enter minimum stake"
            />
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      <div className="flex flex-wrap gap-2">
        {filterBy !== 'all' && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {filterOptions.find(f => f.value === filterBy)?.label}
            <button
              type="button"
              onClick={() => onFilterChange('all')}
              className="ml-2 inline-flex items-center p-0.5 rounded-full text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800"
            >
              <span className="sr-only">Remove filter</span>
              ×
            </button>
          </span>
        )}
        {minStake && Number(minStake) > 0 && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Min Stake: {minStake} MOR
            <button
              type="button"
              onClick={() => onMinStakeChange?.('0')}
              className="ml-2 inline-flex items-center p-0.5 rounded-full text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800"
            >
              <span className="sr-only">Remove filter</span>
              ×
            </button>
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default PoolFilters; 