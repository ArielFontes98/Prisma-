export interface MetricFormData {
  name: string;
  theme: string[];
  bu: string[];
  formula: string;
  grain: string;
  filters: string;
}

export interface AIDescription {
  businessSummary: string;
  whenToUse: string;
  whenNotToUse: string;
  guardrails: string[];
}

export function suggestDescription(data: MetricFormData): AIDescription {
  const { name, theme, bu, formula, grain, filters } = data;

  // Extract key terms for heuristics
  const nameLower = name.toLowerCase();
  const formulaLower = formula.toLowerCase();
  const themes = theme.join(', ');
  const businessUnits = bu.join(', ');

  // Generate business summary
  let businessSummary = `Measures ${name.toLowerCase()}`;
  
  if (formulaLower.includes('count')) {
    businessSummary = `Counts ${extractMetricSubject(name)}`;
  } else if (formulaLower.includes('sum')) {
    businessSummary = `Calculates total ${extractMetricSubject(name)}`;
  } else if (formulaLower.includes('avg') || formulaLower.includes('average')) {
    businessSummary = `Computes average ${extractMetricSubject(name)}`;
  } else if (formulaLower.includes('rate') || formulaLower.includes('ratio')) {
    businessSummary = `Calculates the rate of ${extractMetricSubject(name)}`;
  }

  if (grain) {
    businessSummary += ` at ${grain} level`;
  }

  if (filters) {
    businessSummary += `. Applies specific filters: ${filters.substring(0, 50)}${filters.length > 50 ? '...' : ''}`;
  }

  // Generate when to use
  const whenToUse = generateWhenToUse(nameLower, themes, businessUnits, formulaLower);

  // Generate when NOT to use
  const whenNotToUse = generateWhenNotToUse(nameLower, formulaLower);

  // Generate guardrails
  const guardrails = generateGuardrails(nameLower, bu, formulaLower);

  return {
    businessSummary,
    whenToUse,
    whenNotToUse,
    guardrails,
  };
}

function extractMetricSubject(name: string): string {
  // Extract the core subject from metric name
  const parts = name.toLowerCase().split(/[\s_-]+/);
  if (parts.length > 1) {
    return parts.slice(1).join(' ');
  }
  return name.toLowerCase();
}

function generateWhenToUse(_name: string, themes: string, bu: string, formula: string): string {
  const useCases: string[] = [];

  // Theme-based suggestions
  if (themes.toLowerCase().includes('revenue') || themes.toLowerCase().includes('monetization')) {
    useCases.push('revenue optimization and pricing analysis');
  }
  if (themes.toLowerCase().includes('engagement') || themes.toLowerCase().includes('growth')) {
    useCases.push('user engagement tracking and growth monitoring');
  }
  if (themes.toLowerCase().includes('risk') || themes.toLowerCase().includes('credit')) {
    useCases.push('risk assessment and portfolio monitoring');
  }
  if (themes.toLowerCase().includes('operations')) {
    useCases.push('operational efficiency and capacity planning');
  }

  // Formula-based suggestions
  if (formula.includes('conversion')) {
    useCases.push('funnel analysis and A/B test evaluation');
  }
  if (formula.includes('retention')) {
    useCases.push('cohort analysis and retention reporting');
  }

  // Default use cases
  if (useCases.length === 0) {
    useCases.push('general analytics and reporting');
    useCases.push('executive dashboards');
  }

  // BU-specific additions
  if (bu) {
    useCases.push(`${bu}-specific strategic decisions`);
  }

  return `Use for ${useCases.slice(0, 3).join(', ')}`;
}

function generateWhenNotToUse(name: string, formula: string): string {
  const restrictions: string[] = [];

  // Monthly/aggregate metrics
  if (name.includes('monthly') || name.includes('mau')) {
    restrictions.push('Do not use for intra-month or daily trends');
  }

  // Average metrics
  if (formula.includes('avg') || name.includes('average')) {
    restrictions.push('Do not use when distribution or percentiles are more relevant');
  }

  // Rate metrics
  if (name.includes('rate') || formula.includes('rate')) {
    restrictions.push('Do not use when absolute numbers are more meaningful');
  }

  // Count metrics
  if (formula.includes('count') && !name.includes('rate')) {
    restrictions.push('Do not use for rate or percentage analysis');
  }

  // Default restrictions
  if (restrictions.length === 0) {
    restrictions.push('Do not use outside the intended business context');
    restrictions.push('Do not use when more granular metrics are available');
  }

  return restrictions.slice(0, 2).join('. ') + '.';
}

function generateGuardrails(name: string, bu: string[], formula: string): string[] {
  const guardrails: string[] = [];

  // Cross-BU impact
  if (bu.length > 1) {
    guardrails.push('⚠️ Cross-BU impact: Changes require approval from all business units');
  }

  // PII considerations
  if (name.includes('user') || name.includes('customer') || formula.includes('user_id')) {
    guardrails.push('🔒 PII present: Ensure proper data governance and access controls');
  }

  // Breaking changes
  if (formula.includes('sum') || formula.includes('count')) {
    guardrails.push('🚨 Breaking change: Modifying aggregation logic requires version bump');
  }

  // Performance considerations
  if (formula.includes('distinct') || formula.toLowerCase().includes('join')) {
    guardrails.push('⚡ Performance: Monitor query performance, may require optimization');
  }

  // Default guardrails
  if (guardrails.length === 0) {
    guardrails.push('✓ Standard governance: Follows canonical metric patterns');
  }

  return guardrails.slice(0, 3);
}

