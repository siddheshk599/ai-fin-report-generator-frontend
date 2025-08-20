import React, { useState } from "react";
import axios from "axios";
import { ReportData, Alert } from "../App";

interface FormData {
  company_name: string;
  executive_name: string;
  revenue: string;
  profit: string;
  growth_percentage: string;
  sector_trends: string;
  key_metrics: string;
  risks: string;
  recommendations: string;
}

interface DataInputFormProps {
  onReportGenerated: (report: ReportData) => void;
  onLoading: (loading: boolean) => void;
  onAlert: (message: string, type: Alert["type"]) => void;
}

const DataInputForm: React.FC<DataInputFormProps> = ({
  onReportGenerated,
  onLoading,
  onAlert,
}) => {
  const [formData, setFormData] = useState<FormData>({
    company_name: "",
    executive_name: "",
    revenue: "",
    profit: "",
    growth_percentage: "",
    sector_trends: "",
    key_metrics: "",
    risks: "",
    recommendations: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      onLoading(true);

      const requestData = {
        ...formData,
        revenue: parseFloat(formData.revenue),
        profit: parseFloat(formData.profit),
        growth_percentage: parseFloat(formData.growth_percentage),
        report_title: `Financial Report - ${formData.company_name}`,
      };

      const apiBaseURL: string = (import.meta as any).env.VITE_API_BASE_URL;
      const response = await axios.post(`${apiBaseURL}/api/generate-report`, requestData);

      const reportData = {
        ...response.data,
        ...requestData,
      };

      onReportGenerated(reportData);
      onAlert("Report generated successfully!", "success");
    } catch (error: any) {
      console.error("Error generating report:", error);
      onAlert(
        `Error generating report: ${
          error.response?.data?.detail || error.message
        }`,
        "danger"
      );
    } finally {
      onLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAlert(
        `File "${file.name}" selected. CSV/Excel processing will be available in a future update.`,
        "info"
      );
    }
  };

  return (
    <section className="section">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <i className="fas fa-building me-2"></i>
                Company Financial Data Input
              </h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="company_name" className="form-label">
                      Company Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="company_name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="executive_name" className="form-label">
                      Executive Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="executive_name"
                      value={formData.executive_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="revenue" className="form-label">
                      Revenue (₹)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="revenue"
                      step={0.01}
                      value={formData.revenue}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="profit" className="form-label">
                      Profit (₹)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="profit"
                      step={0.01}
                      value={formData.profit}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="growth_percentage" className="form-label">
                      Growth (%)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="growth_percentage"
                      step={0.01}
                      value={formData.growth_percentage}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="sector_trends" className="form-label">
                    Sector Trends
                  </label>
                  <textarea
                    className="form-control"
                    id="sector_trends"
                    rows={3}
                    value={formData.sector_trends}
                    onChange={handleInputChange}
                    placeholder="Describe current market trends affecting your sector"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="key_metrics" className="form-label">
                    Key Metrics & KPIs
                  </label>
                  <textarea
                    className="form-control"
                    id="key_metrics"
                    rows={3}
                    value={formData.key_metrics}
                    onChange={handleInputChange}
                    placeholder="Enter key performance indicators and business metrics"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="risks" className="form-label">
                    Identified Risks
                  </label>
                  <textarea
                    className="form-control"
                    id="risks"
                    rows={3}
                    value={formData.risks}
                    onChange={handleInputChange}
                    placeholder="List major risks and challenges facing the company"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="recommendations" className="form-label">
                    Initial Recommendations
                  </label>
                  <textarea
                    className="form-control"
                    id="recommendations"
                    rows={3}
                    value={formData.recommendations}
                    onChange={handleInputChange}
                    placeholder="Enter any initial strategic recommendations"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="csvUpload" className="form-label">
                    <i className="fas fa-upload me-1"></i>
                    Upload Financial Data (CSV/Excel) - Optional
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="csvUpload"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                  />
                  <div className="form-text">
                    Upload additional financial data (feature coming soon)
                  </div>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg">
                    <i className="fas fa-magic me-2"></i>
                    Generate AI Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataInputForm;
