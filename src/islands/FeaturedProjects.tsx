import { useEffect, useRef, useState } from 'react';
import { getFeaturedProjects, getPublishedProjects } from '../lib/queries';
import type { FeaturedProjectCard } from '../lib/types';
import { ProjectOverlayCard } from './components/ProjectShowcase';

function mergeProjects(featured: FeaturedProjectCard[], published: FeaturedProjectCard[]) {
  const byId = new Map<string, FeaturedProjectCard>();
  [...featured, ...published].forEach((project) => {
    if (!byId.has(project.id)) byId.set(project.id, project);
  });
  return [...byId.values()];
}

function fillRow(projects: FeaturedProjectCard[], count: number, offset: number) {
  if (projects.length === 0) return [];
  return Array.from({ length: count }, (_, index) => projects[(index + offset) % projects.length]);
}

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<FeaturedProjectCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([getFeaturedProjects(), getPublishedProjects()]).then(([featured, published]) => {
      if (featured.error && published.data.length === 0) setError(featured.error);
      setProjects(mergeProjects(featured.data, published.data));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const topRow = topRowRef.current;
    const bottomRow = bottomRowRef.current;
    if (!stage || !topRow || !bottomRow || projects.length === 0) return;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !window.matchMedia) return;

    let frame = 0;

    const update = () => {
      const rect = stage.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      const start = viewHeight * 0.9;
      const end = -rect.height + viewHeight * 0.2;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end || 1)));
      const shift = progress * 18;
      topRow.style.transform = `translate3d(${6 - shift}%, 0, 0)`;
      bottomRow.style.transform = `translate3d(${-10 + shift}%, 0, 0)`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [projects]);

  if (loading) {
    return (
      <div className="project-scroll-stage" role="status" aria-label="Loading featured projects">
        <div className="project-scroll-row">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="project-scroll-card project-scroll-card--skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="mx-auto w-[min(100%-2rem,1120px)]">
        {error && (
          <p className="mb-5 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
            Featured projects are currently being updated.
          </p>
        )}
        <div className="rounded-2xl border border-dashed border-lab-border bg-lab-section p-8 text-center">
          <h3 className="text-lg font-bold text-lab-text">Featured projects are being updated.</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-lab-muted">
            Explore the full portfolio to browse published project work.
          </p>
        </div>
      </div>
    );
  }

  const cardsPerRow = Math.max(6, Math.min(8, projects.length + 2));
  const topRow = fillRow(projects, cardsPerRow, 0);
  const bottomRow = fillRow(projects, cardsPerRow, Math.ceil(projects.length / 2));

  return (
    <div ref={stageRef} className="project-scroll-stage" aria-label="Featured projects">
      <div ref={topRowRef} className="project-scroll-row">
        {topRow.map((project, index) => (
          <ProjectOverlayCard
            key={`${project.id}-top-${index}`}
            project={project}
            index={index}
            className={`project-scroll-card ${index % 2 === 0 ? 'project-scroll-card--wide' : ''}`}
          />
        ))}
      </div>
      <div ref={bottomRowRef} className="project-scroll-row project-scroll-row--bottom">
        {bottomRow.map((project, index) => (
          <ProjectOverlayCard
            key={`${project.id}-bottom-${index}`}
            project={project}
            index={index + cardsPerRow}
            className={`project-scroll-card ${index % 2 === 1 ? 'project-scroll-card--wide' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}
