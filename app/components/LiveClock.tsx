"use client";

import { useEffect, useState } from "react";

export default function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="text-lg md:text-xl text-[#0a0a0a]/70 font-(family-name:--font-exo2) flex items-center gap-2 pr-4 md:pr-8">
      <p>Giza</p>
      <p className="tabular-nums font-mono" suppressHydrationWarning>
        {time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })}
      </p>
    </div>
  );
}
