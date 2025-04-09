import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Grid,
  Paper,
  IconButton,
  alpha,
  Chip,
  Divider,
  Collapse
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface LoaderTextGeneratorProps {
  currentLoaderTexts: string[];
  onUpdate: (loaderTexts: string[]) => void;
  storeId: string;
  themeColors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
  };
}

const LoaderTextGenerator: React.FC<LoaderTextGeneratorProps> = ({
  currentLoaderTexts,
  onUpdate,
  storeId,
  themeColors
}) => {
  const [loaderTexts, setLoaderTexts] = useState<string[]>(currentLoaderTexts);
  const [newLoaderText, setNewLoaderText] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTexts, setGeneratedTexts] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedTexts, setExpandedTexts] = useState(false);
  
  const handleAddLoaderText = () => {
    if (newLoaderText.trim()) {
      setLoaderTexts([...loaderTexts, newLoaderText.trim()]);
      setNewLoaderText('');
      setSaveSuccess(false);
    }
  };
  
  const handleDeleteLoaderText = (index: number) => {
    setLoaderTexts(loaderTexts.filter((_, i) => i !== index));
    setSaveSuccess(false);
  };
  
  const handleEditLoaderText = (index: number) => {
    setEditIndex(index);
    setEditText(loaderTexts[index]);
  };
  
  const handleSaveEdit = () => {
    if (editIndex !== null && editText.trim()) {
      const newTexts = [...loaderTexts];
      newTexts[editIndex] = editText.trim();
      setLoaderTexts(newTexts);
      setEditIndex(null);
      setSaveSuccess(false);
    }
  };
  
  const handleCancelEdit = () => {
    setEditIndex(null);
  };

  // Updated to call the aggregator API to generate loader texts
  const handleGenerateLoaderTexts = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch(`https://aggregator.gobbl.ai/api/shopify/generateLoaderTexts?sellerId=${storeId}`, {
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate loader texts');
      }
      
      const data = await response.json();
      
      // The API response is expected to be in the format:
      // { "error": false, "result": { "error": false, "result": [ ... ] } }
      if (!data.error && data.result && !data.result.error && Array.isArray(data.result.result)) {
        setGeneratedTexts(data.result.result);
      } else {
        throw new Error('API returned an error');
      }
    } catch (error) {
      console.error('Error generating loader texts:', error);
      setError('Failed to generate loader texts. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleAddGeneratedText = (text: string) => {
    if (!loaderTexts.includes(text)) {
      setLoaderTexts([...loaderTexts, text]);
      // Remove the text from the generated list after adding
      setGeneratedTexts(generatedTexts.filter(t => t !== text));
      setSaveSuccess(false);
    }
  };
  
  const handleSaveLoaderTexts = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      // Simulate API delay and then update parent state.
      await new Promise(resolve => setTimeout(resolve, 800));
      
      onUpdate(loaderTexts);
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error saving loader texts:', error);
      setError('Failed to save loader texts. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const areTextsChanged = JSON.stringify(loaderTexts) !== JSON.stringify(currentLoaderTexts);
  
  return (
    <Box>
      {/* Generate Loader Texts Section */}
      <Box sx={{ mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: alpha(themeColors.secondary, 0.5),
            border: '1px solid',
            borderColor: alpha(themeColors.primary, 0.1)
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <HourglassEmptyIcon sx={{ color: themeColors.primary, mr: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Loading Message Generator
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            Create engaging messages that will be displayed while customers wait for results.
            These messages will appear during loading screens to keep users engaged.
          </Typography>
          
          <Button
            variant="contained"
            onClick={handleGenerateLoaderTexts}
            disabled={isGenerating}
            startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <AutoFixHighIcon />}
            sx={{
              bgcolor: themeColors.primary,
              '&:hover': {
                bgcolor: themeColors.primaryDark,
              },
              '&.Mui-disabled': {
                bgcolor: alpha(themeColors.primary, 0.5),
              }
            }}
          >
            {isGenerating ? 'Generating...' : 'Generate Loading Messages'}
          </Button>
        </Paper>
      </Box>
      
      {/* Generated Loader Texts Section */}
      {generatedTexts.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Generated Loading Messages
          </Typography>
          
          <Grid container spacing={2}>
            {generatedTexts.map((text, index) => (
              <Grid {...{ component: 'div', item: true, xs: 12 }} key={`generated-${index}`}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px dashed',
                    borderColor: alpha(themeColors.primary, 0.3),
                    backgroundColor: alpha(themeColors.primary, 0.03),
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    {text}
                  </Typography>
                  
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => handleAddGeneratedText(text)}
                    sx={{
                      color: themeColors.primary,
                      '&:hover': {
                        bgcolor: alpha(themeColors.primary, 0.1),
                      }
                    }}
                  >
                    Add
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      
      {/* Current Loader Texts Section */}
      <Box>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2
          }}
        >
          <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Your Loading Messages {loaderTexts.length > 0 ? `(${loaderTexts.length})` : ''}
          </Typography>
          
          {loaderTexts.length > 4 && (
            <Button
              size="small"
              endIcon={expandedTexts ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              onClick={() => setExpandedTexts(!expandedTexts)}
              sx={{ 
                color: themeColors.primary,
                '&:hover': {
                  bgcolor: alpha(themeColors.primary, 0.05),
                }
              }}
            >
              {expandedTexts ? 'Show Less' : 'Show All'}
            </Button>
          )}
        </Box>
        
        <Grid container spacing={2}>
          {(expandedTexts ? loaderTexts : loaderTexts.slice(0, 4)).map((text, index) => (
            <Grid {...{ component: 'div', item: true, xs: 12 }} key={index}>
              {editIndex === index ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: alpha(themeColors.primary, 0.3),
                    backgroundColor: 'white'
                  }}
                >
                  <TextField
                    fullWidth
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    sx={{ mb: 2 }}
                    inputProps={{ maxLength: 100 }}
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={handleCancelEdit}
                      sx={{
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                        color: 'text.secondary'
                      }}
                    >
                      Cancel
                    </Button>
                    
                    <Button
                      size="small"
                      variant="contained"
                      disabled={!editText.trim() || editText.trim() === loaderTexts[index]}
                      onClick={handleSaveEdit}
                      sx={{
                        bgcolor: themeColors.primary,
                        '&:hover': {
                          bgcolor: themeColors.primaryDark,
                        },
                        '&.Mui-disabled': {
                          bgcolor: alpha(themeColors.primary, 0.5),
                        }
                      }}
                    >
                      Save
                    </Button>
                  </Box>
                </Paper>
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      borderColor: alpha(themeColors.primary, 0.3),
                    }
                  }}
                >
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    {text}
                  </Typography>
                  
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleEditLoaderText(index)}
                      sx={{ color: 'action.active' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteLoaderText(index)}
                      sx={{ color: 'error.main' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Paper>
              )}
            </Grid>
          ))}
        </Grid>
        
        {loaderTexts.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px dashed',
              borderColor: 'rgba(0, 0, 0, 0.12)',
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              textAlign: 'center'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No loading messages added yet. Generate messages or add them manually.
            </Typography>
          </Paper>
        )}
        
        {/* Add New Loader Text */}
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Enter a new loading message"
              value={newLoaderText}
              onChange={(e) => setNewLoaderText(e.target.value)}
              variant="outlined"
              size="medium"
              InputProps={{
                sx: {
                  borderRadius: 2
                }
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
            
            <Button
              variant="contained"
              onClick={handleAddLoaderText}
              disabled={!newLoaderText.trim()}
              startIcon={<AddIcon />}
              sx={{
                bgcolor: themeColors.primary,
                '&:hover': {
                  bgcolor: themeColors.primaryDark,
                },
                '&.Mui-disabled': {
                  bgcolor: alpha(themeColors.primary, 0.5),
                },
                minWidth: '120px'
              }}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Box>
      
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {error}
        </Typography>
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
          onClick={handleSaveLoaderTexts}
          disabled={!areTextsChanged || isSaving || loaderTexts.length === 0}
          sx={{
            bgcolor: themeColors.primary,
            '&:hover': {
              bgcolor: themeColors.primaryDark,
            },
            '&.Mui-disabled': {
              bgcolor: alpha(themeColors.primary, 0.5),
            }
          }}
        >
          {isSaving ? 'Saving...' : 'Save Loading Messages'}
        </Button>
        
        {saveSuccess && (
          <Chip 
            label="Loading messages saved successfully" 
            color="success" 
            variant="filled" 
            sx={{ fontWeight: 500 }}
          />
        )}
      </Box>
    </Box>
  );
};

export default LoaderTextGenerator;
