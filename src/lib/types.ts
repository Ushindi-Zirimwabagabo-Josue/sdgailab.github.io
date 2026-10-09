export type PublishStatus = "draft" | "published" | "archived";

export type ProjectStatus =
  | "active"
  | "completed"
  | "under_development"
  | "on_hold";

export type PeopleGroup = "team" | "advisory_board";

export type PublicationType =
  | "report"
  | "brief_white_paper"
  | "academic_paper"
  | "dataset";

export interface Statistic {
  id: string;
  label: string;
  value: string;
  icon_name: string | null;
  display_order: number;
  status: PublishStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  project_status: ProjectStatus;
  is_deployed: boolean;
  is_featured: boolean;
  image_url: string | null;
  display_order: number;
  status: PublishStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  summary?: string;
  deployment_status?: "live" | "prototype" | "internal";
  sdgs?: number[];
  is_sample?: boolean;
  impact_area?: string;
  timeline?: string;
  best_fit?: string[];
  core_capabilities?: string[];
  problem?: string;
  solution?: string;
  how_it_works?: string[];
  features?: string[];
  tech_stack?: string[];
  collaboration_network?: string;
  implementation_countries?: string[];
  resource_links?: string[];
  video_url?: string;
  media_caption?: string;
  project_year?: number | null;
  capabilities_involved?: string[];
  reusable_components?: string;
  current_client_segments?: string[];
  future_client_segments?: string[];
  business_model?: string;
  project_category?: string;
  work_stream?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  body: string;
  summary: string | null;
  featured_image_url: string | null;
  author_name: string | null;
  publish_date: string;
  status: PublishStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Publication {
  id: string;
  title: string;
  slug: string;
  publication_type: PublicationType;
  authors: string | null;
  publication_date: string | null;
  date_label: string | null;
  publisher: string | null;
  summary: string;
  source_url: string;
  cover_image_url: string | null;
  display_order: number;
  status: PublishStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Person {
  id: string;
  name: string;
  role_title: string;
  photo_url: string | null;
  group_type: PeopleGroup;
  /** Marina team page section title when group_type is team. */
  team_group: string | null;
  biography: string | null;
  display_order: number;
  status: PublishStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string;
  display_order: number;
  status: PublishStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface EvolutionTimelineItem {
  id: string;
  period: string;
  title: string;
  body: string | null;
  display_order: number;
  status: PublishStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PageContent {
  id: string;
  page_slug: string;
  section_slug: string;
  body: string;
  status: PublishStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export type StatisticCard = Pick<Statistic, "id" | "label" | "value" | "icon_name" | "display_order">;
export type FeaturedProjectCard = Pick<Project, "id" | "title" | "slug" | "project_status" | "is_deployed" | "image_url" | "display_order" | "summary" | "deployment_status" | "sdgs" | "is_sample" | "is_featured" | "impact_area" | "timeline" | "project_year" | "best_fit" | "core_capabilities" | "tech_stack" | "implementation_countries" | "capabilities_involved" | "video_url" | "work_stream" | "project_category">;
export type ProjectListItem = FeaturedProjectCard;
export type NewsListItem = Pick<NewsArticle, "id" | "title" | "slug" | "summary" | "featured_image_url" | "author_name" | "publish_date">;
export type PublicationListItem = Pick<Publication, "id" | "title" | "slug" | "publication_type" | "authors" | "publication_date" | "date_label" | "publisher" | "summary" | "source_url" | "cover_image_url" | "display_order">;
export type PersonCard = Pick<Person, "id" | "name" | "role_title" | "photo_url" | "team_group" | "biography" | "display_order">;
export type PartnerLogo = Pick<Partner, "id" | "name" | "logo_url" | "website_url" | "display_order">;
export type EvolutionTimelineCard = Pick<EvolutionTimelineItem, "id" | "period" | "title" | "body" | "display_order">;

