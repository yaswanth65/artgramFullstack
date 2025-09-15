import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER || "vmknexgentemp@gmail.com",
        pass: process.env.EMAIL_PASS || "ggpyfvqnsodfoift",
    },
});

export const sendPasswordResetEmail = async (to: string, resetCode: string) => {
    try {
        console.log('📧 Attempting to send email to:', to);
        console.log('📧 From email:', process.env.EMAIL_USER);
        console.log('📧 Email service configured:', !!process.env.EMAIL_USER && !!process.env.EMAIL_PASS);

        const mailOptions = {
            from: `"Artgram" <${process.env.EMAIL_USER}>`,
            to,
            subject: "Password Reset Code - Artgram",
            text: `Your password reset code is: ${resetCode}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this password reset, please ignore this email.\n\nBest regards,\nArtgram Team`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>You have requested to reset your password for your Artgram account.</p>
          <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #666; margin: 0;">Your reset code is:</h3>
            <h1 style="color: #007bff; font-size: 32px; margin: 10px 0;">${resetCode}</h1>
          </div>
          <p><strong>Important:</strong></p>
          <ul>
            <li>This code will expire in 10 minutes</li>
            <li>Enter this code in the "Enter Code" field on the password reset page</li>
            <li>If you didn't request this password reset, please ignore this email</li>
          </ul>
          <p>Best regards,<br>Artgram Team</p>
        </div>
      `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', result.messageId);
        console.log('📧 Email response:', result.response);

        return {
            success: true,
            message: "Password reset email sent successfully!",
            messageId: result.messageId
        };
    } catch (error: any) {
        console.error("❌ Error sending password reset email:", error);
        console.error("❌ Error code:", error.code);
        console.error("❌ Error command:", error.command);
        return { success: false, error: error.message, details: error };
    }
};

export const sendWelcomeEmail = async (to: string, name: string) => {
    try {
        const mailOptions = {
            from: `"Artgram" <${process.env.EMAIL_USER}>`,
            to,
            subject: "Welcome to Artgram!",
            text: `Welcome to Artgram, ${name}!\n\nThank you for joining our creative community. We're excited to have you on board!\n\nBest regards,\nArtgram Team`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Artgram!</h2>
          <p>Hello ${name},</p>
          <p>Thank you for joining our creative community! We're excited to have you on board.</p>
          <p>With Artgram, you can:</p>
          <ul>
            <li>Book creative sessions like Slime Making and Tufting</li>
            <li>Explore our various art activities</li>
            <li>Join our community of art enthusiasts</li>
          </ul>
          <p>Start exploring and let your creativity flow!</p>
          <p>Best regards,<br>Artgram Team</p>
        </div>
      `
        };

        await transporter.sendMail(mailOptions);
        return { success: true, message: "Welcome email sent successfully!" };
    } catch (error: any) {
        console.error("Error sending welcome email:", error);
        return { success: false, error: error.message };
    }
};
