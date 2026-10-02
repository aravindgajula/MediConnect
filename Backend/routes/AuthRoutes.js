import express from 'express';

import { registerUser,loginUser,logoutUser,verifyEmail,forgotPassword,resetPassword,checkAuth,verifyForgotOtp } from '../controllers/AuthController.js';
import { authUser } from '../middlewares/authUser.js';

const authRouter=express.Router();
authRouter.post('/signup',registerUser);
authRouter.post('/login',loginUser);
authRouter.post("/verify-email",verifyEmail);
authRouter.post("/logout",logoutUser);
authRouter.post("/forgot-password",forgotPassword);
authRouter.post("/verify-otp", verifyForgotOtp); 
authRouter.post("/reset-password/:token",resetPassword);
authRouter.get("/check-auth", authUser, checkAuth);
export default authRouter;