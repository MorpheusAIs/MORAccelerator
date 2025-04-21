import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Divider, CircularProgress } from '@mui/material';
import { useAccount, useChainId } from 'wagmi';
import { formatUnits } from 'viem';
import { useRewardDistribution } from '../../hooks/useRewardDistribution';
import { useState, useEffect } from 'react';

const RewardDistributionDashboard: React.FC = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { 
    rewardDistribution, 
    liquidityRules,
    calculateRewardAmounts,
    calculateMaintainerStakingRequirement
  } = useRewardDistribution();
  
  const [loading, setLoading] = useState(false);
  const [totalRewards, setTotalRewards] = useState<bigint>(BigInt(1000000000000000000000)); // Example 1000 MOR
  const [rewardAmounts, setRewardAmounts] = useState<{
    stakersAmount: bigint;
    maintainerAmount: bigint;
    mentorsAmount: bigint;
    operationsAmount: bigint;
  } | null>(null);

  // Simulate fetching total rewards
  useEffect(() => {
    const fetchTotalRewards = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would fetch from the contract
        // For testing, we're using a fixed amount
        const mockTotalRewards = BigInt(1000000000000000000000); // 1000 MOR
        setTotalRewards(mockTotalRewards);
        
        // Calculate distribution
        const amounts = calculateRewardAmounts(mockTotalRewards);
        setRewardAmounts(amounts);
      } catch (error) {
        console.error('Error fetching reward data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalRewards();
  }, [calculateRewardAmounts]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Format values for display
  const formattedTotalRewards = formatUnits(totalRewards, 18);
  
  const formattedStakersAmount = rewardAmounts ? formatUnits(rewardAmounts.stakersAmount, 18) : '0';
  const formattedMaintainerAmount = rewardAmounts ? formatUnits(rewardAmounts.maintainerAmount, 18) : '0';
  const formattedMentorsAmount = rewardAmounts ? formatUnits(rewardAmounts.mentorsAmount, 18) : '0';
  const formattedOperationsAmount = rewardAmounts ? formatUnits(rewardAmounts.operationsAmount, 18) : '0';
  
  // Calculate maintainer staking requirement
  const maintainerTotalRewards = rewardAmounts ? rewardAmounts.maintainerAmount : BigInt(0);
  const requiredStaking = calculateMaintainerStakingRequirement(true, maintainerTotalRewards);
  const formattedRequiredStaking = formatUnits(requiredStaking, 18);
  const formattedLiquidAmount = formatUnits(maintainerTotalRewards - requiredStaking, 18);

  return (
    <Box sx={{ mb: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Reward Distribution Dashboard
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" gutterBottom>
              Total Rewards: <strong>{formattedTotalRewards} MOR</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rewards are distributed according to the following percentages:
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            {/* Stakers */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Stakers: {rewardDistribution.STAKERS}%
                  </Typography>
                  <Typography variant="h5" gutterBottom>
                    {formattedStakersAmount} MOR
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Distributed to all participants who stake MOR tokens based on their staking amount and power factor.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Maintainer */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Maintainer: {rewardDistribution.MAINTAINER}%
                  </Typography>
                  <Typography variant="h5" gutterBottom>
                    {formattedMaintainerAmount} MOR
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Must Stake ({liquidityRules.MAINTAINER.STAKED}%):
                      </Typography>
                      <Typography variant="body1">
                        {formattedRequiredStaking} MOR
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Liquid ({liquidityRules.MAINTAINER.LIQUID}%):
                      </Typography>
                      <Typography variant="body1">
                        {formattedLiquidAmount} MOR
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Mentors */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Mentors: {rewardDistribution.MENTORS}%
                  </Typography>
                  <Typography variant="h5" gutterBottom>
                    {formattedMentorsAmount} MOR
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {liquidityRules.MENTORS.LIQUID}% liquid for direct distribution to mentors who provide guidance and expertise.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Operations */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Operations: {rewardDistribution.OPERATIONS}%
                  </Typography>
                  <Typography variant="h5" gutterBottom>
                    {formattedOperationsAmount} MOR
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manages budget for expenses such as compute, software development, and travel through a multisig wallet.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Note: Rewards depend on meeting the minimum staking threshold. The Time & Dilution-Based Power Factor increases proportional stake weight in emissions distribution.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RewardDistributionDashboard;
