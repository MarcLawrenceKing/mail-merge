import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../components/DataTable";
import ReusableModal from "../components/CustomModal";
import { useOtpGuard } from "../hooks/useOtpGuard";
import { getEmailFromOtpToken } from "../utils/jwt";
import { sendBulkEmail, sendTestEmail } from "../api/email";
import { useToast } from "../context/ToastContext";
import { importFile } from "../api/file_import";
import { buildColumnsFromHeaders } from "../utils/tableColumnBuilder";
import fileToBase64 from "../utils/fileToBase64";
import { SendLoadingModal } from "../components/SendProgressModal";

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

  // headers found, extracted from importFile helper
  const [headers, setHeaders] = useState<string[]>([]);

  // email template fields
  const [recipientField, setRecipientField] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  // for SSE of sending progress
  // const [sent, setSent] = useState<number>(0);
  // const [failed, setFailed] = useState<number>(0);
  // const [percent, setPercent] = useState<number>(0);
  // const [progressOpen, setProgressOpen] = useState<boolean>(false);

  // to store success and failed recipients EVEN WHEN PAGE RELOAD
  const recipientResultsRef = useRef<
    { email: string; sent: "SUCCESS" | "FAILED" }[]
  >([]);

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
      setHeaders([]) // reset headers

      const { headers, rows, skippedRows, errors } =
        await importFile(file);

      setHeaders(headers)
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

  // handles sending of bulk emails
  const handleSendEmails = async () => {

    // reset recipient results
    recipientResultsRef.current = [];

    if (!fromEmail) {
      showToast("Session expired. Please verify OTP again.", "danger");
      return;
    }

    if (!appPassword) {
      showToast("Please enter your Google App Password.", "danger");
      return;
    }

    if (!recipientField) {
      showToast("Recipient field is required.", "danger");
      return;
    }

    // ✅ frontend validation (matches backend rule)
    if (!headers.includes(recipientField)) {
      showToast(
        `Recipient field "${recipientField}" does not exist in headers`,
        "danger"
      );
      return;
    }

    if (!data.length) {
      showToast("No recipients found. Please import a file.", "danger");
      return;
    }

    let attachmentPayload;
      if (attachment) {
        attachmentPayload = {
          name: attachment.name,
          type: attachment.type,
          contentBase64: await fileToBase64(attachment),
        };
      }

    // try {
    //   setLoading(true);
    //   setProgressOpen(true);

    //   // reset progress UI
    //   setSent(0);
    //   setFailed(0);
    //   setPercent(0);

    //   await sendBulkEmail(
    //     {
    //       fromEmail,
    //       appPassword,
    //       headers,
    //       data,
    //       recipientField,
    //       subject,
    //       body,
    //       attachment: attachmentPayload,
    //     },
    //     {
    //       onProgress: ({ sent, failed, percent }) => {
    //         setSent(sent);
    //         setFailed(failed);
    //         setPercent(percent);
    //       },

    //       onRecipientResult: (r) => {
    //         recipientResultsRef.current.push(r);
    //       },
    //       onDone: () => {
    //         showToast("Emails sent successfully!", "success");

    //         setTimeout(() => {
    //           setProgressOpen(false);
    //           navigate("/send-email/summary", {
    //             state: {
    //               recipients: recipientResultsRef.current,
    //             },
    //           });
    //         }, 800);
    //       },
    //     }
    //   );
    // } catch (err: any) {
    //   showToast(err.message || "Failed to send emails", "danger");
    //   setProgressOpen(false);
    // } finally {
    //   setLoading(false);
    // }

    // no-SSE update
    try {
      setLoading(true);

      const result = await sendBulkEmail({
        fromEmail,
        appPassword,
        headers,
        data,
        recipientField,
        subject,
        body,
        attachment: attachmentPayload,
      });

      showToast("Emails sent successfully!", "success");

      navigate("/send-email/summary", {
        state: {
          recipients: result.results,
        },
      });
    } catch (err: any) {
      showToast(err.message || "Failed to send emails", "danger");
    } finally {
      setLoading(false);
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
              Recipients
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="example: {{email}}"
              onChange={(e) =>
                setRecipientField(
                  e.target.value.replace(/[{}]/g, "").trim()
                )
              }
            />
            <small className="text-muted">
              You can use any column name from your CSV/xlsx file
            </small>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Subject
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="example: OJT APPLICATION"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Email Body
            </label>
            <textarea
              className="form-control"
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="example: Good day Mx. {{name}},

I would like to ask if there are currently any internship opportunities available, as {{company}} is listed as a company with a MOA with our school..."
            />
          </div>
          {/* ATTACHMENT */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Attachment
            </label>
            <input
              type="file"
              className="form-control"
              onChange={(e) =>
                setAttachment(e.target.files?.[0] || null)
              }
            />
            <small className="text-muted">
              Optional file attachment (same file sent to all recipients)
            </small>
          </div>
          {headers.length > 0 && (
            <div className="text-muted">
              <strong>Headers found:</strong>{" "}
              {headers.join(", ")}
            </div>
          )}
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
        primaryButtonDisabled={loading}
        onPrimaryClick={handleSendEmails}
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

      {/* {progressOpen && (
        <SendProgressModal
          sent={sent}
          failed={failed}
          percent={percent}
        />
      )} */}

      {loading && (
        <SendLoadingModal message="This may take a few moments depending on the number of recipients." />
      )}
    </div>
  );
};

export default SendEmail;
