import { render, screen } from '@testing-library/react';
import { RewardsTracker } from '../../../components/Builder';
import { useNetwork, useAccount, useContractRead } from 'wagmi';
import { ethers } from 'ethers';

// Mock wagmi hooks
jest.mock('wagmi', () => ({
    useNetwork: jest.fn(),
    useAccount: jest.fn(),
    useContractRead: jest.fn(),
}));

// Mock react-chartjs-2
jest.mock('react-chartjs-2', () => ({
    Line: () => null
}));

describe('RewardsTracker', () => {
    const mockBuilderId = '0x123...456';
    
    beforeEach(() => {
        // Setup default mock values
        (useNetwork as jest.Mock).mockReturnValue({
            chain: { id: 42161, name: 'Arbitrum One' }
        });
        
        (useAccount as jest.Mock).mockReturnValue({
            address: '0x123...456'
        });
        
        (useContractRead as jest.Mock).mockImplementation((params) => {
            if (params.functionName === 'getPendingRewards') {
                return { data: ethers.utils.parseEther('100') };
            }
            if (params.functionName === 'getStakeInfo') {
                return {
                    data: {
                        amount: ethers.utils.parseEther('1000'),
                        virtualAmount: ethers.utils.parseEther('2110'),
                        lockStart: BigInt(Date.now()),
                        lockEnd: BigInt(Date.now() + 31536000000),
                        isLocked: true
                    }
                };
            }
            return { data: null };
        });
    });

    it('renders rewards tracker', () => {
        render(<RewardsTracker builderId={mockBuilderId} />);
        
        expect(screen.getByText('Rewards Tracker')).toBeInTheDocument();
        expect(screen.getByText('Pending Rewards')).toBeInTheDocument();
        expect(screen.getByText('Total Earned')).toBeInTheDocument();
        expect(screen.getByText('Projected APY')).toBeInTheDocument();
    });

    it('displays pending rewards', () => {
        render(<RewardsTracker builderId={mockBuilderId} />);
        
        expect(screen.getByText('100.0 MOR')).toBeInTheDocument();
    });

    it('displays staking information', () => {
        render(<RewardsTracker builderId={mockBuilderId} />);
        
        expect(screen.getByText('1000.0 MOR')).toBeInTheDocument();
        expect(screen.getByText('Locked')).toBeInTheDocument();
    });

    it('calculates and displays APY', () => {
        render(<RewardsTracker builderId={mockBuilderId} />);
        
        // Check if APY is displayed with percentage
        const apyElement = screen.getByText(/\d+\.\d+%/);
        expect(apyElement).toBeInTheDocument();
    });

    it('handles no rewards case', () => {
        (useContractRead as jest.Mock).mockImplementation((params) => {
            if (params.functionName === 'getPendingRewards') {
                return { data: ethers.utils.parseEther('0') };
            }
            return { data: null };
        });

        render(<RewardsTracker builderId={mockBuilderId} />);
        
        expect(screen.getByText('0 MOR')).toBeInTheDocument();
    });

    it('displays network information', () => {
        render(<RewardsTracker builderId={mockBuilderId} />);
        
        expect(screen.getByText('Network: Arbitrum One')).toBeInTheDocument();
        expect(screen.getByText('Connected Address: 0x123...456')).toBeInTheDocument();
    });
});