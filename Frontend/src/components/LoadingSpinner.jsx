import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeartbeat } from "react-icons/fa";

const LoadingSpinner = () => {
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setShowLogin(true);
        }, 5000);
    }, []);

    return (
        <>
            {!showLogin ? (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-green-100">
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1, rotate: 360 }}
                        transition={{ duration: 1 }}
                        className="mb-6 text-blue-500"
                    >
                        <FaHeartbeat size={80} />
                    </motion.div>

                   
                    <div className="relative flex space-x-2 text-5xl font-bold">
                        {["M", "E", "D", "I"].map((letter, index) => (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2, duration: 0.5 }}
                                className="text-blue-600"
                            >
                                {letter}
                            </motion.span>
                        ))}
                        {["C", "O", "N", "N", "E", "C", "T"].map((letter, index) => (
                            <motion.span
                                key={index + 4}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: (index + 4) * 0.2, duration: 0.5 }}
                                className="text-green-600"
                            >
                                {letter}
                            </motion.span>
                        ))}
                    </div>

                    
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "120px" }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="w-0 h-2 mt-1 border-t-4 border-blue-500 rounded-full"
                    />

                   
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2.5, duration: 1 }}
                        className="mt-4 text-lg text-gray-600"
                    >
                        BRIDGING THE HEALTHCARE GAP
                    </motion.p>
                </div>
            ) : (
                navigate("/signup") 
            )}
        </>
    );
};

export default LoadingSpinner;
