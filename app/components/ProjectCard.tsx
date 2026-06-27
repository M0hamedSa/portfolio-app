"use client";

import { FiExternalLink } from "react-icons/fi";

interface Project {
  title: string;
  description: string;
  tags: string[];
  link: string;
  role: string;
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
      <div>
        <span className="text-xs uppercase tracking-wider text-white/50 block mb-2">{project.role}</span>
        <h3 className="text-xl sm:text-2xl font-semibold mb-4 group-hover:text-[#e1e0dc] transition-colors">{project.title}</h3>
        <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-6">{project.description}</p>
      </div>
      <div>
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span key={tag} className="text-xs bg-white/10 text-white/90 px-3 py-1 rounded-full">{tag}</span>
          ))}
        </div>
        <a
          href={project.link}
          className="inline-flex items-center gap-2 text-sm font-semibold hover:opacity-85 transition-opacity"
        >
          View Project <FiExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}
