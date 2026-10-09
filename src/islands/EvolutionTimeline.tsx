import { useEffect, useState } from 'react';
import { getPublishedEvolutionTimeline } from '../lib/queries';
import type { EvolutionTimelineCard } from '../lib/types';

const placeholderBody =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

const fallbackTimeline: EvolutionTimelineCard[] = [
  { id: 'fallback-2019-2020', period: '2019-2020', title: 'Foundations', body: placeholderBody, display_order: 1 },
  { id: 'fallback-2021', period: '2021', title: 'Scaling tools', body: placeholderBody, display_order: 2 },
  { id: 'fallback-2022', period: '2022', title: 'Global expansion', body: placeholderBody, display_order: 3 },
  { id: 'fallback-2023', period: '2023', title: 'Diversification', body: placeholderBody, display_order: 4 },
  { id: 'fallback-2024', period: '2024', title: 'Consolidation', body: placeholderBody, display_order: 5 },
  { id: 'fallback-2025', period: '2025', title: 'Innovation', body: placeholderBody, display_order: 6 },
  { id: 'fallback-2026', period: '2026', title: 'Mainstreaming', body: placeholderBody, display_order: 7 },
];

export default function EvolutionTimeline() {
  const [items, setItems] = useState<EvolutionTimelineCard[]>(fallbackTimeline);

  useEffect(() => {
    let cancelled = false;
    getPublishedEvolutionTimeline().then(({ data }) => {
      if (cancelled || data.length === 0) return;
      setItems(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative max-w-4xl">
      <div
        className="absolute bottom-0 left-[0.42rem] top-2 w-px bg-lab-border/70"
        aria-hidden="true"
      />
      <div className="grid gap-8">
        {items.map((step) => (
          <article
            key={step.id}
            className="relative grid gap-3 pl-10 sm:grid-cols-[150px_1fr] sm:gap-8"
          >
            <span
              className="absolute left-0 top-2 h-3.5 w-3.5 rounded-full bg-lab-accent shadow-[0_0_0_7px_rgba(76,141,255,0.14)]"
              aria-hidden="true"
            />
            <div>
              <p className="text-2xl font-black leading-none tracking-[-0.04em] text-lab-accent-soft">
                {step.period}
              </p>
              <h3 className="mt-2 text-lg font-black text-lab-text">{step.title}</h3>
            </div>
            <p className="max-w-2xl text-sm font-semibold leading-6 text-lab-muted">
              {step.body || placeholderBody}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}