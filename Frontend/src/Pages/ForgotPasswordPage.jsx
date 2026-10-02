import { useState } from "react";
import { useAuthStore } from "../Context/authStore";
import Input from "../Components/Input";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; 

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { isLoading, forgotPassword } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            toast.error("Please enter a valid email address!");
            return;
        }

        try {
            const response = await forgotPassword(email);
            if (response.success) {
                setIsSubmitted(true);
                toast.success("OTP sent! Check your inbox.");
                navigate("/verify-otp");
            } else {
                toast.error(response.message || "Could not send OTP.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error sending OTP. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-green-100">
            <motion.div
                className="w-full max-w-md p-8 text-white bg-gray-900 shadow-2xl rounded-2xl"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }} // Smooth fade-in and slide-up effect
            >
                <h2 className="mb-6 text-3xl font-bold text-center">Forgot Password</h2>

                {!isSubmitted ? (
                    <motion.form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="text-center text-gray-300">
                            Enter your email address, and we’ll send you an OTP to reset your password.
                        </p>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Input icon={Mail} type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
                        </motion.div>
                        
                        <motion.button
                            className="w-full py-3 font-bold bg-purple-500 rounded-xl hover:bg-purple-600 focus:outline-none"
                            type="submit"
                            disabled={isLoading}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            {isLoading ? <Loader className="mx-auto animate-spin" size={24} /> : "Send OTP"}
                        </motion.button>

                        <div className="mt-4 text-sm text-center">
                            <Link to="/login" className="flex items-center justify-center text-blue-400 hover:underline">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                            </Link>
                        </div>
                    </motion.form>
                ) : null}
            </motion.div>
        </div>
    );
};

export default ForgotPasswordPage;
