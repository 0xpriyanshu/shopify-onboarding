import React from 'react';
import { 
  Box, 
  Typography, 
  Divider, 
  Chip, 
  Grid, 
  Paper, 
  alpha 
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

interface SellerInfoProps {
  sellerId: string;
  sellerData: any;
  themeColors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
  };
}

const SellerInfo: React.FC<SellerInfoProps> = ({ sellerId, sellerData, themeColors }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Divider sx={{ mb: 4 }} />
      
      <Grid container spacing={3}>
      <Grid {...{ component: 'div', item: true, xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2,
              backgroundColor: alpha(themeColors.secondary, 0.5),
              border: '1px solid',
              borderColor: alpha(themeColors.primary, 0.1),
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: alpha(themeColors.primary, 0.15),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <VpnKeyIcon sx={{ color: themeColors.primary }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Seller ID
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: themeColors.primaryDark }}>
                {sellerId || 'Not available'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid {...{ component: 'div', item: true, xs: 12, sm: 6, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2,
              backgroundColor: 'white',
              border: '1px solid',
              borderColor: alpha('#000', 0.08),
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: alpha(themeColors.primary, 0.15),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <PersonIcon sx={{ color: themeColors.primary }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Store Name
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {sellerData?.name || 'Not available'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid {...{ component: 'div', item: true, xs: 12, sm: 6, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2,
              backgroundColor: 'white',
              border: '1px solid',
              borderColor: alpha('#000', 0.08),
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: alpha(themeColors.primary, 0.15),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <EmailIcon sx={{ color: themeColors.primary }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Email
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {sellerData?.email || 'Not available'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <Box sx={{ 
        mt: 4, 
        p: 3, 
        borderRadius: 2, 
        backgroundColor: alpha(themeColors.primary, 0.04),
        border: `1px dashed ${alpha(themeColors.primary, 0.3)}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: themeColors.primaryDark }}>
            Onboarding Status
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {sellerData?.hasCompletedOnboarding 
              ? 'You have completed the onboarding process' 
              : 'Complete the onboarding to set up your store'}
          </Typography>
        </Box>
        
        <Chip 
          label={sellerData?.hasCompletedOnboarding ? "Completed" : "Incomplete"} 
          color={sellerData?.hasCompletedOnboarding ? "success" : "warning"}
          sx={{ 
            fontWeight: 500,
            ...(sellerData?.hasCompletedOnboarding 
              ? {} 
              : { bgcolor: alpha(themeColors.primary, 0.15), color: themeColors.primaryDark })
          }}
        />
      </Box>
    </Box>
  );
};

export default SellerInfo;