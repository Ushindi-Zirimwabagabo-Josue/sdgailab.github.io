import logoUrl from '../../../../assets/img/whitelogo.png?url';
import icpsdLogoUrl from '../../../../assets/img/ICPSD-logo-navbar.png?url';
import undpLogoUrl from '../../../../assets/img/UNDP_logo.svg?url';

interface SidebarProps {
  currentPath: string;
  isOpen?: boolean;
}

const navItems = [
  { label: 'Dashboard', href: '#/' },
  { label: 'Statistics', href: '#/statistics' },
  { label: 'Projects', href: '#/projects' },
  { label: 'News', href: '#/news' },
  { label: 'Publications', href: '#/publications' },
  { label: 'People', href: '#/people' },
  { label: 'Partners', href: '#/partners' },
  { label: 'Evolution Timeline', href: '#/evolution-timeline' },
  { label: 'Page Content', href: '#/page-content' },
] as const;

export default function Sidebar({ currentPath, isOpen = false }: SidebarProps) {
  const normalizedPath = currentPath || '/';
  const hashHref = normalizedPath === '/' ? '#/' : `#${normalizedPath}`;

  return (
    <nav
      aria-label="Admin navigation"
      className={`
        fixed inset-y-0 left-0 z-40 w-64 shrink-0
        transform bg-lab-surface shadow-md transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0 md:shadow-none flex flex-col border-r border-lab-border
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      <div className="border-b border-lab-border p-4">
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt="SDG AI Lab" className="h-12 w-12 rounded-sm object-contain" />
          <div>
            <p className="text-base font-extrabold leading-tight text-lab-text">SDG AI Lab</p>
            <p className="mt-0.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-lab-muted">CMS workspace</p>
          </div>
        </div>
        <p className="mt-4 rounded-xl border border-lab-border bg-lab-base px-3 py-2 text-xs leading-5 text-lab-muted">
          Manage public website content, portfolio data, media and editor-controlled sections.
        </p>
      </div>

      <ul className="flex flex-1 flex-col gap-0.5 p-4">
        {navItems.map(({ label, href }) => {
          const isActive = hashHref === href;
          return (
            <li key={href}>
              <a
                href={href}
                className={`
                  block rounded-lg px-4 py-2.5 text-sm font-medium
                  transition-colors
                  ${
                    isActive
                      ? 'bg-lab-section text-lab-accent-soft font-semibold'
                      : 'text-lab-muted hover:bg-lab-base'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto border-t border-lab-border p-4">
        <div className="flex items-center gap-3">
          <img src={icpsdLogoUrl} alt="ICPSD" className="h-8 w-auto object-contain" />
          <img src={undpLogoUrl} alt="UNDP" className="h-9 w-auto object-contain" />
        </div>
      </div>
    </nav>
  );
}
