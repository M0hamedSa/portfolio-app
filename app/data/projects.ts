export interface Project {
  title: string;
  description: string;
  tags: string[];
  link: string;
  role: string;
}

export const PROJECTS: Project[] = [
  {
    title: "Interactive Data Canvas",
    description: "A high-performance visual editor for exploring massive network datasets in real-time, leveraging WebGL and custom canvas layouts.",
    tags: ["Next.js", "WebGL", "TypeScript", "GSAP"],
    link: "#",
    role: "Lead Engineer"
  },
  {
    title: "Dynamic Audio Platform",
    description: "Real-time audio processing and synthesis platform using Web Audio API with highly interactive 3D shader visualizations.",
    tags: ["React", "Three.js", "Web Audio", "GLSL"],
    link: "#",
    role: "Creator"
  },
  {
    title: "Decentralized Asset Hub",
    description: "A secure digital asset client with customizable smart contract integrations, gas-optimized polling, and instant ledger validation.",
    tags: ["TypeScript", "Solidity", "Ethers.js", "Tailwind"],
    link: "#",
    role: "Core Developer"
  }
];
