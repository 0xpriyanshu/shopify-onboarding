import React from 'react';
import { 
  Box, 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Typography, 
  Paper,
  Grid,
} from '@mui/material';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { OnboardingFormValues } from './Onboarding';

interface StepGoalProps {
  formValues: OnboardingFormValues;
  setFormValues: React.Dispatch<React.SetStateAction<OnboardingFormValues>>;
  themeColors?: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
  };
}

const StepGoal: React.FC<StepGoalProps> = ({ 
  formValues, 
  setFormValues,
  themeColors = {
    primary: '#FF6B00',
    primaryLight: '#FF8F3C',
    primaryDark: '#E65100',
    secondary: '#FFF3E0'
  }
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const goals = [
    {
      value: "Increase sales",
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      description: "Optimize your store to convert more visitors into paying customers",
    },
    {
      value: "Reduce support tickets",
      icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
      description: "Streamline customer experience to minimize support requests",
    }
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: themeColors.primaryDark, mb: 3 }}>
        Define Your Primary Goal
      </Typography>
      
      <Typography variant="body2" paragraph color="text.secondary">
        What's the main objective you want to achieve with our platform? Your selection will help us tailor your dashboard and recommendations.
      </Typography>
      
      <FormControl component="fieldset" required fullWidth sx={{ mt: 3 }}>
        <FormLabel 
          component="legend" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2, 
            color: 'text.primary',
            fontWeight: 500,
            fontSize: '1rem'
          }}
        >
          <TrackChangesIcon sx={{ mr: 1, color: `${themeColors.primary}99` }} />
          Select your primary business goal
        </FormLabel>
        
        <RadioGroup
          name="primaryGoal"
          value={formValues.primaryGoal}
          onChange={handleChange}
        >
          <Grid container spacing={3}>
            {goals.map((goal) => (
              <Grid item xs={12} key={goal.value}>
                <Paper
                  elevation={formValues.primaryGoal === goal.value ? 2 : 0}
                  sx={{
                    p: 3,
                    border: formValues.primaryGoal === goal.value 
                      ? `2px solid ${themeColors.primary}` 
                      : '1px solid rgba(0, 0, 0, 0.12)',
                    borderRadius: 2,
                    backgroundColor: formValues.primaryGoal === goal.value 
                      ? themeColors.secondary
                      : 'rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.2s',
                    display: 'flex',
                    '&:hover': {
                      backgroundColor: formValues.primaryGoal === goal.value 
                        ? themeColors.secondary
                        : 'rgba(0, 0, 0, 0.03)',
                      borderColor: formValues.primaryGoal === goal.value 
                        ? themeColors.primary 
                        : 'rgba(0, 0, 0, 0.2)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      mr: 2, 
                      color: formValues.primaryGoal === goal.value 
                        ? themeColors.primary 
                        : 'rgba(0, 0, 0, 0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {goal.icon}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <FormControlLabel
                      value={goal.value}
                      control={
                        <Radio
                          sx={{
                            color: 'rgba(0, 0, 0, 0.6)',
                            '&.Mui-checked': {
                              color: themeColors.primary,
                            },
                          }}
                        />
                      }
                      label={
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: formValues.primaryGoal === goal.value ? 600 : 500,
                            color: formValues.primaryGoal === goal.value ? themeColors.primaryDark : 'text.primary',
                          }}
                        >
                          {goal.value}
                        </Typography>
                      }
                      sx={{ m: 0 }}
                    />
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ ml: 4 }}
                    >
                      {goal.description}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </RadioGroup>
        
        {!formValues.primaryGoal && (
          <Typography color="error" variant="caption" sx={{ mt: 1 }}>
            Please select your primary goal
          </Typography>
        )}
      </FormControl>
    </Box>
  );
};

export default StepGoal;