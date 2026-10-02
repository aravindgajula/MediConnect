import { transporter, sender } from "./mailtrap.js"; 
import { 
  PASSWORD_RESET_REQUEST_TEMPLATE, 
  PASSWORD_RESET_SUCCESS_TEMPLATE
} from "./emailTemplates.js";

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
