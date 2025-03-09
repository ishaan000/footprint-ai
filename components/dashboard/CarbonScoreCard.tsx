'use client';

import { Box, Paper, Typography } from '@mui/material';

interface CarbonScoreCardProps {
  score: number;
  title: string;
}

export function CarbonScoreCard({ score, title }: CarbonScoreCardProps) {
  const averageDaily = 100; // Average person's daily points would be 100 (just a random number)
  const comparison = ((score - averageDaily) / averageDaily) * 100;

  return (
    <Paper className='p-4'>
      <Typography variant='subtitle2' color='text.secondary' gutterBottom>
        {title}
      </Typography>
      <Box className='flex items-baseline gap-2'>
        <Typography variant='h3' component='div' color='primary'>
          {score}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          points
        </Typography>
      </Box>
      <Typography
        variant='caption'
        color={comparison < 0 ? 'error' : 'success'}
        className='mt-1 block'
      >
        {comparison > 0
          ? `${comparison.toFixed(0)}% above average`
          : `${Math.abs(comparison).toFixed(0)}% below average`}
      </Typography>
    </Paper>
  );
}
