"use client";

import { useEffect, useRef } from "react";
import { FluidSimulation } from "@/app/lib/FluidSimulation";
import * as THREE from "three";

interface InvertedFluidCanvasProps {
  /** The container element the canvas should size itself to and listen for mouse events on */
  containerRef: React.RefObject<HTMLElement | null>;
}

/**
 * Renders a WebGL fluid simulation canvas positioned absolutely inside the
 * given container. Uses mix-blend-mode: difference with WHITE ink so the
 * fluid appears WHITE on a dark background, and inverts white text to black
 * on overlap — mirroring the home section's behaviour on an inverted bg.
 */
export default function InvertedFluidCanvas({ containerRef }: InvertedFluidCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // White ink + difference blend mode = white trails on black bg, inverts white text to black on overlap
    const sim = new FluidSimulation(canvas, container, {
      inkColor: new THREE.Color(1, 1, 1),
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
