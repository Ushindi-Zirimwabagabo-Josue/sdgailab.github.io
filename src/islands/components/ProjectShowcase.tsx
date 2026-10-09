import type { FeaturedProjectCard } from '../../lib/types';
import { withBase } from '../../lib/url';

const gallerySizes = ['xl', 'tall', 'compact', 'wide', 'mid', 'mid'] as const;

function uniqueCompact(items?: string[]) {
  return Array.from(new Set((items ?? []).map((item) => item.trim()).filter(Boolean)));
}

function isLoopableVideo(url?: string | null) {
  return Boolean(url && /\.(mp4|webm|ogg)(\?|$)/i.test(url));
}

export function ProjectOverlayCard({
  project,
  index = 0,
  size = 'compact',
  showSummary = false,
  allowVideo = false,
  className = '',
}: {
  project: FeaturedProjectCard;
  index?: number;
  size?: string;
  showSummary?: boolean;
  allowVideo?: boolean;
  className?: string;
}) {
  const countries = uniqueCompact(project.implementation_countries);
  const meta = [project.impact_area, project.project_year, countries[0]].filter(Boolean).join(' · ');
  const videoUrl = allowVideo && isLoopableVideo(project.video_url) ? project.video_url : null;

  return (
    <a
      href={withBase(`/projects/detail/?slug=${project.slug}`)}
      className={`project-showcase-card project-showcase-card--${size} group ${className}`.trim()}
    >
      {videoUrl ? (
        <video
          className="h-full w-full object-cover"
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          poster={project.image_url ?? undefined}
          aria-hidden="true"
        />
      ) : project.image_url ? (
        <img
          src={project.image_url}
          alt=""
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          loading={index < 4 ? 'eager' : 'lazy'}
        />
      ) : (
        <div
          className="h-full w-full bg-gradient-to-br from-primary-900 via-primary to-lab-elevated"
          aria-hidden="true"
        />
      )}
      <div className="project-showcase-card__overlay">
        {meta ? (
          <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-lab-accent-soft">
            {meta}
          </p>
        ) : null}
        <h3 className="mt-2 max-w-xl text-[clamp(1.15rem,2vw,2.1rem)] font-black leading-[1.08] tracking-[-0.03em] text-lab-text">
          {project.title}
        </h3>
        {showSummary && project.summary ? (
          <p className="mt-2 max-w-lg text-sm font-semibold leading-6 text-lab-muted line-clamp-2">
            {project.summary}
          </p>
        ) : null}
      </div>
    </a>
  );
}

export default function ProjectShowcase({ projects }: { projects: FeaturedProjectCard[] }) {
  return (
    <div className="project-showcase-grid" aria-label="Projects">
      {projects.map((project, index) => (
        <ProjectOverlayCard
          key={project.id}
          project={project}
          index={index}
          size={gallerySizes[index % gallerySizes.length]}
          showSummary
        />
      ))}
    </div>
  );
}
