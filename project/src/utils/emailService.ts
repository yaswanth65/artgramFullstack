// Email service utility for sending notifications
export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
}

export interface ManagerInviteData {
  name: string;
  email: string;
  branchName: string;
  temporaryPassword: string;
  loginUrl: string;
}

export interface PasswordResetData {
  name: string;
  email: string;
  resetToken: string;
  resetUrl: string;
}

// Generate temporary password
export const generateTemporaryPassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Generate reset token
export const generateResetToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Create manager invitation email template
export const createManagerInviteEmail = (data: ManagerInviteData): EmailTemplate => {
  return {
    to: data.email,
    subject: 'Welcome to Craft Factory - Manager Account Created',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ea580c, #f97316); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .credentials { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ea580c; }
          .button { display: inline-block; background: #ea580c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎨 Welcome to Craft Factory!</h1>
            <p>Your Manager Account Has Been Created</p>
          </div>
          <div class="content">
            <h2>Hello ${data.name},</h2>
            <p>Congratulations! You have been assigned as a Branch Manager for <strong>${data.branchName}</strong>.</p>
            
            <div class="credentials">
              <h3>🔐 Your Login Credentials:</h3>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Temporary Password:</strong> <code style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px;">${data.temporaryPassword}</code></p>
            </div>
            
            <p><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
            
            <div style="text-align: center;">
              <a href="${data.loginUrl}" class="button">Login to Dashboard</a>
            </div>
            
            <h3>📋 Your Responsibilities:</h3>
            <ul>
              <li>Manage branch operations and events</li>
              <li>Process and track customer orders</li>
              <li>Verify QR codes for event bookings</li>
              <li>Update order statuses and tracking information</li>
            </ul>
            
            <p>If you have any questions or need assistance, please contact the admin team.</p>
          </div>
          <div class="footer">
            <p>© 2024 Craft Factory. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

// Create password reset email template
export const createPasswordResetEmail = (data: PasswordResetData): EmailTemplate => {
  return {
    to: data.email,
    subject: 'Craft Factory - Password Reset Request',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .reset-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
            <p>Craft Factory Manager Portal</p>
          </div>
          <div class="content">
            <h2>Hello ${data.name},</h2>
            <p>We received a request to reset your password for your Craft Factory manager account.</p>
            
            <div class="reset-info">
              <h3>🔑 Reset Your Password:</h3>
              <p>Click the button below to reset your password. This link will expire in 1 hour for security purposes.</p>
              
              <div style="text-align: center;">
                <a href="${data.resetUrl}" class="button">Reset Password</a>
              </div>
              
              <p><strong>Reset Token:</strong> <code style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px;">${data.resetToken}</code></p>
            </div>
            
            <div class="warning">
              <p><strong>⚠️ Security Notice:</strong></p>
              <ul>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>This link will expire in 1 hour</li>
                <li>Never share your reset token with anyone</li>
              </ul>
            </div>
            
            <p>If you're having trouble with the button above, copy and paste the following URL into your browser:</p>
            <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 4px;">${data.resetUrl}</p>
          </div>
          <div class="footer">
            <p>© 2024 Craft Factory. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

// Simulate sending email (in real app, this would integrate with email service like SendGrid, Mailgun, etc.)
export const sendEmail = async (emailData: EmailTemplate): Promise<boolean> => {
  try {
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In development, log the email content
    console.log('📧 Email Sent:', {
      to: emailData.to,
      subject: emailData.subject,
      // html: emailData.html // Uncomment to see full HTML in console
    });
    
    // Show notification to admin
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      font-family: Arial, sans-serif;
      max-width: 300px;
    `;
    notification.innerHTML = `
      <div style="display: flex; align-items: center;">
        <span style="margin-right: 10px;">✅</span>
        <div>
          <div style="font-weight: bold;">Email Sent!</div>
          <div style="font-size: 14px; opacity: 0.9;">Sent to ${emailData.to}</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
    
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

// Email service functions
export const sendManagerInvite = async (data: ManagerInviteData): Promise<boolean> => {
  const emailTemplate = createManagerInviteEmail(data);
  return await sendEmail(emailTemplate);
};

export const sendPasswordReset = async (data: PasswordResetData): Promise<boolean> => {
  const emailTemplate = createPasswordResetEmail(data);
  return await sendEmail(emailTemplate);
};