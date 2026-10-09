import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getSampleProject } from '../data/sampleContent';
import { renderMarkdown } from '../lib/markdown';
import { logAppError } from '../lib/observability';
import { toFocusLabel } from '../lib/projectFocus';
import { getProjectBySlug } from '../lib/queries';
import type { Project } from '../lib/types';
import { withBase } from '../lib/url';
import ObservabilityBoundary from './components/ObservabilityBoundary';

function getYouTubeEmbedUrl(url?: string | null) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    const id = host === 'youtu.be'
      ? parsed.pathname.replace(/^\//, '')
      : parsed.pathname.startsWith('/embed/')
        ? parsed.pathname.split('/embed/')[1] ?? ''
        : parsed.searchParams.get('v') ?? '';
    const cleanId = id.split(/[?&#/]/)[0];
    return cleanId ? `https://www.youtube-nocookie.com/embed/${cleanId}` : null;
  } catch {
    return null;
  }
}

function isDirectVideoUrl(url?: string | null) {
  return Boolean(url && /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url));
}

function CaseSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="marina-case-section">
      <div className="marina-case-wrap marina-case-section-grid">
        <h2>{title}</h2>
        <div className="marina-case-body">{children}</div>
      </div>
    </section>
  );
}

function CheckList({ items }: { items: string[] }) {
  return <ul className="marina-case-list">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

function ProjectMedia({ project }: { project: Project }) {
  const embedUrl = getYouTubeEmbedUrl(project.video_url);
  const directVideo = isDirectVideoUrl(project.video_url);
  if (!project.image_url && !project.video_url) return null;

  const isStillImage = Boolean(
    project.image_url && !(project.video_url && (embedUrl || directVideo))
  );

  return (
    <div className={`marina-case-banner${isStillImage ? ' marina-case-banner--image' : ''}`}>
      {project.video_url && embedUrl ? (
        <iframe className="marina-case-banner-media" src={embedUrl} title={`${project.title} video`} loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
      ) : project.video_url && directVideo ? (
        <video className="marina-case-banner-media" controls preload="metadata" poster={project.image_url ?? undefined}>
          <source src={project.video_url} />
          <a href={project.video_url} target="_blank" rel="noreferrer">Open video</a>
        </video>
      ) : project.image_url ? (
        <img className="marina-case-banner-media" src={project.image_url} alt={project.media_caption ?? `${project.title} project visual`} />
      ) : (
        <a className="marina-case-media-link" href={project.video_url} target="_blank" rel="noreferrer">Open project media</a>
      )}
    </div>
  );
}

function ProjectDetailContent() {
  const [project, setProject] = useState<Project | null>(null);
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const slugParam = new URLSearchParams(window.location.search).get('slug');
    if (!slugParam) {
      setError('No project specified.');
      setLoading(false);
      return;
    }

    async function loadProject(slug: string) {
      try {
        // A stalled network request must not leave the public page in a permanent
        // loading state. The normal Supabase response remains the first result.
        const { data, error: queryError } = await Promise.race([
          getProjectBySlug(slug),
          new Promise<{ data: null; error: string }>((resolve) => {
            window.setTimeout(() => resolve({ data: null, error: 'Project details could not be loaded. Please try again.' }), 10000);
          }),
        ]);

        if (!active) return;
        if (queryError) {
          logAppError('public.project.load', new Error(queryError), { slug });
          setError(queryError);
          return;
        }

        const result = data ?? getSampleProject(slug);
        if (!result) {
          setError('Project not found.');
          return;
        }

        setProject(result);
        setHtml(await renderMarkdown(result.description));
      } catch (loadError) {
        if (!active) return;
        logAppError('public.project.load', loadError instanceof Error ? loadError : new Error('Unknown project loading error'), { slug });
        setError('Project details could not be loaded. Please try again.');
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProject(slugParam);
    return () => { active = false; };
  }, []);

  if (loading) {
    return <div className="marina-case-loading" role="status" aria-label="Loading project"><span className="marina-case-spinner" aria-hidden="true" /><span className="sr-only">Loading project...</span></div>;
  }
  if (error || !project) {
    return <section className="marina-case-error" role="alert"><h1>Project Not Found</h1><p>{error || 'The requested project could not be found.'}</p><a href={withBase('/projects')}>← Back to Our Work</a></section>;
  }

  const categoryLabel = toFocusLabel(project);
  const metadata = [
    categoryLabel,
    project.project_year?.toString() || project.timeline,
    project.implementation_countries?.join(', '),
  ].filter(Boolean) as string[];
  const solutionText = project.solution;
  const audience = project.best_fit?.length ? project.best_fit : project.current_client_segments?.length ? project.current_client_segments : project.future_client_segments;
  const hasStructuredContent = Boolean(
    project.problem ||
    project.solution ||
    project.how_it_works?.length ||
    project.core_capabilities?.length ||
    project.features?.length ||
    project.tech_stack?.length ||
    audience?.length ||
    project.collaboration_network ||
    project.resource_links?.length
  );

  return (
    <article className="marina-case-study">
      <header className="marina-case-hero">
        <div className="marina-case-wrap">
          <p className="marina-case-crumb"><a href={withBase('/projects')}>Our Work</a> <span aria-hidden="true">/</span> {project.title}</p>
          {metadata.length > 0 && <p className="marina-case-meta">{metadata.map((item, index) => <span key={item}>{index > 0 && <b aria-hidden="true">/</b>}{item}</span>)}</p>}
          <h1>{project.title}</h1>
          {project.summary && <p className="marina-case-summary">{project.summary}</p>}
          <ProjectMedia project={project} />
          {project.media_caption && <p className="marina-case-caption">{project.media_caption}</p>}
        </div>
      </header>

      {project.problem && <CaseSection title="Problem."><p>{project.problem}</p></CaseSection>}
      {(solutionText || (project.how_it_works?.length ?? 0) > 0) ? (
        <CaseSection title="Solution.">
          {solutionText ? <p>{solutionText}</p> : null}
          {project.how_it_works?.length ? <CheckList items={project.how_it_works} /> : null}
        </CaseSection>
      ) : null}
      {project.core_capabilities?.length ? <CaseSection title="Core capabilities."><CheckList items={project.core_capabilities} /></CaseSection> : project.features?.length ? <CaseSection title="Core capabilities."><CheckList items={project.features} /></CaseSection> : null}
      {project.tech_stack?.length ? <CaseSection title="Tech stack."><div className="marina-case-tags">{project.tech_stack.map((item) => <span key={item}>{item}</span>)}</div></CaseSection> : null}
      {audience?.length ? <CaseSection title="Who this is built for."><CheckList items={audience} /></CaseSection> : null}
      {project.collaboration_network ? <CaseSection title="Partners on the ground."><p>{project.collaboration_network}</p></CaseSection> : null}
      {project.resource_links?.length ? <CaseSection title="Publications & downloads."><div className="marina-case-resources">{project.resource_links.map((url, index) => <a key={url} href={url} target="_blank" rel="noreferrer">Resource {index + 1} ↗</a>)}</div></CaseSection> : null}
      {!hasStructuredContent && html && <CaseSection title="Project overview."><div className="marina-case-prose" dangerouslySetInnerHTML={{ __html: html }} /></CaseSection>}
    </article>
  );
}

export default function ProjectDetail() {
  return <ObservabilityBoundary surface="public" name="ProjectDetail"><ProjectDetailContent /></ObservabilityBoundary>;
}
