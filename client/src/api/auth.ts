export const sendOtp = async (email: string) => {
  const res = await fetch("/api/auth/send-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new Error("Failed to send OTP");
  }

  return res.json();
};
