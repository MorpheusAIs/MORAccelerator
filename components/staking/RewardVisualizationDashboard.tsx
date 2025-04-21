import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, Card, CardContent, Grid, useTheme, Tab, Tabs, Button } from '@mui/material';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { formatUnits } from 'viem';
import { REWARD_DISTRIBUTION } from '../../contracts/config/rewardDistribution';

// Mock data for demonstration
const generateMockRewardData = (days: number) => {
  const data = [];
  let cumulativeReward = 0;
  
  for (let i = 0; i < days; i++) {
    // Base daily reward with some randomness
    const dailyReward = 0.5 + Math.random() * 0.3;
    cumulativeReward += dailyReward;
    
    data.push({
      day: i + 1,
      dailyReward: parseFloat(dailyReward.toFixed(2)),
      cumulativeReward: parseFloat(cumulativeReward.toFixed(2)),
    });
  }
  
  return data;
};

// Mock data for power factor impact
const generatePowerFactorImpactData = () => {
  return [
    { duration: '1 Month', powerFactor: 1.0, effectiveStake: 1000, baseReward: 50 },
    { duration: '3 Months', powerFactor: 1.5, effectiveStake: 1500, baseReward: 75 },
    { duration: '6 Months', powerFactor: 2.0, effectiveStake: 2000, baseReward: 100 },
    { duration: '1 Year', powerFactor: 2.5, effectiveStake: 2500, baseReward: 125 },
    { duration: '2 Years', powerFactor: 3.0, effectiveStake: 3000, baseReward: 150 },
  ];
};

// Mock data for reward distribution
const generateDistributionData = () => {
  return [
    { name: 'Stakers', value: REWARD_DISTRIBUTION.STAKERS },
    { name: 'Maintainer', value: REWARD_DISTRIBUTION.MAINTAINER },
    { name: 'Mentors', value: REWARD_DISTRIBUTION.MENTORS },
    { name: 'Operations', value: REWARD_DISTRIBUTION.OPERATIONS },
  ];
};

interface RewardVisualizationDashboardProps {
  stakedAmount?: bigint;
  powerFactor?: number;
  pendingRewards?: bigint;
  totalRewards?: bigint;
  lockEndTime?: bigint;
}

const RewardVisualizationDashboard: React.FC<RewardVisualizationDashboardProps> = ({
  stakedAmount = BigInt(1000000000000000000000), // Default 1000 tokens
  powerFactor = 1.5,
  pendingRewards = BigInt(50000000000000000000), // Default 50 tokens
  totalRewards = BigInt(100000000000000000000), // Default 100 tokens
  lockEndTime = BigInt(Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60), // Default 30 days from now
}) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [rewardData, setRewardData] = useState<any[]>([]);
  const [powerFactorData, setPowerFactorData] = useState<any[]>([]);
  const [distributionData, setDistributionData] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Format values for display
  const formattedStakedAmount = formatUnits(stakedAmount, 18);
  const formattedPendingRewards = formatUnits(pendingRewards, 18);
  const formattedTotalRewards = formatUnits(totalRewards, 18);
  
  // Calculate time remaining in lock period
  const currentTime = Math.floor(Date.now() / 1000);
  const lockTimeRemaining = Math.max(0, Number(lockEndTime) - currentTime);
  const daysRemaining = Math.floor(lockTimeRemaining / (24 * 60 * 60));
  const hoursRemaining = Math.floor((lockTimeRemaining % (24 * 60 * 60)) / (60 * 60));

  useEffect(() => {
    // Generate mock data
    setRewardData(generateMockRewardData(30)); // 30 days of data
    setPowerFactorData(generatePowerFactorImpactData());
    setDistributionData(generateDistributionData());
    
    // Trigger animation after component mounts
    setIsVisible(true);
    
    // No dependencies needed since these functions don't change and don't depend on props/state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Custom colors for charts
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
  ];

  return (
    <Card sx={{ mb: 4, overflow: 'hidden' }}>
      <CardContent sx={{ p: 0 }}>
        {/* Header with animated icon */}
        <Box sx={{ 
          bgcolor: theme.palette.primary.main, 
          color: 'white', 
          p: 2,
          display: 'flex',
          alignItems: 'center'
        }}>
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{ marginRight: 8 }}
          >
            <TrendingUpIcon fontSize="large" />
          </motion.div>
          <Typography variant="h5">
            Reward Analytics Dashboard
          </Typography>
        </Box>

        {/* Summary cards */}
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Staked Amount
                    </Typography>
                    <Typography variant="h5" component="div">
                      {formattedStakedAmount} MOR
                    </Typography>
                    <Typography variant="body2" color="primary">
                      Power Factor: {powerFactor.toFixed(2)}x
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Pending Rewards
                    </Typography>
                    <Typography variant="h5" component="div" color="success.main">
                      {formattedPendingRewards} MOR
                    </Typography>
                    <Button size="small" color="primary" sx={{ mt: 1 }}>
                      Claim Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Total Rewards Earned
                    </Typography>
                    <Typography variant="h5" component="div">
                      {formattedTotalRewards} MOR
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lifetime earnings
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Lock Time Remaining
                    </Typography>
                    <Typography variant="h5" component="div" color={daysRemaining > 0 ? "warning.main" : "success.main"}>
                      {daysRemaining > 0 ? `${daysRemaining}d ${hoursRemaining}h` : "Unlocked"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {daysRemaining > 0 ? "Until tokens unlock" : "Tokens can be unstaked"}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        {/* Tabs for different charts */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Reward Growth" />
            <Tab label="Power Factor Impact" />
            <Tab label="Distribution" />
          </Tabs>
        </Box>

        {/* Tab content with charts */}
        <Box sx={{ p: 2 }}>
          <AnimatePresence mode="wait">
            {/* Reward Growth Chart */}
            {tabValue === 0 && (
              <motion.div
                key="rewards"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h6" gutterBottom>
                  Reward Accrual Over Time
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  This chart shows your daily and cumulative rewards over the last 30 days.
                </Typography>
                
                <Box sx={{ height: 300, mb: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={rewardData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="cumulativeReward" 
                        name="Cumulative Rewards" 
                        stroke={theme.palette.primary.main} 
                        fill={theme.palette.primary.main} 
                        fillOpacity={0.3} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="dailyReward" 
                        name="Daily Rewards" 
                        stroke={theme.palette.secondary.main} 
                        fill={theme.palette.secondary.main} 
                        fillOpacity={0.3} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  Your rewards are calculated based on your staked amount, power factor, and the total staking pool.
                  With your current power factor of {powerFactor.toFixed(2)}x, you're earning rewards faster than base stakers.
                </Typography>
              </motion.div>
            )}

            {/* Power Factor Impact Chart */}
            {tabValue === 1 && (
              <motion.div
                key="powerFactor"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h6" gutterBottom>
                  Power Factor Impact on Rewards
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  This chart shows how different power factors affect your effective stake and rewards.
                </Typography>
                
                <Box sx={{ height: 300, mb: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={powerFactorData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="duration" />
                      <YAxis yAxisId="left" orientation="left" stroke={theme.palette.primary.main} />
                      <YAxis yAxisId="right" orientation="right" stroke={theme.palette.secondary.main} />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        yAxisId="left" 
                        dataKey="effectiveStake" 
                        name="Effective Stake (MOR)" 
                        fill={theme.palette.primary.main} 
                      />
                      <Bar 
                        yAxisId="right" 
                        dataKey="baseReward" 
                        name="Base Reward (MOR)" 
                        fill={theme.palette.secondary.main} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  Your current power factor of {powerFactor.toFixed(2)}x increases your effective stake from {formattedStakedAmount} MOR
                  to {(parseFloat(formattedStakedAmount) * powerFactor).toFixed(2)} MOR for reward calculations.
                </Typography>
              </motion.div>
            )}

            {/* Distribution Chart */}
            {tabValue === 2 && (
              <motion.div
                key="distribution"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h6" gutterBottom>
                  Reward Distribution
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  This chart shows how rewards are distributed across different stakeholders.
                </Typography>
                
                <Box sx={{ height: 300, mb: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={distributionData}
                      layout="vertical"
                      margin={{ top: 10, right: 30, left: 50, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="value" 
                        name="Percentage (%)" 
                        fill={theme.palette.primary.main}
                        label={{ position: 'right', fill: '#333' }}
                      >
                        {distributionData.map((entry, index) => (
                          <motion.rect 
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                            initial={{ width: 0 }}
                            animate={{ width: entry.value * 3 }} // Scale for better visualization
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  As a staker, you're part of the {REWARD_DISTRIBUTION.STAKERS}% allocation. Your share within this allocation
                  is determined by your effective stake (actual stake × power factor) relative to the total effective stake in the pool.
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RewardVisualizationDashboard;
