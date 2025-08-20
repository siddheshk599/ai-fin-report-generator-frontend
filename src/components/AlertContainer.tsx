import React from "react";
import { Alert } from "../App";

interface AlertContainerProps {
  alerts: Alert[];
  onDismiss: (id: number) => void;
}

const AlertContainer: React.FC<AlertContainerProps> = ({
  alerts,
  onDismiss,
}) => {
  const getAlertIcon = (type: Alert["type"]): string => {
    const icons = {
      success: "check-circle",
      danger: "exclamation-triangle",
      warning: "exclamation-circle",
      info: "info-circle",
    };
    return icons[type] || "info-circle";
  };

  return (
    <div id="alertContainer">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`alert alert-${alert.type} alert-dismissible fade show`}
          role="alert"
        >
          <i className={`fas fa-${getAlertIcon(alert.type)} me-2`}></i>
          {alert.message}
          <button
            type="button"
            className="btn-close"
            onClick={() => onDismiss(alert.id)}
          ></button>
        </div>
      ))}
    </div>
  );
};

export default AlertContainer;
