"use client";

import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import { ChevronRight, ChevronDown, ChevronLeft, Check, Loader2, Download, FileSpreadsheet, FileText, File, ImageIcon, Calendar, Tag, Globe, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MarkdownContent from "@/components/MarkdownContent";
// Canvas blocks now render in sidebar — only ref cards shown in chat

// ── Types ────────────────────────────────────────────────────────────────────

export interface ToolEvent {
  id: string;
  name: string;
  input?: string;
  phase: "start" | "end";
  result?: string;
  timestamp: number;
}

export interface ToolActivityGroup {
  id: string;
  description: string;
  tools: ToolEvent[];
  collapsed: boolean;
  status: "running" | "complete";
}

export interface ClaudeCodeMessageProps {
  content: string;
  toolActivity: ToolEvent[];
  isStreaming?: boolean;
  messageId?: string;
  createdAt?: string;
}

// ── Canvas backward-compat (inline parse) ────────────────────────────────────

interface CanvasBlockData {
  type: string;
  title?: string;
  data: Record<string, unknown>;
}

interface ParseResult {
  text: string;
  blocks: CanvasBlockData[];
  streamingRawJson: string | null;
}

function parseCanvasFromContent(content: string): ParseResult {
  const blocks: CanvasBlockData[] = [];
  let textContent = content;
  let streamingRawJson: string | null = null;

  const fenceRegex = /```json\s*\n?([\s\S]*?)```/g;
  let match;
  while ((match = fenceRegex.exec(content)) !== null) {
    try {
      const parsed = JSON.parse(match[1].trim());
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (item.type && item.data) blocks.push(item);
        }
      } else if (parsed.type && parsed.data) {
        blocks.push(parsed);
      }
    } catch {
      /* not valid JSON, skip */
    }
  }

  if (blocks.length > 0) {
    textContent = content.replace(/```json\s*\n?[\s\S]*?```/g, "").trim();
  }

  if (blocks.length === 0) {
    const incompleteMatch = content.match(/```json\s*\n?([\s\S]*)$/);
    if (incompleteMatch) {
      const partial = incompleteMatch[1];
      if (partial.trim().length > 2) {
        streamingRawJson = partial;
        textContent = content.slice(0, incompleteMatch.index).trim();
      }
    }
  }

  return { text: textContent, blocks, streamingRawJson };
}

// ── Segment model: interleave text + tool groups ─────────────────────────────

type Segment =
  | { kind: "text"; content: string }
  | { kind: "prose"; content: string }
  | { kind: "tools"; group: ToolActivityGroup };

/** Returns true for agent narration events (text between tool calls) */
function isTurnEvent(e: ToolEvent): boolean {
  return e.name.endsWith("_turn") || e.name === "turn";
}

/**
 * Friendly label for a tool name.
 * Handles MCP namespacing: mcp__server__tool_name → Tool Name
 */
function formatToolName(name: string): string {
  // Strip mcp__<server>__ prefix
  const mcpMatch = name.match(/^mcp__[^_]+__(.+)$/);
  if (mcpMatch) name = mcpMatch[1];
  // Strip _turn suffix
  name = name.replace(/_turn$/, "");
  return name
    .replace(/__/g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

/**
 * Extract the most meaningful parameter from a JSON input string.
 * Falls back to the raw string if not valid JSON.
 */
function extractInputLabel(input: string | undefined): string | undefined {
  if (!input) return undefined;
  try {
    const obj = JSON.parse(input);
    if (typeof obj !== "object" || obj === null) return String(obj).slice(0, 80);
    // TodoWrite — show task completion summary instead of raw JSON
    if (Array.isArray(obj.todos)) {
      const total = obj.todos.length;
      const done = obj.todos.filter((t: { status?: string }) => t.status === "completed").length;
      return total === 0 ? "0 tasks" : done === total ? `${total} tasks` : `${done}/${total} done`;
    }
    // Priority order of meaningful fields — short/path fields first, large blobs skipped
    const candidates = [
      obj.command, obj.path, obj.file_path, obj.query,
      obj.title, obj.url, obj.pattern, obj.key,
      obj.name, obj.message, obj.task,
    ];
    for (const val of candidates) {
      if (typeof val === "string" && val.trim() && val.length <= 200)
        return val.trim().slice(0, 80);
    }
    // Fallback: first short string value in the object (skip large blobs like content)
    for (const v of Object.values(obj)) {
      if (typeof v === "string" && v.trim() && v.length <= 200)
        return v.trim().slice(0, 80);
    }
  } catch {
    // Not JSON — could be truncated (input is sliced to 200 chars upstream), return nothing
    // to avoid showing raw truncated JSON blobs
    if (input.startsWith("{") || input.startsWith("[")) return undefined;
    return input.replace(/^["']|["']$/g, "").slice(0, 80);
  }
  return undefined;
}

/**
 * Parse TodoWrite input into a structured todo list.
 * Returns null if not a valid TodoWrite payload.
 */
function parseTodos(input: string | undefined): Array<{ content: string; status: string; activeForm?: string }> | null {
  if (!input) return null;
  try {
    const obj = JSON.parse(input);
    if (Array.isArray(obj.todos) && obj.todos.length > 0) return obj.todos;
  } catch { /* truncated or non-JSON */ }
  return null;
}

/**
 * Generate a description for a tool group.
 */
function describeGroup(tools: ToolEvent[]): string {
  if (tools.length === 0) return "Processing";
  const firstTool = tools[0];
  const name = formatToolName(firstTool.name);
  if (tools.length === 1) return name;
  const allSame = tools.every((t) => t.name === firstTool.name);
  if (allSame) return `${name} (${tools.length}x)`;
  return `${name} + ${tools.length - 1} more`;
}

/**
 * Build interleaved segments from markdown content and raw tool events.
 *
 * Tool events between significant prose (>80 chars) are grouped together into
 * one collapsible block. Short/empty turn events (progress pings, one-liners)
 * do NOT flush the bucket — they stay in the current group. This matches the
 * dense, consolidated rendering of Claude Code web (fewer headers, more signal).
 */
function buildSegments(
  content: string,
  toolActivity: ToolEvent[],
  isStreaming: boolean
): Segment[] {
  const segments: Segment[] = [];
  const { text } = parseCanvasFromContent(content);

  if (toolActivity.length === 0) {
    if (text.trim()) segments.push({ kind: "text", content: text });
    return segments;
  }

  const sorted = [...toolActivity].sort((a, b) => a.timestamp - b.timestamp);

  let toolBucket: ToolEvent[] = [];
  let groupIndex = 0;

  const flushToolBucket = () => {
    if (toolBucket.length === 0) return;
    const startIds = new Set(toolBucket.filter((t) => t.phase === "start").map((t) => t.id));
    const endIds = new Set(toolBucket.filter((t) => t.phase === "end").map((t) => t.id));
    const allEnded = Array.from(startIds).every((id) => endIds.has(id));
    const status: "running" | "complete" =
      allEnded && !isStreaming ? "complete" : startIds.size > endIds.size ? "running" : "complete";
    segments.push({
      kind: "tools",
      group: {
        id: `group-${groupIndex++}`,
        description: describeGroup(toolBucket.filter((t) => t.phase === "start")),
        tools: toolBucket,
        collapsed: true,
        status,
      },
    });
    toolBucket = [];
  };

  for (const event of sorted) {
    if (isTurnEvent(event) && event.phase === "start") {
      const prose = event.input?.trim() ?? "";
      // Only flush + surface prose if it's substantive (>80 chars).
      // Short one-liners ("Searching...", progress pings) stay invisible so
      // they don't create a new tool-group boundary.
      if (prose.length > 80) {
        flushToolBucket();
        segments.push({ kind: "prose", content: prose });
      }
    } else if (!isTurnEvent(event)) {
      toolBucket.push(event);
    }
  }
  flushToolBucket();

  // Main text content goes at the bottom (after tool activity)
  if (text.trim()) segments.push({ kind: "text", content: text });

  return segments;
}

// ── Individual tool line ─────────────────────────────────────────────────────

const ToolLine = memo(function ToolLine({
  event,
  showResult,
}: {
  event: ToolEvent;
  showResult: boolean;
}) {
  const isRunning = event.phase === "start";
  const displayName = formatToolName(event.name);
  const inputLabel = extractInputLabel(event.input);
  const isTodoWrite = event.name === "TodoWrite" || event.name === "mcp__ultron__TodoWrite";
  const todos = isTodoWrite ? parseTodos(event.input) : null;

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1.5 pl-5">
        <span className="text-white/35 text-[13px] leading-[22px] select-none">
          └
        </span>
        <span className="font-mono text-[12px] leading-[22px] text-white/80">
          {displayName}
        </span>
        {inputLabel && (
          <>
            <span className="text-white/25 text-[12px]">·</span>
            <span className="font-mono text-[11px] leading-[22px] text-white/55 truncate max-w-[300px]">
              {inputLabel}
            </span>
          </>
        )}
        {isRunning && (
          <Loader2 className="w-3 h-3 text-white/30 animate-spin ml-1 shrink-0" />
        )}
      </div>

      {/* TodoWrite checklist renderer */}
      {showResult && todos && todos.length > 0 && (
        <div className="pl-[38px] mt-1 flex flex-col gap-0.5">
          {todos.map((todo, i) => {
            const isDone = todo.status === "completed";
            const isActive = todo.status === "in_progress";
            return (
              <div key={i} className="flex items-start gap-1.5">
                <span className={`text-[11px] leading-[18px] shrink-0 mt-px ${isDone ? "text-emerald-400/70" : isActive ? "text-amber-400/70" : "text-white/25"}`}>
                  {isDone ? "✓" : isActive ? "→" : "□"}
                </span>
                <div className="flex flex-col">
                  <span className={`text-[11px] leading-[18px] ${isDone ? "text-white/40 line-through" : isActive ? "text-white/70" : "text-white/50"}`}>
                    {todo.content}
                  </span>
                  {isActive && todo.activeForm && todo.activeForm !== todo.content && (
                    <span className="text-[10px] leading-[16px] text-amber-400/50 italic">{todo.activeForm}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Generic result display for non-TodoWrite tools */}
      {showResult && !todos && event.result && (
        <div className="pl-[38px] overflow-hidden">
          <p className="text-[11px] leading-[18px] text-white/40 break-words line-clamp-4">
            {event.result}
          </p>
        </div>
      )}
    </div>
  );
});

// ── Collapsible tool activity group ──────────────────────────────────────────

const ToolActivitySection = memo(function ToolActivitySection({
  group,
}: {
  group: ToolActivityGroup;
}) {
  const [collapsed, setCollapsed] = useState(true);
  const toggle = useCallback(() => setCollapsed((c) => !c), []);

  // Only show "start" events as primary lines (end events provide results)
  const startEvents = useMemo(
    () => group.tools.filter((t) => t.phase === "start"),
    [group.tools]
  );

  // Build a map of end events keyed by id for result lookup
  const endMap = useMemo(() => {
    const map = new Map<string, ToolEvent>();
    for (const t of group.tools) {
      if (t.phase === "end") map.set(t.id, t);
    }
    return map;
  }, [group.tools]);

  // Merge results from end events into start events for display
  const displayEvents = useMemo(
    () =>
      startEvents.map((se) => {
        const endEvent = endMap.get(se.id);
        return endEvent ? { ...se, result: endEvent.result ?? se.result } : se;
      }),
    [startEvents, endMap]
  );

  const toolCount = startEvents.length;
  const isRunning = group.status === "running";

  return (
    <div className="my-2">
      {/* Collapsible header */}
      <button
        onClick={toggle}
        className="flex items-center gap-2 w-full text-left group hover:bg-white/[0.02] rounded-md px-1.5 py-1 -mx-1.5 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5 text-white/40 shrink-0" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-white/40 shrink-0" />
        )}
        <span className="text-[13px] leading-[22px] text-white/80 font-medium truncate">
          {group.description}
        </span>
        {isRunning ? (
          <Loader2 className="w-3 h-3 text-white/30 animate-spin shrink-0 ml-auto" />
        ) : (
          <Check className="w-3 h-3 text-emerald-500/60 shrink-0 ml-auto" />
        )}
      </button>

      {/* Collapsed summary */}
      {collapsed && (
        <div className="pl-[22px] mt-0.5">
          {displayEvents.slice(0, 5).map((event) => {
            const isTodo = event.name === "TodoWrite";
            const todos = isTodo ? parseTodos(event.input) : null;

            // TodoWrite: render as inline checklist (the "plan" view)
            if (todos && todos.length > 0) {
              return (
                <div key={event.id} className="pl-5 mt-1 flex flex-col gap-0.5">
                  {todos.map((todo, i) => {
                    const isDone = todo.status === "completed";
                    const isActive = todo.status === "in_progress";
                    return (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className={`text-[11px] shrink-0 ${isDone ? "text-emerald-400/70" : isActive ? "text-amber-400/70" : "text-white/25"}`}>
                          {isDone ? "✓" : isActive ? "→" : "□"}
                        </span>
                        <span className={`text-[11px] leading-[18px] ${isDone ? "text-white/35 line-through" : isActive ? "text-white/65" : "text-white/50"}`}>
                          {todo.content}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            }

            // All other tools: name + label
            const label = extractInputLabel(event.input);
            return (
              <div key={event.id} className="flex items-center gap-1.5 pl-5">
                <span className="text-white/35 text-[13px] leading-[22px] select-none">└</span>
                <span className="font-mono text-[12px] leading-[22px] text-white/70">
                  {formatToolName(event.name)}
                </span>
                {label && (
                  <>
                    <span className="text-white/20 text-[12px]">·</span>
                    <span className="font-mono text-[11px] leading-[22px] text-white/50 truncate max-w-[240px]">
                      {label}
                    </span>
                  </>
                )}
              </div>
            );
          })}
          {toolCount > 5 && (
            <p className="text-[11px] text-white/50 pl-[30px] mt-0.5">
              +{toolCount - 5} more
            </p>
          )}
          <p className="text-[11px] text-white/55 mt-1 pl-[30px]">
            <span className="bg-white/[0.06] rounded px-1.5 py-0.5">{toolCount} tool call{toolCount !== 1 ? "s" : ""}</span>
          </p>
        </div>
      )}

      {/* Expanded details */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pl-[22px] mt-1 border-l border-white/[0.06] ml-[7px]">
              {displayEvents.map((event) => (
                <ToolLine
                  key={event.id}
                  event={event}
                  showResult={!collapsed}
                />
              ))}
              <div className="h-1.5" />
              <p className="text-[11px] text-white/55 pl-[30px] flex items-center gap-1.5">
                <span className="bg-white/[0.06] rounded px-1.5 py-0.5">{toolCount} tool call{toolCount !== 1 ? "s" : ""}</span>
                {!isRunning && (
                  <span className="text-emerald-500/60 bg-emerald-500/[0.08] rounded px-1.5 py-0.5">
                    complete
                  </span>
                )}
                {isRunning && (
                  <span className="text-amber-400/60 bg-amber-400/[0.08] rounded px-1.5 py-0.5">
                    running
                  </span>
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// ── Canvas streaming preview — granular L-tree ───────────────────────────────

function parseStreamingProgress(rawJson: string): { type: string | null; steps: { label: string; done: boolean }[] } {
  const steps: { label: string; done: boolean }[] = [];
  let type: string | null = null;

  // Try to extract canvas type
  const typeMatch = rawJson.match(/"type"\s*:\s*"([^"]+)"/);
  if (typeMatch) type = typeMatch[1];

  // Extract title
  const titleMatch = rawJson.match(/"title"\s*:\s*"([^"]+)"/);
  if (titleMatch) steps.push({ label: `Title: ${titleMatch[1].slice(0, 50)}`, done: true });

  // Detect major structural keys being built
  const keyPatterns: [RegExp, string][] = [
    [/"entities"\s*:\s*\[/, "Building entities"],
    [/"columns"\s*:\s*\[/, "Structuring columns"],
    [/"rows"\s*:\s*\[/, "Populating rows"],
    [/"sections"\s*:\s*\[/, "Building sections"],
    [/"cards"\s*:\s*\[/, "Creating cards"],
    [/"stages"\s*:\s*\[/, "Mapping stages"],
    [/"events"\s*:\s*\[/, "Adding events"],
    [/"slides"\s*:\s*\[/, "Composing slides"],
    [/"steps"\s*:\s*\[/, "Writing steps"],
    [/"metrics"\s*:\s*\[/, "Calculating metrics"],
    [/"kpis"\s*:\s*\[/, "Loading KPIs"],
    [/"items"\s*:\s*\{/, "Populating items"],
    [/"root"\s*:\s*\{/, "Building tree structure"],
    [/"axes"\s*:\s*\[/, "Setting axes"],
    [/"strengths"\s*:\s*\[/, "Mapping strengths"],
    [/"weaknesses"\s*:\s*\[/, "Mapping weaknesses"],
    [/"opportunities"\s*:\s*\[/, "Mapping opportunities"],
    [/"threats"\s*:\s*\[/, "Mapping threats"],
    [/"data"\s*:\s*\[/, "Loading data points"],
    [/"chart"\s*:\s*\{/, "Rendering chart"],
    [/"breakdown"\s*:\s*\[/, "Building breakdown"],
    [/"inputs"\s*:\s*\{/, "Setting inputs"],
    [/"calculations"\s*:\s*\{/, "Running calculations"],
    [/"quadrants"\s*:\s*\[/, "Mapping quadrants"],
    [/"anchors"\s*:\s*\[/, "Setting anchors"],
    [/"days"\s*:\s*\[/, "Scheduling days"],
  ];

  for (const [regex, label] of keyPatterns) {
    if (regex.test(rawJson)) {
      steps.push({ label, done: true });
    }
  }

  // Count items being generated (array entries)
  const itemMatches = rawJson.match(/\{[^{}]*"(?:name|label|title|heading|question)"\s*:/g);
  if (itemMatches && itemMatches.length > 1) {
    steps.push({ label: `${itemMatches.length} items generated`, done: true });
  }

  // Check for insights
  if (/"insights"\s*:\s*\[/.test(rawJson)) {
    steps.push({ label: "Writing insights", done: true });
  }

  // Check for recommendations
  if (/"recommendations"\s*:\s*\[/.test(rawJson)) {
    steps.push({ label: "Adding recommendations", done: true });
  }

  // Always add a "still building..." step at the end
  steps.push({ label: "Generating...", done: false });

  return { type, steps };
}

function CanvasStreamingIndicator({ rawJson }: { rawJson: string }) {
  const { type, steps } = useMemo(() => parseStreamingProgress(rawJson), [rawJson]);
  const typeLabel = type ? (type.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())) : "Canvas";

  return (
    <div className="my-2 space-y-0.5">
      <div className="flex items-center gap-1.5 text-[12px] text-white/50">
        <Loader2 className="w-3 h-3 animate-spin shrink-0" />
        <span className="font-medium">Building {typeLabel}</span>
      </div>
      <div className="pl-[22px] ml-[7px] space-y-0">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <div key={`${step.label}-${i}`} className="flex items-center gap-1.5">
              <span className="text-white/20 text-[13px] leading-[22px] select-none shrink-0">
                {isLast ? "└" : "├"}
              </span>
              {step.done ? (
                <Check className="w-3 h-3 text-emerald-500/50 shrink-0" />
              ) : (
                <Loader2 className="w-3 h-3 animate-spin text-white/30 shrink-0" />
              )}
              <span className={`text-[12px] leading-[20px] ${step.done ? "text-white/45" : "text-white/30"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Canvas reference card (compact in-chat card pointing to sidebar) ─────────

const CANVAS_TYPE_LABELS: Record<string, string> = {
  comparison_table: "Comparison Table",
  kanban: "Kanban Board",
  score_card: "Score Card",
  content_calendar: "Content Calendar",
  sequence: "Sequence Builder",
  pricing_cards: "Pricing Cards",
  chart: "Chart",
  timeline: "Timeline",
  funnel: "Funnel Chart",
  matrix: "Priority Matrix",
  checklist: "Checklist",
  decision_tree: "Decision Tree",
  swot_grid: "SWOT Grid",
  radar_chart: "Radar Chart",
  carousel: "Carousel",
  metrics_dashboard: "Metrics Dashboard",
  text_cards: "Text Cards",
  data_table: "Data Table",
  structured_doc: "Document",
  positioning_map: "Positioning Map",
  infographic: "Infographic",
  roi_calculator: "ROI Calculator",
  mermaid: "Diagram",
  lead_magnet: "Lead Magnet",
  sales_blueprint: "Sales Blueprint",
  post_call_blueprint: "Post-Call Blueprint",
};

function CanvasRefCard({ block }: { block: CanvasBlockData }) {
  const typeLabel = CANVAS_TYPE_LABELS[block.type] || block.type.replace(/_/g, " ");
  const title = (block.data as Record<string, unknown>).title as string | undefined;

  function openInSidebar() {
    // Dispatch event to switch sidebar to canvas tab
    window.dispatchEvent(new CustomEvent("ultron:show-canvas-tab"));
  }

  return (
    <button
      onClick={openInSidebar}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors text-left group"
    >
      <div className="w-8 h-8 rounded-lg bg-[#DA4E24]/10 flex items-center justify-center shrink-0">
        <ChevronRight className="w-3.5 h-3.5 text-[#DA4E24]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-white/80 truncate">
          {title || typeLabel}
        </p>
        <p className="text-[10px] text-white/35">{typeLabel} - view in Canvas panel</p>
      </div>
    </button>
  );
}

// ── Document download button ────────────────────────────────────────────────

function DocDownloadButton({ payload }: { payload: string }) {
  const [downloading, setDownloading] = useState(false);

  let parsed: { type: string; title: string; content: Record<string, unknown> };
  try {
    parsed = JSON.parse(atob(payload));
  } catch {
    return null;
  }

  const icon = parsed.type === "xlsx" ? <FileSpreadsheet className="w-4 h-4" /> :
               parsed.type === "pdf" ? <File className="w-4 h-4" /> :
               <FileText className="w-4 h-4" />;

  const label = parsed.type.toUpperCase();

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch("/api/generate-doc", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      if (!res.ok) throw new Error(`Generation failed (${res.status})`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.headers.get("Content-Disposition")?.match(/filename="(.+)"/)?.[1] ||
        `${parsed.title}.${parsed.type}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("[DocDownload]", err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[rgba(218,78,36,0.1)] border border-[rgba(218,78,36,0.2)] hover:bg-[rgba(218,78,36,0.15)] transition-colors text-sm text-white group"
    >
      {downloading ? <Loader2 className="w-4 h-4 animate-spin text-[#DA4E24]" /> : icon}
      <span className="font-medium">{parsed.title}</span>
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.5)]">{label}</span>
      <Download className="w-3.5 h-3.5 text-[rgba(255,255,255,0.4)] group-hover:text-[#DA4E24] transition-colors" />
    </button>
  );
}

// ── Deck Carousel component ─────────────────────────────────────────────────

interface DeckSlide {
  index: number;
  image: string; // base64 PNG
  label: string;
}

function DeckCarousel({ payload }: { payload: string }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [downloading, setDownloading] = useState(false);

  let parsed: { title: string; slides: DeckSlide[]; output?: string };
  try {
    parsed = JSON.parse(atob(payload));
  } catch {
    return null;
  }

  if (!parsed.slides?.length) return null;

  const slides = parsed.slides;
  const canPrev = currentSlide > 0;
  const canNext = currentSlide < slides.length - 1;

  async function handleDownloadPdf() {
    setDownloading(true);
    try {
      // Build a PDF from the slide images via the generate-doc endpoint
      // We'll create a custom request with base64 images
      const sections = slides.map((s, i) => ({
        heading: s.label || `Slide ${i + 1}`,
        body: `[Slide image ${i + 1}]`,
      }));

      const res = await fetch("/api/generate-doc", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "pdf",
          title: parsed.title,
          content: { sections, slideImages: slides.map(s => s.image) },
        }),
      });
      if (!res.ok) throw new Error(`PDF generation failed (${res.status})`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${parsed.title.replace(/[^a-zA-Z0-9\s-]/g, "").replace(/\s+/g, "-").toLowerCase()}-deck.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("[DeckPDF]", err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[rgba(255,255,255,0.06)]">
        <span className="text-xs font-medium text-[rgba(255,255,255,0.7)]">{parsed.title}</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[rgba(255,255,255,0.4)]">
            {currentSlide + 1} / {slides.length}
          </span>
          {(parsed.output === "pdf" || parsed.output === "both") && (
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[rgba(218,78,36,0.1)] border border-[rgba(218,78,36,0.2)] hover:bg-[rgba(218,78,36,0.15)] transition-colors text-[10px] text-[#DA4E24]"
            >
              {downloading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
              PDF
            </button>
          )}
        </div>
      </div>

      {/* Slide image */}
      <div className="relative aspect-[16/9] bg-black">
        <img
          src={`data:image/png;base64,${slides[currentSlide].image}`}
          alt={slides[currentSlide].label}
          className="w-full h-full object-contain"
        />

        {/* Navigation arrows */}
        {canPrev && (
          <button
            onClick={() => setCurrentSlide(c => c - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
        )}
        {canNext && (
          <button
            onClick={() => setCurrentSlide(c => c + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 py-2.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === currentSlide
                  ? "bg-[#DA4E24] w-3"
                  : "bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.4)]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Post Wizard Card (rich display for Ultron-created posts) ─────────────────

interface PostWizardData {
  id: string;
  plain_text: string;
  platforms: string[];
  status: string;
  scheduled_at: string | null;
  tags: string[];
  media_urls: string[];
  created_at?: string;
}

const PLATFORM_COLORS: Record<string, string> = {
  x: "#1DA1F2",
  linkedin: "#0A66C2",
  tiktok: "#00F2EA",
  youtube: "#FF0000",
  instagram: "#E4405F",
  discord: "#5865F2",
  telegram: "#26A5E4",
  slack: "#4A154B",
};

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: "rgba(255,255,255,0.06)", text: "rgba(255,255,255,0.6)", label: "Draft" },
  scheduled: { bg: "rgba(59,130,246,0.1)", text: "rgb(96,165,250)", label: "Scheduled" },
  published: { bg: "rgba(34,197,94,0.1)", text: "rgb(74,222,128)", label: "Published" },
  publishing: { bg: "rgba(234,179,8,0.1)", text: "rgb(250,204,21)", label: "Publishing" },
};

function PostWizardCard({ data }: { data: PostWizardData }) {
  const statusStyle = STATUS_STYLES[data.status] || STATUS_STYLES.draft;
  const hasMedia = data.media_urls && data.media_urls.length > 0;

  function openInContentHub() {
    window.open("/dashboard/content", "_blank");
  }

  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] overflow-hidden my-3">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#DA4E24]/15 flex items-center justify-center">
            <Pencil className="w-3 h-3 text-[#DA4E24]" />
          </div>
          <span className="text-xs font-medium text-[rgba(255,255,255,0.8)]">Post Created</span>
        </div>
        <span
          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
          style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
        >
          {statusStyle.label}
        </span>
      </div>

      {/* Body — wizard layout */}
      <div className="flex">
        {/* Left: content */}
        <div className="flex-1 px-4 py-4 min-w-0">
          {/* Post text */}
          <p className="text-sm text-[rgba(255,255,255,0.9)] leading-relaxed whitespace-pre-wrap break-words line-clamp-6">
            {data.plain_text}
          </p>

          {/* Platforms */}
          {data.platforms.length > 0 && (
            <div className="flex items-center gap-1.5 mt-3">
              <Globe className="w-3 h-3 text-[rgba(255,255,255,0.4)]" />
              <div className="flex items-center gap-1">
                {data.platforms.map((p) => (
                  <span
                    key={p}
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: `${PLATFORM_COLORS[p] || "#666"}15`,
                      color: PLATFORM_COLORS[p] || "rgba(255,255,255,0.6)",
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Schedule */}
          {data.scheduled_at && (
            <div className="flex items-center gap-1.5 mt-2">
              <Calendar className="w-3 h-3 text-[rgba(255,255,255,0.4)]" />
              <span className="text-[11px] text-[rgba(255,255,255,0.6)]">
                {new Date(data.scheduled_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
              </span>
            </div>
          )}

          {/* Tags */}
          {data.tags.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <Tag className="w-3 h-3 text-[rgba(255,255,255,0.4)]" />
              {data.tags.map((t) => (
                <span key={t} className="text-[10px] text-[rgba(255,255,255,0.5)] bg-[rgba(255,255,255,0.04)] px-1.5 py-0.5 rounded">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[rgba(255,255,255,0.04)]">
            <button
              onClick={openInContentHub}
              className="text-[11px] font-medium text-[#DA4E24] hover:text-[#E8622C] transition-colors"
            >
              Open in Content Hub →
            </button>
            <span className="text-[10px] text-[rgba(255,255,255,0.3)]">
              ID: {data.id.slice(0, 8)}
            </span>
          </div>
        </div>

        {/* Right: media/asset placeholder */}
        <div className="w-[180px] shrink-0 border-l border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.01)]">
          {hasMedia ? (
            <div className="p-3 space-y-2 h-full">
              {data.media_urls.slice(0, 3).map((url, i) => (
                <div key={i} className="relative rounded-lg overflow-hidden aspect-square bg-black">
                  {url.match(/\.(mp4|mov|webm)/i) ? (
                    <video src={url} muted className="w-full h-full object-cover" />
                  ) : (
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
              ))}
              {data.media_urls.length > 3 && (
                <p className="text-[10px] text-[rgba(255,255,255,0.4)] text-center">
                  +{data.media_urls.length - 3} more
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[160px] gap-2">
              <div className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.04)] flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-[rgba(255,255,255,0.15)]" />
              </div>
              <span className="text-[10px] text-[rgba(255,255,255,0.25)]">No media attached</span>
              <span className="text-[9px] text-[rgba(255,255,255,0.15)]">Add images, videos, or PDFs</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Parse __DOC_DOWNLOAD__ and __DECK_CAROUSEL__ markers from content
function extractInlineMarkers(content: string): {
  cleanContent: string;
  downloads: string[];
  carousels: string[];
  postWizards: PostWizardData[];
} {
  const downloads: string[] = [];
  const carousels: string[] = [];
  const postWizards: PostWizardData[] = [];
  let cleanContent = content;

  cleanContent = cleanContent.replace(/__DOC_DOWNLOAD__([A-Za-z0-9+/=]+)/g, (_, payload) => {
    downloads.push(payload);
    return "";
  });
  cleanContent = cleanContent.replace(/__DECK_CAROUSEL__([A-Za-z0-9+/=]+)/g, (_, payload) => {
    carousels.push(payload);
    return "";
  });
  cleanContent = cleanContent.replace(/__POST_WIZARD__([A-Za-z0-9+/=]+)/g, (_, payload) => {
    try {
      const decoded = JSON.parse(atob(payload)) as PostWizardData;
      postWizards.push(decoded);
    } catch { /* skip invalid */ }
    return "";
  });

  return { cleanContent: cleanContent.trim(), downloads, carousels, postWizards };
}

// ── Main component ───────────────────────────────────────────────────────────

const ClaudeCodeMessage = memo(function ClaudeCodeMessage({
  content,
  toolActivity,
  isStreaming = false,
  messageId,
  createdAt,
}: ClaudeCodeMessageProps) {
  const emittedRef = useRef<Set<string>>(new Set());

  // Extract document download and carousel markers
  const { cleanContent, downloads, carousels, postWizards } = useMemo(
    () => extractInlineMarkers(content),
    [content]
  );

  // Parse canvas blocks for backward compatibility
  const { text, blocks, streamingRawJson } = useMemo(
    () => parseCanvasFromContent(cleanContent),
    [cleanContent]
  );

  // Build interleaved segments
  const segments = useMemo(
    () => buildSegments(cleanContent, toolActivity, isStreaming),
    [cleanContent, toolActivity, isStreaming]
  );

  // Emit deliverable events for completed canvas blocks
  useEffect(() => {
    if (!messageId || blocks.length === 0) return;
    for (const block of blocks) {
      const key = `${messageId}-${block.type}-${block.title || ""}`;
      if (emittedRef.current.has(key)) continue;
      emittedRef.current.add(key);
      window.dispatchEvent(
        new CustomEvent("ultron:deliverable", {
          detail: {
            id: key,
            messageId,
            type: block.type,
            title:
              block.title ||
              block.type
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c: string) => c.toUpperCase()),
            subtitle: "",
            timestamp: createdAt || new Date().toISOString(),
            source: "canvas",
            data: block.data,
          },
        })
      );
    }
  }, [blocks, messageId, createdAt]);

  // If there are no tool events, render the simple version (like existing AssistantMessage)
  if (toolActivity.length === 0) {
    return (
      <div className="space-y-4">
        {text && (
          <div className="text-sm leading-relaxed text-[rgba(255,255,255,0.9)]">
            <MarkdownContent content={text} />
          </div>
        )}
        {downloads.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {downloads.map((dl, i) => <DocDownloadButton key={i} payload={dl} />)}
          </div>
        )}
        {carousels.length > 0 && (
          <div className="space-y-3">
            {carousels.map((c, i) => <DeckCarousel key={i} payload={c} />)}
          </div>
        )}
        {postWizards.length > 0 && (
          <div className="space-y-3">
            {postWizards.map((pw, i) => <PostWizardCard key={pw.id || i} data={pw} />)}
          </div>
        )}
        {streamingRawJson && (
          <CanvasStreamingIndicator rawJson={streamingRawJson} />
        )}
        {blocks.map((block, i) => (
          <CanvasRefCard key={`${block.type}-${i}`} block={block} />
        ))}
      </div>
    );
  }

  // Render interleaved segments
  return (
    <div className="space-y-1">
      {segments.map((segment, i) => {
        if (segment.kind === "text") {
          return (
            <div
              key={`text-${i}`}
              className="text-sm leading-relaxed text-[rgba(255,255,255,0.9)]"
            >
              <MarkdownContent content={segment.content} />
            </div>
          );
        }

        if (segment.kind === "prose") {
          return (
            <div
              key={`prose-${i}`}
              className="text-[13px] leading-[22px] text-white/70 py-0.5 overflow-hidden"
            >
              <MarkdownContent content={segment.content} />
            </div>
          );
        }

        return (
          <ToolActivitySection key={segment.group.id} group={segment.group} />
        );
      })}

      {downloads.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {downloads.map((dl, i) => <DocDownloadButton key={i} payload={dl} />)}
        </div>
      )}

      {postWizards.length > 0 && (
        <div className="space-y-3">
          {postWizards.map((pw, i) => <PostWizardCard key={pw.id || i} data={pw} />)}
        </div>
      )}

      {/* Canvas streaming preview */}
      {streamingRawJson && (
        <CanvasStreamingIndicator rawJson={streamingRawJson} />
      )}
      {blocks.map((block, i) => (
        <CanvasRefCard key={`${block.type}-${i}`} block={block} />
      ))}

    </div>
  );
});

export default ClaudeCodeMessage;
