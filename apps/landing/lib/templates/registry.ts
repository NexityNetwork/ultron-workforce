export interface TemplateVariable {
  key: string;
  label: string;
  type: 'single_select' | 'multi_select' | 'text_input';
  options?: string[];
  default?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'sales' | 'marketing' | 'content' | 'financials' | 'fundraising';
  icon: string;
  canvasType: string;
  variables?: TemplateVariable[];
  defaultData: Record<string, unknown>;
}

export const TEMPLATE_REGISTRY: Template[] = [];

export function registerTemplate(template: Template): void {
  const existing = TEMPLATE_REGISTRY.findIndex((t) => t.id === template.id);
  if (existing !== -1) {
    TEMPLATE_REGISTRY[existing] = template;
  } else {
    TEMPLATE_REGISTRY.push(template);
  }
}

export function getTemplateById(id: string): Template | undefined {
  return TEMPLATE_REGISTRY.find((t) => t.id === id);
}

export function getTemplatesByCategory(
  category: Template['category']
): Template[] {
  return TEMPLATE_REGISTRY.filter((t) => t.category === category);
}
