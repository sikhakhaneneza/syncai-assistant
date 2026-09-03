import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import {
  buildChatSystemPrompt,
  buildEmailPrompt,
  buildNotesPrompt,
  buildResearchPrompt,
  buildTasksPrompt,
} from "./prompts.server";

const MODEL = "google/gemini-3.7-flash";

async function runPrompt(system: string, prompt: string) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured on this workspace.");

  const gateway = createLovableAiGatewayProvider(key);
  const result = streamText({
    model: gateway(MODEL),
    system,
    prompt,
    providerOptions: { lovable: { service_tier: "priority" } },
  });

  return { text: await result.text };
}

const EmailSchema = z.object({
  purpose: z.string().min(1, "Describe the purpose of the email."),
  recipient: z.string().default(""),
  audience: z.string().default("External · decision-maker"),
  tone: z.string().default("Warm"),
  length: z.string().default("Concise"),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailSchema.parse(input))
  .handler(async ({ data }) => {
    const { system, prompt } = buildEmailPrompt(data);
    return runPrompt(system, prompt);
  });

const NotesSchema = z.object({
  notes: z.string().min(1, "Paste your meeting notes."),
  meetingType: z.string().default("Team sync"),
});

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => NotesSchema.parse(input))
  .handler(async ({ data }) => {
    const { system, prompt } = buildNotesPrompt(data);
    return runPrompt(system, prompt);
  });

const TasksSchema = z.object({
  tasks: z.string().min(1, "Add at least one task."),
  horizon: z.string().default("Today"),
  hoursAvailable: z.string().default("6 hours"),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => TasksSchema.parse(input))
  .handler(async ({ data }) => {
    const { system, prompt } = buildTasksPrompt(data);
    return runPrompt(system, prompt);
  });

const ResearchSchema = z.object({
  topic: z.string().min(1, "Enter a research question."),
  depth: z.string().default("Standard brief"),
  angle: z.string().default("Business strategy"),
});

export const runResearch = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResearchSchema.parse(input))
  .handler(async ({ data }) => {
    const { system, prompt } = buildResearchPrompt(data);
    return runPrompt(system, prompt);
  });

const ChatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .min(1),
});

export const sendChat = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured on this workspace.");

    const gateway = createLovableAiGatewayProvider(key);
    const result = streamText({
      model: gateway(MODEL),
      system: buildChatSystemPrompt(),
      messages: data.messages,
      providerOptions: { lovable: { service_tier: "priority" } },
    });

    return { text: await result.text };
  });
