import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from "crypto";
import userModel from "../models/userModel.js";
import { generateTokenAndSetCookie } from './generateTokenAndSetCookie.js';
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from '../MailTrap/emails.js';

import validator from "validator";
dotenv.config();

export const registerUser = async (req, res) => {
    try 
    {
        const { name, email,password } = req.body;
       
        if (!name || !email || !password) return res.json({ success: false, message: "All fields are required" });
        

        if (!validator.isEmail(email))  return res.json({ success: false, message: "Invalid email format" });
        

        if (password.length < 8) return res.json({ success: false, message: "Password should Contain at least 8 characters" });

        const userExists = await userModel.findOne({ email });
        if (userExists)  return res.json({ success: false, message: "User already exists" });
        

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        });

        await newUser.save();

        const token=generateTokenAndSetCookie(res, newUser._id);
        await sendVerificationEmail(newUser.email, verificationToken);

        res.json({ success: true, message: "User registered successfully. Please verify your email.", token: token });

    } 
    catch (error) 
    {
        console.error("Error in registration:", error);
        res.json({ success: false, message: "Error While Registering The User" });
    }
};


export const verifyEmail = async (req, res) => {
    try 
    {
        const { code } = req.body;
        
        const user = await userModel.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        if (!user)  return res.json({ success: false, message: "Invalid or expired verification code" });
        

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.json({ success: true, message: "Email verified successfully and welcome email sent" });

    } 
    catch (error) 
    {
        console.error("Error in email verification:", error);
        res.json({ success: false, message: "Verification failed" });
    }
};


export const loginUser = async (req, res) => {
    try 
    {
        const { email, password } = req.body;
        
        
        if (!email || !password) return res.json({ success: false, message: "All fields are required" });
        

        const user = await userModel.findOne({ email });
        if (!user)  return res.json({ success: false, message: "Invalid credentials" });
        

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ success: false, message: "Enter Correct Password" });
        

        const token=generateTokenAndSetCookie(res, user._id);
        user.lastLogin = new Date();
        await user.save();

        res.json({ success: true, message: "Login successful" , token: token});

    } 
    catch (error) 
    {
        console.error("Error in login:", error);
        res.json({ success: false, message: "Error While Login The User" });
    }
};


export const logoutUser = async (req, res) => {
    res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    res.json({ success: true, message: "Logged out successfully" });
};


export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) return res.json({ success: false, message: "User not found" });

       
        const otp = Math.floor(100000 + Math.random() * 900000).toString();  
        user.resetPasswordToken = otp;  
        user.resetPasswordExpiresAt = Date.now() + 10 * 60 * 1000;  
        await user.save();

        
        await sendPasswordResetEmail(user.email, otp);

        res.json({ success: true, message: "OTP sent to your registered email" });
    } catch (error) {
        console.error("Error in forgot password:", error);
        res.json({ success: false, message: "Error while sending OTP" });
    }
};



export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;  
        const { password } = req.body;
        const user = await userModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }  
        });

        if (!user) return res.json({ success: false, message: "Invalid or expired OTP" });

        
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);  

        res.json({ success: true, message: "Password reset successfully",user });
    } catch (error) {
        console.error("Error in reset password:", error);
        res.json({ success: false, message: "Error while resetting your password" });
    }
};


export const verifyForgotOtp = async (req, res) => {
    try {
        const { otp } = req.body;  

        const user = await userModel.findOne({
            resetPasswordToken: otp,
            resetPasswordExpiresAt: { $gt: Date.now() },  
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        res.json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
        console.error("Error in OTP verification:", error);
        res.status(500).json({ success: false, message: "Error verifying OTP" });
    }
};


export const checkAuth = async (req, res) => {
	try 
    {
		const user = await userModel.findById(req.userId).select("-password");
		if (!user) return res.json({ success: false, message: "User not found" });
		res.json({ success: true, user });
	} 
    catch (error) 
    {
		console.log("Error in checkAuth ", error);
		res.json({ success: false, message: error.message });
	}

};
