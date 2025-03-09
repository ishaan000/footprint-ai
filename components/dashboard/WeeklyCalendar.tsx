'use client';

import { Box, Typography } from '@mui/material';
import { format, isSameDay } from 'date-fns';

interface WeeklyCalendarProps {
  days: Date[];
  dailyTotals: Record<string, number>;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function WeeklyCalendar(props: WeeklyCalendarProps) {
  const { days, selectedDate, onSelectDate } = props;

  return (
    <Box className='grid grid-cols-7 gap-2'>
      {days.map((day) => {
        const isSelected = isSameDay(day, selectedDate);
        // const total = dailyTotals[day.toISOString()] || 0;

        return (
          <Box
            key={day.toISOString()}
            className={`cursor-pointer rounded-lg p-2 transition-all ${
              isSelected
                ? 'bg-primary-light border-primary border'
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
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
