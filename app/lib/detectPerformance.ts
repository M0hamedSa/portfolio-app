export interface PerformanceTier {
  label: "low" | "medium" | "high";
  pressureIterations: number;
  dyeResolution: number;
  curl: number;
  simResolution: number;
  pixelRatio: number;
}

export function detectPerformanceTier(): PerformanceTier {
  if (typeof window === "undefined") return medium;

  const cpu = navigator.hardwareConcurrency;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;

  const gl =
    (document.createElement("canvas").getContext("webgl2") as WebGL2RenderingContext | null) ||
    (document.createElement("canvas").getContext("webgl") as WebGLRenderingContext | null);

  let gpuScore = 0;
  if (gl) {
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = ext
      ? (gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string).toLowerCase()
      : "";
    if (/intel hd graphics|mali|adreno 5|powervr/i.test(renderer)) gpuScore = 1;
    else if (/intel|swiftshader|llvmpipe|mesa/i.test(renderer)) gpuScore = 0.5;
  }

  const memScore = mem !== undefined ? (mem <= 4 ? 1 : mem <= 8 ? 0.5 : 0) : 0;
  const cpuScore = cpu !== undefined ? (cpu <= 4 ? 1 : cpu <= 8 ? 0.5 : 0) : 0.5;

  const score = cpuScore + memScore + gpuScore;

  if (score >= 1.5) return low;
  if (score >= 0.5) return medium;
  return high;
}

export const low: PerformanceTier = {
  label: "low",
  pressureIterations: 10,
  dyeResolution: 256,
  curl: 8,
  simResolution: 128,
  pixelRatio: 1,
};

export const medium: PerformanceTier = {
  label: "medium",
  pressureIterations: 25,
  dyeResolution: 512,
  curl: 15,
  simResolution: 192,
  pixelRatio: 1.5,
};

export const high: PerformanceTier = {
  label: "high",
  pressureIterations: 50,
  dyeResolution: 1024,
  curl: 25,
  simResolution: 256,
  pixelRatio: 2,
};
