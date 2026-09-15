import "./App.css";
import { CssBaseline } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import PlantarScanPage from "./pages/PlantarScan.page";
import LimbScanPage from "./pages/LimbScan.page";
import HomePage from "./pages/Home.page";
import { useEffect } from "react";
import { APP_NAME } from "./utils/constants";

function App() {
  useEffect(() => {
    try {
      document.title = APP_NAME;
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/plantar-scan" element={<PlantarScanPage />} />
        <Route path="/limb-scan" element={<LimbScanPage />} />
      </Routes>
    </>
  );
}

export default App;
