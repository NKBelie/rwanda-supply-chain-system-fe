"use client";
import { useEffect, useRef, useState } from "react";
import { MessageSquarePlus, Search, Send } from "lucide-react";
import { PageBody, PageHeader } from "@/components/app/PageChrome";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { commsStore, threadForRole, useComms, type State } from "@/lib/comms-store";
import type { Role } from "@/lib/auth/roles";

export function RoleMessagesPage({ role }: { role: Role }) {
  const threads = useComms((s: State) => s.threads.filter((t) => threadForRole(t, role)));
  const [selectedId, setSelectedId] = useState<string>("");
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // pick first thread once loaded
  useEffect(() => {
    if (!selectedId && threads.length > 0) setSelectedId(threads[0].id);
  }, [threads, selectedId]);

  const selected = threads.find((t) => t.id === selectedId) ?? null;

  const filteredThreads = threads.filter((t) => {
    const term = search.toLowerCase();
    return !term || t.name.toLowerCase().includes(term) || t.role.toLowerCase().includes(term);
  });

  useEffect(() => {
    if (selectedId) commsStore.markThreadRead(selectedId);
  }, [selectedId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.messages.length]);

  const send = () => {
    if (!input.trim() || !selectedId) return;
    commsStore.sendMessage(selectedId, input.trim());
    setInput("");
  };

  const totalUnread = threads.reduce((s, t) => s + t.unread, 0);

  return (
    <>
      <PageHeader
        title="Messages"
        description="Communicate with your supply chain partners."
        crumbs={[{ label: role, href: `/${role}/dashboard` }, { label: "Messages" }]}
        actions={
          totalUnread > 0 ? (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {totalUnread} unread
            </span>
          ) : undefined
        }
      />
      <PageBody>
        <div className="flex h-[calc(100vh-180px)] min-h-[500px] overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
          {/* Thread list */}
          <div className="flex w-72 shrink-0 flex-col border-r border-border">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search messages…"
                  className="h-9 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredThreads.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">No conversations.</p>
              ) : filteredThreads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => setSelectedId(thread.id)}
                  className={cn(
                    "w-full flex items-start gap-3 px-4 py-3 text-left transition border-b border-border/50",
                    selectedId === thread.id ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-surface"
                  )}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {thread.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className={cn("truncate text-sm", thread.unread > 0 ? "font-semibold text-foreground" : "font-medium text-foreground")}>
                        {thread.name}
                      </p>
                      <span className="shrink-0 text-[10px] text-muted-foreground">{thread.time}</span>
                    </div>
                    <div className="flex items-center justify-between gap-1 mt-0.5">
                      <p className="truncate text-xs text-muted-foreground">
                        {thread.messages.at(-1)?.text ?? "No messages yet"}
                      </p>
                      {thread.unread > 0 && (
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                          {thread.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{thread.role}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="p-3 border-t border-border">
              <Button size="sm" className="w-full" variant="outline">
                <MessageSquarePlus className="mr-1.5 h-4 w-4" /> New Message
              </Button>
            </div>
          </div>

          {/* Chat area */}
          {selected ? (
            <div className="flex flex-1 flex-col min-w-0">
              <div className="flex items-center gap-3 border-b border-border px-5 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {selected.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{selected.name}</p>
                  <p className="text-xs text-muted-foreground">{selected.role}</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {selected.messages.map((msg, idx) => (
                  <div key={idx} className={cn("flex", msg.self ? "justify-end" : "justify-start")}>
                    {!msg.self && (
                      <div className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary self-end">
                        {selected.name.charAt(0)}
                      </div>
                    )}
                    <div className={cn(
                      "max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                      msg.self
                        ? "rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm bg-surface border border-border text-foreground"
                    )}>
                      <p>{msg.text}</p>
                      <p className={cn("mt-1 text-[10px]", msg.self ? "text-primary-foreground/60 text-right" : "text-muted-foreground")}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="border-t border-border p-3">
                <div className="flex items-center gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
                    placeholder={`Message ${selected.name}…`}
                    className="flex-1 h-10 rounded-xl border border-border bg-surface px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                  <Button size="sm" onClick={send} disabled={!input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-1.5 text-[10px] text-muted-foreground text-center">Press Enter to send</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageSquarePlus className="mx-auto h-10 w-10 opacity-30" />
                <p className="mt-2 text-sm">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </PageBody>
    </>
  );
}
