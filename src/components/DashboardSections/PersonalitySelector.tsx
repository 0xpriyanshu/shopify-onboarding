import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Chip,
  alpha,
  Paper,
  Typography,
  Fade,
  Tooltip,
  Grid,
  Avatar,
  Autocomplete,
  IconButton
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// Define available personalities with their details
const AVAILABLE_PERSONALITIES = [
  { id: 'TRUMP', name: 'Donald Trump', avatar: '🇺🇸', description: 'Confident, direct businessman style' },
  { id: 'MUSK', name: 'Elon Musk', avatar: '🚀', description: 'Innovative, direct communication style' },
  { id: 'OBAMA', name: 'Barack Obama', avatar: '🗣️', description: 'Measured, inspirational communication' },
  { id: 'RONALDO', name: 'Cristiano Ronaldo', avatar: '⚽', description: 'Motivational, performance-driven tone' },
  { id: 'VITALIK', name: 'Vitalik Buterin', avatar: '⚡', description: 'Technical, blockchain-focused perspective' }
];

// Interface for component props
interface PersonalitySelectorProps {
  currentPersonalities: string[];
  onUpdate: (personalities: string[]) => void;
  storeId: string;
  themeColors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
  };
}

const PersonalitySelector: React.FC<PersonalitySelectorProps> = ({
  currentPersonalities,
  onUpdate,
  storeId,
  themeColors
}) => {
  const [personalities, setPersonalities] = useState<string[]>(currentPersonalities);
  const [originalPersonalities, setOriginalPersonalities] = useState<string[]>(currentPersonalities);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newPersonality, setNewPersonality] = useState<string | null>(null);
  
  useEffect(() => {
    setOriginalPersonalities(currentPersonalities);
    setPersonalities(currentPersonalities);
  }, [currentPersonalities]);
  
  const handleStartEdit = () => {
    setIsEditing(true);
    setSaveSuccess(false);
  };
  
  const handleCancelEdit = () => {
    setPersonalities(originalPersonalities);
    setIsEditing(false);
    setError(null);
    setNewPersonality(null);
  };

  const handleAddPersonality = () => {
    // Check if maximum limit reached (3 personalities)
    if (personalities.length >= 3) {
      setError('Maximum of 3 personalities allowed');
      return;
    }
    
    if (newPersonality && !personalities.includes(newPersonality)) {
      setPersonalities([...personalities, newPersonality]);
      setNewPersonality(null);
      setError(null);
    }
  };

  const handleRemovePersonality = (personality: string) => {
    setPersonalities(personalities.filter(p => p !== personality));
  };
  
  const handleSave = async () => {
    // Validate - make sure we have at least one personality
    if (personalities.length === 0) {
      setError('At least one personality must be selected');
      return;
    }
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      // Call the API endpoint to update personalities
      const response = await fetch("https://aggregator.gobbl.ai/api/shopify/updatePersonalities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: storeId,
          personalities: personalities
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to update personalities");
      }
      
      const result = await response.json();
      
      // Check for success based on the "error" property being false
      if (result && result.error === false) {
        onUpdate(personalities);
        setOriginalPersonalities([...personalities]);
        setIsEditing(false);
        setSaveSuccess(true);
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setError('Failed to save personalities: ' + (result.error || 'Unknown error'));
      }
      
    } catch (error) {
      console.error('Error saving personalities:', error);
      setError('Failed to save personalities. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Find personality details by ID
  const getPersonalityDetails = (id: string) => {
    return AVAILABLE_PERSONALITIES.find(p => p.id === id) || {
      id,
      name: id,
      avatar: '👤',
      description: 'Custom personality'
    };
  };
  
  return (
    <Box>
      {isEditing ? (
        <Fade in={isEditing}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                bgcolor: alpha(themeColors.secondary, 0.7),
                border: '1px dashed',
                borderColor: alpha(themeColors.primary, 0.3),
                borderRadius: 2
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Selected Personalities
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {personalities.length > 0 ? (
                  personalities.map(personality => {
                    const details = getPersonalityDetails(personality);
                    return (
                      <Chip
                        key={personality}
                        label={details.name}
                        onDelete={() => handleRemovePersonality(personality)}
                        deleteIcon={<DeleteIcon />}
                        avatar={<Avatar>{details.avatar}</Avatar>}
                        sx={{
                          bgcolor: alpha(themeColors.primary, 0.1),
                          '& .MuiChip-label': { fontWeight: 500 },
                          '&:hover': { bgcolor: alpha(themeColors.primary, 0.15) }
                        }}
                      />
                    );
                  })
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No personalities selected. Add at least one personality.
                  </Typography>
                )}
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Autocomplete
                  value={newPersonality}
                  onChange={(event, newValue) => {
                    setNewPersonality(newValue);
                    // Clear any max limit error when changing selection
                    if (personalities.length < 3) {
                      setError(null);
                    }
                  }}
                  options={AVAILABLE_PERSONALITIES.map(p => p.id)}
                  getOptionLabel={(option) => getPersonalityDetails(option).name}
                  renderOption={(props, option) => {
                    const details = getPersonalityDetails(option);
                    return (
                      <li {...props}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem' }}>
                            {details.avatar}
                          </Avatar>
                          <Box>
                            <Typography variant="body2">{details.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {details.description}
                            </Typography>
                          </Box>
                        </Box>
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Add Personality"
                      variant="outlined"
                      placeholder="Select a personality"
                      fullWidth
                      size="small"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <PersonIcon sx={{ ml: 1, mr: 0.5, color: 'action.active' }} />
                            {params.InputProps.startAdornment}
                          </>
                        )
                      }}
                      sx={{
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
                  )}
                  disableClearable
                  disabled={isSaving}
                  sx={{ flex: 1 }}
                />
                <IconButton 
                  onClick={handleAddPersonality}
                  disabled={!newPersonality || personalities.includes(newPersonality || '') || isSaving}
                  sx={{ 
                    color: themeColors.primary,
                    bgcolor: alpha(themeColors.primary, 0.1),
                    '&:hover': {
                      bgcolor: alpha(themeColors.primary, 0.2),
                    },
                    '&.Mui-disabled': {
                      color: alpha(themeColors.primary, 0.3),
                      bgcolor: alpha(themeColors.primary, 0.05),
                    }
                  }}
                >
                  <AddCircleIcon />
                </IconButton>
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <HelpOutlineIcon fontSize="small" sx={{ mr: 0.5 }} />
                  Select up to 3 personalities to define your store's unique AI voice
                </Typography>
              </Box>
            </Paper>
            
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1, mb: 2 }}>
                {error}
              </Typography>
            )}
            
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
                disabled={isSaving || personalities.length === 0 || JSON.stringify(personalities) === JSON.stringify(originalPersonalities)}
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
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    width: 40, 
                    height: 40, 
                    bgcolor: alpha(themeColors.primary, 0.15), 
                    borderRadius: '50%'
                  }}>
                    <PersonIcon sx={{ color: themeColors.primary }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      AI Personalities
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: themeColors.primaryDark }}>
                      {personalities.length === 0 ? 'No personalities selected' : `${personalities.length} Selected`}
                    </Typography>
                  </Box>
                </Box>
                
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  {personalities.length > 0 ? (
                    personalities.map(personality => {
                      const details = getPersonalityDetails(personality);
                      return (
                        <Grid item key={personality}>
                          <Tooltip title={details.description} arrow>
                            <Chip
                              label={details.name}
                              avatar={<Avatar>{details.avatar}</Avatar>}
                              sx={{
                                bgcolor: alpha(themeColors.primary, 0.1),
                                '& .MuiChip-label': { fontWeight: 500 },
                                '&:hover': { bgcolor: alpha(themeColors.primary, 0.15) }
                              }}
                            />
                          </Tooltip>
                        </Grid>
                      );
                    })
                  ) : (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        No personalities configured yet. Click Edit to add AI personalities.
                      </Typography>
                    </Grid>
                  )}
                </Grid>
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
                
                <Tooltip title="Edit AI personalities">
                  <Button
                    variant="outlined"
                    onClick={handleStartEdit}
                    startIcon={<PersonIcon />}
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

export default PersonalitySelector;