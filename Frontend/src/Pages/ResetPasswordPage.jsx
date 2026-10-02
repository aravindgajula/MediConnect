import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Lock, Loader, ArrowLeft } from "lucide-react";
import Input from "../Components/Input";
import { useAuthStore } from "../Context/authStore.js";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Import Link for the back-to-login link

const ResetPasswordPage = () => {
    const { otp } = useParams(); // Get OTP from URL
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const { resetPassword, isLoading } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Password validation
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (password.length < 8) {
            toast.error("Password should be at least 8 characters long");
            return;
        }
    
        try {
            const response = await resetPassword(otp, password); // ✅ Corrected: Passing otp
            if (response?.success) {
                toast.success("Password reset successfully! Redirecting to login...");
                setTimeout(() => navigate("/login"), 2000);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error resetting password");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-green-100">
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col justify-between w-full max-w-md p-8 text-white bg-gray-900 shadow-2xl rounded-2xl"
            >
                <h2 className="text-3xl font-bold text-center">Reset Password</h2>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                        <Input
                            icon={Lock}
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
                        <Input
                            icon={Lock}
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="w-full py-3 font-bold bg-purple-500 rounded-xl hover:bg-purple-600 focus:outline-none"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader className="mx-auto animate-spin" size={24} /> : "Set New Password"}
                    </motion.button>
                </form>

                {/* Back to Login link below the button */}
                <div className="mt-4 text-sm text-center">
                    <Link to="/login" className="flex items-center justify-center text-blue-400 hover:underline">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPasswordPage;
