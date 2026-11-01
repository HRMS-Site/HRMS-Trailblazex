import { ArrowRight, MoreVertical } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { isMockApiEnabled } from "@/lib/env";

const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
];

export function SiteHeader({
  showCta = true,
  showSignOut = false,
  onSignOut,
  onMobileMenuToggle,
  mobileMenuOpen = false,
  showDashboardMenu = false,
}: {
  showCta?: boolean;
  showSignOut?: boolean;
  onSignOut?: () => void;
  onMobileMenuToggle?: () => void;
  mobileMenuOpen?: boolean;
  showDashboardMenu?: boolean;
}) {
  const hasDashboardMenu = showDashboardMenu || typeof onMobileMenuToggle === "function";
  const ctaHref = isMockApiEnabled() ? "/login" : "/dashboard";

  return (
    <header className="pointer-events-none fixed inset-x-0 top-6 z-30 flex justify-center px-4">
      <style>{`
        @keyframes floatingNavReveal {
          0% {
            opacity: 0.45;
            transform: scaleX(0.72);
          }
          100% {
            opacity: 1;
            transform: scaleX(1);
          }
        }
        @keyframes floatingNavItemReveal {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .floating-navbar,
          .floating-nav-item {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div
        className="floating-navbar pointer-events-auto w-full max-w-[760px] rounded-full border border-slate-200/80 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl"
        style={{
          animation: "floatingNavReveal 820ms cubic-bezier(0.2, 0.9, 0.2, 1) both",
        }}
      >
        <div className="flex items-center gap-2 px-3 py-2.5 sm:px-4">
          {hasDashboardMenu ? (
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 shadow-sm transition-colors hover:bg-slate-100"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => onMobileMenuToggle?.()}
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          ) : null}

          <Link
            to="/"
            className="flex shrink-0 items-center gap-2"
            aria-label="Trailblazex HRMS home"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-sky-500 to-violet-500 text-xs font-bold text-white shadow-[0_10px_20px_rgba(59,130,246,0.28)] sm:h-9 sm:w-9 sm:text-sm">
              T
            </div>
            <div className="hidden sm:block">
              <p className="text-left text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Trailblazex</p>
              <p className="text-left text-[11px] text-slate-600">HRMS</p>
            </div>
          </Link>

          {!hasDashboardMenu ? (
            <nav className="ml-2 flex items-center gap-1 sm:ml-4" aria-label="Main navigation">
              {NAV_ITEMS.map((item, index) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    [
                      "floating-nav-item rounded-full px-2 py-1.5 text-[11px] font-medium transition-all duration-200 sm:px-3 sm:text-xs",
                      isActive
                        ? "bg-sky-50 text-sky-700 shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    ].join(" ")
                  }
                  style={{ animation: "floatingNavItemReveal 450ms ease-out both", animationDelay: `${index * 70}ms` }}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          ) : (
            <nav className="ml-2 flex flex-1 items-center justify-center gap-1 overflow-hidden" aria-label="Dashboard navigation">
              {NAV_ITEMS.map((item, index) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    [
                      "rounded-full px-2 py-1.5 text-[11px] font-medium transition-colors sm:px-3 sm:text-xs",
                      isActive
                        ? "bg-sky-50 text-sky-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    ].join(" ")
                  }
                  style={{ animation: "floatingNavItemReveal 450ms ease-out both", animationDelay: `${index * 70}ms` }}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          )}

          {!hasDashboardMenu && showCta ? (
            <Link
              to={ctaHref}
              className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-sky-600 to-violet-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-[0_12px_25px_rgba(59,130,246,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(59,130,246,0.3)] sm:px-4 sm:py-2 sm:text-sm"
            >
              Get Started
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>
          ) : null}

          {showSignOut && onSignOut && !hasDashboardMenu ? (
            <button
              type="button"
              onClick={onSignOut}
              className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 md:inline-flex"
            >
              Sign Out
            </button>
          ) : null}

          {showSignOut && onSignOut && hasDashboardMenu ? (
            <button
              type="button"
              onClick={onSignOut}
              className="ml-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 sm:px-3 sm:py-2 sm:text-xs"
            >
              Sign Out
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
