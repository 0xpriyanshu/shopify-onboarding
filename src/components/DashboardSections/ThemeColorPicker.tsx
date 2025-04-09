import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Paper, 
  Radio, 
  TextField, 
  CircularProgress, 
  alpha, 
  Chip,
  Divider,
  Popover,
  InputAdornment
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { HexColorPicker } from 'react-colorful';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface ThemeColorPickerProps {
  currentColor: string;
  onUpdate: (color: string) => void;
  storeId: string;
  themeColors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
  };
}

const ThemeColorPicker: React.FC<ThemeColorPickerProps> = ({ 
  currentColor, 
  onUpdate, 
  storeId,
  themeColors
}) => {
  const [selectedColor, setSelectedColor] = useState(currentColor);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [colorMode, setColorMode] = useState<'preset' | 'custom'>('preset');
  const [error, setError] = useState<string | null>(null);
  
  // Common color presets
  const colorPresets = [
    { name: 'Orange', hex: '#FF6B00' },
    { name: 'Blue', hex: '#1976D2' },
    { name: 'Green', hex: '#2E7D32' },
    { name: 'Purple', hex: '#6A1B9A' },
    { name: 'Red', hex: '#C62828' },
    { name: 'Teal', hex: '#00796B' },
    { name: 'Pink', hex: '#C2185B' },
    { name: 'Amber', hex: '#FF8F00' }
  ];
  
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setSaveSuccess(false);
    setError(null);
  };
  
  const handleCustomColorChange = (color: string) => {
    setSelectedColor(color);
    setSaveSuccess(false);
    setError(null);
  };
  
  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    
    // Accept any input in the field
    if (color.startsWith('#')) {
      // Only validate if it starts with #
      if (color.match(/^#([0-9A-F]{3}){1,2}$/i)) {
        setSelectedColor(color);
        setSaveSuccess(false);
        setError(null);
      } else if (color.length > 1) {
        setError("Invalid hex color format");
      }
    } else {
      setSelectedColor('#' + color);
    }
  };
  
  const handleOpenColorPicker = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleCloseColorPicker = () => {
    setAnchorEl(null);
  };

  const handleSelectFromPicker = () => {
    setAnchorEl(null);
  };
  
  const handleSave = async () => {
    // Validate color before saving
    if (!selectedColor.match(/^#([0-9A-F]{3}){1,2}$/i)) {
      setError("Please enter a valid hex color (e.g., #FF6B00)");
      return;
    }
    
    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);
    
    try {
      const response = await fetch("https://aggregator.gobbl.ai/api/shopify/updateTheme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: storeId,
          theme: selectedColor
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to update theme");
      }
      
      const result = await response.json();
      // Check API response: if there is an error flag and it's false
      if (result && result.error === false) {
        onUpdate(selectedColor);
        setSaveSuccess(true);
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setError("Failed to save the theme: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error saving theme color:", error);
      setError("Failed to save the color. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  
  const isColorChanged = selectedColor !== currentColor;
  const open = Boolean(anchorEl);
  
  // Color preview component to show sample buttons and text
  const ColorPreview = ({ color }: { color: string }) => {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500 }}>
          Preview
        </Typography>
        
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: 'white',
            border: '1px solid',
            borderColor: alpha('#000', 0.08),
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '4px',
              backgroundColor: color
            }
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button 
              variant="contained" 
              size="small"
              sx={{ 
                bgcolor: color,
                '&:hover': {
                  bgcolor: color,
                  opacity: 0.9
                }
              }}
            >
              Primary Button
            </Button>
            
            <Button 
              variant="outlined" 
              size="small"
              sx={{ 
                color: color,
                borderColor: color,
                '&:hover': {
                  borderColor: color,
                  opacity: 0.9
                }
              }}
            >
              Secondary Button
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box 
              sx={{ 
                width: 16, 
                height: 16, 
                borderRadius: '50%', 
                backgroundColor: color 
              }} 
            />
            
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: color, 
                fontWeight: 600 
              }}
            >
              Sample Text with Theme Color
            </Typography>
          </Box>
        </Paper>
      </Box>
    );
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Current Color: <Box component="span" sx={{ color: currentColor, fontWeight: 600 }}>{currentColor}</Box>
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant={colorMode === 'preset' ? 'contained' : 'outlined'}
            onClick={() => {
              setColorMode('preset');
              setError(null);
            }}
            sx={{
              ...(colorMode === 'preset' ? {
                bgcolor: themeColors.primary,
                '&:hover': {
                  bgcolor: themeColors.primaryDark,
                }
              } : {
                borderColor: themeColors.primary,
                color: themeColors.primary,
              })
            }}
          >
            Presets
          </Button>
          
          <Button
            size="small"
            variant={colorMode === 'custom' ? 'contained' : 'outlined'}
            onClick={() => {
              setColorMode('custom');
              setError(null);
            }}
            sx={{
              ...(colorMode === 'custom' ? {
                bgcolor: themeColors.primary,
                '&:hover': {
                  bgcolor: themeColors.primaryDark,
                }
              } : {
                borderColor: themeColors.primary,
                color: themeColors.primary,
              })
            }}
          >
            Custom
          </Button>
        </Box>
      </Box>
      
      <ColorPreview color={selectedColor} />
      
      {colorMode === 'preset' ? (
        <Grid container spacing={2}>
          {colorPresets.map((color) => (
            <Grid item xs={6} sm={4} md={3} key={color.hex}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '2px solid',
                  borderColor: selectedColor === color.hex ? color.hex : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
                onClick={() => handleColorSelect(color.hex)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Radio
                    checked={selectedColor === color.hex}
                    sx={{
                      p: 0.5,
                      '&.Mui-checked': {
                        color: color.hex,
                      },
                    }}
                  />
                  
                  <Box>
                    <Box
                      sx={{ 
                        width: '100%', 
                        height: 30, 
                        backgroundColor: color.hex, 
                        borderRadius: 1,
                        border: '1px solid rgba(0,0,0,0.1)',
                        mb: 1
                      }}
                    />
                    
                    <Typography variant="body2" noWrap>
                      {color.name}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: alpha('#000', 0.08)
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
              <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: '200px' }, textAlign: 'center' }}>
                <Box 
                  onClick={handleOpenColorPicker}
                  sx={{ 
                    width: '100%', 
                    height: 60, 
                    backgroundColor: selectedColor, 
                    borderRadius: 2,
                    border: '1px solid rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    mb: 2,
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    },
                    position: 'relative',
                    '&::after': {
                      content: '"Click to open color picker"',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      opacity: 0,
                      transition: 'opacity 0.2s ease',
                    },
                    '&:hover::after': {
                      opacity: 1
                    }
                  }}
                />
                
                <TextField
                  value={selectedColor}
                  onChange={handleColorInputChange}
                  fullWidth
                  label="Hex Color"
                  variant="outlined"
                  error={!!error}
                  helperText={error}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ColorLensIcon sx={{ color: selectedColor }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: selectedColor,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: selectedColor,
                    },
                  }}
                />
                
                <Button
                  variant="outlined"
                  onClick={handleOpenColorPicker}
                  sx={{
                    mt: 2,
                    borderColor: themeColors.primary,
                    color: themeColors.primary,
                    '&:hover': {
                      backgroundColor: alpha(themeColors.primary, 0.05),
                      borderColor: themeColors.primaryDark
                    }
                  }}
                >
                  Open Color Picker
                </Button>
              </Box>
              
              <Box sx={{ flex: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Color Values
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 1,
                        bgcolor: alpha('#000', 0.03)
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        HEX
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedColor}
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 1,
                        bgcolor: alpha('#000', 0.03)
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        CSS Variable
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        --primary-color
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Tips for selecting colors:
                  </Typography>
                  <ul style={{ paddingLeft: '20px', color: 'rgba(0,0,0,0.6)', margin: '8px 0' }}>
                    <li>Choose colors that match your brand identity</li>
                    <li>Ensure enough contrast for accessibility</li>
                    <li>Test your color in different contexts</li>
                  </ul>
                </Box>
              </Box>
            </Box>
            
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleCloseColorPicker}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              sx={{
                '& .MuiPopover-paper': {
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }
              }}
            >
              <Box sx={{ p: 3, width: 250 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
                  Select a Custom Color
                </Typography>
                <HexColorPicker 
                  color={selectedColor} 
                  onChange={handleCustomColorChange}
                  style={{ width: '100%', height: 200 }}
                />
                <Box sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box 
                    sx={{ 
                      width: 36, 
                      height: 36, 
                      borderRadius: 1, 
                      bgcolor: selectedColor,
                      border: '1px solid rgba(0,0,0,0.1)',
                    }} 
                  />
                  <TextField
                    size="small"
                    value={selectedColor}
                    onChange={handleColorInputChange}
                    sx={{ flex: 1 }}
                  />
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ 
                    mt: 2, 
                    bgcolor: selectedColor,
                    '&:hover': {
                      bgcolor: selectedColor,
                      opacity: 0.9
                    }
                  }}
                  onClick={handleSelectFromPicker}
                >
                  Select This Color
                </Button>
              </Box>
            </Popover>
          </Paper>
        </Box>
      )}
      
      <Divider sx={{ my: 3 }} />
      
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          onClick={handleSave}
          disabled={!isColorChanged || isSaving || !!error}
          sx={{
            bgcolor: themeColors.primary,
            '&:hover': {
              bgcolor: themeColors.primaryDark,
            },
            '&.Mui-disabled': {
              bgcolor: alpha(themeColors.primary, 0.5),
            },
            borderRadius: '30px',
            px: 3,
            py: 1,
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease',
            '&:not(.Mui-disabled):hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 15px rgba(0,0,0,0.15)'
            }
          }}
        >
          {isSaving ? 'Saving...' : 'Save Theme Color'}
        </Button>
        
        {saveSuccess && (
          <Chip 
            label="Color saved successfully" 
            color="success" 
            variant="filled" 
            sx={{ fontWeight: 500 }}
          />
        )}
      </Box>
    </Box>
  );
};

export default ThemeColorPicker;
