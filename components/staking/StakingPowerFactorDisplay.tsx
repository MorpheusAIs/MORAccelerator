import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import { usePowerFactor } from '../../hooks/usePowerFactor';
import { useEnhancedStakingContract } from '../../hooks/useEnhancedStakingContract';
import { useChainId } from 'wagmi';

interface StakingPowerFactorDisplayProps {
  poolId: `0x${string}`;
}

const StakingPowerFactorDisplay: React.FC<StakingPowerFactorDisplayProps> = ({ poolId }) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { calculatePowerFactor } = usePowerFactor();
  const { getEnhancedStakingInfo } = useEnhancedStakingContract(chainId);
  
  const [loading, setLoading] = useState(true);
  const [stakingInfo, setStakingInfo] = useState<{
    amount: bigint;
    virtualAmount: bigint;
    powerFactor: number;
    lockEndTime: bigint;
    pendingRewards: bigint;
  } | null>(null);

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
  const powerFactorDisplay = stakingInfo.powerFactor.toFixed(2) + 'x';
  const boostPercentage = ((stakingInfo.powerFactor - 1) * 100).toFixed(0) + '%';
  
  // Calculate time remaining in lock period
  const currentTime = Math.floor(Date.now() / 1000);
  const lockEndTime = Number(stakingInfo.lockEndTime);
  const timeRemaining = Math.max(0, lockEndTime - currentTime);
  const daysRemaining = Math.floor(timeRemaining / (24 * 60 * 60));
  const hoursRemaining = Math.floor((timeRemaining % (24 * 60 * 60)) / (60 * 60));

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Your Staking Power</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h5" color="primary" fontWeight="bold">
              {powerFactorDisplay}
            </Typography>
            <Tooltip title="Your power factor multiplies your effective staking power, increasing your share of rewards">
              <InfoIcon fontSize="small" color="primary" sx={{ ml: 1 }} />
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">Actual Staked Amount:</Typography>
          <Typography variant="body2">{formattedAmount} MOR</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">Virtual Staked Amount:</Typography>
          <Typography variant="body2" fontWeight="bold">{formattedVirtualAmount} MOR</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">Power Boost:</Typography>
          <Typography variant="body2" color="success.main">+{boostPercentage}</Typography>
        </Box>

        {timeRemaining > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Lock Time Remaining:</Typography>
            <Typography variant="body2">{daysRemaining}d {hoursRemaining}h</Typography>
          </Box>
        )}

        <Typography variant="body2" sx={{ mt: 2 }}>
          Your power factor increases based on staking duration, boosting your rewards according to the formula:
          <Box component="span" fontWeight="bold" sx={{ display: 'block', mt: 1 }}>
            MOR Rewards = MOR Staked × Power Factor ({formattedAmount} × {powerFactorDisplay})
          </Box>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StakingPowerFactorDisplay;
