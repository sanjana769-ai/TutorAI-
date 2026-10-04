
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const API_URL = "http://localhost:3000";

export default function Tutor() {
  const studentId = localStorage.getItem("studentId") || "guest";

const currentChatKey = `tutorai_current_${studentId}`;
const recentChatsKey = `tutorai_recent_${studentId}`;

function loadStoredData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

const [message, setMessage] = useState("");
const [mode, setMode] = useState("Learn");

const [messages, setMessages] = useState(() =>
  loadStoredData(currentChatKey, [])
);

const [recentChats, setRecentChats] = useState(() =>
  loadStoredData(recentChatsKey, [])
);

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

  const inputRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const quickQuestions = [
    "Explain magnetic force visually",
    "Explain computer networks with a real-world example",
    "Explain recursion like I'm 10",
    "Explain SQL joins visually",
    "Explain neural networks simply",
  ];

  async function sendMessage(customMessage = null) {
    const question =
      customMessage !== null ? customMessage : message.trim();

    if (!question || loading) return;

    setLoading(true);
    setError("");

    setMessages((previous) => [
      ...previous,
      {
        id: Date.now(),
        role: "user",
        text: question,
      },
    ]);

    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: question,
          mode,
          studentId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.error || "TutorAI could not answer your question."
        );
      }

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          role: "assistant",
          text:
            typeof data.reply === "string"
              ? data.reply
              : JSON.stringify(data.reply),
        },
      ]);
    } catch (err) {
      console.error("TutorAI error:", err);
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function startNewSession() {
    setMessages([]);
    setMessage("");
    setError("");
    setMode("Learn");
  }

  function explainFurther(type) {
    const lastUserMessage = [...messages]
      .reverse()
      .find((item) => item.role === "user");

    const topic = lastUserMessage?.text || "this concept";

    sendMessage(`${topic} ${type}`);
  }

  return (
  <main className="tutor-page">

    {/* LEFT SIDEBAR — MINIMAL */}

    <aside className="tutor-sidebar">
      <Link to="/" className="tutor-logo">
        <span className="logo-icon">✦</span>
        <span>TutorAI</span>
      </Link>

      <button
        className="new-session-button"
        onClick={startNewSession}
      >
        <span>＋</span>
        New learning session
      </button>
    </aside>


    {/* CENTER — MAIN CHAT */}

    <section className="tutor-main">

      <header className="tutor-header">
        <span className="lesson-eyebrow">
          ✦ YOUR PERSONAL AI TUTOR
        </span>

        <h1>
          What can I help you
          <br />
          <span>understand today?</span>
        </h1>

        <p>
          Ask anything. I'll explain it in a way
          that makes sense to you.
        </p>
      </header>


      {/* CHAT MESSAGES */}

      <div className="tutor-chat">

        {messages.length === 0 && (
          <div className="tutor-welcome">
            <div className="tutor-avatar">✦</div>

            <div>
              <strong>TUTORAI</strong>
              <p>
                Hey! I'm your personal AI tutor.
                What would you like to understand today?
              </p>
            </div>
          </div>
        )}

        {messages.map((item) => (
          <div
            key={item.id}
            className={
              item.role === "user"
                ? "chat-message user-message"
                : "chat-message assistant-message"
            }
          >
            <span>
              {item.role === "user" ? "YOU" : "✦ TUTORAI"}
            </span>

            <div className="message-text">
              {item.role === "assistant" ? (
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {item.text
                    .replace(
                      /\\\[([\s\S]*?)\\\]/g,
                      (_, equation) => `$$\n${equation}\n$$`
                    )
                    .replace(
                      /\\\(([\s\S]*?)\\\)/g,
                      (_, equation) => `$${equation}$`
                    )}
                </ReactMarkdown>
              ) : (
                item.text
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="typing-message">
            <span>✦ TUTORAI</span>
            <p>
              Thinking through your question
              <span className="typing-dots">...</span>
            </p>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>


      {/* ERROR */}

      {error && (
        <div className="tutor-error">
          <strong>Something went wrong</strong>
          <p>{error}</p>
        </div>
      )}


      {/* FOLLOW-UP SUGGESTIONS */}

      {messages.length > 0 && (
        <div className="explanation-options">
          <span>EXPLORE THIS CONCEPT</span>

          <button onClick={() => explainFurther("explain simply")}>
            💡 Explain simply
          </button>

          <button
            onClick={() =>
              explainFurther("give me a real-world example")
            }
          >
            🌎 Real-world example
          </button>

          <button onClick={() => explainFurther("explain visually")}>
            🎨 Explain visually
          </button>

          <button onClick={() => explainFurther("go deeper")}>
            🧠 Go deeper
          </button>

          <button onClick={() => explainFurther("quiz me")}>
            🧩 Quiz me
          </button>
        </div>
      )}


      {/* QUICK PROMPTS */}

      {messages.length === 0 && (
        <div className="quick-questions">
          <span>TRY ASKING</span>

          {quickQuestions.map((question) => (
            <button
              key={question}
              onClick={() => sendMessage(question)}
            >
              {question}
            </button>
          ))}
        </div>
      )}


      {/* MESSAGE INPUT */}

      <form
        className="tutor-input-wrapper"
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage();
        }}
      >
        <textarea
          ref={inputRef}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask TutorAI anything..."
          rows={2}
          disabled={loading}
        />

        <button
          type="submit"
          className="send-button"
          disabled={loading || !message.trim()}
          aria-label="Send message"
        >
          ↑
        </button>
      </form>

      <div className="input-disclaimer">
        TutorAI can make mistakes. Verify important information.
      </div>

    </section>


    {/* RIGHT SIDEBAR — PREVIOUS CHATS ONLY */}

    <aside className="tutor-right-sidebar">
      <div className="previous-chats-panel">
        <h3>Previous Chats</h3>

        {messages.length > 0 ? (
          <div className="previous-chat-item">
            <span className="previous-chat-icon">◉</span>

            <div>
              <strong>
                {messages.find((item) => item.role === "user")?.text.slice(0, 35)}
              </strong>
              <small>Current conversation</small>
            </div>
          </div>
        ) : (
          <p className="previous-chats-empty">
            Your conversations will appear here.
          </p>
        )}
      </div>
    </aside>

  </main>
);
}