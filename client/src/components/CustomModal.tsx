import React from "react";

type ReusableModalProps = {
  id: string;
  title: string;
  body: React.ReactNode;
  primaryButtonName: string;
  onPrimaryClick: () => void;
  primaryButtonDisabled?: boolean;
};

const ReusableModal: React.FC<ReusableModalProps> = ({
  id,
  title,
  body,
  primaryButtonName,
  onPrimaryClick,
  primaryButtonDisabled = false,
}) => {
  return (
    <div className="modal fade" id={id} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          
          {/* HEADER */}
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button className="btn-close" data-bs-dismiss="modal" disabled={primaryButtonDisabled} />
          </div>

          {/* BODY */}
          <div className="modal-body">{body}</div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button className="btn btn-secondary" data-bs-dismiss="modal" disabled={primaryButtonDisabled}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={onPrimaryClick}
              data-bs-dismiss={
                primaryButtonDisabled ? undefined : "modal"
              }
              disabled={primaryButtonDisabled}
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
