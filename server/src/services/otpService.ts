import bcrypt from "bcryptjs";
import { supabase } from "../config/supabase";


// This file owns:
// OTP generation
// Hashing
// Saving to tbl_user

export const generateAndStoreOtp = async (email: string) => {
  // 1. Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // 2. Hash OTP
  const otpHash = await bcrypt.hash(otp, 10);

  // 3. Save to Supabase
  const { error } = await supabase
    .from("tbl_user")
    .upsert({
      email,
      otp_hash: otpHash,
      expires_at: new Date(Date.now() + 5 * 60 * 1000),
      attempts: 0,
      last_login_attempt: new Date(),
    });

  if (error) throw error;

  return otp; // plain OTP only returned to caller
};
