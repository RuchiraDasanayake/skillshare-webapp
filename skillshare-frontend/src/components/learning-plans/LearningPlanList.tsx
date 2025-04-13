import { List, ListItem, ListItemText, Divider, Chip, IconButton, Box, Typography } from '@mui/material';
import React from 'react';
import { LearningPlanDTO } from '../../types';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { format } from 'date-fns';

interface LearningPlanListProps {
  plans: LearningPlanDTO[];
}

export default function LearningPlanList({ plans }: LearningPlanListProps) {
  return (
    <List>
      {plans.map((plan, index) => (
        <React.Fragment key={plan.id}>
          <ListItem>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">{plan.title}</Typography>
                <Box>
                  <IconButton aria-label="view">
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton aria-label="edit">
                    <EditIcon />
                  </IconButton>
                </Box>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {plan.description}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Chip 
                  label={`${plan.items.filter(i => i.isCompleted).length}/${plan.items.length} completed`} 
                  size="small" 
                  color="primary"
                />
                <Chip 
                  label={`Start: ${format(new Date(plan.startDate), 'MMM d, yyyy')}`} 
                  size="small" 
                  variant="outlined"
                />
                <Chip 
                  label={`Target: ${format(new Date(plan.targetCompletionDate), 'MMM d, yyyy')}`} 
                  size="small" 
                  variant="outlined"
                />
              </Box>
            </Box>
          </ListItem>
          {index < plans.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  );
}