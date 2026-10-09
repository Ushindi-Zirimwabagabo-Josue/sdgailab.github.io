import { useEffect, useMemo, useState } from 'react';
import { getFeaturedProjects } from '../lib/queries';
import type { FeaturedProjectCard } from '../lib/types';
import { withBase } from '../lib/url';

function uniqueCompact(items?: string[]) {
  return Array.from(new Set((items ?? []).map((item) => item.trim()).filter(Boolean)));
}

function ProjectPreviewCard({ project, index }: { project: FeaturedProjectCard; index: number }) {
  const countries = uniqueCompact(project.implementation_countries);
  const meta = [project.project_year, countries.length ? `${countries.length} ${countries.length === 1 ? 'country' : 'countries'}` : null]
    .filter(Boolean)
    .join(' · ');

  return (
    <a
      href={withBase(`/projects/detail/?slug=${project.slug}`)}
      className="hero-project-card group grid gap-4 rounded-[1.35rem] border border-lab-border bg-lab-surface/92 p-4 text-left no-underline shadow-[0_18px_44px_rgba(0,0,0,0.18)] transition hover:-translate-y-1 hover:border-lab-accent/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-lab-accent focus-visible:ring-offset-2 focus-visible:ring-offset-lab-section sm:grid-cols-[7rem_1fr]"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-gradient-to-br from-lab-accent/80 via-lab-accent/45 to-lab-elevated sm:aspect-square">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading={index < 2 ? 'eager' : 'lazy'}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(228,230,235,0.30),transparent_0.55rem),linear-gradient(135deg,rgba(76,141,255,0.62),rgba(52,56,67,0.92))]" />
        )}
        <span className="absolute bottom-3 left-3 rounded-full bg-lab-base/84 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em] text-lab-text ring-1 ring-lab-border">
          0{(index % 4) + 1}
        </span>
      </div>

      <div className="min-w-0">
        {project.impact_area && (
          <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-lab-accent-soft">
            {project.impact_area}
          </p>
        )}
        <h3 className="mt-2 line-clamp-2 text-lg font-black leading-tight text-lab-text group-hover:text-lab-accent-soft">
          {project.title}
        </h3>
        {project.summary && (
          <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-lab-muted">
            {project.summary}
          </p>
        )}
        {meta && <p className="mt-3 text-xs font-extrabold uppercase tracking-[0.12em] text-lab-subtle">{meta}</p>}
      </div>
    </a>
  );
}

function LabValueVisual() {
  const steps = [
    ['01', 'Lorem ipsum'],
    ['02', 'Dolor sit amet'],
    ['03', 'Consectetur elit'],
  ];

  return (
    <div className="grid h-full content-center gap-8">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.22em] text-lab-accent-soft">Lorem ipsum</p>
        <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-lab-text">Lorem ipsum dolor sit amet</h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-lab-muted">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>

      <div className="relative pl-7">
        <div className="absolute bottom-2 left-[0.55rem] top-2 w-px bg-lab-accent/35" aria-hidden="true" />
        <div className="grid gap-5">
          {steps.map(([number, label]) => (
            <article key={label} className="relative grid gap-1 pl-8">
              <span className="absolute left-[-0.05rem] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-lab-accent text-[0.6rem] font-black text-lab-text shadow-[0_0_22px_rgba(76,141,255,0.28)]">
                {number}
              </span>
              <h3 className="font-black text-lab-text">{label}</h3>
              <p className="text-sm font-semibold leading-6 text-lab-muted">Lorem ipsum dolor sit amet.</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
function ResearchVisual() {
  return (
    <div className="grid h-full content-center gap-7">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.22em] text-lab-accent-soft">Lorem ipsum</p>
        <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-lab-text">Lorem ipsum dolor sit amet</h2>
      </div>
      <div className="divide-y divide-lab-border/70 border-y border-lab-border/70">
        {['Publications', 'Dolor sit amet', 'Consectetur elit'].map((label, index) => (
          <div key={label} className="grid grid-cols-[2.75rem_1fr] gap-4 py-4">
            <span className="text-sm font-black text-lab-accent-soft">0{index + 1}</span>
            <div>
              <h3 className="font-black text-lab-text">{label}</h3>
              <p className="mt-1 text-sm font-semibold leading-6 text-lab-muted">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          </div>
        ))}
      </div>
      <a href={withBase('/resources')} className="inline-flex w-fit rounded-full bg-lab-accent px-5 py-2.5 text-sm font-extrabold text-lab-text no-underline hover:bg-primary-dark">
        Lorem ipsum →
      </a>
    </div>
  );
}

function SupportVisual() {
  return (
    <div className="grid h-full content-center gap-7">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.22em] text-lab-accent-soft">Lorem ipsum</p>
        <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-lab-text">Lorem ipsum dolor sit amet</h2>
      </div>
      <div className="grid gap-4">
        {['Lorem ipsum', 'Dolor sit amet', 'Consectetur elit'].map((label, index) => (
          <div key={label} className="flex items-center gap-4 border-b border-lab-border/70 pb-4 last:border-b-0">
            <span className="h-2.5 w-2.5 rounded-full bg-lab-accent shadow-[0_0_18px_rgba(76,141,255,0.34)]" />
            <span className="text-sm font-black text-lab-text">{label}</span>
            <span className="ml-auto text-xs font-black uppercase tracking-[0.14em] text-lab-subtle">0{index + 1}</span>
          </div>
        ))}
      </div>
      <a href={withBase('/contact')} className="inline-flex w-fit rounded-full bg-lab-accent px-5 py-2.5 text-sm font-extrabold text-lab-text no-underline hover:bg-primary-dark">
        Lorem ipsum →
      </a>
    </div>
  );
}
function ProjectVisual({ isActive }: { isActive: boolean }) {
  const [projects, setProjects] = useState<FeaturedProjectCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getFeaturedProjects().then(({ data }) => {
      if (!isMounted) return;
      setProjects(data.slice(0, 4));
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const scrollingProjects = useMemo(
    () => (projects.length > 1 ? [...projects, ...projects] : projects),
    [projects]
  );

  return (
    <div className="grid h-full content-start gap-5">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-lab-border/70 pb-5">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-lab-accent-soft">Project spotlight</p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-lab-text">Go and check our projects</h2>
          <p className="mt-2 max-w-md text-sm font-semibold leading-6 text-lab-muted">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
        <a href={withBase('/projects')} className="inline-flex min-h-11 items-center justify-center rounded-full bg-lab-accent px-5 py-2.5 text-sm font-extrabold text-lab-text no-underline hover:bg-primary-dark">
          View portfolio →
        </a>
      </div>

      {loading ? (
        <div className="space-y-4" role="status" aria-label="Loading featured project preview">
          {[0, 1, 2].map((item) => (
            <div key={item} className="grid gap-4 rounded-[1.35rem] border border-lab-border bg-lab-surface/70 p-4 sm:grid-cols-[7rem_1fr]">
              <div className="aspect-[16/10] rounded-2xl bg-lab-elevated sm:aspect-square" />
              <div className="space-y-3 py-1">
                <div className="h-3 w-28 rounded-full bg-lab-elevated" />
                <div className="h-5 w-3/4 rounded-full bg-lab-elevated" />
                <div className="h-3 w-full rounded-full bg-lab-elevated" />
                <div className="h-3 w-2/3 rounded-full bg-lab-elevated" />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="hero-project-window max-h-[360px] overflow-hidden pr-1">
          <div className={projects.length > 1 && isActive ? 'hero-project-track space-y-4' : 'space-y-4'}>
            {scrollingProjects.map((project, index) => (
              <ProjectPreviewCard key={`${project.id}-${index}`} project={project} index={index} />
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-[1.35rem] border border-dashed border-lab-border bg-lab-surface/70 p-7 text-center">
          <h3 className="text-lg font-black text-lab-text">Lorem ipsum dolor sit amet</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm font-semibold leading-6 text-lab-muted">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
      )}
    </div>
  );
}

export default function HeroProjectSpotlight() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleChange = (event: Event) => {
      const detail = (event as CustomEvent<{ index?: number }>).detail;
      if (typeof detail?.index === 'number') setActiveIndex(detail.index);
    };

    window.addEventListener('hero-slide-change', handleChange);
    return () => window.removeEventListener('hero-slide-change', handleChange);
  }, []);

  const panels = [
    <LabValueVisual key="lab-value" />,
    <ProjectVisual key="projects" isActive={activeIndex === 1} />,
    <ResearchVisual key="research" />,
    <SupportVisual key="support" />,
  ];

  return (
    <section
      className="hero-visual-panel relative min-h-[470px] overflow-hidden p-2 max-[1023px]:mx-auto max-[1023px]:w-full max-[1023px]:max-w-[680px] sm:p-3"
      aria-label="Hero visual summary"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_8%,rgba(76,141,255,0.16),transparent_34%),radial-gradient(circle_at_78%_64%,rgba(127,169,255,0.08),transparent_30%)]" />
      <div className="relative z-10 grid h-full min-h-[420px]">
        {panels.map((panel, index) => (
          <div
            key={index}
            className={`hero-visual-slide col-start-1 row-start-1 ${activeIndex === index ? 'is-active' : ''}`}
            aria-hidden={activeIndex === index ? 'false' : 'true'}
          >
            {panel}
          </div>
        ))}
      </div>
    </section>
  );
}