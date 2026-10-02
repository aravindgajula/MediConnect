import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../Context/authStore.js";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Import Link component for navigation
import { ArrowLeft } from "lucide-react"; // Import ArrowLeft icon

const ForgotOtpPage = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const { isLoading, verifyOtp } = useAuthStore();

    const handleChange = (index, value) => {
        const newOtp = [...otp];
        if (value.length > 1) {
            const pastedOtp = value.slice(0, 6).split("");
            for (let i = 0; i < 6; i++) {
                newOtp[i] = pastedOtp[i] || "";
            }
            setOtp(newOtp);
            const focusIndex = newOtp.includes("") ? newOtp.indexOf("") : 5;
            inputRefs.current[focusIndex]?.focus();
        } else {
            newOtp[index] = value;
            setOtp(newOtp);
            if (value && index < 5) inputRefs.current[index + 1]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpCode = otp.join("");
        if (otpCode.length === 6) {
            try {
                const response = await verifyOtp(otpCode);
                if (response.success) {
                    toast.success("OTP verified! Redirecting to reset password page...");
                    navigate(`/reset-password/${otpCode}`);
                } else {
                    toast.error(response.message || "Invalid OTP.");
                }
            } catch (error) {
                toast.error(error.message || "Error verifying OTP.");
            }
        } else {
            toast.error("Please enter a valid 6-digit OTP.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-green-100">
            <motion.div
                className="w-full max-w-lg p-10 text-white bg-gray-900 shadow-xl rounded-2xl"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                <h2 className="mb-6 text-3xl font-bold text-center">Verify OTP</h2>
                <p className="mb-6 text-center text-gray-300">Enter the 6-digit OTP sent to your email.</p>

                <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="flex justify-between gap-4">
                        {otp.map((digit, index) => (
                            <motion.input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                className="text-3xl font-bold text-center text-white bg-gray-700 border-2 border-gray-600 rounded-lg w-14 h-14 focus:border-green-500 focus:outline-none"
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            />
                        ))}
                    </div>

                    <motion.button
                        type="submit"
                        disabled={isLoading || otp.some((digit) => !digit)}
                        className="w-full py-3 font-bold bg-purple-500 rounded-xl hover:bg-purple-600 focus:outline-none disabled:opacity-50"
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                    >
                        {isLoading ? "Verifying..." : "Verify OTP"}
                    </motion.button>
                </motion.form>

                {/* Back to Login Link */}
                <div className="mt-4 text-sm text-center">
                    <Link to="/login" className="flex items-center justify-center text-blue-400 hover:underline">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotOtpPage;
