import { useEffect, useMemo, useRef, useState } from 'react';
import { loadPageCopy } from '../lib/pageCopy';
import { sectionFallback } from '../lib/pageSections';
import { FOCUS_LABELS, toFocus, type FocusCategory } from '../lib/projectFocus';
import { getPublishedProjects } from '../lib/queries';
import { withBase } from '../lib/url';
import type { ProjectListItem } from '../lib/types';

type FocusFilter = 'all' | FocusCategory;
type ProjectStatusLabel = 'ongoing' | 'completed';
type OpenFilter = 'country' | 'year' | null;

type PortfolioCard = ProjectListItem & {
  focus: FocusCategory;
  label: string;
  statusLabel: ProjectStatusLabel;
  yearLabel: string | null;
  summaryLabel: string;
  locationLabel: string;
  places: string[];
  code: string;
};

function toStatus(project: ProjectListItem): ProjectStatusLabel {
  return project.project_status === 'completed' ? 'completed' : 'ongoing';
}

function toCode(focus: FocusCategory): string {
  if (focus === 'gis') return 'GIS';
  if (focus === 'nlp') return 'NLP';
  return 'TR';
}

function toYear(project: ProjectListItem): string | null {
  if (project.project_year) return String(project.project_year);
  const timeline = project.timeline?.trim();
  if (!timeline) return null;
  const match = timeline.match(/\b(20\d{2})\b/);
  return match?.[1] ?? null;
}

function isPlaceholderCountry(value: string): boolean {
  return /missing|needs input/i.test(value);
}

function cleanCountries(countries?: string[] | null): string[] {
  return (countries ?? [])
    .map((country) => country.trim())
    .filter((country) => country.length > 0 && !isPlaceholderCountry(country));
}

/** Expand messy location entries into concrete place names for filters. */
function expandPlaces(countries?: string[] | null): string[] {
  const places: string[] = [];

  for (const entry of cleanCountries(countries)) {
    if (/^global\b/i.test(entry)) continue;

    const regionList = entry.match(/^([^:]+):\s*(.+)$/);
    if (regionList && regionList[2].includes(',')) {
      places.push(
        ...regionList[2]
          .split(',')
          .map((part) => part.trim())
          .filter(Boolean)
      );
      continue;
    }

    const piloted = entry.match(/^piloted in\s+([^(]+)/i);
    if (piloted) {
      places.push(piloted[1].trim());
      continue;
    }

    const alsoRunFor = entry.match(/run for\s+(.+)$/i);
    if (alsoRunFor) {
      places.push(
        ...alsoRunFor[1]
          .split(',')
          .map((part) => part.replace(/^and\s+/i, '').trim())
          .filter(Boolean)
      );
      continue;
    }

    if (/^(the database|basic |developed )/i.test(entry) || entry.length > 48) {
      continue;
    }

    if (entry.includes(',') && !entry.includes('(')) {
      places.push(
        ...entry
          .split(',')
          .map((part) => part.replace(/^and\s+/i, '').trim())
          .filter(Boolean)
      );
      continue;
    }

    places.push(entry);
  }

  return Array.from(new Set(places));
}

/** One short location phrase for the card meta line. */
function toLocationLabel(countries?: string[] | null): string {
  const cleaned = cleanCountries(countries);
  if (cleaned.length === 0) return 'Global';

  const globalEntry = cleaned.find((entry) => /^global\b/i.test(entry));
  if (globalEntry) {
    const paren = globalEntry.match(/^Global\s*\(([^)]+)\)/i);
    if (paren && paren[1].trim().length <= 28) {
      return `Global (${paren[1].trim()})`;
    }
    return 'Global';
  }

  const regionList = cleaned.find((entry) => /^[^:]+:\s*.+,/.test(entry));
  if (regionList) {
    const [region, rest] = regionList.split(':');
    const count = rest
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean).length;
    return `${region.trim()} (${count})`;
  }

  const places = expandPlaces(cleaned);
  if (places.length === 0) return 'Global';
  if (places.length === 1) return places[0];
  return `${places[0]} +${places.length - 1}`;
}

function toSummary(project: ProjectListItem): string {
  return project.summary?.trim() || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
}

function toCard(project: ProjectListItem): PortfolioCard {
  const focus = toFocus(project);
  return {
    ...project,
    focus,
    label: FOCUS_LABELS[focus],
    statusLabel: toStatus(project),
    yearLabel: toYear(project),
    summaryLabel: toSummary(project),
    locationLabel: toLocationLabel(project.implementation_countries),
    places: expandPlaces(project.implementation_countries),
    code: toCode(focus),
  };
}

export default function PortfolioGrid() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [focusFilter, setFocusFilter] = useState<FocusFilter>('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [openFilter, setOpenFilter] = useState<OpenFilter>(null);
  const [headingTemplate, setHeadingTemplate] = useState(() => sectionFallback('projects', 'heading'));
  const [intro, setIntro] = useState(() => sectionFallback('projects', 'intro'));
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    getPublishedProjects()
      .then(({ data, error }) => {
        if (cancelled) return;
        setProjects(data);
        setError(error);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Unable to load projects.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadPageCopy('projects')
      .then((copy) => {
        if (cancelled) return;
        if (copy.heading?.trim()) setHeadingTemplate(copy.heading.trim());
        if (copy.intro?.trim()) setIntro(copy.intro.trim());
      })
      .catch(() => {
        /* Keep the built-in fallback copy. */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!toolbarRef.current?.contains(event.target as Node)) {
        setOpenFilter(null);
      }
    }

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  const cards = useMemo(() => projects.map(toCard), [projects]);
  const countries = useMemo(
    () => Array.from(new Set(cards.flatMap((project) => project.places))).sort((a, b) => a.localeCompare(b)),
    [cards]
  );
  const years = useMemo(
    () =>
      Array.from(
        new Set(cards.map((project) => project.project_year).filter((year): year is number => Boolean(year)))
      ).sort((a, b) => b - a),
    [cards]
  );
  const filteredCards = useMemo(
    () =>
      cards.filter((project) => {
        const focusMatch = focusFilter === 'all' || project.focus === focusFilter;
        const countryMatch = countryFilter === 'all' || project.places.includes(countryFilter);
        const yearMatch = yearFilter === 'all' || project.project_year === Number(yearFilter);
        return focusMatch && countryMatch && yearMatch;
      }),
    [cards, countryFilter, focusFilter, yearFilter]
  );

  function openProject(project: PortfolioCard) {
    window.location.href = withBase(`/projects/detail/?slug=${project.slug}`);
  }

  function selectCountry(value: string) {
    setCountryFilter(value);
    setOpenFilter(null);
  }

  function selectYear(value: string) {
    setYearFilter(value);
    setOpenFilter(null);
  }

  const focusFilters: { id: FocusFilter; label: string }[] = [
    { id: 'all', label: 'All focus areas' },
    { id: 'gis', label: FOCUS_LABELS.gis },
    { id: 'nlp', label: FOCUS_LABELS.nlp },
    { id: 'training', label: FOCUS_LABELS.training },
  ];

  return (
    <>
      <div className="band-head reveal">
        <h1>
          {(loading
            ? headingTemplate.replace('{count}', 'Products')
            : headingTemplate.replace(
                '{count}',
                `${cards.length} ${cards.length === 1 ? 'product' : 'products'}`
              )
          ).replace(/\s+/g, ' ').trim()}
        </h1>
        <p className="desc">{intro}</p>
      </div>

      <div className="portfolio-toolbar reveal" ref={toolbarRef}>
        <div className="proj-filters" role="group" aria-label="Filter by focus area">
          {focusFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`proj-filter ${focusFilter === filter.id ? 'active' : ''}`}
              onClick={() => setFocusFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="filter-dropdowns">
          <details
            className="filter-dropdown"
            open={openFilter === 'country'}
            onToggle={(event) => {
              const isOpen = (event.currentTarget as HTMLDetailsElement).open;
              setOpenFilter(isOpen ? 'country' : (current) => (current === 'country' ? null : current));
            }}
          >
            <summary>
              Country <span className="filter-current">{countryFilter === 'all' ? 'All' : countryFilter}</span>
            </summary>
            <div className="filter-panel" role="group" aria-label="Filter by country">
              <button type="button" className={`status-btn ${countryFilter === 'all' ? 'active' : ''}`} onClick={() => selectCountry('all')}>All countries</button>
              {countries.map((country) => (
                <button
                  key={country}
                  type="button"
                  className={`status-btn ${countryFilter === country ? 'active' : ''}`}
                  onClick={() => selectCountry(country)}
                >
                  {country}
                </button>
              ))}
            </div>
          </details>
          <details
            className="filter-dropdown filter-dropdown--year"
            open={openFilter === 'year'}
            onToggle={(event) => {
              const isOpen = (event.currentTarget as HTMLDetailsElement).open;
              setOpenFilter(isOpen ? 'year' : (current) => (current === 'year' ? null : current));
            }}
          >
            <summary>
              Year <span className="filter-current">{yearFilter === 'all' ? 'All' : yearFilter}</span>
            </summary>
            <div className="filter-panel filter-panel--column" role="group" aria-label="Filter by year">
              <button type="button" className={`status-btn ${yearFilter === 'all' ? 'active' : ''}`} onClick={() => selectYear('all')}>All years</button>
              {years.map((year) => (
                <button
                  key={year}
                  type="button"
                  className={`status-btn ${yearFilter === String(year) ? 'active' : ''}`}
                  onClick={() => selectYear(String(year))}
                >
                  {year}
                </button>
              ))}
            </div>
          </details>
        </div>
      </div>

      {loading ? <p className="portfolio-count">Loading published products…</p> : null}
      {!loading && error ? <p className="portfolio-count">Published products are temporarily unavailable.</p> : null}

      <div className={`portfolio-grid ${!loading && filteredCards.length === 0 ? 'is-empty' : ''}`}>
        {filteredCards.map((project) => (
          <button
            key={project.id}
            type="button"
            className="portfolio-card reveal"
            onClick={() => openProject(project)}
            aria-label={`Open project page for ${project.title}`}
          >
            {project.image_url ? (
              <div className="card-tile">
                <img src={project.image_url} alt="" loading="lazy" decoding="async" />
              </div>
            ) : (
              <div className="card-tile is-generated"><span className="card-tile-code">{project.code}</span></div>
            )}
            <div className="card-body">
              <div className="card-meta" title={[project.label, project.yearLabel, project.locationLabel].filter(Boolean).join(' · ')}>
                {[project.label, project.yearLabel, project.locationLabel].filter(Boolean).join(' · ')}
              </div>
              <h2>{project.title}</h2>
              <p>{project.summaryLabel}</p>
              <div className="card-more">
                Open project page
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {!loading ? <p className="portfolio-count" style={{ marginTop: 22 }}>{filteredCards.length} of {cards.length} products shown</p> : null}
    </>
  );
}
