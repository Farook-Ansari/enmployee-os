import { useState, useRef, useEffect } from "react";
import { useAssistant } from "./AssistantContext.jsx";

// -- DataTable and CSV helpers as before (unchanged) --
function DataTable({ rows, columns }) {
  if (!rows || rows.length === 0) return null;
  const cols = columns && columns.length ? columns : Object.keys(rows[0]);
  return (
    <div className="overflow-x-auto rounded-xl border border-emerald-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-emerald-50">
          <tr>
            {cols.map((c) => (
              <th key={c} className="px-3 py-2 text-left font-semibold text-zinc-800">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-emerald-50/50"}>
              {cols.map((c) => (
                <td key={c} className="px-3 py-2 whitespace-nowrap text-zinc-700">
                  {String(r[c] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const rowsToCsv = (rows, columns) => {
  if (!rows?.length) return "";
  const cols = columns && columns.length ? columns : Object.keys(rows[0]);
  const header = cols.join(",");
  const body = rows
    .map((r) =>
      cols
        .map((c) => {
          const v = r[c] ?? "";
          const s = String(v).replace(/"/g, '""');
          return /[",\n]/.test(s) ? `"${s}"` : s;
        })
        .join(",")
    )
    .join("\n");
  return `${header}\n${body}`;
};
const downloadCsv = (rows, columns, filename = "tableau_view.csv") => {
  const csv = rowsToCsv(rows, columns);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
const getAvatarSeed = (name) => {
  if (name === "Alex") return "stew";
  if (name === "stew") return "Alex";
  return name;
};

// -- Improved flexible detection logic --
function detectModeFromBotText(botText) {
  const text = botText.toLowerCase();

  // Project/datasource: accept plural, combined, or any flexible phrasing
  if (
    (
      // Must mention both project* and datasource* (any where, plural or singular)
      /(project.*datasource|datasource.*project)/i.test(botText) &&
      /(name|names|should i use|use for that)/i.test(botText)
    ) ||
    (
      text.includes("project") &&
      text.includes("datasource") &&
      (text.includes("name") || text.includes("names") || text.includes("should i use") || text.includes("use for that"))
    )
  ) {
    // Confirm with publish/mocking context (to avoid false positives)
    if (
      text.includes("publish") ||
      text.includes("publishing") ||
      text.includes("mock data source") ||
      text.includes("should i use for that")
    ) {
      return "project-ds";
    }
  }

  // Filter/csv: accept any phrasing with both present
  if (
    (
      /filter.*csv|csv.*filter/i.test(botText)
    ) ||
    (
      text.includes("filter") &&
      text.includes("csv")
    ) ||
    /apply.*filter.*listing.*csv/i.test(botText)
  ) {
    return "filter";
  }

  return null;
}

export default function Chat() {
  const BOT_NAME = "Alex";
  const BOT_AVATAR_SEED = getAvatarSeed(BOT_NAME);

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your Tableau assistant.",
      sender: "bot",
      attachments: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const hasUserMessage = messages.some((m) => m.sender === "user");

  // Assistant context for pending badge
  const { setPendingRequest } = useAssistant();

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (hasUserMessage) scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === "" || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: "user",
      attachments: [],
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://agent-tableau-backend.onrender.com/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage.text }),
        }
      );
      const data = await response.json();
      const botMessage = {
        id: Date.now() + 1,
        text: data?.response || "Sorry, I encountered an issue.",
        sender: "bot",
        attachments: data?.attachments || [],
      };
      setMessages((prev) => [...prev, botMessage]);

      // Use improved detection for notification/sidecar
      const detectedMode = detectModeFromBotText(botMessage.text);
      if (detectedMode) setPendingRequest(detectedMode);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text:
          "Sorry, I couldn't connect to the backend. Is it running on :8000?",
        sender: "bot",
        attachments: [],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for sidecar answers:
  useEffect(() => {
    const onSidecarAnswer = (e) => {
      const { answer } = e.detail;
      const userMessage = {
        id: Date.now(),
        text: answer,
        sender: "user",
        attachments: [],
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      fetch("https://agent-tableau-backend.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: answer }),
      })
        .then((r) => r.json())
        .then((data) => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              text: data?.response || "Sorry, I encountered an issue.",
              sender: "bot",
              attachments: data?.attachments || [],
            },
          ]);
        })
        .catch(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              text: "Error using your sidecar reply.",
              sender: "bot",
              attachments: [],
            },
          ]);
        })
        .finally(() => setIsLoading(false));
    };
    window.addEventListener("sidecarAnswer", onSidecarAnswer);
    return () =>
      window.removeEventListener("sidecarAnswer", onSidecarAnswer);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  // Welcome UI (unchanged)
  if (!hasUserMessage) {
    return (
      <div className="min-h-screen grid place-items-center bg-zinc-50">
        <div className="w-[min(52rem,92vw)] px-4 md:px-6">
          <div className="flex items-start gap-3 justify-start mb-8">
            <div className="w-10 h-10 rounded-full flex-shrink-0 ring-2 ring-emerald-200">
              <img
                src={`https://i.pravatar.cc/120?u=${BOT_AVATAR_SEED}`}
                alt={`${BOT_NAME} profile`}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="max-w-2xl rounded-2xl px-4 py-3 shadow-sm border bg-white text-zinc-800 border-emerald-200 rounded-bl-none">
              <p className="whitespace-pre-wrap break-words text-left text-sm leading-relaxed">
                {messages[0].text}
              </p>
            </div>
          </div>

          <div className="rounded-full p-2 border border-emerald-300 bg-white shadow-sm focus-within:ring-2 focus-within:ring-emerald-300">
            <div className="flex items-center">
              <input
                type="text"
                className="flex-1 bg-transparent text-zinc-900 placeholder-zinc-400 focus:outline-none px-4"
                placeholder="Ask me your queries…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                aria-label="Message"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={isLoading || input.trim() === ""}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-300 disabled:text-zinc-500 disabled:cursor-not-allowed text-white rounded-full p-2 focus:outline-none transition-colors"
                aria-label="Send message"
                title="Send"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // The main chat view, unchanged
  return (
    <div className="font-sans text-zinc-900 flex flex-col h-screen w-full">
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-zinc-50 max-h-screen">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.sender === "bot" && (
              <div className="w-8 h-8 rounded-full flex-shrink-0 ring-2 ring-emerald-200">
                <img
                  src={`https://i.pravatar.cc/120?u=${BOT_AVATAR_SEED}`}
                  alt={BOT_NAME}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            )}
            <div
              className={`max-w-xs md:max-w-2xl rounded-2xl px-4 py-3 shadow-sm border ${
                message.sender === "user"
                  ? "bg-emerald-600 text-white border-emerald-600 rounded-br-none"
                  : "bg-white text-zinc-800 border-emerald-200 rounded-bl-none"
              }`}
            >
              {message.text &&
                !message.text.trim().startsWith("data:image/") && (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.text}
                  </p>
                )}
              {message.attachments?.map((att, idx) => (
                <div key={idx} className="mt-3">
                  {att.type === "image" && (
                    <>
                      {att.caption ? (
                        <div className="text-xs text-zinc-500 mb-1">
                          {att.caption}
                        </div>
                      ) : null}
                      <img
                        src={att.dataUrl}
                        alt={att.caption || "view"}
                        className="rounded-lg max-h-[480px] border border-emerald-200"
                      />
                    </>
                  )}
                  {att.type === "table" && (
                    <>
                      {att.caption ? (
                        <div className="text-xs text-zinc-500 mb-2">
                          {att.caption}
                        </div>
                      ) : null}
                      <div className="flex justify-end mb-2">
                        <button
                          onClick={() => downloadCsv(att.rows, att.columns)}
                          className="text-xs px-2 py-1 rounded-md border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        >
                          Download CSV
                        </button>
                      </div>
                      <DataTable rows={att.rows} columns={att.columns} />
                    </>
                  )}
                </div>
              ))}
            </div>
            {message.sender === "user" && (
              <div className="w-8 h-8 rounded-full bg-amber-300/90 flex items-center justify-center text-zinc-800 font-bold text-sm flex-shrink-0 ring-1 ring-amber-400">
                U
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-end gap-3 justify-start">
            <div className="w-8 h-8 rounded-full flex-shrink-0 ring-2 ring-emerald-200">
              <img
                src={`https://i.pravatar.cc/120?u=${BOT_AVATAR_SEED}`}
                alt={BOT_NAME}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="max-w-xs md:max-w-md rounded-2xl px-4 py-3 shadow-sm bg-white border border-emerald-200 rounded-bl-none">
              <div className="flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>
      <footer className="bg-white border-t border-emerald-200 sticky bottom-0">
        <div className="flex items-center bg-white rounded-full p-2 border border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-300 max-w-[52rem] mx-auto my-2">
          <input
            type="text"
            className="flex-1 bg-transparent text-zinc-900 placeholder-zinc-400 focus:outline-none px-4"
            placeholder="Ask me your queries…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            aria-label="Message"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={isLoading || input.trim() === ""}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-300 disabled:text-zinc-500 disabled:cursor-not-allowed text-white rounded-full p-2 focus:outline-none transition-colors"
            aria-label="Send message"
            title="Send"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
}
