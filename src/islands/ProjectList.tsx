import { useEffect, useMemo, useState } from 'react';
import { getPublishedProjects } from '../lib/queries';
import type { ProjectListItem } from '../lib/types';
import ProjectShowcase from './components/ProjectShowcase';
import { impactAreas } from '../data/sampleContent';

const ALL_AREAS = 'all';
const ALL_YEARS = 'all';
const ALL_COUNTRIES = 'all';
const ALL_TECHNOLOGIES = 'all';
type SortOrder = 'newest' | 'oldest' | 'default';

function getProjectYear(project: ProjectListItem) {
  return typeof project.project_year === 'number' ? project.project_year : null;
}

function getProjectCountries(project: ProjectListItem) {
  return project.implementation_countries?.filter(Boolean) ?? [];
}

function getProjectTechnologies(project: ProjectListItem) {
  const technologies = [...(project.tech_stack ?? []), ...(project.capabilities_involved ?? [])];
  return Array.from(new Set(technologies.map((item) => item.trim()).filter(Boolean)));
}

function getSearchText(project: ProjectListItem) {
  return [
    project.title,
    project.summary,
    project.impact_area,
    project.timeline,
    ...(project.best_fit ?? []),
    ...(project.core_capabilities ?? []),
    ...getProjectCountries(project),
    ...getProjectTechnologies(project),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function getUniqueSortedValues(projects: ProjectListItem[], getValues: (project: ProjectListItem) => string[]) {
  return Array.from(new Set(projects.flatMap(getValues))).sort((a, b) => a.localeCompare(b));
}

export default function ProjectList() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [activeArea, setActiveArea] = useState<string>(ALL_AREAS);
  const [activeYear, setActiveYear] = useState<string>(ALL_YEARS);
  const [activeCountry, setActiveCountry] = useState<string>(ALL_COUNTRIES);
  const [activeTechnology, setActiveTechnology] = useState<string>(ALL_TECHNOLOGIES);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const availableYears = useMemo(
    () => Array.from(new Set(projects.map(getProjectYear).filter((year): year is number => year !== null))).sort((a, b) => b - a),
    [projects]
  );

  const availableCountries = useMemo(() => getUniqueSortedValues(projects, getProjectCountries), [projects]);
  const availableTechnologies = useMemo(() => getUniqueSortedValues(projects, getProjectTechnologies), [projects]);


  const filteredProjects = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filtered = projects.filter((project) => {
      const matchesArea = activeArea === ALL_AREAS || project.impact_area === activeArea;
      const matchesYear = activeYear === ALL_YEARS || getProjectYear(project)?.toString() === activeYear;
      const matchesCountry = activeCountry === ALL_COUNTRIES || getProjectCountries(project).includes(activeCountry);
      const matchesTechnology = activeTechnology === ALL_TECHNOLOGIES || getProjectTechnologies(project).includes(activeTechnology);
      const matchesQuery = !normalizedQuery || getSearchText(project).includes(normalizedQuery);
      return matchesArea && matchesYear && matchesCountry && matchesTechnology && matchesQuery;
    });

    return [...filtered].sort((a, b) => {
      if (sortOrder === 'default') return a.display_order - b.display_order;

      const yearA = getProjectYear(a) ?? 0;
      const yearB = getProjectYear(b) ?? 0;
      const byYear = sortOrder === 'newest' ? yearB - yearA : yearA - yearB;
      if (byYear !== 0) return byYear;

      return a.display_order - b.display_order;
    });
  }, [activeArea, activeCountry, activeTechnology, activeYear, projects, searchQuery, sortOrder]);

  const getAreaCount = (area: string) => projects.filter((project) => project.impact_area === area).length;
  const getYearCount = (year: number) => projects.filter((project) => getProjectYear(project) === year).length;
  const getCountryCount = (country: string) => projects.filter((project) => getProjectCountries(project).includes(country)).length;
  const getTechnologyCount = (technology: string) => projects.filter((project) => getProjectTechnologies(project).includes(technology)).length;
  const hasActiveFilters =
    activeArea !== ALL_AREAS ||
    activeYear !== ALL_YEARS ||
    activeCountry !== ALL_COUNTRIES ||
    activeTechnology !== ALL_TECHNOLOGIES ||
    sortOrder !== 'newest' ||
    searchQuery.trim().length > 0;

  function resetFilters() {
    setActiveArea(ALL_AREAS);
    setActiveYear(ALL_YEARS);
    setActiveCountry(ALL_COUNTRIES);
    setActiveTechnology(ALL_TECHNOLOGIES);
    setSortOrder('newest');
    setSearchQuery('');
  }

  useEffect(() => {
    getPublishedProjects().then(({ data, error: err }) => {
      if (err) setError(err);
      setProjects(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="h-48 rounded-2xl border border-lab-border bg-lab-section" role="status" aria-label="Loading projects" />;
  }

  return (
    <div>
      {error && <p className="mx-auto mb-5 w-[min(100%-2rem,1120px)] rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">Project information is currently being updated.</p>}


      <div className="mx-auto mb-8 w-[min(100%-2rem,1120px)] rounded-3xl bg-lab-section/70 p-4 ring-1 ring-lab-border/70 sm:p-5">
        <div className="grid gap-4 xl:grid-cols-[1.2fr_2fr] xl:items-end">
          <label className="block text-xs font-black uppercase tracking-[0.16em] text-lab-accent-soft">
            Search projects
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by title, country, technology, audience or capability"
              className="mt-2 min-h-12 w-full rounded-xl border border-lab-border bg-lab-surface px-4 py-3 text-base font-semibold normal-case tracking-normal text-lab-text outline-none transition placeholder:text-lab-subtle focus:border-lab-accent focus:ring-4 focus:ring-lab-accent/25"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-xs font-black uppercase tracking-[0.16em] text-lab-accent-soft">
              Year
              <select
                value={activeYear}
                onChange={(event) => setActiveYear(event.target.value)}
                className="project-filter-select mt-2 min-h-12 w-full rounded-xl border border-lab-border bg-lab-surface px-3 py-2 text-sm font-bold normal-case tracking-normal text-lab-text outline-none transition focus:border-lab-accent focus:ring-4 focus:ring-lab-accent/25"
              >
                <option value={ALL_YEARS}>All years ({projects.length})</option>
                {availableYears.map((year) => (
                  <option key={year} value={year.toString()}>
                    {year} ({getYearCount(year)})
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs font-black uppercase tracking-[0.16em] text-lab-accent-soft">
              Geography
              <select
                value={activeCountry}
                onChange={(event) => setActiveCountry(event.target.value)}
                className="project-filter-select mt-2 min-h-12 w-full rounded-xl border border-lab-border bg-lab-surface px-3 py-2 text-sm font-bold normal-case tracking-normal text-lab-text outline-none transition focus:border-lab-accent focus:ring-4 focus:ring-lab-accent/25"
              >
                <option value={ALL_COUNTRIES}>All countries ({projects.length})</option>
                {availableCountries.map((country) => (
                  <option key={country} value={country}>
                    {country} ({getCountryCount(country)})
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs font-black uppercase tracking-[0.16em] text-lab-accent-soft">
              Technology
              <select
                value={activeTechnology}
                onChange={(event) => setActiveTechnology(event.target.value)}
                className="project-filter-select mt-2 min-h-12 w-full rounded-xl border border-lab-border bg-lab-surface px-3 py-2 text-sm font-bold normal-case tracking-normal text-lab-text outline-none transition focus:border-lab-accent focus:ring-4 focus:ring-lab-accent/25"
              >
                <option value={ALL_TECHNOLOGIES}>All technologies ({projects.length})</option>
                {availableTechnologies.map((technology) => (
                  <option key={technology} value={technology}>
                    {technology} ({getTechnologyCount(technology)})
                  </option>
                ))}
              </select>
            </label>

            <label className="text-xs font-black uppercase tracking-[0.16em] text-lab-accent-soft">
              Sort
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value as SortOrder)}
                className="project-filter-select mt-2 min-h-12 w-full rounded-xl border border-lab-border bg-lab-surface px-3 py-2 text-sm font-bold normal-case tracking-normal text-lab-text outline-none transition focus:border-lab-accent focus:ring-4 focus:ring-lab-accent/25"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="default">Default order</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold text-lab-muted" aria-live="polite">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm font-black text-lab-accent-soft transition hover:text-primary-light"
            >
              Reset filters
            </button>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Project impact area filters">
          <button
            type="button"
            onClick={() => setActiveArea(ALL_AREAS)}
            aria-pressed={activeArea === ALL_AREAS}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              activeArea === ALL_AREAS
                ? 'bg-lab-accent text-white shadow'
                : 'border border-lab-border bg-lab-surface text-lab-muted hover:border-lab-accent hover:text-lab-accent-soft'
            }`}
          >
            All areas <span className="ml-1 opacity-80">({projects.length})</span>
          </button>
          {impactAreas.map((area) => {
            const count = getAreaCount(area.title);
            const isActive = activeArea === area.title;
            return (
              <button
                key={area.title}
                type="button"
                onClick={() => setActiveArea(area.title)}
                aria-pressed={isActive}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  isActive
                    ? 'bg-lab-accent text-white shadow'
                    : 'border border-lab-border bg-lab-surface text-lab-muted hover:border-lab-accent hover:text-lab-accent-soft'
                }`}
              >
                {area.title} <span className="ml-1 opacity-80">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="mx-auto w-[min(100%-2rem,1120px)] rounded-2xl border border-dashed border-lab-border bg-lab-section p-8 text-center">
          <h3 className="text-lg font-black text-lab-text">No published projects match these filters yet.</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-6 text-lab-muted">
            Try another keyword, impact area, country, technology or year.
          </p>
        </div>
      ) : (
        <ProjectShowcase projects={filteredProjects} />
      )}
    </div>
  );
}