import nodemailer from 'nodemailer';
import { BaseService } from './BaseService';
import config from '../config';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  contactId: string;
}

class EmailService extends BaseService {
  private transporter: nodemailer.Transporter;

  constructor() {
    super('EmailService');
    this.transporter = this.createTransporter();
  }

  private createTransporter(): nodemailer.Transporter {
    if (config.email.service === 'gmail') {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.email.user,
          pass: config.email.password
        }
      });
    } else if (config.email.service === 'smtp') {
      return nodemailer.createTransport({
        host: config.email.host,
        port: config.email.port,
        secure: config.email.secure,
        auth: {
          user: config.email.user,
          pass: config.email.password
        }
      });
    } else {
      // For development/testing - use ethereal email
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: 'ethereal.user@ethereal.email',
          pass: 'ethereal.pass'
        }
      });
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: options.from || config.email.from || 'noreply@blockroll.io',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.htmlToText(options.html)
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logInfo(`Email sent successfully to ${options.to}. MessageId: ${result.messageId}`);
      return true;
    } catch (error) {
      this.logError('Failed to send email', error);
      return false;
    }
  }

  async sendAutoResponder(data: ContactEmailData): Promise<boolean> {
    const html = this.generateAutoResponderHTML(data);
    const text = this.generateAutoResponderText(data);

    return await this.sendEmail({
      to: data.email,
      subject: 'Thank you for contacting BlockRoll - We\'ll be in touch soon!',
      html,
      text
    });
  }

  async sendAdminNotification(data: ContactEmailData): Promise<boolean> {
    const html = this.generateAdminNotificationHTML(data);
    const text = this.generateAdminNotificationText(data);

    return await this.sendEmail({
      to: config.email.adminEmail || 'admin@blockroll.io',
      subject: `New Contact Form Submission: ${data.subject}`,
      html,
      text
    });
  }

  private generateAutoResponderHTML(data: ContactEmailData): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank you for contacting BlockRoll</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .highlight { background: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; margin: 20px 0; border-radius: 4px; }
        .contact-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .social-links { margin: 20px 0; }
        .social-links a { display: inline-block; margin: 0 10px; color: #667eea; text-decoration: none; }
        .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🚀 BlockRoll</div>
        <h1>Thank You for Reaching Out!</h1>
    </div>
    
    <div class="content">
        <p>Hi <strong>${data.name}</strong>,</p>
        
        <p>Thank you for contacting BlockRoll! We've received your message and our team will get back to you within <strong>24 hours</strong>.</p>
        
        <div class="highlight">
            <strong>📋 Your Message Details:</strong><br>
            <strong>Subject:</strong> ${data.subject}<br>
            <strong>Reference ID:</strong> ${data.contactId}<br>
            <strong>Submitted:</strong> ${new Date().toLocaleString()}
        </div>
        
        <div class="contact-info">
            <h3>🛠️ While You Wait</h3>
            <p>Here are some resources that might help:</p>
            <ul>
                <li><strong>📚 Documentation:</strong> <a href="https://docs.blockroll.io">docs.blockroll.io</a></li>
                <li><strong>❓ FAQ:</strong> <a href="https://blockroll.io/faq">blockroll.io/faq</a></li>
                <li><strong>💬 Community:</strong> Join our Discord for instant help</li>
                <li><strong>🐛 Bug Reports:</strong> Use our GitHub issues for technical problems</li>
            </ul>
        </div>
        
        <div class="contact-info">
            <h3>⚡ Need Immediate Help?</h3>
            <p>For urgent matters, you can also reach us via:</p>
            <ul>
                <li><strong>💬 WhatsApp:</strong> Chat with our AI support bot</li>
                <li><strong>📧 Email:</strong> support@blockroll.io</li>
                <li><strong>🐦 Twitter:</strong> @BlockRollApp</li>
            </ul>
        </div>
        
        <div class="social-links">
            <a href="https://twitter.com/BlockRollApp">🐦 Twitter</a>
            <a href="https://discord.gg/blockroll">💬 Discord</a>
            <a href="https://github.com/blockroll">🐙 GitHub</a>
            <a href="https://linkedin.com/company/blockroll">💼 LinkedIn</a>
        </div>
        
        <p>Best regards,<br>
        <strong>The BlockRoll Team</strong></p>
        
        <div class="footer">
            <p>This is an automated response. Please do not reply to this email.</p>
            <p>© 2024 BlockRoll. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
  }

  private generateAutoResponderText(data: ContactEmailData): string {
    return `
Thank You for Contacting BlockRoll!

Hi ${data.name},

Thank you for contacting BlockRoll! We've received your message and our team will get back to you within 24 hours.

Your Message Details:
- Subject: ${data.subject}
- Reference ID: ${data.contactId}
- Submitted: ${new Date().toLocaleString()}

While You Wait:
- Documentation: https://docs.blockroll.io
- FAQ: https://blockroll.io/faq
- Community: Join our Discord for instant help
- Bug Reports: Use our GitHub issues for technical problems

Need Immediate Help?
- WhatsApp: Chat with our AI support bot
- Email: support@blockroll.io
- Twitter: @BlockRollApp

Best regards,
The BlockRoll Team

This is an automated response. Please do not reply to this email.
© 2024 BlockRoll. All rights reserved.
`;
  }

  private generateAdminNotificationHTML(data: ContactEmailData): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Contact Form Submission</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f44336; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
        .message-box { background: white; padding: 15px; border-left: 4px solid #2196f3; margin: 15px 0; }
        .contact-details { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .cta-button { display: inline-block; background: #2196f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔔 New Contact Form Submission</h1>
    </div>
    
    <div class="content">
        <div class="contact-details">
            <h3>Contact Information</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Subject:</strong> ${data.subject}</p>
            <p><strong>Contact ID:</strong> ${data.contactId}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="message-box">
            <h3>Message</h3>
            <p>${data.message.replace(/\n/g, '<br>')}</p>
        </div>
        
        <p><a href="${config.app.baseUrl}/admin/contacts/${data.contactId}" class="cta-button">View in Admin Panel</a></p>
        
        <p><strong>Action Required:</strong> Please respond to this contact within 24 hours.</p>
    </div>
</body>
</html>`;
  }

  private generateAdminNotificationText(data: ContactEmailData): string {
    return `
New Contact Form Submission

Contact Information:
- Name: ${data.name}
- Email: ${data.email}
- Subject: ${data.subject}
- Contact ID: ${data.contactId}
- Submitted: ${new Date().toLocaleString()}

Message:
${data.message}

Action Required: Please respond to this contact within 24 hours.

View in Admin Panel: ${config.app.baseUrl}/admin/contacts/${data.contactId}
`;
  }

  private htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logInfo('Email service connection verified successfully');
      return true;
    } catch (error) {
      this.logError('Email service connection failed', error);
      return false;
    }
  }
}

export default new EmailService();
