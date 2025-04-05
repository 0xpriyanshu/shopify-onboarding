import React from 'react';
import { Box, Button, CircularProgress, alpha } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';

interface StepperNavigationProps {
  activeStep: number;
  steps: string[];
  handleBack: () => void;
  handleNext: () => void;
  handleSubmit: () => void;
  disableNext?: boolean;
  isSubmitting?: boolean;
  themeColors?: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    success: string;
  };
}

const StepperNavigation: React.FC<StepperNavigationProps> = ({
  activeStep,
  steps,
  handleBack,
  handleNext,
  handleSubmit,
  disableNext = false,
  isSubmitting = false,
  themeColors = {
    primary: '#FF6B00',
    primaryLight: '#FF8F3C',
    primaryDark: '#E65100',
    secondary: '#FFF3E0',
    success: '#4CAF50'
  }
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      mt: 4,
      mb: 1,
      px: { xs: 1, sm: 0 }
    }}>
      <Button
        variant="outlined"
        disabled={activeStep === 0 || isSubmitting}
        onClick={handleBack}
        startIcon={<ArrowBackIcon />}
        sx={{
          borderRadius: '30px',
          py: 1.2,
          px: 3,
          borderColor: 'rgba(0, 0, 0, 0.12)',
          color: themeColors.primaryDark,
          boxShadow: 'none',
          backgroundColor: 'transparent',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: themeColors.primary,
            backgroundColor: alpha(themeColors.primary, 0.05),
            boxShadow: '0 3px 8px rgba(0,0,0,0.05)',
          },
          '&.Mui-disabled': {
            borderColor: 'rgba(0, 0, 0, 0.08)',
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
          }
        }}
      >
        Back
      </Button>
      
      {activeStep === steps.length - 1 ? (
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={disableNext || isSubmitting}
          endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <CheckIcon />}
          sx={{
            borderRadius: '30px',
            py: 1.2,
            px: 4,
            fontWeight: 600,
            background: themeColors.success,
            transition: 'all 0.3s ease',
            boxShadow: `0 4px 10px ${alpha(themeColors.success, 0.3)}`,
            '&:hover': {
              background: '#43a047',
              boxShadow: `0 6px 15px ${alpha(themeColors.success, 0.4)}`,
              transform: 'translateY(-2px)'
            },
            '&.Mui-disabled': {
              backgroundColor: alpha(themeColors.success, 0.6),
              color: 'white'
            }
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Complete Setup'}
        </Button>
      ) : (
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={disableNext || isSubmitting}
          endIcon={<ArrowForwardIcon />}
          sx={{
            borderRadius: '30px',
            py: 1.2,
            px: 3,
            fontWeight: 600,
            background: themeColors.gradient,
            boxShadow: `0 4px 10px ${alpha(themeColors.primary, 0.3)}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: `0 6px 15px ${alpha(themeColors.primary, 0.4)}`,
              transform: 'translateY(-2px)'
            },
            '&.Mui-disabled': {
              background: alpha(themeColors.primary, 0.6),
              color: 'white'
            }
          }}
        >
          Continue
        </Button>
      )}
    </Box>
  );
};

export default StepperNavigation;