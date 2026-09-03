import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Zap } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import {
  Card,
  ChipGroup,
  ErrorNote,
  Field,
  GeneratingCard,
  OutputCard,
} from "@/components/ToolWorkspace";
import { runResearch } from "@/lib/ai.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Meridian AI Assistant" },
      {
        name: "description",
        content:
          "Get decision-ready briefings: executive summary, key insights, trade-offs and next steps.",
      },
      { property: "og:title", content: "AI Research Assistant — Meridian AI Assistant" },
      {
        property: "og:description",
        content: "Decision-ready briefings with insights, trade-offs and recommended next steps.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState(
    "How are mid-size professional services firms adopting AI automation in daily operations?",
  );
  const [angle, setAngle] = useState("Business strategy");
  const [depth, setDepth] = useState("Standard brief");

  const fn = useServerFn(runResearch);
  const mutation = useMutation({
    mutationFn: (data: { topic: string; depth: string; angle: string }) => fn({ data }),
  });

  return (
    <AppShell breadcrumb="Workspace / Research Desk" title="AI Research Assistant">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="flex flex-col gap-5 xl:col-span-7">
          <Card
            title="Research question"
            badge={
              <span className="rounded-full bg-peach/80 px-2.5 py-1 text-[11px] font-medium text-brand-ink">
                Insight-first
              </span>
            }
          >
            <Field label="Topic or question">
              <textarea
                rows={4}
                className="field field-focus resize-none"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What do you need to understand?"
              />
            </Field>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ChipGroup
                label="Angle"
                options={["Business strategy", "Market", "Technical", "Risk"]}
                value={angle}
                onChange={setAngle}
              />
              <ChipGroup
                label="Depth"
                options={["Quick scan", "Standard brief", "Deep dive"]}
                value={depth}
                onChange={setDepth}
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[11px] text-soft/80">
                No live web access — verify time-sensitive claims
              </p>
              <button
                type="button"
                disabled={mutation.isPending || !topic.trim()}
                onClick={() => mutation.mutate({ topic, depth, angle })}
                className="inline-flex h-10 items-center rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground ring-1 ring-brand/30 transition-colors hover:bg-brand-ink disabled:opacity-50"
              >
                <Zap className="mr-1.5 size-4" aria-hidden="true" />
                {mutation.isPending ? "Researching…" : "Run research"}
              </button>
            </div>

            {mutation.isError && (
              <ErrorNote message={(mutation.error as Error).message || "Research failed."} />
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-5 xl:col-span-5">
          {mutation.isPending ? (
            <GeneratingCard label="Research Desk" />
          ) : (
            <OutputCard
              title="Briefing"
              content={mutation.data?.text ?? null}
              tags={[angle, depth]}
              emptyHint="Your research briefing will appear here."
            />
          )}
        </div>
      </div>
    </AppShell>
  );
}
