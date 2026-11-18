"use client";

import React, { useState, useRef, useEffect } from "react";
import { AssistantMessage } from "@/lib/types/assistant";
import { MasterProfile } from "@/lib/types/profile";
import { ParsedJobDescription } from "@/lib/types/job";
import { GlobalJobListing } from "@/lib/types/global-job";
import {
  SparklesIcon,
  BotIcon,
  UserIcon,
  SendIcon,
  CopyIcon,
  RefreshCwIcon,
  TrashIcon,
  CheckIcon,
  BriefcaseIcon,
  ArrowRightIcon,
} from "@/components/ui/icons";

interface CareerAssistantViewProps {
  profile: MasterProfile;
  activeJob?: ParsedJobDescription | GlobalJobListing | null;
  initialPrompt?: string;
  onNavigateToTailor?: () => void;
}

export function CareerAssistantView({
  profile,
  activeJob,
  initialPrompt,
  onNavigateToTailor,
}: CareerAssistantViewProps) {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: "msg-welcome",
      role: "assistant",
      content: `Hello **${profile.contact.fullName}**! I am your **Dedicated AI Career & Interview Coach**.

I am fully synchronized with your **Master Professional Profile** (${profile.skills.length} verified technical skills, ${profile.employmentHistory.length} commercial roles) ${
        activeJob ? `and target opportunity: **${(activeJob as any).title || (activeJob as any).jobTitle}** @ **${(activeJob as any).company || (activeJob as any).companyName}**` : ""
      }.

How can I help you accelerate your recruitment journey today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestedPrompts: [
        "Generate 20 technical interview questions for this role",
        "Am I qualified for this position?",
        "Conduct a mock interview for this job",
        "Which of my projects should I highlight?",
        "Rewrite my experience using the XYZ impact framework",
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (textToSend: string) => {
    const query = textToSend.trim();
    if (!query || isLoading) return;

    const userMsg: AssistantMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputQuery("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/career-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          activeJob,
          history: newHistory,
          userQuery: query,
        }),
      });

      const data = await res.json();
      if (data.success && data.message) {
        const assistantMsg: AssistantMessage = {
          id: `msg-resp-${Date.now()}`,
          role: "assistant",
          content: data.message,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          suggestedPrompts: data.suggestedPrompts,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error(data.error || "Failed to receive response");
      }
    } catch (err: any) {
      const errorMsg: AssistantMessage = {
        id: `msg-err-${Date.now()}`,
        role: "assistant",
        content: `I encountered an issue processing your request: ${err.message || "Please check your network and try again."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (window.confirm("Clear this conversation history?")) {
      setMessages([
        {
          id: `msg-reset-${Date.now()}`,
          role: "assistant",
          content: "Conversation cleared. What would you like to explore next?",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          suggestedPrompts: [
            "Generate 10 technical interview questions",
            "Am I qualified for my target role?",
            "Conduct a mock interview",
          ],
        },
      ]);
    }
  };

  const formatMarkdown = (content: string) => {
    // Clean presentation of markdown formatting in chat
    const paragraphs = content.split("\n\n");
    return paragraphs.map((para, idx) => {
      if (para.startsWith("### ")) {
        return (
          <h3 key={idx} className="text-base font-bold text-zinc-900 dark:text-zinc-50 mt-3 mb-1">
            {para.replace("### ", "")}
          </h3>
        );
      }
      if (para.startsWith("#### ")) {
        return (
          <h4 key={idx} className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-2 mb-1">
            {para.replace("#### ", "")}
          </h4>
        );
      }
      if (para.startsWith("* ") || para.startsWith("- ")) {
        const items = para.split("\n");
        return (
          <ul key={idx} className="list-disc list-inside space-y-1 my-1.5 text-xs text-zinc-700 dark:text-zinc-300">
            {items.map((it, i) => (
              <li key={i}>{it.replace(/^[*\-]\s*/, "")}</li>
            ))}
          </ul>
        );
      }
      return (
        <p key={idx} className="text-xs leading-relaxed my-1.5 text-zinc-700 dark:text-zinc-300">
          {para}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-[750px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs overflow-hidden">
      {/* Top Assistant Header */}
      <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/60 dark:bg-zinc-950/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 dark:bg-purple-500 flex items-center justify-center text-white shadow-xs">
            <BotIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                AI Career &amp; Interview Assistant
              </h2>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                Module K Active
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {activeJob
                ? `Active Context: ${(activeJob as any).title || (activeJob as any).jobTitle} @ ${(activeJob as any).company || (activeJob as any).companyName}`
                : "Context: Master Profile Mode (Synchronized)"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToTailor && (
            <button
              onClick={onNavigateToTailor}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 rounded-lg transition"
            >
              <SparklesIcon className="w-3.5 h-3.5" /> Tailor Resume
            </button>
          )}
          <button
            onClick={handleClearChat}
            title="Clear Chat"
            className="p-2 text-zinc-400 hover:text-red-500 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? "ml-auto justify-end" : "mr-auto"}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white shrink-0 mt-1 shadow-2xs">
                  <BotIcon className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl text-xs space-y-1.5 shadow-2xs ${
                  isUser
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-tr-xs"
                    : "bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700/60 rounded-tl-xs"
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-[10px] opacity-60 pb-1">
                  <span className="font-bold uppercase tracking-wider">
                    {isUser ? profile.contact.fullName : "AI Career Coach"}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className="leading-relaxed">
                  {isUser ? <p className="text-xs">{msg.content}</p> : formatMarkdown(msg.content)}
                </div>

                {!isUser && (
                  <div className="pt-2 flex items-center justify-between border-t border-zinc-200/50 dark:border-zinc-700/50 mt-2">
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="inline-flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <CheckIcon className="w-3 h-3 text-emerald-500" /> Copied!
                        </>
                      ) : (
                        <>
                          <CopyIcon className="w-3 h-3" /> Copy Response
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Suggested Followup Prompts */}
                {!isUser && msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div className="pt-3 mt-2 border-t border-zinc-200/50 dark:border-zinc-700/50 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                      Suggested Inquiries:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedPrompts.map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(prompt)}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-600 hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition text-left"
                        >
                          {prompt} →
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 shrink-0 mt-1 shadow-2xs">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 max-w-3xl mr-auto">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white shrink-0 mt-1">
              <BotIcon className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700/60 text-xs flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce [animation-delay:0.4s]" />
              <span className="text-zinc-500 ml-1">Analyzing Master Profile and formulating guidance...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputQuery);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask about resume rewriting, mock interviews, technical questions, salary benchmarks..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isLoading}
            className="flex-1 text-xs sm:text-sm px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:ring-1 focus:ring-purple-600"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="inline-flex items-center justify-center p-3 rounded-xl text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition shadow-xs"
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
