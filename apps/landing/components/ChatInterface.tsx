"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronDown, ArrowUp, Plus,
  Layers, Cloud,
} from "lucide-react";
import { PERSONA_OPTIONS } from "@/lib/qualification-state";
import type { Persona } from "@/lib/qualification-state";

const TEXT_BASE = "text-[13px] text-white leading-none";

interface ChatInterfaceProps {
  onPersonaSelect?: (persona: Persona) => void;
  showPersonaPills?: boolean;
}

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
          Everything you'd hire for.
          <br />
          Already built.
        </h3>
        <p className="mt-2 text-[14px] text-[rgba(255,255,255,0.5)] leading-[150%]">
          Put your business on autopilot by signing
          {' '}in to unlock the engine.
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

export default function ChatInterface({ onPersonaSelect, showPersonaPills = false }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
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
        <div className="border border-[rgba(255,255,255,0.12)] rounded-2xl transition-colors relative bg-[rgba(10,10,10,0.75)] backdrop-blur-xl">
          {/* Persona pills — inline above textarea when in idle state */}
          {showPersonaPills && onPersonaSelect && (
            <div className="px-4 pt-3 pb-1">
              <p className="text-[13px] text-[rgba(255,255,255,0.4)] mb-2 font-body">What brings you to Ultron?</p>
              <div className="flex flex-wrap gap-1.5">
                {PERSONA_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onPersonaSelect(option.id)}
                    className="rounded-lg border border-[rgba(255,255,255,0.08)] px-3 py-1.5 text-[12px] font-medium text-white bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.18)] transition-all cursor-pointer font-body"
                  >
                    {option.label}
                  </button>
                ))}
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
              className="w-full bg-transparent text-[14px] text-white placeholder-[rgba(255,255,255,0.35)] resize-none outline-none min-h-[36px] max-h-[160px] leading-relaxed font-body"
            />
          </div>

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between px-4 pb-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openUnlock}
                className="flex items-center justify-center w-7 h-7 rounded-lg border border-[rgba(255,255,255,0.08)] text-white hover:border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.03)] transition-all"
              >
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>
              </button>

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
              <button
                type="button"
                onClick={openUnlock}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-white leading-none transition-all"
              >
                All Projects
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

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

        {/* Bottom row */}
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
