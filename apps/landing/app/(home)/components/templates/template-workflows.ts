export interface TemplateWorkflow {
  id: string
  name: string
  color: string
  seedPath?: string
  description: string
}

export const TEMPLATE_WORKFLOWS: TemplateWorkflow[] = [
  {
    id: 'tpl-ocr-invoice',
    name: 'OCR Invoice to DB',
    color: '#2ABBF8',
    seedPath: '/landing-page-templates/ocr-invoice-db-d502887e-8750-40a3-a98b-fb2a4e725a4d.json',
    description: 'Extract invoice fields via OCR and insert them directly into your database.',
  },
  {
    id: 'tpl-github-release',
    name: 'GitHub Release Agent',
    color: '#00F701',
    seedPath: '/landing-page-templates/gh-release-agent-d3bed10e-fc87-4fdb-b458-80d8e43757d3.json',
    description: 'Auto-summarize changelogs and post release notes to Slack on every GitHub release.',
  },
  {
    id: 'tpl-meeting-followup',
    name: 'Meeting Follow-up Agent',
    color: '#FFCC02',
    seedPath: '/landing-page-templates/meeting-followup-agent-a2357a2f-67f7-40c1-8e64-301bcd604239.json',
    description: 'Draft and send follow-up emails to attendees automatically after every meeting.',
  },
  {
    id: 'tpl-cv-scanner',
    name: 'CV/Resume Scanner',
    color: '#FA4EDF',
    seedPath: '/landing-page-templates/resume-parser-d083c931-8788-4c6e-814c-0788830e164d.json',
    description: 'Parse resumes with AI and append candidate data to a Google Sheet automatically.',
  },
  {
    id: 'tpl-email-triage',
    name: 'Email Triage Agent',
    color: '#FF6B2C',
    seedPath: '/landing-page-templates/email-triage-57e84f83-c583-4e74-b73a-080d25f2074d.json',
    description: 'Classify incoming emails and route them to Slack or create Linear issues instantly.',
  },
  {
    id: 'tpl-competitor-monitor',
    name: 'Competitor Monitor',
    color: '#6366F1',
    seedPath: '/landing-page-templates/competitor-monitor-52454688-49ae-4279-894a-aa6494f10e3a.json',
    description: 'Daily scrape competitor sites and send a digest to your competitive-intel Slack channel.',
  },
  {
    id: 'tpl-social-listening',
    name: 'Social Listening Agent',
    color: '#F43F5E',
    seedPath: '/landing-page-templates/brand-mention-d2578496-d153-4db1-8ef1-c738cfa94a96.json',
    description: 'Track brand mentions across Reddit and X hourly and log them to Notion.',
  },
  {
    id: 'tpl-data-enrichment',
    name: 'Data Enrichment Pipeline',
    color: '#14B8A6',
    seedPath: '/landing-page-templates/lead-enricher-6ed8dede-1df6-4962-95f4-887abf524b38.json',
    description: 'Enrich lead records with LinkedIn data and update your Google Sheets database.',
  },
  {
    id: 'tpl-feedback-digest',
    name: 'Customer Feedback Digest',
    color: '#F59E0B',
    seedPath: '/landing-page-templates/customer-feedback-digest-2a1c59de-fdcc-4ae0-b448-69a58b36c29a.json',
    description: 'Analyze customer feedback from Airtable daily and post a summary to Slack.',
  },
  {
    id: 'tpl-pr-review',
    name: 'PR Review Agent',
    color: '#06B6D4',
    seedPath: '/landing-page-templates/pr-review-cb5f2d92-a324-4958-8303-4710c572b71d.json',
    description: 'Review pull request code changes and post a summary to your #code-reviews channel.',
  },
  {
    id: 'tpl-knowledge-qa',
    name: 'Knowledge Base QA',
    color: '#84CC16',
    seedPath: '/landing-page-templates/knowledge-base-qa-e9dcd9f1-18bd-4163-b5d8-3e239a297526.json',
    description: 'Answer questions grounded in your knowledge base documents in real time.',
  },
]
