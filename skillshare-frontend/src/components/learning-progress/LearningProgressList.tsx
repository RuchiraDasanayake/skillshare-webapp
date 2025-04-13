import { Container, Typography, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import LearningProgressTabs from '../learning-progress/LearningProgressTabs';
import { useUser } from '../../context/UserContext'; // import the context

export default function LearningProgressPage() {
  const { userId } = useUser(); // Get the logged-in user's ID from context
  const [progressData, setProgressData] = useState({
    completed: [],
    ongoing: [],
    skills: [],
  });

  useEffect(() => {
    if (!userId) return; // If there's no userId, don't fetch any data
    
    // Fetch the user's learning progress data from an API or simulate it
    const fetchProgressData = async () => {
      try {
        // Simulated fetch from an API using the userId
        const response = await fetch(`/api/progress/${userId}`);
        const data = await response.json();
        
        setProgressData({
          completed: data.completed,
          ongoing: data.ongoing,
          skills: data.skills,
        });
      } catch (error) {
        console.error('Error fetching progress data:', error);
      }
    };

    fetchProgressData();
  }, [userId]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Learning Progress
      </Typography>
      <LearningProgressTabs {...progressData} />
    </Container>
  );
}
