import React from 'react';
import { 
  Box, 
  TextField, 
  Typography, 
  InputAdornment,
  Paper,
  Grid
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import { OnboardingFormValues } from './Onboarding';

interface StepPersonalProps {
  formValues: OnboardingFormValues;
  setFormValues: React.Dispatch<React.SetStateAction<OnboardingFormValues>>;
  themeColors?: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
  };
}

const StepPersonal: React.FC<StepPersonalProps> = ({ 
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

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: themeColors.primaryDark, mb: 3 }}>
        Tell us about yourself
      </Typography>
      
      <Typography variant="body2" paragraph color="text.secondary">
        We'll use this information to personalize your experience and keep you updated.
      </Typography>
      
      <Paper
        elevation={0}
        sx={{ 
          p: 3, 
          mt: 2, 
          backgroundColor: themeColors.secondary,
          borderRadius: 2,
          border: '1px solid rgba(0, 0, 0, 0.08)'
        }}
      >
        <Grid container spacing={3} component="div">
          <Grid item xs={12} component="div">
            <TextField
              fullWidth
              required
              label="Email Address"
              name="email"
              type="email"
              value={formValues.email}
              onChange={handleChange}
              variant="outlined"
              placeholder="your@email.com"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: `${themeColors.primary}99` }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: themeColors.primary,
                    borderWidth: '1px',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: themeColors.primary,
                },
              }}
              helperText={!formValues.email ? "Email is required" : ""}
              error={!formValues.email}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} component="div">
            <TextField
              fullWidth
              required
              label="First Name"
              name="firstName"
              value={formValues.firstName}
              onChange={handleChange}
              variant="outlined"
              placeholder="John"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: `${themeColors.primary}99` }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: themeColors.primary,
                    borderWidth: '1px',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: themeColors.primary,
                },
              }}
              helperText={!formValues.firstName ? "First name is required" : ""}
              error={!formValues.firstName}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} component="div">
            <TextField
              fullWidth
              required
              label="Last Name"
              name="lastName"
              value={formValues.lastName}
              onChange={handleChange}
              variant="outlined"
              placeholder="Doe"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: themeColors.primary,
                    borderWidth: '1px',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: themeColors.primary,
                },
              }}
              helperText={!formValues.lastName ? "Last name is required" : ""}
              error={!formValues.lastName}
            />
          </Grid>
        </Grid>
      </Paper>

      <Typography 
        variant="body2" 
        sx={{ mt: 3, fontStyle: 'italic', color: 'text.secondary' }}
      >
        * All fields are required to proceed
      </Typography>
    </Box>
  );
};

export default StepPersonal;
