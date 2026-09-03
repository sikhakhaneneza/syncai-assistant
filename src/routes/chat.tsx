import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { SendHorizonal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import { AppShell } from "@/components/AppShell";
import { Disclaimer, ErrorNote } from "@/components/ToolWorkspace";
import { sendChat } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat — Meridian AI Assistant" },
      {
        name: "description",
        content:
          "Chat with your workplace assistant for drafting, summarizing, planning and quick answers.",
      },
      { property: "og:title", content: "AI Chat — Meridian AI Assistant" },
      {
        property: "og:description",
        content: "A conversational assistant for drafting, planning and quick professional answers.",
      },
    ],
  }),
  component: ChatPage,
});

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Rewrite this update so it's shorter and more confident",
  "What should I prioritize before a board review?",
  "Turn these bullets into a status email",
];

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi Priya — I can draft, summarize, plan or analyse. What are we working on?",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const fn = useServerFn(sendChat);
  const mutation = useMutation({
    mutationFn: (history: Message[]) => fn({ data: { messages: history } }),
    onSuccess: (result) =>
      setMessages((prev) => [...prev, { role: "assistant", content: result.text }]),
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, mutation.isPending]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || mutation.isPending) return;
    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    mutation.mutate(next.filter((m) => m.role === "user" || m.content));
  };

  return (
    <AppShell breadcrumb="Workspace / Chat" title="AI Chatbot">
      <div className="mx-auto flex h-[calc(100vh-9.5rem)] w-full max-w-3xl flex-col">
        <section className="glass-card flex min-h-0 flex-1 flex-col p-5">
          <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
            {messages.map((message, i) =>
              message.role === "user" ? (
                <div
                  key={i}
                  className="max-w-[80%] self-end rounded-2xl rounded-tr-md bg-brand/12 px-3.5 py-2.5 text-sm text-brand-ink"
                >
                  {message.content}
                </div>
              ) : (
                <div
                  key={i}
                  className="ai-prose rise max-w-[88%] self-start rounded-2xl rounded-tl-md bg-canvas/80 px-3.5 py-2.5"
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ),
            )}

            {mutation.isPending && (
              <div className="flex w-40 flex-col gap-2 self-start rounded-2xl rounded-tl-md bg-canvas/80 px-3.5 py-3">
                <div className="shimmer h-3 w-full rounded-full" />
                <div className="shimmer h-3 w-2/3 rounded-full" />
              </div>
            )}
          </div>

          {messages.length === 1 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full bg-white/60 px-3 py-1.5 text-xs font-medium text-soft ring-1 ring-line transition-colors hover:bg-white hover:text-ink"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            className="mt-3 flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the assistant anything…"
              className="field field-focus h-10 flex-1 placeholder:text-soft/70"
            />
            <button
              type="submit"
              disabled={mutation.isPending || !input.trim()}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand text-primary-foreground transition-colors hover:bg-brand-ink disabled:opacity-50"
              aria-label="Send message"
            >
              <SendHorizonal className="size-4" aria-hidden="true" />
            </button>
          </form>

          {mutation.isError && (
            <ErrorNote message={(mutation.error as Error).message || "The assistant is unavailable."} />
          )}

          <Disclaimer />
        </section>
      </div>
    </AppShell>
  );
}
