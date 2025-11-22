import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

interface ContactFormData {
  name: string;
  email: string;
  whatsapp: string;
  phone: string;
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, whatsapp, phone, message }: ContactFormData = req.body;

  // Validate required fields
  if (!name || !email || !whatsapp || !phone || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not set');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    const resend = new Resend(apiKey);
    const fromEmail = process.env.RESEND_FROM || 'StriveGo <onboarding@resend.dev>';

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: 'nelsonochieng516@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      text: `
New contact form submission from Trendy Fashion Zone website:

Name: ${name}
Email: ${email}
WhatsApp: ${whatsapp}
Phone: ${phone}

Message:
${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1bbfb3;">New Contact Form Submission</h2>
          <p>You have received a new message from the Trendy Fashion Zone website:</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>WhatsApp:</strong> ${whatsapp}</p>
            <p><strong>Phone:</strong> ${phone}</p>
          </div>
          
          <div style="margin-top: 20px;">
            <h3 style="color: #333;">Message:</h3>
            <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #1bbfb3; border-radius: 4px;">
              ${message.replace(/\n/g, '<br>')}
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ 
        error: 'Failed to send email',
        message: error.message || 'An error occurred while sending the email'
      });
    }

    return res.status(200).json({ success: true, message: 'Email sent successfully', data });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return res.status(500).json({ 
      error: 'Failed to send email',
      message: error.message || 'An error occurred while sending the email'
    });
  }
}

