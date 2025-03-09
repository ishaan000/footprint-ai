import { Delete as DeleteIcon } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';

import type { CarbonEvent } from '@/types/CarbonEvents';

export function EventList({
  events,
  onDelete,
}: {
  events: CarbonEvent[];
  onDelete: (id: number) => void;
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
