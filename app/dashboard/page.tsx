'use client';

import { useState } from 'react';

import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Box, Container, IconButton, Paper, Typography } from '@mui/material';
import { addDays, format, isSameDay, startOfWeek } from 'date-fns';

import { AddEventDialog } from '../../components/dashboard/AddEventDialog';
import { CarbonScoreCard } from '../../components/dashboard/CarbonScoreCard';
import { WeeklyCalendar } from '../../components/dashboard/WeeklyCalendar';
import type { CarbonEvent } from '../types/carbon-events';

// Separate component for events list
function EventsList({
  events,
  onDelete,
}: {
  events: CarbonEvent[];
  onDelete: (id: string) => void;
}) {
  return (
    <Box className='space-y-2'>
      {events.length === 0 ? (
        <Typography
          variant='body2'
          color='text.secondary'
          className='py-4 text-center'
        >
          No events added for this day
        </Typography>
      ) : (
        events.map((event) => (
          <Box
            key={event.id}
            className='flex items-center gap-2 rounded bg-gray-50 p-2'
          >
            <span className='text-xl'>{event.type.icon}</span>
            <Box className='flex-grow'>
              <Typography variant='body2'>{event.type.name}</Typography>
              {event.description && (
                <Typography variant='caption' color='text.secondary'>
                  {event.description}
                </Typography>
              )}
            </Box>
            <Typography variant='body2' color='text.secondary' className='mx-2'>
              {event.carbonScore.toFixed(1)} kg
            </Typography>
            <IconButton
              size='small'
              onClick={() => onDelete(event.id)}
              className='text-gray-400 hover:text-red-500'
            >
              <DeleteIcon fontSize='small' />
            </IconButton>
          </Box>
        ))
      )}
    </Box>
  );
}

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [events, setEvents] = useState<CarbonEvent[]>([]);

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Get events for selected date
  const selectedDateEvents = events.filter((event) =>
    isSameDay(new Date(event.date), selectedDate)
  );

  const handleAddEvent = (event: CarbonEvent) => {
    setEvents((prev) => [...prev, event]);
    setIsAddEventOpen(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
  };

  // Calculate daily totals for calendar
  const dailyTotals = Object.fromEntries(
    weekDays.map((day) => [
      day.toISOString(),
      events
        .filter((event) => isSameDay(new Date(event.date), day))
        .reduce((sum, event) => sum + event.carbonScore, 0),
    ])
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

            <EventsList
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
