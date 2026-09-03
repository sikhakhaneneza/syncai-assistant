import { Check, Copy, TriangleAlert } from "lucide-react";
import { useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";

export function Card({
  title,
  badge,
  children,
  strong,
}: {
  title?: string;
  badge?: ReactNode;
  children: ReactNode;
  strong?: boolean;
}) {
  return (
    <section className={`${strong ? "glass-card-strong" : "glass-card"} p-5 lg:p-6`}>
      {(title || badge) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="text-base font-semibold tracking-tight">{title}</h2>}
          {badge}
        </div>
      )}
      {children}
    </section>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-soft">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export function ChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <span className="text-xs font-semibold text-soft">{label}</span>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {options.map((option) => {
          const active = option === value;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={
                active
                  ? "h-8 rounded-full bg-brand px-3 text-xs font-medium text-primary-foreground"
                  : "h-8 rounded-full bg-white/60 px-3 text-xs font-medium text-soft ring-1 ring-line transition-colors hover:bg-white"
              }
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Disclaimer() {
  return (
    <p className="mt-4 flex items-start gap-2 text-[11px] leading-snug text-soft/90">
      <TriangleAlert className="mt-px size-3.5 shrink-0" aria-hidden="true" />
      AI-generated content may require human review.
    </p>
  );
}

export function GeneratingCard({ label }: { label: string }) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand/60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-brand" />
          </span>
          <h2 className="text-sm font-semibold tracking-tight">Generating · {label}</h2>
        </div>
        <span className="text-[11px] font-medium text-soft">working</span>
      </div>
      <div className="flex flex-col gap-2.5 rounded-2xl bg-canvas/60 p-4 ring-1 ring-line">
        <div className="shimmer h-3.5 w-3/4 rounded-full" />
        <div className="shimmer h-3.5 w-1/2 rounded-full" />
        <div className="shimmer h-3.5 w-2/3 rounded-full" />
        <div className="mt-1 flex gap-2">
          <div className="shimmer h-6 w-20 rounded-full" />
          <div className="shimmer h-6 w-16 rounded-full" />
        </div>
      </div>
    </Card>
  );
}

export function OutputCard({
  title,
  content,
  tags,
  emptyHint,
}: {
  title: string;
  content: string | null;
  tags?: string[];
  emptyHint: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section className="glass-card-strong p-5 lg:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-lg bg-mint text-brand-ink">
            <Check className="size-4" aria-hidden="true" />
          </span>
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        </div>
        {content && (
          <button
            type="button"
            onClick={copy}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-white/70 px-3 text-xs font-medium text-ink ring-1 ring-line transition-colors hover:bg-white"
          >
            <Copy className="size-3.5" aria-hidden="true" />
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl bg-canvas/60 ring-1 ring-line">
        {content ? (
          <div className="ai-prose rise px-4 py-4">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <p className="px-4 py-10 text-center text-sm text-soft">{emptyHint}</p>
        )}
      </div>

      {content && tags && tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-medium text-soft ring-1 ring-line"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <Disclaimer />
    </section>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <p className="mt-3 rounded-xl bg-rose/60 px-3.5 py-2.5 text-xs font-medium text-brand-ink ring-1 ring-line">
      {message}
    </p>
  );
}
