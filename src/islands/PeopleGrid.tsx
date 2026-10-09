import { useEffect, useState } from 'react';
import { logAppError } from '../lib/observability';
import { getPublishedPeople } from '../lib/queries';
import { resolveTeamGroupTitle } from '../lib/teamGroups';
import type { PersonCard, PeopleGroup } from '../lib/types';
import ObservabilityBoundary from './components/ObservabilityBoundary';

const LOAD_TIMEOUT_MS = 12_000;

interface PeopleGridProps {
  groupType: PeopleGroup;
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error('Request timed out')), ms);
    promise
      .then((value) => {
        window.clearTimeout(timer);
        resolve(value);
      })
      .catch((error: unknown) => {
        window.clearTimeout(timer);
        reject(error);
      });
  });
}

function PersonCardView({ person }: { person: PersonCard }) {
  const section = resolveTeamGroupTitle(person) ?? 'Team';

  return (
    <article className="group text-center transition hover:-translate-y-0.5">
      <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-lab-section ring-1 ring-lab-border transition group-hover:ring-lab-accent/55 sm:h-36 sm:w-36">
        {person.photo_url ? (
          <img
            src={person.photo_url}
            alt={person.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <svg className="h-9 w-9 text-lab-accent-soft/70" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        )}
      </div>
      <div className="mt-5">
        <span className="inline-flex rounded-full bg-lab-accent/10 px-3 py-1 text-[11px] font-bold leading-none text-lab-accent-soft">
          {section}
        </span>
        <h3 className="mt-3 text-base font-extrabold text-lab-text">{person.name}</h3>
        <p className="mt-1 text-sm font-semibold text-lab-muted">{person.role_title}</p>
      </div>
    </article>
  );
}
export default function PeopleGrid({ groupType }: PeopleGridProps) {
  return (
    <ObservabilityBoundary surface="public" name="PeopleGrid">
      <PeopleGridContent groupType={groupType} />
    </ObservabilityBoundary>
  );
}

function PeopleGridContent({ groupType }: PeopleGridProps) {
  const [people, setPeople] = useState<PersonCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPeople() {
      try {
        const { data, error: err } = await withTimeout(
          getPublishedPeople(groupType),
          LOAD_TIMEOUT_MS
        );

        if (cancelled) return;

        if (err) {
          logAppError('public.people.load', new Error(err), { groupType });
          setError(err);
        } else {
          setPeople(data);
        }
      } catch (error) {
        if (!cancelled) {
          logAppError('public.people.load', error, { groupType });
          setError('Unable to load team information at this time.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadPeople();

    return () => {
      cancelled = true;
    };
  }, [groupType]);

  if (loading) {
    return (
      <div className="flex justify-center py-12" role="status" aria-label="Loading">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-lab-accent/30 border-t-lab-accent" />
        <span className="sr-only">Loading people...</span>
      </div>
    );
  }

  if (error && people.length === 0) {
    return (
      <div className="rounded-2xl border border-lab-border bg-lab-surface p-8 text-center text-lab-muted shadow-sm">
        <p>Unable to load team information at this time.</p>
      </div>
    );
  }

  if (people.length === 0) {
    return (
      <div className="rounded-2xl border border-lab-border bg-lab-surface p-8 text-center text-lab-muted shadow-sm italic">
        <p>No members listed yet.</p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <p className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
          Team information is currently being refreshed.
        </p>
      )}

      <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {people.map((person) => (
          <PersonCardView key={person.id} person={person} />
        ))}
      </div>
    </div>
  );
}