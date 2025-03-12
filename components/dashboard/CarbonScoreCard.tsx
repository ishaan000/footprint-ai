'use client';

import { Box, Paper, Typography } from '@mui/material';

interface CarbonScoreCardProps {
  score: number;
  title: string;
}

export function CarbonScoreCard({ score, title }: CarbonScoreCardProps) {
  // Use different baselines for daily vs total scores
  const isTotal = title.toLowerCase().includes('total');
  const baseline = isTotal ? 700 : 100; // 700 for weekly total (100 * 7 days), 100 for daily
  const comparison = ((score - baseline) / baseline) * 100;

  return (
    <Paper className='p-4'>
      <Typography variant='subtitle2' color='text.secondary' gutterBottom>
        {title}
      </Typography>
      <Box className='flex flex-col'>
        <Typography
          variant='h2'
          component='div'
          className='text-[#0066ff]'
          sx={{ fontWeight: 500 }}
        >
          {score}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          points
        </Typography>
      </Box>
      <Typography
        variant='body2'
        className={`mt-1 block ${comparison > 0 ? 'text-[#00A651]' : 'text-[#FF0000]'}`}
        sx={{ fontWeight: 500 }}
      >
        {comparison > 0
          ? `${comparison.toFixed(0)}% above average`
          : `${Math.abs(comparison).toFixed(0)}% below average`}
      </Typography>
    </Paper>
  );
}
