import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StakingInterface } from '../../../components/Builder';
import { useNetwork, useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { ethers } from 'ethers';

// Mock wagmi hooks
jest.mock('wagmi', () => ({
    useNetwork: jest.fn(),
    useAccount: jest.fn(),
    useContractRead: jest.fn(),
    useContractWrite: jest.fn(),
    useWaitForTransaction: jest.fn(),
}));

describe('StakingInterface', () => {
    const mockBuilderId = '0x123...456';
    
    beforeEach(() => {
        // Setup default mock values
        (useNetwork as jest.Mock).mockReturnValue({
            chain: { id: 42161, name: 'Arbitrum One' }
        });
        
        (useAccount as jest.Mock).mockReturnValue({
            address: '0x123...456'
        });
        
        (useContractRead as jest.Mock).mockReturnValue({
            data: {
                amount: ethers.utils.parseEther('100'),
                virtualAmount: ethers.utils.parseEther('211'),
                lockStart: BigInt(Date.now()),
                lockEnd: BigInt(Date.now() + 31536000000),
                isLocked: true
            }
        });
        
        (useContractWrite as jest.Mock).mockReturnValue({
            write: jest.fn(),
            data: null
        });
        
        (useWaitForTransaction as jest.Mock).mockReturnValue({
            isLoading: false,
            isSuccess: false
        });
    });

    it('renders staking interface', () => {
        render(<StakingInterface builderId={mockBuilderId} />);
        
        expect(screen.getByText('Stake to Builder')).toBeInTheDocument();
        expect(screen.getByLabelText('Stake Amount (MOR)')).toBeInTheDocument();
        expect(screen.getByLabelText('Lock Period')).toBeInTheDocument();
    });

    it('handles staking action', async () => {
        const mockStake = jest.fn();
        (useContractWrite as jest.Mock).mockReturnValue({
            write: mockStake,
            data: { hash: '0x123' }
        });

        render(<StakingInterface builderId={mockBuilderId} />);

        fireEvent.change(screen.getByLabelText('Stake Amount (MOR)'), {
            target: { value: '100' }
        });

        fireEvent.click(screen.getByText('Stake MOR'));

        await waitFor(() => {
            expect(mockStake).toHaveBeenCalled();
        });
    });

    it('displays staking information', () => {
        const mockPoolInfo = {
            totalStaked: ethers.utils.parseEther('1000'),
            rewardSplit: 50,
            name: 'Test Pool'
        };

        (useContractRead as jest.Mock).mockImplementation((params) => {
            if (params.functionName === 'getPoolInfo') {
                return { data: mockPoolInfo };
            }
            return { data: null };
        });

        render(<StakingInterface builderId={mockBuilderId} />);

        expect(screen.getByText('1000.0 MOR')).toBeInTheDocument();
        expect(screen.getByText('50% to Stakers')).toBeInTheDocument();
    });

    it('handles unstaking action', async () => {
        const mockUnstake = jest.fn();
        (useContractWrite as jest.Mock).mockImplementation((params) => {
            if (params.functionName === 'unstake') {
                return { write: mockUnstake, data: null };
            }
            return { write: jest.fn(), data: null };
        });

        render(<StakingInterface builderId={mockBuilderId} />);

        // Find and click unstake button
        const unstakeButton = screen.getByText('Unstake');
        fireEvent.click(unstakeButton);

        await waitFor(() => {
            expect(mockUnstake).toHaveBeenCalled();
        });
    });

    it('handles reward claiming', async () => {
        const mockClaimRewards = jest.fn();
        (useContractWrite as jest.Mock).mockImplementation((params) => {
            if (params.functionName === 'claimRewards') {
                return { write: mockClaimRewards, data: null };
            }
            return { write: jest.fn(), data: null };
        });

        render(<StakingInterface builderId={mockBuilderId} />);

        // Find and click claim rewards button
        const claimButton = screen.getByText('Claim Rewards');
        fireEvent.click(claimButton);

        await waitFor(() => {
            expect(mockClaimRewards).toHaveBeenCalled();
        });
    });

    it('displays lock period information', () => {
        render(<StakingInterface builderId={mockBuilderId} />);

        expect(screen.getByText('1 Year (2.11x Multiplier)')).toBeInTheDocument();
        expect(screen.getByText('No Lock (1x Multiplier)')).toBeInTheDocument();
    });
});