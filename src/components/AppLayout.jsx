import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Chat from "@/pages/Chat";
import { Bell, MessageSquare, X } from "lucide-react";

// Keep in sync with Tailwind widths (w-64 / w-20)
const SIDEBAR_EXPANDED = 256; // px
const SIDEBAR_COLLAPSED = 80; // px

/** compute sidecar width based on viewport */
function computeSidecarWidth() {
  const w = typeof window !== "undefined" ? window.innerWidth : 1440;
  if (w >= 1024) return 480; // lg+
  if (w >= 768) return 420; // md
  return 360; // sm
}

/** dock sidecar on desktop, overlay on tablet/phone */
function shouldReserveSpace() {
  const w = typeof window !== "undefined" ? window.innerWidth : 1440;
  return w >= 1024;
}

// ————————————————— Apple-glass helpers —————————————————
function cx(...c) {
  return c.filter(Boolean).join(" ");
}

const GLASS =
  "supports-[backdrop-filter]:backdrop-blur-2xl supports-[backdrop-filter]:backdrop-saturate-150 supports-[backdrop-filter]:backdrop-contrast-125 bg-white/35 dark:bg-zinc-900/30 border border-white/40 dark:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_24px_80px_-28px_rgba(2,6,23,0.55)]";
const RING = "ring-1 ring-black/5 dark:ring-white/5";
const RADIUS = "rounded-2xl";

const AppLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // optional right-side assistant panel
  const [isSidecarOpen, setIsSidecarOpen] = useState(false);
  const [sidecarWidth, setSidecarWidth] = useState(computeSidecarWidth());
  const [reserveSpace, setReserveSpace] = useState(shouldReserveSpace());

  useEffect(() => {
    const onResize = () => {
      setSidecarWidth(computeSidecarWidth());
      setReserveSpace(shouldReserveSpace());
      // Optional: auto-collapse below lg
      // setSidebarCollapsed(window.innerWidth < 1024);
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

  const leftSpace = sidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;
  const rightSpace = isSidecarOpen && reserveSpace ? sidecarWidth : 0;

  return (
    <div className="min-h-screen relative overflow-hidden text-zinc-900 dark:text-zinc-100">
      {/* Background (shared with other pages) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.95),rgba(255,255,255,0.7))] dark:bg-[linear-gradient(to_bottom_right,rgba(9,9,11,0.9),rgba(9,9,11,0.65))]" />
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(0,0,0,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.05)_1px,transparent_1px)] [background-size:24px_24px] dark:opacity-20" />
        
        <div className="absolute bottom-0 right-0 translate-x-1/4 h-[32rem] w-[32rem] rounded-full bg-white/20 dark:bg-white/5 blur-3xl" />
      </div>

      {/* Fixed left sidebar (already glassy in your Sidebar) */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((s) => !s)} positionFixed />

      {/* Main strip between fixed sidebar and (optional) sidecar */}
      <div className="relative" style={{ marginLeft: leftSpace, marginRight: rightSpace }}>
        {/* Fixed header across the available strip */}
        <header
          className={cx("fixed top-0 z-40", GLASS, RING, "rounded-b-2xl")}
          style={{ left: leftSpace, right: rightSpace }}
        >
          {/* specular highlight */}
          <div className="pointer-events-none absolute inset-0 rounded-b-2xl [box-shadow:inset_0_-1px_0_rgba(255,255,255,0.35)]" />

          <div className="h-14 px-4 md:px-6 flex items-center justify-between">
            <h1 className="font-semibold tracking-tight">Employee OS</h1>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Approvals / Assistant"
                onClick={() => setIsSidecarOpen((v) => !v)}
                className="relative p-2 rounded-xl border border-white/40 dark:border-white/15 bg-white/60 hover:bg-white/80 dark:bg-white/5 dark:hover:bg-white/10 supports-[backdrop-filter]:backdrop-blur ring-1 ring-black/10"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 inline-block h-2 w-2 rounded-full bg-emerald-600" />
              </button>
              <img
                alt="user"
                className="h-8 w-8 rounded-full border border-white/40 dark:border-white/15"
                src="https://i.pravatar.cc/64?img=5"
              />
            </div>
          </div>
        </header>

        {/* Page content (single scroll area) */}
        <main className="pt-20 md:pt-24 p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Optional right assistant sidecar */}
      <AssistantSidecar
        open={isSidecarOpen}
        width={sidecarWidth}
        docked={reserveSpace}
        onClose={() => setIsSidecarOpen(false)}
      >
        <div className={cx("flex items-center justify-between px-4 py-3", "border-b border-white/40 dark:border-white/10")}>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-emerald-600/15 flex items-center justify-center ring-1 ring-emerald-800/20">
              <MessageSquare className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
            </div>
            <div className="font-semibold">Approvals</div>
          </div>
          <button
            aria-label="Close"
            onClick={() => setIsSidecarOpen(false)}
            className="p-2 rounded-xl border border-white/40 dark:border-white/15 bg-white/60 hover:bg-white/80 dark:bg-white/5 dark:hover:bg-white/10 supports-[backdrop-filter]:backdrop-blur ring-1 ring-black/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 min-h-0">
          <Chat channel="approvals" placeholder="Approve, reject, or add details…" floatingInput />
        </div>
      </AssistantSidecar>
    </div>
  );
};

export default AppLayout;

// ————————————————— Sidecar —————————————————

function AssistantSidecar({ open, width = 480, docked = true, onClose, children }) {
  const translate = open ? "translate-x-0" : "translate-x-full";
  const style = { width };

  return (
    <aside
      className={cx(
        "fixed top-0 right-0 z-50 h-screen flex flex-col transition-transform duration-200 ease-out",
        translate,
        GLASS,
        RING,
        "rounded-l-2xl"
      )}
      style={style}
      role="region"
      aria-label="Assistant panel"
    >
      {/* specular highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-l-2xl [box-shadow:inset_1px_0_0_rgba(255,255,255,0.28)]" />
      {children}
      <div
        className="absolute left-0 top-0 h-full w-1 cursor-col-resize"
        title="Double-click to close"
        onDoubleClick={onClose}
      />
    </aside>
  );
}
