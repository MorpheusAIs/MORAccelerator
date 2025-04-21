import React from 'react';
import { Card, CardContent, CardHeader, Divider, Typography, Box, Grid, LinearProgress, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { usePowerFactor } from '../../hooks/usePowerFactor';

/**
 * Component to display power factor information and tiers
 */
const PowerFactorInfo: React.FC = () => {
  const { getPowerFactorTiers } = usePowerFactor();
  const tiers = getPowerFactorTiers;

  return (
    <Card sx={{ mb: 4 }}>
      <CardHeader 
        title="Time & Dilution-Based Power Factor" 
        subheader="Boost your staking rewards by committing for longer periods"
      />
      <Divider />
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" paragraph>
            The Power Factor method boosts your staking rewards based on how long you've staked your MOR tokens.
            The longer you stake, the higher your power factor, and the more rewards you earn.
          </Typography>
          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
            <strong>Reward Formula:</strong> MOR Rewards = MOR Staked × Power Factor
            <Tooltip title="Your effective staking power is multiplied by your power factor, increasing your share of rewards">
              <InfoIcon fontSize="small" color="primary" sx={{ ml: 1 }} />
            </Tooltip>
          </Typography>
        </Box>

        <Typography variant="h6" sx={{ mb: 2 }}>Power Factor Tiers</Typography>
        
        {tiers.map((tier, index) => {
          // Calculate progress percentage for visual representation
          const baseValue = 1.0;
          const maxValue = 3.0;
          const factorValues = tier.factor.includes('-') 
            ? tier.factor.split('-').map(f => parseFloat(f.replace('x', '')))
            : [parseFloat(tier.factor.replace('x', ''))];
          
          const startProgress = ((factorValues[0] - baseValue) / (maxValue - baseValue)) * 100;
          const endProgress = factorValues.length > 1 
            ? ((factorValues[1] - baseValue) / (maxValue - baseValue)) * 100
            : startProgress;
            
          return (
            <Box key={index} sx={{ mb: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <Typography variant="body2" fontWeight="bold">
                    {tier.duration}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2" color="primary" fontWeight="bold">
                    {tier.factor}
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={endProgress} 
                        sx={{ 
                          height: 10, 
                          borderRadius: 5,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 5,
                            backgroundColor: index === 0 ? '#64b5f6' : 
                                            index === 1 ? '#4caf50' : 
                                            index === 2 ? '#ff9800' : 
                                            index === 3 ? '#f44336' : '#9c27b0',
                          }
                        }} 
                      />
                    </Box>
                    <Tooltip title={tier.description}>
                      <InfoIcon fontSize="small" color="action" />
                    </Tooltip>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {tier.description}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          );
        })}

        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Benefits of Higher Power Factors:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Increased share of the 50% reward allocation for stakers
          <br />
          • Protection against dilution from new stakers
          <br />
          • Incentivizes long-term commitment to the ecosystem
          <br />
          • Rewards loyal community members who provide stability
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PowerFactorInfo;
