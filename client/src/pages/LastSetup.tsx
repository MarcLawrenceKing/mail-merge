import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { clearVerifyEmail } from "../utils/authStorage";

const LastSetup = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("otp_token");
  const { showToast } = useToast();


  useEffect(() => {
    // cleanup email verification in the sessionStorage
    clearVerifyEmail();

    // check if session token exists
    if (!token) {
      showToast("Invalid access. Please verify your email first.", "danger");
      navigate("/verify", { replace: true });
    }
  }, []);
  
  const handleAppPassword = () => {
    // placeholder action
    alert("App Password flow will be handled here");
    navigate("/send-email")
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div
        className="card shadow-sm p-4"
        style={{ maxWidth: "520px", width: "100%" }}
      >
        <h3 className="fw-bold mb-4 text-center">
          Final Setup Step
        </h3>

        <p className="text-muted">
          By default, Gmail does not allow third-party applications <span className="fst-italic">(like this one)</span> to perform actions such as sending emails on your behalf.
        </p>

        <p className="text-muted">
          To continue, you’ll need to generate a <strong>Google App Password</strong>.
          This password authorizes this app to send emails securely using your
          account. You may delete the App Password immediately after use.
        </p>

        <p className="text-muted">
          <strong>We do not store your App Password.</strong> It is used only for
         sending emails. You can revoke it at any time from
          your Google Account settings.
        </p>

        <p className="text-muted mb-2">
          <a
            href="https://support.google.com/accounts/answer/185833"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn how to generate App Passwords
          </a>
        </p>
        <p className="text-muted mb-4">
          <a
            href="https://www.youtubetrimmer.com/view/?v=74QQfPrk4vE&start=13&end=106&loop=0"
            target="_blank"
            rel="noopener noreferrer"
          >
            1 minute youtube tutorial
          </a>
        </p>

        <button
          className="btn btn-primary w-100"
          onClick={handleAppPassword}
        >
          I already have an App Password
        </button>
      </div>
    </div>
  );
};

export default LastSetup;
