"use client";

import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  X,
  Check,
  ArrowRight,
  ShieldAlert,
  Calculator,
  Award,
  RefreshCw,
  PenLine,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SalesCopilotProps {
  isOpen: boolean;
  prospectName?: string;
  onSendToChat: (message: string) => void;
  onClose: () => void;
}

type Dimension = "S" | "P" | "I" | "C" | "E" | "D";

interface DimensionMeta {
  key: Dimension;
  label: string;
  questions: string[];
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const DIMENSIONS: DimensionMeta[] = [
  {
    key: "S",
    label: "Situation",
    questions: [
      "How do you currently handle [topic]? Walk me through your process.",
      "What tools or solutions are you using right now for this?",
      "How satisfied are you with your current approach?",
    ],
  },
  {
    key: "P",
    label: "Pain",
    questions: [
      "What's your biggest challenge when it comes to [topic]?",
      "Where do you feel like you're leaving the most value on the table?",
      "How is this problem affecting your team day-to-day?",
    ],
  },
  {
    key: "I",
    label: "Impact",
    questions: [
      "What would it mean for your business if you solved this?",
      "What's the cost of not fixing this over the next 6-12 months?",
      "What would an ideal outcome look like 6 months from now?",
    ],
  },
  {
    key: "C",
    label: "Critical Event",
    questions: [
      "Is there a specific deadline or event driving the urgency?",
      "What's your timeline for implementing a solution?",
      "What have you tried so far to address this?",
    ],
  },
  {
    key: "E",
    label: "Decision",
    questions: [
      "What does your evaluation process look like for something like this?",
      "What criteria matter most to you when choosing a solution?",
      "How have you made similar decisions in the past?",
    ],
  },
  {
    key: "D",
    label: "Champion",
    questions: [
      "Who else needs to be involved in this decision?",
      "Who would champion this internally if you moved forward?",
      "How many people on your team would use this?",
    ],
  },
];

const OBJECTION_OPTIONS = ["Price", "Timing", "Competition", "Trust", "Other"] as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const SalesCopilot = React.forwardRef<HTMLDivElement, SalesCopilotProps>(
  ({ isOpen, prospectName = "Prospect", onSendToChat, onClose }, ref) => {
    const [activeDimension, setActiveDimension] = useState<Dimension>("S");
    const [coveredDimensions, setCoveredDimensions] = useState<Set<Dimension>>(
      new Set()
    );
    const [notes, setNotes] = useState<string[]>([]);
    const [noteInput, setNoteInput] = useState("");
    const [showObjectionMenu, setShowObjectionMenu] = useState(false);

    // ---- Handlers --------------------------------------------------------

    const handlePillClick = useCallback((dim: Dimension) => {
      setActiveDimension(dim);
      setShowObjectionMenu(false);
    }, []);

    const handlePillDoubleClick = useCallback((dim: Dimension) => {
      setCoveredDimensions((prev) => {
        const next = new Set(prev);
        if (next.has(dim)) {
          next.delete(dim);
        } else {
          next.add(dim);
        }
        return next;
      });
    }, []);

    const handleAsk = useCallback(
      (question: string) => {
        onSendToChat(question);
      },
      [onSendToChat]
    );

    const handleObjection = useCallback(
      (option: string) => {
        onSendToChat(
          `The prospect is raising an objection about ${option}. Help me respond concisely with a reframe that addresses their concern. Context: I'm on a call with ${prospectName}.`
        );
        setShowObjectionMenu(false);
      },
      [onSendToChat, prospectName]
    );

    const handleAddNote = useCallback(() => {
      const trimmed = noteInput.trim();
      if (!trimmed) return;
      setNotes((prev) => [...prev, trimmed]);
      setNoteInput("");
    }, [noteInput]);

    const handleNoteKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleAddNote();
        }
      },
      [handleAddNote]
    );

    // ---- Render ----------------------------------------------------------

    if (!isOpen) return null;

    const activeMeta = DIMENSIONS.find((d) => d.key === activeDimension)!;

    return (
      <div
        ref={ref}
        className="absolute bottom-full left-0 right-0 mb-2 mx-4 bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-50 overflow-hidden"
      >
        <div className="max-h-[420px] overflow-y-auto">
          {/* ---- Header ------------------------------------------------- */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.08)]">
            <span className="text-sm font-semibold text-white">
              Sales Copilot
            </span>
            <div className="flex items-center gap-3">
              {prospectName && (
                <span className="text-xs text-[rgba(255,255,255,0.5)]">
                  {prospectName}
                </span>
              )}
              <button
                onClick={onClose}
                className="text-[rgba(255,255,255,0.4)] hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* ---- SPICED Pills ------------------------------------------- */}
          <div className="flex items-center gap-2 px-4 py-3">
            {DIMENSIONS.map((dim) => {
              const isCovered = coveredDimensions.has(dim.key);
              const isActive = activeDimension === dim.key;

              return (
                <button
                  key={dim.key}
                  onClick={() => handlePillClick(dim.key)}
                  onDoubleClick={() => handlePillDoubleClick(dim.key)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1.5",
                    isCovered &&
                      "border-emerald-400/30 bg-emerald-400/[0.06] text-emerald-400",
                    !isCovered &&
                      isActive &&
                      "border-[#DA4E24]/30 bg-[#DA4E24]/[0.06] text-[#DA4E24]",
                    !isCovered &&
                      !isActive &&
                      "border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.5)] hover:border-[rgba(255,255,255,0.2)]"
                  )}
                >
                  {dim.key}
                  {isCovered && <Check size={12} />}
                  {!isCovered && isActive && <ArrowRight size={12} />}
                </button>
              );
            })}
          </div>

          {/* ---- Questions ---------------------------------------------- */}
          <div className="px-4 pb-3 space-y-2">
            <p className="text-xs font-medium text-[rgba(255,255,255,0.4)] mb-2">
              {activeMeta.label} Questions
            </p>
            {activeMeta.questions.map((q, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]"
              >
                <span className="text-sm text-[rgba(255,255,255,0.8)] leading-snug">
                  {q}
                </span>
                <button
                  onClick={() => handleAsk(q)}
                  className="shrink-0 text-xs text-[#DA4E24] hover:text-[#E8622C] font-medium transition-colors"
                >
                  Ask
                </button>
              </div>
            ))}
          </div>

          {/* ---- Quick Actions ------------------------------------------ */}
          <div className="px-4 pb-3">
            <p className="text-xs font-medium text-[rgba(255,255,255,0.4)] mb-2">
              Quick Actions
            </p>
            <div className="grid grid-cols-3 gap-2">
              {/* Objection */}
              <div className="relative">
                <button
                  onClick={() => setShowObjectionMenu((v) => !v)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] transition-colors text-xs font-medium text-[rgba(255,255,255,0.7)]"
                >
                  <ShieldAlert size={14} />
                  Objection
                </button>
                {showObjectionMenu && (
                  <div className="absolute bottom-full left-0 mb-1 w-40 bg-[#222] border border-[rgba(255,255,255,0.1)] rounded-lg shadow-lg overflow-hidden z-10">
                    {OBJECTION_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleObjection(opt)}
                        className="w-full text-left px-3 py-2 text-xs text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ROI Help */}
              <button
                onClick={() =>
                  onSendToChat(
                    `Help me calculate a quick ROI argument for ${prospectName}. I need a concise, conversational number I can share on this call.`
                  )
                }
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] transition-colors text-xs font-medium text-[rgba(255,255,255,0.7)]"
              >
                <Calculator size={14} />
                ROI Help
              </button>

              {/* Case Study */}
              <button
                onClick={() =>
                  onSendToChat(
                    `Give me a relevant case study or proof point I can share on this call with ${prospectName}. One story, one metric, make it compelling.`
                  )
                }
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] transition-colors text-xs font-medium text-[rgba(255,255,255,0.7)]"
              >
                <Award size={14} />
                Case Study
              </button>

              {/* Reframe */}
              <button
                onClick={() =>
                  onSendToChat(
                    `The prospect seems hesitant. Give me a reframe that shifts the conversation from cost to value. I'm on a call with ${prospectName}.`
                  )
                }
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] transition-colors text-xs font-medium text-[rgba(255,255,255,0.7)]"
              >
                <RefreshCw size={14} />
                Reframe
              </button>

              {/* Next Steps */}
              <button
                onClick={() =>
                  onSendToChat(
                    `Suggest what I should propose as next steps on this call with ${prospectName}. Keep it low-pressure and natural.`
                  )
                }
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] transition-colors text-xs font-medium text-[rgba(255,255,255,0.7)]"
              >
                <ArrowRight size={14} />
                Next Steps
              </button>

              {/* Summary */}
              <button
                onClick={() =>
                  onSendToChat(
                    `Summarize the key takeaways from my call with ${prospectName} so far. I need a concise summary I can use for follow-up.`
                  )
                }
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] transition-colors text-xs font-medium text-[rgba(255,255,255,0.7)]"
              >
                <PenLine size={14} />
                Summary
              </button>
            </div>
          </div>

          {/* ---- Notes -------------------------------------------------- */}
          <div className="px-4 pb-4">
            <p className="text-xs font-medium text-[rgba(255,255,255,0.4)] mb-2">
              Call Notes
            </p>
            <div className="relative">
              <textarea
                id="copilot-note-input"
                rows={2}
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                onKeyDown={handleNoteKeyDown}
                placeholder="Quick notes during the call..."
                className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-2 text-sm text-white placeholder-[rgba(255,255,255,0.3)] resize-none focus:outline-none focus:border-[rgba(255,255,255,0.15)]"
              />
              <span className="absolute right-3 bottom-2.5 text-[10px] font-medium text-[rgba(255,255,255,0.25)] pointer-events-none select-none">
                Enter
              </span>
            </div>
            {notes.length > 0 && (
              <div className="mt-2 space-y-1">
                {notes.map((note, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between gap-2 px-3 py-1.5 rounded-md bg-[rgba(255,255,255,0.03)] group"
                  >
                    <span className="text-xs text-[rgba(255,255,255,0.6)] leading-relaxed">{note}</span>
                    <button
                      onClick={() => setNotes((prev) => prev.filter((_, idx) => idx !== i))}
                      className="shrink-0 mt-0.5 text-[rgba(255,255,255,0.2)] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

SalesCopilot.displayName = "SalesCopilot";

export default SalesCopilot;
