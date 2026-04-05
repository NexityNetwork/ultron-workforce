"use client";

import { useState, useCallback, useRef } from "react";
import {
  X,
  Target,
  TrendingUp,
  Megaphone,
  PenTool,
  DollarSign,
  Rocket,
  Users,
  Zap,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Assessment data — 8 dimensions, 5-6 questions each
// ---------------------------------------------------------------------------

interface AssessmentOption {
  label: string;
  score: number;
}

interface AssessmentQuestion {
  question: string;
  options: AssessmentOption[];
}

interface AssessmentDimension {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  questions: AssessmentQuestion[];
}

const DIMENSIONS: AssessmentDimension[] = [
  {
    id: "icp_positioning",
    title: "ICP & Positioning",
    subtitle: "How well you know and target your ideal customer",
    icon: Target,
    questions: [
      {
        question: "How clearly is your ICP defined?",
        options: [
          { label: "We have no ICP yet", score: 0 },
          { label: "General idea of who we sell to", score: 25 },
          { label: "Documented ICP with firmographics", score: 50 },
          { label: "Validated ICP based on closed deals", score: 75 },
          { label: "Segmented ICPs with playbooks per segment", score: 100 },
        ],
      },
      {
        question: "Is your ICP enforced across the business?",
        options: [
          { label: "Not sure what that means", score: 0 },
          { label: "We know our ICP but everyone does their own thing", score: 25 },
          { label: "Sales follows it, but marketing is generic", score: 50 },
          { label: "Sales and marketing aligned to ICP", score: 75 },
          { label: "Enforced in sales, marketing, content, CRM, and website", score: 100 },
        ],
      },
      {
        question: "How do you position against competitors?",
        options: [
          { label: "We don't have clear positioning", score: 0 },
          { label: "We know our differentiators informally", score: 25 },
          { label: "We have a positioning statement", score: 50 },
          { label: "We have battlecards and competitive playbooks", score: 75 },
          { label: "We own a category", score: 100 },
        ],
      },
      {
        question: "Can you describe your buyer persona in detail?",
        options: [
          { label: "Not really", score: 0 },
          { label: "We know the job title we sell to", score: 25 },
          { label: "Title, pain points, and buying triggers", score: 50 },
          { label: "Documented personas with validated pain points", score: 75 },
          { label: "Persona-specific messaging, content, and sequences", score: 100 },
        ],
      },
      {
        question: "Do you know your TAM/SAM/SOM?",
        options: [
          { label: "No", score: 0 },
          { label: "Rough estimate", score: 25 },
          { label: "Calculated with data", score: 50 },
          { label: "Validated against pipeline data", score: 75 },
          { label: "Updated quarterly with market intelligence", score: 100 },
        ],
      },
    ],
  },
  {
    id: "sales_pipeline",
    title: "Sales & Pipeline",
    subtitle: "Your ability to convert prospects into customers",
    icon: TrendingUp,
    questions: [
      {
        question: "Do you have a repeatable sales motion?",
        options: [
          { label: "No, every deal is different", score: 0 },
          { label: "We have a rough process but it's inconsistent", score: 25 },
          { label: "Documented sales process with clear stages", score: 50 },
          { label: "Repeatable motion with defined playbooks", score: 75 },
          { label: "Optimized motion with data-driven iteration", score: 100 },
        ],
      },
      {
        question: "How structured is your outreach?",
        options: [
          { label: "We don't do outreach yet", score: 0 },
          { label: "Ad-hoc messages when we find prospects", score: 25 },
          { label: "We have email templates we reuse", score: 50 },
          { label: "Multi-step sequences with follow-ups", score: 75 },
          { label: "Automated sequences with A/B testing and tracking", score: 100 },
        ],
      },
      {
        question: "Do you have a discovery call framework?",
        options: [
          { label: "No, we wing it", score: 0 },
          { label: "Some questions we usually ask", score: 25 },
          { label: "Documented question list", score: 50 },
          { label: "Structured framework with qualification criteria", score: 75 },
          { label: "Framework with scoring, objection handling, and next steps", score: 100 },
        ],
      },
      {
        question: "What does your pipeline look like?",
        options: [
          { label: "We don't track pipeline", score: 0 },
          { label: "Spreadsheet or basic list", score: 25 },
          { label: "CRM with defined stages", score: 50 },
          { label: "CRM with conversion tracking per stage", score: 75 },
          { label: "Full pipeline analytics with forecasting", score: 100 },
        ],
      },
      {
        question: "Do you score or qualify leads before engaging?",
        options: [
          { label: "No, we talk to everyone", score: 0 },
          { label: "Basic gut feeling", score: 25 },
          { label: "Simple criteria (company size, industry)", score: 50 },
          { label: "Scoring model based on fit + intent", score: 75 },
          { label: "Automated scoring with enrichment data", score: 100 },
        ],
      },
      {
        question: "What's your average sales cycle?",
        options: [
          { label: "We don't know", score: 0 },
          { label: "It varies wildly, no pattern", score: 20 },
          { label: "We have a rough idea (weeks vs months)", score: 40 },
          { label: "We track it and know the average", score: 70 },
          { label: "We track it per segment and optimize actively", score: 100 },
        ],
      },
    ],
  },
  {
    id: "marketing_gtm",
    title: "Marketing & GTM",
    subtitle: "Your go-to-market strategy and execution",
    icon: Megaphone,
    questions: [
      {
        question: "Do you have a documented GTM strategy?",
        options: [
          { label: "No strategy yet", score: 0 },
          { label: "Ideas in our heads but nothing written", score: 25 },
          { label: "Basic plan documented", score: 50 },
          { label: "Detailed GTM playbook with channels and metrics", score: 75 },
          { label: "Tested and iterated GTM with proven channels", score: 100 },
        ],
      },
      {
        question: "How many channels are you active on?",
        options: [
          { label: "None yet", score: 0 },
          { label: "Trying many things, nothing consistent", score: 20 },
          { label: "1-2 channels with some consistency", score: 50 },
          { label: "1-2 channels performing well", score: 80 },
          { label: "Primary channel optimized, testing expansion", score: 100 },
        ],
      },
      {
        question: "Is your messaging consistent across channels?",
        options: [
          { label: "We don't have defined messaging", score: 0 },
          { label: "Different messages everywhere", score: 25 },
          { label: "Somewhat consistent but not enforced", score: 50 },
          { label: "Consistent messaging framework", score: 75 },
          { label: "Unified messaging adapted per channel and persona", score: 100 },
        ],
      },
      {
        question: "How do you measure marketing effectiveness?",
        options: [
          { label: "We don't measure it", score: 0 },
          { label: "Vanity metrics (followers, likes)", score: 20 },
          { label: "Traffic and lead volume", score: 45 },
          { label: "Attribution from channel to pipeline", score: 75 },
          { label: "Full-funnel attribution with CAC per channel", score: 100 },
        ],
      },
      {
        question: "Do you have a launch playbook?",
        options: [
          { label: "No, we figure it out each time", score: 0 },
          { label: "Basic checklist", score: 25 },
          { label: "Documented launch process", score: 50 },
          { label: "Repeatable playbook with timelines and roles", score: 75 },
          { label: "Battle-tested playbook with post-launch analytics", score: 100 },
        ],
      },
    ],
  },
  {
    id: "content_distribution",
    title: "Content & Distribution",
    subtitle: "How you create and distribute content",
    icon: PenTool,
    questions: [
      {
        question: "Do you publish content regularly?",
        options: [
          { label: "No content yet", score: 0 },
          { label: "Occasionally, when we have time", score: 25 },
          { label: "Weekly on at least one platform", score: 50 },
          { label: "Consistent schedule across platforms", score: 75 },
          { label: "Daily/weekly cadence with batching and planning", score: 100 },
        ],
      },
      {
        question: "Is your content aligned to your ICP?",
        options: [
          { label: "We post generic content", score: 0 },
          { label: "Somewhat relevant to our audience", score: 25 },
          { label: "Targeted to our industry", score: 50 },
          { label: "Speaks directly to ICP pain points", score: 75 },
          { label: "ICP-specific with persona-level targeting", score: 100 },
        ],
      },
      {
        question: "Do you repurpose content across channels?",
        options: [
          { label: "No, one piece per channel", score: 0 },
          { label: "Sometimes we cross-post", score: 25 },
          { label: "We adapt content for 2-3 channels", score: 50 },
          { label: "Systematic repurposing workflow", score: 75 },
          { label: "One idea becomes 5+ pieces across all channels", score: 100 },
        ],
      },
      {
        question: "Do you have a content calendar?",
        options: [
          { label: "No", score: 0 },
          { label: "Loose ideas in notes", score: 25 },
          { label: "Weekly plan in a doc or spreadsheet", score: 50 },
          { label: "Structured calendar with topics, channels, and dates", score: 75 },
          { label: "Calendar with content pillars, distribution plan, and analytics", score: 100 },
        ],
      },
      {
        question: "What's your content-to-lead conversion?",
        options: [
          { label: "We don't track it", score: 0 },
          { label: "We get some inbound but don't know the source", score: 25 },
          { label: "We know which channels drive leads", score: 50 },
          { label: "We track conversion per content piece", score: 75 },
          { label: "Content is a measurable pipeline driver with attribution", score: 100 },
        ],
      },
    ],
  },
  {
    id: "revenue_economics",
    title: "Revenue & Unit Economics",
    subtitle: "Financial health and sustainability",
    icon: DollarSign,
    questions: [
      {
        question: "Do you know your MRR/ARR?",
        options: [
          { label: "Pre-revenue", score: 0 },
          { label: "We have revenue but don't track MRR", score: 25 },
          { label: "We know our MRR", score: 50 },
          { label: "We track MRR with trends and cohorts", score: 75 },
          { label: "Full revenue analytics with expansion, churn, and net revenue", score: 100 },
        ],
      },
      {
        question: "Do you track unit economics (CAC, LTV, payback)?",
        options: [
          { label: "No", score: 0 },
          { label: "Rough idea of what a customer costs to acquire", score: 25 },
          { label: "We know CAC and LTV approximately", score: 50 },
          { label: "We track CAC, LTV, and payback period", score: 75 },
          { label: "Unit economics by segment with optimization targets", score: 100 },
        ],
      },
      {
        question: "Do you have a pricing strategy?",
        options: [
          { label: "We guessed a price", score: 0 },
          { label: "Based on competitor pricing", score: 25 },
          { label: "Value-based with some research", score: 50 },
          { label: "Tested pricing with multiple tiers", score: 75 },
          { label: "Optimized pricing with willingness-to-pay data", score: 100 },
        ],
      },
      {
        question: "What's your burn rate situation?",
        options: [
          { label: "We don't track it", score: 0 },
          { label: "Burning but don't know exact runway", score: 20 },
          { label: "We know our monthly burn and runway", score: 50 },
          { label: "Burn tracked with scenario planning", score: 75 },
          { label: "Efficient burn with clear path to profitability", score: 100 },
        ],
      },
      {
        question: "Do you forecast revenue?",
        options: [
          { label: "No", score: 0 },
          { label: "Rough annual targets", score: 25 },
          { label: "Monthly forecasts based on pipeline", score: 50 },
          { label: "Bottoms-up forecast with assumptions", score: 75 },
          { label: "Rolling forecast updated weekly with actuals", score: 100 },
        ],
      },
    ],
  },
  {
    id: "fundraising",
    title: "Fundraising Readiness",
    subtitle: "How prepared you are to raise capital",
    icon: Rocket,
    questions: [
      {
        question: "Have you raised funding before?",
        options: [
          { label: "No, and not planning to", score: 50 },
          { label: "No, but considering it", score: 25 },
          { label: "Friends and family round", score: 40 },
          { label: "Pre-seed or seed round", score: 70 },
          { label: "Series A or beyond", score: 100 },
        ],
      },
      {
        question: "Do you have a pitch deck?",
        options: [
          { label: "No", score: 0 },
          { label: "Rough draft", score: 25 },
          { label: "Complete deck but untested", score: 50 },
          { label: "Deck that's been through investor feedback", score: 75 },
          { label: "Battle-tested deck with strong conversion", score: 100 },
        ],
      },
      {
        question: "Do you have a data room?",
        options: [
          { label: "No", score: 0 },
          { label: "Some documents scattered around", score: 25 },
          { label: "Basic folder with key documents", score: 50 },
          { label: "Organized data room with financials and metrics", score: 75 },
          { label: "Comprehensive data room ready for due diligence", score: 100 },
        ],
      },
      {
        question: "Do you have investor relationships?",
        options: [
          { label: "No investor network", score: 0 },
          { label: "Know a few investors casually", score: 25 },
          { label: "Active conversations with 5+ investors", score: 50 },
          { label: "Warm intros and ongoing relationships", score: 75 },
          { label: "Strong network with repeat investors interested", score: 100 },
        ],
      },
      {
        question: "Do you know your valuation basis?",
        options: [
          { label: "No idea", score: 0 },
          { label: "Looked at some comparable companies", score: 25 },
          { label: "Have a range based on multiples", score: 50 },
          { label: "Data-backed valuation with comparable analysis", score: 75 },
          { label: "Clear valuation with supporting metrics and terms", score: 100 },
        ],
      },
    ],
  },
  {
    id: "team_operations",
    title: "Team & Operations",
    subtitle: "Organizational maturity and scalability",
    icon: Users,
    questions: [
      {
        question: "How big is your team?",
        options: [
          { label: "Solo founder", score: 10 },
          { label: "2-3 co-founders", score: 30 },
          { label: "Small team (4-10)", score: 50 },
          { label: "Growing team (11-30)", score: 75 },
          { label: "Scaling team (30+)", score: 100 },
        ],
      },
      {
        question: "Do you have documented processes?",
        options: [
          { label: "Nothing documented", score: 0 },
          { label: "Some notes but nothing formal", score: 25 },
          { label: "Key processes written down", score: 50 },
          { label: "SOPs for most operations", score: 75 },
          { label: "Documented, trained, and regularly updated", score: 100 },
        ],
      },
      {
        question: "Are roles clearly defined?",
        options: [
          { label: "Everyone does everything", score: 10 },
          { label: "Rough areas of ownership", score: 30 },
          { label: "Defined roles but lots of overlap", score: 50 },
          { label: "Clear roles with accountability", score: 75 },
          { label: "Org chart with KPIs per role", score: 100 },
        ],
      },
      {
        question: "Do you have an onboarding playbook for new hires?",
        options: [
          { label: "No", score: 0 },
          { label: "We show them around on day one", score: 25 },
          { label: "Basic checklist for first week", score: 50 },
          { label: "Structured 30-60-90 day plan", score: 75 },
          { label: "Full onboarding program with milestones", score: 100 },
        ],
      },
      {
        question: "How do you track team performance?",
        options: [
          { label: "We don't", score: 0 },
          { label: "Informal check-ins", score: 25 },
          { label: "Regular 1:1s with goals", score: 50 },
          { label: "OKRs or KPIs tracked quarterly", score: 75 },
          { label: "Performance framework with reviews and development plans", score: 100 },
        ],
      },
    ],
  },
  {
    id: "growth_scalability",
    title: "Growth & Scalability",
    subtitle: "Your ability to scale beyond founder-led sales",
    icon: Zap,
    questions: [
      {
        question: "What's your month-over-month growth rate?",
        options: [
          { label: "Pre-revenue or flat", score: 0 },
          { label: "Growing but inconsistent", score: 25 },
          { label: "5-10% monthly growth", score: 50 },
          { label: "10-20% monthly growth", score: 75 },
          { label: "20%+ monthly growth consistently", score: 100 },
        ],
      },
      {
        question: "Can you acquire customers without the founder selling?",
        options: [
          { label: "No, founder does all sales", score: 0 },
          { label: "Founder does most, some inbound converts", score: 25 },
          { label: "Sales team handles some deals independently", score: 50 },
          { label: "Most deals close without founder involvement", score: 75 },
          { label: "Fully scalable acquisition engine", score: 100 },
        ],
      },
      {
        question: "Do you have referral or virality mechanics?",
        options: [
          { label: "No", score: 0 },
          { label: "Occasional word-of-mouth", score: 25 },
          { label: "We ask for referrals sometimes", score: 40 },
          { label: "Referral program in place", score: 70 },
          { label: "Built-in virality or strong referral engine", score: 100 },
        ],
      },
      {
        question: "What's your biggest growth bottleneck?",
        options: [
          { label: "Don't know where to start", score: 0 },
          { label: "Not enough leads", score: 25 },
          { label: "Leads but low conversion", score: 40 },
          { label: "Conversion works but can't scale the channel", score: 65 },
          { label: "Scaling well, looking for new levers", score: 90 },
        ],
      },
      {
        question: "Do you have a growth model?",
        options: [
          { label: "No", score: 0 },
          { label: "Rough ideas about what drives growth", score: 25 },
          { label: "Basic funnel math documented", score: 50 },
          { label: "Growth model with inputs, outputs, and levers", score: 75 },
          { label: "Data-driven model updated with actuals", score: 100 },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AssessmentResults {
  dimensions: Record<string, number>; // dimension id → score 0-100
  overallScore: number;
  completedAt: string;
}

interface GrowthAssessmentProps {
  onClose: () => void;
  onComplete?: (results: AssessmentResults) => void;
}

// ---------------------------------------------------------------------------
// Component — inline panel (same position as templates popup)
// ---------------------------------------------------------------------------

export default function GrowthAssessment({
  onClose,
  onComplete,
}: GrowthAssessmentProps) {
  const [dimIndex, setDimIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Record<number, number>>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const transitioning = useRef(false);

  const dimension = DIMENSIONS[dimIndex];
  const question = dimension?.questions[qIndex];

  const totalQuestions = DIMENSIONS.reduce((sum, d) => sum + d.questions.length, 0);

  let currentFlat = 0;
  for (let d = 0; d < dimIndex; d++) {
    currentFlat += DIMENSIONS[d].questions.length;
  }
  currentFlat += qIndex + 1;

  const isLast =
    dimIndex === DIMENSIONS.length - 1 &&
    qIndex === (dimension?.questions.length ?? 1) - 1;

  const goNext = useCallback(() => {
    if (qIndex < dimension.questions.length - 1) {
      setQIndex((q) => q + 1);
    } else if (dimIndex < DIMENSIONS.length - 1) {
      setDimIndex((d) => d + 1);
      setQIndex(0);
    }
  }, [qIndex, dimIndex, dimension]);

  const handleComplete = useCallback(() => {
    const dimensionScores: Record<string, number> = {};
    let totalScore = 0;

    DIMENSIONS.forEach((dim, dIdx) => {
      const dimAnswers = answers[dIdx] || {};
      const questionScores = dim.questions.map((q, qIdx) => {
        const selectedIdx = dimAnswers[qIdx];
        if (selectedIdx === undefined || selectedIdx < 0) return 0;
        return q.options[selectedIdx]?.score ?? 0;
      });
      const avg =
        questionScores.reduce((a, b) => a + b, 0) / dim.questions.length;
      dimensionScores[dim.id] = Math.round(avg);
      totalScore += avg;
    });

    const results: AssessmentResults = {
      dimensions: dimensionScores,
      overallScore: Math.round(totalScore / DIMENSIONS.length),
      completedAt: new Date().toISOString(),
    };

    onComplete?.(results);
  }, [answers, onComplete]);

  // Auto-advance: select option → save → move forward after brief delay
  // Uses a ref guard to prevent rapid double-clicks from corrupting state
  const selectAndAdvance = useCallback(
    (optionIdx: number) => {
      if (transitioning.current) return;
      transitioning.current = true;

      setAnswers((prev) => ({
        ...prev,
        [dimIndex]: {
          ...prev[dimIndex],
          [qIndex]: optionIdx,
        },
      }));

      // Small delay so user sees their selection highlighted
      setTimeout(() => {
        transitioning.current = false;
        if (isLast) {
          // Build results inline since state won't be updated yet
          const updatedAnswers = {
            ...answers,
            [dimIndex]: {
              ...answers[dimIndex],
              [qIndex]: optionIdx,
            },
          };
          const dimensionScores: Record<string, number> = {};
          let totalScore = 0;
          DIMENSIONS.forEach((dim, dIdx) => {
            const dimAnswers = updatedAnswers[dIdx] || {};
            const questionScores = dim.questions.map((q, qi) => {
              const si = dimAnswers[qi];
              if (si === undefined || si < 0) return 0;
              return q.options[si]?.score ?? 0;
            });
            const avg = questionScores.reduce((a, b) => a + b, 0) / dim.questions.length;
            dimensionScores[dim.id] = Math.round(avg);
            totalScore += avg;
          });
          onComplete?.({
            dimensions: dimensionScores,
            overallScore: Math.round(totalScore / DIMENSIONS.length),
            completedAt: new Date().toISOString(),
          });
        } else {
          goNext();
        }
      }, 250);
    },
    [dimIndex, qIndex, isLast, answers, goNext, onComplete],
  );

  // Guard: if indices are out of bounds (e.g. rapid clicks during transition), don't render
  if (!dimension || !question) return null;

  const DimIcon = dimension.icon;
  const progressPercent = Math.round((currentFlat / totalQuestions) * 100);
  const selectedOption = answers[dimIndex]?.[qIndex] ?? -1;

  return (
    <div
      ref={containerRef}
      className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[rgba(255,255,255,0.06)] flex items-center justify-center">
            <DimIcon className="w-3.5 h-3.5 text-[rgba(255,255,255,0.7)]" />
          </div>
          <div>
            <span className="text-sm font-semibold text-white">{dimension.title}</span>
            <span className="text-xs text-[rgba(255,255,255,0.35)] ml-2">
              {currentFlat} of {totalQuestions}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-[rgba(255,255,255,0.3)] hover:text-white transition-colors p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.06)]"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full h-0.5 bg-[rgba(255,255,255,0.06)]">
        <div
          className="h-0.5 bg-white transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question + Options */}
      <div className="px-4 pt-4 pb-3">
        <p className="text-sm text-[rgba(255,255,255,0.6)] mb-3">
          {question.question}
        </p>

        <div className="space-y-1.5 max-h-[320px] overflow-y-auto">
          {question.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            return (
              <button
                key={idx}
                onClick={() => selectAndAdvance(idx)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.06)]"
                    : "border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.03)]"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? "border-white" : "border-[rgba(255,255,255,0.2)]"
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span
                  className={`text-sm font-medium ${
                    isSelected ? "text-white" : "text-[rgba(255,255,255,0.7)]"
                  }`}
                >
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer — dimension dots + skip */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center gap-1.5">
          {DIMENSIONS.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === dimIndex
                  ? "bg-white"
                  : i < dimIndex
                    ? "bg-[rgba(255,255,255,0.35)]"
                    : "bg-[rgba(255,255,255,0.1)]"
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => {
            if (isLast) {
              handleComplete();
            } else {
              goNext();
            }
          }}
          className="text-xs text-[rgba(255,255,255,0.35)] hover:text-[rgba(255,255,255,0.6)] transition-colors"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
