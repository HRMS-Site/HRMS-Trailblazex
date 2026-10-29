import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
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
}: {
  showCta?: boolean;
  showSignOut?: boolean;
  onSignOut?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ctaHref = isMockApiEnabled() ? "/login" : "/dashboard";

  return (
    <header className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4">
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
        @keyframes floatingMenuReveal {
          0% {
            opacity: 0;
            transform: translateY(-10px) scaleY(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scaleY(1);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .floating-navbar,
          .floating-nav-item,
          .floating-menu {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div
        className="floating-navbar pointer-events-auto relative w-full max-w-[760px] rounded-full border border-slate-200/80 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl"
        style={{
          animation: "floatingNavReveal 820ms cubic-bezier(0.2, 0.9, 0.2, 1) both",
        }}
      >
        <div className="relative flex items-center justify-center px-3 py-2.5 sm:px-4">
          <Link to="/" className="absolute left-3 flex shrink-0 items-center gap-3" aria-label="Trailblazex HRMS home">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-sky-500 to-violet-500 text-sm font-bold text-white shadow-[0_10px_20px_rgba(59,130,246,0.28)]">
              T
            </div>
            <div className="hidden sm:block">
              <p className="text-left text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Trailblazex</p>
              <p className="text-left text-[11px] text-slate-600">HRMS</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {NAV_ITEMS.map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  [
                    "floating-nav-item rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
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

          {showCta ? (
            <Link
              to={ctaHref}
              className="absolute right-3 hidden items-center gap-2 rounded-full bg-linear-to-r from-sky-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(59,130,246,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(59,130,246,0.3)] md:inline-flex"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}

          {showSignOut && onSignOut ? (
            <button
              type="button"
              onClick={onSignOut}
              className="absolute right-3 hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 md:inline-flex"
            >
              Sign Out
            </button>
          ) : null}

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50 md:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {open ? (
          <div className="floating-menu border-t border-slate-200 bg-white/95 px-3 py-3 md:hidden" style={{ animation: "floatingMenuReveal 220ms ease-out both" }}>
            <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    [
                      "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sky-50 text-sky-700"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                    ].join(" ")
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              {showCta ? (
                <Link
                  to={ctaHref}
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-sky-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
              {showSignOut && onSignOut ? (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onSignOut();
                  }}
                  className="mt-2 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
                >
                  Sign Out
                </button>
              ) : null}
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
