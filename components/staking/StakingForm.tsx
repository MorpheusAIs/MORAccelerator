import React from 'react';
import { Box, Typography, Card, CardContent, Button, TextField, MenuItem, FormControl, InputLabel, Select, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { parseUnits } from 'viem';
import { useMORToken } from '../../hooks/useMORToken';
import { useEnhancedStakingContract } from '../../hooks/useEnhancedStakingContract';
import { STAKING_OPTIONS } from '../../contracts/config/stakingConfig';
import PowerFactorInfo from './PowerFactorInfo';
import RewardDistributionInfo from './RewardDistributionInfo';

const StakingForm: React.FC<{ poolId: `0x${string}` }> = ({ poolId }) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { formattedBalance, symbol } = useMORToken();
  const { enhancedStake, isLoading, error, meetsMinimumStakingThreshold, minimumStakingThreshold } = useEnhancedStakingContract(chainId);
  
  const [amount, setAmount] = useState('');
  const [stakingPeriod, setStakingPeriod] = useState(STAKING_OPTIONS[0].value);
  const [successMessage, setSuccessMessage] = useState('');

  const handleStake = async () => {
    if (!address || !amount || parseFloat(amount) <= 0) return;
    
    try {
      setSuccessMessage('');
      const txHash = await enhancedStake(poolId, amount, stakingPeriod);
      if (txHash) {
        setSuccessMessage(`Successfully staked ${amount} ${symbol} with a lock period of ${stakingPeriod / (24 * 60 * 60)} days!`);
        setAmount('');
      }
    } catch (err) {
      console.error('Error staking:', err);
    }
  };

  const handleMaxAmount = () => {
    if (formattedBalance) {
      setAmount(formattedBalance);
    }
  };

  const selectedOption = STAKING_OPTIONS.find(option => option.value === stakingPeriod);

  return (
    <Box sx={{ mb: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Stake MOR Tokens
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Available Balance: {formattedBalance} {symbol}
            </Typography>
            
            {!meetsMinimumStakingThreshold && (
              <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                You need at least {minimumStakingThreshold} {symbol} to stake.
              </Typography>
            )}
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Amount to Stake"
              variant="outlined"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              InputProps={{
                endAdornment: (
                  <Button 
                    onClick={handleMaxAmount}
                    size="small"
                    sx={{ minWidth: 'auto' }}
                  >
                    MAX
                  </Button>
                ),
              }}
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="staking-period-label">Staking Period</InputLabel>
              <Select
                labelId="staking-period-label"
                value={stakingPeriod}
                label="Staking Period"
                onChange={(e) => setStakingPeriod(Number(e.target.value))}
              >
                {STAKING_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label} - {option.powerFactor} Power Factor
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {selectedOption && (
              <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Power Factor: {selectedOption.powerFactor}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedOption.description}
                </Typography>
              </Box>
            )}
          </Box>
          
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleStake}
            disabled={isLoading || !address || !amount || parseFloat(amount) <= 0 || !meetsMinimumStakingThreshold}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Stake Tokens'}
          </Button>
          
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          
          {successMessage && (
            <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
              {successMessage}
            </Typography>
          )}
        </CardContent>
      </Card>
      
      <Box sx={{ mt: 4 }}>
        <PowerFactorInfo />
        <RewardDistributionInfo />
      </Box>
    </Box>
  );
};

export default StakingForm;
