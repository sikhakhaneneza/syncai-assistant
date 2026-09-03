import { Link } from "@tanstack/react-router";
import {
  Bot,
  CalendarCheck,
  Mail,
  NotebookPen,
  Sparkles,
  Telescope,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

const NAV: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/", label: "Email Generator", icon: Mail },
  { to: "/meeting-notes", label: "Meeting Notes", icon: NotebookPen },
  { to: "/task-planner", label: "Task Planner", icon: CalendarCheck },
  { to: "/research", label: "Research Desk", icon: Telescope },
  { to: "/chat", label: "Chat", icon: Bot },
];

export function AppShell({
  breadcrumb,
  title,
  action,
  children,
}: {
  breadcrumb: string;
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-canvas text-ink">
      <aside className="sticky top-0 flex h-screen w-[76px] shrink-0 flex-col border-r border-line bg-white/45 px-2 py-4 backdrop-blur-xl xl:w-[240px] xl:px-3">
        <div className="mb-6 flex h-9 items-center gap-2.5 px-1 xl:px-2">
          <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-brand text-sm font-semibold text-primary-foreground shadow-[0_8px_18px_-6px_color-mix(in_oklab,var(--brand)_70%,transparent)]">
            M
          </div>
          <span className="hidden font-display font-semibold tracking-tight xl:block">Meridian</span>
        </div>

        <div className="mb-2 hidden px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-soft/70 xl:block">
          Workspace
        </div>

        <nav className="flex w-full flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex items-center gap-3 rounded-2xl px-2.5 py-2.5 text-soft transition-colors hover:bg-white/70 hover:text-ink xl:px-3"
              activeProps={{
                className:
                  "flex items-center gap-3 rounded-2xl px-2.5 py-2.5 xl:px-3 bg-brand/12 text-brand-ink ring-1 ring-brand/15",
              }}
            >
              <Icon className="size-[18px] shrink-0" aria-hidden="true" />
              <span className="hidden text-sm font-medium xl:inline">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex items-center gap-2.5 px-1 xl:px-2">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-peach text-xs font-semibold text-brand-ink">
            PN
          </div>
          <div className="hidden leading-tight xl:block">
            <div className="text-sm font-semibold">Priya Nair</div>
            <div className="text-[11px] text-soft">Operations Lead</div>
          </div>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-line bg-canvas/70 px-5 backdrop-blur-md lg:px-8">
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-soft">{breadcrumb}</div>
            <h1 className="truncate text-lg font-semibold leading-tight lg:text-2xl">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {action}
            <span className="hidden h-9 items-center gap-1.5 rounded-xl bg-white/70 px-3.5 text-sm font-medium text-ink ring-1 ring-line sm:inline-flex">
              <Sparkles className="size-3.5 text-brand" aria-hidden="true" /> AI ready
            </span>
          </div>
        </header>

        <div className="flex-1 px-5 py-6 lg:px-8 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
