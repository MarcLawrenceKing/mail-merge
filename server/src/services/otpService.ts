import bcrypt from "bcryptjs";
import { supabase } from "../config/supabase";
import jwt from "jsonwebtoken";

const OTP_EXPIRY_MS = 1 * 60 * 1000; // CHANGE THIS TO 10 in production
const OTP_COOLDOWN_MS = 1 * 60 * 1000;

// this function
// - takes email parameter
// - checks the last_login_attempt of target email from the db
// - ignores "no record" error to allow first time logins
// - checks the last_login_attempt if less than N minutes from now , toast message if not
// - generates OTP and hashes it using bcrypt
// - updates the DB records (adds/updates otp_hash, expires_at, attempts, and last_login_attempt)
// - return the created OTP
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

// This function
// - fetch user to check its OTP by its email
// - handles email error (when DB did not return any email)
// - checks DB if attempts >= 3 before proceeding, set a metadata locked:true if it is true
// - checks if OTP is expired or NULL
// - compares user input with DB value
// -- if matched, update db values otp_hash, expires_at to NULL, attempts to 0, last_login_attempt to current date, and last_login to current date.
// -- if no match, attempts + 1 and last_login_attempt to current date
// - after matched, create jwt token using JWT_SECRET env var, expires in 10 minutes
// - return a message and the token
export const verifyOtp = async (email: string, otp: string) => {

  // 1. Fetch user
  const { data: user, error } = await supabase
    .from("tbl_user")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user) {
    throw {
      status: 400,
      message: "Invalid email or OTP.",
    };
  }

  // 2. Lock out if attempts >= 3
  if (user.attempts >= 3) {
    throw {
      status: 403,
      message: "Too many failed attempts. Please request a new OTP.",
      meta: { locked: true },
    };
  }

  // 3. Expiry check: check if OTP is null or expired
  if (!user.expires_at || new Date(user.expires_at) < new Date()) {
    throw {
      status: 400,
      message: "OTP has expired.",
    };
  }

  // 4. Compare OTP
  const isMatch = await bcrypt.compare(otp, user.otp_hash);

  if (!isMatch) {
    // increment attempts
    await supabase
      .from("tbl_user")
      .update({
        attempts: user.attempts + 1,
        last_login_attempt: new Date(),
      })
      .eq("email", email);

    throw {
      status: 401,
      message: "Invalid OTP.",
      meta: { attemptsLeft: Math.max(0, 2 - user.attempts) },
    };
  }

  // 5. OTP success → cleanup
  const { error: updateError} = await supabase
    .from("tbl_user")
    .update({
      otp_hash: null,
      expires_at: null,
      attempts: 0,
      last_login: new Date(),
      last_login_attempt: new Date(),
    })
    .eq("email", email);

    if (updateError) {
      throw {
          status: 500,
          message: "Failed to update OTP state.",
        };
    }
  // 6. Issue short-lived JWT (OTP verified only)
  const token = jwt.sign(
    { email, otpVerified: true },
    process.env.JWT_SECRET!,
    { expiresIn: "10m" } // only valid for password step
  );

  return {
    message: "OTP verified",
    token,
  };
}
