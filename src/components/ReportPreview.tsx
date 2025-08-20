import React from "react";
import axios from "axios";
import { ReportData, Alert } from "../App";

interface ReportPreviewProps {
  report: ReportData | null;
  onBackToInput: () => void;
  onAlert: (message: string, type: Alert["type"]) => void;
}

const apiBaseURL: string = (import.meta as any).env.VITE_API_BASE_URL;

const ReportPreview: React.FC<ReportPreviewProps> = ({
  report,
  onBackToInput,
  onAlert,
}) => {
  if (!report) {
    return (
      <div className="alert alert-warning">
        <i className="fas fa-exclamation-triangle me-2"></i>
        No report data available. Please generate a report first.
      </div>
    );
  }

  const exportPDF = async () => {
    try {
      const response = await axios.post(`${apiBaseURL}/api/export-report`, report, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${report.company_name}_Financial_Report_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      onAlert("PDF exported successfully!", "success");
    } catch (error: any) {
      console.error("Error exporting PDF:", error);
      onAlert(
        `Error exporting PDF: ${error.response?.data?.detail || error.message}`,
        "danger"
      );
    }
  };

  const saveReport = async () => {
    try {
      const reportTitle = prompt(
        "Enter a title for this report:",
        `${
          report.company_name
        } Financial Report - ${new Date().toLocaleDateString()}`
      );

      if (!reportTitle) return; // User cancelled

      const saveData = {
        title: reportTitle,
        content: report,
        company_name: report.company_name,
      };

      await axios.post(`${apiBaseURL}/api/reports`, saveData);
      onAlert("Report saved successfully!", "success");
    } catch (error: any) {
      console.error("Error saving report:", error);
      onAlert(
        `Error saving report: ${error.response?.data?.detail || error.message}`,
        "danger"
      );
    }
  };

  const formatTextWithLineBreaks = (text: string) => {
    return text.replace(/\n/g, "<br>");
  };

  const profitMargin = ((report.profit / report.revenue) * 100).toFixed(1);

  return (
    <section className="section">
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <i className="fas fa-eye me-2"></i>
                Report Preview
              </h4>
              <div>
                <button
                  className="btn btn-light btn-sm me-2"
                  onClick={saveReport}
                >
                  <i className="fas fa-save me-1"></i>Save Report
                </button>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={exportPDF}
                >
                  <i className="fas fa-file-pdf me-1"></i>Export PDF
                </button>
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={onBackToInput}
                >
                  <i className="fas fa-arrow-left me-1"></i>Back to Input
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="financial-summary">
                <h4>
                  <i className="fas fa-chart-bar me-2"></i>Financial Overview
                </h4>
                <div className="financial-metrics">
                  <div className="metric-item">
                    <span className="metric-value">
                      ${report.revenue.toLocaleString()}
                    </span>
                    <span className="metric-label">Revenue</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-value">
                      ${report.profit.toLocaleString()}
                    </span>
                    <span className="metric-label">Profit</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-value">
                      {report.growth_percentage}%
                    </span>
                    <span className="metric-label">Growth</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-value">{profitMargin}%</span>
                    <span className="metric-label">Profit Margin</span>
                  </div>
                </div>
              </div>

              <div className="report-section">
                <h3>
                  <i className="fas fa-clipboard-list me-2"></i>Executive
                  Summary
                </h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: formatTextWithLineBreaks(report.executive_summary),
                  }}
                />
              </div>

              <div className="report-section">
                <h3>
                  <i className="fas fa-trending-up me-2"></i>Key Trends Analysis
                </h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: formatTextWithLineBreaks(report.key_trends),
                  }}
                />
              </div>

              <div className="report-section">
                <h3>
                  <i className="fas fa-exclamation-triangle me-2"></i>Risk
                  Assessment
                </h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: formatTextWithLineBreaks(report.risks),
                  }}
                />

                <div className="top-items">
                  <h4>
                    <i className="fas fa-list me-2"></i>Top 3 Critical Risks
                  </h4>
                  <ul>
                    {report.top_risks.map((risk, index) => (
                      <li key={index}>{risk}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="report-section">
                <h3>
                  <i className="fas fa-lightbulb me-2"></i>Strategic
                  Recommendations
                </h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: formatTextWithLineBreaks(report.recommendations),
                  }}
                />

                <div className="top-items">
                  <h4>
                    <i className="fas fa-star me-2"></i>Top 3 Priority
                    Recommendations
                  </h4>
                  <ul>
                    {report.top_recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReportPreview;
