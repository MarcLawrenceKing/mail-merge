import { useState } from "react";
const SendEmail = () => {

  const [showPassword, setShowPassword] = useState(false);
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

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Company</th>
                </tr>
              </thead>
              <tbody>
                {/* Placeholder rows */}
                <tr>
                  <td>1</td>
                  <td>john@example.com</td>
                  <td>John Doe</td>
                  <td>ABC Corp</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>jane@example.com</td>
                  <td>Jane Smith</td>
                  <td>XYZ Ltd</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="card-footer">
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li className="page-item disabled">
                <span className="page-link">Previous</span>
              </li>
              <li className="page-item active">
                <span className="page-link">1</span>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">2</a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">Next</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* Send Confirmation */}
      <div
        className="modal fade"
        id="sendConfirmModal"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Send</h5>
              <button className="btn-close" data-bs-dismiss="modal" />
            </div>
            <div className="modal-body">
              Are you sure you want to send emails to all recipients?
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button className="btn btn-primary">
                Confirm Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Test Send Confirmation */}
      <div
        className="modal fade"
        id="testSendModal"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Test Send</h5>
              <button className="btn-close" data-bs-dismiss="modal" />
            </div>
            <div className="modal-body">
              A test email will be sent to your email address.
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button className="btn btn-outline-primary">
                Send Test
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SendEmail;
