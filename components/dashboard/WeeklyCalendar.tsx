'use client';

import { Box, Typography } from '@mui/material';
import { format, isSameDay } from 'date-fns';

interface WeeklyCalendarProps {
  days: Date[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  dailyTotals: Record<string, number>;
}

export function WeeklyCalendar(props: WeeklyCalendarProps) {
  const { days, selectedDate, onSelectDate, dailyTotals } = props;

  // Calculate weekly total
  const weeklyTotal = Object.values(dailyTotals).reduce(
    (sum, total) => sum + total,
    0
  );

  return (
    <Box className='space-y-4'>
      {/* Weekly total display */}
      <Box className='flex items-center justify-between px-2'>
        <Typography variant='subtitle2' color='text.secondary'>
          This Week
        </Typography>
        <Typography variant='subtitle1' color='primary' fontWeight='medium'>
          {weeklyTotal} points
        </Typography>
      </Box>

      {/* Calendar grid */}
      <Box className='grid grid-cols-7 gap-2'>
        {days.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const total = dailyTotals[day.toISOString()] || 0;
          const hasEvents = total > 0;

          return (
            <Box
              key={day.toISOString()}
              className={`cursor-pointer rounded-lg p-2 transition-all ${
                isSelected
                  ? 'bg-primary-light border-primary border'
                  : hasEvents
                    ? 'bg-green-50 hover:bg-green-100'
                    : 'hover:bg-gray-50'
              }`}
              onClick={() => onSelectDate(day)}
            >
              <Box className='flex h-full flex-col justify-between'>
                <Box>
                  <Typography variant='caption' className='block font-medium'>
                    {format(day, 'EEE')}
                  </Typography>
                  <Typography variant='body2'>{format(day, 'd')}</Typography>
                </Box>
                {hasEvents && (
                  <Box className='mt-1 flex items-center justify-center'>
                    <span role='img' aria-label='plant' className='text-xs'>
                      🌱
                    </span>
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
