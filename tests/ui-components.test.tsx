import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AnimatedStakingFlow from '../components/staking/AnimatedStakingFlow';
import RewardVisualizationDashboard from '../components/staking/RewardVisualizationDashboard';

// Mock theme for testing
const theme = createTheme();

// Mock functions
const mockOnStake = jest.fn();

describe('AnimatedStakingFlow Component', () => {
  beforeEach(() => {
    // Reset mock function calls before each test
    mockOnStake.mockReset();
  });

  test('renders initial step with amount input', () => {
    render(
      <ThemeProvider theme={theme}>
        <AnimatedStakingFlow onStake={mockOnStake} maxAmount="1000" />
      </ThemeProvider>
    );
    
    // Check if the component renders the first step
    expect(screen.getByText('Step 1: Enter Staking Amount')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount to Stake')).toBeInTheDocument();
    expect(screen.getByText('MAX')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  test('MAX button sets the maximum amount', () => {
    render(
      <ThemeProvider theme={theme}>
        <AnimatedStakingFlow onStake={mockOnStake} maxAmount="1000" />
      </ThemeProvider>
    );
    
    // Click the MAX button
    fireEvent.click(screen.getByText('MAX'));
    
    // Check if the input value is set to the maximum amount
    expect(screen.getByLabelText('Amount to Stake')).toHaveValue('1000');
  });

  test('Next button is disabled when amount is empty', () => {
    render(
      <ThemeProvider theme={theme}>
        <AnimatedStakingFlow onStake={mockOnStake} maxAmount="1000" />
      </ThemeProvider>
    );
    
    // Check if the Next button is disabled initially
    expect(screen.getByText('Next')).toBeDisabled();
    
    // Enter an amount
    fireEvent.change(screen.getByLabelText('Amount to Stake'), { target: { value: '500' } });
    
    // Check if the Next button is enabled
    expect(screen.getByText('Next')).not.toBeDisabled();
  });

  // Additional tests would be added for navigation between steps, duration selection, and form submission
});

describe('RewardVisualizationDashboard Component', () => {
  test('renders dashboard with summary cards', () => {
    render(
      <ThemeProvider theme={theme}>
        <RewardVisualizationDashboard />
      </ThemeProvider>
    );
    
    // Check if the component renders the dashboard title
    expect(screen.getByText('Reward Analytics Dashboard')).toBeInTheDocument();
    
    // Check if summary cards are rendered
    expect(screen.getByText('Staked Amount')).toBeInTheDocument();
    expect(screen.getByText('Pending Rewards')).toBeInTheDocument();
    expect(screen.getByText('Total Rewards Earned')).toBeInTheDocument();
    expect(screen.getByText('Lock Time Remaining')).toBeInTheDocument();
  });

  test('renders tabs for different charts', () => {
    render(
      <ThemeProvider theme={theme}>
        <RewardVisualizationDashboard />
      </ThemeProvider>
    );
    
    // Check if tabs are rendered
    expect(screen.getByText('Reward Growth')).toBeInTheDocument();
    expect(screen.getByText('Power Factor Impact')).toBeInTheDocument();
    expect(screen.getByText('Distribution')).toBeInTheDocument();
  });

  test('switching tabs changes the displayed chart', () => {
    render(
      <ThemeProvider theme={theme}>
        <RewardVisualizationDashboard />
      </ThemeProvider>
    );
    
    // Check if the first tab content is visible
    expect(screen.getByText('Reward Accrual Over Time')).toBeInTheDocument();
    
    // Click on the second tab
    fireEvent.click(screen.getByText('Power Factor Impact'));
    
    // Check if the second tab content is visible
    expect(screen.getByText('Power Factor Impact on Rewards')).toBeInTheDocument();
    
    // Click on the third tab
    fireEvent.click(screen.getByText('Distribution'));
    
    // Check if the third tab content is visible
    expect(screen.getByText('Reward Distribution')).toBeInTheDocument();
  });

  // Additional tests would be added for chart rendering and data visualization
});
