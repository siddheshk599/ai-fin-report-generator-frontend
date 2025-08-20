import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar.tsx";
import DataInputForm from "./components/DataInputForm.tsx";
import ReportPreview from "./components/ReportPreview.tsx";
import ReportHistory from "./components/ReportHistory.tsx";
import LoadingModal from "./components/LoadingModal.tsx";
import AlertContainer from "./components/AlertContainer.tsx";
import "./App.css";

export interface Alert {
  id: number;
  message: string;
  type: "success" | "danger" | "warning" | "info";
}

export interface ReportData {
  id: string;
  executive_summary: string;
  key_trends: string;
  risks: string;
  recommendations: string;
  top_risks: string[];
  top_recommendations: string[];
  company_name: string;
  executive_name: string;
  revenue: number;
  profit: number;
  growth_percentage: number;
  sector_trends: string;
  key_metrics: string;
  report_title: string;
}

type Section = "input" | "preview" | "history";

function App() {
  const [currentSection, setCurrentSection] = useState<Section>("input");
  const [currentReport, setCurrentReport] = useState<ReportData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const showAlert = (message: string, type: Alert["type"] = "info") => {
    const alert = {
      id: Date.now(),
      message,
      type,
    };
    setAlerts((prev) => [...prev, alert]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
    }, 5000);
  };

  const dismissAlert = (id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="App">
      <Navbar
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
      />

      <div className="container mt-4">
        <AlertContainer alerts={alerts} onDismiss={dismissAlert} />

        {currentSection === "input" && (
          <DataInputForm
            onReportGenerated={(report: ReportData) => {
              setCurrentReport(report);
              setCurrentSection("preview");
            }}
            onLoading={setIsLoading}
            onAlert={showAlert}
          />
        )}

        {currentSection === "preview" && (
          <ReportPreview
            report={currentReport}
            onBackToInput={() => setCurrentSection("input")}
            onAlert={showAlert}
          />
        )}

        {currentSection === "history" && (
          <ReportHistory
            onReportView={(report: ReportData) => {
              setCurrentReport(report);
              setCurrentSection("preview");
            }}
            onAlert={showAlert}
          />
        )}
      </div>

      <LoadingModal show={isLoading} />
    </div>
  );
}

export default App;
