// src/components/learning-progress/LearningProgressTabs.tsx
import { Tabs, Tab, Box, Typography, LinearProgress, Button } from '@mui/material';
import { useState } from 'react';
import CompletedTutorialCard from './CompletedTutorialCard';

interface Props {
  completed: any[];
  ongoing: any[];
  skills: string[];
}

export default function LearningProgressTabs({ completed, ongoing, skills }: Props) {
  const [value, setValue] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Tabs value={value} onChange={handleChange} sx={{ mb: 3 }}>
        <Tab label="Completed Tutorials" />
        <Tab label="Ongoing Tutorials" />
        <Tab label="New Skills" />
        <Tab label="Learning Milestones" />
      </Tabs>

      {value === 0 && (
        <Box>
          {completed.map(t => (
            <CompletedTutorialCard key={t.id} tutorial={t} />
          ))}
        </Box>
      )}

      {value === 1 && (
        <Box>
          {ongoing.map(course => (
            <Box key={course.id} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">{course.courseName}</Typography>
              <LinearProgress variant="determinate" value={course.progress} />
              <Button variant="outlined" sx={{ mt: 1 }}>
                Continue Course
              </Button>
            </Box>
          ))}
        </Box>
      )}

      {value === 2 && (
        <Box>
          {skills.map((skill, index) => (
            <Typography key={index} variant="body1">✅ {skill}</Typography>
          ))}
        </Box>
      )}

      {value === 3 && (
        <Box>
          <Typography variant="body1" color="text.secondary">
            Coming soon: Track your biggest learning milestones!
          </Typography>
        </Box>
      )}
    </Box>
  );
}
