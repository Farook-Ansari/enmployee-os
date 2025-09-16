import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Home() {
  const [showAlert, setShowAlert] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);

  const handleFileUpload = (file, title) => {
    if (file) {
      setUploadedFileName(file.name);
      setShowAlert(true);
      console.log(`File selected for ${title}:`, file.name); // Debug log
    }
  };

  useEffect(() => {
    let timer;
    if (showAlert) {
      timer = setTimeout(() => setShowAlert(false), 3000);
    }
    return () => clearTimeout(timer);
  }, [showAlert]);

  return (
    <div className="relative space-y-6">
      {showAlert && (
        <div
          key={uploadedFileName}
          className="absolute top-0 left-0 right-0 mx-auto max-w-md flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white shadow-lg transform -translate-y-4 transition-all duration-300 z-50"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          Successfully uploaded
        </div>
      )}
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Admin Homepage</h1>
        <Link
          to="/employees/new"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          + Create New Employee
        </Link>
      </div>

      {/* KPI cards */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Total Employees" value="12" />
        <StatCard title="Total Runs" value="120" />
        <StatCard title="Total Spend" value="$1,200" />
      </section>

      {/* Recent activity */}
      <section className="rounded-xl border bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">Recent Activity</h3>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          {[
            { name: "Alex", desc: "Resolved 20 tickets", time: "1d" },
            { name: "stew", desc: "Sent 100 emails", time: "2h" },
            { name: "Ben Carter", desc: "Generated 5 leads", time: "5h" },
            { name: "David Patel", desc: "Updated roadmap", time: "2d" },
          ].map((a, i) => (
            <Activity key={i} {...a} />
          ))}
        </div>
      </section>

      {/* Setup tasks */}
      <section className="rounded-xl border bg-white p-4">
        <h3 className="mb-3 font-semibold">Setup Tasks</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <SetupCard
            title="Add Organization Hierarchy"
            desc="Define the structure of your company"
            allowUpload={true}
            onFileUpload={handleFileUpload}
          />
          <SetupCard
            title="Add Org Knowledge Base"
            desc="Provide documents for the AI"
            allowUpload={true}
            onFileUpload={handleFileUpload}
          />
          <SetupCard
            title="Add Conversation Checkpoints"
            desc="Set up approvals for key actions"
          />
        </div>
      </section>

      {/* Employees table */}
      <section className="rounded-xl border bg-white">
        <div className="p-4">
          <h3 className="font-semibold">Employees</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <Th>NAME</Th>
                <Th>ROLE</Th>
                <Th>STATUS</Th>
                <Th>LAST RUN</Th>
                <Th>SPEND</Th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((r) => {
                // Swap logic for employees table too
                let imageUser = r.name;
                if (r.name === "Alex") imageUser = "stew";
                if (r.name === "stew") imageUser = "Alex";

                return (
                  <tr key={r.name} className="hover:bg-gray-50">
                    <Td className="font-medium flex items-center gap-2">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={`https://i.pravatar.cc/40?u=${imageUser}`}
                        alt={r.name}
                      />
                      {r.name === "Alex" ? (
                        <Link
                          to="/employees/profile"
                          className="text-emerald-600 hover:underline"
                        >
                          {r.name}
                        </Link>
                      ) : (
                        r.name
                      )}
                    </Td>
                    <Td>{r.role}</Td>
                    <Td>
                      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-1 text-emerald-700">
                        <span className="size-2 rounded-full bg-emerald-500" /> Active
                      </span>
                    </Td>
                    <Td>{r.lastRun}</Td>
                    <Td>{r.spend}</Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* --- Small building blocks --- */
function StatCard({ title, value }) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-1 text-3xl font-bold">{value}</div>
    </div>
  );
}

function Activity({ name, desc, time }) {
  const isAlex = name === "Alex";
  const isStew = name === "stew";

  // Swap avatar logic
  let imageUser = name;
  if (isAlex) imageUser = "stew";
  else if (isStew) imageUser = "Alex";

  const content = (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <img
        className="h-10 w-10 rounded-full"
        src={`https://i.pravatar.cc/40?u=${imageUser}`}
        alt={name}
      />
      <div className="min-w-0">
        <div className="truncate font-medium">
          {isAlex ? (
            <Link
              to="/employees/profile"
              className="text-emerald-600 hover:underline"
            >
              {name}
            </Link>
          ) : (
            name
          )}
        </div>
        <div className="truncate text-xs text-gray-500">{desc}</div>
        <div className="mt-1 text-[11px] text-gray-400">{time} ago</div>
      </div>
    </div>
  );

  return isAlex ? (
    <Link to="/employees/profile" className="block hover:bg-gray-50 rounded-lg">
      {content}
    </Link>
  ) : (
    content
  );
}

function SetupCard({ title, desc, allowUpload = false, onFileUpload }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && onFileUpload) {
      onFileUpload(file, title);
    }
  };

  return (
    <div className="relative rounded-xl border bg-gray-50 p-5">
      <div className="mb-3 grid h-14 w-14 place-items-center rounded-lg bg-amber-100 text-2xl">
        🧩
      </div>
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-gray-500">{desc}</div>
      {allowUpload && (
        <div className="mt-3">
          <label className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 cursor-pointer">
            Upload Document
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt"
            />
          </label>
        </div>
      )}
    </div>
  );
}

function Th({ children }) {
  return <th className="px-4 py-2 text-left font-medium">{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}

const rows = [
  { name: "Cohen", role: "Sales Development", lastRun: "1 min ago", spend: "$200" },
  { name: "Ben Carter", role: "Marketing Lead", lastRun: "3 days ago", spend: "$300" },
  { name: "Alex", role: "Customer Support", lastRun: "1 day ago", spend: "$100" },
  { name: "David Patel", role: "Product Manager", lastRun: "4 days ago", spend: "$400" },
  { name: "Emily White", role: "Software Engineer", lastRun: "5 days ago", spend: "$200" },
  { name: "stew", role: "Operations", lastRun: "8h ago", spend: "$150" }, // ensure Stew is also in table
];
