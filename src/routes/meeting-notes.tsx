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
import { summarizeNotes } from "@/lib/ai.functions";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Meridian AI Assistant" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into key points, decisions, owners and deadlines with AI.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Meridian AI Assistant" },
      {
        property: "og:description",
        content: "Key points, decisions, action items and deadlines from any meeting transcript.",
      },
    ],
  }),
  component: NotesPage,
});

const SAMPLE = `Product sync, 09:00. Maya walked through the onboarding revamp — beta cohort starts in two weeks so the revamp has to ship before that. Dev raised search latency as the top support complaint this sprint; he'll profile the index by Tuesday. Agreed to hold pricing changes until Q4. Maya to draft the launch brief by Friday. Open question: do we need legal review on the new terms copy?`;

function NotesPage() {
  const [notes, setNotes] = useState(SAMPLE);
  const [meetingType, setMeetingType] = useState("Team sync");

  const fn = useServerFn(summarizeNotes);
  const mutation = useMutation({
    mutationFn: (data: { notes: string; meetingType: string }) => fn({ data }),
  });

  return (
    <AppShell breadcrumb="Workspace / Meeting Notes" title="Meeting Notes Summarizer">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="flex flex-col gap-5 xl:col-span-7">
          <Card
            title="Paste notes"
            badge={
              <span className="rounded-full bg-sky/70 px-2.5 py-1 text-[11px] font-medium text-brand-ink">
                Actions extracted
              </span>
            }
          >
            <ChipGroup
              label="Meeting type"
              options={["Team sync", "Client call", "1:1", "Workshop", "Board update"]}
              value={meetingType}
              onChange={setMeetingType}
            />

            <div className="mt-4">
              <Field label="Raw notes or transcript">
                <textarea
                  rows={12}
                  className="field field-focus resize-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Paste your meeting notes or transcript…"
                />
              </Field>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[11px] text-soft/80">
                {notes.trim().split(/\s+/).filter(Boolean).length} words in
              </p>
              <button
                type="button"
                disabled={mutation.isPending || !notes.trim()}
                onClick={() => mutation.mutate({ notes, meetingType })}
                className="inline-flex h-10 items-center rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground ring-1 ring-brand/30 transition-colors hover:bg-brand-ink disabled:opacity-50"
              >
                <Zap className="mr-1.5 size-4" aria-hidden="true" />
                {mutation.isPending ? "Summarizing…" : "Summarize notes"}
              </button>
            </div>

            {mutation.isError && (
              <ErrorNote message={(mutation.error as Error).message || "Summarization failed."} />
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-5 xl:col-span-5">
          {mutation.isPending ? (
            <GeneratingCard label="Meeting Notes" />
          ) : (
            <OutputCard
              title="Meeting brief"
              content={mutation.data?.text ?? null}
              tags={[meetingType, "Owners & deadlines flagged"]}
              emptyHint="Your summary, decisions and action items will appear here."
            />
          )}
        </div>
      </div>
    </AppShell>
  );
}
