import { useNavigate } from "react-router-dom";
import { CheckCircle2, Activity, Clock3, Shield, Brain, Link2 } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate(); // Hook for navigation

  // --- mock data; swap with API later ---
  const employee = {
    id: "2133",
    name: "Alex",
    location: "New York, NY",
    dept: "Business Intelligence",
    manager: "Sarah Chen",
    buddy: "OpsBot v2",
    shift: "24/7",
    sla: "99.9% Uptime",
    status: { active: true, healthy: true },
  };

  const stats = [
    { label: "Trust Score", value: "95%" },
    { label: "Approvals Hit-Rate", value: "98%" },
    { label: "Autonomous Coverage", value: "85%" },
    { label: "Corrections Learned", value: "120" },
  ];

  const runs = [
    { task: "Quarterly Sales Analysis", status: "Completed", start: "2024-03-15 10:00 AM", end: "2024-03-15 12:00 PM", dur: "2h 0m" },
    { task: "Generate CEO Briefing", status: "In Progress", start: "2024-03-15 01:00 PM", end: "-", dur: "-" },
    { task: "Update Marketing Dashboard", status: "Completed", start: "2024-03-14 02:00 PM", end: "2024-03-14 04:00 PM", dur: "2h 0m" },
    { task: "Data Validation for FY24", status: "Failed", start: "2024-03-14 09:00 AM", end: "2024-03-14 09:15 AM", dur: "15m" },
    { task: "Train New Forecasting Model", status: "Completed", start: "2024-03-13 03:00 PM", end: "2024-03-13 05:00 PM", dur: "2h 0m" },
  ];

  const compliance = [
    { ok: true, label: "GDPR Data Handling" },
    { ok: true, label: "SOC 2 Controls" },
  ];

  const highlights = [
    { type: "pos", text: "Learned 5 new data patterns, improving report accuracy by 10%." },
    { type: "neg", text: "Encountered failed data validation (FY24), self-corrected and re-ran successfully." },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header card */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start gap-6">
            <img
              src="https://i.pravatar.cc/120?u=Alex"
              alt={employee.name}
              className="h-24 w-24 rounded-full border object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold truncate">{employee.name}</h1>
                {employee.status.active && <Badge color="emerald">Active</Badge>}
                {employee.status.healthy && <Badge color="sky">Healthy</Badge>}
              </div>
              <div className="mt-1 text-sm text-gray-600">
                ID: {employee.id} · {employee.dept} · {employee.location}
              </div>

              <div className="mt-3 grid gap-3 text-sm sm:grid-cols-4">
                <KVP label="Manager" value={employee.manager} />
                <KVP label="Buddy" value={employee.buddy} />
                <KVP label="Shift & Hours" value={employee.shift} />
                <KVP label="SLA" value={employee.sla} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="btn-outline">Upgrade Autonomy</button>
              <button className="btn-outline">Freeze Agent</button>
              <button className="btn-primary" onClick={() => navigate("/chat")}>Test as User</button>
            </div>
          </div>

          {/* Tabs (visual only for now) */}
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            {["Overview", "Runs", "Self-Healing Memory", "Approvals", "Connectors", "Skills", "Compliance", "Audit"].map(
              (t, i) => (
                <button
                  key={t}
                  className={`rounded-full px-3 py-1.5 ${
                    i === 0 ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t}
                </button>
              )
            )}
          </div>
        </section>

        {/* KPI stats */}
        <section className="grid gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border bg-white p-5">
              <div className="text-gray-500 text-sm">{s.label}</div>
              <div className="mt-1 text-3xl font-bold">{s.value}</div>
            </div>
          ))}
        </section>

        {/* Live activity & connector health */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border bg-white">
            <div className="border-b p-4 font-semibold">Live Activity & Recent Runs</div>
            <div className="overflow-x-auto p-2">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <Th>Task</Th>
                    <Th>Status</Th>
                    <Th>Start Time</Th>
                    <Th>End Time</Th>
                    <Th>Duration</Th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {runs.map((r) => (
                    <tr key={r.task} className="hover:bg-gray-50">
                      <Td className="font-medium">{r.task}</Td>
                      <Td>
                        <StatusPill status={r.status} />
                      </Td>
                      <Td>{r.start}</Td>
                      <Td>{r.end}</Td>
                      <Td>{r.dur}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <div className="mb-3 flex items-center gap-2 font-semibold">
              <Link2 size={18} /> Connector Health
            </div>
            <p className="text-sm text-gray-500 mb-3">All connectors are functioning optimally.</p>
            <div className="h-2 w-full rounded bg-gray-200">
              <div className="h-full w-full rounded bg-emerald-500"></div>
            </div>
            <div className="mt-2 text-xs text-gray-500">12/12 Connectors Active</div>
            <button className="mt-3 btn-outline w-full">Manage</button>
          </div>
        </section>

        {/* Memory, Compliance, Incidents */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border bg-white p-5">
            <div className="mb-3 flex items-center gap-2 font-semibold">
              <Brain size={18} /> Self-Healing Memory
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <div className="font-medium">Core Memory</div>
                <p className="text-gray-500">
                  Stores fundamental knowledge, learned skills, and past experiences to maintain operational consistency.
                </p>
              </div>
              <div>
                <div className="font-medium">Timeline</div>
                <p className="text-gray-500">
                  Chronological log of the AI’s learning, adaptations, and corrections over time.
                </p>
                <button className="mt-2 text-sm text-sky-700 hover:underline">View Full Timeline →</button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border bg-white p-5">
              <div className="mb-3 flex items-center gap-2 font-semibold">
                <Shield size={18} /> Compliance Snapshot
              </div>
              <ul className="space-y-2 text-sm">
                {compliance.map((c) => (
                  <li key={c.label} className="flex items-center gap-2">
                    <CheckIcon ok={c.ok} />
                    <span>{c.label}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-3 btn-outline w-full">View Full Report</button>
            </div>

            <div className="rounded-2xl border bg-white p-5">
              <div className="mb-3 flex items-center gap-2 font-semibold">
                <Activity size={18} /> Incidents & Learning Highlights
              </div>
              <p className="text-sm text-gray-500 mb-2">No major incidents reported in the last 30 days.</p>
              <ul className="space-y-2 text-sm">
                {highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Dot type={h.type} />
                    <span>{h.text}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-3 btn-outline w-full">View All Highlights</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---- tiny UI helpers ---- */
function Badge({ children, color = "gray" }) {
  const map = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    sky: "bg-sky-50 text-sky-700 border-sky-100",
    gray: "bg-gray-50 text-gray-700 border-gray-100",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${map[color]}`}>
      <CheckCircle2 size={14} /> {children}
    </span>
  );
}
function KVP({ label, value }) {
  return (
    <div className="rounded-lg border bg-gray-50 px-3 py-2">
      <div className="text-[11px] uppercase tracking-wide text-gray-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
function Th({ children }) {
  return <th className="px-4 py-2 text-left font-medium">{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}
function StatusPill({ status }) {
  const styles = {
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
    "In Progress": "bg-sky-50 text-sky-700 border-sky-100",
    Failed: "bg-rose-50 text-rose-700 border-rose-100",
  }[status] || "bg-gray-50 text-gray-700 border-gray-100";
  return <span className={`inline-block rounded-full border px-2 py-0.5 text-xs ${styles}`}>{status}</span>;
}
function CheckIcon({ ok }) {
  return ok ? (
    <CheckCircle2 size={16} className="text-emerald-600" />
  ) : (
    <Clock3 size={16} className="text-amber-600" />
  );
}
function Dot({ type }) {
  const cls = type === "pos" ? "bg-emerald-500" : "bg-rose-500";
  return <span className={`inline-block h-2 w-2 rounded-full ${cls}`} />;

}
