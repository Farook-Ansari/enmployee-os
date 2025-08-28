// src/pages/Home.jsx
import Sidebar from "../components/Sidebar.jsx";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />

        {/* Main */}
        <div className="flex-1">
          {/* Top bar */}
          <header className="sticky top-0 z-10 bg-white border-b">
            <div className="h-14 px-4 md:px-6 flex items-center justify-between">
              <h1 className="font-semibold">Admin Homepage</h1>
              <div className="flex items-center gap-3">
                <Link
                  to="/employees/new"
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  + Create New Employee
                </Link>
                <img
                  alt="user"
                  className="h-8 w-8 rounded-full border"
                  src={`https://i.pravatar.cc/64?img=5`}
                />
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="p-4 md:p-6 space-y-6">
            <h2 className="text-xl font-bold">Welcome Back, Admin!</h2>

            {/* KPI cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard title="Total Employees" value="12" />
              <StatCard title="Total Runs" value="120" />
              <StatCard title="Total Spend" value="$1,200" />
            </section>

            {/* Recent activity */}
            <section className="bg-white rounded-xl border p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Recent Activity</h3>
              </div>
              <div className="grid gap-3 md:grid-cols-4">
                {[
                  { name: "Alex Cohen", desc: "Sent 100 emails", time: "2h" },
                  { name: "Ben Carter", desc: "Generated 5 leads", time: "5h" },
                  { name: "Clara Rodriguez", desc: "Resolved 20 tickets", time: "1d" },
                  { name: "David Patel", desc: "Updated roadmap", time: "2d" },
                ].map((a, i) => (
                  <Activity key={i} {...a} />
                ))}
              </div>
            </section>

            {/* Setup tasks */}
            <section className="bg-white rounded-xl border p-4">
              <h3 className="font-semibold mb-3">Setup Tasks</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <SetupCard title="Add Organization Hierarchy" desc="Define the structure of your company" />
                <SetupCard title="Add Org Knowledge Base" desc="Provide documents for the AI" />
                <SetupCard title="Add Conversation Checkpoints" desc="Set up approvals for key actions" />
              </div>
            </section>

            {/* Employees table */}
            <section className="bg-white rounded-xl border">
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
                    {rows.map((r) => (
                      <tr key={r.name} className="hover:bg-gray-50">
                        <Td className="font-medium">{r.name}</Td>
                        <Td>{r.role}</Td>
                        <Td>
                          <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <span className="size-2 rounded-full bg-emerald-500" /> Active
                          </span>
                        </Td>
                        <Td>{r.lastRun}</Td>
                        <Td>{r.spend}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

/* --- Small building blocks --- */
function StatCard({ title, value }) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="text-gray-500 text-sm">{title}</div>
      <div className="text-3xl font-bold mt-1">{value}</div>
    </div>
  );
}

function Activity({ name, desc, time }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <img className="h-10 w-10 rounded-full" src={`https://i.pravatar.cc/40?u=${name}`} alt={name} />
      <div className="min-w-0">
        <div className="font-medium truncate">{name}</div>
        <div className="text-xs text-gray-500 truncate">{desc}</div>
        <div className="text-[11px] text-gray-400 mt-1">{time} ago</div>
      </div>
    </div>
  );
}

function SetupCard({ title, desc }) {
  return (
    <div className="rounded-xl border p-5 bg-gray-50">
      <div className="h-14 w-14 rounded-lg bg-amber-100 grid place-items-center text-2xl mb-3">🧩</div>
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-gray-500">{desc}</div>
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
  { name: "Alex Cohen", role: "Sales Development", lastRun: "2 days ago", spend: "$200" },
  { name: "Ben Carter", role: "Marketing Lead", lastRun: "3 days ago", spend: "$300" },
  { name: "Clara Rodriguez", role: "Customer Support", lastRun: "1 day ago", spend: "$100" },
  { name: "David Patel", role: "Product Manager", lastRun: "4 days ago", spend: "$400" },
  { name: "Emily White", role: "Software Engineer", lastRun: "5 days ago", spend: "$200" },
];
