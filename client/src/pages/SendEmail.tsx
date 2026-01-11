import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../components/DataTable";
import ReusableModal from "../components/CustomModal";
import { useOtpGuard } from "../hooks/useOtpGuard";
import { getEmailFromOtpToken } from "../utils/jwt";
import { sendTestEmail } from "../api/email";
import { useToast } from "../context/ToastContext";
import { importFile } from "../api/file_import";
import { buildColumnsFromHeaders } from "../utils/tableColumnBuilder";

type ImportedRow = Record<string, string>;

type Column<T> = {
  key: keyof T | string;
  label: string;
};

const SendEmail = () => {

  useOtpGuard();
  const { showToast } = useToast();
  const [appPassword, setAppPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // variable states for data table
  const [columns, setColumns] = useState<Column<ImportedRow>[]>([]);
  const [data, setData] = useState<ImportedRow[]>([]);

  const [detailedErrors, setDetailedErrors] = useState<string[]>([]);

  // FROM email display, also used in test send
  const fromEmail = getEmailFromOtpToken(); // from JWT email
  // for test send only
  const toEmail = getEmailFromOtpToken(); // from JWT email

  // handles test send after confirming modal
  const handleTestSend = async () => {

    if (!fromEmail) {
      showToast("Session expired. Please verify OTP again.", "danger");
      return;
    }

    if (!appPassword) {
      showToast("Please enter your Google App Password.", "danger");
      return;
    }
    try {
      setLoading(true);
      await sendTestEmail(fromEmail, appPassword, toEmail);
      showToast("Test email sent successfully!", "success");
    } catch (err: any) {
      showToast(err.message, "danger");
    } finally {
      setLoading(false);
    }
  };

  // handles createion of recipient table after importing a file
  const handleFileImport = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setDetailedErrors([]); // reset errors

      const { headers, rows, skippedRows, errors } =
        await importFile(file);

      setColumns(buildColumnsFromHeaders<ImportedRow>(headers));
      setData(rows);
      setDetailedErrors(errors);

      if (rows.length) {
        showToast(`${rows.length} rows imported`, "success");
      }

      if (skippedRows.length) {
        showToast(
          `Skipped rows: ${skippedRows.join(", ")}`,"warning"
        );
      }
    } catch (err: any) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
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
                value={fromEmail}
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
                  value={appPassword}
                  onChange={(e) => setAppPassword(e.target.value)}
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
                onChange={handleFileImport}
                disabled={loading}
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
        
        {detailedErrors.length > 0 && (
          <div className="p-3 border-top">
            <p className="fw-bold text-danger mb-1">
              Detailed Error Messages
            </p>

            <ul className="mb-0">
              {detailedErrors.map((err, i) => (
                <li key={i} className="text-danger small">
                  {err}
                </li>
              ))}
            </ul>
          </div>
        )}
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
        primaryButtonDisabled={loading}
        onPrimaryClick={handleTestSend}
      />
    </div>
  );
};

export default SendEmail;
