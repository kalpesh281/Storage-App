import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import UploadPage from "./Pages/UploadPage";
import ViewMediaPage from "./Pages/ViewMediaPage";
import WelcomeAnimation from "./Components/WelcomeAnimation";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeAnimation />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/view-media" element={<ViewMediaPage />} />
      </Routes>
    </Router>
  );
}

export default App;
