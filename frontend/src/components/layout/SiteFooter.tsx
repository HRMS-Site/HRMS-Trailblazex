import { Link } from "react-router-dom";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 text-lg font-bold text-sky-300">
              T
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-slate-200 uppercase">Trailblazex</p>
              <p className="text-xs text-slate-400">HRMS</p>
            </div>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-300">
            A modern HR platform for organizing employee information, streamlining daily workforce activities, and keeping teams aligned.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Explore</h3>
          <ul className="space-y-3 text-sm text-slate-300">
            <li>
              <Link to="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white">
                Login
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Company</h3>
          <ul className="space-y-3 text-sm text-slate-300">
            <li>People-first HR operations</li>
            <li>Organized workforce data</li>
            <li>Clear, intuitive workflows</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {year} Trailblazex HRMS. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
