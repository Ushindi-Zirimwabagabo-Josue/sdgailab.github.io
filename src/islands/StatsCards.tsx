import { useEffect, useState } from 'react';
import { getPublishedStatistics } from '../lib/queries';
import type { StatisticCard } from '../lib/types';
import { sampleStats } from '../data/sampleContent';

const statVisuals: Record<string, { accent: string }> = {
  projects: { accent: 'text-lab-accent-soft' },
  learners: { accent: 'text-lab-accent-soft' },
  knowledge: { accent: 'text-lab-accent-soft' },
  volunteers: { accent: 'text-lab-accent-soft' },
  countries: { accent: 'text-lab-accent-soft' },
  default: { accent: 'text-lab-accent-soft' },
};

type StatsCardsProps = {
  variant?: 'default' | 'compact';
};

function getVisual(stat: StatisticCard) {
  const iconName = stat.icon_name?.toLowerCase() ?? '';
  const label = stat.label.toLowerCase();

  if (iconName && statVisuals[iconName]) return statVisuals[iconName];
  if (label.includes('project')) return statVisuals.projects;
  if (label.includes('learner') || label.includes('training')) return statVisuals.learners;
  if (label.includes('knowledge') || label.includes('product')) return statVisuals.knowledge;
  if (label.includes('volunteer')) return statVisuals.volunteers;
  if (label.includes('country')) return statVisuals.countries;

  return statVisuals.default;
}

export default function StatsCards({ variant = 'default' }: StatsCardsProps) {
  const [stats, setStats] = useState<StatisticCard[]>(sampleStats);
  const [error, setError] = useState<string | null>(null);
  const isCompact = variant === 'compact';

  useEffect(() => {
    getPublishedStatistics().then(({ data, error: err }) => {
      if (err) setError(err);
      setStats(data.length > 0 ? data : sampleStats);
    });
  }, []);

  return (
    <div>
      {error && <p className="sr-only">Live statistics are unavailable; showing indicative figures.</p>}
      <div className={isCompact ? 'grid gap-3 sm:grid-cols-2 lg:grid-cols-1' : 'grid gap-4 sm:grid-cols-2 xl:grid-cols-4'}>
        {stats.map((stat) => {
          const visual = getVisual(stat);

          return (
            <article
              key={stat.id}
              className={
                isCompact
                  ? 'rounded-2xl border border-lab-border bg-lab-section/70 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.08)]'
                  : 'border-l-2 border-lab-accent/45 pl-5'
              }
            >
              <p
                className={
                  isCompact
                    ? 'max-w-full break-words text-[0.68rem] font-black uppercase leading-4 tracking-[0.12em] text-lab-accent-soft'
                    : 'text-[0.68rem] font-black uppercase tracking-[0.16em] text-lab-accent-soft'
                }
              >
                {stat.label}
              </p>
              <p
                className={`${isCompact ? 'mt-2 text-[clamp(1.85rem,4vw,2.65rem)]' : 'mt-2 text-4xl'} font-black leading-none tracking-tight ${visual.accent}`}
                aria-label={`${stat.label}: ${stat.value}`}
              >
                {stat.value}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
