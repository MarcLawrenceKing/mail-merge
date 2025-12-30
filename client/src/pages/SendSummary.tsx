import { useNavigate } from "react-router-dom";
import DataTable from "../components/DataTable";

type Recipient = {
  email: string;
  sent: string;
};

const columns = [
  { key: "email", label: "Email" },
  { key: "sent", label: "Sent" },
];

const data: Recipient[] = [
  {
    email: "john@example.com",
    sent: "FAILED",

  },
  {
    email: "john@example.com",
    sent: "12:00:00 PHT",

  },  {
    email: "john@example.com",
    sent: "12:00:00 PHT",

  },
    {
    email: "john@example.com",
    sent: "12:00:00 PHT",

  },
    {
    email: "john@example.com",
    sent: "12:00:00 PHT",

  },
  {
    email: "john@example.com",
    sent: "FAILED",

  },
  {
    email: "john@example.com",
    sent: "12:00:00 PHT",

  },  {
    email: "john@example.com",
    sent: "12:00:00 PHT",

  },
    {
    email: "john@example.com",
    sent: "12:00:00 PHT",

  },
    {
    email: "john@example.com",
    sent: "12:00:00 PHT",

  },

];


const SendSummary = () => {

  const navigate = useNavigate();

  const handleGoToSendEmails = () => {
    // Navigate to a specific route
    navigate('/send-email');
  
  };
  return (
    <div className="container py-5">
      <div className="row g-4 mt-4">
        {/* ================= LEFT: SUMMARY ================= */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header fw-bold bg-body-secondary">
              Summary
            </div>

            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span className="fw-semibold">Sent</span>
                  <span className="text-success fw-bold">24</span>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span className="fw-semibold">Failed</span>
                  <span className="text-danger fw-bold">3</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="fw-semibold mb-1">
                  Completion
                </div>
                <div className="progress">
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: "89%" }}
                  >
                    89%
                  </div>
                </div>
              </div>

              <button className="btn btn-primary w-100 mt-4" onClick={handleGoToSendEmails}>
                Send More Emails
              </button>
            </div>
          </div>
        </div>


        {/* ================= RIGHT: RECIPIENTS ================= */}
        <div className="col-lg-8">
          <div className="card shadow-sm h-100">
            <div className="card-header fw-bold bg-body-secondary">
              Recipients
            </div>
            
            <DataTable
              columns={columns}
              data={data}
              showIndex
              pageSize={7}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendSummary;
