import { useNavigate } from "react-router-dom";

const Landing = () => {

  const navigate = useNavigate();

  const handleGoToVerify = () => {
    // Navigate to a specific route
    navigate('/verify');
  
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center">
      <div className="row w-100 align-items-center">
        
        {/* LEFT CONTENT */}
        <div className="col-lg-6 text-center text-lg-start">
          <h1 className="fw-bold mb-3">
            Simple Mail Merge App
          </h1>

          <p className="text-muted mb-4">
            Easily send personalized emails to multiple recipients using
            dynamic templates and spreadsheet data. Perfect for announcements,
            invitations, and bulk communication—without the complexity.
          </p>

          <button className="btn btn-primary btn-lg" onClick={handleGoToVerify}>
            Get Started
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="col-lg-6 text-center mt-4 mt-lg-0 d-none d-lg-block">
          <img
            src="/landing.png"
            alt="Mail Merge Illustration"
            className="img-fluid w-100 w-lg-50"
          />
        </div>

      </div>
    </div>
  );
};

export default Landing;
