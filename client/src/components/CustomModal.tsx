import React from "react";

type ReusableModalProps = {
  id: string;
  title: string;
  body: React.ReactNode;
  primaryButtonName: string;
  onPrimaryClick: () => void;
};

const ReusableModal: React.FC<ReusableModalProps> = ({
  id,
  title,
  body,
  primaryButtonName,
  onPrimaryClick,
}) => {
  return (
    <div className="modal fade" id={id} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          
          {/* HEADER */}
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button className="btn-close" data-bs-dismiss="modal" />
          </div>

          {/* BODY */}
          <div className="modal-body">{body}</div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button className="btn btn-secondary" data-bs-dismiss="modal">
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={onPrimaryClick}
              data-bs-dismiss="modal"
            >
              {primaryButtonName}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReusableModal;
