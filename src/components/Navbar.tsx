import React from "react";

type Section = "input" | "preview" | "history";

interface NavbarProps {
  currentSection: Section;
  onSectionChange: (section: Section) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentSection, onSectionChange }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <a
          className="navbar-brand"
          href="#"
          onClick={(e) => e.preventDefault()}
        >
          <i className="fas fa-chart-line me-2"></i>
          AI Financial Report Generator
        </a>
        <div className="navbar-nav ms-auto">
          <a
            className={`nav-link ${currentSection === "input" ? "active" : ""}`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSectionChange("input");
            }}
          >
            <i className="fas fa-plus me-1"></i>New Report
          </a>
          <a
            className={`nav-link ${
              currentSection === "history" ? "active" : ""
            }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSectionChange("history");
            }}
          >
            <i className="fas fa-history me-1"></i>Report History
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
