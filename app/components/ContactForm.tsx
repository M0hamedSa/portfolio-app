"use client";

import { useState } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6">
      <div className="relative">
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          onFocus={() => setFocused("name")}
          onBlur={() => setFocused(null)}
          required
          placeholder="Name"
          className="w-full bg-transparent border-b-2 border-[#0a0a0a]/20 focus:border-[#0a0a0a] py-3 outline-none font-(family-name:--font-exo2) text-[#0a0a0a] transition-colors placeholder:text-[#0a0a0a]/40 text-lg"
        />
        <div
          className={`absolute bottom-0 left-0 h-[2px] bg-[#0a0a0a] transition-all duration-300 ${focused === "name" ? "w-full" : "w-0"}`}
        />
      </div>

      <div className="relative">
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          onFocus={() => setFocused("email")}
          onBlur={() => setFocused(null)}
          required
          placeholder="Email Address"
          className="w-full bg-transparent border-b-2 border-[#0a0a0a]/20 focus:border-[#0a0a0a] py-3 outline-none font-(family-name:--font-exo2) text-[#0a0a0a] transition-colors placeholder:text-[#0a0a0a]/40 text-lg"
        />
        <div
          className={`absolute bottom-0 left-0 h-[2px] bg-[#0a0a0a] transition-all duration-300 ${focused === "email" ? "w-full" : "w-0"}`}
        />
      </div>

      <div className="relative">
        <textarea
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          onFocus={() => setFocused("message")}
          onBlur={() => setFocused(null)}
          required
          placeholder="Message"
          className="w-full bg-transparent border-b-2 border-[#0a0a0a]/20 focus:border-[#0a0a0a] py-3 outline-none font-(family-name:--font-exo2) text-[#0a0a0a] transition-colors placeholder:text-[#0a0a0a]/40 text-lg resize-none"
        />
        <div
          className={`absolute bottom-0 left-0 h-[2px] bg-[#0a0a0a] transition-all duration-300 ${focused === "message" ? "w-full" : "w-0"}`}
        />
      </div>

      <button
        type="submit"
        className="w-full sm:w-auto px-10 py-4 bg-[#0a0a0a] text-[#e1e0dc] rounded-full hover:opacity-90 active:scale-[0.98] transition-all font-semibold font-(family-name:--font-exo2) text-base tracking-wide shadow-md"
      >
        {submitted ? "Message Sent!" : "Send Message"}
      </button>
    </form>
  );
}
