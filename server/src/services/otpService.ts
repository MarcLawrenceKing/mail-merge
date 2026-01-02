import bcrypt from "bcryptjs";
import { supabase } from "../config/supabase";


// this function
// - takes email parameter
// - checks the last_login_attempt of target email from the db
// - ignores "no record" error to allow first time logins
// - checks the last_login_attempt if less than N minutes from now , toast message if not
// - generates OTP and hashes it using bcrypt
// - updates the DB records (adds/updates otp_hash, expires_at, attempts, and last_login_attempt)
// - return the created OTP

const OTP_EXPIRY_MS = 1 * 60 * 1000; // 10 mins
const OTP_COOLDOWN_MS = 1 * 60 * 1000;

export const generateAndStoreOtp = async (email: string) => {

  // check last_login_attempt for the single email target
  const { data: existingUser, error: fetchError } = await supabase
    .from("tbl_user")
    .select("last_login_attempt")
    .eq("email", email)
    .single();

  // Allow first-time OTP requests, ignores no record error
  if (fetchError && fetchError.code !== "PGRST116") {
    throw fetchError;
  }

  // if last attenmpt is less than n minutes
  if (
    existingUser?.last_login_attempt &&
    Date.now() - new Date(existingUser.last_login_attempt).getTime() <
      OTP_COOLDOWN_MS
  ) {
    // throw to client toast
    const err = new Error("Retry in a few minutes");
    (err as any).statusCode = 400;
    throw err;
  }

  // generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otp, 10);

  // update db records on OTP request 
  const { error } = await supabase
    .from("tbl_user")
    .upsert(
      {
        email,
        otp_hash: otpHash,
        expires_at: new Date(Date.now() + OTP_EXPIRY_MS),
        attempts: 0,
        last_login_attempt: new Date(),
      },
      { onConflict: "email" }
    );

  if (error) throw error;

  return otp;
};
