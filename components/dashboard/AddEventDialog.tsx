'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import type { CarbonEvent, CarbonEventType } from '../../app/types/carbon-events';
import { CARBON_EVENT_TYPES } from '../../app/types/carbon-events';

interface AddEventDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (event: CarbonEvent) => void;
  selectedDate: Date;
}

export function AddEventDialog({
  open,
  onClose,
  onAdd,
  selectedDate,
}: AddEventDialogProps) {
  const [selectedType, setSelectedType] = useState<CarbonEventType | null>(null);
  const [description, setDescription] = useState('');

  const handleAdd = () => {
    if (!selectedType) return;

    const newEvent: CarbonEvent = {
      id: uuidv4(),
      type: selectedType,
      date: selectedDate.toISOString(),
      description: description.trim() || undefined,
      carbonScore: selectedType.baseScore,
      category: selectedType.category,
    };

    onAdd(newEvent);
    setSelectedType(null);
    setDescription('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Carbon Event</DialogTitle>
      <DialogContent>
        <Box className="space-y-4 mt-2">
          <Typography variant="subtitle2" color="text.secondary">
            Date: {format(selectedDate, 'MMMM d, yyyy')}
          </Typography>

          <TextField
            select
            fullWidth
            label="Event Type"
            value={selectedType?.id || ''}
            onChange={(e) => {
              const type = CARBON_EVENT_TYPES.find((t) => t.id === e.target.value);
              setSelectedType(type || null);
            }}
          >
            {CARBON_EVENT_TYPES.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                <Box className="flex items-center gap-2">
                  <span>{type.icon}</span>
                  <span>{type.name}</span>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    className="ml-auto"
                  >
                    {type.baseScore} kg CO₂
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={2}
          />

          {selectedType && (
            <Box className="p-3 bg-gray-50 rounded">
              <Typography variant="subtitle2" gutterBottom>
                Carbon Impact
              </Typography>
              <Typography variant="h6" color="primary">
                {selectedType.baseScore.toFixed(1)} kg CO₂
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          disabled={!selectedType}
        >
          Add Event
        </Button>
      </DialogActions>
    </Dialog>
  );
} 