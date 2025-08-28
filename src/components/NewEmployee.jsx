import { useState, useMemo } from "react";

export default function NewEmployee() {
  const [jobDesc, setJobDesc] = useState("");
  const [resp, setResp] = useState([]); // [{ id, text, checked }]
  const [loading, setLoading] = useState(false);

  const generateResponsibilities = () => {
    setLoading(true);
    setTimeout(() => {
      const items = [
        "Collect and interpret data from various sources to identify patterns and trends.",
        "Develop and implement databases, data collection systems, and analytics strategies.",
        "Create visualizations and reports for requested projects.",
        "Work with management to prioritize business and information needs.",
        "Locate and define new process improvement opportunities."
      ].map((text, i) => ({ id: i + 1, text, checked: true })); // default checked
      setResp(items);
      setLoading(false);
    }, 900);
  };

  const allChecked = useMemo(() => resp.length > 0 && resp.every(r => r.checked), [resp]);
  const anyChecked = useMemo(() => resp.some(r => r.checked), [resp]);

  const toggleOne = (id) =>
    setResp(list => list.map(r => (r.id === id ? { ...r, checked: !r.checked } : r)));

  const toggleAll = () =>
    setResp(list => list.map(r => ({ ...r, checked: !allChecked })));

  const updateText = (id, text) =>
    setResp(list => list.map(r => (r.id === id ? { ...r, text } : r)));

  const removeOne = (id) =>
    setResp(list => list.filter(r => r.id !== id));

  const addOne = () =>
    setResp(list => [
      ...list,
      { id: Date.now(), text: "", checked: true }
    ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Create a New Employee.AI</h1>
          <p className="text-gray-500 text-sm">
            Follow the steps to set up your new AI-powered team member.
          </p>
        </header>

        {/* Step card */}
        <div className="rounded-xl bg-white shadow p-6 space-y-6">
          {/* Step 1 */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="size-7 rounded-full bg-blue-600 text-white text-sm grid place-items-center font-bold">
                1
              </div>
              <h2 className="font-semibold">Provide a Job Description</h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Paste a complete job description below. Our AI will analyze it to extract key
              responsibilities, skills, and qualifications.
            </p>
            <textarea
              rows={5}
              className="w-full rounded-lg border p-3 focus:border-blue-600 focus:ring-blue-600"
              placeholder="e.g. As a Data Analyst, you will be responsible for..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
            />
            <div className="mt-2 text-sm">
              <a href="#" className="text-blue-600 hover:underline">Or, upload a file</a>
            </div>
            <button
              type="button"
              onClick={generateResponsibilities}
              disabled={!jobDesc || loading}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate Responsibilities"}
            </button>
          </div>

          {/* Checklist */}
          {resp.length > 0 && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">Generated Responsibilities</h3>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    checked={allChecked}
                    onChange={toggleAll}
                  />
                  <span className="text-gray-600">Select all</span>
                </label>
              </div>

              <ul className="space-y-2">
                {resp.map(item => (
                  <li key={item.id} className="rounded-lg border bg-gray-50 p-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-1 size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                        checked={item.checked}
                        onChange={() => toggleOne(item.id)}
                      />
                      <textarea
                        className="flex-1 resize-y rounded-md border border-transparent bg-transparent p-1 text-sm outline-none focus:border-blue-300 focus:bg-white"
                        value={item.text}
                        onChange={(e) => updateText(item.id, e.target.value)}
                        rows={2}
                      />
                      <button
                        type="button"
                        onClick={() => removeOne(item.id)}
                        className="ml-1 rounded-md px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={addOne}
                  className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
                >
                  + Add responsibility
                </button>

                <div className="ml-auto">
                  <button
                    disabled={!anyChecked}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    Next: Configure Skills →
                  </button>
                </div>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Tip: Edit any item inline. Only checked items will be used in the next step.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
