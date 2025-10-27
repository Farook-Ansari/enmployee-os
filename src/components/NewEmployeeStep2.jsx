import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Save, Search } from "lucide-react";

export default function NewEmployeeStep2() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    employeeId: "AE-2024-042",
    role: "Data Analyst",
    department: "BI",
    manager: "",
    buddy: "",
    autonomy: "conservative", // conservative | balanced | proactive
  });

  const update = (k, v) => setForm(s => ({ ...s, [k]: v }));

  const continueNext = () => {
    // TODO: persist to store/API
    nav("/employees/new/step-3", { state: { step2: form } });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto w-full max-w-5xl">
        {/* Top breadcrumb + title */}
        <div className="mb-5">
          <div className="text-xs text-gray-500">AI Employees ▸ New AI Employee</div>
          <h1 className="text-2xl md:text-3xl font-bold mt-1">Hire New AI Employee</h1>
          <p className="text-sm text-gray-500">Create a new digital colleague by defining its identity and operational boundaries.</p>
        </div>

        {/* Stepper mini */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-[13px] text-gray-600">
            <span>Step <b>2</b> of <b>5</b></span>
            <span className="text-gray-400">Identity &amp; Responsibility</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-gray-200">
            <div className="h-full w-2/5 rounded-full bg-sky-500" />
          </div>
        </div>

        {/* Two columns */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left: Identity */}
          <Card title="AI Employee Identity" highlight>
            <p className="text-sm text-gray-500 mb-4">
              Define the core identity of your new AI employee.
            </p>

            <Field label="Name">
              <input
                className="input"
                placeholder="e.g., Alex"
                value={form.name}
                onChange={e => update("name", e.target.value)}
              />
            </Field>

            <Field label="Employee ID">
              <input
                className="input"
                value={form.employeeId}
                onChange={e => update("employeeId", e.target.value)}
              />
            </Field>

            <Field label="Role">
              <select
                className="input"
                value={form.role}
                onChange={e => update("role", e.target.value)}
              >
                <option>Data Analyst</option>
                <option>Customer Success</option>
                <option>Marketing Ops</option>
                <option>Product Manager</option>
                <option>Software Engineer</option>
              </select>
            </Field>

            <Field label="Department">
              <select
                className="input"
                value={form.department}
                onChange={e => update("department", e.target.value)}
              >
                <option>BI</option>
                <option>Sales</option>
                <option>Support</option>
                <option>Engineering</option>
                <option>HR</option>
              </select>
            </Field>
          </Card>

          {/* Right: Responsibility */}
          <Card title="Assign Responsibility">
            <p className="text-sm text-gray-500 mb-4">
              Assign a manager and buddy for guidance and collaboration.
            </p>

            <Field label="Manager">
              <div className="relative">
                <input
                  className="input pl-9"
                  placeholder="Search for a manager"
                  value={form.manager}
                  onChange={e => update("manager", e.target.value)}
                />
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </Field>

            <Field label="Buddy">
              <div className="relative">
                <input
                  className="input pl-9"
                  placeholder="Search for a buddy"
                  value={form.buddy}
                  onChange={e => update("buddy", e.target.value)}
                />
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </Field>
          </Card>
        </div>

        {/* Autonomy */}
        <Card title="Starting Autonomy" className="mt-6">
          <p className="text-sm text-gray-500 mb-4">
            Choose the initial level of independence for your AI.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <RadioCard
              checked={form.autonomy === "conservative"}
              onChange={() => update("autonomy", "conservative")}
              title="Conservative"
              desc="Requires explicit approval for most actions. Best for sensitive tasks."
            />
            <RadioCard
              checked={form.autonomy === "balanced"}
              onChange={() => update("autonomy", "balanced")}
              title="Balanced"
              desc="Operates within pre-defined rules; seeks approval for exceptions."
            />
            <RadioCard
              checked={form.autonomy === "proactive"}
              onChange={() => update("autonomy", "proactive")}
              title="Proactive"
              desc="Takes initiative on tasks and decisions, reporting outcomes."
            />
          </div>
        </Card>

        {/* Footer actions */}
        <div className="mt-6 flex items-center justify-between">
          <button
            className="btn-outline"
            onClick={() => nav(-1)}
          >
            <ChevronLeft size={16} className="mr-1" />
            Back
          </button>

          <div className="flex items-center gap-3">
            <button className="btn-outline">
              <Save size={16} className="mr-1" />
              Save as Draft
            </button>
            <button className="btn-primary" onClick={continueNext}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Small building blocks ---------- */

function Card({ title, highlight = false, className = "", children }) {
  return (
    <section
      className={`rounded-xl border bg-white p-5 shadow-sm ${className} ${
        highlight ? "ring-1 ring-sky-200" : ""
      }`}
    >
      <h2 className="mb-3 font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1 block text-sm text-gray-600">{label}</span>
      {children}
    </label>
  );
}

function RadioCard({ checked, onChange, title, desc }) {
  return (
    <label
      className={`cursor-pointer rounded-xl border p-4 transition ${
        checked ? "border-sky-400 bg-sky-50" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="radio"
          className="mt-1 size-4 text-sky-600"
          checked={checked}
          onChange={onChange}
        />
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-sm text-gray-500">{desc}</div>
        </div>
      </div>
    </label>
  );
}

