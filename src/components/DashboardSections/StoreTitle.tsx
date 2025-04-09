import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  CircularProgress, 
  Chip,
  alpha,
  InputAdornment,
  IconButton,
  Paper,
  Typography,
  Fade,
  Tooltip
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface StoreTitleProps {
  storeName: string;
  onUpdate: (name: string) => void;
  storeId: string;
  themeColors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
  };
}

const StoreTitle: React.FC<StoreTitleProps> = ({ 
  storeName, 
  onUpdate, 
  storeId,
  themeColors
}) => {
  const [name, setName] = useState(storeName);
  const [originalName, setOriginalName] = useState(storeName);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(storeName.length);
  const [showTooltip, setShowTooltip] = useState(false);
  
  const MAX_LENGTH = 50;
  
  useEffect(() => {
    setOriginalName(storeName);
    setName(storeName);
    setCharCount(storeName.length);
  }, [storeName]);
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setCharCount(value.length);
    
    if (value.length > MAX_LENGTH) {
      setError(`Store name cannot exceed ${MAX_LENGTH} characters`);
    } else if (!value.trim()) {
      setError('Store name cannot be empty');
    } else {
      setError(null);
    }
  };
  
  const handleStartEdit = () => {
    setIsEditing(true);
    setSaveSuccess(false);
    setShowTooltip(false);
  };
  
  const handleCancelEdit = () => {
    setName(originalName);
    setCharCount(originalName.length);
    setIsEditing(false);
    setError(null);
  };
  
  const handleSave = async () => {
    // Validate
    if (!name.trim()) {
      setError('Store name cannot be empty');
      return;
    }
    
    if (name.length > MAX_LENGTH) {
      setError(`Store name cannot exceed ${MAX_LENGTH} characters`);
      return;
    }
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      // Call the API endpoint to update the bot title.
      // The sellerId is passed dynamically from the storeId prop.
      const response = await fetch("https://aggregator.gobbl.ai/api/shopify/updateBotTitle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: storeId,
          title: name
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to update bot title");
      }
      
      const result = await response.json();
      
      // Check for success based on the "error" property being false
      if (result && result.error === false) {
        onUpdate(name);
        setOriginalName(name);
        setIsEditing(false);
        setSaveSuccess(true);
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setError('Failed to save store name: ' + (result.error || 'Unknown error'));
      }
      
    } catch (error) {
      console.error('Error saving store name:', error);
      setError('Failed to save store name. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !error && name.trim() && name !== originalName) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };
  
  return (
    <Box>
      {isEditing ? (
        <Fade in={isEditing}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              fullWidth
              value={name}
              onChange={handleNameChange}
              onKeyDown={handleKeyDown}
              label="Store Name"
              variant="outlined"
              autoFocus
              error={!!error}
              helperText={error || `${charCount}/${MAX_LENGTH} characters`}
              disabled={isSaving}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <StorefrontIcon sx={{ color: themeColors.primary }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Your store name appears in emails, notifications, and customer communications">
                      <IconButton size="small" edge="end">
                        <HelpOutlineIcon fontSize="small" sx={{ color: 'action.active' }} />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                )
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: themeColors.primary,
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: themeColors.primary,
                },
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={handleCancelEdit}
                disabled={isSaving}
                startIcon={<CancelIcon />}
                sx={{
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                  color: 'text.secondary',
                  '&:hover': {
                    borderColor: 'rgba(0, 0, 0, 0.5)',
                  },
                  borderRadius: '20px'
                }}
              >
                Cancel
              </Button>
              
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={isSaving || !name.trim() || name === originalName || !!error}
                startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                sx={{
                  bgcolor: themeColors.primary,
                  '&:hover': {
                    bgcolor: themeColors.primaryDark,
                  },
                  '&.Mui-disabled': {
                    bgcolor: alpha(themeColors.primary, 0.5),
                  },
                  borderRadius: '20px'
                }}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          </Box>
        </Fade>
      ) : (
        <Fade in={!isEditing}>
          <Paper
            elevation={0}
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              bgcolor: alpha(themeColors.secondary, 0.5),
              border: '1px solid',
              borderColor: alpha(themeColors.primary, 0.1),
              borderRadius: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                borderColor: alpha(themeColors.primary, 0.2),
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  width: 40, 
                  height: 40, 
                  bgcolor: alpha(themeColors.primary, 0.15), 
                  borderRadius: '50%'
                }}>
                  <StorefrontIcon sx={{ color: themeColors.primary }} />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Store Name
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: themeColors.primaryDark }}>
                    {originalName || 'No store name set'}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {saveSuccess && (
                  <Chip 
                    icon={<CheckCircleIcon />}
                    label="Saved" 
                    color="success" 
                    size="small" 
                    sx={{ fontWeight: 500 }} 
                  />
                )}
                
                <Tooltip 
                  title="Edit your store name"
                  open={showTooltip}
                  onOpen={() => setShowTooltip(true)}
                  onClose={() => setShowTooltip(false)}
                >
                  <Button
                    variant="outlined"
                    onClick={handleStartEdit}
                    startIcon={<EditIcon />}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    size="small"
                    sx={{
                      borderColor: themeColors.primary,
                      color: themeColors.primary,
                      borderRadius: '20px',
                      '&:hover': {
                        borderColor: themeColors.primaryDark,
                        bgcolor: alpha(themeColors.primary, 0.05),
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Edit
                  </Button>
                </Tooltip>
              </Box>
            </Box>
          </Paper>
        </Fade>
      )}
    </Box>
  );
};

export default StoreTitle;
