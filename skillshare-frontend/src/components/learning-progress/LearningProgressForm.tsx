// src/components/learning-progress/LearningProgressForm.tsx
import React, { useState } from 'react';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography
} from '@mui/material';

interface LearningProgressFormProps {
  userId: number;
  onSubmit: (progress: {
    skill: string;
    progressTitle: string;
    description: string;
    resourcesUsed: string;
    completionPercentage: number;
  }) => void;
  initialData?: {
    skill: string;
    progressTitle: string;
    description: string;
    resourcesUsed: string;
    completionPercentage: number;
  };
}

const LearningProgressForm: React.FC<LearningProgressFormProps> = ({
  userId,
  onSubmit,
  initialData
}) => {
  const [skill, setSkill] = useState(initialData?.skill || '');
  const [progressTitle, setProgressTitle] = useState(initialData?.progressTitle || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [resourcesUsed, setResourcesUsed] = useState(initialData?.resourcesUsed || '');
  const [completionPercentage, setCompletionPercentage] = useState(initialData?.completionPercentage || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      skill,
      progressTitle,
      description,
      resourcesUsed,
      completionPercentage
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        {initialData ? 'Update Progress' : 'Add New Progress'}
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel id="skill-label">Skill</InputLabel>
        <Select
          labelId="skill-label"
          value={skill}
          onChange={(e) => setSkill(e.target.value as string)}
          label="Skill"
          required
        >
          <MenuItem value="Coding">Coding</MenuItem>
          <MenuItem value="Cooking">Cooking</MenuItem>
          <MenuItem value="Photography">Photography</MenuItem>
          <MenuItem value="DIY Crafts">DIY Crafts</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        margin="normal"
        label="Progress Title"
        value={progressTitle}
        onChange={(e) => setProgressTitle(e.target.value)}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={4}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        label="Resources Used (comma separated)"
        value={resourcesUsed}
        onChange={(e) => setResourcesUsed(e.target.value)}
        placeholder="e.g., Online course, Book, Tutorial"
      />

      <FormControl fullWidth margin="normal">
        <InputLabel id="completion-label">Completion Percentage</InputLabel>
        <Select
          labelId="completion-label"
          value={completionPercentage}
          onChange={(e) => setCompletionPercentage(e.target.value as number)}
          label="Completion Percentage"
          required
        >
          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((value) => (
            <MenuItem key={value} value={value}>{value}%</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        {initialData ? 'Update Progress' : 'Add Progress'}
      </Button>
    </Box>
  );
};

export default LearningProgressForm;
