import { useEffect, useState } from 'react';
import { logAppError } from '../lib/observability';
import { getPublishedPeople } from '../lib/queries';
import { groupPeopleByTeamGroup } from '../lib/teamGroups';
import type { PersonCard } from '../lib/types';
import ObservabilityBoundary from './components/ObservabilityBoundary';

const LOAD_TIMEOUT_MS = 12_000;

type TeamRosterLayout = 'grouped' | 'compact';

interface TeamRosterProps {
  /** grouped = /team sections; compact = about-page roster */
  layout?: TeamRosterLayout;
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

function CompactRoster({ people }: { people: PersonCard[] }) {
  const members = [...people].sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="roster">
      {members.map((person) => (
        <article key={person.id}>
          {person.photo_url ? (
            <img
              src={person.photo_url}
              alt=""
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className="roster-avatar-fallback" aria-hidden="true" />
          )}
          <div>
            <strong>{person.name}</strong>
            <small>{person.role_title}</small>
          </div>
        </article>
      ))}
    </div>
  );
}

function GroupedRoster({ people }: { people: PersonCard[] }) {
  const groups = groupPeopleByTeamGroup(people);

  if (groups.length === 0) {
    return (
      <div className="team-status">
        <p>No members listed yet.</p>
      </div>
    );
  }

  return (
    <>
      {groups.map((group) => (
        <div className="team-group reveal is-visible" key={group.title}>
          <h2>{group.title}</h2>
          <div className="team-row">
            {group.members.map((person) => (
              <article className="person-card" key={person.id}>
                <div className="person-avatar">
                  {person.photo_url ? (
                    <img
                      src={person.photo_url}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                </div>
                <div className="name">{person.name}</div>
                <div className="role">{person.role_title}</div>
              </article>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function TeamRosterContent({ layout }: { layout: TeamRosterLayout }) {
  const [people, setPeople] = useState<PersonCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPeople() {
      try {
        const { data, error: err } = await withTimeout(getPublishedPeople('team'), LOAD_TIMEOUT_MS);
        if (cancelled) return;
        if (err) {
          logAppError('public.team.load', new Error(err), { layout });
          setError(err);
        } else {
          setPeople(data);
        }
      } catch (loadError) {
        if (!cancelled) {
          logAppError('public.team.load', loadError, { layout });
          setError('Unable to load team information at this time.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadPeople();
    return () => {
      cancelled = true;
    };
  }, [layout]);

  if (loading) {
    return (
      <div className="team-status" role="status" aria-label="Loading team">
        <span className="team-spinner" aria-hidden="true" />
        <span className="sr-only">Loading team...</span>
      </div>
    );
  }

  if (error && people.length === 0) {
    return (
      <div className="team-status" role="alert">
        <p>Unable to load team information at this time.</p>
      </div>
    );
  }

  if (people.length === 0) {
    return (
      <div className="team-status">
        <p>No members listed yet.</p>
      </div>
    );
  }

  return (
    <>
      {error ? (
        <p className="team-refresh-note">Team information is currently being refreshed.</p>
      ) : null}
      {layout === 'compact' ? <CompactRoster people={people} /> : <GroupedRoster people={people} />}
    </>
  );
}

export default function TeamRoster({ layout = 'grouped' }: TeamRosterProps) {
  return (
    <ObservabilityBoundary surface="public" name="TeamRoster">
      <TeamRosterContent layout={layout} />
    </ObservabilityBoundary>
  );
}
