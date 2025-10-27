// AppLayout.jsx
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Chat from "./Chat"; // ← replace if your path differs
import { Bell, MessageSquare, X } from "lucide-react";

// If your sidebar is ~w-64, keep this. Adjust if yours differs.
const SIDEBAR_WIDTH = 256; // px

function computeSidecarWidth() {
  const w = typeof window !== "undefined" ? window.innerWidth : 1440;
  if (w >= 1024) return 480; // lg+
  if (w >= 768) return 420;  // md
  return 360;                // sm
}
function shouldReserveSpace() {
  const w = typeof window !== "undefined" ? window.innerWidth : 1440;
  return w >= 1024; // dock on desktop, overlay on smaller screens
}
function cx(...c) {
  return c.filter(Boolean).join(" ");
}

// light, subtle glass that still matches your white/gray theme
const GLASS =
  "supports-[backdrop-filter]:backdrop-blur-xl bg-white/80 border border-white/60 shadow-[0_10px_30px_-12px_rgba(2,6,23,0.12)]";

export default function AppLayout() {
  const [isSidecarOpen, setIsSidecarOpen] = useState(false);
  const [sidecarWidth, setSidecarWidth] = useState(computeSidecarWidth());
  const [reserveSpace, setReserveSpace] = useState(shouldReserveSpace());

  useEffect(() => {
    const onResize = () => {
      setSidecarWidth(computeSidecarWidth());
      setReserveSpace(shouldReserveSpace());
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === ".") setIsSidecarOpen((v) => !v);
      if (e.key === "Escape") setIsSidecarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const rightSpace = isSidecarOpen && reserveSpace ? sidecarWidth : 0;

  return (
    <div className="min-h-screen bg-gray-50 text-zinc-900">
      <div className="flex">
        {/* Sidebar stays exactly as you have it */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 relative" style={{ marginRight: rightSpace }}>
          {/* Top bar (sticky) */}
          <header className={cx("sticky top-0 z-10 border-b", GLASS)}>
            <div className="h-14 px-4 md:px-6 flex items-center justify-between">
              <h1 className="font-semibold">GENFOX • Data Analyst</h1>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Open Assistant"
                  onClick={() => setIsSidecarOpen((v) => !v)}
                  className="relative p-2 rounded-xl border border-white/60 bg-white/70 hover:bg-white"
                  title="Approvals / Assistant (Ctrl/Cmd + .)"
                >
                  <Bell className="h-5 w-5" />
                  {/* Little unread dot */}
                  <span className="absolute top-1.5 right-1.5 inline-block h-2 w-2 rounded-full bg-emerald-600" />
                </button>
                <img
                  alt="user"
                  className="h-8 w-8 rounded-full border"
                  src="https://i.pravatar.cc/64?img=5"
                />
              </div>
            </div>
          </header>

          <main className="p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Right-side assistant sidecar */}
      <AssistantSidecar
        open={isSidecarOpen}
        width={sidecarWidth}
        docked={reserveSpace}
        onClose={() => setIsSidecarOpen(false)}
      >
        {/* Sidecar header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/60">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-emerald-600/10 flex items-center justify-center ring-1 ring-emerald-700/20">
              <MessageSquare className="h-4 w-4 text-emerald-700" />
            </div>
            <div className="font-semibold">Approvals</div>
          </div>
          <button
            aria-label="Close assistant"
            onClick={() => setIsSidecarOpen(false)}
            className="p-2 rounded-xl border border-white/60 bg-white/70 hover:bg-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat area */}
        <div className="flex-1 min-h-0">
          <Chat channel="approvals" placeholder="Approve, reject, or add details…" floatingInput />
        </div>
      </AssistantSidecar>
    </div>
  );
}

/* ————————————————— Sidecar ————————————————— */

function AssistantSidecar({ open, width = 480, docked = true, onClose, children }) {
  const translate = open ? "translate-x-0" : "translate-x-full";
  const style = { width };

  return (
    <aside
      className={cx(
        "fixed top-0 right-0 z-50 h-screen flex flex-col transition-transform duration-200 ease-out",
        translate,
        GLASS,
        "rounded-l-2xl"
      )}
      style={style}
      role="region"
      aria-label="Assistant panel"
    >
      {/* subtle inner highlight on the left edge */}
      <div className="pointer-events-none absolute inset-0 rounded-l-2xl [box-shadow:inset_1px_0_0_rgba(255,255,255,0.35)]" />
      {children}

      {/* Resize/close affordance */}
      <div
        className="absolute left-0 top-0 h-full w-1 cursor-col-resize"
        title="Double-click to close"
        onDoubleClick={onClose}
      />

      {/* If overlaying (tablet/phone), add a scrim behind */}
      {!docked && open && (
        <div
          className="fixed inset-0 -z-10 bg-black/20"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </aside>
  );
}
