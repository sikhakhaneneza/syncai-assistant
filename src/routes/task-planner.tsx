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
import { planTasks } from "@/lib/ai.functions";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Meridian AI Assistant" },
      {
        name: "description",
        content:
          "Prioritize and schedule your workload by urgency, impact and available focus time.",
      },
      { property: "og:title", content: "AI Task Planner — Meridian AI Assistant" },
      {
        property: "og:description",
        content: "Prioritized plan, time blocks and delegation guidance for your day.",
      },
    ],
  }),
  component: PlannerPage,
});

const SAMPLE = `Finalize Q3 roadmap deck (board review Thursday)
Reply to Jordan about the timeline slip
Review analytics sprint scope with dev
Research competitor pricing
Onboard the new contractor
Expense report for June`;

function PlannerPage() {
  const [tasks, setTasks] = useState(SAMPLE);
  const [horizon, setHorizon] = useState("Today");
  const [hoursAvailable, setHoursAvailable] = useState("6 hours");

  const fn = useServerFn(planTasks);
  const mutation = useMutation({
    mutationFn: (data: { tasks: string; horizon: string; hoursAvailable: string }) =>
      fn({ data }),
  });

  return (
    <AppShell breadcrumb="Workspace / Task Planner" title="AI Task Planner">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="flex flex-col gap-5 xl:col-span-7">
          <Card
            title="Your workload"
            badge={
              <span className="rounded-full bg-mint/80 px-2.5 py-1 text-[11px] font-medium text-brand-ink">
                Impact × urgency
              </span>
            }
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ChipGroup
                label="Horizon"
                options={["Today", "This week", "Next 2 weeks"]}
                value={horizon}
                onChange={setHorizon}
              />
              <ChipGroup
                label="Focus time"
                options={["3 hours", "6 hours", "Full week"]}
                value={hoursAvailable}
                onChange={setHoursAvailable}
              />
            </div>

            <div className="mt-4">
              <Field label="Tasks (one per line)">
                <textarea
                  rows={10}
                  className="field field-focus resize-none"
                  value={tasks}
                  onChange={(e) => setTasks(e.target.value)}
                  placeholder="List everything on your plate, deadlines included…"
                />
              </Field>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[11px] text-soft/80">
                {tasks.split("\n").filter((l) => l.trim()).length} tasks queued
              </p>
              <button
                type="button"
                disabled={mutation.isPending || !tasks.trim()}
                onClick={() => mutation.mutate({ tasks, horizon, hoursAvailable })}
                className="inline-flex h-10 items-center rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground ring-1 ring-brand/30 transition-colors hover:bg-brand-ink disabled:opacity-50"
              >
                <Zap className="mr-1.5 size-4" aria-hidden="true" />
                {mutation.isPending ? "Planning…" : "Build my plan"}
              </button>
            </div>

            {mutation.isError && (
              <ErrorNote message={(mutation.error as Error).message || "Planning failed."} />
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-5 xl:col-span-5">
          {mutation.isPending ? (
            <GeneratingCard label="Task Planner" />
          ) : (
            <OutputCard
              title="Prioritized plan"
              content={mutation.data?.text ?? null}
              tags={[horizon, hoursAvailable]}
              emptyHint="Your prioritized schedule will appear here."
            />
          )}
        </div>
      </div>
    </AppShell>
  );
}
