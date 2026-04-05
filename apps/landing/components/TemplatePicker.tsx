"use client";

import { useState } from "react";
import { X, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Variable types ───────────────────────────────────────────────────────────

export type VariableType = "single_select" | "multi_select" | "text_input";

export interface TemplateVariable {
  key: string;           // matches [key] in template
  label: string;         // display label e.g. "What market?"
  type: VariableType;
  options?: { id: string; label: string; sub?: string }[] | string[];
  placeholder?: string;  // for text_input
}

// Normalize options to always be { id, label, sub? }
function normalizeOptions(options?: TemplateVariable["options"]): { id: string; label: string; sub?: string }[] {
  if (!options) return [];
  return options.map(o => typeof o === "string" ? { id: o, label: o } : o);
}

// ── Variable config for canvas prompts ──────────────────────────────────────

export const TEMPLATE_VARIABLES: Record<string, TemplateVariable> = {
  market: {
    key: "market",
    label: "What market?",
    type: "single_select",
    options: [
      { id: "SaaS", label: "B2B SaaS", sub: "Software-as-a-service platforms" },
      { id: "Fintech", label: "Fintech / Finance", sub: "Payments, banking, lending, insurance" },
      { id: "Healthcare", label: "Healthcare / HealthTech", sub: "Digital health, telemedicine, wellness" },
      { id: "E-commerce", label: "E-commerce / DTC", sub: "Online retail, marketplaces, D2C brands" },
      { id: "AI/ML", label: "AI / Machine Learning", sub: "AI-native products, data platforms" },
      { id: "Cybersecurity", label: "Cybersecurity", sub: "Security tools, compliance, identity" },
      { id: "EdTech", label: "EdTech", sub: "Learning platforms, training, upskilling" },
      { id: "Real Estate", label: "Real Estate / PropTech", sub: "Property tech, listings, management" },
    ],
  },
  "Option A": {
    key: "Option A",
    label: "First option",
    type: "text_input",
    placeholder: "e.g. HubSpot, Your Product, etc.",
  },
  "Option B": {
    key: "Option B",
    label: "Second option",
    type: "text_input",
    placeholder: "e.g. Salesforce, Competitor A, etc.",
  },
  "Option C": {
    key: "Option C",
    label: "Third option",
    type: "text_input",
    placeholder: "e.g. Pipedrive, Competitor B, etc.",
  },
};

// ── Extract variables from template string ──────────────────────────────────

export function extractVariables(template: string): TemplateVariable[] {
  const matches = template.match(/\[([^\]]+)\]/g);
  if (!matches) return [];

  const seen = new Set<string>();
  const vars: TemplateVariable[] = [];

  for (const match of matches) {
    const key = match.slice(1, -1);
    if (seen.has(key)) continue;
    seen.add(key);

    const config = TEMPLATE_VARIABLES[key];
    if (config) {
      vars.push(config);
    } else {
      vars.push({
        key,
        label: key,
        type: "text_input",
        placeholder: `Enter ${key.toLowerCase()}...`,
      });
    }
  }

  return vars;
}

// ── Substitute variables in template ────────────────────────────────────────

export function substituteVariables(template: string, values: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`\\[${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\]`, "g"), value);
  }
  return result;
}

// ── Single Select — RadioCard style (matches Ultron Profile wizard) ─────────

function SingleSelect({
  variable,
  value,
  onChange,
}: {
  variable: TemplateVariable;
  value: string;
  onChange: (val: string) => void;
}) {
  const options = normalizeOptions(variable.options);
  return (
    <div>
      <label className="text-xs font-medium text-white/60 mb-2 block">
        {variable.label}
      </label>
      <div className="space-y-1.5">
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all",
                selected
                  ? "border-white/25 bg-white/[0.06]"
                  : "border-white/[0.08] hover:border-white/15 hover:bg-white/[0.03]"
              )}
            >
              {/* Radio circle indicator */}
              <div className={cn(
                "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                selected ? "border-white" : "border-white/20"
              )}>
                {selected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <span className={cn(
                  "text-sm font-medium block",
                  selected ? "text-white" : "text-white/70"
                )}>
                  {option.label}
                </span>
                {option.sub && (
                  <span className="text-xs text-white/40 block mt-0.5">
                    {option.sub}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Multi Select — Chip/Pill style (matches Profile platforms style) ────────

function MultiSelect({
  variable,
  value,
  onChange,
}: {
  variable: TemplateVariable;
  value: string;
  onChange: (val: string) => void;
}) {
  const options = normalizeOptions(variable.options);
  const selected = new Set(value ? value.split(", ") : []);

  const toggle = (optionId: string) => {
    const next = new Set(selected);
    if (next.has(optionId)) next.delete(optionId);
    else next.add(optionId);
    onChange(Array.from(next).join(", "));
  };

  return (
    <div>
      <label className="text-xs font-medium text-white/60 mb-2 block">
        {variable.label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.has(option.id);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => toggle(option.id)}
              className={cn(
                "px-3.5 py-2 rounded-full text-xs border transition-all",
                active
                  ? "border-white/30 bg-white/10 text-white font-medium"
                  : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/80"
              )}
            >
              {active && <Check className="w-3 h-3 inline mr-1 -mt-0.5" />}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Text Input (matches Profile input style) ────────────────────────────────

function TextInput({
  variable,
  value,
  onChange,
}: {
  variable: TemplateVariable;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-white/60 mb-2 block">
        {variable.label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={variable.placeholder}
        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-white/30 transition-colors"
      />
    </div>
  );
}

// ── Main TemplatePicker — inline in chat ─────────────────────────────────────

export default function TemplatePicker({
  variables,
  onSubmit,
  onCancel,
}: {
  variables: TemplateVariable[];
  onSubmit: (values: Record<string, string>) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>({});

  const setValue = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const allFilled = variables.every((v) => {
    const val = values[v.key];
    return val && val.trim().length > 0;
  });

  return (
    <div className="mx-4 mb-2 p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white/60">
          Fill in the details to customize your prompt
        </span>
        <button
          type="button"
          onClick={onCancel}
          className="text-white/30 hover:text-white/60 transition-colors p-1.5 rounded-lg hover:bg-white/[0.06]"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Variable fields */}
      {variables.map((variable) => {
        const val = values[variable.key] || "";

        switch (variable.type) {
          case "single_select":
            return <SingleSelect key={variable.key} variable={variable} value={val} onChange={(v) => setValue(variable.key, v)} />;
          case "multi_select":
            return <MultiSelect key={variable.key} variable={variable} value={val} onChange={(v) => setValue(variable.key, v)} />;
          case "text_input":
            return <TextInput key={variable.key} variable={variable} value={val} onChange={(v) => setValue(variable.key, v)} />;
        }
      })}

      {/* Submit */}
      <button
        type="button"
        onClick={() => onSubmit(values)}
        disabled={!allFilled}
        className={cn(
          "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
          allFilled
            ? "bg-white text-black hover:bg-white/90"
            : "bg-white/[0.04] text-white/25 cursor-not-allowed border border-white/[0.06]"
        )}
      >
        Apply & Send
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
