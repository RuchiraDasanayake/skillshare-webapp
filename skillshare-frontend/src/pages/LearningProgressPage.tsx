// src/pages/LearningProgressPage.tsx
import { Container, Typography, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import LearningProgressTabs from '../components/learning-progress/LearningProgressTabs';
import { getUserLearningPlans } from '../api/progressApi';

export default function LearningProgressPage() {
  const [progressData, setProgressData] = useState({
    completed: [],
    ongoing: [],
    skills: [],
  });

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        // Replace with your actual user ID
        const userId = 1; 
        const data = await getUserLearningPlans(userId);
        
        setProgressData({
          completed: data.filter((item: any) => item.type === 'COMPLETED_TUTORIAL'),
          ongoing: data.filter((item: any) => item.type === 'ONGOING_TUTORIAL'),
          skills: Array.from(new Set(data.flatMap((item: any) => item.skillsLearned?.split(',') || [])))
        });
      } catch (error) {
        console.error('Error fetching progress data:', error);
      }
    };

    fetchProgressData();
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