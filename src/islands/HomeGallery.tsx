import { useEffect, useState } from 'react';
import { getHomeGalleryProjects, HOME_GALLERY_SLUGS } from '../lib/queries';
import type { HomeGalleryProject } from '../lib/queries';
import { withBase } from '../lib/url';

const marinaAsset = (path: string) => `https://sdg-dark.netlify.app/${path}`;

type GalleryTile = {
  slug: string;
  name: string;
  href: string;
  image: string | null;
  alt: string;
};

const fallbackTiles: GalleryTile[] = [
  {
    slug: HOME_GALLERY_SLUGS[0],
    name: 'Tech4R',
    href: withBase(`/projects/detail/?slug=${HOME_GALLERY_SLUGS[0]}`),
    image: marinaAsset('assets/hero-tech4r.jpg'),
    alt: 'Tech4R volunteers working a live coordination session',
  },
  {
    slug: HOME_GALLERY_SLUGS[1],
    name: 'DSVI',
    href: withBase(`/projects/detail/?slug=${HOME_GALLERY_SLUGS[1]}`),
    image: marinaAsset('assets/dsvi-georgia-map.jpg'),
    alt: 'DSVI drivetime access map, Georgia',
  },
  {
    slug: HOME_GALLERY_SLUGS[2],
    name: 'Frontier Tech Leaders',
    href: withBase(`/projects/detail/?slug=${HOME_GALLERY_SLUGS[2]}`),
    image: marinaAsset('assets/hero-ftl-graduation.jpg'),
    alt: 'Frontier Tech Leaders cohort graduation',
  },
  {
    slug: HOME_GALLERY_SLUGS[3],
    name: 'Innovation Campus',
    href: withBase(`/projects/detail/?slug=${HOME_GALLERY_SLUGS[3]}`),
    image: marinaAsset('assets/hero-innovation-campus.jpg'),
    alt: 'Innovation Campus graduates with Samsung',
  },
];

function tileFromProject(project: HomeGalleryProject, fallback?: GalleryTile): GalleryTile {
  return {
    slug: project.slug,
    name: project.title,
    href: withBase(`/projects/detail/?slug=${project.slug}`),
    image: project.image_url || fallback?.image || null,
    alt: project.title,
  };
}

function GalleryTrack({ tiles, hidden }: { tiles: GalleryTile[]; hidden: boolean }) {
  return (
    <div className="marina-live-gallery-track" aria-hidden={hidden ? true : undefined}>
      {tiles.map((tile) => (
        <a
          key={`${hidden ? 'copy' : 'live'}-${tile.slug}`}
          className="marina-live-work-tile"
          href={tile.href}
          tabIndex={hidden ? -1 : undefined}
        >
          <div className={`marina-live-work-art${tile.image ? '' : ' is-generated'}`}>
            {tile.image ? (
              <img
                src={tile.image}
                alt={hidden ? '' : tile.alt}
                loading={hidden ? 'lazy' : 'eager'}
                decoding="async"
              />
            ) : (
              <span>{tile.name}</span>
            )}
          </div>
          <div className="marina-live-work-caption">
            <span>{tile.name}</span>
          </div>
        </a>
      ))}
    </div>
  );
}

export default function HomeGallery() {
  const [tiles, setTiles] = useState<GalleryTile[]>(fallbackTiles);

  useEffect(() => {
    let cancelled = false;
    getHomeGalleryProjects()
      .then((result) => {
        if (cancelled || result.error || result.data.length === 0) return;
        const bySlug = new Map(result.data.map((project) => [project.slug, project]));
        setTiles(
          fallbackTiles.map((fallback) => {
            const project = bySlug.get(fallback.slug);
            return project ? tileFromProject(project, fallback) : fallback;
          }),
        );
      })
      .catch(() => {
        /* Keep the built-in cards when the CMS cannot be reached. */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="marina-live-gallery-inner">
      <GalleryTrack tiles={tiles} hidden={false} />
      <GalleryTrack tiles={tiles} hidden />
    </div>
  );
}
