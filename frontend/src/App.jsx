
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./pages/login";
import Home from "./pages/Home";
import Tutor from "./pages/Tutor";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import Progress from "./pages/Progress";
import Onboarding from "./pages/Onboarding";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";

function AppContent() {
  const location = useLocation();

  const isAuthPage =
  location.pathname === "/login" ||
  location.pathname === "/signup";
  return (
    <>
        {!isAuthPage && <Navbar />}
      <Routes>

        {/* HOME */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />

        {/* MAIN PAGES */}
        <Route path="/tutor" element={<Tutor />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/progress" element={<Progress />} />

        {/* AUTHENTICATION */}
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />

        {/* UNKNOWN ROUTES */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;