import { AppBar, Container, Stack, Toolbar, Typography, IconButton } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Material UI standard back arrow
import { APP_NAME } from "../utils/constants";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Condition to check if the user is NOT on the root homepage
  const showBackButton = location.pathname !== "/";

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            justifyContent: "space-between",
            minHeight: 72,
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              textDecoration: "none",
              alignItems: "center",
            }}
          >
            {/* Conditional Back Button render */}
            {showBackButton && (
              <IconButton
                onClick={() => navigate(-1)} // Navigates one step back in history
                color="inherit"
                aria-label="go back"
                sx={{ mr: 0.5 }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}

            <Typography
              component={Link}
              to="/"
              variant="h6"
              sx={{
                fontWeight: 800,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              {APP_NAME}
            </Typography>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
