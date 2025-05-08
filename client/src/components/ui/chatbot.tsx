import { useState } from "react";
import axios from "axios";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! How can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleChat = () => setIsOpen((prev) => !prev);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/chat", { question: trimmed });
      const reply = res.data?.answer || "Hmm, I didn’t understand that.";
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-700"
      >
        {isOpen ? "Close Chat ✖️" : "Chat 💬"}
      </button>

      {/* Chatbox */}
      {isOpen && (
        <div className="w-80 h-96 mt-2 bg-white dark:bg-zinc-900 rounded-xl shadow-lg flex flex-col overflow-hidden">
          <div className="p-2 bg-zinc-800 text-white text-sm font-semibold">
            Assistant
          </div>

          <div className="flex-1 p-2 overflow-y-auto text-sm space-y-2">
            {messages.map((msg, i) => (
              <div key={i} className={`text-${msg.sender === "bot" ? "left" : "right"}`}>
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    msg.sender === "bot"
                      ? "bg-zinc-200 dark:bg-zinc-700 text-left"
                      : "bg-blue-500 text-white text-right ml-auto"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-left">
                <div className="max-w-xs px-3 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-700">
                  Thinking…
                </div>
              </div>
            )}
          </div>

          <div className="p-2 flex gap-2 border-t dark:border-zinc-700">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask something..."
              className="flex-1 px-2 py-1 border rounded dark:bg-zinc-800 dark:text-white"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              className="text-blue-600 dark:text-blue-400"
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
