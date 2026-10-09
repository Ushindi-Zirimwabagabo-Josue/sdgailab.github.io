import { useEffect, useMemo, useState } from 'react';
import { getPublishedPublications } from '../lib/queries';
import type { PublicationListItem, PublicationType } from '../lib/types';

type TypeFilter = 'all' | 'report' | 'academic_paper' | 'dataset';

const typeFilters: Array<{ id: TypeFilter; label: string }> = [
  { id: 'all', label: 'All outputs' },
  { id: 'academic_paper', label: 'Academic papers' },
  { id: 'report', label: 'Reports' },
  { id: 'dataset', label: 'Datasets' },
];

/** Briefs / white papers are surfaced under Reports on the public research page. */
function displayType(publicationType: PublicationType): Exclude<PublicationType, 'brief_white_paper'> {
  return publicationType === 'brief_white_paper' ? 'report' : publicationType;
}

function matchesTypeFilter(publicationType: PublicationType, filter: TypeFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'report') return publicationType === 'report' || publicationType === 'brief_white_paper';
  return publicationType === filter;
}

const typeLabels: Record<Exclude<PublicationType, 'brief_white_paper'>, string> = {
  report: 'Report',
  academic_paper: 'Academic paper',
  dataset: 'Dataset',
};

const typeCoverLabels: Record<Exclude<PublicationType, 'brief_white_paper'>, string> = {
  report: 'Report',
  academic_paper: 'Academic paper',
  dataset: 'Dataset',
};

function yearForPublication(publication: PublicationListItem): number | null {
  if (publication.publication_date) {
    const year = new Date(`${publication.publication_date}T00:00:00`).getFullYear();
    return Number.isFinite(year) ? year : null;
  }

  const label = publication.date_label?.trim();
  if (!label) return null;
  const match = label.match(/\b(20\d{2}|19\d{2})\b/);
  return match ? Number(match[1]) : null;
}

function dateForCard(publication: PublicationListItem): string | null {
  // Cards always show a short year (e.g. "2025"), never the long CMS date_label copy.
  const year = yearForPublication(publication);
  return year ? String(year) : null;
}

export default function ResearchOutputs() {
  const [publications, setPublications] = useState<PublicationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [yearFilter, setYearFilter] = useState('all');

  useEffect(() => {
    let cancelled = false;
    getPublishedPublications()
      .then(({ data, error: fetchError }) => {
        if (cancelled) return;
        setPublications(data);
        setError(fetchError);
      })
      .catch(() => {
        if (!cancelled) setError('Unable to load research outputs.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const availableYears = useMemo(
    () =>
      Array.from(
        new Set(
          publications
            .map(yearForPublication)
            .filter((year): year is number => year !== null)
        )
      ).sort((a, b) => b - a),
    [publications]
  );

  const visiblePublications = useMemo(
    () =>
      publications.filter((publication) => {
        const typeMatch = matchesTypeFilter(publication.publication_type, typeFilter);
        const year = yearForPublication(publication);
        const yearMatch = yearFilter === 'all' || (year !== null && String(year) === yearFilter);
        return typeMatch && yearMatch;
      }),
    [publications, typeFilter, yearFilter]
  );

  return (
    <div className="research-outputs">
      <div className="research-toolbar" role="group" aria-label="Filter by output type">
        {typeFilters.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`research-filter ${typeFilter === item.id ? 'active' : ''}`}
            onClick={() => setTypeFilter(item.id)}
            aria-pressed={typeFilter === item.id}
          >
            {item.label}
          </button>
        ))}
      </div>

      {availableYears.length > 0 ? (
        <div className="research-toolbar research-toolbar--years" role="group" aria-label="Filter by year">
          <button
            type="button"
            className={`research-filter ${yearFilter === 'all' ? 'active' : ''}`}
            onClick={() => setYearFilter('all')}
            aria-pressed={yearFilter === 'all'}
          >
            All years
          </button>
          {availableYears.map((year) => (
            <button
              key={year}
              type="button"
              className={`research-filter ${yearFilter === String(year) ? 'active' : ''}`}
              onClick={() => setYearFilter(String(year))}
              aria-pressed={yearFilter === String(year)}
            >
              {year}
            </button>
          ))}
        </div>
      ) : null}

      {loading ? <p className="research-status">Loading research outputs…</p> : null}
      {!loading && error ? <p className="research-status">Research outputs are temporarily unavailable.</p> : null}
      {!loading && !error && visiblePublications.length === 0 ? (
        <p className="research-empty">No published outputs match these filters yet.</p>
      ) : null}

      <div className="output-grid" aria-live="polite">
        {visiblePublications.map((publication) => {
          const date = dateForCard(publication);
          const shownType = displayType(publication.publication_type);
          return (
            <article className="output-card" key={publication.id}>
              <a
                className="output-link"
                href={publication.source_url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${publication.title}`}
              >
                {publication.cover_image_url ? (
                  <div className="output-cover-tile">
                    <img src={publication.cover_image_url} alt="" loading="lazy" decoding="async" />
                  </div>
                ) : (
                  <div className={`output-cover output-cover--${shownType}`}>
                    <span>{typeCoverLabels[shownType]}</span>
                  </div>
                )}
                <div className="output-link-body">
                  <div className="output-meta">
                    <span>{typeLabels[shownType]}</span>
                    {date ? <span>{date}</span> : null}
                  </div>
                  <h2>{publication.title}</h2>
                  <p>{publication.summary}</p>
                  <span className="output-more">Open output <span aria-hidden="true">→</span></span>
                </div>
              </a>
            </article>
          );
        })}
      </div>
    </div>
  );
}
