import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, Card, CardContent, Slider, Button, TextField, Grid, useTheme } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { STAKING_OPTIONS, STAKING_PERIODS } from '../../contracts/config/stakingConfig';
import { POWER_FACTOR_CONFIG } from '../../contracts/config/rewardDistribution';

interface AnimatedStakingFlowProps {
  onStake: (amount: string, duration: number) => void;
  maxAmount: string;
}

const AnimatedStakingFlow: React.FC<AnimatedStakingFlowProps> = ({ onStake, maxAmount }) => {
  const theme = useTheme();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState(STAKING_PERIODS.ONE_MONTH);
  const [powerFactor, setPowerFactor] = useState(1.0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Calculate power factor based on duration
  useEffect(() => {
    // Find the appropriate power factor based on duration
    if (duration <= STAKING_PERIODS.ONE_MONTH) {
      setPowerFactor(1.0);
    } else if (duration <= STAKING_PERIODS.THREE_MONTHS) {
      const progress = (duration - STAKING_PERIODS.ONE_MONTH) / 
                      (STAKING_PERIODS.THREE_MONTHS - STAKING_PERIODS.ONE_MONTH);
      setPowerFactor(1.0 + (0.5 * progress));
    } else if (duration <= STAKING_PERIODS.SIX_MONTHS) {
      const progress = (duration - STAKING_PERIODS.THREE_MONTHS) / 
                      (STAKING_PERIODS.SIX_MONTHS - STAKING_PERIODS.THREE_MONTHS);
      setPowerFactor(1.5 + (0.5 * progress));
    } else if (duration <= STAKING_PERIODS.ONE_YEAR) {
      const progress = (duration - STAKING_PERIODS.SIX_MONTHS) / 
                      (STAKING_PERIODS.ONE_YEAR - STAKING_PERIODS.SIX_MONTHS);
      setPowerFactor(2.0 + (0.5 * progress));
    } else {
      const additionalMonths = Math.floor((duration - STAKING_PERIODS.ONE_YEAR) / (30 * 24 * 60 * 60));
      const cappedAdditionalMonths = Math.min(additionalMonths, 24);
      const additionalFactor = (cappedAdditionalMonths * 0.5) / 24;
      setPowerFactor(Math.min(2.5 + additionalFactor, 3.0));
    }
  }, [duration, STAKING_PERIODS.ONE_MONTH, STAKING_PERIODS.THREE_MONTHS, STAKING_PERIODS.SIX_MONTHS, STAKING_PERIODS.ONE_YEAR]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleDurationChange = (_event: Event, newValue: number | number[]) => {
    setDuration(newValue as number);
  };

  const handleMaxAmount = () => {
    setAmount(maxAmount);
  };

  const handleNext = () => {
    if (step < 3) {
      setIsAnimating(true);
      setTimeout(() => {
        setStep(step + 1);
        setIsAnimating(false);
      }, 500);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setStep(step - 1);
        setIsAnimating(false);
      }, 500);
    }
  };

  const handleSubmit = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onStake(amount, duration);
      // Reset form after submission
      setStep(1);
      setAmount('');
      setDuration(STAKING_PERIODS.ONE_MONTH);
      setIsAnimating(false);
    }, 1000);
  };

  // Format duration for display
  const formatDuration = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    if (days < 30) {
      return `${days} days`;
    } else if (days < 365) {
      const months = Math.floor(days / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(days / 365);
      const remainingMonths = Math.floor((days % 365) / 30);
      return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`;
    }
  };

  // Get marks for the slider
  const durationMarks = STAKING_OPTIONS.map(option => ({
    value: option.value,
    label: option.label
  }));

  // Calculate virtual amount
  const virtualAmount = amount ? parseFloat(amount) * powerFactor : 0;

  return (
    <Card sx={{ overflow: 'hidden', mb: 4 }}>
      <CardContent sx={{ p: 0 }}>
        {/* Progress indicator */}
        <Box sx={{ display: 'flex', mb: 2, bgcolor: theme.palette.primary.main, color: 'white' }}>
          {[1, 2, 3].map((s) => (
            <Box
              key={s}
              sx={{
                flex: 1,
                p: 1,
                textAlign: 'center',
                bgcolor: s === step ? theme.palette.primary.dark : theme.palette.primary.main,
                transition: 'background-color 0.3s ease'
              }}
            >
              <Typography variant="body2" fontWeight={s === step ? 'bold' : 'normal'}>
                {s === 1 ? 'Amount' : s === 2 ? 'Duration' : 'Confirm'}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ p: 3 }}>
          <AnimatePresence mode="wait">
            {/* Step 1: Enter amount */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: isAnimating ? -100 : 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h6" gutterBottom>
                  Step 1: Enter Staking Amount
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Enter the amount of MOR tokens you want to stake.
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <TextField
                    label="Amount to Stake"
                    variant="outlined"
                    fullWidth
                    value={amount}
                    onChange={handleAmountChange}
                    type="number"
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
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Available: {maxAmount} MOR
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="contained" 
                    onClick={handleNext}
                    disabled={!amount || parseFloat(amount) <= 0}
                  >
                    Next
                  </Button>
                </Box>
              </motion.div>
            )}

            {/* Step 2: Select duration */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: isAnimating ? (step > 1 ? 100 : -100) : 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h6" gutterBottom>
                  Step 2: Select Staking Duration
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Choose how long you want to stake your tokens. Longer durations provide higher power factors.
                </Typography>
                
                <Box sx={{ mb: 4 }}>
                  <Slider
                    value={duration}
                    onChange={handleDurationChange}
                    min={STAKING_PERIODS.ONE_MONTH}
                    max={STAKING_PERIODS.ONE_YEAR * 2}
                    step={STAKING_PERIODS.ONE_MONTH / 2}
                    marks={durationMarks}
                    valueLabelDisplay="off"
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2">
                      Selected: {formatDuration(duration)}
                    </Typography>
                    <Typography variant="body2" color="primary" fontWeight="bold">
                      Power Factor: {powerFactor.toFixed(2)}x
                    </Typography>
                  </Box>
                </Box>

                {/* Animated lock visualization */}
                <Box sx={{ 
                  position: 'relative', 
                  height: 120, 
                  mb: 3, 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0, 0, 0, 0.03)',
                  borderRadius: 2
                }}>
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    style={{ position: 'absolute' }}
                  >
                    <LockIcon sx={{ 
                      fontSize: 60, 
                      color: theme.palette.primary.main,
                      opacity: 0.8
                    }} />
                  </motion.div>
                  
                  <motion.div
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '5px',
                      bottom: 20,
                      backgroundColor: theme.palette.primary.main,
                      opacity: 0.3,
                    }}
                  />
                  
                  <motion.div
                    animate={{
                      width: `${(powerFactor / 3) * 100}%`
                    }}
                    transition={{
                      duration: 0.5
                    }}
                    style={{
                      position: 'absolute',
                      height: '5px',
                      bottom: 20,
                      left: 0,
                      backgroundColor: theme.palette.primary.main,
                    }}
                  />
                  
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      position: 'absolute', 
                      bottom: 5, 
                      width: '100%', 
                      textAlign: 'center' 
                    }}
                  >
                    Lock Period: {formatDuration(duration)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button onClick={handleBack}>
                    Back
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                </Box>
              </motion.div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: isAnimating ? 100 : 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h6" gutterBottom>
                  Step 3: Confirm Staking
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Review your staking details before confirming.
                </Typography>
                
                <Box sx={{ 
                  mb: 3, 
                  p: 2, 
                  bgcolor: 'rgba(0, 0, 0, 0.03)', 
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`
                }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Amount to Stake:
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {amount} MOR
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Lock Duration:
                      </Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {formatDuration(duration)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Power Factor:
                      </Typography>
                      <Typography variant="body1" fontWeight="bold" color="primary">
                        {powerFactor.toFixed(2)}x
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Virtual Amount:
                      </Typography>
                      <Typography variant="body1" fontWeight="bold" color="primary">
                        {virtualAmount.toFixed(2)} MOR
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                
                {/* Animated power factor visualization */}
                <Box sx={{ 
                  position: 'relative', 
                  height: 150, 
                  mb: 3, 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0, 0, 0, 0.03)',
                  borderRadius: 2,
                  overflow: 'hidden'
                }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      position: 'absolute',
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: theme.palette.primary.main,
                      opacity: 0.2,
                      zIndex: 1
                    }}
                  />
                  
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: powerFactor / 1.0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{
                      position: 'absolute',
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: theme.palette.primary.main,
                      opacity: 0.4,
                      zIndex: 2
                    }}
                  />
                  
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    style={{
                      position: 'absolute',
                      zIndex: 3
                    }}
                  >
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      {powerFactor.toFixed(2)}x
                    </Typography>
                  </motion.div>
                  
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    style={{
                      position: 'absolute',
                      bottom: 20,
                      zIndex: 3
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Your Power Factor Boost
                    </Typography>
                  </motion.div>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button onClick={handleBack}>
                    Back
                  </Button>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleSubmit}
                  >
                    Confirm Staking
                  </Button>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AnimatedStakingFlow;
