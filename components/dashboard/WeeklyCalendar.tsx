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
  const { days, dailyTotals, selectedDate, onSelectDate } = props;

  return (
    <Box className="grid grid-cols-7 gap-2">
      {days.map((day) => {
        const isSelected = isSameDay(day, selectedDate);
        const total = dailyTotals[day.toISOString()] || 0;

        return (
          <Box
            key={day.toISOString()}
            className={`p-2 rounded-lg cursor-pointer transition-all ${
              isSelected
                ? 'bg-primary-light border border-primary'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onSelectDate(day)}
          >
            <Box className="flex flex-col h-full justify-between">
              <Box>
                <Typography variant="caption" className="font-medium block">
                  {format(day, 'EEE')}
                </Typography>
                <Typography variant="body2">{format(day, 'd')}</Typography>
              </Box>

            </Box>
          </Box>
        );
      })}
    </Box>
  );
} 