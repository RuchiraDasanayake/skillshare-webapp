// src/components/learning-progress/CompletedTutorialCard.tsx
import { Card, CardContent, Typography, TextField, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useState } from 'react';

export default function CompletedTutorialCard({ tutorial }: any) {
  const [summary, setSummary] = useState(tutorial.summary || tutorial.description || '');
  const [isEditing, setIsEditing] = useState(!summary);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tempSummary, setTempSummary] = useState(summary);

  const handleSave = async () => {
    await fetch(`http://localhost:8080/api/progress/${tutorial.id}/summary`, {
      method: 'PUT',
      headers: { 'Content-Type': 'text/plain' },
      body: tempSummary
    });
    setSummary(tempSummary);
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setSummary('');
    setTempSummary('');
    setIsEditing(true);
    setShowDeleteConfirm(false);
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6">{tutorial.courseName || tutorial.title}</Typography>
        <Typography>Started: {tutorial.startDate}</Typography>
        <Typography>Completed: {tutorial.completionDate}</Typography>
        <Typography>Skills: {tutorial.skills?.join(', ') || tutorial.skillsLearned}</Typography>

        {isEditing ? (
          <Box mt={2}>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={tempSummary}
              onChange={e => setTempSummary(e.target.value)}
              placeholder="Add a summary of what you learned..."
            />
            <Button variant="contained" onClick={handleSave} sx={{ mt: 1 }}>
              Save Summary
            </Button>
          </Box>
        ) : (
          <Box mt={2}>
            <Typography variant="body1"><strong>Summary:</strong> {summary}</Typography>
            <Box mt={1}>
              <Button onClick={() => setIsEditing(true)}>Update</Button>
              <Button color="error" onClick={handleDelete}>Delete</Button>
            </Box>
          </Box>
        )}

        <Dialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
          <DialogTitle>Delete Summary?</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this summary?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteConfirm(false)}>No</Button>
            <Button onClick={confirmDelete} color="error">Yes</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}
