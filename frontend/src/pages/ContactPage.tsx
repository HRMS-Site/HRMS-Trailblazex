import { useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Mail, MessageSquareText, ShieldAlert } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";

interface ContactFormState {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
}

const initialForm: ContactFormState = {
  name: "",
  email: "",
  company: "",
  subject: "",
  message: "",
};

export function ContactPage() {
  const [form, setForm] = useState<ContactFormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  function handleFieldChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    if (submitMessage) {
      setSubmitMessage(null);
    }
  }

  function validate() {
    const nextErrors: Partial<Record<keyof ContactFormState, string>> = {};

    if (!form.name.trim()) {
      nextErrors.name = "Please enter your full name.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Please enter your work email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!form.subject.trim()) {
      nextErrors.subject = "Please add a subject.";
    }

    if (!form.message.trim()) {
      nextErrors.message = "Please write a short message.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      setSubmitMessage("Please check the highlighted fields and try again.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    await new Promise((resolve) => setTimeout(resolve, 900));

    setIsSubmitting(false);
    setForm(initialForm);
    setSubmitMessage(
      "Demo mode: this form is ready to connect to a backend contact endpoint when one is available. No message was sent from this frontend.",
    );
  }

  return (
    <PublicLayout>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">Contact us</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Let’s Talk About Your HR Needs
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Have a question about Trailblazex HRMS? Send us a message and let us know how we can help.
            </p>

            <div className="mt-8 space-y-4">
              {[
                {
                  icon: Mail,
                  title: "General inquiries",
                  description: "Questions about the platform, process, or onboarding.",
                },
                {
                  icon: MessageSquareText,
                  title: "Product & feature questions",
                  description: "Discuss workflows, modules, or product direction.",
                },
                {
                  icon: ShieldAlert,
                  title: "Technical support",
                  description: "Share feedback about issues, usability, or setup questions.",
                },
              ].map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleFieldChange}
                    placeholder="Your full name"
                    aria-invalid={Boolean(errors.name)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none"
                  />
                  {errors.name ? <p className="mt-1 text-xs text-red-700">{errors.name}</p> : null}
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                    Work Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleFieldChange}
                    placeholder="name@company.com"
                    aria-invalid={Boolean(errors.email)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none"
                  />
                  {errors.email ? <p className="mt-1 text-xs text-red-700">{errors.email}</p> : null}
                </div>
              </div>

              <div>
                <label htmlFor="company" className="mb-2 block text-sm font-medium text-slate-700">
                  Company Name
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={form.company}
                  onChange={handleFieldChange}
                  placeholder="Optional"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="subject" className="mb-2 block text-sm font-medium text-slate-700">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleFieldChange}
                  placeholder="How can we help?"
                  aria-invalid={Boolean(errors.subject)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none"
                />
                {errors.subject ? <p className="mt-1 text-xs text-red-700">{errors.subject}</p> : null}
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-700">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleFieldChange}
                  rows={5}
                  placeholder="Tell us about your HR goals, questions, or support needs."
                  aria-invalid={Boolean(errors.message)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none"
                />
                {errors.message ? <p className="mt-1 text-xs text-red-700">{errors.message}</p> : null}
              </div>

              {submitMessage ? (
                <div
                  aria-live="polite"
                  className={
                    submitMessage.includes("Demo mode")
                      ? "flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
                      : "flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
                  }
                >
                  {submitMessage.includes("Demo mode") ? <CheckCircle2 className="mt-0.5 h-4 w-4" /> : <ShieldAlert className="mt-0.5 h-4 w-4" />}
                  <span>{submitMessage}</span>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-lg bg-sky-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Sending…" : "Send Message"}
                {!isSubmitting ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
              </button>
            </form>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
