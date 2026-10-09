import { useEffect, useState } from 'react';
import { getPublishedPartners } from '../lib/queries';
import type { PartnerLogo } from '../lib/types';
import { samplePartners } from '../data/sampleContent';

interface PartnerLogosProps {
  limit?: number;
  variant?: 'grid' | 'marquee' | 'strip' | 'home';
}

const cardClasses =
  'flex min-h-24 items-center justify-center rounded-xl border border-lab-border bg-lab-surface p-4 text-center transition hover:border-lab-border hover:shadow-md';
const stripCardClasses =
  'flex min-h-14 items-center justify-center rounded-none border-0 bg-transparent p-2 text-center transition';
const marqueeCardClasses =
  'flex min-h-20 items-center justify-center border-0 bg-transparent px-5 py-4 text-center transition hover:-translate-y-0.5';

function PartnerLogoContent({ partner, compact = false, marquee = false }: { partner: PartnerLogo; compact?: boolean; marquee?: boolean }) {
  return (
    <>
      {partner.logo_url ? (
        <img
          src={partner.logo_url}
          alt={partner.name}
          className={`${marquee ? 'max-h-14 sm:max-h-16' : compact ? 'max-h-12' : 'max-h-16'} max-w-full object-contain`}
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement | null;
            if (fallback) fallback.style.display = 'block';
          }}
        />
      ) : null}
      <span className={`text-sm font-medium text-lab-muted text-center ${partner.logo_url ? 'hidden' : 'block'}`}>
        {partner.name}
      </span>
    </>
  );
}

function PartnerLogoCard({
  partner,
  decorative = false,
  plain = false,
  marquee = false,
}: {
  partner: PartnerLogo;
  decorative?: boolean;
  plain?: boolean;
  marquee?: boolean;
}) {
  const className = marquee ? marqueeCardClasses : plain ? stripCardClasses : cardClasses;

  if (decorative) {
    return (
      <div className={className} title={partner.name} aria-hidden="true">
        <PartnerLogoContent partner={partner} compact={plain} marquee={marquee} />
      </div>
    );
  }

  return (
    <a
      href={partner.website_url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      title={partner.name}
    >
      <PartnerLogoContent partner={partner} compact={plain} marquee={marquee} />
    </a>
  );
}

export default function PartnerLogos({ limit, variant = 'grid' }: PartnerLogosProps) {
  const [partners, setPartners] = useState<PartnerLogo[]>(samplePartners);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPublishedPartners().then(({ data, error: err }) => {
      if (err) setError(err);
      setPartners(data.length > 0 ? data : samplePartners);
    });
  }, []);

  const withoutUndp =
    variant === 'home' ? partners.filter((partner) => !/undp/i.test(partner.name)) : partners;
  const visiblePartners = limit ? withoutUndp.slice(0, limit) : withoutUndp;

  if (variant === 'home') {
    return (
      <div>
        {error && (
          <p className="sr-only">
            Live partner data is unavailable; showing a representative partner list.
          </p>
        )}
        <div className="marina-live-partner-marks" aria-label="Partners and network">
          {visiblePartners.map((partner) => {
            const image = partner.logo_url ? (
              <img
                src={partner.logo_url}
                alt={partner.name}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <span className="text-sm font-medium text-lab-muted">{partner.name}</span>
            );

            if (!partner.website_url) {
              return <span key={partner.id}>{image}</span>;
            }

            return (
              <a
                key={partner.id}
                href={partner.website_url}
                target="_blank"
                rel="noopener noreferrer"
                title={partner.name}
              >
                {image}
              </a>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === 'marquee') {
    const scrollingPartners = [...visiblePartners, ...visiblePartners];

    return (
      <div>
        {error && <p className="sr-only">Live partner data is unavailable; showing a representative partner list.</p>}
        <div className="group relative overflow-hidden py-2 motion-reduce:overflow-x-auto" aria-label="Partners and network">
          <div className="partner-marquee-track flex w-max gap-3 motion-safe:animate-partner-marquee-scroll group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:animate-none">
            {scrollingPartners.map((partner, index) => {
              const isDuplicate = index >= visiblePartners.length;

              return (
                <div key={`${partner.id}-${index}`} className="w-44 shrink-0 sm:w-52" aria-hidden={isDuplicate ? 'true' : undefined}>
                  <PartnerLogoCard partner={partner} decorative={isDuplicate} marquee />
                </div>
              );
            })}
          </div>
        </div>

      </div>
    );
  }

  if (variant === 'strip') {
    return (
      <div>
        {error && <p className="sr-only">Live partner data is unavailable; showing a representative partner list.</p>}
        <div className="grid grid-cols-2 items-center gap-x-6 gap-y-5 sm:grid-cols-4 lg:grid-cols-8">
          {visiblePartners.map((partner) => (
            <PartnerLogoCard key={partner.id} partner={partner} plain />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && <p className="sr-only">Live partner data is unavailable; showing a representative partner list.</p>}
      <div className="grid grid-cols-2 items-stretch gap-3 md:grid-cols-4">
        {visiblePartners.map((partner) => (
          <PartnerLogoCard key={partner.id} partner={partner} />
        ))}
      </div>
    </div>
  );
}
