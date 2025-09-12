import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus } from "lucide-react";

const SUGGESTED = [
  { id: "powerbi", name: "Power BI", img: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Power_bi_logo_black.svg" },
  { id: "tableau", name: "Tableau", img: "https://cdn.worldvectorlogo.com/logos/tableau-software.svg" },
  { id: "snowflake", name: "Snowflake", img: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Snowflake_Logo.svg" },
  { id: "azure", name: "Microsoft Azure", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" },
  { id: "postgres", name: "PostgreSQL", img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
];

export default function NewEmployeeStep3() {
  const nav = useNavigate();

  // selected connectors (ids)
  const [selected, setSelected] = useState(new Set([, "tableau", ]));
  // channel toggles
  const [portal] = useState(true); // always on
  const [teams, setTeams] = useState(true);
  const [slack, setSlack] = useState(false);

  const toggleConnector = (id) => {
    setSelected(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const addConnector = () => {
    const name = prompt("Add a connector name:");
    if (!name) return;
    const id = name.toLowerCase().replace(/\s+/g, "-");
    SUGGESTED.push({ id, name, img: "https://dummyimage.com/80x80/64748b/ffffff&text=+" });
    setSelected(prev => new Set(prev).add(id));
  };

  const continueNext = () => {
    // TODO: persist to store/api if needed
    nav("/employees/new/step-4"); // adjust path when you create Step 4
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto w-full max-w-5xl">
        {/* Progress + Title */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="w-full mr-3 h-1.5 rounded-full bg-gray-200">
              <div className="h-full w-3/5 rounded-full bg-sky-500" />
            </div>
            <span>Step-3</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold">Connectors &amp; Communication Channels</h1>
          <p className="mt-1 text-sm text-gray-500">
            Select the tools and platforms your AI employee will use to perform its tasks and communicate with your team.
          </p>
        </div>

        {/* Connector Selection */}
        <Section title="Connector Selection" helper="Based on the job description, we've suggested some connectors. You can add more as needed.">
          <div className="flex gap-4 overflow-x-auto pb-1">
            {SUGGESTED.map(c => (
              <ConnectorCard
                key={c.id}
                name={c.name}
                img={c.img}
                active={selected.has(c.id)}
                onClick={() => toggleConnector(c.id)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={addConnector}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
          >
            <Plus size={16} /> Add More Connectors
          </button>
        </Section>

        {/* Communication Channels */}
        <Section
          title="Communication Channels"
          helper="Choose how your AI employee will interact with your team. The Employee.AI Portal is always enabled."
          className="mt-6"
        >
          <ToggleRow
            title="Employee.AI Portal"
            desc="Always enabled for direct access."
            checked={portal}
            onChange={() => {}}
            disabled
          />
          <ToggleRow
            title="Microsoft Teams"
            desc="Enable communication via Microsoft Teams."
            checked={teams}
            onChange={setTeams}
          />
          <ToggleRow
            title="Slack"
            desc="Enable communication via Slack."
            checked={slack}
            onChange={setSlack}
          />
        </Section>

        {/* Footer actions */}
        <div className="mt-6 flex items-center justify-between">
          <button className="btn-outline" onClick={() => nav(-1)}>
            <ChevronLeft size={16} className="mr-1" /> Back
          </button>
          <button className="btn-primary" onClick={continueNext}>
            Next: Review &amp; Deploy
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- UI bits ---------- */

function Section({ title, helper, className = "", children }) {
  return (
    <section className={`rounded-xl border bg-white p-5 shadow-sm ${className}`}>
      <h2 className="text-lg font-semibold">{title}</h2>
      {helper && <p className="mt-1 mb-4 text-sm text-gray-500">{helper}</p>}
      {children}
    </section>
  );
}

function ConnectorCard({ name, img, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-40 flex-col items-center rounded-xl border p-3 shadow-sm transition ${
        active ? "ring-2 ring-sky-400 bg-sky-50" : "hover:bg-gray-50"
      }`}
    >
      {/* Square image frame so all logos look consistent */}
      <div className="h-16 w-16 rounded-lg bg-white p-1 grid place-items-center">
        <img
          src={img}
          alt={name}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <div className="mt-3 text-sm font-medium">{name}</div>
      <div
        className={`mt-2 h-6 w-full rounded-md text-xs grid place-items-center ${
          active ? "bg-sky-600 text-white" : "bg-gray-100 text-gray-500"
        }`}
      >
        {active ? "Selected" : "Select"}
      </div>
    </button>
  );
}

function ToggleRow({ title, desc, checked, onChange, disabled = false }) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4 mb-3 bg-gray-50">
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-gray-500">{desc}</div>
      </div>
      <label className="inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
        />
        <div
          className={`h-6 w-11 rounded-full bg-gray-300 transition peer-checked:bg-sky-600 ${
            disabled ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          <div className="relative left-0 top-0.5 ml-0.5 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
        </div>
      </label>
    </div>
  );
}

/* Optional convenience classes (put these in src/index.css under @layer components)
@layer components {
  .btn-primary { @apply inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-white hover:bg-sky-700; }
  .btn-outline { @apply inline-flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-gray-50; }
}
*/
