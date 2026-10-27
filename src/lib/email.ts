import { Resend } from 'resend';
import prisma from '@/lib/prisma';
import { normalizeContactInfo, DEFAULT_CONTACT_INFO } from '@/lib/content';

export interface SendEnquiryEmailParams {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  productName?: string | null;
  categoryName?: string | null;
  message: string;
  enquiryId: string;
  source?: 'contact_page' | 'product_detail' | 'hero_quote' | 'general';
}

export interface SendEmailResult {
  sent: boolean;
  messageId?: string;
  recipient?: string;
  error?: string;
}

/**
 * Retrieves the current configured Enquiry Email address from SiteContent (or environment fallback).
 */
export async function getConfiguredEnquiryEmail(): Promise<string> {
  try {
    const contactRecord = await prisma.siteContent.findUnique({
      where: { key: 'contact_info' },
    });
    const info = normalizeContactInfo(contactRecord);
    if (info.enquiryEmail && info.enquiryEmail.trim()) {
      return info.enquiryEmail.trim();
    }
    if (info.email && info.email.trim()) {
      return info.email.trim();
    }
  } catch (e) {
    console.warn('[Email] Failed to load enquiry email from siteContent:', e);
  }

  return process.env.ENQUIRY_NOTIFICATION_EMAIL || DEFAULT_CONTACT_INFO.email || 'admin@sherman-india.com';
}

/**
 * Dispatches an enquiry notification email via Resend to the configured Enquiry Email.
 */
export async function sendEnquiryNotificationEmail(
  params: SendEnquiryEmailParams
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = await getConfiguredEnquiryEmail();

  if (!apiKey || !apiKey.trim()) {
    console.warn('[Resend] RESEND_API_KEY environment variable is not configured. Enquiry saved to database, email notification skipped.');
    return {
      sent: false,
      recipient,
      error: 'RESEND_API_KEY environment variable is not configured.',
    };
  }

  const resend = new Resend(apiKey.trim());

  // Sender address: verified domain email or Resend default testing address
  const senderAddress =
    process.env.RESEND_FROM_EMAIL || 'Sherman International <onboarding@resend.dev>';

  const subject = params.productName && params.productName !== 'General Enquiry'
    ? `[Sherman Enquiry] ${params.productName} — ${params.name}`
    : `[Sherman Enquiry] New Website Submission — ${params.name}`;

  const submittedAt = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Website Enquiry</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 24px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    
    <!-- Header -->
    <div style="background-color: #0b192c; padding: 24px 32px; border-bottom: 3px solid #d9a82e;">
      <h2 style="color: #ffffff; margin: 0 0 6px 0; font-size: 20px; font-weight: 700;">SHERMAN INTERNATIONAL (P) LIMITED</h2>
      <p style="color: #cbd5e1; margin: 0; font-size: 13px;">New Customer Website Enquiry &middot; Immediate Notification</p>
    </div>

    <!-- Body Content -->
    <div style="padding: 32px;">
      
      <div style="background-color: #f1f5f9; border-left: 4px solid #1769aa; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
        <span style="font-size: 12px; font-weight: 700; color: #0b192c; text-transform: uppercase; letter-spacing: 0.05em;">Subject / Requirement:</span>
        <div style="font-size: 16px; font-weight: 700; color: #1769aa; margin-top: 4px;">
          ${params.productName || 'General Website Enquiry'}
          ${params.categoryName ? `<span style="font-size: 13px; color: #64748b; font-weight: 400;"> (${params.categoryName})</span>` : ''}
        </div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 600; color: #64748b; width: 140px;">Customer Name:</td>
          <td style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${params.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 600; color: #64748b;">Email Address:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #0f172a;"><a href="mailto:${params.email}" style="color: #1769aa; text-decoration: none; font-weight: 600;">${params.email}</a></td>
        </tr>
        ${params.phone ? `
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 600; color: #64748b;">Phone / Mobile:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #0f172a;"><a href="tel:${params.phone}" style="color: #1769aa; text-decoration: none;">${params.phone}</a></td>
        </tr>` : ''}
        ${params.company ? `
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 600; color: #64748b;">Company / Org:</td>
          <td style="padding: 8px 0; font-size: 14px; color: #0f172a; font-weight: 600;">${params.company}</td>
        </tr>` : ''}
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 600; color: #64748b;">Submission Time:</td>
          <td style="padding: 8px 0; font-size: 13px; color: #64748b;">${submittedAt} IST</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-size: 13px; font-weight: 600; color: #64748b;">Reference ID:</td>
          <td style="padding: 8px 0; font-size: 12px; font-family: monospace; color: #64748b;">${params.enquiryId}</td>
        </tr>
      </table>

      <!-- Message Container -->
      <div style="margin-top: 16px; margin-bottom: 24px;">
        <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">Enquiry Message & Technical Details:</div>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap;">
${params.message}
        </div>
      </div>

      <!-- Quick Action Button -->
      <div style="text-align: center; margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
        <a href="mailto:${params.email}?subject=RE: ${encodeURIComponent(subject)}" style="background-color: #1769aa; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 700; display: inline-block;">Reply Directly to Customer</a>
      </div>

    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 16px 32px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8;">
      This notification was automatically dispatched from the Sherman International website directly to the configured Enquiry Email desk.
    </div>
  </div>
</body>
</html>
  `;

  try {
    const data = await resend.emails.send({
      from: senderAddress,
      to: [recipient],
      replyTo: params.email,
      subject,
      html: htmlContent,
    });

    if (data.error) {
      console.error('[Resend Error]', data.error);
      return {
        sent: false,
        recipient,
        error: data.error.message || 'Resend failed to send email',
      };
    }

    console.log(`[Resend Success] Email accepted with ID: ${data.data?.id} to: ${recipient}`);
    return {
      sent: true,
      messageId: data.data?.id,
      recipient,
    };
  } catch (err: any) {
    console.error('[Resend Exception]', err);
    return {
      sent: false,
      recipient,
      error: err.message || 'Exception occurred during email delivery',
    };
  }
}

export interface SendPasswordResetEmailParams {
  to: string;
  adminName: string;
  resetUrl: string;
  expiresInMinutes?: number;
}

/**
 * Dispatches a secure password reset link to the registered admin email address.
 */
export async function sendPasswordResetEmail(
  params: SendPasswordResetEmailParams
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = params.to;

  if (!apiKey || !apiKey.trim()) {
    console.warn('[Resend] RESEND_API_KEY environment variable is not configured. Reset email skipped.');
    return {
      sent: false,
      recipient,
      error: 'RESEND_API_KEY environment variable is not configured.',
    };
  }

  const resend = new Resend(apiKey.trim());
  const senderAddress =
    process.env.RESEND_FROM_EMAIL || 'Sherman International Security <onboarding@resend.dev>';

  const subject = '[Sherman Admin Portal] Password Reset Request';
  const expiryMinutes = params.expiresInMinutes || 30;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Admin Password Reset Request</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b192c; color: #1e293b; padding: 24px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);">
    
    <!-- Header -->
    <div style="background-color: #061d43; padding: 28px 32px; border-bottom: 3px solid #d9a82e;">
      <h2 style="color: #ffffff; margin: 0 0 4px 0; font-size: 20px; font-weight: 800; letter-spacing: 0.05em;">SHERMAN INTERNATIONAL</h2>
      <p style="color: #cbd5e1; margin: 0; font-size: 13px;">Authorized Administration Portal &middot; Security Access</p>
    </div>

    <!-- Body Content -->
    <div style="padding: 32px 32px 24px 32px;">
      <h3 style="color: #0b192c; margin: 0 0 16px 0; font-size: 18px; font-weight: 700;">Password Reset Request</h3>
      <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 16px 0;">
        Hello <strong>${params.adminName || 'Administrator'}</strong>,
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 24px 0;">
        A request has been submitted to reset the password for your Sherman International administrative account (<code>${recipient}</code>).
      </p>

      <!-- Action Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${params.resetUrl}" style="display: inline-block; background-color: #1769aa; color: #ffffff; font-weight: 700; font-size: 14px; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 10px rgba(23, 105, 170, 0.3);">
          Reset Admin Password
        </a>
      </div>

      <!-- Expiry Notice -->
      <div style="background-color: #f8fafc; border-left: 4px solid #d9a82e; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px; font-size: 13px; color: #475569;">
        <strong>Important:</strong> This single-use reset link is strictly valid for <strong>${expiryMinutes} minutes</strong>. If expired or already used, a new request must be generated.
      </div>

      <p style="font-size: 12px; line-height: 1.5; color: #64748b; margin: 0 0 12px 0;">
        If the button above does not open, copy and paste this secure URL directly into your browser:
      </p>
      <p style="font-size: 11px; word-break: break-all; color: #1769aa; background-color: #f1f5f9; padding: 10px; border-radius: 6px; margin: 0 0 24px 0;">
        ${params.resetUrl}
      </p>

      <p style="font-size: 13px; line-height: 1.5; color: #64748b; margin: 0; border-top: 1px solid #e2e8f0; padding-top: 16px;">
        If you did not request this password reset, please ignore this email. Your current password remains fully secure and unchanged.
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 16px 32px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8;">
      Sherman International (P) Limited &middot; Confidential Administrative Security Dispatch
    </div>
  </div>
</body>
</html>
  `;

  try {
    const data = await resend.emails.send({
      from: senderAddress,
      to: [recipient],
      subject,
      html: htmlContent,
    });

    if (data.error) {
      console.error('[Resend Error]', data.error);
      return {
        sent: false,
        recipient,
        error: data.error.message || 'Resend failed to send password reset email',
      };
    }

    console.log(`[Resend Success] Password reset email accepted with ID: ${data.data?.id} to: ${recipient}`);
    return {
      sent: true,
      messageId: data.data?.id,
      recipient,
    };
  } catch (err: any) {
    console.error('[Resend Exception]', err);
    return {
      sent: false,
      recipient,
      error: err.message || 'Exception during reset email delivery',
    };
  }
}
