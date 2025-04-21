import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BuilderRegistration } from '../../../components/Builder';
import { useNetwork, useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';
import { ethers } from 'ethers';

// Mock wagmi hooks
jest.mock('wagmi', () => ({
    useNetwork: jest.fn(),
    useAccount: jest.fn(),
    useContractWrite: jest.fn(),
    useWaitForTransaction: jest.fn(),
}));

describe('BuilderRegistration', () => {
    const mockOnSuccess = jest.fn();
    
    beforeEach(() => {
        // Setup default mock values
        (useNetwork as jest.Mock).mockReturnValue({
            chain: { id: 42161, name: 'Arbitrum One' }
        });
        
        (useAccount as jest.Mock).mockReturnValue({
            address: '0x123...456'
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

    it('renders builder registration form', () => {
        render(<BuilderRegistration onSuccess={mockOnSuccess} />);
        
        expect(screen.getByText('Register as a Builder')).toBeInTheDocument();
        expect(screen.getByLabelText('Builder Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Initial Stake (MOR)')).toBeInTheDocument();
    });

    it('handles form submission', async () => {
        const mockWrite = jest.fn();
        (useContractWrite as jest.Mock).mockReturnValue({
            write: mockWrite,
            data: { hash: '0x123' }
        });

        render(<BuilderRegistration onSuccess={mockOnSuccess} />);

        // Fill form
        fireEvent.change(screen.getByLabelText('Builder Name'), {
            target: { value: 'Test Builder' }
        });
        
        fireEvent.change(screen.getByLabelText('Initial Stake (MOR)'), {
            target: { value: '100' }
        });

        // Submit form
        fireEvent.click(screen.getByText('Register Builder'));

        await waitFor(() => {
            expect(mockWrite).toHaveBeenCalled();
        });
    });

    it('displays error message when network is not supported', () => {
        (useNetwork as jest.Mock).mockReturnValue({
            chain: { id: 1, name: 'Ethereum' }
        });

        render(<BuilderRegistration onSuccess={mockOnSuccess} />);

        fireEvent.click(screen.getByText('Register Builder'));

        expect(screen.getByText('Please connect to a supported network')).toBeInTheDocument();
    });

    it('validates minimum stake amount', async () => {
        render(<BuilderRegistration onSuccess={mockOnSuccess} />);

        fireEvent.change(screen.getByLabelText('Initial Stake (MOR)'), {
            target: { value: '50' }  // Below minimum 100 MOR
        });

        fireEvent.click(screen.getByText('Register Builder'));

        expect(screen.getByText('Minimum stake: 100 MOR')).toBeInTheDocument();
    });

    it('handles successful registration', async () => {
        const mockWrite = jest.fn();
        (useContractWrite as jest.Mock).mockReturnValue({
            write: mockWrite,
            data: { hash: '0x123' }
        });

        (useWaitForTransaction as jest.Mock).mockReturnValue({
            isLoading: false,
            isSuccess: true
        });

        render(<BuilderRegistration onSuccess={mockOnSuccess} />);

        // Fill and submit form
        fireEvent.change(screen.getByLabelText('Builder Name'), {
            target: { value: 'Test Builder' }
        });
        
        fireEvent.change(screen.getByLabelText('Initial Stake (MOR)'), {
            target: { value: '100' }
        });

        fireEvent.click(screen.getByText('Register Builder'));

        await waitFor(() => {
            expect(mockOnSuccess).toHaveBeenCalledWith('0x123');
        });
    });
});