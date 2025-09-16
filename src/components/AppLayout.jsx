import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar always visible */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1">
          {/* Optional: Top bar */}
          <header className="sticky top-0 z-10 bg-white border-b">
            <div className="h-14 px-4 md:px-6 flex items-center justify-between">
              <h1 className="font-semibold">GENFOX • Data Analyst</h1>
              <div className="flex items-center gap-3">
                <img
                  alt="user"
                  className="h-8 w-8 rounded-full border"
                  src="https://i.pravatar.cc/64?img=5"
                />
              </div>
            </div>
          </header>

          <main className="p-4 md:p-6">
            <Outlet /> {/* 👈 renders whichever page is active */}
          </main>
        </div>
      </div>
    </div>
  );
}

