import React from 'react';
import { useRewardDistribution } from '../../hooks/useRewardDistribution';
import { Card, CardContent, CardHeader, Divider, Typography, Box, Grid, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

/**
 * Component to display reward distribution information
 */
const RewardDistributionInfo: React.FC = () => {
  const { rewardDistribution, liquidityRules } = useRewardDistribution();

  return (
    <Card sx={{ mb: 4 }}>
      <CardHeader 
        title="Reward Distribution" 
        subheader="How MOR rewards are distributed across the ecosystem"
      />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          {/* Stakers */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" sx={{ mr: 1 }}>
                Stakers: {rewardDistribution.STAKERS}%
              </Typography>
              <Tooltip title="Rewards distributed to token stakers based on their staking amount and power factor">
                <InfoIcon fontSize="small" color="primary" />
              </Tooltip>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Distributed to all participants who stake MOR tokens. Rewards are calculated based on:
              MOR Rewards = MOR Staked × Power Factor
            </Typography>
          </Grid>

          {/* Maintainer */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" sx={{ mr: 1 }}>
                Maintainer: {rewardDistribution.MAINTAINER}%
              </Typography>
              <Tooltip title="Maintainer wallet receives rewards for project maintenance and development">
                <InfoIcon fontSize="small" color="primary" />
              </Tooltip>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {liquidityRules.MAINTAINER.STAKED}% must be staked, and {liquidityRules.MAINTAINER.LIQUID}% remains liquid.
              Maintainers are responsible for ongoing project development and maintenance.
            </Typography>
          </Grid>

          {/* Mentors */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" sx={{ mr: 1 }}>
                Mentors: {rewardDistribution.MENTORS}%
              </Typography>
              <Tooltip title="Mentor wallets receive rewards for providing guidance and expertise">
                <InfoIcon fontSize="small" color="primary" />
              </Tooltip>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {liquidityRules.MENTORS.LIQUID}% liquid for direct distribution.
              Mentors provide guidance, expertise, and support to the project.
            </Typography>
          </Grid>

          {/* Operations */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h6" sx={{ mr: 1 }}>
                Operations: {rewardDistribution.OPERATIONS}%
              </Typography>
              <Tooltip title="Operations multisig manages budget for project expenses">
                <InfoIcon fontSize="small" color="primary" />
              </Tooltip>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Manages budget for expenses such as compute, software development, and travel.
              Controlled by a multisig wallet for transparent governance.
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Important Notes:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Rewards depend on meeting the minimum staking threshold
          <br />
          • The Time & Dilution-Based Power Factor increases proportional stake weight in emissions distribution
          <br />
          • Longer staking periods result in higher power factors and increased rewards
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RewardDistributionInfo;
