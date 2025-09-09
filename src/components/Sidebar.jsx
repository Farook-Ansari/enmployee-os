import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  UserPlus,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";

const navItems = [
  { to: "/home", label: "Home", icon: Home },           // ✅ was "/"
  { to: "/employees/new", label: "New Employee", icon: UserPlus },
  { to: "/employees", label: "Employees", icon: Users }, // (add route later if needed)
  { to: "/settings", label: "Settings", icon: Settings }, // (add route later if needed)
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`h-screen sticky top-0 border-r bg-white transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
      aria-label="Sidebar"
    >
      <div className="flex h-full flex-col">
        {/* Header / Brand */}
        <div className="flex items-center justify-between px-3 py-4">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="grid size-10 place-items-center rounded-lg bg-emerald-600 text-white">
              <LayoutDashboard size={20} />
            </div>
            {!collapsed && (
              <div>
                <div className="font-semibold leading-none">Employee-OS</div>
                <div className="text-xs text-gray-500">COMMIT INDIA</div>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed((s) => !s)}
            className="grid size-8 place-items-center rounded-md border text-gray-600 hover:bg-gray-50"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-1 flex-1 space-y-1 px-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/home"} // ensure exact match highlighting on Home
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
              aria-label={label}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}

              {/* Tooltip when collapsed */}
              {collapsed && (
                <span
                  className="pointer-events-none absolute left-14 z-20 hidden rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow group-hover:block"
                  role="tooltip"
                >
                  {label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t p-3 text-center text-xs text-gray-400">
          {collapsed ? "v0.1" : "v0.1 • Admin"}
        </div>
      </div>
    </aside>
  );
}
