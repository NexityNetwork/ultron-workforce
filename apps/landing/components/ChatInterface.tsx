"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronDown, ChevronRight, ArrowUp, X, Plus, FileText,
  Layers, Search, Crosshair, Mail, Activity, Target, ArrowRight,
  Megaphone, UserCheck, Briefcase, GitBranch,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { initializeTemplateRegistry, getTemplatesByCategory, type Template } from "@/lib/templates";
import { PenTool, DollarSign, Rocket } from "lucide-react";

// ── Template categories ─────────────────────────────────────────────────────

const TEMPLATE_CATEGORIES: { id: Template["category"]; label: string; icon: LucideIcon }[] = [
  { id: "sales", label: "Sales", icon: Target },
  { id: "marketing", label: "Marketing", icon: Megaphone },
  { id: "content", label: "Content", icon: PenTool },
  { id: "financials", label: "Financials", icon: DollarSign },
  { id: "fundraising", label: "Fundraising", icon: Rocket },
];

const TEMPLATE_ICON_MAP: Record<string, LucideIcon> = {
  mail: Mail, target: Target, "file-text": FileText,
  layers: Layers, "bar-chart-2": Target, anchor: Target,
  "dollar-sign": DollarSign, calculator: Target, flame: Target,
  tag: Target, "pie-chart": Target, "trending-up": Target,
  presentation: Briefcase, "git-merge": GitBranch,
  "check-square": Target, grid: Target, clipboard: Target,
  compass: Target, "grid-3x3": Target, calendar: Target,
  filter: Target, "layout-grid": Target, layout: Target,
  "message-square": Target, rocket: Rocket, users: Target,
  columns: Target, "shield-question": Target, "check-circle": Target,
};

// ── Category pills for empty state ──────────────────────────────────────────

const CATEGORY_PILLS: { icon: LucideIcon; label: string; suggestions: { label: string; prompt: string }[] }[] = [
  { icon: Search, label: "Research", suggestions: [
    { label: "Research competitors in my industry", prompt: "Research my top competitors." },
    { label: "Find market trends for my niche", prompt: "Analyze current market trends in my industry." },
    { label: "Analyze a company before outreach", prompt: "I want to research a specific company before reaching out." },
  ]},
  { icon: Crosshair, label: "Prospect", suggestions: [
    { label: "Find decision-makers at target companies", prompt: "Help me identify the right decision-makers." },
    { label: "Build a lead list for my ICP", prompt: "Build a qualified lead list of 20 companies." },
    { label: "Identify high-intent prospects", prompt: "Find prospects most likely to buy right now." },
  ]},
  { icon: Mail, label: "Outreach", suggestions: [
    { label: "Write a cold email sequence", prompt: "Write a 3-step cold email sequence for my ICP." },
    { label: "Create a LinkedIn connection message", prompt: "Draft LinkedIn connection request messages." },
    { label: "Draft a follow-up after no response", prompt: "Write creative follow-up emails." },
  ]},
  { icon: Activity, label: "Content", suggestions: [
    { label: "Write a thought leadership post", prompt: "Write a LinkedIn post that positions me as a thought leader." },
    { label: "Create a content calendar", prompt: "Build a 4-week content calendar for my brand." },
    { label: "Draft a case study", prompt: "Help me write a compelling case study." },
  ]},
  { icon: Target, label: "Strategize", suggestions: [
    { label: "Build a go-to-market strategy", prompt: "Help me build a comprehensive GTM strategy." },
    { label: "Create a quarterly sales plan", prompt: "Create a detailed 90-day sales plan." },
    { label: "Design my ideal customer profile", prompt: "Help me define my ideal customer profile." },
  ]},
];

// ── Static Chatbox Component ────────────────────────────────────────────────

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const [activePill, setActivePill] = useState<string | null>(null);
  const [profileContextExpanded, setProfileContextExpanded] = useState(false);
  const [templatesPanelOpen, setTemplatesPanelOpen] = useState(false);
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState<Template["category"]>("sales");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { initializeTemplateRegistry(); }, []);

  const autoResizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, []);

  useEffect(() => { autoResizeTextarea(); }, [input, autoResizeTextarea]);

  return (
    <div className="w-full space-y-4">
      {/* Spinning Ultron logo */}
      <div className="flex justify-center mb-4">
        <Image
          src="/newlogo.png"
          alt="Ultron"
          width={64}
          height={64}
          className="animate-logo-spin rounded-2xl"
        />
      </div>

      <h2 className="text-2xl font-heading font-semibold text-white tracking-tight text-center sm:text-3xl">
        What are you working on?
      </h2>

      {/* Category pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {CATEGORY_PILLS.map(pill => {
          const Icon = pill.icon;
          const isActive = activePill === pill.label;
          return (
            <button
              key={pill.label}
              onClick={() => setActivePill(isActive ? null : pill.label)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-xs",
                isActive
                  ? "border-[rgba(255,255,255,0.25)] text-white bg-[rgba(255,255,255,0.08)]"
                  : "border-[rgba(255,255,255,0.12)] text-[rgba(255,255,255,0.6)] hover:text-white hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.04)]"
              )}
            >
              <Icon className="w-3 h-3" />
              {pill.label}
            </button>
          );
        })}
      </div>

      {/* Suggestion dropdown */}
      {activePill && (() => {
        const pill = CATEGORY_PILLS.find(p => p.label === activePill);
        if (!pill) return null;
        const Icon = pill.icon;
        return (
          <div className="border border-[rgba(255,255,255,0.08)] rounded-xl bg-[rgba(255,255,255,0.02)] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5">
              <div className="flex items-center gap-2 text-[rgba(255,255,255,0.4)]">
                <Icon className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{pill.label}</span>
              </div>
              <button
                type="button"
                onClick={() => setActivePill(null)}
                className="text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.6)] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="border-t border-[rgba(255,255,255,0.06)]">
              {pill.suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setInput(suggestion.prompt);
                    setActivePill(null);
                    setTimeout(() => textareaRef.current?.focus(), 0);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-left text-sm text-[rgba(255,255,255,0.6)] hover:text-white hover:bg-[rgba(255,255,255,0.04)] transition-colors group"
                >
                  <span>{suggestion.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[rgba(255,255,255,0.3)]" />
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ── The Chatbox ────────────────────────────────────────────────── */}
      <div className="relative">
        {/* Templates panel */}
        {templatesPanelOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Templates</span>
              <button type="button" onClick={() => setTemplatesPanelOpen(false)} className="text-[rgba(255,255,255,0.3)] hover:text-white transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-1 px-4 py-2 border-b border-[rgba(255,255,255,0.06)]">
              {TEMPLATE_CATEGORIES.map(cat => {
                const CatIcon = cat.icon;
                const isActive = selectedTemplateCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedTemplateCategory(cat.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all",
                      isActive
                        ? "bg-[rgba(255,255,255,0.08)] text-white font-medium"
                        : "text-[rgba(255,255,255,0.45)] hover:text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.03)]"
                    )}
                  >
                    <CatIcon className="w-3 h-3" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
            <div className="max-h-64 overflow-y-auto">
              {getTemplatesByCategory(selectedTemplateCategory).map((tmpl) => {
                const TmplIcon = TEMPLATE_ICON_MAP[tmpl.icon] || FileText;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => { setTemplatesPanelOpen(false); setInput(tmpl.name); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[rgba(255,255,255,0.03)] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center flex-shrink-0">
                      <TmplIcon className="w-3.5 h-3.5 text-[rgba(255,255,255,0.7)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-white block">{tmpl.name}</span>
                      <span className="text-xs text-[rgba(255,255,255,0.4)] block mt-0.5">{tmpl.description}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[rgba(255,255,255,0.2)] flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Unified chatbox */}
        <div className="border border-[rgba(255,255,255,0.12)] rounded-2xl transition-colors relative bg-[#0A0A0A]">
          {/* Collapsible Configurations */}
          <button
            type="button"
            onClick={() => setProfileContextExpanded(!profileContextExpanded)}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-[rgba(255,255,255,0.02)] transition-colors group rounded-t-2xl"
          >
            <ChevronDown className={cn(
              "w-3.5 h-3.5 text-[rgba(255,255,255,0.5)] transition-transform flex-shrink-0",
              !profileContextExpanded && "-rotate-90"
            )} />
            <span className="text-sm text-[rgba(255,255,255,0.7)] group-hover:text-white transition-colors font-medium">
              Configurations
            </span>
            <div className="flex-1" />
            {profileContextExpanded && (
              <span className="text-sm text-[#DA4E24] hover:text-[#E8622C] transition-colors cursor-pointer font-medium">
                Edit Profile
              </span>
            )}
          </button>

          {/* Expanded configuration details */}
          {profileContextExpanded && (
            <div className="px-5 pb-4 pt-1">
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <UserCheck className="w-3.5 h-3.5 text-[rgba(255,255,255,0.4)]" />
                    <span className="text-sm text-white font-medium">Founder-Led B2B SaaS</span>
                  </div>
                  <span className="text-xs text-[rgba(255,255,255,0.5)] pl-[22px]">Founder, CEO, Head of Growth</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Megaphone className="w-3.5 h-3.5 text-[rgba(255,255,255,0.4)]" />
                    <span className="text-sm text-white font-medium">Thought Leader</span>
                  </div>
                  <span className="text-xs text-[rgba(255,255,255,0.5)] pl-[22px]">Authoritative, insight-led</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Briefcase className="w-3.5 h-3.5 text-[rgba(255,255,255,0.4)]" />
                    <span className="text-sm text-white font-medium">SaaS / Software</span>
                  </div>
                  <span className="text-xs text-[rgba(255,255,255,0.5)] pl-[22px]">Cloud products, dev tools</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Target className="w-3.5 h-3.5 text-[rgba(255,255,255,0.4)]" />
                    <span className="text-sm text-white font-medium">LinkedIn Authority Engine</span>
                  </div>
                  <span className="text-xs text-[rgba(255,255,255,0.5)] pl-[22px]">Thought leadership + DM CTA</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[rgba(255,255,255,0.06)]">
                <Target className="w-3.5 h-3.5 text-[rgba(255,255,255,0.4)]" />
                <span className="text-sm font-medium text-[rgba(255,255,255,0.5)]">Sales Copilot</span>
                <div className="w-7 h-4 rounded-full relative transition-colors bg-[rgba(255,255,255,0.15)]">
                  <div className="absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-all" />
                </div>
                <div className="w-px h-4 bg-[rgba(255,255,255,0.08)] mx-1" />
                <GitBranch className="w-3.5 h-3.5 text-[rgba(255,255,255,0.4)]" />
                <span className="text-sm text-[rgba(255,255,255,0.5)]">Connect GitHub</span>
              </div>
            </div>
          )}

          {/* Textarea */}
          <div className="px-4 pt-2 pb-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message Ultron or type / to assign agents"
              rows={1}
              className="w-full bg-transparent text-white placeholder-[rgba(255,255,255,0.45)] resize-none text-sm outline-none min-h-[32px] max-h-[160px] leading-relaxed font-body"
            />
          </div>

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between px-4 pb-3 pt-1">
            <div className="flex items-center gap-2">
              {/* Integrations icon */}
              <button
                type="button"
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.4)] hover:text-white hover:border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.03)] transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>
              </button>

              {/* Templates button */}
              <button
                type="button"
                onClick={() => setTemplatesPanelOpen(!templatesPanelOpen)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                  templatesPanelOpen
                    ? "border-[rgba(255,255,255,0.25)] text-white bg-[rgba(255,255,255,0.08)]"
                    : "border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.5)] hover:text-white hover:border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.03)]"
                )}
              >
                <Layers className="w-3 h-3" />
                Templates
              </button>

              <div className="flex-1" />

              {/* All Projects dropdown */}
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[rgba(255,255,255,0.5)] hover:text-white transition-all"
              >
                All Projects
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Send button */}
            <button
              type="button"
              disabled={!input.trim()}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-xl transition-all",
                input.trim()
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.2)]"
              )}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom row: workspace name + new session */}
        <div className="flex items-center justify-between mt-2 px-1">
          <div className="flex items-center gap-1.5">
            <Image src="/newlogo.png" alt="" width={14} height={14} className="rounded-sm opacity-50" />
            <span className="text-xs text-[rgba(255,255,255,0.3)]">NXT Enterprises</span>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.6)] transition-colors"
          >
            <Plus className="w-3 h-3" />
            New session
          </button>
        </div>
      </div>
    </div>
  );
}
