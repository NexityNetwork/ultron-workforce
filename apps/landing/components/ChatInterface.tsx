"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronDown, ChevronRight, ArrowUp, X, Plus, FileText,
  Layers, Target,
  Megaphone,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
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
  presentation: Target, "git-merge": Target,
  "check-square": Target, grid: Target, clipboard: Target,
  compass: Target, "grid-3x3": Target, calendar: Target,
  filter: Target, "layout-grid": Target, layout: Target,
  "message-square": Target, rocket: Rocket, users: Target,
  columns: Target, "shield-question": Target, "check-circle": Target,
};

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
    <div className="w-full space-y-4">
      {/* The Chatbox */}
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
          </button>

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
            <span className="text-xs text-[rgba(255,255,255,0.3)]">Company Profile</span>
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
