import React from "react";

const UnderConstruction: React.FC = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center">
      <div className="mb-4">
        {/* Optional: Use any maintenance icon from Bootstrap icons or FontAwesome */}
        <i className="bi bi-cone-striped" style={{ fontSize: "5rem", color: "#f0ad4e" }}></i>

      </div>
      <h1 className="display-4 mb-3">Under Construction</h1>
      <p className="lead">We're working hard to bring you something amazing. Stay tuned!</p>
      <a href="/" className="btn btn-primary mt-3">
        Go Back Home
      </a>
    </div>
  );
};

export default UnderConstruction;
