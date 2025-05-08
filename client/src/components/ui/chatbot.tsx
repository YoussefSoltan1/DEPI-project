import { useState } from "react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! How can I help you?" },
  ]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen((prev) => !prev);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Thanks for your question!" },
      ]);
    }, 600);
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
          </div>

          <div className="p-2 flex gap-2 border-t dark:border-zinc-700">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask something..."
              className="flex-1 px-2 py-1 border rounded dark:bg-zinc-800 dark:text-white"
            />
            <button onClick={handleSend} className="text-blue-600 dark:text-blue-400">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
