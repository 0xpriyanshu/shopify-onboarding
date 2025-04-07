import React from 'react';
import { 
  Box, 
  FormControl, 
  FormLabel, 
  FormGroup, 
  FormControlLabel, 
  Checkbox,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import { OnboardingFormValues } from './Onboarding';

interface StepProductTypesProps {
  formValues: OnboardingFormValues;
  setFormValues: React.Dispatch<React.SetStateAction<OnboardingFormValues>>;
  themeColors?: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
  };
}

const StepProductTypes: React.FC<StepProductTypesProps> = ({ 
  formValues, 
  setFormValues,
  themeColors = {
    primary: '#FF6B00',
    primaryLight: '#FF8F3C',
    primaryDark: '#E65100',
    secondary: '#FFF3E0'
  }
}) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      productTypes: { ...prev.productTypes, [name]: checked }
    }));
  };

  const getSelectedCount = () => {
    return Object.values(formValues.productTypes).filter(Boolean).length;
  };

  // Product types grouped by category
  const productCategories = [
    {
      name: "Popular Categories",
      items: [
        { key: 'electronics', label: 'Electronics' },
        { key: 'apparel', label: 'Apparel' },
        { key: 'beauty', label: 'Beauty & Skincare' },
        { key: 'home', label: 'Home & Garden' },
      ]
    },
    {
      name: "Specialty Products",
      items: [
        { key: 'jewelry', label: 'Jewelry' },
        { key: 'medical', label: 'Medical & Rx' },
        { key: 'health', label: 'Health & Wellness' },
        { key: 'arts', label: 'Arts & Crafts' },
      ]
    },
    {
      name: "Other Categories",
      items: [
        { key: 'auto', label: 'Auto' },
        { key: 'baby', label: 'Baby Products' },
        { key: 'games', label: 'Games & Media' },
        { key: 'sports', label: 'Sports Outdoor' },
        { key: 'pets', label: 'Products for Pets' },
        { key: 'toys', label: 'Toys' },
        { key: 'food', label: 'Food & Grocery' },
        { key: 'books', label: 'Books' },
        { key: 'other', label: 'Other' }
      ]
    }
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: themeColors.primaryDark, mb: 3 }}>
        Product Categories
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
          Select all the product categories your store offers:
        </Typography>
        <Chip 
          label={`${getSelectedCount()} selected`} 
          color="default"
          size="small"
          sx={{
            backgroundColor: getSelectedCount() > 0 ? `${themeColors.primary}20` : 'rgba(0,0,0,0.08)',
            color: getSelectedCount() > 0 ? themeColors.primaryDark : 'text.secondary',
            fontWeight: getSelectedCount() > 0 ? 500 : 400,
            border: getSelectedCount() > 0 ? `1px solid ${themeColors.primary}40` : 'none'
          }}
        />
      </Box>
      
      <Paper
        elevation={0}
        sx={{ 
          p: 3, 
          backgroundColor: themeColors.secondary,
          borderRadius: 2,
          border: '1px solid rgba(0, 0, 0, 0.08)'
        }}
      >
        <FormControl component="fieldset" required fullWidth>
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
            <CategoryIcon sx={{ mr: 1, color: `${themeColors.primary}99` }} />
            Product Types
          </FormLabel>
          
          <FormGroup>
            {productCategories.map((category, categoryIndex) => (
              <Box key={category.name} sx={{ mb: 3 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    mb: 1.5, 
                    color: themeColors.primaryDark,
                    fontWeight: 500,
                    pl: 1
                  }}
                >
                  {category.name}
                </Typography>
                
                <Grid container spacing={1} component="div">
                  {category.items.map((option) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={option.key} component="div">
                      <Paper
                        elevation={0}
                        sx={{
                          p: 0.5,
                          border: formValues.productTypes[option.key] 
                            ? `1px solid ${themeColors.primary}` 
                            : '1px solid rgba(0, 0, 0, 0.12)',
                          borderRadius: 1.5,
                          backgroundColor: formValues.productTypes[option.key] 
                            ? `${themeColors.primary}15` 
                            : 'transparent',
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: formValues.productTypes[option.key] 
                              ? `${themeColors.primary}20` 
                              : 'rgba(0, 0, 0, 0.03)',
                            borderColor: formValues.productTypes[option.key] 
                              ? themeColors.primary 
                              : `${themeColors.primaryLight}60`
                          }
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              name={option.key}
                              checked={!!formValues.productTypes[option.key]}
                              onChange={handleCheckboxChange}
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
                              variant="body2" 
                              sx={{ 
                                fontWeight: formValues.productTypes[option.key] ? 500 : 400,
                                color: formValues.productTypes[option.key] ? themeColors.primaryDark : 'inherit',
                              }}
                            >
                              {option.label}
                            </Typography>
                          }
                          sx={{ 
                            width: '100%',
                            m: 0,
                            '.MuiFormControlLabel-label': {
                              fontSize: '0.9rem',
                            }
                          }}
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                
                {categoryIndex < productCategories.length - 1 && (
                  <Divider sx={{ my: 2 }} />
                )}
              </Box>
            ))}
          </FormGroup>

          {getSelectedCount() === 0 && (
            <Typography color="error" variant="caption" sx={{ mt: 1 }}>
              Please select at least one product type
            </Typography>
          )}
        </FormControl>
      </Paper>

      <Typography 
        variant="body2" 
        sx={{ mt: 3, fontStyle: 'italic', color: 'text.secondary' }}
      >
        * At least one selection is required to proceed
      </Typography>
    </Box>
  );
};

export default StepProductTypes;
