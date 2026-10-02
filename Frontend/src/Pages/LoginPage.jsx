import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader } from "lucide-react";
import Input from "../Components/Input";
import { useAuthStore } from "../Context/authStore";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; 

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await login(email, password);
            if (response.success) {
                navigate("/");
            } else {
                toast.error(response.message || "Invalid credentials");  
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed. Please try again.");
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
                {/* Heading */}
                <h2 className="text-3xl font-bold text-center">Welcome Back</h2>

                {/* Form */}
                <form onSubmit={handleLogin} className="mt-6 space-y-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Input
                            icon={Mail}
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Input
                            icon={Lock}
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </motion.div>

                    {/* Login Button */}
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="w-full py-3 font-bold bg-purple-500 rounded-xl hover:bg-purple-600 focus:outline-none"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader className="mx-auto animate-spin" size={24} /> : "Login"}
                    </motion.button>
                </form>

                {/* Signup Link */}
                <div className="mt-4 text-center">
                    <p>
                        Don't have an account?{" "}
                        <span
                            className="text-blue-400 cursor-pointer hover:underline"
                            onClick={() => navigate("/signup")}
                        >
                            Sign up
                        </span>
                    </p>
                </div>
                
                <div className="mt-2 text-center">
                    <p>
                        <span
                            className="text-blue-400 cursor-pointer hover:underline"
                            onClick={() => navigate("/forgot-password")}
                        >
                            Forgot your password?
                        </span>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
