import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
}

export const VerificationEmail = ({
  otp
}:{otp:string}) => (
  <div>
    <h1>Welcome Your Verify OTP is , {otp}!</h1>
  </div>
);