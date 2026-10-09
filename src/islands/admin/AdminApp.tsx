import ObservabilityBoundary from '../components/ObservabilityBoundary';
import {
  createContext,
  lazy,
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { hasAuthCallbackParams } from '../../lib/auth-callback';
import AuthCallback from './auth/AuthCallback';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import LoginPage from './auth/LoginPage';
import AdminLayout from './layout/AdminLayout';

const DashboardPage = lazy(() => import('./dashboard/DashboardPage'));
const StatisticsListPage = lazy(() => import('./statistics/StatisticsListPage'));
const StatisticFormPage = lazy(() => import('./statistics/StatisticFormPage'));
const ProjectsListPage = lazy(() => import('./projects/ProjectsListPage'));
const ProjectFormPage = lazy(() => import('./projects/ProjectFormPage'));
const NewsListPage = lazy(() => import('./news/NewsListPage'));
const NewsFormPage = lazy(() => import('./news/NewsFormPage'));
const PublicationsListPage = lazy(() => import('./publications/PublicationsListPage'));
const PublicationFormPage = lazy(() => import('./publications/PublicationFormPage'));
const PeopleListPage = lazy(() => import('./people/PeopleListPage'));
const PersonFormPage = lazy(() => import('./people/PersonFormPage'));
const PartnersListPage = lazy(() => import('./partners/PartnersListPage'));
const PartnerFormPage = lazy(() => import('./partners/PartnerFormPage'));
const EvolutionTimelineListPage = lazy(() => import('./evolution-timeline/EvolutionTimelineListPage'));
const EvolutionTimelineFormPage = lazy(() => import('./evolution-timeline/EvolutionTimelineFormPage'));
const PageContentListPage = lazy(() => import('./page-content/PageContentListPage'));
const PageContentFormPage = lazy(() => import('./page-content/PageContentFormPage'));

interface NavigationGuardContextType {
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;
}

export const NavigationGuardContext =
  createContext<NavigationGuardContextType>({
    isDirty: false,
    setIsDirty: () => {},
  });

export function useNavigationGuard() {
  return useContext(NavigationGuardContext);
}

function parseHash(hash: string): { path: string; id: string | null } {
  const raw = hash.replace(/^#/, '') || '/';
  const parts = raw.split('/').filter(Boolean);
  if (parts.length >= 3 && /^[a-zA-Z0-9_-]+$/.test(parts[parts.length - 1])) {
    return {
      path: '/' + parts.slice(0, -1).join('/'),
      id: parts[parts.length - 1],
    };
  }
  return {
    path: '/' + parts.join('/') || '/',
    id: null,
  };
}

function useHashRoute() {
  const { isDirty } = useNavigationGuard();
  const skipConfirmRef = useRef(false);
  const [route, setRoute] = useState(() =>
    parseHash(typeof window !== 'undefined' ? window.location.hash : '')
  );

  useEffect(() => {
    const handleHashChange = (e: HashChangeEvent) => {
      const newHash = new URL(e.newURL).hash;
      const oldHash = new URL(e.oldURL).hash;
      if (skipConfirmRef.current) {
        skipConfirmRef.current = false;
        setRoute(parseHash(newHash));
        return;
      }
      if (isDirty && !window.confirm('You have unsaved changes. Leave anyway?')) {
        skipConfirmRef.current = true;
        window.location.hash = oldHash;
        return;
      }
      setRoute(parseHash(newHash));
    };

    const hash = window.location.hash;
    setRoute(parseHash(hash || '#/'));

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isDirty]);

  return route;
}

function RouteFallback() {
  return (
    <div className="flex justify-center py-12" role="status" aria-label="Loading">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-lab-accent border-t-transparent" />
    </div>
  );
}

function UnauthorizedPage() {
  const { user, authorizationError, signOut } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-lab-base px-4">
      <div className="w-full max-w-lg rounded-xl border border-lab-border bg-lab-surface p-8 text-center shadow-lg">
        <h1 className="text-2xl font-bold text-lab-accent-soft">Editor access required</h1>
        <p className="mt-3 text-sm text-lab-muted">
          You are signed in as <span className="font-medium">{user?.email}</span>, but this account
          is not on the approved SDG AI Lab editor list.
        </p>
        {authorizationError && (
          <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-left text-sm text-amber-100">
            {authorizationError}
          </p>
        )}
        <p className="mt-4 text-sm text-lab-muted">
          Please contact the site administrator if you need CMS access.
        </p>
        <button
          type="button"
          onClick={() => void signOut()}
          className="mt-6 rounded-lg bg-lab-accent px-4 py-2 font-medium text-lab-text transition-colors hover:bg-primary-dark"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

function matchRoute(path: string, id: string | null): React.ReactNode {
  const normalized = path === '' ? '/' : path;
  switch (normalized) {
    case '/':
      return <DashboardPage />;
    case '/statistics':
      return <StatisticsListPage />;
    case '/statistics/new':
      return <StatisticFormPage />;
    case '/statistics/edit':
      return <StatisticFormPage id={id} />;
    case '/projects':
      return <ProjectsListPage />;
    case '/projects/new':
      return <ProjectFormPage />;
    case '/projects/edit':
      return <ProjectFormPage id={id} />;
    case '/news':
      return <NewsListPage />;
    case '/news/new':
      return <NewsFormPage />;
    case '/news/edit':
      return <NewsFormPage id={id} />;
    case '/publications':
      return <PublicationsListPage />;
    case '/publications/new':
      return <PublicationFormPage />;
    case '/publications/edit':
      return <PublicationFormPage id={id} />;
    case '/people':
      return <PeopleListPage />;
    case '/people/new':
      return <PersonFormPage />;
    case '/people/edit':
      return <PersonFormPage id={id} />;
    case '/partners':
      return <PartnersListPage />;
    case '/partners/new':
      return <PartnerFormPage />;
    case '/partners/edit':
      return <PartnerFormPage id={id} />;
    case '/evolution-timeline':
      return <EvolutionTimelineListPage />;
    case '/evolution-timeline/new':
      return <EvolutionTimelineFormPage />;
    case '/evolution-timeline/edit':
      return <EvolutionTimelineFormPage id={id} />;
    case '/page-content':
      return <PageContentListPage />;
    case '/page-content/new':
      return <PageContentFormPage />;
    case '/page-content/edit':
      return <PageContentFormPage id={id} />;
    default:
      return (
        <div className="py-12 text-center text-lab-muted">
          Page not found.{' '}
          <a href="#/" className="text-lab-accent-soft underline">
            Go to Dashboard
          </a>
        </div>
      );
  }
}

function AdminAppInner() {
  const { session, isEditor, loading } = useAuth();
  const { path, id } = useHashRoute();
  const authCallback = typeof window !== 'undefined' && hasAuthCallbackParams();

  if (authCallback) {
    return <AuthCallback />;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-lab-accent border-t-transparent"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (!session) {
    return <LoginPage />;
  }

  if (!isEditor) {
    return <UnauthorizedPage />;
  }

  return (
    <AdminLayout currentPath={path}>
      <Suspense fallback={<RouteFallback />}>{matchRoute(path, id)}</Suspense>
    </AdminLayout>
  );
}

export default function AdminApp() {
  const [isDirty, setIsDirty] = useState(false);

  return (
    <ObservabilityBoundary surface="admin" name="AdminApp">
      <AuthProvider>
        <NavigationGuardContext.Provider value={{ isDirty, setIsDirty }}>
          <AdminAppInner />
        </NavigationGuardContext.Provider>
      </AuthProvider>
    </ObservabilityBoundary>
  );
}
