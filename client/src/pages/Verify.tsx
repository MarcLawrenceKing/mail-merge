import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Verify = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSendOtp = () => {
    // placeholder – no backend yet
    console.log("Send OTP to:", email);
    alert(`OTP would be sent to ${email}`);
    navigate('/verify/otp')
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
          />
        </div>

        <button
          className="btn btn-primary w-100"
          onClick={handleSendOtp}
          disabled={!email}
        >
          Send OTP
        </button>

      </div>
    </div>
  );
};

export default Verify;