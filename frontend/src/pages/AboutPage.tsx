import { ArrowRight, CheckCircle2, FileSpreadsheet, LayoutGrid, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { ScrollReveal } from "@/components/ScrollReveal";

const purposePoints = [
  "Simplify routine employee information management",
  "Provide a clearer view of workforce activity",
  "Support structured HR workflows across teams",
];

const capabilities = [
  { icon: Users, title: "Employee information", description: "Keep employee records organized and easier to review." },
  { icon: LayoutGrid, title: "Workforce visibility", description: "See department and role information in a cleaner overview." },
  { icon: FileSpreadsheet, title: "Operational reporting", description: "Review attendance, requests, and summaries with less friction." },
  { icon: Sparkles, title: "Intuitive experience", description: "Use a layout that is simple, clear, and easy to navigate." },
];

const approach = [
  "Simple and intuitive design",
  "Organized employee information",
  "Streamlined HR workflows",
  "Useful workforce visibility",
  "Continuous improvement based on user needs",
];

export function AboutPage() {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <ScrollReveal delay={80}>
          <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm lg:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">About us</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              About Trailblazex HRMS
            </h1>
            <p className="mt-5 max-w-3xl text-lg text-slate-600">
              Making everyday people management more organized, accessible, and efficient.
            </p>
          </div>
        </ScrollReveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <ScrollReveal delay={100}>
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Our purpose</p>
              <h2 className="mt-4 text-3xl font-bold text-slate-900">A more organized way to support people operations</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Trailblazex HRMS is built to help organizations simplify routine HR activities through a clean digital experience. It brings employee information, attendance activity, leave tracking, and staffing visibility into one place so teams can focus more on people and less on manual admin work.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                {purposePoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-sky-600" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={140}>
            <div className="rounded-3xl bg-linear-to-br from-slate-900 to-sky-800 p-8 text-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-200">Our vision</p>
              <h2 className="mt-4 text-3xl font-bold">Connected, accessible, and smarter workforce management</h2>
              <p className="mt-4 text-base leading-7 text-slate-200">
                We envision an HR experience that gives teams a simpler, more connected view of workforce activity, improving how people, processes, and information work together across the organization.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ScrollReveal delay={100}>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Our approach</p>
            <h2 className="mt-4 text-3xl font-bold text-slate-900">Built for clarity, consistency, and daily usability</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {approach.map((item, index) => (
                <ScrollReveal key={item} delay={index * 70}>
                  <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-sky-600" />
                    <p className="text-sm font-medium text-slate-700">{item}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ScrollReveal delay={110} className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Capabilities</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Product capabilities</h2>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {capabilities.map(({ icon: Icon, title, description }, index) => (
            <ScrollReveal key={title} delay={index * 80}>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
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

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ScrollReveal delay={110}>
          <div className="rounded-[30px] bg-sky-50 p-8 text-center shadow-sm sm:p-12">
            <h2 className="text-3xl font-bold text-slate-900">Let’s Make HR Work Better.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Bring everyday HR operations into one better-managed experience with a platform designed for clarity and consistency.
            </p>
            <Link
              to="/login"
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-sky-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-sky-700"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </PublicLayout>
  );
}
