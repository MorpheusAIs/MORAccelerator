import React from 'react';
import { Box, Typography, Container, Grid, Button, Card, CardContent } from '@mui/material';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { STAKING_NETWORKS } from '../contracts/config/stakingConfig';
import { useMORToken } from '../hooks/useMORToken';
import AnimatedStakingFlow from '../components/staking/AnimatedStakingFlow';
import RewardVisualizationDashboard from '../components/staking/RewardVisualizationDashboard';
import StakingPowerFactorDisplay from '../components/staking/StakingPowerFactorDisplay';

const EnhancedStakingPage: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { formattedBalance } = useMORToken();
  
  // Default pool ID - in a real implementation, this would be fetched or selected by the user
  const poolId = '0x1234567890123456789012345678901234567890123456789012345678901234' as `0x${string}`;
  
  // Check if current network is supported
  const isNetworkSupported = chain && 
    (chain.id === STAKING_NETWORKS.ARBITRUM.chainId || chain.id === STAKING_NETWORKS.BASE.chainId);
  
  // Handle staking submission
  const handleStake = (amount: string, duration: number) => {
    console.log(`Staking ${amount} MOR for ${duration} seconds`);
    // In a real implementation, this would call the staking contract
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Enhanced MOR Token Staking
        </Typography>
        
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Experience our new animated staking interface with enhanced reward visualization.
          Stake your MOR tokens to earn rewards with time-based power factor boosts.
        </Typography>
        
        {!isConnected && (
          <Box sx={{ my: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Connect your wallet to start staking
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              You need to connect your wallet to stake MOR tokens and view your staking information.
            </Typography>
          </Box>
        )}
        
        {isConnected && !isNetworkSupported && (
          <Box sx={{ my: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Switch to a supported network
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              MOR staking is available on Arbitrum and Base networks.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => switchNetwork?.(STAKING_NETWORKS.ARBITRUM.chainId)}
                sx={{ mr: 2 }}
              >
                Switch to Arbitrum
              </Button>
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={() => switchNetwork?.(STAKING_NETWORKS.BASE.chainId)}
              >
                Switch to Base
              </Button>
            </Box>
          </Box>
        )}
        
        {isConnected && isNetworkSupported && (
          <>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card sx={{ mb: 4 }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Animated Staking Flow
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Experience our new step-by-step staking process with visual feedback.
                    </Typography>
                  </CardContent>
                </Card>
                <AnimatedStakingFlow 
                  onStake={handleStake}
                  maxAmount={formattedBalance || '0'}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <StakingPowerFactorDisplay poolId={poolId} />
                <RewardVisualizationDashboard />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                About the Enhanced UI
              </Typography>
              <Typography variant="body2" paragraph>
                We've enhanced our staking interface with animated visualizations to make the staking process more engaging and intuitive.
                The new interface includes:
              </Typography>
              <ul>
                <li>
                  <Typography variant="body2" paragraph>
                    <strong>Animated Staking Flow</strong> - A step-by-step process with visual feedback for token locking and power factor increases.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" paragraph>
                    <strong>Reward Visualization Dashboard</strong> - Interactive charts showing reward accrual, power factor impact, and distribution.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" paragraph>
                    <strong>Power Factor Display</strong> - Visual representation of how your staking duration affects your rewards.
                  </Typography>
                </li>
              </ul>
              <Typography variant="body2">
                These enhancements are designed to provide a more engaging and informative staking experience while maintaining all the functionality of our original interface.
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default EnhancedStakingPage;
