"use client";

import { useEffect, useRef } from "react";
import { FluidSimulation } from "@/app/lib/FluidSimulation";
import { detectPerformanceTier } from "@/app/lib/detectPerformance";

interface FluidCanvasProps {
  /** The container element the canvas should size itself to and listen for mouse events on */
  containerRef: React.RefObject<HTMLElement | null>;
}

/**
 * Renders a WebGL fluid simulation canvas positioned absolutely inside the
 * given container. Uses mix-blend-mode: difference so the fluid trail inverts
 * the colors beneath it (dark text → white, light background → dark).
 * Automatically adjusts quality based on device capability.
 */
export default function FluidCanvas({ containerRef }: FluidCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const tier = detectPerformanceTier();
    const sim = new FluidSimulation(canvas, container, {
      pressureIterations: tier.pressureIterations,
      dyeResolution: tier.dyeResolution,
      curl: tier.curl,
      simResolution: tier.simResolution,
      pixelRatio: tier.pixelRatio,
    });

    return () => {
      sim.destroy();
    };
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        mixBlendMode: "difference",
        zIndex: 110,
      }}
    />
  );
}
