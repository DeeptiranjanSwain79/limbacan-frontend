import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import Layout from "../components/wrapper/Layout";

const HomePage = () => {
  const reportCards = [
    { title: "PlantarScan Report", path: "/plantar-scan", emoji: "👣" },
    { title: "LimbScan Report", path: "/limb-scan", emoji: "🦵" },
  ];

  return (
    <Layout>
      <Box sx={{ p: 4, margin: "0 auto" }}>
        {/* Page Header */}
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          Reports Dashboard
        </Typography>

        {/* Modern CSS Grid Layout Container using Box */}
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: {
              xs: "1fr", // 1 column on mobile screens
              sm: "1fr 1fr", // 2 equal columns on tablet and up
            },
          }}
        >
          {reportCards.map((card, index) => (
            <Card
              key={index}
              variant="outlined"
              sx={{ borderRadius: 2, "&:hover": { boxShadow: 3 } }}
            >
              <CardActionArea component={Link} to={card.path}>
                <CardContent
                  sx={{ display: "flex", alignItems: "center", p: 3 }}
                >
                  <Typography variant="h3" sx={{ mr: 2 }}>
                    {card.emoji}
                  </Typography>
                  <Typography variant="h6" component="div" color="text.primary">
                    {card.title}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Box>
    </Layout>
  );
};

export default HomePage;
