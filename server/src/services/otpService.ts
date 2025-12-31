import bcrypt from "bcryptjs";
import { supabase } from "../config/supabase";


// This file owns:
// OTP generation
// Hashing
// Saving to tbl_user

export const generateAndStoreOtp = async (email: string) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otp, 10);

  const { error } = await supabase
    .from("tbl_user")
    .upsert(
      {
        email,
        otp_hash: otpHash,
        otp_expires_at: new Date(Date.now() + 5 * 60 * 1000),
        attempts: 0,
        last_otp_sent_at: new Date(),
      },
      { onConflict: "email" }
    );

  if (error) throw error;

  return otp;
};
