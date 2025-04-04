// import { resend } from "@/lib/resend";
import { VerificationEmail } from "../../email/VerificationEmail";
import { Resend } from 'resend';

import { ApiSchema } from "@/models/authSchema";

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiSchema> {
  try {
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Fun Chess Verification Code',
      react: VerificationEmail({ otp: verifyCode }),
    });
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
  }
}