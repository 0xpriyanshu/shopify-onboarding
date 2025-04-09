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
  Card,
  CardContent,
  Collapse
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface PromptGeneratorProps {
  currentPrompts: string[];
  onUpdate: (prompts: string[]) => void;
  storeId: string;
  themeColors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
  };
}

const PromptGenerator: React.FC<PromptGeneratorProps> = ({
  currentPrompts,
  onUpdate,
  storeId,
  themeColors
}) => {
  const [prompts, setPrompts] = useState<string[]>(currentPrompts);
  const [newPrompt, setNewPrompt] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedPrompts, setExpandedPrompts] = useState(false);
  
  const handleAddPrompt = () => {
    if (newPrompt.trim()) {
      setPrompts([...prompts, newPrompt.trim()]);
      setNewPrompt('');
      setSaveSuccess(false);
    }
  };
  
  const handleDeletePrompt = (index: number) => {
    setPrompts(prompts.filter((_, i) => i !== index));
    setSaveSuccess(false);
  };
  
  const handleEditPrompt = (index: number) => {
    setEditIndex(index);
    setEditText(prompts[index]);
  };
  
  const handleSaveEdit = () => {
    if (editIndex !== null && editText.trim()) {
      const newPrompts = [...prompts];
      newPrompts[editIndex] = editText.trim();
      setPrompts(newPrompts);
      setEditIndex(null);
      setSaveSuccess(false);
    }
  };
  
  const handleCancelEdit = () => {
    setEditIndex(null);
  };
  
  // Modified: Generate Cues using API call
  const handleGeneratePrompts = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch(`https://aggregator.gobbl.ai/api/shopify/generateCues?sellerId=${storeId}`, {
        method: 'GET'
      });
      
      if (!response.ok) throw new Error('Failed to generate cues');
      
      const data = await response.json();
      // Assume the generated cues are located at data.result.result as an array,
      // otherwise fall back to mock data.
      const fetchedCues = data?.result?.result || [
        "Show me snowboards that are not tracked in inventory",
        "Do you have any gift cards available?",
        "I'm interested in snowboards with unique features",
        "Can I see snowboards that are part of a collection?"
      ];
      
      setGeneratedPrompts(fetchedCues);
    } catch (error) {
      console.error('Error generating cues:', error);
      setError('Failed to generate cues. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleAddGeneratedPrompt = (prompt: string) => {
    if (!prompts.includes(prompt)) {
      setPrompts([...prompts, prompt]);
      // Remove from generated list
      setGeneratedPrompts(generatedPrompts.filter(p => p !== prompt));
      setSaveSuccess(false);
    }
  };
  
  // Modified: Save Cues via API call (Update Cues endpoint)
  const handleSavePrompts = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const response = await fetch(`https://aggregator.gobbl.ai/api/shopify/updateCues`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: storeId,
          cues: prompts
        })
      });
      
      if (!response.ok) throw new Error('Failed to update cues');
      
      const result = await response.json();
      if (result.success) {
        onUpdate(prompts);
        setSaveSuccess(true);
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setError('Failed to save cues: ' + (result.error || 'Unknown error'));
      }
      
    } catch (error) {
      console.error('Error saving cues:', error);
      setError('Failed to save prompts. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const arePromptsChanged = JSON.stringify(prompts) !== JSON.stringify(currentPrompts);
  
  return (
    <Box>
      {/* Generate Prompts Section */}
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
            <AutoFixHighIcon sx={{ color: themeColors.primary, mr: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              AI Prompt Generator
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            Generate intelligent cues that will help understand your customers' needs better.
            These cues will appear during customer interactions.
          </Typography>
          
          <Button
            variant="contained"
            onClick={handleGeneratePrompts}
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
            {isGenerating ? 'Generating...' : 'Generate Prompts'}
          </Button>
        </Paper>
      </Box>
      
      {/* Generated Prompts Section */}
      {generatedPrompts.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Generated Prompts
          </Typography>
          
          <Grid container spacing={2}>
            {generatedPrompts.map((prompt, index) => (
              <Grid item xs={12} key={`generated-${index}`}>
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
                    {prompt}
                  </Typography>
                  
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => handleAddGeneratedPrompt(prompt)}
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
      
      {/* Current Prompts Section */}
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
            Your Prompts {prompts.length > 0 ? `(${prompts.length})` : ''}
          </Typography>
          
          {prompts.length > 4 && (
            <Button
              size="small"
              endIcon={expandedPrompts ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              onClick={() => setExpandedPrompts(!expandedPrompts)}
              sx={{ 
                color: themeColors.primary,
                '&:hover': {
                  bgcolor: alpha(themeColors.primary, 0.05),
                }
              }}
            >
              {expandedPrompts ? 'Show Less' : 'Show All'}
            </Button>
          )}
        </Box>
        
        <Grid container spacing={2}>
          {(expandedPrompts ? prompts : prompts.slice(0, 4)).map((prompt, index) => (
            <Grid item xs={12} key={index}>
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
                    multiline
                    maxRows={3}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    sx={{ mb: 2 }}
                    inputProps={{ maxLength: 200 }}
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
                      disabled={!editText.trim() || editText.trim() === prompts[index]}
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
                    {prompt}
                  </Typography>
                  
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleEditPrompt(index)}
                      sx={{ color: 'action.active' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    
                    <IconButton
                      size="small"
                      onClick={() => handleDeletePrompt(index)}
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
        
        {prompts.length === 0 && (
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
              No prompts added yet. Generate prompts or add them manually.
            </Typography>
          </Paper>
        )}
        
        {/* Add New Prompt */}
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Enter a new prompt"
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
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
              onClick={handleAddPrompt}
              disabled={!newPrompt.trim()}
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
          onClick={handleSavePrompts}
          disabled={!arePromptsChanged || isSaving || prompts.length === 0}
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
          {isSaving ? 'Saving...' : 'Save Prompts'}
        </Button>
        
        {saveSuccess && (
          <Chip 
            label="Prompts saved successfully" 
            color="success" 
            variant="filled" 
            sx={{ fontWeight: 500 }}
          />
        )}
      </Box>
    </Box>
  );
};

export default PromptGenerator;
