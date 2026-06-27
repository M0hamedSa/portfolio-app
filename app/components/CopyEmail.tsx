"use client";

import { useState } from "react";
import { FiCopy, FiCheck, FiMail } from "react-icons/fi";

export default function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const email = "mohamed.saleh@example.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={handleCopy}
      className="flex items-center gap-3 cursor-pointer group text-[#0a0a0a] hover:opacity-80 transition-opacity mt-4"
    >
      <FiMail size={22} className="shrink-0 text-[#0a0a0a]/80" />
      <span className="font-mono text-lg sm:text-xl select-all font-medium">{email}</span>
      <span className="relative flex items-center justify-center w-6 h-6 shrink-0">
        {copied ? (
          <FiCheck size={18} className="text-green-600 absolute" />
        ) : (
          <FiCopy size={16} className="opacity-0 group-hover:opacity-100 transition-opacity absolute" />
        )}
      </span>
    </div>
  );
}
