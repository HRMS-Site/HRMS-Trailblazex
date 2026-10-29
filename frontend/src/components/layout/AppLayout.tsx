import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Banknote,
  BarChart3,
  Building2,
  CalendarCheck,
  CalendarOff,
  LayoutDashboard,
  Scale,
  Users,
  Wallet,
  WalletCards,
  X,
} from "lucide-react";
import { MockBanner } from "@/components/shared/MockBanner";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { useAuth } from "@/auth/AuthContext";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/employees", label: "Employees", icon: Users },
  { to: "/departments", label: "Departments", icon: Building2 },
  { to: "/revenue", label: "Revenue", icon: Banknote },
  { to: "/expenses", label: "Expenses", icon: Wallet },
  { to: "/profit-loss", label: "Profit & Loss", icon: Scale },
  { to: "/payroll", label: "Payroll", icon: WalletCards },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/leave", label: "Leave", icon: CalendarOff },
  { to: "/budgets", label: "Budgets", icon: BarChart3 },
];

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1" aria-label="Primary">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white",
                isActive && "bg-white/15 text-white",
              )
            }
          >
            <Icon className="h-4 w-4" aria-hidden />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}

export function AppLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout, requiresLogin } = useAuth();
  const showSignOut = Boolean(user || requiresLogin);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader showCta={false} showSignOut={showSignOut} onSignOut={logout} />

      <div className="flex min-h-screen pt-20 lg:pt-24">
        <aside className="hidden bg-sidebar text-sidebar-foreground lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col">
          <div className="flex items-center gap-2 px-5 py-5">
            <BarChart3 className="h-5 w-5 text-sky-400" aria-hidden />
            <div>
              <p className="text-sm font-semibold tracking-wide text-white">Trailblazex</p>
              <p className="text-xs text-slate-400">HRMS</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-3 pb-6">
            <NavItems />
          </div>
        </aside>

        {open ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close menu" onClick={() => setOpen(false)} />
            <aside className="relative z-50 h-full w-64 overflow-y-auto bg-sidebar p-4 text-sidebar-foreground">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Trailblazex</p>
                <button type="button" className="rounded-md p-1 text-slate-300 hover:bg-white/10" aria-label="Close menu" onClick={() => setOpen(false)}>
                  <X className="h-4 w-4" />
                </button>
              </div>
              <NavItems onNavigate={() => setOpen(false)} />
            </aside>
          </div>
        ) : null}

        <div className="flex min-h-screen flex-1 flex-col overflow-x-hidden lg:ml-64">
          <MockBanner />

          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
