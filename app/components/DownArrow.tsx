"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { FiChevronDown } from "react-icons/fi";

export default function DownArrow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.to(el, {
      y: 8,
      duration: 1,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
    });
  }, []);

  return (
    <div ref={ref} className="text-[#0a0a0a]/50">
      <FiChevronDown size={28} />
    </div>
  );
}
