import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  LinearProgress,
  useMediaQuery,
  useTheme,
  Divider,
  Button,
  alpha,
  Card,
  CardContent,
  styled,
  Tab,
  Tabs
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LogoSection from './DashboardSections/LogoSection';
import StoreTitle from './DashboardSections/StoreTitle';
import ThemeColorPicker from './DashboardSections/ThemeColorPicker';
import PromptGenerator from './DashboardSections/PromptGenerator';
import LoaderTextGenerator from './DashboardSections/LoaderTextGenerator';

// Default theme colors
const themeColors = {
  primary: '#FF6B00',
  primaryLight: '#FF8F3C',
  primaryDark: '#E65100',
  secondary: '#FFF3E0',
  headerHighlight: '#FF6B00',
  success: '#4CAF50',
  gradient: 'linear-gradient(135deg, #FF8F3C 0%, #FF6B00 100%)'
};

// Styled components
const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.5rem',
  marginBottom: theme.spacing(1),
  color: themeColors.primaryDark,
  position: 'relative',
  display: 'inline-block',
  paddingBottom: theme.spacing(1),
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '60px',
    height: '3px',
    background: themeColors.gradient,
    borderRadius: '2px',
    bottom: '0',
    left: '0'
  }
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  overflow: 'hidden',
  height: '100%',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.12)'
  },
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '4px',
    background: themeColors.gradient
  }
}));

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState(0);
  
  // New state for sellerId (retrieved from onboarding.tsx)
  const [sellerId, setSellerId] = useState<string>('');

  // Retrieve sellerId from persistent storage (e.g., localStorage)
  useEffect(() => {
    const storedSellerId = localStorage.getItem('sellerId');
    if (storedSellerId) {
      setSellerId(storedSellerId);
    }
  }, []);

  // Store data
  const [storeData, setStoreData] = useState({
    id: '',
    name: '',
    logo: null as string | null,
    themeColor: '#FF6B00',
    prompts: [] as string[],
    loaderTexts: [] as string[]
  });
  
  useEffect(() => {
    // Fetch store data
    const fetchStoreData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        const mockData = {
          id: sellerId || 'store_123456',
          name: 'My Awesome Store',
          logo: null,
          themeColor: '#FF6B00',
          prompts: [],
          loaderTexts: []
        };
        
        setStoreData(mockData);
      } catch (error) {
        console.error('Error fetching store data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreData();
  }, []);

  // Update store data handlers
  const handleStoreNameUpdate = (name: string) => {
    setStoreData(prev => ({ ...prev, name }));
  };
  
  const handleLogoUpdate = (logo: string | null) => {
    setStoreData(prev => ({ ...prev, logo }));
  };
  
  const handleColorUpdate = (color: string) => {
    setStoreData(prev => ({ ...prev, themeColor: color }));
  };
  
  const handlePromptsUpdate = (prompts: string[]) => {
    setStoreData(prev => ({ ...prev, prompts }));
  };
  
  const handleLoaderTextsUpdate = (loaderTexts: string[]) => {
    setStoreData(prev => ({ ...prev, loaderTexts }));
  };
  
  const handleStartOnboarding = () => {
    navigate('/onboarding');
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Logo component
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f5f5f7 0%, #ffffff 100%)',
        backgroundAttachment: 'fixed',
        pt: 4,
        pb: 8
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Logo />
          
          <Button
            variant="contained"
            onClick={handleStartOnboarding}
            sx={{
              borderRadius: '30px',
              py: 1,
              px: 3,
              fontWeight: 600,
              background: themeColors.gradient,
              boxShadow: `0 4px 10px ${alpha(themeColors.primary, 0.3)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: `0 6px 15px ${alpha(themeColors.primary, 0.4)}`,
                transform: 'translateY(-2px)'
              }
            }}
          >
            Go to Onboarding
          </Button>
        </Box>
        
        {isLoading ? (
          <Paper 
            elevation={0}
            sx={{ 
              p: 5, 
              borderRadius: 3,
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}
          >
            <LinearProgress 
              sx={{ 
                height: 6, 
                borderRadius: 3,
                mb: 2,
                '& .MuiLinearProgress-bar': {
                  background: themeColors.gradient,
                }
              }}
            />
            <Typography variant="body1" color="text.secondary">
              Loading store information...
            </Typography>
          </Paper>
        ) : (
          <>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                backgroundColor: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                mb: 4,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  background: themeColors.gradient
                }
              }}
            >
              {/* Updated header to include seller ID if present */}
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom 
                sx={{ fontWeight: 700, color: '#333' }}
              >
                Store Settings {sellerId && `(${sellerId})`}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Customize your store's appearance and content
              </Typography>
              
              <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs 
                  value={activeTab} 
                  onChange={handleTabChange}
                  variant={isTablet ? "scrollable" : "standard"}
                  scrollButtons={isTablet ? "auto" : undefined}
                  sx={{
                    '& .MuiTab-root': { fontWeight: 600 },
                    '& .Mui-selected': { color: themeColors.primary },
                    '& .MuiTabs-indicator': { backgroundColor: themeColors.primary }
                  }}
                >
                  <Tab label="Store Information" />
                  <Tab label="Theme Settings" />
                  <Tab label="Content Generation" />
                </Tabs>
              </Box>
              
              {/* Store Information Tab */}
              {activeTab === 0 && (
                <Grid container spacing={3}>
                  <Grid {...{ component: "div", item: true, xs: 12, md: 6 }}>
                    <StyledCard>
                      <CardContent sx={{ p: 3 }}>
                        <SectionTitle>Store Name</SectionTitle>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          Set the name of your store as it will appear to customers
                        </Typography>
                        <StoreTitle 
                          storeName={storeData.name} 
                          onUpdate={handleStoreNameUpdate} 
                          storeId={storeData.id}
                          themeColors={themeColors}
                        />
                      </CardContent>
                    </StyledCard>
                  </Grid>
                  
                  <Grid {...{ component: "div", item: true, xs: 12, md: 6 }}>
                    <StyledCard>
                      <CardContent sx={{ p: 3 }}>
                        <SectionTitle>Store Logo</SectionTitle>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          Upload your store logo for brand recognition
                        </Typography>
                        <LogoSection 
                          currentLogo={storeData.logo} 
                          onUpdate={handleLogoUpdate} 
                          storeId={storeData.id}
                          themeColors={themeColors}
                        />
                      </CardContent>
                    </StyledCard>
                  </Grid>
                </Grid>
              )}
              
              {/* Theme Settings Tab */}
              {activeTab === 1 && (
                <Grid container spacing={3}>
                  <Grid {...{ component: "div", item: true, xs: 12}}>
                    <StyledCard>
                      <CardContent sx={{ p: 3 }}>
                        <SectionTitle>Theme Color</SectionTitle>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          Select a primary color for your store's theme
                        </Typography>
                        <ThemeColorPicker 
                          currentColor={storeData.themeColor} 
                          onUpdate={handleColorUpdate} 
                          storeId={storeData.id}
                          themeColors={themeColors}
                        />
                      </CardContent>
                    </StyledCard>
                  </Grid>
                </Grid>
              )}
              
              {/* Content Generation Tab */}
              {activeTab === 2 && (
                <Grid container spacing={3}>
                  <Grid {...{ component: "div", item: true, xs: 12}}>
                    <StyledCard>
                      <CardContent sx={{ p: 3 }}>
                        <SectionTitle>Prompt Generator</SectionTitle>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          Generate and edit custom prompts for your store
                        </Typography>
                        <PromptGenerator 
                          currentPrompts={storeData.prompts} 
                          onUpdate={handlePromptsUpdate} 
                          storeId={storeData.id}
                          themeColors={themeColors}
                        />
                      </CardContent>
                    </StyledCard>
                  </Grid>
                  
                  <Grid {...{ component: 'div', item: true, xs: 12 }} sx={{ mt: 3 }}>
                    <StyledCard>
                      <CardContent sx={{ p: 3 }}>
                        <SectionTitle>Loader Text Generator</SectionTitle>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          Create engaging messages that display during loading screens
                        </Typography>
                        <LoaderTextGenerator 
                          currentLoaderTexts={storeData.loaderTexts} 
                          onUpdate={handleLoaderTextsUpdate} 
                          storeId={storeData.id}
                          themeColors={themeColors}
                        />
                      </CardContent>
                    </StyledCard>
                  </Grid>
                </Grid>
              )}
            </Paper>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;
