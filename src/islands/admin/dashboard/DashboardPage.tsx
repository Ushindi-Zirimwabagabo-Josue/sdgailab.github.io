import { useEffect, useState } from "react";
import { getDashboardCounts, type ContentCounts } from "../../../lib/admin-queries";

type ContentKey =
  | "statistics"
  | "projects"
  | "news_articles"
  | "publications"
  | "people"
  | "partners"
  | "evolution_timeline"
  | "page_content";

const CARD_CONFIG: {
  key: ContentKey;
  label: string;
  slug: string;
}[] = [
  { key: "statistics", label: "Statistics", slug: "statistics" },
  { key: "projects", label: "Projects", slug: "projects" },
  { key: "news_articles", label: "News Articles", slug: "news" },
  { key: "publications", label: "Publications", slug: "publications" },
  { key: "people", label: "People", slug: "people" },
  { key: "partners", label: "Partners", slug: "partners" },
  { key: "evolution_timeline", label: "Evolution Timeline", slug: "evolution-timeline" },
  { key: "page_content", label: "Page Content", slug: "page-content" },
];

function SkeletonCard() {
  return (
    <div className="bg-lab-surface rounded-lg shadow-sm border p-5 animate-pulse">
      <div className="h-5 bg-lab-elevated rounded w-24 mb-4" />
      <div className="h-9 bg-lab-elevated rounded w-16 mb-4" />
      <div className="flex flex-wrap gap-2">
        <div className="h-6 bg-lab-elevated rounded w-16" />
        <div className="h-6 bg-lab-elevated rounded w-20" />
        <div className="h-6 bg-lab-elevated rounded w-20" />
      </div>
    </div>
  );
}

function StatCard({
  label,
  counts,
  href,
}: {
  label: string;
  counts: ContentCounts;
  href: string;
}) {
  return (
    <a
      href={href}
      className="bg-lab-surface rounded-lg shadow-sm border p-5 hover:shadow-md transition-shadow cursor-pointer block"
    >
      <h3 className="text-sm font-medium text-lab-muted mb-2">{label}</h3>
      <p className="text-3xl font-bold text-lab-text mb-3">{counts.total}</p>
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-lab-section text-lab-muted">
          {counts.draft} draft
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/15 text-green-200 border border-green-500/30">
          {counts.published} published
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-300">
          {counts.archived} archived
        </span>
      </div>
    </a>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<Record<ContentKey, ContentCounts> | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchCounts() {
    setLoading(true);
    setError(null);
    const { data: counts, error: err } = await getDashboardCounts();
    if (err) {
      setError(err);
      setData(null);
    } else {
      setData(counts);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchCounts();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-lab-text mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CARD_CONFIG.map(({ key }) => (
            <SkeletonCard key={key} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-lab-text mb-6">Dashboard</h1>
        <div className="bg-red-500/100/10 border border-red-500/30 rounded-lg p-6 text-center">
          <p className="text-red-200 mb-4">{error}</p>
          <button
            type="button"
            onClick={fetchCounts}
            className="px-4 py-2 bg-red-600 text-lab-text rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-lab-text mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CARD_CONFIG.map(({ key, label, slug }) => (
          <StatCard
            key={key}
            label={label}
            counts={data![key]}
            href={`#/${slug}`}
          />
        ))}
      </div>
    </div>
  );
}
