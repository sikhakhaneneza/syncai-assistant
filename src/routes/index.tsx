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
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Meridian AI Assistant" },
      {
        name: "description",
        content:
          "Draft professional emails tuned to tone, audience and length with structured AI prompting.",
      },
      { property: "og:title", content: "Smart Email Generator — Meridian AI Assistant" },
      {
        property: "og:description",
        content: "Draft professional emails tuned to tone, audience and length in seconds.",
      },
    ],
  }),
  component: EmailPage,
});

const AUDIENCES = [
  "External · decision-maker",
  "Client · day-to-day contact",
  "Internal · manager",
  "Internal · peer team",
  "Vendor / partner",
];

function EmailPage() {
  const [recipient, setRecipient] = useState("Jordan Hale (Northwind)");
  const [audience, setAudience] = useState<string>("External · decision-maker");
  const [purpose, setPurpose] = useState(
    "Request a revised timeline for the Q3 rollout and confirm the onboarding date.",
  );
  const [tone, setTone] = useState("Warm");
  const [length, setLength] = useState("Concise");

  const fn = useServerFn(generateEmail);
  const mutation = useMutation({
    mutationFn: (data: {
      purpose: string;
      recipient: string;
      audience: string;
      tone: string;
      length: string;
    }) => fn({ data }),
  });

  return (
    <AppShell breadcrumb="Workspace / Email Generator" title="Smart Email Generator">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="flex flex-col gap-5 xl:col-span-7">
          <Card
            title="Compose"
            badge={
              <span className="rounded-full bg-rose/70 px-2.5 py-1 text-[11px] font-medium text-brand-ink">
                Tone-tuned
              </span>
            }
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="To">
                <input
                  className="field field-focus h-10"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Recipient name and company"
                />
              </Field>
              <Field label="Audience">
                <select
                  className="field field-focus h-10 appearance-none font-medium"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                >
                  {AUDIENCES.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="mt-4">
              <Field label="Purpose">
                <textarea
                  rows={3}
                  className="field field-focus resize-none"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="What should this email achieve?"
                />
              </Field>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ChipGroup
                label="Tone"
                options={["Warm", "Direct", "Formal", "Persuasive"]}
                value={tone}
                onChange={setTone}
              />
              <ChipGroup
                label="Length"
                options={["Concise", "Detailed"]}
                value={length}
                onChange={setLength}
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[11px] text-soft/80">Structured prompt · role · constraints · format</p>
              <button
                type="button"
                disabled={mutation.isPending || !purpose.trim()}
                onClick={() =>
                  mutation.mutate({ purpose, recipient, audience, tone, length })
                }
                className="inline-flex h-10 items-center rounded-xl bg-brand px-4 text-sm font-semibold text-primary-foreground ring-1 ring-brand/30 transition-colors hover:bg-brand-ink disabled:opacity-50"
              >
                <Zap className="mr-1.5 size-4" aria-hidden="true" />
                {mutation.isPending ? "Generating…" : "Generate email"}
              </button>
            </div>

            {mutation.isError && (
              <ErrorNote message={(mutation.error as Error).message || "Generation failed."} />
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-5 xl:col-span-5">
          {mutation.isPending ? (
            <GeneratingCard label="Email Generator" />
          ) : (
            <OutputCard
              title="Generated draft"
              content={mutation.data?.text ?? null}
              tags={[`Tone: ${tone}`, `Audience: ${audience.split(" · ")[0] ?? audience}`, length]}
              emptyHint="Your drafted email will appear here."
            />
          )}
        </div>
      </div>
    </AppShell>
  );
}
