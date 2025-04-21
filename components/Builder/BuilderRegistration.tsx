import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useContractService } from '../../hooks/useContractService';
import { useNetwork } from 'wagmi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface BuilderRegistrationFormData {
    name: string;
    initialStake: string;
    lockPeriod: number;
    rewardSplit: number;
}

const LOCK_PERIOD_OPTIONS = [
    { value: 31536000, label: '1 Year (2.11x Multiplier)' },
    { value: 0, label: 'No Lock (1x Multiplier)' }
];

const REWARD_SPLIT_OPTIONS = [
    { value: 70, label: '70% (Standard)' },
    { value: 80, label: '80% (Premium)' },
    { value: 90, label: '90% (Elite)' }
];

export const BuilderRegistration: React.FC = () => {
    const { chain } = useNetwork();
    const contractService = useContractService();

    const [formData, setFormData] = useState<BuilderRegistrationFormData>({
        name: '',
        initialStake: '',
        lockPeriod: LOCK_PERIOD_OPTIONS[0].value,
        rewardSplit: REWARD_SPLIT_OPTIONS[0].value
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: BuilderRegistrationFormData) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chain?.id || !contractService) return;

        try {
            setIsLoading(true);
            const initialStakeWei = ethers.utils.parseEther(formData.initialStake);
            
            const tx = await contractService.createBuilderPool(
                chain.id,
                formData.name,
                initialStakeWei,
                formData.lockPeriod,
                formData.rewardSplit
            );

            toast.info('Your builder pool is being created...', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            await tx.wait();

            toast.success('Your builder pool has been created!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            // Reset form
            setFormData({
                name: '',
                initialStake: '',
                lockPeriod: LOCK_PERIOD_OPTIONS[0].value,
                rewardSplit: REWARD_SPLIT_OPTIONS[0].value
            });
        } catch (error: any) {
            toast.error(error.message || 'Failed to create builder pool', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Create Builder Pool</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pool Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter pool name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Initial Stake (MOR)
                    </label>
                    <input
                        type="number"
                        name="initialStake"
                        value={formData.initialStake}
                        onChange={handleInputChange}
                        required
                        min="100"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Minimum 100 MOR"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lock Period
                    </label>
                    <select
                        name="lockPeriod"
                        value={formData.lockPeriod}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        {LOCK_PERIOD_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reward Split
                    </label>
                    <select
                        name="rewardSplit"
                        value={formData.rewardSplit}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        {REWARD_SPLIT_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {isLoading ? 'Creating Pool...' : 'Create Builder Pool'}
                </button>
            </form>
        </div>
    );
};