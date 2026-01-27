export const API_URL = import.meta.env.VITE_API_URL || "http://localhost"; // fallback to proxy in dev

export const sendOtp = async (email: string) => {
  const res = await fetch(`${API_URL}/api/auth/send-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || "Failed to send OTP");
  }

  return res.json();
};

export const verifyOtp = async (email: string, otp: string) => {
  const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || "OTP verification failed");
  }

  return res.json();
};
