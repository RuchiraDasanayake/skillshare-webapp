import { Container, Typography, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import LearningProgressTabs from '../components/learning-progress/LearningProgressTabs';

export default function LearningProgressPage() {
  interface ProgressData {
    completed: {
      id: number;
      courseName: string;
      startDate: string;
      completionDate: string;
      skills: string[];
      summary: string;
    }[];
    ongoing: {
      id: number;
      courseName: string;
      progress: number;
    }[];
    skills: string[];
  }

  const [progressData, setProgressData] = useState<ProgressData>({
    completed: [],
    ongoing: [],
    skills: [],
  });

  useEffect(() => {
    // Mock data
    setProgressData({
      completed: [
        {
          id: 1,
          courseName: 'JavaScript Basics',
          startDate: '2025-02-20',
          completionDate: '2025-03-20',
          skills: ['Arrow Functions', 'Promises'],
          summary: ''
        }
      ],
      ongoing: [
        { id: 2, courseName: 'React Intermediate', progress: 60 },
        { id: 3, courseName: 'TypeScript Fundamentals', progress: 30 }
      ],
      skills: ['State Management', 'Type Annotations']
    });
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Learning Progress
      </Typography>
      <LearningProgressTabs {...progressData} />
    </Container>
  );
}
