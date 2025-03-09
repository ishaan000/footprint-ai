'use client';

import { Paper, Typography, Box } from '@mui/material';

interface CarbonScoreCardProps {
  score: number;
}

export function CarbonScoreCard({ score }: CarbonScoreCardProps) {
  // Average person's daily carbon footprint is about 22kg CO2
  const averageDaily = 22;
  const comparison = ((score - averageDaily) / averageDaily) * 100;

  return (
    <Paper className="p-4">
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Your Carbon Score
      </Typography>
      <Box className="flex items-baseline gap-2">
        <Typography variant="h3" component="div" color="primary">
          {score.toFixed(1)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          kg CO₂
        </Typography>
      </Box>
      <Typography
        variant="caption"
        color={comparison > 0 ? 'error' : 'success'}
        className="mt-1 block"
      >
        {comparison > 0
          ? `${comparison.toFixed(0)}% above average`
          : `${Math.abs(comparison).toFixed(0)}% below average`}
      </Typography>
    </Paper>
  );
} 