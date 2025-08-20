import React from "react";

interface LoadingModalProps {
  show: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block" }}
      tabIndex={-1}
      data-bs-backdrop="static"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body text-center py-4">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5>Generating AI Report...</h5>
            <p className="text-muted">
              This may take a few moments while our AI analyzes your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
