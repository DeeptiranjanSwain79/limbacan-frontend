import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";

import Layout from "../components/wrapper/Layout";
import LegUploader, {
  type LegImage,
  type LegViewKey,
} from "../components/LegUploader";

type AnalysisView = {
  angulation: string;
  deviation: string;
  issues: string[];
};

type LegAnalysis = {
  front: AnalysisView;
  back: AnalysisView;
  top: AnalysisView;
  inner: AnalysisView;
  outer: AnalysisView;
};

type AnalysisResult = {
  left: LegAnalysis;
  right: LegAnalysis;
  futureIssues: string[];
};

const emptyLegImages: Record<LegViewKey, LegImage> = {
  front: {
    file: null,
    preview: "",
  },
  back: {
    file: null,
    preview: "",
  },
  top: {
    file: null,
    preview: "",
  },
  inner: {
    file: null,
    preview: "",
  },
  outer: {
    file: null,
    preview: "",
  },
};

const bloodGroups = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

const LimbScanPage = () => {
  // ================= PATIENT DETAILS =================

  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState<number | "">("");
  const [weight, setWeight] = useState<number | "">("");
  const [bloodGroup, setBloodGroup] = useState("");

  // ================= LEFT LEG =================

  const [leftImages, setLeftImages] =
    useState<Record<LegViewKey, LegImage>>(emptyLegImages);

  // ================= RIGHT LEG =================

  const [rightImages, setRightImages] =
    useState<Record<LegViewKey, LegImage>>(emptyLegImages);

  // ================= ANALYSIS =================

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<AnalysisResult | null>(null);

  // ================= IMAGE CHANGE =================

  const handleImageChange = (
    leg: "left" | "right",
    view: LegViewKey,
    file: File | null,
  ) => {
    if (!file) return;

    const preview = URL.createObjectURL(file);

    if (leg === "left") {
      setLeftImages((prev) => ({
        ...prev,
        [view]: {
          file,
          preview,
        },
      }));
    } else {
      setRightImages((prev) => ({
        ...prev,
        [view]: {
          file,
          preview,
        },
      }));
    }
  };

  // ================= REMOVE IMAGE =================

  const handleRemoveImage = (leg: "left" | "right", view: LegViewKey) => {
    if (leg === "left") {
      setLeftImages((prev) => ({
        ...prev,
        [view]: {
          file: null,
          preview: "",
        },
      }));
    } else {
      setRightImages((prev) => ({
        ...prev,
        [view]: {
          file: null,
          preview: "",
        },
      }));
    }
  };

  // ================= VALIDATION =================

  const views: LegViewKey[] = ["front", "back", "top", "inner", "outer"];

  const leftComplete = views.every((view) => leftImages[view].file);

  const rightComplete = views.every((view) => rightImages[view].file);

  const allImagesUploaded = leftComplete && rightComplete;

  // ================= ANALYZE =================

  const handleAnalyze = async () => {
    if (!allImagesUploaded) {
      alert("Please upload all 5 views for both legs.");

      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const formData = new FormData();

      // LEFT LEG

      formData.append("left_front", leftImages.front.file!);

      formData.append("left_back", leftImages.back.file!);

      formData.append("left_top", leftImages.top.file!);

      formData.append("left_inner", leftImages.inner.file!);

      formData.append("left_outer", leftImages.outer.file!);

      // RIGHT LEG

      formData.append("right_front", rightImages.front.file!);

      formData.append("right_back", rightImages.back.file!);

      formData.append("right_top", rightImages.top.file!);

      formData.append("right_inner", rightImages.inner.file!);

      formData.append("right_outer", rightImages.outer.file!);

      /*
       * PATIENT INFORMATION
       *
       * We can send these to the backend as well
       * when we connect the real API.
       */

      formData.append("name", name);
      formData.append("age", String(age));
      formData.append("gender", gender);
      formData.append("height", String(height));
      formData.append("weight", String(weight));

      /*
       * REAL API
       *
       * const response = await fetch(
       *   `${BASE_URL}/api/analyze`,
       *   {
       *     method: "POST",
       *     body: formData,
       *   }
       * );
       *
       * const data = await response.json();
       *
       * if (!response.ok) {
       *   throw new Error(
       *     data.message || "Analysis failed"
       *   );
       * }
       *
       * setResult(data.data);
       */

      console.log("FormData ready for API:", formData);

      /*
       * REMOVE THIS ONCE API IS CONNECTED.
       *
       * Currently we don't create a mock result.
       */
    } catch (error) {
      console.error(error);

      alert("Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  // ================= RESULT VIEW =================

  const renderAnalysis = (title: string, data: AnalysisView) => {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
          {title}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
            },
            gap: 1.5,
          }}
        >
          <Card variant="outlined">
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Angulation
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {data.angulation}
              </Typography>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Deviation
              </Typography>

              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {data.deviation}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
            Observations
          </Typography>

          <Box
            component="ul"
            sx={{
              mt: 0,
              pl: 2.5,
            }}
          >
            {data.issues.map((issue, index) => (
              <Typography
                component="li"
                variant="body2"
                key={index}
                sx={{ mb: 0.5 }}
              >
                {issue}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
    );
  };

  // ================= REPORT =================

  const renderReport = () => {
    if (!result) return null;

    return (
      <Box
        id="limb-report"
        sx={{
          maxWidth: 1000,
          mx: "auto",
          mt: 5,
          backgroundColor: "#fff",
          border: "1px solid",
          borderColor: "grey.300",
          p: {
            xs: 2,
            md: 4,
          },
        }}
      >
        {/* REPORT HEADER */}

        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            LIMBSCAN REPORT
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Structural Alignment Assessment
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* PATIENT */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              md: "repeat(5, 1fr)",
            },
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              Patient
            </Typography>

            <Typography sx={{ fontWeight: 700 }}>{name || "-"}</Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Age
            </Typography>

            <Typography sx={{ fontWeight: 700 }}>{age || "-"}</Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Gender
            </Typography>

            <Typography sx={{ fontWeight: 700 }}>{gender || "-"}</Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Height
            </Typography>

            <Typography sx={{ fontWeight: 700 }}>
              {height ? `${height} cm` : "-"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Weight
            </Typography>

            <Typography sx={{ fontWeight: 700 }}>
              {weight ? `${weight} kg` : "-"}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* ================= LEFT / RIGHT REPORT ================= */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },
            gap: 4,
          }}
        >
          {/* LEFT */}

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 3 }}>
              LEFT LEG
            </Typography>

            {renderAnalysis("Front View", result.left.front)}

            {renderAnalysis("Back View", result.left.back)}

            {renderAnalysis("Top View", result.left.top)}

            {renderAnalysis("Inner Side", result.left.inner)}

            {renderAnalysis("Outer Side", result.left.outer)}
          </Box>

          {/* RIGHT */}

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 3 }}>
              RIGHT LEG
            </Typography>

            {renderAnalysis("Front View", result.right.front)}

            {renderAnalysis("Back View", result.right.back)}

            {renderAnalysis("Top View", result.right.top)}

            {renderAnalysis("Inner Side", result.right.inner)}

            {renderAnalysis("Outer Side", result.right.outer)}
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* FUTURE ISSUES */}

        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
          Potential Future Issues
        </Typography>

        <Box
          component="ul"
          sx={{
            mt: 0,
            pl: 2.5,
          }}
        >
          {result.futureIssues.map((issue, index) => (
            <Typography component="li" key={index} sx={{ mb: 0.7 }}>
              {issue}
            </Typography>
          ))}
        </Box>
      </Box>
    );
  };

  // ================= PAGE =================

  return (
    <Layout>
      <Box
        sx={{
          width: "100%",
          maxWidth: 1200,
          mx: "auto",
          px: {
            xs: 2,
            md: 3,
          },
          py: 3,
        }}
      >
        {/* HEADER */}

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            LimbScan
          </Typography>

          <Typography sx={{ color: "text.secondary", mt: 0.5 }}>
            Capture both legs from five different views for structural alignment
            analysis.
          </Typography>
        </Box>

        {/* PATIENT DETAILS */}

        <Box
          sx={{
            borderRadius: 2,
            mb: 4,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
            Patient Details
          </Typography>

          {/* Form fields */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr 1fr",
                sm: "2fr 1fr 1fr",
              },
              gap: 1.2,
              mt: 2,
              p: 2,
              mx: "auto",
              maxWidth: "xl",
            }}
          >
            {/* Name */}
            <TextField
              size="small"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              sx={{
                gridColumn: {
                  xs: "1 / -1",
                  sm: "span 1",
                },
              }}
            />

            {/* Age */}
            <TextField
              size="small"
              type="number"
              label="Age"
              value={age || ""}
              onChange={(e) => setAge(Number(e.target.value))}
              slotProps={{
                htmlInput: {
                  min: 1,
                  max: 120,
                },
              }}
              fullWidth
            />

            {/* Blood Group */}
            <TextField
              select
              size="small"
              label="Blood Group"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              fullWidth
            >
              {bloodGroups.map((group) => (
                <MenuItem key={group} value={group}>
                  {group}
                </MenuItem>
              ))}
            </TextField>

            {/* Gender */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                gridColumn: {
                  xs: "1 / -1",
                  sm: "span 1",
                },
              }}
            >
              <FormLabel
                sx={{
                  fontSize: 13,
                  mr: 0.5,
                  whiteSpace: "nowrap",
                }}
              >
                Gender:
              </FormLabel>

              <RadioGroup
                row
                value={gender}
                onChange={(e) =>
                  setGender(e.target.value as "" | "Male" | "Female" | "Others")
                }
                sx={{
                  gap: 0.5,
                  flexWrap: "nowrap",
                }}
              >
                <FormControlLabel
                  value="Male"
                  control={<Radio size="small" />}
                  label="Male"
                  sx={{
                    mr: 0.5,
                    "& .MuiFormControlLabel-label": {
                      fontSize: 13,
                    },
                  }}
                />

                <FormControlLabel
                  value="Female"
                  control={<Radio size="small" />}
                  label="Female"
                  sx={{
                    mr: 0.5,
                    "& .MuiFormControlLabel-label": {
                      fontSize: 13,
                    },
                  }}
                />

                <FormControlLabel
                  value="Others"
                  control={<Radio size="small" />}
                  label="Others"
                  sx={{
                    mr: 0,
                    "& .MuiFormControlLabel-label": {
                      fontSize: 13,
                    },
                  }}
                />
              </RadioGroup>
            </Box>

            {/* Height */}
            <TextField
              size="small"
              type="number"
              label="Height (cm)"
              value={height || ""}
              onChange={(e) => setHeight(Number(e.target.value))}
              slotProps={{
                htmlInput: {
                  min: 1,
                },
              }}
              fullWidth
            />

            {/* Weight */}
            <TextField
              size="small"
              type="number"
              label="Weight (kg)"
              value={weight || ""}
              onChange={(e) => setWeight(Number(e.target.value))}
              slotProps={{
                htmlInput: {
                  min: 1,
                },
              }}
              fullWidth
            />
          </Box>
        </Box>

        {/* ================= LEFT LEG ================= */}

        <Card
          variant="outlined"
          sx={{
            p: {
              xs: 2,
              md: 3,
            },
            mb: 4,
            borderRadius: 2,
          }}
        >
          <LegUploader
            title="Left Leg"
            images={leftImages}
            onImageChange={(view, file) =>
              handleImageChange("left", view, file)
            }
            onRemoveImage={(view) => handleRemoveImage("left", view)}
          />
        </Card>

        {/* ================= RIGHT LEG ================= */}

        <Card
          variant="outlined"
          sx={{
            p: {
              xs: 2,
              md: 3,
            },
            mb: 4,
            borderRadius: 2,
          }}
        >
          <LegUploader
            title="Right Leg"
            images={rightImages}
            onImageChange={(view, file) =>
              handleImageChange("right", view, file)
            }
            onRemoveImage={(view) => handleRemoveImage("right", view)}
          />
        </Card>

        {/* ================= ANALYZE ================= */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 5,
          }}
        >
          <Button
            variant="contained"
            size="large"
            disabled={!allImagesUploaded || loading}
            loading={loading}
            onClick={handleAnalyze}
            sx={{
              minWidth: 240,
              py: 1.3,
              fontWeight: 800,
            }}
          >
            Analyze Limb
          </Button>
        </Box>

        {/* ================= REPORT ================= */}

        {renderReport()}

        {/* ================= PRINT ================= */}

        {result && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 4,
            }}
          >
            <Button variant="contained" onClick={() => window.print()}>
              Print / Download Report
            </Button>
          </Box>
        )}

        {/* ================= PRINT CSS ================= */}

        <style>
          {`
            @media print {
              body * {
                visibility: hidden;
              }

              #limb-report,
              #limb-report * {
                visibility: visible;
              }

              #limb-report {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                max-width: none;
                margin: 0;
                padding: 10mm;
                border: none;
                box-shadow: none;
              }

              @page {
                size: A4;
                margin: 10mm;
              }
            }
          `}
        </style>
      </Box>
    </Layout>
  );
};

export default LimbScanPage;
