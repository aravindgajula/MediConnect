import { Route, Routes, useNavigate, useLocation, matchPath } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Doctors from "./Pages/Doctors";
import MyAppointments from "./Pages/MyAppointments";
import MyProfile from "./Pages/MyProfile";
import Appointment from "./Pages/Appointment";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignUpPage from "./Pages/SignUpPage";
import LoginPage from "./Pages/LoginPage";
import EmailVerificationPage from "./Pages/EmailVerificationPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import ForgotOtpPage from "./Pages/ForgotOtpPage";
import ResetPasswordPage from "./Pages/ResetPasswordPage";
import { useAuthStore } from "./Context/authStore.js";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import { useEffect, useState } from "react";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuth } = useAuthStore();
  const [showSpinner, setShowSpinner] = useState(!sessionStorage.getItem("hasVisited"));

  useEffect(() => {
    if (showSpinner) {
      const timer = setTimeout(() => {
        setShowSpinner(false);
        sessionStorage.setItem("hasVisited", "true");
        if (location.pathname === "/") {
          navigate("/"); 
        }
      }, 3700);
      return () => clearTimeout(timer);
    }
    checkAuth();
  }, [showSpinner, checkAuth, location.pathname, navigate]);

  if (showSpinner) return <LoadingSpinner />;

  
  const authRoutes = ["/login", "/signup", "/forgot-password", "/verify-email", "/verify-otp"];
  const isAuthRoute =
    authRoutes.includes(location.pathname) || matchPath("/reset-password/:otp", location.pathname);

 
  const containerClass = isAuthRoute
    ? "min-h-screen bg-gradient-to-br from-blue-100 to-green-100"
    : "ml-7 mr-7"; 

  return (
    <div className={`${containerClass}`}>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      
      {!isAuthRoute && <Navbar />}

      <Routes>
        
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<ForgotOtpPage />} />
        <Route path="/reset-password/:otp" element={<ResetPasswordPage />} />

       
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/appointment/:docId" element={<Appointment />} />
      </Routes>

     
      {!isAuthRoute && <Footer />}
    </div>
  );
};

export default App;
