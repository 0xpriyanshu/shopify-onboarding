import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  Typography,
  useTheme,
  useMediaQuery,
  Avatar,
  LinearProgress,
  Divider,
  alpha,
  Button,
  Tooltip
} from '@mui/material';
import StepPersonal from './StepPersonal';
import StepCompany from './StepCompany';
import StepGoal from './StepGoal';
import StepProductTypes from './StepProductTypes';
import StepperNavigation from './StepperNavigation';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import CategoryIcon from "@mui/icons-material/Category";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ExtensionIcon from "@mui/icons-material/Extension";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

// Orange theme colors
const themeColors = {
  primary: '#FF6B00',
  primaryLight: '#FF8F3C',
  primaryDark: '#E65100',
  secondary: '#FFF3E0',
  headerHighlight: '#FF6B00',
  success: '#4CAF50',
  gradient: 'linear-gradient(135deg, #FF8F3C 0%, #FF6B00 100%)'
};

export interface OnboardingFormValues {
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  monthlyVisitors: string;
  primaryGoal: string;
  productTypes: { [key: string]: boolean };
}

const steps = [
  {
    label: 'Personal Information',
    icon: <PersonIcon />
  },
  {
    label: 'Company Information',
    icon: <BusinessIcon />
  },
  {
    label: 'Primary Goal',
    icon: <TrackChangesIcon />
  },
  {
    label: 'Product Types',
    icon: <CategoryIcon />
  }
];

const Onboarding: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [shop, setShop] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [sellerId, setSellerId] = useState('');
  const [formValues, setFormValues] = useState<OnboardingFormValues>({
    email: '',
    firstName: '',
    lastName: '',
    companyName: '',
    monthlyVisitors: '',
    primaryGoal: '',
    productTypes: {
      jewelry: false,
      medical: false,
      electronics: false,
      auto: false,
      baby: false,
      apparel: false,
      games: false,
      sports: false,
      pets: false,
      arts: false,
      beauty: false,
      health: false,
      home: false,
      toys: false,
      food: false,
      books: false,
      other: false
    }
  });

  // Read shop and accessToken from URL query parameters.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setShop(params.get('shop') || '');
    setAccessToken(params.get('accessToken') || '');
  }, []);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const selectedProductTypes = Object.entries(formValues.productTypes)
      .filter(([key, value]) => value)
      .map(([key]) => key);

    const dataToSend = {
      accessToken,
      storeUrl: shop,
      email: formValues.email,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      companyName: formValues.companyName,
      monthlyVisitors: formValues.monthlyVisitors,
      primaryGoal: formValues.primaryGoal,
      productTypes: selectedProductTypes
    };

    try {
      const res = await fetch('https://aggregator.gobbl.ai/api/shopify/updateStore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      
      if (res.ok) {
        const responseData = await res.json();
        
        // Check if the response has the expected structure
        if (!responseData.error && responseData.result) {
          // Store the sellerId from the response
          setSellerId(responseData.result.sellerId || '');
          localStorage.setItem('sellerId', responseData.result.sellerId || '');
        }
        
        setCompleted(true);
      } else {
        alert('Submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <StepPersonal formValues={formValues} setFormValues={setFormValues} themeColors={themeColors} />;
      case 1:
        return <StepCompany formValues={formValues} setFormValues={setFormValues} themeColors={themeColors} />;
      case 2:
        return <StepGoal formValues={formValues} setFormValues={setFormValues} themeColors={themeColors} />;
      case 3:
        return <StepProductTypes formValues={formValues} setFormValues={setFormValues} themeColors={themeColors} />;
      default:
        return 'Unknown step';
    }
  };

  const progressPercentage = ((activeStep + 1) / steps.length) * 100;

  // Check if current step has required fields filled
  const isStepComplete = () => {
    switch (activeStep) {
      case 0:
        return formValues.email && formValues.firstName && formValues.lastName;
      case 1:
        return formValues.companyName && formValues.monthlyVisitors;
      case 2:
        return formValues.primaryGoal;
      case 3:
        return Object.values(formValues.productTypes).some(value => value);
      default:
        return false;
    }
  };

  // Logo component with custom image
  const Logo = () => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1.5,
      height: 60,
    }}>
      <Box 
        component="img"
        src="https://gobbl-bucket.s3.ap-south-1.amazonaws.com/tapAssets/gobbl_coin.webp"
        alt="Gobbl Logo"
        sx={{
          width: 46,
          height: 46,
          objectFit: 'contain',
          filter: 'drop-shadow(0px 3px 5px rgba(0, 0, 0, 0.25))',
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05) rotate(5deg)'
          }
        }}
      />
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 900, 
          color: themeColors.headerHighlight,
          letterSpacing: '-0.5px',
          textTransform: 'lowercase',
          fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '70%',
            height: '3px',
            backgroundColor: themeColors.primary,
            bottom: -2,
            left: '3%',
            borderRadius: '10px',
            transition: 'width 0.3s ease',
          },
          '&:hover::after': {
            width: '90%',
          }
        }}
      >
        gobbl
      </Typography>
    </Box>
  );

  if (completed) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: themeColors.gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          backgroundImage: `
            linear-gradient(135deg, ${themeColors.primaryLight} 0%, ${themeColors.primary} 100%), 
            url('data:image/svg+xml;charset=utf-8,%3Csvg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="0.1" fill-rule="evenodd"/%3E%3C/svg%3E')
          `,
          backgroundSize: 'cover'
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={10}
            sx={{
              p: 6,
              borderRadius: 3,
              textAlign: 'center',
              backgroundColor: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 15px 50px rgba(0,0,0,0.15), 0 5px 15px rgba(255, 107, 0, 0.1)',
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '5px',
                background: themeColors.gradient
              }
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
              <Logo />
              <Box sx={{ 
                mt: 4, 
                mb: 2,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${alpha(themeColors.success, 0.2)} 0%, rgba(255,255,255,0) 70%)`,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 0,
                  animation: 'pulse 2s infinite'
                }
              }}>
                <Avatar 
                  sx={{ 
                    m: 3, 
                    bgcolor: themeColors.success, 
                    width: 90, 
                    height: 90, 
                    mx: 'auto',
                    boxShadow: `0 5px 15px ${alpha(themeColors.success, 0.3)}`
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 55 }} />
                </Avatar>
              </Box>
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #333333 0%, #1a1a1a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Success!
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'text.secondary', 
                  mb: 3,
                  maxWidth: '80%'
                }}
              >
                Your onboarding information has been submitted successfully.
              </Typography>
              
              {/* Next Steps Instructions */}
              <Box sx={{ width: '100%', maxWidth: '650px', mb: 5 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 3, 
                    color: themeColors.primaryDark,
                    textAlign: 'left',
                    borderBottom: `2px solid ${alpha(themeColors.primary, 0.2)}`,
                    pb: 1
                  }}
                >
                  Next Steps to Enable Your Chatbot
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
                  {/* Step 1 */}
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      flex: 1,
                      borderRadius: 2,
                      borderTop: `3px solid ${themeColors.primary}`,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: alpha(themeColors.primary, 0.1), 
                          color: themeColors.primary,
                          width: 36,
                          height: 36
                        }}
                      >
                        <AdminPanelSettingsIcon />
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight={600}>Go to Admin Dashboard</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                      Log in to your Shopify Admin Dashboard and navigate to the Apps section.
                    </Typography>
                  </Paper>
                  
                  {/* Step 2 */}
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      flex: 1,
                      borderRadius: 2,
                      borderTop: `3px solid ${themeColors.primary}`,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1.5 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: alpha(themeColors.primary, 0.1), 
                          color: themeColors.primary,
                          width: 36,
                          height: 36
                        }}
                      >
                        <ExtensionIcon />
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight={600}>Enable Gobbl AI Chatbot</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
                      In App Embeds section, find and enable the Gobbl AI Chatbot for your store.
                    </Typography>
                  </Paper>
                </Box>
                
                {/* Step 3 - Highlighted */}
                <Paper
                  elevation={4}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    mb: 3,
                    background: `linear-gradient(to right, ${alpha(themeColors.secondary, 0.7)}, ${alpha(themeColors.secondary, 0.3)})`,
                    borderLeft: `4px solid ${themeColors.primary}`,
                    boxShadow: `0 5px 15px ${alpha(themeColors.primary, 0.1)}`
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: themeColors.primary, 
                        color: 'white',
                        width: 44,
                        height: 44,
                        mt: 0.5
                      }}
                    >
                      <SettingsIcon />
                    </Avatar>
                    <Box sx={{ flex: 1, textAlign: 'left' }}>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                        Customize Your Chatbot
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        After enabling the chatbot, you'll see a "Customize Chatbot" button on the frontend of your store. 
                        Click this button to go to your dashboard where you can personalize your chatbot's appearance and behavior.
                      </Typography>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          gap: 1, 
                          alignItems: 'center',
                          color: themeColors.primaryDark
                        }}
                      >
                        <InfoIcon sx={{ fontSize: 18 }} />
                        <Typography variant="body2" fontStyle="italic">
                          The customization dashboard gives you complete control over your AI chatbot experience.
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
                
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowRightAltIcon />}
                  sx={{
                    mt: 2,
                    mb: 1,
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    background: themeColors.gradient,
                    fontWeight: 600,
                    boxShadow: '0 6px 12px rgba(255, 107, 0, 0.2)',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      background: themeColors.gradient,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 16px rgba(255, 107, 0, 0.3)',
                    }
                  }}
                >
                  Go to Shopify Dashboard
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Need help? Contact our support team
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: themeColors.gradient,
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        backgroundImage: `
          linear-gradient(135deg, ${themeColors.primaryLight} 0%, ${themeColors.primary} 100%), 
          url('data:image/svg+xml;charset=utf-8,%3Csvg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="0.1" fill-rule="evenodd"/%3E%3C/svg%3E')
        `,
        backgroundSize: 'cover'
      }}
    >
      <Container maxWidth="lg" sx={{ width: '100%' }}>
        <Paper
          elevation={isTablet ? 4 : 10}
          sx={{
            borderRadius: 4,
            width: '100%',
            mx: 'auto',
            backgroundColor: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(8px)',
            boxShadow: isTablet 
              ? '0 8px 30px rgba(0,0,0,0.12)' 
              : '0 25px 50px rgba(0,0,0,0.1), 0 10px 24px rgba(255, 107, 0, 0.1)',
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' }
          }}
        >
          {/* Left sidebar for larger screens */}
          {!isTablet && (
            <Box
              sx={{
                width: '280px',
                flexShrink: 0,
                p: 4,
                pt: 5,
                background: 'linear-gradient(180deg, rgba(255, 107, 0, 0.03) 0%, rgba(255, 107, 0, 0.08) 100%)',
                display: 'flex',
                flexDirection: 'column',
                borderRight: '1px solid',
                borderColor: 'rgba(0, 0, 0, 0.05)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '3px',
                  height: '100%',
                  background: themeColors.gradient
                }
              }}
            >
              <Logo />

              <Box sx={{ mt: 6, mb: 4 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 1,
                    color: '#333'
                  }}
                >
                  Store Setup
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Complete these steps to configure your store experience
                </Typography>
                
                <LinearProgress 
                  variant="determinate" 
                  value={progressPercentage} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    mb: 1,
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      background: themeColors.gradient,
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {Math.round(progressPercentage)}% complete
                </Typography>
              </Box>

              <Box sx={{ flex: 1 }}>
                {steps.map((step, index) => (
                  <Box 
                    key={step.label}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 1.5,
                      mb: 1,
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: activeStep === index ? `${themeColors.primary}15` : 'transparent',
                      borderLeft: '3px solid',
                      borderLeftColor: activeStep === index 
                        ? themeColors.primary 
                        : index < activeStep 
                          ? themeColors.success 
                          : 'transparent',
                      '&:hover': {
                        backgroundColor: activeStep !== index ? 'rgba(0,0,0,0.03)' : `${themeColors.primary}15`,
                      }
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32,
                        bgcolor: index < activeStep 
                          ? themeColors.success 
                          : index === activeStep 
                            ? themeColors.primary 
                            : 'rgba(0,0,0,0.08)',
                        color: '#fff',
                        mr: 2,
                        transition: 'all 0.3s',
                      }}
                    >
                      {index < activeStep ? <CheckCircleIcon sx={{ fontSize: 18 }} /> : step.icon}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: index === activeStep ? 600 : 400,
                          color: index === activeStep ? themeColors.primaryDark : 'text.secondary',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {step.label}
                        {index === activeStep && (
                          <ArrowForwardIcon 
                            sx={{ 
                              ml: 'auto', 
                              fontSize: 16, 
                              color: themeColors.primary,
                              opacity: 0.8
                            }} 
                          />
                        )}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Box 
                sx={{ 
                  mt: 'auto', 
                  pt: 3,
                  borderTop: '1px solid rgba(0,0,0,0.06)',
                  textAlign: 'center'
                }}
              >
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                  Need help setting up?
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: themeColors.primary, 
                    fontWeight: 500,
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Contact Support
                </Typography>
              </Box>
            </Box>
          )}

          {/* Main content area */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 3, sm: 4, md: 5 },
              pt: { xs: 3, sm: 3, md: 4 },
              position: 'relative'
            }}
          >
            {isSubmitting && (
              <LinearProgress 
                sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%',
                  height: 4,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: themeColors.primary
                  }
                }} 
              />
            )}
            
            {/* Mobile/Tablet header */}
            {isTablet && (
              <>
                <Box sx={{ 
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 2
                }}>
                  <Logo />
                  
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round(progressPercentage)}% complete
                    </Typography>
                    <Box sx={{ 
                      width: 60,
                      ml: 1
                    }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={progressPercentage} 
                        sx={{ 
                          height: 4, 
                          borderRadius: 2,
                          backgroundColor: 'rgba(0,0,0,0.05)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 2,
                            background: themeColors.gradient
                          }
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
                
                <Divider sx={{ mb: 4 }} />
                
                {/* Mobile/Tablet stepper */}
                <Stepper 
                  activeStep={activeStep} 
                  alternativeLabel={!isMobile}
                  orientation={isMobile ? 'vertical' : 'horizontal'}
                  sx={{ 
                    mb: 4,
                    '& .MuiStepConnector-line': {
                      borderColor: 'rgba(0,0,0,0.1)'
                    },
                    '& .MuiStepIcon-root': {
                      color: 'rgba(0,0,0,0.1)',
                      '&.Mui-active': {
                        color: themeColors.primary,
                      },
                      '&.Mui-completed': {
                        color: themeColors.success,
                      }
                    }
                  }}
                >
                  {steps.map((step, index) => (
                    <Step key={step.label}>
                      <StepLabel
                        StepIconComponent={() => (
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32,
                              bgcolor: index < activeStep 
                                ? themeColors.success 
                                : index === activeStep 
                                  ? themeColors.primary 
                                  : 'rgba(0,0,0,0.08)',
                              color: '#fff',
                              boxShadow: index === activeStep ? '0 2px 5px rgba(255, 107, 0, 0.3)' : 'none'
                            }}
                          >
                            {index < activeStep ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : React.cloneElement(step.icon, { fontSize: 'small' })}
                          </Avatar>
                        )}
                      >
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontWeight: index === activeStep ? 600 : 400,
                            color: index === activeStep ? themeColors.primaryDark : 'text.secondary'
                          }}
                        >
                          {step.label}
                        </Typography>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </>
            )}

            {/* Page title - desktop and mobile */}
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700, 
                  color: '#333',
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: '60px',
                    height: '4px',
                    background: themeColors.gradient,
                    borderRadius: '2px',
                    bottom: '-8px',
                    left: '0'
                  }
                }}
              >
                {steps[activeStep].label}
              </Typography>
              
              <Typography 
                variant="subtitle1" 
                color="text.secondary"
                sx={{ 
                  mt: 2,
                  maxWidth: '90%'
                }}
              >
                {activeStep === 0 && "Tell us about yourself so we can personalize your experience."}
                {activeStep === 1 && "Let's gather some information about your business."}
                {activeStep === 2 && "Help us understand what you're trying to achieve."}
                {activeStep === 3 && "Select the product categories you offer in your store."}
              </Typography>
            </Box>

            {/* Form content */}
            <Box 
              sx={{ 
                mb: 3,
                p: { sm: 2 },
                bgcolor: 'rgba(255, 255, 255, 0.5)',
                borderRadius: 2,
                boxShadow: isTablet ? 'none' : 'inset 0 1px 8px rgba(0,0,0,0.02)'
              }}
            >
              {getStepContent(activeStep)}
            </Box>
            
            <StepperNavigation
              activeStep={activeStep}
              steps={steps.map(s => s.label)}
              handleBack={handleBack}
              handleNext={handleNext}
              handleSubmit={handleSubmit}
              disableNext={!isStepComplete()}
              isSubmitting={isSubmitting}
              themeColors={themeColors}
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Onboarding;