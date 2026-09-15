/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Container,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { analyzeImageApi } from "../api/analyze.api";
import FootUploader from "../components/FootUploader";
import { APP_NAME, BASE_URL_ONLY } from "../utils/constants";
import Layout from "../components/wrapper/Layout";

const bloodGroups = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

const PlantarScanPage = () => {
  const [leftFoot, setLeftFoot] = useState<File | null>(null);
  const [rightFoot, setRightFoot] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  // Form
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState<"" | "Male" | "Female" | "Others">("");
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [bloodGroup, setBloodGroup] = useState("");
  const [smoker, setSmoker] = useState(false);
  const [drinker, setDrinker] = useState(false);

  const handleAnalyze = async () => {
    try {
      setError("");
      setResult(null);
      setLoading(true);
      const result = await analyzeImageApi(leftFoot!, rightFoot!);
      setResult(result);
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
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

        {/* Smoker / Drinker */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1,
            px: 1,
            py: 0.25,
            borderRadius: 1,
            gridColumn: {
              xs: "1 / -1",
              sm: "span 1",
            },
          }}
        >
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={smoker}
                onChange={(e) => setSmoker(e.target.checked)}
              />
            }
            label="Smoker"
            sx={{
              mr: 1,
              "& .MuiFormControlLabel-label": {
                fontSize: 13,
              },
            }}
          />

          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={drinker}
                onChange={(e) => setDrinker(e.target.checked)}
              />
            }
            label="Drinker"
            sx={{
              mr: 0,
              "& .MuiFormControlLabel-label": {
                fontSize: 13,
              },
            }}
          />
        </Box>
      </Box>

      {/* Foot Uploaders */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: 3,
          p: {
            xs: 2,
            md: 4,
          },
          maxWidth: "1400px",
          mx: "auto",
        }}
      >
        {/* Left Foot */}
        <FootUploader
          side="left"
          image={leftFoot}
          onUpload={setLeftFoot}
          onRetake={() => setLeftFoot(null)}
        />

        {/* Right Foot */}
        <FootUploader
          side="right"
          image={rightFoot}
          onUpload={setRightFoot}
          onRetake={() => setRightFoot(null)}
        />
      </Box>

      {error && error.length > 0 && (
        <Container maxWidth="md">
          <Typography variant="body1" color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        </Container>
      )}

      <Box sx={{ p: 2, textAlign: "center" }}>
        <Button variant="contained" onClick={handleAnalyze} disabled={loading}>
          {loading ? "Analyzing Pressure..." : "Analyze Foot Pressure"}
        </Button>
      </Box>
      {result && (
        <>
          <Button
            variant="contained"
            onClick={() => window.print()}
            sx={{
              mb: 2,
              display: "block",
              mx: "auto",
            }}
          >
            Print Report
          </Button>

          <Box
            id="plantar-report"
            sx={{
              mx: "auto",
              // p: { xs: 1, sm: 2, md: 4 },
              // backgroundColor: "#f5f5f5",
              maxWidth: "1400px",
            }}
          >
            <Box
              sx={{
                mx: "auto",
                p: { xs: 1, sm: 2, md: 4 },
                backgroundColor: "#f5f5f5",
              }}
            >
              {/* ================= REPORT ================= */}
              <Box
                sx={{
                  backgroundColor: "#fff",
                  border: "1px solid #333",
                  p: { xs: 2, sm: 3, md: 4 },
                  boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
                }}
              >
                {/* ================= HEADER ================= */}
                <Box
                  sx={{
                    textAlign: "center",
                    borderBottom: "1px solid #333",
                    pb: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: 20, md: 25 },
                      color: "#a33b2e",
                      letterSpacing: 0.5,
                    }}
                  >
                    {APP_NAME?.toUpperCase()} REPORT
                  </Typography>
                </Box>

                {/* ================= PATIENT DETAILS ================= */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    borderBottom: "1px solid #333",
                  }}
                >
                  {/* Patient */}
                  <Box
                    sx={{
                      p: 1.5,
                      borderRight: { md: "1px solid #333" },
                    }}
                  >
                    <Typography sx={{ fontSize: 14 }}>
                      <b>Name :</b> {name || "-"}
                    </Typography>

                    <Typography sx={{ fontSize: 14 }}>
                      <b>Patient ID :</b> -
                    </Typography>
                  </Box>

                  {/* Age / Gender */}
                  <Box
                    sx={{
                      p: 1.5,
                      borderRight: { md: "1px solid #333" },
                    }}
                  >
                    <Typography sx={{ fontSize: 14 }}>
                      <b>Age / Gender :</b> {age || "-"} / {gender || "-"}
                    </Typography>
                  </Box>

                  {/* Date */}
                  <Box sx={{ p: 1.5 }}>
                    <Typography sx={{ fontSize: 14 }}>
                      <b>Exam Date :</b>{" "}
                      {new Date().toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </Typography>

                    <Typography sx={{ fontSize: 14 }}>
                      <b>Referral :</b> -
                    </Typography>
                  </Box>
                </Box>

                {/* ================= BMI + HABITS ================= */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    borderBottom: "1px solid #333",
                  }}
                >
                  {/* BMI */}
                  <Box
                    sx={{
                      p: 1.5,
                      borderRight: { md: "1px solid #333" },
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: 14,
                        mb: 0.5,
                      }}
                    >
                      BMI details
                    </Typography>

                    <Typography sx={{ fontSize: 13 }}>
                      • Height : {height || 0} Cms
                    </Typography>

                    <Typography sx={{ fontSize: 13 }}>
                      • Weight : {weight || 0} Kgs
                    </Typography>

                    <Typography sx={{ fontSize: 13 }}>
                      • BMI :{" "}
                      {height && weight
                        ? (weight / Math.pow(height / 100, 2)).toFixed(1)
                        : 0}{" "}
                      Kg/m²
                    </Typography>
                  </Box>

                  {/* Habits */}
                  <Box
                    sx={{
                      p: 1.5,
                      borderRight: { md: "1px solid #333" },
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: 14,
                        mb: 0.5,
                      }}
                    >
                      Habits & Others
                    </Typography>

                    <Typography sx={{ fontSize: 13 }}>
                      • Blood Group : {bloodGroup || "-"}
                    </Typography>

                    <Typography sx={{ fontSize: 13 }}>
                      • Smoker : {smoker ? "Yes" : "No"}
                    </Typography>

                    <Typography sx={{ fontSize: 13 }}>
                      • Drinker : {drinker ? "Yes" : "No"}
                    </Typography>
                  </Box>

                  {/* Empty area like original report */}
                  <Box sx={{ minHeight: 100 }} />
                </Box>

                {/* ================= FOOT SCANS ================= */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 0.4fr 1fr",
                    gap: { xs: 2, md: 1 },
                    alignItems: "center",
                    pt: 2,
                    pb: 0.5,
                  }}
                >
                  {/* LEFT FOOT */}
                  <Box
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: 18,
                        mb: 1,
                      }}
                    >
                      Left Foot
                    </Typography>

                    <Box
                      component="img"
                      src={`${BASE_URL_ONLY}${result.left.heatmap}`}
                      alt="Left foot pressure"
                      sx={{
                        width: "100%",
                        maxWidth: 350,
                        height: 450,
                        objectFit: "contain",
                        display: "block",
                        mx: "auto",
                        border: "1px solid #333",
                      }}
                    />
                  </Box>

                  {/* ================= LEGEND ================= */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      px: 1,
                    }}
                  >
                    {[
                      {
                        color: "#b52b20",
                        label: "Very High Pressure",
                      },
                      {
                        color: "#d98228",
                        label: "High Pressure",
                      },
                      {
                        color: "#f0c928",
                        label: "Mild Pressure",
                      },
                      {
                        color: "#75a866",
                        label: "Normal Pressure",
                      },
                      {
                        color: "#1751a5",
                        label: "Less Pressure",
                      },
                      {
                        color: "#fff",
                        label: "No contact areas",
                        border: true,
                      },
                    ].map((item) => (
                      <Box
                        key={item.label}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: 14,
                            height: 14,
                            flexShrink: 0,
                            backgroundColor: item.color,
                            border: item.border
                              ? "1px solid #333"
                              : "1px solid transparent",
                          }}
                        />

                        <Typography
                          sx={{
                            fontSize: 12,
                            lineHeight: 1.2,
                          }}
                        >
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* RIGHT FOOT */}
                  <Box
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: 18,
                        mb: 1,
                      }}
                    >
                      Right Foot
                    </Typography>

                    <Box
                      component="img"
                      src={`${BASE_URL_ONLY}${result.right.heatmap}`}
                      alt="Right foot pressure"
                      sx={{
                        width: "100%",
                        maxWidth: 350,
                        height: 450,
                        objectFit: "contain",
                        display: "block",
                        mx: "auto",
                        border: "1px solid #333",
                      }}
                    />
                  </Box>
                </Box>

                {/* ================= COMMENTS ================= */}
                <Box
                  sx={{
                    border: "1px solid #333",
                    minHeight: 100,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#173b70",
                      fontSize: 15,
                      p: 1.5,
                      borderBottom: "1px solid #333",
                    }}
                  >
                    COMMENTS:
                  </Typography>
                </Box>

                {/* ================= INTERNAL FACULTY ================= */}
                <Box
                  sx={{
                    border: "1px solid #333",
                    minHeight: 150,
                    position: "relative",
                    p: 1.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#173b70",
                      fontSize: 15,
                    }}
                  >
                    INTERNAL FACULTY:
                  </Typography>

                  <Typography sx={{ fontSize: 13, mb: 1 }}>
                    Consultant : Dr. ______________________
                  </Typography>

                  <Typography sx={{ fontSize: 13 }}>
                    Specialisation : ______________________
                  </Typography>

                  <Typography
                    sx={{
                      position: "absolute",
                      right: 20,
                      bottom: 25,
                      fontSize: 13,
                    }}
                  >
                    (Technician)
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <style>
            {`
      @media print {
        body * {
          visibility: hidden;
        }

        #plantar-report,
        #plantar-report * {
          visibility: visible;
        }

        #plantar-report {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;

           /* Force exact size based on your 10mm margins */
          width: calc(210mm - 20mm);  /* A4 Width minus margins */
          height: calc(297mm - 20mm); /* A4 Height minus margins */

          max-width: none;
          margin: 0;
          padding: 0;
          background: white;
          box-shadow: none;

           /* Prevent page overflows */
          overflow: hidden;
          box-sizing: border-box;

          /* CSS Grid/Flex is best to keep internal elements packed tightly */
          display: flex;
          flex-direction: column;
          justify-content: space-between;

           /* Ensure no trailing page breaks are generated from this container */
          page-break-after: avoid !important;
          break-after: avoid !important;
        }

        @page {
          size: A4 portrait;
        }
      }
    `}
          </style>
        </>
      )}
    </Layout>
  );
};

export default PlantarScanPage;
