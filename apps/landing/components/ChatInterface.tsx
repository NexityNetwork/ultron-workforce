"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronDown, ChevronRight, ArrowUp, X, Plus, FileText,
  Layers, Target, Cloud,
  Megaphone, UserCheck, Briefcase, GitBranch,
  type LucideIcon,
} from "lucide-react";
import { initializeTemplateRegistry, getTemplatesByCategory, type Template } from "@/lib/templates";
import { PenTool, DollarSign, Rocket } from "lucide-react";

const TEMPLATE_CATEGORIES: { id: Template["category"]; label: string; icon: LucideIcon }[] = [
  { id: "sales", label: "Sales", icon: Target },
  { id: "marketing", label: "Marketing", icon: Megaphone },
  { id: "content", label: "Content", icon: PenTool },
  { id: "financials", label: "Financials", icon: DollarSign },
  { id: "fundraising", label: "Fundraising", icon: Rocket },
];

const TEMPLATE_ICON_MAP: Record<string, LucideIcon> = {
  mail: Target, target: Target, "file-text": FileText,
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

/** Consistent text style used across the chatbox UI */
const TEXT_BASE = "text-[13px] text-white leading-none";

export default function ChatInterface() {
  const [input, setInput] = useState("");
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
    <div className="mx-auto w-full max-w-[800px]">
      {/* ── The Chatbox ────────────────────────────────────────────────── */}
      <div className="relative">
        {/* Templates panel */}
        {templatesPanelOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
              <span className={cn(TEXT_BASE, "font-semibold")}>Templates</span>
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
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] leading-none transition-all",
                      isActive
                        ? "bg-[rgba(255,255,255,0.08)] text-white font-medium"
                        : "text-[rgba(255,255,255,0.45)] hover:text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.03)]"
                    )}
                  >
                    <CatIcon className="w-3.5 h-3.5" />
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
                      <span className={cn(TEXT_BASE, "font-medium block")}>{tmpl.name}</span>
                      <span className="text-[12px] text-[rgba(255,255,255,0.4)] block mt-0.5">{tmpl.description}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[rgba(255,255,255,0.2)] flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Unified chatbox */}
        <div className="border border-[rgba(255,255,255,0.15)] rounded-2xl transition-colors relative bg-[var(--landing-bg)]">
          {/* Collapsible Configurations - hidden on mobile */}
          <button
            type="button"
            onClick={() => setProfileContextExpanded(!profileContextExpanded)}
            className="hidden lg:flex w-full items-center gap-1.5 px-4 py-2.5 hover:bg-[rgba(255,255,255,0.02)] transition-colors group rounded-t-2xl"
          >
            <ChevronDown className={cn(
              "w-3.5 h-3.5 text-white transition-transform flex-shrink-0",
              !profileContextExpanded && "-rotate-90"
            )} />
            <span className={cn(TEXT_BASE, "group-hover:text-white transition-colors font-medium")}>
              Configurations
            </span>
            <div className="flex-1" />
            {profileContextExpanded && (
              <span className="text-[13px] text-[#DA4E24] hover:text-[#E8622C] transition-colors cursor-pointer font-medium leading-none">
                Edit Profile
              </span>
            )}
          </button>

          {/* Expanded configuration details */}
          {profileContextExpanded && (
            <div className="hidden lg:block px-5 pb-4 pt-1">
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <UserCheck className="w-3.5 h-3.5 text-white" />
                    <span className={cn(TEXT_BASE, "font-medium")}>Founder-Led B2B SaaS</span>
                  </div>
                  <span className="text-[13px] text-[rgba(255,255,255,0.5)] pl-[22px] leading-none">Founder, CEO, Head of Growth</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Megaphone className="w-3.5 h-3.5 text-white" />
                    <span className={cn(TEXT_BASE, "font-medium")}>Thought Leader</span>
                  </div>
                  <span className="text-[13px] text-[rgba(255,255,255,0.5)] pl-[22px] leading-none">Authoritative, insight-led</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Briefcase className="w-3.5 h-3.5 text-white" />
                    <span className={cn(TEXT_BASE, "font-medium")}>SaaS / Software</span>
                  </div>
                  <span className="text-[13px] text-[rgba(255,255,255,0.5)] pl-[22px] leading-none">Cloud products, dev tools</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <Target className="w-3.5 h-3.5 text-white" />
                    <span className={cn(TEXT_BASE, "font-medium")}>LinkedIn Authority Engine</span>
                  </div>
                  <span className="text-[13px] text-[rgba(255,255,255,0.5)] pl-[22px] leading-none">Thought leadership + DM CTA</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[rgba(255,255,255,0.06)]">
                <Target className="w-3.5 h-3.5 text-white" />
                <span className={cn(TEXT_BASE, "font-medium")}>Sales Copilot</span>
                <div className="w-7 h-4 rounded-full relative transition-colors bg-[rgba(255,255,255,0.15)]">
                  <div className="absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-all" />
                </div>
                <div className="w-px h-4 bg-[rgba(255,255,255,0.08)] mx-1" />
                <GitBranch className="w-3.5 h-3.5 text-white" />
                <span className={TEXT_BASE}>Connect GitHub</span>
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
              className="w-full bg-transparent text-[13px] text-white placeholder-[rgba(255,255,255,0.45)] resize-none outline-none min-h-[32px] max-h-[160px] leading-relaxed font-body"
            />
          </div>

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between px-4 pb-3 pt-1">
            <div className="flex items-center gap-2">
              {/* Integrations icon */}
              <button
                type="button"
                className="flex items-center justify-center w-7 h-7 rounded-lg border border-[rgba(255,255,255,0.08)] text-white hover:border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.03)] transition-all"
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>
              </button>

              {/* Templates button - hidden on mobile */}
              <button
                type="button"
                onClick={() => setTemplatesPanelOpen(!templatesPanelOpen)}
                className={cn(
                  "hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium leading-none transition-all",
                  templatesPanelOpen
                    ? "text-white bg-[rgba(255,255,255,0.08)]"
                    : "text-white hover:bg-[rgba(255,255,255,0.03)]"
                )}
              >
                <Layers className="w-3.5 h-3.5" />
                Templates
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* All Projects dropdown - hidden on mobile */}
              <button
                type="button"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-white leading-none transition-all"
              >
                All Projects
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Send button */}
              <button
                type="button"
                disabled={!input.trim()}
                className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-xl transition-all",
                  input.trim()
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.2)]"
                )}
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row: company profile + new session */}
        <div className="flex items-center justify-between mt-2 px-1">
          <div className="flex items-center gap-1.5">
            <Cloud className="w-3.5 h-3.5 text-white" />
            <span className={TEXT_BASE}>Company Profile</span>
          </div>
          <button
            type="button"
            className={cn(TEXT_BASE, "flex items-center gap-1.5 hover:text-[rgba(255,255,255,0.6)] transition-colors")}
          >
            <Plus className="w-3.5 h-3.5" />
            New session
          </button>
        </div>
      </div>
    </div>
  );
}
