import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../components/DataTable";
import ReusableModal from "../components/CustomModal";
import { useOtpGuard } from "../hooks/useOtpGuard";


type Recipient = {
  email: string;
  name: string;
  company: string;
};

const columns = [
  { key: "email", label: "Email" },
  { key: "name", label: "Name" },
  { key: "company", label: "Company" },
];

const data: Recipient[] = [
  {
    email: "john@example.com",
    name: "John Doe",
    company: "ABC Corp",
  },
  {
    email: "john@example.com",
    name: "John Doe",
    company: "ABC Corp",
  },  {
    email: "john@example.com",
    name: "John Doe",
    company: "ABC Corp",
  },
    {
    email: "john@example.com",
    name: "John Doe",
    company: "ABC Corp",
  },
    {
    email: "john@example.com",
    name: "John Doe",
    company: "ABC Corp",
  },
  {
    email: "jane@example.com",
    name: "Jane Smith",
    company: "XYZ Ltd",
  },
];
const SendEmail = () => {

  useOtpGuard();

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleGoToSummary = () => {
    // Navigate to a specific route
    navigate('/send-email/summary');
  
  };
  return (
    <div className="container py-5">

      {/* ================= SECTION 1: HEADERS ================= */}
      <div className="card shadow-sm mb-4 mt-4">
        <div className="card-header fw-bold bg-body-secondary">
          Important Fields
        </div>

        <div className="card-body">
          <div className="row g-3 align-items-start">
            
            {/* FROM */}
            <div className="col-lg-4">
              <div className="form-floating">
                <input
                type="email"
                className="form-control"
                id="fromEmail"
                placeholder="From"
                value="user@gmail.com"
                disabled
                />
                <label htmlFor="fromEmail">From</label>
              </div>
              <small className="text-muted">
                Emails will be sent using this account
              </small>
            </div>

            {/* APP PASSWORD */}
            <div className="col-lg-3 position-relative">
              <div className="form-floating">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="appPassword"
                  placeholder="Enter Google App Password"
                />
                <label htmlFor="appPassword">App Password</label>
              </div>
              <small className="text-muted">
                Asked every time for security
              </small>

              {/* Eye toggle */}
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} position-absolute`}
                style={{
                  top: "35%",
                  right: "1.2rem",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                }}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>


            {/* TEMPLATE LINK */}
            <div className="col-lg-2">
              <div className="form-floating">
                <a
                  href="https://docs.google.com/spreadsheets/d/1SD60K1x3Sw9EUY2LuFVxzT4PNtAsXM2FHh76batpZrk/edit?gid=0#gid=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="form-control "
                >
                  Sample File
                </a>
                <label htmlFor="fromEmail">Template CSV</label>
              </div>
            </div>


            {/* IMPORT */}
            <div className="col-lg-3">
              <input
                type="file"
                className="form-control"
                accept=".csv,.xlsx"
              />
              <small className="text-muted">
                Import your CSV/Excel file
              </small>
            </div>

            {/* ACTION BUTTONS */}
            <div className="col-lg-12 text-sm-end">
              <button
                className="btn btn-secondary me-2 mb-2"
                data-bs-toggle="modal"
                data-bs-target="#testSendModal"
              >
                Test Send
              </button>

              <button
                className="btn btn-primary mb-2"
                data-bs-toggle="modal"
                data-bs-target="#sendConfirmModal"
              >
                Send Emails
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ================= SECTION 2: MAIN ================= */}
      <div className="card shadow-sm mb-4">
        <div className="card-header fw-bold bg-body-secondary">
          Email Template
        </div>

        <div className="card-body">
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Email Body
            </label>
            <textarea
              className="form-control"
              rows={8}
              placeholder="Hello {{name}}, your order {{order_id}} is ready..."
            />
          </div>

          <div className="text-muted">
            <strong>Headers found:</strong> name, email, order_id, company
          </div>
        </div>
      </div>

      {/* ================= SECTION 3: RECIPIENTS ================= */}
      <div className="card shadow-sm">
        <div className="card-header fw-bold bg-body-secondary">
          Recipients
        </div>

        <DataTable
          columns={columns}
          data={data}
          showIndex
          pageSize={5}
        />
      </div>

      {/* ================= MODALS ================= */}

      {/* Send Confirmation */}
      <ReusableModal
        id="sendConfirmModal"
        title="Confirm Send"
        body="Are you sure you want to send emails to all recipients?"
        primaryButtonName="Confirm Send"
        onPrimaryClick={() => {
          console.log("Sending emails...");
          navigate("/send-email/summary")
        }}
      />

      {/* Test Send Confirmation */}
      <ReusableModal
        id="testSendModal"
        title="Test Send"
        body="A test email will be sent to your email address."
        primaryButtonName="Send Test"
        onPrimaryClick={() => {
          alert("Check your email");
        }}
      />
    </div>
  );
};

export default SendEmail;
