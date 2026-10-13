import type { PublicationGroup, PublicationType } from './types';

export const PUBLICATION_GROUP_LABELS: Record<PublicationGroup, string> = {
  official_undp: 'Official UNDP reports',
  network: 'Papers from the wider network',
};

/** Suggested group when an editor has not chosen one yet. */
export function publicationGroupFromType(publicationType: PublicationType): PublicationGroup {
  return publicationType === 'report' || publicationType === 'brief_white_paper' ? 'official_undp' : 'network';
}

export function resolvePublicationGroup(publication: {
  publication_group?: PublicationGroup | null;
  publication_type: PublicationType;
}): PublicationGroup {
  return publication.publication_group === 'official_undp' || publication.publication_group === 'network'
    ? publication.publication_group
    : publicationGroupFromType(publication.publication_type);
}
