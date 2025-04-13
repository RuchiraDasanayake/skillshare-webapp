import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Checkbox, FormControlLabel } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers';
import { LearningPlanDTO, LearningPlanItemDTO } from '../types';

interface LearningPlanFormProps {
    userId: number;
    onSubmit: (plan: LearningPlanDTO) => void;
    initialData?: LearningPlanDTO;
}

const LearningPlanForm: React.FC<LearningPlanFormProps> = ({ userId, onSubmit, initialData }) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [startDate, setStartDate] = useState<Date | null>(initialData?.startDate ? new Date(initialData.startDate) : null);
    const [targetDate, setTargetDate] = useState<Date | null>(initialData?.targetCompletionDate ? new Date(initialData.targetCompletionDate) : null);
    const [isPublic, setIsPublic] = useState(initialData?.isPublic || false);
    const [items, setItems] = useState<LearningPlanItemDTO[]>(initialData?.items || []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const planDTO: LearningPlanDTO = {
            userId,
            title,
            description,
            startDate: startDate ? startDate.toISOString().split('T')[0] : '',
            targetCompletionDate: targetDate ? targetDate.toISOString().split('T')[0] : '',
            isPublic,
            items
        };
        
        onSubmit(planDTO);
    };

    const addNewItem = () => {
        setItems([...items, {
            title: '',
            description: '',
            resourceUrl: '',
            completionPercentage: 0,
            isCompleted: false
        }]);
    };

    const updateItem = (index: number, field: keyof LearningPlanItemDTO, value: any) => {
        const updatedItems = [...items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setItems(updatedItems);
    };

    const removeItem = (index: number) => {
        const updatedItems = [...items];
        updatedItems.splice(index, 1);
        setItems(updatedItems);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                {initialData ? 'Edit Learning Plan' : 'Create New Learning Plan'}
            </Typography>
            
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Plan Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </Grid>
                
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        rows={3}
                    />
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={setStartDate}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <DatePicker
                        label="Target Completion Date"
                        value={targetDate}
                        onChange={setTargetDate}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                </Grid>
                
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Checkbox 
                                checked={isPublic} 
                                onChange={(e) => setIsPublic(e.target.checked)} 
                            />
                        }
                        label="Make this plan public (visible to others)"
                    />
                </Grid>
                
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        Learning Items
                    </Typography>
                    
                    {items.map((item, index) => (
                        <Box key={index} sx={{ 
                            p: 2, 
                            mb: 2, 
                            border: '1px solid', 
                            borderColor: 'divider',
                            borderRadius: 1
                        }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Item Title"
                                        value={item.title}
                                        onChange={(e) => updateItem(index, 'title', e.target.value)}
                                        required
                                    />
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        value={item.description}
                                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                                        multiline
                                        rows={2}
                                    />
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Resource URL"
                                        value={item.resourceUrl}
                                        onChange={(e) => updateItem(index, 'resourceUrl', e.target.value)}
                                        placeholder="Link to course, book, etc."
                                    />
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <Button 
                                        variant="outlined" 
                                        color="error"
                                        onClick={() => removeItem(index)}
                                    >
                                        Remove Item
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    ))}
                    
                    <Button 
                        variant="outlined" 
                        onClick={addNewItem}
                        sx={{ mt: 1 }}
                    >
                        Add Learning Item
                    </Button>
                </Grid>
                
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">
                        {initialData ? 'Update Plan' : 'Create Plan'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LearningPlanForm;