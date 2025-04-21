import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NetworkSelector } from '../../../components/Builder';
import { useNetwork, useSwitchNetwork } from 'wagmi';

// Mock wagmi hooks
jest.mock('wagmi', () => ({
    useNetwork: jest.fn(),
    useSwitchNetwork: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        return <img {...props} />;
    },
}));

describe('NetworkSelector', () => {
    const mockOnNetworkChange = jest.fn();
    
    beforeEach(() => {
        // Setup default mock values
        (useNetwork as jest.Mock).mockReturnValue({
            chain: { id: 42161, name: 'Arbitrum One' }
        });
        
        (useSwitchNetwork as jest.Mock).mockReturnValue({
            switchNetwork: jest.fn(),
            isLoading: false,
            pendingChainId: undefined
        });
    });

    it('renders network selector', () => {
        render(<NetworkSelector onNetworkChange={mockOnNetworkChange} />);
        
        expect(screen.getByText('Select Network')).toBeInTheDocument();
        expect(screen.getByText('Arbitrum One')).toBeInTheDocument();
        expect(screen.getByText('Base')).toBeInTheDocument();
    });

    it('shows current network', () => {
        render(<NetworkSelector onNetworkChange={mockOnNetworkChange} />);
        
        expect(screen.getByText('Current Network: Arbitrum One')).toBeInTheDocument();
    });

    it('handles network switching', async () => {
        const mockSwitchNetwork = jest.fn();
        (useSwitchNetwork as jest.Mock).mockReturnValue({
            switchNetwork: mockSwitchNetwork,
            isLoading: false,
            pendingChainId: undefined
        });

        render(<NetworkSelector onNetworkChange={mockOnNetworkChange} />);

        // Click Base network option
        fireEvent.click(screen.getByText('Base'));

        await waitFor(() => {
            expect(mockSwitchNetwork).toHaveBeenCalledWith(8453); // Base chainId
        });
    });

    it('displays loading state during network switch', () => {
        (useSwitchNetwork as jest.Mock).mockReturnValue({
            switchNetwork: jest.fn(),
            isLoading: true,
            pendingChainId: 8453
        });

        render(<NetworkSelector onNetworkChange={mockOnNetworkChange} />);
        
        expect(screen.getByText('Switching networks...')).toBeInTheDocument();
    });

    it('handles network switch errors', async () => {
        const mockSwitchNetwork = jest.fn().mockRejectedValue(new Error('Switch failed'));
        (useSwitchNetwork as jest.Mock).mockReturnValue({
            switchNetwork: mockSwitchNetwork,
            isLoading: false,
            pendingChainId: undefined
        });

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        render(<NetworkSelector onNetworkChange={mockOnNetworkChange} />);

        fireEvent.click(screen.getByText('Base'));

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Error switching network:', expect.any(Error));
        });

        consoleSpy.mockRestore();
    });

    it('displays network icons', () => {
        render(<NetworkSelector onNetworkChange={mockOnNetworkChange} />);
        
        const arbitrumIcon = screen.getByAltText('Arbitrum One');
        const baseIcon = screen.getByAltText('Base');
        
        expect(arbitrumIcon).toBeInTheDocument();
        expect(baseIcon).toBeInTheDocument();
    });

    it('shows active network indicator', () => {
        render(<NetworkSelector onNetworkChange={mockOnNetworkChange} />);
        
        const activeNetwork = screen.getByText('Arbitrum One').closest('button');
        expect(activeNetwork).toHaveClass('bg-blue-50');
    });
});