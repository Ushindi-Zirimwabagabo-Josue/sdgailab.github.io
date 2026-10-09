import { useEffect, useState } from 'react';
import { ContentForm } from '../shared/ContentForm';
import { StatusSelect } from '../shared/StatusSelect';
import { SlugField } from '../shared/SlugField';
import { MarkdownField } from '../shared/MarkdownField';
import { ImageUpload } from '../shared/ImageUpload';
import { VideoUpload } from '../shared/VideoUpload';
import { FormFeedback } from '../shared/FormFeedback';
import { getProject, createProject, updateProject } from '../../../lib/admin-queries';
import { useToast } from '../layout/Toast';
import type { PublishStatus, ProjectStatus } from '../../../lib/types';

type DeploymentStatus = 'live' | 'prototype' | 'internal';

interface ProjectFormPageProps {
  id?: string | null;
}

interface ProjectFormValues {
  title: string;
  slug: string;
  summary: string;
  description: string;
  project_status: ProjectStatus;
  deployment_status: DeploymentStatus;
  is_deployed: boolean;
  is_featured: boolean;
  image_url: string | null;
  impact_area: string;
  timeline: string;
  project_year: number | '';
  work_stream: string;
  capabilities_involved: string[];
  reusable_components: string;
  current_client_segments: string[];
  future_client_segments: string[];
  business_model: string;
  project_category: string;
  best_fit: string[];
  core_capabilities: string[];
  problem: string;
  solution: string;
  how_it_works: string[];
  features: string[];
  tech_stack: string[];
  collaboration_network: string;
  implementation_countries: string[];
  resource_links: string[];
  video_url: string;
  media_caption: string;
  sdgs: number[];
  display_order: number;
  status: PublishStatus;
}

const defaultValues: ProjectFormValues = {
  title: '',
  slug: '',
  summary: '',
  description: '',
  project_status: 'active' as ProjectStatus,
  deployment_status: 'prototype' as DeploymentStatus,
  is_deployed: false,
  is_featured: false,
  image_url: null as string | null,
  impact_area: '',
  timeline: '',
  project_year: '' as number | '',
  work_stream: '',
  capabilities_involved: [] as string[],
  reusable_components: '',
  current_client_segments: [] as string[],
  future_client_segments: [] as string[],
  business_model: '',
  project_category: '',
  best_fit: [] as string[],
  core_capabilities: [] as string[],
  problem: '',
  solution: '',
  how_it_works: [] as string[],
  features: [] as string[],
  tech_stack: [] as string[],
  collaboration_network: '',
  implementation_countries: [] as string[],
  resource_links: [] as string[],
  video_url: '',
  media_caption: '',
  sdgs: [] as number[],
  display_order: 0,
  status: 'draft' as PublishStatus,
};

const PROJECT_STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'under_development', label: 'Under Development' },
  { value: 'on_hold', label: 'On Hold' },
];

const DEPLOYMENT_STATUS_OPTIONS: { value: DeploymentStatus; label: string }[] = [
  { value: 'prototype', label: 'Prototype' },
  { value: 'internal', label: 'Internal' },
  { value: 'live', label: 'Live' },
];

function parseLines(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseSdgs(value: string) {
  return value
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isInteger(item));
}

export default function ProjectFormPage({ id }: ProjectFormPageProps) {
  const { showToast } = useToast();
  const [values, setValues] = useState(defaultValues);
  const [initialValues, setInitialValues] = useState(defaultValues);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(
    null
  );

  const isDirty =
    JSON.stringify({ ...values, image_url: values.image_url || null }) !==
    JSON.stringify({ ...initialValues, image_url: initialValues.image_url || null });

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setFetching(true);
    getProject(id).then(({ data, error }) => {
      setFetching(false);
      if (cancelled) return;
      if (error) {
        setFeedback({ message: error, type: 'error' });
        return;
      }
      if (data) {
        const v: ProjectFormValues = {
          title: data.title,
          slug: data.slug,
          summary: data.summary ?? '',
          description: data.description,
          project_status: data.project_status as ProjectStatus,
          deployment_status: (data.deployment_status ?? 'prototype') as DeploymentStatus,
          is_deployed: data.is_deployed,
          is_featured: data.is_featured,
          image_url: data.image_url,
          impact_area: data.impact_area ?? '',
          timeline: data.timeline ?? '',
          project_year: typeof data.project_year === 'number' ? data.project_year : '',
          work_stream: data.work_stream ?? '',
          capabilities_involved: data.capabilities_involved ?? [],
          reusable_components: data.reusable_components ?? '',
          current_client_segments: data.current_client_segments ?? [],
          future_client_segments: data.future_client_segments ?? [],
          business_model: data.business_model ?? '',
          project_category: data.project_category ?? '',
          best_fit: data.best_fit ?? [],
          core_capabilities: data.core_capabilities ?? [],
          problem: data.problem ?? '',
          solution: data.solution ?? '',
          how_it_works: data.how_it_works ?? [],
          features: data.features ?? [],
          tech_stack: data.tech_stack ?? [],
          collaboration_network: data.collaboration_network ?? '',
          implementation_countries: data.implementation_countries ?? [],
          resource_links: data.resource_links ?? [],
          video_url: data.video_url ?? '',
          media_caption: data.media_caption ?? '',
          sdgs: data.sdgs ?? [],
          display_order: data.display_order,
          status: data.status as PublishStatus,
        };
        setValues(v);
        setInitialValues(v);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (!values.description.trim()) {
      setFeedback({ message: 'Description is required', type: 'error' });
      return;
    }
    setLoading(true);
    const input = {
      title: values.title,
      slug: values.slug,
      summary: values.summary,
      description: values.description,
      project_status: values.project_status,
      deployment_status: values.deployment_status,
      is_deployed: values.is_deployed,
      is_featured: values.is_featured,
      image_url: values.image_url,
      impact_area: values.impact_area,
      timeline: values.timeline,
      project_year: values.project_year === '' ? null : values.project_year,
      work_stream: values.work_stream,
      capabilities_involved: values.capabilities_involved,
      reusable_components: values.reusable_components,
      current_client_segments: values.current_client_segments,
      future_client_segments: values.future_client_segments,
      business_model: values.business_model,
      project_category: values.project_category,
      best_fit: values.best_fit,
      core_capabilities: values.core_capabilities,
      problem: values.problem,
      solution: values.solution,
      how_it_works: values.how_it_works,
      features: values.features,
      tech_stack: values.tech_stack,
      collaboration_network: values.collaboration_network,
      implementation_countries: values.implementation_countries,
      resource_links: values.resource_links,
      video_url: values.video_url,
      media_caption: values.media_caption,
      sdgs: values.sdgs,
      display_order: values.display_order,
      status: values.status,
    };
    if (!id) {
      const { error } = await createProject(input);
      setLoading(false);
      if (error) {
        setFeedback({ message: error, type: 'error' });
        return;
      }
      showToast('Project created', 'success');
      window.location.hash = '#/projects';
    } else {
      const { error } = await updateProject(id, input);
      setLoading(false);
      if (error) {
        setFeedback({ message: error, type: 'error' });
        return;
      }
      showToast('Project updated', 'success');
      setInitialValues(values);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-lab-accent border-t-transparent"
          aria-label="Loading"
        />
      </div>
    );
  }

  return (
    <div>
      <a
        href="#/projects"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-lab-muted hover:text-lab-accent-soft"
      >
        <span aria-hidden="true">&larr;</span>
        Back to projects
      </a>
      <h1 className="text-2xl font-semibold text-lab-text mb-6">
        {id ? 'Edit Project' : 'New Project'}
      </h1>
      <ContentForm
        onSubmit={handleSubmit}
        isEdit={!!id}
        loading={loading}
        backHref="#/projects"
        isDirty={isDirty}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-lab-text mb-1">Title *</label>
            <input
              type="text"
              required
              value={values.title}
              onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
              className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <SlugField
            value={values.slug}
            sourceValue={values.title}
            onChange={(slug) => setValues((v) => ({ ...v, slug }))}
          />
          <div>
            <label className="block text-sm font-medium text-lab-text mb-1">Summary</label>
            <textarea
              value={values.summary}
              onChange={(e) => setValues((v) => ({ ...v, summary: e.target.value }))}
              rows={3}
              className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
              placeholder="Short project summary used on cards and detail page intros."
            />
          </div>
          <MarkdownField
            value={values.description}
            onChange={(val) => setValues((v) => ({ ...v, description: val }))}
            label="Description *"
          />
          <div>
            <label className="block text-sm font-medium text-lab-text mb-1">Project Status</label>
            <select
              value={values.project_status}
              onChange={(e) =>
                setValues((v) => ({ ...v, project_status: e.target.value as ProjectStatus }))
              }
              className="border rounded px-3 py-2 text-sm border-lab-border focus:outline-none focus:ring-2 focus:ring-lab-accent focus:border-lab-accent w-full"
            >
              {PROJECT_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-lab-text mb-1">Deployment Label</label>
              <select
                value={values.deployment_status}
                onChange={(e) =>
                  setValues((v) => ({ ...v, deployment_status: e.target.value as DeploymentStatus }))
                }
                className="border rounded px-3 py-2 text-sm border-lab-border focus:outline-none focus:ring-2 focus:ring-lab-accent focus:border-lab-accent w-full"
              >
                {DEPLOYMENT_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-lab-text mb-1">Impact Area</label>
              <input
                type="text"
                value={values.impact_area}
                onChange={(e) => setValues((v) => ({ ...v, impact_area: e.target.value }))}
                className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
                placeholder="Natural Language Processing"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-lab-text mb-1">Timeline</label>
              <input
                type="text"
                value={values.timeline}
                onChange={(e) => setValues((v) => ({ ...v, timeline: e.target.value }))}
                className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
                placeholder="3-12 months"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-lab-text mb-1">SDGs</label>
              <input
                type="text"
                value={values.sdgs.join(', ')}
                onChange={(e) => setValues((v) => ({ ...v, sdgs: parseSdgs(e.target.value) }))}
                className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
                placeholder="4, 9, 17"
              />
            </div>
          </div>
          <div className="rounded-lg border border-lab-border bg-lab-base p-4">
            <h2 className="text-sm font-semibold text-lab-text">Portfolio metadata</h2>
            <p className="mt-1 text-xs text-lab-muted">Fields imported from the definitive project portfolio workbook.</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-lab-text mb-1">Year</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={values.project_year}
                  onChange={(e) =>
                    setValues((v) => ({
                      ...v,
                      project_year: e.target.value ? Number(e.target.value) : '',
                    }))
                  }
                  className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
                  placeholder="2026"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-lab-text mb-1">Work Stream</label>
                <input
                  type="text"
                  value={values.work_stream}
                  onChange={(e) => setValues((v) => ({ ...v, work_stream: e.target.value }))}
                  className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
                  placeholder="GIS, NLP, Training..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-lab-text mb-1">Project Category</label>
                <input
                  type="text"
                  value={values.project_category}
                  onChange={(e) => setValues((v) => ({ ...v, project_category: e.target.value }))}
                  className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
                  placeholder="Prototype, research, tool..."
                />
              </div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-lab-text mb-1">Business Model</label>
                <input
                  type="text"
                  value={values.business_model}
                  onChange={(e) => setValues((v) => ({ ...v, business_model: e.target.value }))}
                  className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
                  placeholder="Advisory, implementation support, reusable product..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-lab-text mb-1">Capabilities Involved</label>
                <textarea
                  value={values.capabilities_involved.join('\n')}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, capabilities_involved: parseLines(e.target.value) }))
                  }
                  rows={3}
                  className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
                  placeholder="One capability per line"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-lab-text mb-1">Scalability / Reusable Components</label>
              <textarea
                value={values.reusable_components}
                onChange={(e) => setValues((v) => ({ ...v, reusable_components: e.target.value }))}
                rows={3}
                className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
                placeholder="Reusable assets, components, workflows, datasets or methods"
              />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-lab-text mb-1">Current Client Segments</label>
                <textarea
                  value={values.current_client_segments.join('\n')}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, current_client_segments: parseLines(e.target.value) }))
                  }
                  rows={4}
                  className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
                  placeholder="One current client segment per line"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-lab-text mb-1">Future Addressable Client Segments</label>
                <textarea
                  value={values.future_client_segments.join('\n')}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, future_client_segments: parseLines(e.target.value) }))
                  }
                  rows={4}
                  className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
                  placeholder="One future client segment per line"
                />
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-lab-text mb-1">Best Fit</label>
              <textarea
                value={values.best_fit.join('\n')}
                onChange={(e) => setValues((v) => ({ ...v, best_fit: parseLines(e.target.value) }))}
                rows={4}
                className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
                placeholder="One audience or partner type per line"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-lab-text mb-1">Core Capabilities</label>
              <textarea
                value={values.core_capabilities.join('\n')}
                onChange={(e) =>
                  setValues((v) => ({ ...v, core_capabilities: parseLines(e.target.value) }))
                }
                rows={4}
                className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
                placeholder="One capability per line"
              />
            </div>
          </div>
          <div className="rounded-lg border border-lab-border bg-lab-base p-4">
            <h2 className="text-sm font-semibold text-lab-text">Structured project content</h2>
            <p className="mt-1 text-xs text-lab-muted">
              Use these fields to match the agreed project template. Keep wording public-facing and concise.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-lab-text mb-1">Problem</label>
                <textarea
                  value={values.problem}
                  onChange={(e) => setValues((v) => ({ ...v, problem: e.target.value }))}
                  rows={4}
                  className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
                  placeholder="What challenge does this project respond to?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-lab-text mb-1">Solution</label>
                <textarea
                  value={values.solution}
                  onChange={(e) => setValues((v) => ({ ...v, solution: e.target.value }))}
                  rows={4}
                  className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
                  placeholder="What was built or delivered?"
                />
              </div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-lab-text mb-1">How it works</label>
                <textarea
                  value={values.how_it_works.join('\n')}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, how_it_works: parseLines(e.target.value) }))
                  }
                  rows={5}
                  className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
                  placeholder="One short step per line"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-lab-text mb-1">Features</label>
                <textarea
                  value={values.features.join('\n')}
                  onChange={(e) => setValues((v) => ({ ...v, features: parseLines(e.target.value) }))}
                  rows={5}
                  className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
                  placeholder="One feature per line"
                />
              </div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-lab-text mb-1">Tech Stack</label>
                <textarea
                  value={values.tech_stack.join('\n')}
                  onChange={(e) => setValues((v) => ({ ...v, tech_stack: parseLines(e.target.value) }))}
                  rows={5}
                  className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
                  placeholder="One technology, model, platform, or dataset per line"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-lab-text mb-1">Implementation Countries</label>
                <textarea
                  value={values.implementation_countries.join('\n')}
                  onChange={(e) =>
                    setValues((v) => ({
                      ...v,
                      implementation_countries: parseLines(e.target.value),
                    }))
                  }
                  rows={5}
                  className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
                  placeholder="One country or territory per line"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-lab-text mb-1">Collaboration / Our Network</label>
              <textarea
                value={values.collaboration_network}
                onChange={(e) =>
                  setValues((v) => ({ ...v, collaboration_network: e.target.value }))
                }
                rows={3}
                className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
                placeholder="Use collaborated with / our network wording; avoid formal partner language unless approved."
              />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-lab-text mb-1">Downloads / Resources</label>
                <textarea
                  value={values.resource_links.join('\n')}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, resource_links: parseLines(e.target.value) }))
                  }
                  rows={4}
                  className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
                  placeholder="One approved public URL per line"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-lab-text mb-1">Video / Media URL</label>
                <input
                  type="url"
                  value={values.video_url}
                  onChange={(e) => setValues((v) => ({ ...v, video_url: e.target.value }))}
                  className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
                  placeholder="https://www.youtube.com/watch?v=... or a direct .mp4 URL"
                />
                <div className="mt-3">
                  <VideoUpload
                    value={values.video_url || null}
                    folder="projects"
                    onChange={(url) => setValues((v) => ({ ...v, video_url: url ?? '' }))}
                  />
                </div>
                <label className="mt-3 block text-sm font-medium text-lab-text mb-1">Media Caption</label>
                <textarea
                  value={values.media_caption}
                  onChange={(e) => setValues((v) => ({ ...v, media_caption: e.target.value }))}
                  rows={2}
                  className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
                  placeholder="Short context for the video or media block"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_deployed"
              checked={values.is_deployed}
              onChange={(e) => setValues((v) => ({ ...v, is_deployed: e.target.checked }))}
              className="rounded border-lab-border text-lab-accent-soft focus:ring-lab-accent"
            />
            <label htmlFor="is_deployed" className="text-sm font-medium text-lab-text">
              Is Deployed
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_featured"
              checked={values.is_featured}
              onChange={(e) => setValues((v) => ({ ...v, is_featured: e.target.checked }))}
              className="rounded border-lab-border text-lab-accent-soft focus:ring-lab-accent"
            />
            <label htmlFor="is_featured" className="text-sm font-medium text-lab-text">
              Is Featured
            </label>
          </div>
          <ImageUpload
            value={values.image_url}
            folder="projects"
            onChange={(url) => setValues((v) => ({ ...v, image_url: url }))}
          />
          <div>
            <label className="block text-sm font-medium text-lab-text mb-1">Display Order</label>
            <input
              type="number"
              value={values.display_order}
              onChange={(e) =>
                setValues((v) => ({ ...v, display_order: Number(e.target.value) || 0 }))
              }
              className="w-full border border-lab-border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <StatusSelect
            value={values.status}
            onChange={(v) => setValues((prev) => ({ ...prev, status: v as PublishStatus }))}
            label="Status"
          />
          <FormFeedback
            message={feedback?.message ?? null}
            type={feedback?.type ?? 'error'}
          />
        </div>
      </ContentForm>
    </div>
  );
}




