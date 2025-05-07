import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatWidget from "./components/ChatWidget";
import "./App.css";

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return (
      savedTheme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
    );
  });
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);

      const sections = [
        "how-it-works",
        "why-choose-us",
        "testimonials",
        "contact",
      ];
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      setActiveSection(currentSection || "");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const handleNavClick = (section) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = ["How It Works", "Why Choose Us", "Testimonials", "Contact"];

  return (
    <div className="w-screen min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-[#1e293b] dark:text-[#e2e8f0] font-['Inter']">
      <div className="w-full max-w-none">
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#1e293b] w-full p-3 flex justify-between items-center border-b border-[#3b82f6] dark:border-[#60a5fa] shadow-md"
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-[#3b82f6] dark:text-[#60a5fa]"
          >
            SoftSell
          </motion.h1>

          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`hover:text-[#3b82f6] dark:hover:text-[#60a5fa] transition-colors relative ${
                  activeSection === item.toLowerCase().replace(/\s+/g, "-")
                    ? "text-[#3b82f6] dark:text-[#60a5fa] after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-[#3b82f6] dark:after:bg-[#60a5fa]"
                    : "text-[#1e293b] dark:text-[#e2e8f0]"
                }`}
              >
                {item}
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-[#f1f5f9] dark:hover:bg-[#334155] transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                )}
              </svg>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              onClick={toggleTheme}
              className="p-2 rounded bg-[#3b82f6] dark:bg-[#60a5fa] text-white hover:bg-[#2563eb] dark:hover:bg-[#3b82f6] transition-all duration-300"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ opacity: 0, rotate: -180 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  {theme === "light" ? (
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
                        d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                      />
                    </svg>
                  ) : (
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
                        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                      />
                    </svg>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.header>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-16 left-0 right-0 bg-white dark:bg-[#1e293b] border-b border-[#3b82f6] dark:border-[#60a5fa] shadow-lg z-40 md:hidden"
            >
              <nav className="flex flex-col p-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() =>
                      handleNavClick(item.toLowerCase().replace(/\s+/g, "-"))
                    }
                    className={`text-left p-2 rounded-lg transition-colors ${
                      activeSection === item.toLowerCase().replace(/\s+/g, "-")
                        ? "bg-[#3b82f6] dark:bg-[#60a5fa] text-white"
                        : "hover:bg-[#f1f5f9] dark:hover:bg-[#0f172a] text-[#1e293b] dark:text-[#e2e8f0] bg-white dark:bg-[#1e293b]"
                    }`}
                  >
                    {item}
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 p-3 rounded-full bg-[#3b82f6] dark:bg-[#60a5fa] text-white hover:bg-[#2563eb] dark:hover:bg-[#3b82f6] transition-all duration-300 shadow-lg z-50"
              aria-label="Back to top"
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
                  d="M4.5 15.75l7.5-7.5 7.5 7.5"
                />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        <main className="pt-16">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 text-center bg-[#f8fafc] dark:bg-[#0f172a]"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-2 text-[#1e293b] dark:text-[#e2e8f0]"
            >
              Sell Your Unused Software Licenses
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 text-[#3b82f6] dark:text-[#60a5fa]"
            >
              Fast, secure, and hassle-free. Get paid for what you don't use.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#3b82f6] hover:bg-[#2563eb] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] text-white px-6 py-3 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Get a Quote
            </motion.button>
          </motion.section>

          <motion.section
            id="how-it-works"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-white dark:bg-[#1e293b] scroll-mt-16"
          >
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-semibold mb-4 text-[#1e293b] dark:text-[#e2e8f0]"
            >
              How It Works
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Upload License", icon: "📄" },
                { title: "Get Valuation", icon: "💰" },
                { title: "Get Paid", icon: "💳" },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.03 }}
                  className="p-4 text-center border border-[#3b82f6] dark:border-[#60a5fa] gap-3 rounded-lg hover:border-[#2563eb] dark:hover:border-[#3b82f6] hover:bg-[#f8fafc] dark:hover:bg-[#0f172a] transition-colors duration-300"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="text-4xl mb-2"
                  >
                    {step.icon}
                  </motion.div>
                  <div className="text-xl font-bold text-[#1e293b] dark:text-[#e2e8f0]">
                    {step.title}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            id="why-choose-us"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-[#f8fafc] dark:bg-[#0f172a] scroll-mt-16"
          >
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-semibold mb-4 text-[#1e293b] dark:text-[#e2e8f0]"
            >
              Why Choose Us
            </motion.h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Fast Payments", icon: "⚡" },
                { title: "Secure Transactions", icon: "🔒" },
                { title: "Trusted by 1000+ Clients", icon: "👥" },
                { title: "24/7 Support", icon: "🕒" },
              ].map((feature, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="border border-[#3b82f6] dark:border-[#60a5fa] p-4 rounded-lg hover:border-[#2563eb] dark:hover:border-[#3b82f6] hover:bg-white dark:hover:bg-[#1e293b] transition-colors duration-300"
                >
                  <div className="flex items-center space-x-2">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="text-2xl"
                    >
                      {feature.icon}
                    </motion.span>
                    <span className="text-[#1e293b] dark:text-[#e2e8f0]">
                      {feature.title}
                    </span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.section>

          <motion.section
            id="testimonials"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-white dark:bg-[#1e293b] scroll-mt-16"
          >
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-semibold mb-4 text-[#1e293b] dark:text-[#e2e8f0]"
            >
              Testimonials
            </motion.h3>
            <div className="space-y-4">
              {[
                {
                  quote: "SoftSell made it super easy to cash in old licenses!",
                  author: "Jane Doe",
                  role: "IT Manager",
                  company: "TechCorp",
                },
                {
                  quote: "Quick service and great support.",
                  author: "John Smith",
                  role: "CTO",
                  company: "DevSolutions",
                },
              ].map((testimonial, i) => (
                <motion.blockquote
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="border-l-4 border-[#3b82f6] dark:border-[#60a5fa] pl-4 bg-[#f8fafc] dark:bg-[#0f172a] p-4 rounded-r-lg"
                >
                  <p className="mb-2 text-[#1e293b] dark:text-[#e2e8f0]">
                    "{testimonial.quote}"
                  </p>
                  <footer className="text-sm text-[#64748b] dark:text-[#94a3b8]">
                    — {testimonial.author}, {testimonial.role},{" "}
                    {testimonial.company}
                  </footer>
                </motion.blockquote>
              ))}
            </div>
          </motion.section>

          <motion.section
            id="contact"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-[#f8fafc] dark:bg-[#0f172a] scroll-mt-16"
          >
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-semibold mb-4 text-[#1e293b] dark:text-[#e2e8f0]"
            >
              Contact Us
            </motion.h3>
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-4 max-w-lg mx-auto"
            >
              <motion.input
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                type="text"
                placeholder="Name"
                className="border border-[#3b82f6] dark:border-[#60a5fa] p-2 rounded-lg focus:border-[#2563eb] dark:focus:border-[#3b82f6] focus:outline-none transition-colors duration-300 bg-white dark:bg-[#1e293b] text-[#1e293b] dark:text-[#e2e8f0] placeholder-[#64748b] dark:placeholder-[#94a3b8]"
                required
                aria-label="Your name"
              />
              <motion.input
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                type="email"
                placeholder="Email"
                className="border border-[#3b82f6] dark:border-[#60a5fa] p-2 rounded-lg focus:border-[#2563eb] dark:focus:border-[#3b82f6] focus:outline-none transition-colors duration-300 bg-white dark:bg-[#1e293b] text-[#1e293b] dark:text-[#e2e8f0] placeholder-[#64748b] dark:placeholder-[#94a3b8]"
                required
                aria-label="Your email"
              />
              <motion.input
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                type="text"
                placeholder="Company"
                className="border border-[#3b82f6] dark:border-[#60a5fa] p-2 rounded-lg focus:border-[#2563eb] dark:focus:border-[#3b82f6] focus:outline-none transition-colors duration-300 bg-white dark:bg-[#1e293b] text-[#1e293b] dark:text-[#e2e8f0] placeholder-[#64748b] dark:placeholder-[#94a3b8]"
                aria-label="Your company"
              />
              <motion.select
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-[#3b82f6] dark:border-[#60a5fa] p-2 rounded-lg focus:border-[#2563eb] dark:focus:border-[#3b82f6] focus:outline-none transition-colors duration-300 bg-white dark:bg-[#1e293b] text-[#1e293b] dark:text-[#e2e8f0]"
                aria-label="License type"
              >
                <option>License Type</option>
                <option>Antivirus</option>
                <option>Office Suite</option>
                <option>Design Software</option>
              </motion.select>
              <motion.textarea
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                placeholder="Message"
                className="border border-[#3b82f6] dark:border-[#60a5fa] p-2 rounded-lg focus:border-[#2563eb] dark:focus:border-[#3b82f6] focus:outline-none transition-colors duration-300 bg-white dark:bg-[#1e293b] text-[#1e293b] dark:text-[#e2e8f0] placeholder-[#64748b] dark:placeholder-[#94a3b8]"
                required
                aria-label="Your message"
              ></motion.textarea>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-[#3b82f6] hover:bg-[#2563eb] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] text-white px-6 py-3 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                Submit
              </motion.button>
            </motion.form>
          </motion.section>
        </main>

        <ChatWidget />
      </div>
    </div>
  );
}

export default App;
