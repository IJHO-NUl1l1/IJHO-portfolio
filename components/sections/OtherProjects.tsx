import { PROJECTS } from "@/lib/data";
import ProjectCard from "@/components/sections/ProjectCard";

export default function OtherProjects() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-16">
          <div className="w-8 h-px" style={{ background: "var(--indigo)" }} />
          <span
            className="text-sm font-medium"
            style={{ color: "var(--indigo-light)" }}
          >
            Other Projects
          </span>
        </div>

        <div className="flex flex-col gap-6">
          {PROJECTS.others.map((proj) => (
            <ProjectCard key={proj.id} proj={proj} />
          ))}
        </div>
      </div>
    </section>
  );
}
