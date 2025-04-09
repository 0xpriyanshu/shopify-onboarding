import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress, 
  Paper,
  IconButton,
  Chip,
  Grid,
  Fade,
  Tooltip,
  Divider,
  alpha
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import ImageIcon from '@mui/icons-material/Image';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface LogoSectionProps {
  currentLogo: string | null;
  onUpdate: (logo: string | null) => void;
  // NOTE: storeId represents the seller id passed dynamically.
  storeId: string;
  themeColors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
  };
}

const LogoSection: React.FC<LogoSectionProps> = ({ 
  currentLogo, 
  onUpdate, 
  storeId,
  themeColors
}) => {
  // local preview of the image (either a base64 string or the URL returned from the API)
  const [logoPreview, setLogoPreview] = useState<string | null>(currentLogo);
  // hold the actual selected file so that it can be sent on "Save Changes"
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false); // still used for UI feedback during file selection reading (if needed)
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  
  // Set up drag and drop listeners
  useEffect(() => {
    const dropZone = dropZoneRef.current;
    if (!dropZone) return;
    
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };
    
    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };
    
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
      }
    };
    
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);
    
    return () => {
      dropZone.removeEventListener('dragover', handleDragOver);
      dropZone.removeEventListener('dragleave', handleDragLeave);
      dropZone.removeEventListener('drop', handleDrop);
    };
  }, []);
  
  // When a file is selected via the file input
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };
  
  // Validate and prepare the file:
  // • Validate file type and size
  // • Create a local preview (base64) for immediate display
  // • Store the file object in state to be uploaded later upon "Save Changes"
  const handleFile = (file: File) => {
    // Validate file type
    if (!file.type.match('image/(jpeg|jpg|png|gif|svg+xml|webp)')) {
      setError('Please upload an image file (JPEG, PNG, GIF, SVG, or WebP)');
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('File size must be less than 2MB');
      return;
    }
    
    setError(null);
    
    // Create a local preview without calling the API yet
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Store the file for the later upload
    setSelectedFile(file);
  };
  
  // Clear the currently selected file/preview
  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // When the user clicks "Save Changes", send the file and sellerId using FormData once.
  const handleSave = async () => {
    // Ensure there is a file selected to upload.
    if (!selectedFile) {
      setError('No new image selected to save.');
      return;
    }
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('sellerId', storeId);
      
      const response = await fetch("https://aggregator.gobbl.ai/api/shopify/uploadImage", {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Save failed');
      }
      
      const data = await response.json();
      if (data.success && data.fileUrl) {
        setLogoPreview(data.fileUrl);
        // Update parent component with the new logo URL
        onUpdate(data.fileUrl);
        setSaveSuccess(true);
        // Clear the selected file (since it's now saved)
        setSelectedFile(null);
      } else {
        setError('Save failed: ' + (data.error || 'Unknown error'));
      }
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving logo:', error);
      setError('Failed to save logo. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Determine if the logo has been changed (preview differs from the currentLogo)
  const isLogoChanged = logoPreview !== currentLogo;
  
  return (
    <Box>
      <Grid container spacing={3}>
        {/* Left: Current Logo display */}
        <Grid {...{ component: 'div', item: true, xs: 12, md: 6 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Current Logo
          </Typography>
          
          <Box 
            sx={{ 
              height: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: alpha(themeColors.secondary, 0.5),
              border: '1px solid',
              borderColor: alpha(themeColors.primary, 0.1),
              borderRadius: 2,
              p: 2,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {currentLogo ? (
              <>
                <Box
                  component="img"
                  src={currentLogo}
                  alt="Current Logo"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    transition: 'transform 0.3s ease'
                  }}
                />
                <Box 
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    bgcolor: 'rgba(255,255,255,0.8)',
                    borderRadius: '50%',
                    p: 0.5,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <Tooltip title="View full size">
                    <IconButton 
                      size="small" 
                      onClick={() => window.open(currentLogo, '_blank')}
                    >
                      <ZoomInIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                <ImageIcon sx={{ fontSize: 40, opacity: 0.5, mb: 1 }} />
                <Typography variant="body2">No logo set</Typography>
              </Box>
            )}
          </Box>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              This is how your logo appears to customers
            </Typography>
          </Box>
        </Grid>
        
        {/* Right: Upload new logo */}
        <Grid {...{ component: 'div', item: true, xs: 12, md: 6 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Upload New Logo
          </Typography>
          
          <Box
            ref={dropZoneRef}
            sx={{
              height: 200,
              border: '2px dashed',
              borderColor: isDragging 
                ? themeColors.primary 
                : isUploading 
                  ? themeColors.primary 
                  : logoPreview 
                    ? alpha(themeColors.primary, 0.5) 
                    : alpha(themeColors.primary, 0.3),
              borderRadius: 2,
              backgroundColor: isDragging 
                ? alpha(themeColors.primary, 0.1) 
                : logoPreview 
                  ? 'transparent' 
                  : alpha(themeColors.primary, 0.05),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
              position: 'relative',
              cursor: logoPreview ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
              ...(logoPreview && !isUploading ? {
                backgroundImage: `url(${logoPreview})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              } : {})
            }}
            onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            {isUploading ? (
              <Box sx={{ 
                textAlign: 'center',
                bgcolor: 'rgba(255,255,255,0.8)', 
                p: 2, 
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <CircularProgress size={40} sx={{
                  color: themeColors.primary, 
                  mb: 2 
                }} />
                <Typography variant="body2">Uploading...</Typography>
              </Box>
            ) : logoPreview ? (
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  borderRadius: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  '&:hover': {
                    opacity: 1
                  }
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  sx={{
                    bgcolor: 'white',
                    color: themeColors.primary,
                    '&:hover': {
                      bgcolor: 'white',
                      opacity: 0.9
                    },
                    mb: 1
                  }}
                >
                  Change
                </Button>
                
                <Button
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveLogo();
                  }}
                  sx={{
                    bgcolor: 'white',
                    color: 'error.main',
                    '&:hover': {
                      bgcolor: 'white',
                      opacity: 0.9
                    }
                  }}
                >
                  Remove
                </Button>
              </Box>
            ) : (
              <Fade in={!isUploading}>
                <Box sx={{ textAlign: 'center' }}>
                  <CloudUploadIcon 
                    sx={{ 
                      fontSize: 50, 
                      color: alpha(themeColors.primary, 0.7), 
                      mb: 1,
                      animation: isDragging ? 'pulse 1.5s infinite' : 'none',
                      '@keyframes pulse': {
                        '0%': { transform: 'scale(1)' },
                        '50%': { transform: 'scale(1.1)' },
                        '100%': { transform: 'scale(1)' },
                      },
                    }} 
                  />
                  <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>
                    {isDragging ? 'Drop your logo here' : 'Drag & drop your logo here'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    or
                  </Typography>
                  <input
                    accept="image/*"
                    ref={fileInputRef}
                    type="file"
                    hidden
                    onChange={handleFileSelect}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      mt: 1,
                      borderColor: themeColors.primary,
                      color: themeColors.primary,
                      '&:hover': {
                        borderColor: themeColors.primaryDark,
                        bgcolor: alpha(themeColors.primary, 0.05)
                      },
                      borderRadius: '20px',
                      px: 3
                    }}
                  >
                    Select File
                  </Button>
                  <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
                    Recommended: 512×512px (Max 2MB)
                  </Typography>
                </Box>
              </Fade>
            )}
          </Box>
          
          {error && (
            <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
              {error}
            </Typography>
          )}
          
          <Box sx={{ mt: 2 }}>
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                backgroundColor: alpha(themeColors.secondary, 0.7),
                borderRadius: 1,
                border: '1px dashed',
                borderColor: alpha(themeColors.primary, 0.2),
              }}
            >
              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <InfoOutlinedIcon fontSize="inherit" sx={{ color: alpha(themeColors.primary, 0.7) }} />
                For best results, use a transparent PNG or SVG with a 1:1 aspect ratio
              </Typography>
            </Paper>
          </Box>
        </Grid>
      </Grid>
      
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 3
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          onClick={handleSave}
          disabled={!isLogoChanged || isSaving || isUploading || !selectedFile}
          sx={{
            bgcolor: themeColors.primary,
            '&:hover': { bgcolor: themeColors.primaryDark },
            '&.Mui-disabled': { bgcolor: alpha(themeColors.primary, 0.5) },
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
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
        
        {saveSuccess && (
          <Chip 
            icon={<CheckCircleIcon />}
            label="Logo saved successfully" 
            color="success" 
            variant="filled" 
            sx={{ fontWeight: 500 }}
          />
        )}
      </Box>
    </Box>
  );
};

// Info icon component used in the tip section
const InfoIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z"
      fill="currentColor"
    />
  </svg>
);

export default LogoSection;
