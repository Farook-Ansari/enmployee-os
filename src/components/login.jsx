// src/components/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    org: "",
    email: "",
    password: "",
    remember: false,
  });

  const update = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    // TODO: real auth; set token/session here
    nav("/home"); // ✅ go to Home after login
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 md:grid-cols-2">
        {/* Left: Form */}
        <section className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            {/* Logo / Brand */}
<div className="mb-8 flex items-center gap-3">
  <img
    src="/G.png"
    alt="GENFOX Logo"
    className="h-10 w-10 rounded-lg"
  />
  <div className="text-lg font-semibold">GENFOX • Employee-OS</div>
</div>
            <h1 className="mb-1 text-2xl font-bold">Sign in to your account</h1>
            <p className="mb-6 text-sm text-gray-500">
              Or{" "}
              <a className="text-emerald-700 hover:underline" href="#">
                start your 14-day free trial
              </a>
            </p>

            <form onSubmit={submit} className="space-y-4">
              {/* Organization */}
              <label className="block">
                <span className="mb-1 block text-sm text-gray-600">Organization</span>
                <select
                  className="w-full rounded-lg border border-gray-300 bg-white p-2.5 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  value={form.org}
                  onChange={(e) => update("org", e.target.value)}
                  required
                >
                  <option value="">Select your organization</option>
                  <option>Demo Org</option>
                </select>
              </label>

              {/* Email */}
              <label className="block">
                <span className="mb-1 block text-sm text-gray-600">Email address</span>
                <input
                  type="email"
                  className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  required
                />
              </label>

              {/* Password */}
              <label className="block">
                <span className="mb-1 block text-sm text-gray-600">Password</span>
                <input
                  type="password"
                  className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  required
                />
              </label>

              {/* Remember / Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                    checked={form.remember}
                    onChange={(e) => update("remember", e.target.checked)}
                  />
                  Remember me
                </label>
                <a href="#" className="text-sm text-emerald-700 hover:underline">
                  Forgot your password?
                </a>
              </div>

              {/* Sign in */}
              <button
                type="submit"
                className="w-full rounded-lg bg-emerald-600 py-2.5 font-medium text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                Sign in
              </button>

              {/* Divider */}
              <div className="relative py-2 text-center">
                <span className="relative z-10 bg-white px-2 text-xs text-gray-500">
                  or continue with
                </span>
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t" />
              </div>

              {/* Social buttons */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <SSOButton label="Google" />
                <SSOButton label="Microsoft" />
                <SSOButton label="SAML SSO" />
              </div>
            </form>
          </div>
        </section>

        {/* Right: Gradient panel with glass card */}
        <aside className="relative hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="relative flex h-full items-center justify-center p-10">
            <div className="w-full max-w-md rounded-2xl bg-white/20 p-6 text-white shadow-xl backdrop-blur-md">
              <h3 className="mb-2 text-lg font-semibold">Hire AI Employees</h3>
              <p className="text-sm leading-6 text-white/90">
                Automate your workflows, enhance productivity, and scale operations with intelligent AI agents.
                Our platform makes it easy to onboard, manage, and deploy AI employees tailored to your business needs.
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check /> Seamless integration with your existing tools.
                </li>
                <li className="flex items-start gap-2">
                  <Check /> 24/7 autonomous operation.
                </li>
                <li className="flex items-start gap-2">
                  <Check /> Secure and compliant with enterprise standards.
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SSOButton({ label }) {
  return (
    <button
      type="button"
      className="w-full rounded-lg border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      {label}
    </button>
  );
}

function Check() {
  return (
    <svg
      className="mt-0.5 size-5 flex-none"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
