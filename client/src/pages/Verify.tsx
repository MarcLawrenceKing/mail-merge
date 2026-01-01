import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { sendOtp } from "../api/auth";
import { useToast } from "../context/ToastContext";



const Verify = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();


  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendOtp(email);
      showToast("OTP sent to your email", "success");
      navigate('/verify/otp')
    } catch (err: any) {
      showToast(err.message || "Unable to send OTP", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow-sm p-4" style={{ maxWidth: "520px", width: "100%" }}>
        
        <h3 className="fw-bold mb-4 text-center">
          Verify Google Account
        </h3>

        <p className="text-muted text-center mb-4">
          The system wants to authenticate your Google account to continue.
          Please enter your email address to receive a one-time password (OTP).
        </p>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            id="email"
            type="email"
            className="form-control"
            placeholder="youremail@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          className="btn btn-primary w-100"
          onClick={handleSendOtp}
          disabled={!email || loading}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </div>
    </div>
  );
};

export default Verify;