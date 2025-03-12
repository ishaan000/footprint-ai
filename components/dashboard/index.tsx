'use client';

import { useCallback, useMemo, useState } from 'react';

import { createCarbonEvent, deleteCarbonEvent } from '@/db';
import { Add as AddIcon, ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Box,
  Container,
  IconButton,
  Paper,
  Skeleton,
  Typography,
} from '@mui/material';
import { addDays, format, isSameDay, startOfWeek } from 'date-fns';

import { GrowingPlant } from '@/components/GrowingPlant';

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
  const [isEventsMinimized, setIsEventsMinimized] = useState(true);
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

  // Calculate total points for plant growth
  const totalPoints = useMemo(
    () => events.reduce((sum, event) => sum + event.carbonScore, 0),
    [events]
  );

  // Calculate daily points for the plant animation
  const dailyPoints = useMemo(
    () => selectedDateEvents.reduce((sum, event) => sum + event.carbonScore, 0),
    [selectedDateEvents]
  );

  return (
    <Container maxWidth='lg' className='py-4'>
      <div className='relative mb-8 flex justify-center'>
        <div className='h-[240px] w-[240px]'>
          <GrowingPlant points={dailyPoints} className='h-full w-full' />
        </div>
      </div>
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
              <Box className='flex items-center gap-2'>
                <IconButton
                  size='small'
                  onClick={() => setIsEventsMinimized(!isEventsMinimized)}
                  color='inherit'
                >
                  {isEventsMinimized ? (
                    <ExpandMore fontSize='small' />
                  ) : (
                    <ExpandLess fontSize='small' />
                  )}
                </IconButton>
                <IconButton
                  size='small'
                  onClick={() => setIsAddEventOpen(true)}
                  color='primary'
                  disabled={loading}
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>

            {loading && <Skeleton height={200} />}

            {isEventsMinimized ? (
              <Typography
                variant='body2'
                color='text.secondary'
                className='text-center italic'
              >
                {selectedDateEvents.length > 0
                  ? `${selectedDateEvents.length} event${selectedDateEvents.length !== 1 ? 's' : ''} recorded - Click ↓ to view`
                  : 'No events yet - Click + to log your first sustainable action!'}
              </Typography>
            ) : (
              <EventList
                events={selectedDateEvents}
                onDelete={handleDeleteEvent}
              />
            )}
          </Paper>
        </Box>

        {/* Score Cards */}
        <Box className='grid grid-cols-2 gap-3'>
          <CarbonScoreCard title={"Today's Carbon Score"} score={dailyPoints} />
          <CarbonScoreCard title={'Total Carbon Score'} score={totalPoints} />
        </Box>

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
