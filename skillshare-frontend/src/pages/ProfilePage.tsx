import { Container, Typography, Avatar, Box, Paper, Tab, Tabs, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LearningProgressTabs from '../components/learning-progress/LearningProgressTabs';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleViewNotifications = () => {
    navigate(`/profile/${userId}/notifications`);
  };

  const handleViewPosts = () => {
    navigate(`/profile/${userId}/posts`);
  };

  // Mock user data
  const user = {
    id: userId,
    name: 'Alex Johnson',
    email: 'alex@example.com',
    bio: 'Passionate about learning and sharing skills in web development and photography.',
    avatar: '/static/images/avatar/1.jpg',
    skills: ['JavaScript', 'React', 'Photography', 'Cooking']
  };

  // Mock progress data
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar alt={user.name} src={user.avatar} sx={{ width: 100, height: 100, mr: 3 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4">{user.name}</Typography>
            <Typography variant="subtitle1" color="text.secondary">{user.email}</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>{user.bio}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {user.skills.map((skill, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{
                    bgcolor: 'primary.light',
                    color: 'white',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 4
                  }}
                >
                  {skill}
                </Typography>
              ))}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 3 }}>
            <Button
              variant="contained"
              sx={{ textTransform: 'none' }}
              onClick={handleViewNotifications}
            >
              View Notifications
            </Button>
            <Button
              variant="outlined"
              sx={{ textTransform: 'none' }}
              onClick={handleViewPosts}
            >
              View Posts
            </Button>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="profile tabs">
            <Tab label="Progress" />
            <Tab label="Activity" />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <LearningProgressTabs
            completed={progressData.completed}
            ongoing={progressData.ongoing}
            skills={progressData.skills}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Typography variant="h6">Recent Activity</Typography>
          <Typography color="text.secondary">User's recent activity will appear here.</Typography>
        </TabPanel>
      </Box>
    </Container>
  );
}
