/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
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
import { assessFeetApi } from "../api/assessment.api";
// import left_front from "../assets/left_front.png";
// import left_back from "../assets/left_back.png";
// import left_top from "../assets/left_top.jpg";
// import left_inner from "../assets/left_inner.png";
// import left_outer from "../assets/left_outer.png";
// import right_front from "../assets/right_front.png";
// import right_back from "../assets/right_back.png";
// import right_top from "../assets/right_top.jpg";
// import right_inner from "../assets/right_inner.png";
// import right_outer from "../assets/right_outer.png";

type Annotation = {
  x: number | null;
  y: number | null;
  labelX: number | null;
  labelY: number | null;
  direction:
    | "left"
    | "right"
    | "up"
    | "down"
    | "up-left"
    | "up-right"
    | "down-left"
    | "down-right"
    | null;
};

type Measurements = {
  angulation: number | null;

  halluxValgusAngle: number | null;

  tibiaFootAngle: number | null;

  navicularDrop: number | null;

  calcanealDeviation: number | null;

  medialLateralDeviation: string | null;

  archHeight: number | null;

  transverseArch: string | null;

  medialLongitudinalArch: string | null;

  deviation: string | null;
};

type AnalysisView = {
  observations: string[];

  comparison: string | null;

  deformityDetected: boolean;

  deformityLabel: string | null;

  annotation: Annotation;

  measurements: Measurements;

  confidence: "high" | "medium" | "low";
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

  crossViewAnalysis?: string;

  overall?: {
    keyFindings: string[];

    potentialFutureConcerns: string[];

    recommendations: string[];
  };

  disclaimer?: string;
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
  const [error, setError] = useState("");

  // ================= LEFT LEG =================

  const [leftImages, setLeftImages] =
    useState<Record<LegViewKey, LegImage>>(emptyLegImages);

  // ================= RIGHT LEG =================

  const [rightImages, setRightImages] =
    useState<Record<LegViewKey, LegImage>>(emptyLegImages);

  // ================= ANALYSIS =================

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<AnalysisResult | null>(null);
  // {
  //     left: {
  //       front: {
  //         observations: [
  //           "Slight lateral deviation of the hallux",
  //           "Tibia appears generally aligned with the midfoot",
  //           "Navicular region is relatively prominent",
  //         ],
  //         halluxValgusAngle: 12,
  //         tibiaFootAngle: 3,
  //         navicularDrop: null,
  //         deviation: "slight valgus",
  //         confidence: "medium",
  //       },
  //       back: {
  //         observations: [
  //           "Slight calcaneal eversion visible",
  //           "Rearfoot appears slightly pronated",
  //         ],
  //         calcanealDeviation: 4,
  //         medialLateralDeviation: "valgus",
  //         deviation: "slight eversion",
  //         confidence: "medium",
  //       },
  //       top: {
  //         observations: [
  //           "Forefoot alignment appears relatively neutral with mild lateral deviation of the first digit",
  //         ],
  //         angulation: 2,
  //         deviation: "neutral to mild lateral",
  //         confidence: "medium",
  //       },
  //       inner: {
  //         observations: [
  //           "Medial longitudinal arch appears low, suggesting flatfoot or pes planus",
  //           "Arch flattens toward the floor",
  //         ],
  //         archHeight: null,
  //         transverseArch: "not clearly visible",
  //         medialLongitudinalArch: "low / flattened",
  //         deviation: "low arch",
  //         confidence: "high",
  //       },
  //       outer: {
  //         observations: [
  //           "Lateral border appears relatively straight",
  //           "No significant structural angulation observed from outer view",
  //         ],
  //         angulation: 1,
  //         deviation: "none",
  //         confidence: "medium",
  //       },
  //     },
  //     right: {
  //       front: {
  //         observations: [
  //           "Mild lateral deviation of the hallux",
  //           "Tibia and foot alignment appear consistent with the left side",
  //           "Navicular region appears slightly depressed",
  //         ],
  //         halluxValgusAngle: 13,
  //         tibiaFootAngle: 3,
  //         navicularDrop: null,
  //         deviation: "slight valgus",
  //         confidence: "medium",
  //       },
  //       back: {
  //         observations: [
  //           "Slight calcaneal eversion observed",
  //           "Rearfoot alignment shows mild pronation tendency",
  //         ],
  //         calcanealDeviation: 4,
  //         medialLateralDeviation: "valgus",
  //         deviation: "slight eversion",
  //         confidence: "medium",
  //       },
  //       top: {
  //         observations: [
  //           "Forefoot alignment appears generally consistent with left side",
  //           "Mild lateral deviation of the first digit",
  //         ],
  //         angulation: 2,
  //         deviation: "neutral to mild lateral",
  //         confidence: "medium",
  //       },
  //       inner: {
  //         observations: [
  //           "Medial longitudinal arch appears low, consistent with pes planus",
  //           "Minimal arch clearance from the floor surface",
  //         ],
  //         archHeight: null,
  //         transverseArch: "not clearly visible",
  //         medialLongitudinalArch: "low / flattened",
  //         deviation: "low arch",
  //         confidence: "high",
  //       },
  //       outer: {
  //         observations: [
  //           "Lateral profile shows low arch contour",
  //           "No prominent lateral structural deviations",
  //         ],
  //         angulation: 1,
  //         deviation: "none",
  //         confidence: "medium",
  //       },
  //     },
  //     overall: {
  //       keyFindings: [
  //         "Bilateral low medial longitudinal arches (pes planus appearance)",
  //         "Mild bilateral calcaneal eversion",
  //         "Slight bilateral hallux valgus appearance",
  //       ],
  //       potentialFutureConcerns: [
  //         "appears to show bilateral low arches which could be associated with increased pronation stress",
  //         "may warrant further assessment regarding foot fatigue during prolonged standing or walking",
  //         "further clinical evaluation may be appropriate to assess lower limb kinetic chain alignment",
  //       ],
  //       recommendations: [
  //         "Professional podiatric assessment for standardized measurement of arch height and rearfoot alignment",
  //         "Footwear review to ensure adequate arch support and comfort",
  //         "Exercise assessment focusing on lower extremity and foot intrinsic muscle strength",
  //       ],
  //     },
  //   }
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
      const result = await assessFeetApi(formData);
      setResult(result);
    } catch (error: any) {
      console.error(error);
      setError(error);
      alert("Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const getArrowTransform = (annotation: Annotation) => {
    if (
      annotation.x === null ||
      annotation.y === null ||
      annotation.labelX === null ||
      annotation.labelY === null
    ) {
      return "none";
    }

    const dx = annotation.x - annotation.labelX;
    const dy = annotation.y - annotation.labelY;

    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    return `rotate(${angle}deg)`;
  };

  // ================= RESULT VIEW =================

  const renderAnalysis = (
    title: string,
    data: AnalysisView,
    image: LegImage,
  ) => {
    const measurements = [
      {
        label: "Angulation",
        value:
          data.measurements.angulation !== null
            ? `${data.measurements.angulation}°`
            : null,
      },

      {
        label: "Hallux Valgus Angle",
        value:
          data.measurements.halluxValgusAngle !== null
            ? `${data.measurements.halluxValgusAngle}°`
            : null,
      },

      {
        label: "Tibia-Foot Angle",
        value:
          data.measurements.tibiaFootAngle !== null
            ? `${data.measurements.tibiaFootAngle}°`
            : null,
      },

      {
        label: "Navicular Drop",
        value:
          data.measurements.navicularDrop !== null
            ? String(data.measurements.navicularDrop)
            : null,
      },

      {
        label: "Calcaneal Deviation",
        value:
          data.measurements.calcanealDeviation !== null
            ? `${data.measurements.calcanealDeviation}°`
            : null,
      },

      {
        label: "Medial / Lateral Deviation",
        value:
          data.measurements.medialLateralDeviation !== null
            ? data.measurements.medialLateralDeviation
            : null,
      },

      {
        label: "Arch Height",
        value:
          data.measurements.archHeight !== null
            ? String(data.measurements.archHeight)
            : null,
      },

      {
        label: "Transverse Arch",
        value:
          data.measurements.transverseArch !== null
            ? data.measurements.transverseArch
            : null,
      },

      {
        label: "Medial Longitudinal Arch",
        value:
          data.measurements.medialLongitudinalArch !== null
            ? data.measurements.medialLongitudinalArch
            : null,
      },

      {
        label: "Deviation",
        value:
          data.measurements.deviation !== null
            ? data.measurements.deviation
            : null,
      },
    ].filter((item) => item.value !== null);

    return (
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            mb: 2,
          }}
        >
          {title}
        </Typography>

        {/* IMAGE */}
        {image?.preview && (
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: 500,
              mx: "auto",
              mb: 2,
            }}
          >
            <Box
              component="img"
              src={image.preview}
              alt={title}
              sx={{
                width: "100%",
                display: "block",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.300",
              }}
            />

            {/* DEFORMITY ANNOTATION */}
            {data.deformityDetected &&
              data.annotation.x !== null &&
              data.annotation.y !== null &&
              data.annotation.labelX !== null &&
              data.annotation.labelY !== null && (
                <>
                  {/* POINT */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: `${data.annotation.x}%`,
                      top: `${data.annotation.y}%`,
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: "error.main",
                      border: "2px solid white",
                      transform: "translate(-50%, -50%)",
                      zIndex: 3,
                    }}
                  />

                  {/* LABEL */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: `${data.annotation.labelX}%`,
                      top: `${data.annotation.labelY}%`,
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "error.main",
                      color: "white",
                      px: 1.2,
                      py: 0.7,
                      borderRadius: 1,
                      fontSize: 12,
                      fontWeight: 700,
                      zIndex: 4,
                      maxWidth: "45%",
                      textAlign: "center",
                    }}
                  >
                    {data.deformityLabel}
                  </Box>

                  {/* ARROW */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: `${data.annotation.labelX}%`,
                      top: `${data.annotation.labelY}%`,
                      width: "20%",
                      height: 2,
                      backgroundColor: "error.main",
                      transformOrigin: "left center",
                      transform: getArrowTransform(data.annotation),
                      zIndex: 2,
                    }}
                  />
                </>
              )}
          </Box>
        )}

        {/* COMPARISON */}
        {data.comparison && (
          <Card
            variant="outlined"
            sx={{
              mb: 2,
              backgroundColor: "grey.50",
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 800,
                  mb: 0.5,
                }}
              >
                Comparison with Reference
              </Typography>

              <Typography variant="body2">{data.comparison}</Typography>
            </CardContent>
          </Card>
        )}

        {/* DEFORMITY */}
        {data.deformityDetected && data.deformityLabel && (
          <Card
            variant="outlined"
            sx={{
              mb: 2,
              borderColor: "error.main",
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 800,
                  color: "error.main",
                }}
              >
                Observed Deviation
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontWeight: 700,
                  mt: 0.5,
                }}
              >
                {data.deformityLabel}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* MEASUREMENTS */}
        {measurements.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 1.5,
              mb: 2,
            }}
          >
            {measurements.map((measurement) => (
              <Card key={measurement.label} variant="outlined">
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {measurement.label}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 700,
                      mt: 0.5,
                    }}
                  >
                    {measurement.value}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {/* OBSERVATIONS */}
        {data.observations.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              Observations
            </Typography>

            <Box
              component="ul"
              sx={{
                mt: 0,
                pl: 2.5,
              }}
            >
              {data.observations.map((observation, index) => (
                <Typography
                  component="li"
                  variant="body2"
                  key={index}
                  sx={{ mb: 0.5 }}
                >
                  {observation}
                </Typography>
              ))}
            </Box>
          </Box>
        )}

        {/* CONFIDENCE */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            mt: 1,
          }}
        >
          Confidence: {data.confidence}
        </Typography>
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

            {renderAnalysis("Front View", result.left.front, leftImages.front)}

            {renderAnalysis("Back View", result.left.back, leftImages.back)}

            {renderAnalysis("Top View", result.left.top, leftImages.top)}

            {renderAnalysis("Inner Side", result.left.inner, leftImages.inner)}

            {renderAnalysis("Outer Side", result.left.outer, leftImages.outer)}
          </Box>

          {/* RIGHT */}

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 3 }}>
              RIGHT LEG
            </Typography>

            {renderAnalysis(
              "Front View",
              result.right.front,
              rightImages.front,
            )}

            {renderAnalysis("Back View", result.right.back, rightImages.back)}

            {renderAnalysis("Top View", result.right.top, rightImages.top)}

            {renderAnalysis(
              "Inner Side",
              result.right.inner,
              rightImages.inner,
            )}

            {renderAnalysis(
              "Outer Side",
              result.right.outer,
              rightImages.outer,
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* KEY FINDINGS */}

        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
          Key Findings
        </Typography>

        <Box
          component="ul"
          sx={{
            mt: 0,
            pl: 2.5,
          }}
        >
          {result.overall &&
            result.overall.keyFindings &&
            result.overall.keyFindings.map((item, index) => (
              <Typography component="li" key={index} sx={{ mb: 0.7 }}>
                {item}
              </Typography>
            ))}
        </Box>

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
          {result.overall &&
            result.overall.potentialFutureConcerns &&
            result.overall.potentialFutureConcerns.map((issue, index) => (
              <Typography component="li" key={index} sx={{ mb: 0.7 }}>
                {issue}
              </Typography>
            ))}
        </Box>

        {/* RECOMMENDATIONS */}

        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
          Recommendations
        </Typography>

        <Box
          component="ul"
          sx={{
            mt: 0,
            pl: 2.5,
          }}
        >
          {result.overall &&
            result.overall.recommendations &&
            result.overall.recommendations.map((item, index) => (
              <Typography component="li" key={index} sx={{ mb: 0.7 }}>
                {item}
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

        {error && error.length > 0 && (
          <Container maxWidth="md">
            <Typography variant="body1" color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          </Container>
        )}

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
