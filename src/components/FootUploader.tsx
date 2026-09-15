import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useEffect, useRef, useState } from "react";

interface FootUploaderProps {
  side: "left" | "right";
  image: File | null;
  onUpload: (file: File) => void;
  onRetake: () => void;
}

const FootUploader = ({
  side,
  image,
  onUpload,
  onRetake,
}: FootUploaderProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Create preview URL whenever image changes
  useEffect(() => {
    if (!image) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(image);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [image]);

  const startCamera = async () => {
    try {
      setCameraError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
        },
        audio: false,
      });

      streamRef.current = stream;

      setCameraOpen(true);

      // Give Dialog/video time to render
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (error) {
      console.error("Camera error:", error);

      setCameraError(
        "Unable to access the camera. Please allow camera permissions or upload an image from your device.",
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const closeCamera = () => {
    stopCamera();
    setCameraOpen(false);
    setCameraError(null);
  };

  const capturePhoto = () => {
    const video = videoRef.current;

    if (!video) return;

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const file = new File([blob], `${side}-foot-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

        onUpload(file);

        closeCamera();
      },
      "image/jpeg",
      0.9,
    );
  };

  // Stop camera when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    onUpload(file);

    // Allows selecting the same file again
    event.target.value = "";
  };

  return (
    <>
      <Box
        sx={{
          border: "3px solid",
          borderColor: "info.main",
          borderRadius: 2,
          p: 2,
          minHeight: 400,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            textTransform: "capitalize",
            fontWeight: 700,
          }}
        >
          {side} Foot
        </Typography>

        {/* Upload / Preview Area */}
        <Box
          sx={{
            flex: 1,
            border: "2px dashed",
            borderColor: image ? "success.main" : "grey.400",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
            minHeight: 300,
            overflow: "hidden",
            position: "relative",
            bgcolor: "grey.50",
          }}
        >
          {!image ? (
            <>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ textAlign: "center" }}
              >
                Upload {side} foot image
              </Typography>

              {/* Buttons */}
              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={2}
              >
                {/* Upload */}
                <Button
                  variant="contained"
                  component="label"
                  size="large"
                  startIcon={<UploadFileIcon />}
                >
                  Upload from Device
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>

                {/* Camera */}
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PhotoCameraIcon />}
                  onClick={startCamera}
                >
                  Take Photo
                </Button>
              </Stack>

              <Typography variant="caption" color="text.secondary">
                Supported formats: JPG, JPEG, PNG
              </Typography>
            </>
          ) : (
            <>
              {/* Image Preview */}
              {previewUrl && (
                <Box
                  component="img"
                  src={previewUrl}
                  alt={`${side} foot preview`}
                  sx={{
                    width: "100%",
                    height: 300,
                    objectFit: "contain",
                    borderRadius: 1,
                  }}
                />
              )}

              {/* File Information */}
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  width: "100%",
                  px: 2,
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {image.name}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {(image.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </Box>

                <IconButton
                  color="error"
                  onClick={onRetake}
                  aria-label={`Remove ${side} foot image`}
                >
                  <CloseIcon />
                </IconButton>
              </Stack>

              {/* Retake / Choose Another */}
              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={2}
              >
                <Button variant="outlined" component="label">
                  Choose Another
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<PhotoCameraIcon />}
                  onClick={startCamera}
                >
                  Take Another Photo
                </Button>
              </Stack>
            </>
          )}
        </Box>
      </Box>

      {/* Camera Dialog */}
      <Dialog open={cameraOpen} onClose={closeCamera} fullWidth maxWidth="md">
        <DialogTitle>Take {side} Foot Photo</DialogTitle>

        <DialogContent>
          {cameraError ? (
            <Typography color="error" sx={{ py: 4 }}>
              {cameraError}
            </Typography>
          ) : (
            <Box
              sx={{
                width: "100%",
                bgcolor: "black",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Box
                component="video"
                ref={videoRef}
                autoPlay
                playsInline
                muted
                sx={{
                  display: "block",
                  width: "100%",
                  maxHeight: "65vh",
                  objectFit: "contain",
                }}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
          }}
        >
          <Button onClick={closeCamera}>Cancel</Button>

          {!cameraError && (
            <Button
              variant="contained"
              startIcon={<PhotoCameraIcon />}
              onClick={capturePhoto}
            >
              Capture Photo
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FootUploader;
