import React from "react";

const GuidePage: React.FC = () => {
  return (
    <div className="container my-5">
      {/* Page Header */}
      <div className="mb-5 text-center">
        <h3 className="fw-bold">Mail Merge App: User Guide</h3>
        <p className="text-muted mt-2">
          Step-by-step guide on how to use the Mail Merge application
        </p>
      </div>

      {/* 1. Get Started */}
      <section className="mb-5">
        <h4 className="fw-semibold">1. Get Started</h4>
        <p className="text-muted">Begin using the app by clicking the button below.</p>
        <ul>
          <li>Click <strong>Get Started</strong></li>
        </ul>
        <div className="border rounded text-center text-muted">
          <div className="text-center">
            <img
              src="public/screenshots/1.jpg"
              className="img-fluid rounded shadow-sm"
              alt="Guide screenshot"
            />
          </div>
        </div>
      </section>

      {/* 2. Verify Google Account */}
      <section className="mb-5">
        <h4 className="fw-semibold">2. Verify Google Account</h4>
        <p className="text-muted">Verify your Google account before sending emails.</p>
        <ul>
          <li>Enter your Google email address</li>
          <li>Check your inbox for the <strong>6-digit OTP</strong></li>
        </ul>
        <div className="border rounded text-center text-muted">
          <div className="text-center">
            <img
              src="public/screenshots/2.jpg"
              className="img-fluid rounded shadow-sm"
              alt="Guide screenshot"
            />
          </div>
        </div>
      </section>

      {/* 3. Verify Google Account - OTP */}
      <section className="mb-5">
        <h4 className="fw-semibold">3. Verify Google Account – OTP</h4>
        <ul>
          <li>Enter the <strong>6-digit OTP</strong> sent to your email</li>
        </ul>
        <div className="border rounded text-center text-muted">
          <div className="text-center">
            <img
              src="public/screenshots/3.jpg"
              className="img-fluid rounded shadow-sm"
              alt="Guide screenshot"
            />
          </div>        </div>
      </section>

      {/* 4. Google App Password */}
      <section className="mb-5">
        <h4 className="fw-semibold">4. Google App Password</h4>
        <p className="text-muted">
          A Google App Password is required to send emails securely.
        </p>
        <ul>
          <li>Follow the instructions shown in the app to create a Google App Password</li>
          <li>
            <strong>Note:</strong> We do not store your App Password. You will be asked to
            enter it every time you send emails.
          </li>
        </ul>
        <div className="border rounded text-center text-muted">
          <div className="text-center">
            <img
              src="public/screenshots/4.jpg"
              className="img-fluid rounded shadow-sm"
              alt="Guide screenshot"
            />
          </div>        </div>
      </section>

      {/* 5. Send Email */}
      <section className="mb-5">
        <h4 className="fw-semibold">5. Send Email</h4>
        <p className="fw-medium mt-3">Important Fields</p>
        <ul>
          <li>
            <strong>FROM:</strong> Your logged-in Google email address
          </li>
          <li>
            <strong>APP PASSWORD:</strong> 16-character Google App Password
          </li>
          <li>
            <strong>CSV / XLSX FILE:</strong> File containing recipient data
          </li>
        </ul>

        <p className="fw-medium mt-4">Actions</p>
        <ul>
          <li>
            <strong>TEST SEND:</strong> Sends a test email to your own account to
            confirm the App Password
          </li>
          <li>
            <strong>SEND EMAILS:</strong> Sends the mail merge emails based on your
            inputs
          </li>
        </ul>

        {/* <div className="border rounded text-center text-muted">
          Screenshot: Send Email Page
        </div> */}
      </section>

      {/* 6. Email Template */}
      <section className="mb-5">
        <h4 className="fw-semibold">6. Email Template</h4>
        <ul>
          <li>
            <strong>RECIPIENT:</strong><code>{"{{email}}"}</code>
          </li>
          <li>
            <strong>SUBJECT:</strong> Plain text only (does not accept variables)
          </li>
          <li>
            <strong>EMAIL BODY:</strong> Supports variables such as <code>{"{{name}}"}</code>
          </li>
          <li>
            <strong>ATTACHMENT:</strong> Optional file sent to all recipients (e.g., Resume)
          </li>
        </ul>
        {/* <div className="border rounded text-center text-muted">
          Screenshot: Email Template Section
        </div> */}
      </section>

      {/* 7. Recipients Table */}
      <section className="mb-5">
        <h4 className="fw-semibold">7. Recipients</h4>
        <p className="text-muted">
          After importing a CSV or XLSX file, a table will display all detected
          recipients.
        </p>
        <div className="border rounded text-center text-muted">
          <div className="text-center">
            <img
              src="public/screenshots/5.jpg"
              className="img-fluid rounded shadow-sm"
              alt="Guide screenshot"
            />
          </div>
        </div>
      </section>

      {/* 8. Email Summary */}
      <section className="mb-5">
        <h4 className="fw-semibold">8. Email Summary</h4>
        <p className="text-muted">After sending, a summary page will be shown.</p>
        <ul>
          <li>Total emails sent</li>
          <li>Total failed emails</li>
          <li>Success rate</li>
          <li>Recipient list with individual send status</li>
        </ul>
        <div className="border rounded text-center text-muted">
          <div className="text-center">
            <img
              src="public/screenshots/6.jpg"
              className="img-fluid rounded shadow-sm"
              alt="Guide screenshot"
            />
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <div className="alert alert-info mt-5">
        <strong>Tip:</strong> Make sure your CSV/XLSX headers match the variables
        used in your email body.
      </div>
    </div>
  );
};

export default GuidePage;
