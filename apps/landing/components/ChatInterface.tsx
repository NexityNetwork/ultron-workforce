"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronDown, ArrowUp, Plus,
  Layers, Target, Cloud,
  Megaphone, UserCheck, Briefcase, GitBranch,
} from "lucide-react";

/** Consistent text style used across the chatbox UI */
const TEXT_BASE = "text-[13px] text-white leading-none";

function UnlockModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-[320px] rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[#1a1a1a] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[18px] font-semibold text-white leading-tight">
          Unlock everything you'd hire for already built.
        </h3>
        <p className="mt-2 text-[14px] text-[rgba(255,255,255,0.5)] leading-[150%]">
          Put your business on autopilot by signing in.
        </p>
        <a
          href="https://app.51ultron.com/login"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex h-[40px] w-full items-center justify-center rounded-lg bg-white text-[14px] font-medium text-black transition-colors hover:bg-[#E0E0E0]"
        >
          Sign in
        </a>
      </div>
    </div>
  );
}

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const [profileContextExpanded, setProfileContextExpanded] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, []);

  useEffect(() => { autoResizeTextarea(); }, [input, autoResizeTextarea]);

  const openUnlock = useCallback(() => setShowUnlock(true), []);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    setShowUnlock(true);
  }, [input]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <div className="mx-auto w-full max-w-[800px]">
      {showUnlock && <UnlockModal onClose={() => setShowUnlock(false)} />}

      <div className="relative">
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
              <span
                className="text-[13px] text-[#DA4E24] hover:text-[#E8622C] transition-colors cursor-pointer font-medium leading-none"
                onClick={(e) => { e.stopPropagation(); openUnlock(); }}
              >
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
                <button type="button" onClick={openUnlock} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <Target className="w-3.5 h-3.5 text-white" />
                  <span className={cn(TEXT_BASE, "font-medium")}>Sales Copilot</span>
                </button>
                <div className="w-7 h-4 rounded-full relative transition-colors bg-[rgba(255,255,255,0.15)] cursor-pointer" onClick={openUnlock}>
                  <div className="absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-all" />
                </div>
                <div className="w-px h-4 bg-[rgba(255,255,255,0.08)] mx-1" />
                <button type="button" onClick={openUnlock} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <GitBranch className="w-3.5 h-3.5 text-white" />
                  <span className={TEXT_BASE}>Connect GitHub</span>
                </button>
              </div>
            </div>
          )}

          {/* Textarea */}
          <div className="px-4 pt-3 pb-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Ultron or type / to assign agents"
              rows={1}
              className="w-full bg-transparent text-[14px] text-white placeholder-[rgba(255,255,255,0.5)] resize-none outline-none min-h-[36px] max-h-[160px] leading-relaxed font-body"
            />
          </div>

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between px-4 pb-3 pt-1">
            <div className="flex items-center gap-2">
              {/* Integrations icon */}
              <button
                type="button"
                onClick={openUnlock}
                className="flex items-center justify-center w-7 h-7 rounded-lg border border-[rgba(255,255,255,0.08)] text-white hover:border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.03)] transition-all"
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>
              </button>

              {/* Templates button - hidden on mobile */}
              <button
                type="button"
                onClick={openUnlock}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium leading-none text-white hover:bg-[rgba(255,255,255,0.03)] transition-all"
              >
                <Layers className="w-3.5 h-3.5" />
                Templates
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* All Projects dropdown - hidden on mobile */}
              <button
                type="button"
                onClick={openUnlock}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-white leading-none transition-all"
              >
                All Projects
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Send button */}
              <button
                type="button"
                onClick={handleSend}
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
          <button type="button" onClick={openUnlock} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            <Cloud className="w-3.5 h-3.5 text-white" />
            <span className={TEXT_BASE}>Company Profile</span>
          </button>
          <button
            type="button"
            onClick={openUnlock}
            className={cn(TEXT_BASE, "flex items-center gap-1.5 hover:opacity-80 transition-opacity")}
          >
            <Plus className="w-3.5 h-3.5" />
            New session
          </button>
        </div>
      </div>
    </div>
  );
}
