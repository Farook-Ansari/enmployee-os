import React, { useState, useRef, useEffect, useMemo } from "react";

/** Persist a per-channel session id so the backend keeps context per chat */
const getOrCreateSid = (storageKey) => {
  let sid = localStorage.getItem(storageKey);
  if (!sid) {
    const fallback = `${Date.now()}-${Math.random()}`;
    // crypto.randomUUID can be unavailable on older browsers or http
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const maybeCrypto = globalThis?.crypto;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    sid = (maybeCrypto?.randomUUID?.() || fallback).toString();
    localStorage.setItem(storageKey, sid);
  }
  return sid;
};

/** Simple table renderer */
function DataTable({ rows, columns }) {
  if (!rows || rows.length === 0) return null;
  const cols = columns && columns.length ? columns : Object.keys(rows[0]);

  return (
    <div className="overflow-x-auto rounded-xl border border-emerald-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-emerald-50">
          <tr>
            {cols.map((c) => (
              <th key={c} className="px-3 py-2 text-left font-semibold text-zinc-800">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-emerald-50/50"}>
              {cols.map((c) => (
                <td key={c} className="px-3 py-2 whitespace-nowrap text-zinc-700">
                  {String(r?.[c] ?? "")}
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
          const v = r?.[c] ?? "";
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

// avatar seed swap (Alex <-> Stew) from original
const getAvatarSeed = (name) => {
  if (name === "Alex") return "stew";
  if (name === "stew") return "Alex";
  return name;
};

// Neutral, professional page background (no gradients)
const PAGE_BG = "bg-zinc-50 dark:bg-zinc-950";

export default function Chat({
  channel = "main",
  endpoint = "http://localhost:8000/chat",
  placeholder = "Ask me about your Tableau views…",
  botName = "Alex",
  floatingInput = false,
}) {
  // unique storage key per channel so sessions are independent
  const storageKey = useMemo(() => `agent_sid_${channel}`, [channel]);
  const sessionId = useMemo(() => getOrCreateSid(storageKey), [storageKey]);

  const BOT_NAME = botName;
  const BOT_AVATAR_SEED = getAvatarSeed(BOT_NAME);

  const [messages, setMessages] = useState([
    {
      id: 1,
      text:
        channel === "approvals"
          ? "Hi! I handle approvals and extra info."
          : "Hi! I'm your Tableau assistant.",
      sender: "bot",
      attachments: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Have we received any USER message yet? (Controls landing vs. chat mode)
  const hasUserMessage = useMemo(() => messages.some((m) => m.sender === "user"), [messages]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
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
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // include channel & session so backend can branch logic and keep context
        body: JSON.stringify({ message: userMessage.text, session_id: sessionId, channel }),
      });

      const data = await response.json();
      const botMessage = {
        id: Date.now() + 1,
        text: data?.response || "Sorry, I encountered an issue.",
        sender: "bot",
        attachments: data?.attachments || [],
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to get response from backend:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I couldn't connect to the backend.",
        sender: "bot",
        attachments: [],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  // === layout constants for floating composer ===
  const floatingPadding = "calc(6.5rem + env(safe-area-inset-bottom, 0px))";

  // ----- LANDING MODE (centered) -----
  // Only for main chat (not sidecar) AND before first user message.
  if (!floatingInput && channel === "main" && !hasUserMessage) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] text-zinc-900 flex w-full">
        {/* Neutral backdrop (no gradients) */}
        <main className={`grid place-content-center w-full ${PAGE_BG}`}>
          <div className="w-[min(52rem,92vw)] px-4 md:px-6">
            {/* Welcome bubble */}
            <div className="flex items-start gap-3 justify-start mb-8">
              <div className="w-8 h-8 rounded-full flex-shrink-0 ring-2 ring-emerald-200 dark:ring-emerald-800/60">
                <img
                  src={`https://i.pravatar.cc/120?u=${BOT_AVATAR_SEED}`}
                  alt={`${BOT_NAME} profile`}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="max-w-2xl rounded-2xl px-4 py-3 shadow-sm border bg-white text-zinc-800 border-emerald-200 rounded-bl-none">
                <p
                  className="whitespace-pre-wrap break-words text-sm leading-relaxed"
                  style={{ overflowWrap: "anywhere" }}
                >
                  {messages[0]?.text}
                </p>
              </div>
            </div>

            {/* Centered composer (non-sticky here) */}
            <div className="rounded-full p-2 border border-emerald-300 bg-white shadow-sm focus-within:ring-2 focus-within:ring-emerald-300">
              <div className="flex items-center">
                <input
                  type="text"
                  className="flex-1 bg-transparent text-zinc-900 placeholder-zinc-400 focus:outline-none px-4"
                  placeholder={placeholder}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  aria-label={`${channel} message`}
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isLoading || input.trim() === ""}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-300 disabled:text-zinc-500 disabled:cursor-not-allowed text-white rounded-full p-2 focus:outline-none transition-colors"
                  aria-label="Send message"
                  title="Send"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ----- CHAT MODE (top-aligned thread) -----
  return (
    <div
      className={[
        "min-h-[calc(100vh-3.5rem)]",
        "font-sans text-zinc-900 flex flex-col w-full",
        floatingInput ? "relative" : "h-full",
      ].join(" ")}
    >
      {/* Scroll container (top-aligned thread) */}
      <main
        className={["flex-1 overflow-y-auto max-h-full", PAGE_BG].join(" ")}
        style={{
          padding: "1rem",
          paddingBottom: floatingInput ? floatingPadding : "1rem",
          scrollPaddingBottom: floatingInput ? floatingPadding : "1rem",
        }}
      >
        {/* Regular vertical stack, TOP aligned */}
        <div className="w-full max-w-[52rem] mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "bot" && (
                <div className="w-8 h-8 rounded-full flex-shrink-0 ring-2 ring-emerald-200 dark:ring-emerald-800/60">
                  <img
                    src={`https://i.pravatar.cc/120?u=${BOT_AVATAR_SEED}`}
                    alt={`${BOT_NAME} profile`}
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
                {/* Text bubble (hide if it's a data URL image in text) */}
                {message.text && !String(message.text).trim().startsWith("data:image/") && (
                  <p
                    className="whitespace-pre-wrap break-words text-sm leading-relaxed"
                    style={{ overflowWrap: "anywhere" }}
                  >
                    {message.text}
                  </p>
                )}

                {/* Inline image if the text itself is an image data URL */}
                {message.text && String(message.text).trim().startsWith("data:image/") && (
                  <img
                    src={String(message.text).trim()}
                    alt="image"
                    className="rounded-lg max-h-[480px] border border-emerald-200 mt-1"
                  />
                )}

                {/* Attachments (image/table) */}
                {message.attachments?.map((att, idx) => (
                  <div key={idx} className="mt-3">
                    {att.type === "image" && (
                      <>
                        {att.caption ? (
                          <div className="text-xs text-zinc-500 mb-1">{att.caption}</div>
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
                          <div className="text-xs text-zinc-500 mb-2">{att.caption}</div>
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
              <div className="w-8 h-8 rounded-full flex-shrink-0 ring-2 ring-emerald-200 dark:ring-emerald-800/60">
                <img
                  src={`https://i.pravatar.cc/120?u=${BOT_AVATAR_SEED}`}
                  alt={`${BOT_NAME} profile`}
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

          <div ref={messagesEndRef} className="h-1" />
        </div>
      </main>

      {/* Composer (sticks to bottom; only this moves after first send) */}
      <footer className={floatingInput ? "absolute bottom-3 left-3 right-3 z-50" : "sticky bottom-0 z-20"}>
        <div
          className={[
            "flex items-center rounded-full p-2 border border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-300",
            "bg-white shadow-sm",
            floatingInput ? "shadow-lg" : "",
            "max-w-[52rem] mx-auto",
          ].join(" ")}
          style={{ paddingBottom: `max(0.5rem, env(safe-area-inset-bottom, 0px))` }}
        >
          <input
            type="text"
            className="flex-1 bg-transparent text-zinc-900 placeholder-zinc-400 focus:outline-none px-4"
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            aria-label={`${channel} message`}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={isLoading || input.trim() === ""}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-300 disabled:text-zinc-500 disabled:cursor-not-allowed text-white rounded-full p-2 focus:outline-none transition-colors"
            aria-label="Send message"
            title="Send"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
          </button>
        </div>
      </footer>
    </div>
  );
}
