import Nav from "@/components/ui/Nav";
import Hero from "@/components/sections/Hero";
import FeaturedProject from "@/components/sections/FeaturedProject";
import OtherProjects from "@/components/sections/OtherProjects";
import AboutContact from "@/components/sections/AboutContact";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <FeaturedProject />
        <OtherProjects />
        <AboutContact />
      </main>
      <footer
        className="py-8 text-center text-xs"
        style={{
          color: "var(--text-muted)",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        © 2026 JIHO. Built with Next.js
      </footer>
    </>
  );
}
