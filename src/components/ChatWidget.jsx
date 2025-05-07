import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { openai, SYSTEM_PROMPT } from "../config/openai";

// Mock LLM responses
const mockResponses = {
  "how do i sell my license":
    "To sell your license, simply click the 'Get a Quote' button and fill out the form with your license details. Our team will review your submission and provide a valuation within 24 hours.",
  "what types of licenses":
    "We accept various types of software licenses including Antivirus, Office Suites, Design Software, and more. You can select your license type in the contact form.",
  "how long does it take":
    "The entire process typically takes 2-3 business days from submission to payment. This includes license verification, valuation, and secure payment processing.",
  "is it secure":
    "Yes, we use industry-standard encryption and secure payment processing. All transactions are protected and verified to ensure the safety of both buyers and sellers.",
  "what documents do i need":
    "You'll need your original license key, proof of purchase, and any relevant documentation. This helps us verify the authenticity of your license.",
  default:
    "I'm here to help you with selling your software licenses. You can ask me about the process, required documents, or any other questions you have about SoftSell.",
};

// Suggested questions
const suggestedQuestions = [
  "How do I sell my license?",
  "What types of licenses do you accept?",
  "How long does the process take?",
  "Is the process secure?",
  "What documents do I need?",
];

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "👋 Hi! I'm your SoftSell assistant. How can I help you today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
    setShowSuggestions(false);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages
            .filter((msg) => msg.type !== "loading") // Exclude loading messages
            .map((msg) => ({
              role: msg.type === "user" ? "user" : "assistant",
              content: msg.content,
            })),
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 150,
      });

      const botResponse = response.choices[0].message.content;
      setMessages((prev) => [...prev, { type: "bot", content: botResponse }]);
    } catch (error) {
      console.error("OpenAI API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content:
            "I apologize, but I'm having trouble connecting right now. Please try again or contact our support team.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    handleSubmit({ preventDefault: () => {} });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 left-8 p-4 rounded-full bg-[#3b82f6] dark:bg-[#60a5fa] text-white shadow-lg hover:shadow-xl z-50"
        aria-label="Toggle chat"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-4 right-4 sm:left-8 sm:right-auto sm:w-96 h-[32rem] bg-white dark:bg-[#1e293b] rounded-lg shadow-xl z-50 flex flex-col"
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-[#3b82f6] dark:border-[#60a5fa] flex justify-between items-center">
              <h3 className="text-lg font-semibold text-[#1e293b] dark:text-[#e2e8f0]">
                Chat with us
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#64748b] dark:text-[#94a3b8] hover:text-[#1e293b] dark:hover:text-[#e2e8f0] transition-colors duration-200"
                aria-label="Close chat"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === "user"
                        ? "bg-[#3b82f6] dark:bg-[#60a5fa] text-white"
                        : "bg-[#f1f5f9] dark:bg-[#334155] text-[#1e293b] dark:text-[#e2e8f0]"
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-[#f1f5f9] dark:bg-[#334155] rounded-lg p-3 flex space-x-2">
                    <motion.span
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                      }}
                      className="w-2 h-2 bg-[#3b82f6] dark:bg-[#60a5fa] rounded-full"
                    />
                    <motion.span
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: 0.2,
                      }}
                      className="w-2 h-2 bg-[#3b82f6] dark:bg-[#60a5fa] rounded-full"
                    />
                    <motion.span
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: 0.4,
                      }}
                      className="w-2 h-2 bg-[#3b82f6] dark:bg-[#60a5fa] rounded-full"
                    />
                  </div>
                </motion.div>
              )}

              {/* Suggested Questions */}
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mb-2">
                    Suggested questions:
                  </p>
                  {suggestedQuestions.map((question, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSuggestionClick(question)}
                      className="w-full text-left p-2 rounded-lg bg-[#f1f5f9] dark:bg-[#334155] text-[#1e293b] dark:text-[#e2e8f0] hover:bg-[#e2e8f0] dark:hover:bg-[#475569] transition-colors duration-200"
                    >
                      {question}
                    </motion.button>
                  ))}
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form
              onSubmit={handleSubmit}
              className="p-4 border-t border-[#3b82f6] dark:border-[#60a5fa]"
            >
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 p-2 rounded-lg border border-[#3b82f6] dark:border-[#60a5fa] focus:border-[#2563eb] dark:focus:border-[#3b82f6] focus:outline-none bg-white dark:bg-[#1e293b] text-[#1e293b] dark:text-[#e2e8f0] placeholder-[#64748b] dark:placeholder-[#94a3b8] disabled:opacity-50"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isLoading}
                  className="p-2 rounded-lg bg-[#3b82f6] dark:bg-[#60a5fa] text-white hover:bg-[#2563eb] dark:hover:bg-[#3b82f6] disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                  </svg>
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
