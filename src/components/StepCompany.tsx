import React from 'react';
import { 
  Box, 
  TextField, 
  FormControl, 
  FormLabel, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Typography, 
  Paper,
  InputAdornment,
  Grid,
  Divider
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { OnboardingFormValues } from './Onboarding';

interface StepCompanyProps {
  formValues: OnboardingFormValues;
  setFormValues: React.Dispatch<React.SetStateAction<OnboardingFormValues>>;
  themeColors?: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
  };
}

const StepCompany: React.FC<StepCompanyProps> = ({ 
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
        About Your Company
      </Typography>
      
      <Typography variant="body2" paragraph color="text.secondary">
        This information helps us tailor our platform to your business needs.
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
        <TextField
          fullWidth
          required
          label="Company Name"
          name="companyName"
          value={formValues.companyName}
          onChange={handleChange}
          variant="outlined"
          placeholder="Your Business Ltd."
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BusinessIcon sx={{ color: `${themeColors.primary}99` }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 3,
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
          helperText={!formValues.companyName ? "Company name is required" : ""}
          error={!formValues.companyName}
        />
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ mt: 2 }}>
          <FormControl component="fieldset" required fullWidth>
            <FormLabel component="legend" sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'text.primary', fontWeight: 500 }}>
              <PeopleAltIcon sx={{ mr: 1, color: `${themeColors.primary}99` }} />
              Monthly Website Visitors
            </FormLabel>
            
            <RadioGroup
              name="monthlyVisitors"
              value={formValues.monthlyVisitors}
              onChange={handleChange}
            >
              <Grid container spacing={1}>
                {[
                  "Below 10,000",
                  "10,000 - 25,000",
                  "25,000 - 50,000",
                  "50,000 - 100,000",
                  "100,000 - 200,000",
                  "Above 200,000"
                ].map((option) => (
                  <Grid item xs={12} sm={6} key={option}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1,
                        border: formValues.monthlyVisitors === option 
                          ? `2px solid ${themeColors.primary}` 
                          : '1px solid rgba(0, 0, 0, 0.12)',
                        borderRadius: 1,
                        backgroundColor: formValues.monthlyVisitors === option 
                          ? `${themeColors.primary}10` 
                          : 'transparent',
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: formValues.monthlyVisitors === option 
                            ? `${themeColors.primary}15` 
                            : 'rgba(0, 0, 0, 0.03)',
                          borderColor: formValues.monthlyVisitors === option 
                            ? themeColors.primary 
                            : 'rgba(0, 0, 0, 0.2)'
                        }
                      }}
                    >
                      <FormControlLabel
                        value={option}
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
                        label={option}
                        sx={{ 
                          width: '100%',
                          m: 0,
                          '.MuiFormControlLabel-label': {
                            fontWeight: formValues.monthlyVisitors === option ? 500 : 400,
                            color: formValues.monthlyVisitors === option ? themeColors.primaryDark : 'inherit',
                          }
                        }}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </RadioGroup>
            
            {!formValues.monthlyVisitors && (
              <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                Please select your monthly visitor range
              </Typography>
            )}
          </FormControl>
        </Box>
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

export default StepCompany;