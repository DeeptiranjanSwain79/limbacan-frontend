import { Box, Button, Card, CardContent, Typography } from "@mui/material";

export type LegViewKey = "front" | "back" | "top" | "inner" | "outer";

export type LegImage = {
  file: File | null;
  preview: string;
};

interface LegUploaderProps {
  title: string;
  images: Record<LegViewKey, LegImage>;
  onImageChange: (view: LegViewKey, file: File | null) => void;
  onRemoveImage: (view: LegViewKey) => void;
}

const views: {
  key: LegViewKey;
  title: string;
  description: string;
}[] = [
  {
    key: "front",
    title: "Front",
    description: "Capture the leg from the front.",
  },
  {
    key: "back",
    title: "Back",
    description: "Capture the leg from the back.",
  },
  {
    key: "top",
    title: "Top",
    description: "Capture the leg from the top.",
  },
  {
    key: "inner",
    title: "Inner Side",
    description: "Capture the inner side of the leg.",
  },
  {
    key: "outer",
    title: "Outer Side",
    description: "Capture the outer side of the leg.",
  },
];

const LegUploader = ({
  title,
  images,
  onImageChange,
  onRemoveImage,
}: LegUploaderProps) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
        {title}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 2,
        }}
      >
        {views.map((view) => {
          const image = images[view.key];

          return (
            <Card
              key={view.key}
              variant="outlined"
              sx={{
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {view.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mb: 2 }}
                >
                  {view.description}
                </Typography>

                {image.preview ? (
                  <>
                    <Box
                      sx={{
                        width: "100%",
                        height: 240,
                        borderRadius: 1.5,
                        overflow: "hidden",
                        backgroundColor: "grey.100",
                        mb: 1.5,
                      }}
                    >
                      <img
                        src={image.preview}
                        alt={`${title} ${view.title}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </Box>

                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      onClick={() => onRemoveImage(view.key)}
                    >
                      Retake Image
                    </Button>
                  </>
                ) : (
                  <Button
                    component="label"
                    variant="outlined"
                    fullWidth
                    sx={{
                      height: 240,
                      borderStyle: "dashed",
                    }}
                  >
                    Upload Image
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(event) =>
                        onImageChange(view.key, event.target.files?.[0] || null)
                      }
                    />
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default LegUploader;
