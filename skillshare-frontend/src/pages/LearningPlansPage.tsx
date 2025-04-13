import { Container, Typography, Button, Box, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { getUserLearningPlans } from '../api/progressApi';
import LearningPlanList from '../components/learning-plans/LearningPlanList';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

export default function LearningPlansPage() {
  const [learningPlans, setLearningPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLearningPlans = async () => {
      try {
        const userId = 1; // Replace with actual user ID from auth context
        const plans = await getUserLearningPlans(userId);
        setLearningPlans(plans);
      } catch (error) {
        console.error('Error fetching learning plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPlans();
  }, []);

  const handleCreateNewPlan = () => {
    navigate('/plans/new');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          My Learning Plans
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateNewPlan}
          sx={{ textTransform: 'none' }}
        >
          Create New Plan
        </Button>
      </Box>

      {learningPlans.length > 0 ? (
        <LearningPlanList plans={learningPlans} />
      ) : (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '300px',
          textAlign: 'center',
          p: 4,
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 2
        }}>
          <Typography variant="h6" gutterBottom>
            No learning plans yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Create your first learning plan to track your skill development
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateNewPlan}
            sx={{ textTransform: 'none' }}
          >
            Create Plan
          </Button>
        </Box>
      )}
    </Container>
  );
}