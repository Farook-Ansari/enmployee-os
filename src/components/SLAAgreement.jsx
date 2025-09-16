import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function SLAAgreement() {
  const nav = useNavigate();
  const [accepted, setAccepted] = useState(false);
  const [showError, setShowError] = useState(false);

  const continueDeploy = (mode) => {
    if (!accepted) {
      setShowError(true);
      return;
    }
    setShowError(false);

    // TODO: save SLA & deployment mode (sandbox/production)
    if (mode === "sandbox") {
      alert("Deploying in Sandbox...");
    } else {
      alert("Deploying in Production...");
    }
    nav("/employees/profile"); // next step (Employee Profile or final confirmation)
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto w-full max-w-5xl">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="w-full mr-3 h-1.5 rounded-full bg-gray-200">
              <div className="h-full w-4/5 rounded-full bg-sky-500" />
            </div>
            <span>Step 4 of 5</span>
          </div>
        </div>

        {/* Header */}
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          SLA and Policy Boundaries
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          SLAs for AI employees are crucial. They translate human expectations into
          machine-readable instructions, ensure compliance, and allow tuning of agent
          behaviors.
        </p>

        {/* SLA Box */}
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-3 font-semibold">Service Level Agreement (SLA)</h2>
          <textarea
            rows={15}
            className="w-full resize-y rounded-md border bg-gray-50 p-3 text-sm font-mono leading-relaxed focus:border-sky-600 focus:ring-sky-600"
            defaultValue={`1.0 Purpose and Applicability: This SLA defines the operational parameters for the AI Data Analyst. 
2.0 Scope of Work: The AI is authorized to perform data extraction, cleaning, analysis, visualization, and reporting as requested. Any tasks outside this scope require explicit authorization.
3.0 Performance Expectations:
- Task Acknowledgment: Within 5 minutes of assignment.
- Initial Findings: Within 4 business hours for standard requests.
- Final Report Delivery: Within 24 business hours for standard requests. Complex requests will have adjusted timelines.
- Accuracy: Maintain a minimum of 98% accuracy in data processing and analysis.
4.0 Quality and Review: All analyses are subject to human oversight with monthly reviews.
5.0 Data Privacy and Security: The AI will adhere to company data protection policies and GDPR regulations.
6.0 Change and Request Management: All requests and modifications must be submitted through the official portal.
7.0 Anomaly Handling and Escalation: Any anomalies flagged will be escalated immediately to the supervisor.
8.0 Communication Protocol: All communications will be logged, with proactive updates provided.`}
          />
          <div
            className={`mt-4 flex items-center gap-2 rounded-md p-2 ${
              showError ? "border border-red-500 bg-red-50" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => {
                setAccepted(e.target.checked);
                setShowError(false);
              }}
              className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600"
            />
            <span className="text-sm text-gray-700">
              I accept the Service Level Agreement{" "}
              <span className="text-red-500">*</span>
            </span>
          </div>
          {showError && (
            <p className="mt-1 text-sm text-red-600">
              You must accept the SLA before deploying.
            </p>
          )}
        </section>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between">
          <button className="btn-outline" onClick={() => nav(-1)}>
            <ChevronLeft size={16} className="mr-1" /> Back
          </button>

          <div className="flex gap-3">
            <button
              className="btn-outline"
              onClick={() => continueDeploy("sandbox")}
            >
              Deploy in Sandbox
            </button>
            <button
              className="btn-primary"
              onClick={() => continueDeploy("production")}
            >
              Deploy in Production
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
