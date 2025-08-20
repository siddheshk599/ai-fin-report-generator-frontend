import React, { useState, useEffect } from "react";
import axios from "axios";
import { ReportData, Alert } from "../App";

interface SavedReport {
  id: number;
  title: string;
  company_name: string;
  created_at: string;
  content: ReportData;
}

interface ReportHistoryProps {
  onReportView: (report: ReportData) => void;
  onAlert: (message: string, type: Alert["type"]) => void;
}

const apiBaseURL: string = (import.meta as any).env.VITE_API_BASE_URL;

const ReportHistory: React.FC<ReportHistoryProps> = ({
  onReportView,
  onAlert,
}) => {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      
      const response = await axios.get<SavedReport[]>(`${apiBaseURL}/api/reports`);
      console.log("reports: ", response.data);
      setReports(response.data);
    } catch (error: any) {
      console.error("Error loading reports:", error);
      onAlert(
        `Error loading reports: ${
          error.response?.data?.detail || error.message
        }`,
        "danger"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const viewReport = (report: SavedReport) => {
    onReportView(report.content);
  };

  const exportSavedReport = async (reportId: number) => {
    try {
      const report = reports.find((r) => r.id === reportId);
      if (!report) return;

      const response = await axios.post(`${apiBaseURL}/api/export-report`, report.content, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${report.company_name}_Report_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      onAlert("PDF exported successfully!", "success");
    } catch (error: any) {
      console.error("Error exporting report:", error);
      onAlert(
        `Error exporting report: ${
          error.response?.data?.detail || error.message
        }`,
        "danger"
      );
    }
  };

  const deleteReport = async (reportId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this report? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axios.delete(`/api/reports/${reportId}`);
      onAlert("Report deleted successfully!", "success");
      loadReports(); // Reload the list
    } catch (error: any) {
      console.error("Error deleting report:", error);
      onAlert(
        `Error deleting report: ${
          error.response?.data?.detail || error.message
        }`,
        "danger"
      );
    }
  };

  if (isLoading) {
    return (
      <section className="section">
        <div className="row">
          <div className="col-12">
            <div className="card shadow">
              <div className="card-header bg-info text-white">
                <h4 className="mb-0">
                  <i className="fas fa-history me-2"></i>
                  Report History
                </h4>
              </div>
              <div className="card-body">
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <div className="mt-2">Loading reports...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-info text-white">
              <h4 className="mb-0">
                <i className="fas fa-history me-2"></i>
                Report History
              </h4>
            </div>
            <div className="card-body">
              {reports.length === 0 && (
                <div className="empty-state text-center py-4">
                  <i
                    className="fas fa-file-alt"
                    style={{
                      fontSize: "3rem",
                      marginBottom: "1rem",
                      opacity: 0.5,
                    }}
                  ></i>
                  <h5>No Reports Found</h5>
                  <p>Create your first financial report to see it here.</p>
                </div>
              )}

              {reports.length > 0 &&
                reports.map((report) => (
                  <div
                    key={report.id}
                    className="history-item mb-3 p-3 bg-white rounded border-start border-primary border-4"
                  >
                    <div className="history-item-header d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h5 className="history-item-title text-primary mb-1">
                          {report.title}
                        </h5>
                        <div className="history-item-meta text-muted small">
                          <i className="fas fa-building me-1"></i>
                          {report.company_name} •
                          <i className="fas fa-calendar ms-2 me-1"></i>
                          {new Date(report.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="history-item-actions d-flex gap-2">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => viewReport(report)}
                      >
                        <i className="fas fa-eye me-1"></i>View
                      </button>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => exportSavedReport(report.id)}
                      >
                        <i className="fas fa-file-pdf me-1"></i>Export PDF
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteReport(report.id)}
                      >
                        <i className="fas fa-trash me-1"></i>Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportHistory;
