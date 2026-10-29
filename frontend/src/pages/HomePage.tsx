import { ArrowRight, BarChart3, BriefcaseBusiness, CalendarCheck2, CheckCircle2, Clock3, FileText, ShieldCheck, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { isMockApiEnabled } from "@/lib/env";

const features = [
  {
    icon: Users,
    title: "Employee Management",
    description: "Organize employee profiles, departments, and role information in one place.",
  },
  {
    icon: CalendarCheck2,
    title: "Attendance Management",
    description: "Track attendance and daily team activity with a clear, organized view.",
  },
  {
    icon: Clock3,
    title: "Leave Management",
    description: "Prepare leave requests and monitor approvals with less back-and-forth.",
  },
  {
    icon: FileText,
    title: "Payroll Management",
    description: "Organize payroll-related details and keep compensation workflows easier to manage.",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    description: "View summary metrics and workforce trends through clear reporting.",
  },
  {
    icon: ShieldCheck,
    title: "Employee Self-Service",
    description: "Help employees access the information and requests they need in a simple way.",
  },
];

const steps = [
  { title: "Organize Your Team", description: "Maintain employee information in a single, easily navigable system." },
  { title: "Manage Daily Operations", description: "Handle attendance and leave processes with a clearer workflow." },
  { title: "Track and Improve", description: "Review activity and reporting trends to support smarter decisions." },
];

const reasons = [
  "Centralized employee information",
  "Simplified HR workflows",
  "Clear workforce visibility",
  "Easy navigation and a user-friendly interface",
  "Responsive design for different devices",
];

export function HomePage() {
  const ctaHref = isMockApiEnabled() ? "/login" : "/dashboard";

  return (
    <PublicLayout>
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.14),transparent_30%)]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8 lg:px-8 lg:py-24">
          <ScrollReveal className="flex flex-col justify-center" delay={80}>
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-2 text-sm font-medium text-sky-700 shadow-sm">
              <Zap className="h-4 w-4" />
              Smarter HR. Better Workplaces.
            </div>
            <h1 className="max-w-[620px] text-[clamp(2.8rem,5vw,4.75rem)] font-black leading-[0.95] tracking-[-0.05em] text-slate-900">
              Simplify Your People Management.
            </h1>
            <p className="mt-5 max-w-[34rem] text-[clamp(1.05rem,1.6vw,1.25rem)] font-medium leading-7 text-slate-600">
              One platform. Every employee. Everything organized.
            </p>
            <p className="mt-4 max-w-[34rem] text-base leading-7 text-slate-600">
              Manage your workforce, streamline attendance, simplify leave requests, and bring your HR operations together with a smarter, more organized HRMS experience.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={ctaHref}
                className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-sky-700"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Explore Features
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={140} className="relative flex items-center justify-center lg:justify-end">
            <div className="absolute -left-8 top-10 h-28 w-28 rounded-full bg-violet-200/60 blur-3xl" />
            <div className="absolute -right-8 bottom-10 h-28 w-28 rounded-full bg-sky-200/80 blur-3xl" />

            <div className="relative w-full max-w-[720px] overflow-hidden rounded-[28px] bg-transparent">
              <img
                src="/Modern HR Dashboard Teamwork Illustration.png"
                alt="HRMS dashboard illustration showing teamwork and people management"
                className="block h-auto w-full object-contain"
                style={{ width: "100%", height: "auto", objectFit: "contain" }}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center" delay={60}>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Features</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything Your HR Team Needs
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Bring essential workforce management activities together in one organized platform.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map(({ icon: Icon, title, description }, index) => (
            <ScrollReveal key={title} delay={index * 80} className="h-full">
              <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 inline-flex rounded-xl bg-sky-100 p-3 text-sky-700">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mx-auto max-w-2xl text-center" delay={60}>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">How it works</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">HR Management Made Simple</h2>
          </ScrollReveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <ScrollReveal key={step.title} delay={index * 90}>
                <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-6">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/15 text-lg font-semibold text-sky-300">
                    0{index + 1}
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{step.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-10 max-w-2xl" delay={60}>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Why choose us</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Why Choose Trailblazex HRMS?</h2>
        </ScrollReveal>

        <div className="grid gap-6 lg:grid-cols-2">
          <ScrollReveal delay={80}>
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                {reasons.map((reason, index) => (
                  <ScrollReveal key={reason} delay={index * 60} className="h-full">
                    <div className="flex h-full items-start gap-3 rounded-xl bg-slate-50 p-4">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-sky-600" />
                      <p className="text-sm font-medium text-slate-700">{reason}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <div className="rounded-3xl bg-linear-to-br from-sky-600 via-blue-600 to-violet-600 p-8 text-white shadow-[0_22px_50px_rgba(37,99,235,0.35)]">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-100">Platform value</p>
              <h3 className="mt-3 text-2xl font-semibold">A calmer way to manage people and operations</h3>
              <p className="mt-4 max-w-md text-sm leading-6 text-sky-100">
                Keep employee information organized, support daily HR workflows, and make workforce visibility easier with a consistent digital experience.
              </p>
              <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <BriefcaseBusiness className="h-8 w-8 text-sky-100" />
                <div>
                  <p className="text-sm text-sky-100">Built for growing teams</p>
                  <p className="text-lg font-semibold">Flexible, organized, and easy to navigate</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-slate-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-10 max-w-2xl" delay={60}>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Dashboard preview</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Keep your organization in view</h2>
          </ScrollReveal>

          <ScrollReveal delay={90} lazy placeholderClassName="h-[420px] w-full rounded-[28px] border border-slate-200 bg-slate-100">
            <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-6 lg:p-8">
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-4">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Department overview</p>
                    <div className="mt-4 space-y-3">
                      {[
                        ["Engineering", "42%"],
                        ["Operations", "31%"],
                        ["People & HR", "21%"],
                      ].map(([name, value]) => (
                        <div key={name}>
                          <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                            <span>{name}</span>
                            <span>{value}</span>
                          </div>
                          <div className="h-2.5 rounded-full bg-slate-200">
                            <div className="h-2.5 rounded-full bg-linear-to-r from-sky-500 to-violet-500" style={{ width: value }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Leave requests</p>
                    <div className="mt-4 space-y-3">
                      {[
                        ["Jasmine Lee", "Approved"],
                        ["Marcus King", "Pending"],
                        ["Nora Singh", "Approved"],
                      ].map(([name, status]) => (
                        <div key={name} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-sm">
                          <span className="text-sm font-medium text-slate-700">{name}</span>
                          <span className={status === "Pending" ? "rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700" : "rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700"}>{status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      ["Active employees", "1,248"],
                      ["Present today", "1,172"],
                      ["Open tasks", "26"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-800">Attendance status</p>
                      <span className="text-xs text-slate-500">This week</span>
                    </div>
                    <div className="flex h-40 items-end gap-2">
                      {[35, 72, 58, 84, 92, 78, 96].map((height, index) => (
                        <div key={height} className="flex-1 rounded-t-xl bg-linear-to-t from-violet-500 to-sky-400" style={{ height: `${height}%`, opacity: 0.55 + index * 0.07 }} />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-800">Recent activity</p>
                    <div className="mt-3 space-y-3">
                      {[
                        "Payroll data refreshed",
                        "Department head update saved",
                        "New leave request received",
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-3 rounded-xl bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
                          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-[30px] bg-linear-to-r from-sky-600 via-blue-600 to-violet-600 px-6 py-12 text-center text-white shadow-[0_24px_60px_rgba(37,99,235,0.30)] sm:px-10 lg:px-16">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-100">Get started</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Ready to Make HR Management Simpler?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-sky-100">
            Bring your essential HR activities into one organized experience.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/login" className="rounded-lg bg-white px-6 py-3 text-sm font-medium text-sky-700 transition hover:bg-slate-100">
              Get Started
            </Link>
            <Link to="/contact" className="rounded-lg border border-white/40 bg-white/10 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/20">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
