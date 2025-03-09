'use client';

import { useCallback, useMemo, useState } from 'react';

import { Add as AddIcon } from '@mui/icons-material';
import { Box, Container, IconButton, Paper, Typography } from '@mui/material';
import { addDays, format, isSameDay, startOfWeek } from 'date-fns';

import { AddEventDialog } from '@/components/dashboard/AddEventDialog';
import { CarbonScoreCard } from '@/components/dashboard/CarbonScoreCard';
import { WeeklyCalendar } from '@/components/dashboard/WeeklyCalendar';
import { EventList } from '@/components/EventList';

import type { CarbonEvent } from '@/types/CarbonEvents';

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [events, setEvents] = useState<CarbonEvent[]>([]);

  const weekStart = useMemo(
    () => startOfWeek(selectedDate, { weekStartsOn: 1 }),
    [selectedDate]
  );
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  // Get events for selected date
  const selectedDateEvents = useMemo(
    () =>
      events.filter((event) => isSameDay(new Date(event.date), selectedDate)),
    [events, selectedDate]
  );

  const handleAddEvent = useCallback((event: CarbonEvent) => {
    setEvents((prev) => [...prev, event]);
    setIsAddEventOpen(false);
  }, []);

  const handleDeleteEvent = useCallback((eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
  }, []);

  // Calculate daily totals for calendar
  const dailyTotals = useMemo(
    () =>
      Object.fromEntries(
        weekDays.map((day) => [
          day.toISOString(),
          events
            .filter((event) => isSameDay(new Date(event.date), day))
            .reduce((sum, event) => sum + event.carbonScore, 0),
        ])
      ),
    [events, weekDays]
  );

  return (
    <Container maxWidth='lg' className='py-4'>
      <Box className='flex flex-col gap-3'>
        {/* Calendar */}
        <Paper className='p-3'>
          <WeeklyCalendar
            days={weekDays}
            dailyTotals={dailyTotals}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </Paper>

        <Box>
          {/* Selected Date and Events */}
          <Paper className='col-span-2 p-3'>
            <Box className='mb-3 flex items-center justify-between'>
              <Typography variant='subtitle1'>
                {format(selectedDate, 'EEEE, MMMM d')}
              </Typography>
              <IconButton
                size='small'
                onClick={() => setIsAddEventOpen(true)}
                color='primary'
              >
                <AddIcon />
              </IconButton>
            </Box>

            <EventList
              events={selectedDateEvents}
              onDelete={handleDeleteEvent}
            />
          </Paper>
        </Box>

        {/* Score Card */}
        <Paper className='p-3'>
          <CarbonScoreCard
            score={selectedDateEvents.reduce(
              (sum, event) => sum + event.carbonScore,
              0
            )}
          />
        </Paper>

        {/* Add Event Dialog */}
        <AddEventDialog
          open={isAddEventOpen}
          onClose={() => setIsAddEventOpen(false)}
          onAdd={handleAddEvent}
          selectedDate={selectedDate}
        />
      </Box>
    </Container>
  );
}
