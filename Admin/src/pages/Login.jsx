import React, { useState, useContext } from "react";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { Mail, Lock, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // States
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate=useNavigate();
  // Context for admin token and backend URL
  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);

  // Form Submit Handler
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === "Admin") {
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
          navigate("/admin-dashboard");
          
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/doctor/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
          navigate("/doctor-dashboard");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-green-100">
      <motion.div
        className="w-full max-w-md p-8 text-white bg-gray-900 shadow-2xl rounded-2xl"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center">
          <span className="text-white">{state}</span> Login
        </h2>

        {/* Form */}
        <form onSubmit={onSubmitHandler} className="mt-6 space-y-4">
          {/* Email Input */}
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
              required
            />
          </motion.div>

          {/* Password Input */}
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
              required
            />
          </motion.div>

          {/* Login Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full py-3 font-bold bg-purple-500 rounded-xl hover:bg-purple-600 focus:outline-none"
            type="submit"
          >
            Login
          </motion.button>
        </form>

        {/* Toggle Between Admin and Doctor */}
        <div className="mt-4 text-center">
          {state === "Admin" ? (
            <p>
              Doctor Login?{" "}
              <span
                className="text-blue-400 cursor-pointer hover:underline"
                onClick={() => setState("Doctor")}
              >
                Click here
              </span>
            </p>
          ) : (
            <p>
              Admin Login?{" "}
              <span
                className="text-blue-400 cursor-pointer hover:underline"
                onClick={() => setState("Admin")}
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
