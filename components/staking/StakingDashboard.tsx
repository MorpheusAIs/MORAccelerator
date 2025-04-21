import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Divider, CircularProgress } from '@mui/material';
import { useAccount, useChainId } from 'wagmi';
import { formatUnits } from 'viem';
import { useEnhancedStakingContract } from '../../hooks/useEnhancedStakingContract';
import { useRewardDistribution } from '../../hooks/useRewardDistribution';
import { useState, useEffect } from 'react';
import StakingPowerFactorDisplay from './StakingPowerFactorDisplay';

const StakingDashboard: React.FC<{ poolId: `0x${string}` }> = ({ poolId }) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { getEnhancedStakingInfo, claimRewards, isLoading } = useEnhancedStakingContract(chainId);
  const { rewardDistribution } = useRewardDistribution();
  
  const [stakingInfo, setStakingInfo] = useState<{
    amount: bigint;
    virtualAmount: bigint;
    powerFactor: number;
    lockEndTime: bigint;
    pendingRewards: bigint;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [claimingRewards, setClaimingRewards] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  useEffect(() => {
    const fetchStakingInfo = async () => {
      if (!address || !poolId) return;
      
      try {
        setLoading(true);
        const info = await getEnhancedStakingInfo(poolId, address);
        setStakingInfo(info);
      } catch (error) {
        console.error('Error fetching staking info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStakingInfo();
    // Set up polling to refresh data
    const interval = setInterval(fetchStakingInfo, 30000); // every 30 seconds
    
    return () => clearInterval(interval);
  }, [address, poolId, getEnhancedStakingInfo]);

  const handleClaimRewards = async () => {
    if (!address || !poolId) return;
    
    try {
      setClaimingRewards(true);
      setClaimSuccess(false);
      const txHash = await claimRewards(poolId);
      if (txHash) {
        setClaimSuccess(true);
        // Refresh staking info after claiming
        const info = await getEnhancedStakingInfo(poolId, address);
        setStakingInfo(info);
      }
    } catch (error) {
      console.error('Error claiming rewards:', error);
    } finally {
      setClaimingRewards(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!stakingInfo || stakingInfo.amount === BigInt(0)) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" color="text.secondary">
            You are not currently staking in this pool. Stake MOR tokens to earn rewards with power factor boosts.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Format values for display
  const formattedAmount = formatUnits(stakingInfo.amount, 18);
  const formattedVirtualAmount = formatUnits(stakingInfo.virtualAmount, 18);
  const formattedPendingRewards = formatUnits(stakingInfo.pendingRewards, 18);
  
  // Calculate time remaining in lock period
  const currentTime = Math.floor(Date.now() / 1000);
  const lockEndTime = Number(stakingInfo.lockEndTime);
  const timeRemaining = Math.max(0, lockEndTime - currentTime);
  const daysRemaining = Math.floor(timeRemaining / (24 * 60 * 60));
  const hoursRemaining = Math.floor((timeRemaining % (24 * 60 * 60)) / (60 * 60));
  const isLocked = timeRemaining > 0;

  return (
    <Box sx={{ mb: 4 }}>
      <StakingPowerFactorDisplay poolId={poolId} />
      
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Your Staking Overview
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Staked Amount:
                </Typography>
                <Typography variant="h6">
                  {formattedAmount} MOR
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Virtual Staked Amount (with Power Factor):
                </Typography>
                <Typography variant="h6" color="primary">
                  {formattedVirtualAmount} MOR
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Pending Rewards:
                </Typography>
                <Typography variant="h6" color="success.main">
                  {formattedPendingRewards} MOR
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Lock Status:
                </Typography>
                <Typography variant="h6" color={isLocked ? "warning.main" : "success.main"}>
                  {isLocked ? `Locked (${daysRemaining}d ${hoursRemaining}h remaining)` : "Unlocked"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Your share of the {rewardDistribution.STAKERS}% staker rewards is calculated based on your virtual staked amount.
            </Typography>
            
            <Box>
              <button
                onClick={handleClaimRewards}
                disabled={claimingRewards || stakingInfo.pendingRewards === BigInt(0)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {claimingRewards ? 'Claiming...' : 'Claim Rewards'}
              </button>
              
              {claimSuccess && (
                <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                  Rewards claimed successfully!
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StakingDashboard;
