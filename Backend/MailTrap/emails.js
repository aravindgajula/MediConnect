import { transporter, sender } from "./mailtrap.js"; 
import { 
  PASSWORD_RESET_REQUEST_TEMPLATE, 
  PASSWORD_RESET_SUCCESS_TEMPLATE, 
  VERIFICATION_EMAIL_TEMPLATE, 
  WELCOME_EMAIL_TEMPLATE 
} from "./emailTemplates.js";

// Send Verification Email
export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const emailContent = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken);

        await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: "Verify Your Email",
            html: emailContent,
        });

        return { success: true, message: "Verification email sent successfully" };
    } catch (error) {
        console.error("Error sending verification email:", error);
        return { success: false, message: "Error while sending verification email" };
    }
};

// Send Welcome Email
export const sendWelcomeEmail = async (email, name) => {
    try {
        const emailContent = WELCOME_EMAIL_TEMPLATE
            .replace("{userName}", name)
            .replace("{dashboardURL}", "https://yourwebsite.com/dashboard");

        await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: "Welcome to Our Platform! 🎉",
            html: emailContent,
        });

        return { success: true, message: "Welcome email sent successfully" };
    } catch (error) {
        console.error("Error sending welcome email:", error);
        return { success: false, message: "Error while sending welcome email" };
    }
};

// Send Password Reset Email
// sendPasswordResetEmail with OTP
export const sendPasswordResetEmail = async (email, otp) => {
    try {
        const emailContent = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{otp}", otp);  

        await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: "Reset Your Password",
            html: emailContent,  
        });

        return { success: true, message: "Password reset email sent successfully" };
    } catch (error) {
        console.error("Error sending password reset email:", error);
        return { success: false, message: "Error while sending password reset email" };
    }
};


// Send Password Reset Success Email
export const sendResetSuccessEmail = async (email) => {
    try {
        await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: "Password Reset Successful ✅",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        });

        return { success: true, message: "Password reset success email sent successfully" };
    } catch (error) {
        console.error("Error sending password reset success email:", error);
        return { success: false, message: "Error while sending password reset success email" };
    }
};
