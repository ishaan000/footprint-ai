'use client';

import { useCallback, useMemo, useState } from 'react';

import { createCarbonEvent, deleteCarbonEvent } from '@/db';
import { Add as AddIcon } from '@mui/icons-material';
import {
  Box,
  Container,
  IconButton,
  Paper,
  Skeleton,
  Typography,
} from '@mui/material';
import { addDays, format, isSameDay, startOfWeek } from 'date-fns';

import type { CarbonEvent } from '@/types/CarbonEvents';

import { AddEventDialog } from './AddEventDialog';
import { CarbonScoreCard } from './CarbonScoreCard';
import { EventList } from './EventList';
import { WeeklyCalendar } from './WeeklyCalendar';

export default function Dashboard({
  userStackAuthId,
  initialEvents,
}: {
  userStackAuthId: string;
  initialEvents: CarbonEvent[];
}) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [events, setEvents] = useState<CarbonEvent[]>(initialEvents);
  const [loading, setLoading] = useState(false);
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

  const handleAddEvent = useCallback(
    async (event: CarbonEvent) => {
      try {
        setLoading(true);
        const newEvent = await createCarbonEvent(userStackAuthId, event);
        setEvents((prev) => [...prev, { ...event, id: newEvent[0].id }]);
        setIsAddEventOpen(false);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [userStackAuthId]
  );

  const handleDeleteEvent = useCallback(async (eventId: number) => {
    try {
      setLoading(true);
      await deleteCarbonEvent(eventId);
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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
                disabled={loading}
              >
                <AddIcon />
              </IconButton>
            </Box>

            {loading && <Skeleton height={200} />}

            <EventList
              events={selectedDateEvents}
              onDelete={handleDeleteEvent}
            />
          </Paper>
        </Box>

        {/* Score Card */}
        <CarbonScoreCard
          title={"Today's Carbon Score"}
          score={selectedDateEvents.reduce(
            (sum, event) => sum + event.carbonScore,
            0
          )}
        />

        {/* Add Event Dialog */}
        {!loading && (
          <AddEventDialog
            open={isAddEventOpen}
            onClose={() => setIsAddEventOpen(false)}
            onAdd={handleAddEvent}
            selectedDate={selectedDate}
          />
        )}
      </Box>
    </Container>
  );
}
