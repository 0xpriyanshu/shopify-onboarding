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

interface Cue {
  title: string;
  value: string;
}

interface PromptGeneratorProps {
  currentPrompts: Cue[];
  onUpdate: (prompts: Cue[]) => void;
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
  const [prompts, setPrompts] = useState<Cue[]>(currentPrompts);
  const [newCueTitle, setNewCueTitle] = useState('');
  const [newCueValue, setNewCueValue] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editCue, setEditCue] = useState<Cue | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState<Cue[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedPrompts, setExpandedPrompts] = useState(false);

  const handleAddPrompt = () => {
    if (newCueTitle.trim() && newCueValue.trim()) {
      const newCue: Cue = {
        title: newCueTitle.trim(),
        value: newCueValue.trim()
      };
      setPrompts([...prompts, newCue]);
      setNewCueTitle('');
      setNewCueValue('');
      setSaveSuccess(false);
    }
  };

  const handleDeletePrompt = (index: number) => {
    setPrompts(prompts.filter((_, i) => i !== index));
    setSaveSuccess(false);
  };

  const handleEditPrompt = (index: number) => {
    setEditIndex(index);
    setEditCue(prompts[index]);
  };

  const handleSaveEdit = () => {
    if (editIndex !== null && editCue && editCue.title.trim() && editCue.value.trim()) {
      const newPrompts = [...prompts];
      newPrompts[editIndex] = { title: editCue.title.trim(), value: editCue.value.trim() };
      setPrompts(newPrompts);
      setEditIndex(null);
      setEditCue(null);
      setSaveSuccess(false);
    }
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditCue(null);
  };

  // Generate cues using API call
  const handleGeneratePrompts = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(`https://aggregator.gobbl.ai/api/shopify/generateCues?sellerId=${storeId}`, {
        method: 'GET'
      });

      if (!response.ok) throw new Error('Failed to generate cues');

      const data = await response.json();
      // Expected response example:
      // {
      //   "error": false,
      //   "result": {
      //     "error": false,
      //     "result": [ { "title": "minimal snowboard", "value": "I'm looking for a minimal snowboard" }, ... ]
      //   }
      // }
      const defaultCues: Cue[] = [
        { title: "minimal snowboard", value: "I'm looking for a minimal snowboard" },
        { title: "complete snowboard", value: "I'm looking for a complete snowboard" },
        { title: "collection snowboard", value: "I'm interested in the collection snowboard" },
        { title: "multi-location snowboard", value: "I'm looking for a multi-location snowboard" }
      ];
      const fetchedCues: Cue[] = data?.result?.result || defaultCues;

      setGeneratedPrompts(fetchedCues);
    } catch (error) {
      console.error('Error generating cues:', error);
      setError('Failed to generate cues. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddGeneratedPrompt = (cue: Cue) => {
    if (!prompts.some(p => p.title === cue.title && p.value === cue.value)) {
      setPrompts([...prompts, cue]);
      setGeneratedPrompts(generatedPrompts.filter(p => p.title !== cue.title));
      setSaveSuccess(false);
    }
  };

  // Save cues via API call (Update Cues endpoint)
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
      {/* Generate Cues Section */}
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
            Both the title and description will be displayed. You can add, edit, and delete cues.
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

      {/* Generated Cues Section */}
      {generatedPrompts.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Generated Cues
          </Typography>

          <Grid container spacing={2}>
            {generatedPrompts.map((cue, index) => (
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
                    <strong>{cue.title}</strong>: {cue.value}
                  </Typography>

                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => handleAddGeneratedPrompt(cue)}
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

      {/* Current Cues Section */}
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
            Your Cues {prompts.length > 0 ? `(${prompts.length})` : ''}
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
          {(expandedPrompts ? prompts : prompts.slice(0, 4)).map((cue, index) => (
            <Grid {...{ component: 'div', item: true, xs: 12 }} key={index}>
              {editIndex === index && editCue ? (
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
                    value={editCue.title}
                    onChange={(e) =>
                      setEditCue({ ...editCue, title: e.target.value })
                    }
                    label="Title"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    value={editCue.value}
                    onChange={(e) =>
                      setEditCue({ ...editCue, value: e.target.value })
                    }
                    label="Value"
                    variant="outlined"
                    sx={{ mb: 2 }}
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
                      disabled={
                        !editCue.title.trim() ||
                        !editCue.value.trim() ||
                        (editCue.title.trim() === prompts[index].title &&
                          editCue.value.trim() === prompts[index].value)
                      }
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
                    <strong>{cue.title}</strong>: {cue.value}
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
              No cues added yet. Generate cues or add them manually.
            </Typography>
          </Paper>
        )}

        {/* Add New Cue */}
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={1} alignItems="center">
          <Grid {...{ component: 'div', item: true, xs: 12, sm: 5 }}>
              <TextField
                fullWidth
                placeholder="New cue title"
                value={newCueTitle}
                onChange={(e) => setNewCueTitle(e.target.value)}
                variant="outlined"
                size="medium"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: themeColors.primary,
                    },
                  },
                }}
              />
            </Grid>
            <Grid {...{ component: 'div', item: true, xs: 12, sm: 5 }}>
              <TextField
                fullWidth
                placeholder="New cue value"
                value={newCueValue}
                onChange={(e) => setNewCueValue(e.target.value)}
                variant="outlined"
                size="medium"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: themeColors.primary,
                    },
                  },
                }}
              />
            </Grid>
            <Grid {...{ component: 'div', item: true, xs: 12, sm: 2 }}>
              <Button
                variant="contained"
                onClick={handleAddPrompt}
                disabled={!newCueTitle.trim() || !newCueValue.trim()}
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
            </Grid>
          </Grid>
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
            label="Cues saved successfully"
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
