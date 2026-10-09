// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const {
  getProjectMock,
  createProjectMock,
  updateProjectMock,
  showToastMock,
} = vi.hoisted(() => ({
  getProjectMock: vi.fn(),
  createProjectMock: vi.fn(),
  updateProjectMock: vi.fn(),
  showToastMock: vi.fn(),
}));

vi.mock('../../../lib/admin-queries', () => ({
  getProject: getProjectMock,
  createProject: createProjectMock,
  updateProject: updateProjectMock,
}));

vi.mock('../layout/Toast', () => ({
  useToast: () => ({
    showToast: showToastMock,
  }),
}));

vi.mock('../AdminApp', () => ({
  useNavigationGuard: () => ({
    setIsDirty: vi.fn(),
  }),
}));

vi.mock('../shared/ContentForm', () => ({
  ContentForm: ({
    children,
    onSubmit,
    loading,
  }: {
    children: React.ReactNode;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
  }) => (
    <form onSubmit={onSubmit}>
      {children}
      <button type="submit" disabled={loading}>
        Save
      </button>
    </form>
  ),
}));

vi.mock('../shared/SlugField', () => ({
  SlugField: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => (
    <input
      aria-label="Slug"
      value={value}
      onChange={(e) => onChange((e.target as HTMLInputElement).value)}
    />
  ),
}));

vi.mock('../shared/StatusSelect', () => ({
  StatusSelect: ({
    value,
    onChange,
    label,
  }: {
    value: string;
    onChange: (value: string) => void;
    label?: string;
  }) => (
    <select
      aria-label={label ?? 'Status'}
      value={value}
      onChange={(e) => onChange((e.target as HTMLSelectElement).value)}
    >
      <option value="draft">Draft</option>
      <option value="published">Published</option>
      <option value="archived">Archived</option>
    </select>
  ),
}));

vi.mock('../shared/MarkdownField', () => ({
  MarkdownField: ({
    value,
    onChange,
    label,
  }: {
    value: string;
    onChange: (value: string) => void;
    label?: string;
  }) => (
    <textarea
      aria-label={label ?? 'Description'}
      value={value}
      onChange={(e) => onChange((e.target as HTMLTextAreaElement).value)}
    />
  ),
}));

vi.mock('../shared/ImageUpload', () => ({
  ImageUpload: ({
    value,
    onChange,
  }: {
    value: string | null;
    onChange: (url: string | null) => void;
  }) => (
    <button type="button" onClick={() => onChange(value ? null : 'https://example.com/project-image.png')}>
      Toggle image
    </button>
  ),
}));

vi.mock('../shared/FormFeedback', () => ({
  FormFeedback: ({
    message,
    type,
  }: {
    message: string | null;
    type: 'success' | 'error';
  }) => (message ? <div data-feedback-type={type}>{message}</div> : null),
}));

import ProjectFormPage from './ProjectFormPage';

function setInputValue(input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, value: string) {
  const proto =
    input instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : input instanceof HTMLSelectElement
        ? HTMLSelectElement.prototype
        : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

async function flushEffects() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe('ProjectFormPage', () => {
  let container: HTMLDivElement;
  let root: Root;
  let originalHash: string;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.clearAllMocks();
    originalHash = window.location.hash;
    window.location.hash = '#/projects/new';

    getProjectMock.mockResolvedValue({ data: null, error: null });
    createProjectMock.mockResolvedValue({ data: { id: 'project-1' }, error: null });
    updateProjectMock.mockResolvedValue({ data: { id: 'project-1' }, error: null });

    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    window.location.hash = originalHash;
  });

  it('blocks submit when description is blank', async () => {
    await act(async () => {
      root.render(<ProjectFormPage />);
    });

    expect(container.querySelector('a[href="#/projects"]')?.textContent).toContain('Back to projects');

    const titleInput = container.querySelector('input[type="text"]') as HTMLInputElement;
    const slugInput = container.querySelector('input[aria-label="Slug"]') as HTMLInputElement;
    const description = container.querySelector('textarea[aria-label="Description *"]') as HTMLTextAreaElement;
    const form = container.querySelector('form') as HTMLFormElement;

    await act(async () => {
      setInputValue(titleInput, 'My project');
      setInputValue(slugInput, 'my-project');
      setInputValue(description, '   ');
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await flushEffects();

    expect(createProjectMock).not.toHaveBeenCalled();
    expect(container.textContent).toContain('Description is required');
  });

  it('creates a project and navigates back to the projects list', async () => {
    await act(async () => {
      root.render(<ProjectFormPage />);
    });

    const textInputs = Array.from(container.querySelectorAll('input[type="text"]')) as HTMLInputElement[];
    const titleInput = textInputs[0];
    const slugInput = container.querySelector('input[aria-label="Slug"]') as HTMLInputElement;
    const description = container.querySelector('textarea[aria-label="Description *"]') as HTMLTextAreaElement;
    const displayOrderInput = container.querySelector('input[type="number"]') as HTMLInputElement;
    const statusSelect = container.querySelector('select[aria-label="Status"]') as HTMLSelectElement;
    const deployedCheckbox = container.querySelector('#is_deployed') as HTMLInputElement;
    const featuredCheckbox = container.querySelector('#is_featured') as HTMLInputElement;
    const imageButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Toggle image')
    ) as HTMLButtonElement;
    const form = container.querySelector('form') as HTMLFormElement;

    await act(async () => {
      setInputValue(titleInput, 'My project');
      setInputValue(slugInput, 'my-project');
      setInputValue(description, 'Project description');
      setInputValue(displayOrderInput, '3');
      setInputValue(statusSelect, 'published');
      deployedCheckbox.click();
      featuredCheckbox.click();
      imageButton.click();
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await flushEffects();

    expect(createProjectMock).toHaveBeenCalledWith({
      title: 'My project',
      slug: 'my-project',
      summary: '',
      description: 'Project description',
      project_status: 'active',
      deployment_status: 'prototype',
      is_deployed: true,
      is_featured: true,
      image_url: 'https://example.com/project-image.png',
      impact_area: '',
      timeline: '',
      project_year: null,
      work_stream: '',
      capabilities_involved: [],
      reusable_components: '',
      current_client_segments: [],
      future_client_segments: [],
      business_model: '',
      project_category: '',
      best_fit: [],
      core_capabilities: [],
      problem: '',
      solution: '',
      how_it_works: [],
      features: [],
      tech_stack: [],
      collaboration_network: '',
      implementation_countries: [],
      resource_links: [],
      video_url: '',
      media_caption: '',
      sdgs: [],
      display_order: 3,
      status: 'published',
    });
    expect(showToastMock).toHaveBeenCalledWith('Project created', 'success');
    expect(window.location.hash).toBe('#/projects');
  });

  it('loads an existing project and updates it in place', async () => {
    getProjectMock.mockResolvedValue({
      data: {
        title: 'Existing project',
        slug: 'existing-project',
        description: 'Existing description',
        project_status: 'completed',
        is_deployed: true,
        is_featured: false,
        image_url: 'https://example.com/old-image.png',
        display_order: 5,
        status: 'draft',
      },
      error: null,
    });

    await act(async () => {
      root.render(<ProjectFormPage id="project-42" />);
    });
    await flushEffects();

    const description = container.querySelector('textarea[aria-label="Description *"]') as HTMLTextAreaElement;
    const statusSelect = container.querySelector('select[aria-label="Status"]') as HTMLSelectElement;
    const form = container.querySelector('form') as HTMLFormElement;

    expect(getProjectMock).toHaveBeenCalledWith('project-42');

    await act(async () => {
      setInputValue(description, 'Updated description');
      setInputValue(statusSelect, 'published');
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await flushEffects();

    expect(updateProjectMock).toHaveBeenCalledWith('project-42', {
      title: 'Existing project',
      slug: 'existing-project',
      summary: '',
      description: 'Updated description',
      project_status: 'completed',
      deployment_status: 'prototype',
      is_deployed: true,
      is_featured: false,
      image_url: 'https://example.com/old-image.png',
      impact_area: '',
      timeline: '',
      project_year: null,
      work_stream: '',
      capabilities_involved: [],
      reusable_components: '',
      current_client_segments: [],
      future_client_segments: [],
      business_model: '',
      project_category: '',
      best_fit: [],
      core_capabilities: [],
      problem: '',
      solution: '',
      how_it_works: [],
      features: [],
      tech_stack: [],
      collaboration_network: '',
      implementation_countries: [],
      resource_links: [],
      video_url: '',
      media_caption: '',
      sdgs: [],
      display_order: 5,
      status: 'published',
    });
    expect(showToastMock).toHaveBeenCalledWith('Project updated', 'success');
  });
});
