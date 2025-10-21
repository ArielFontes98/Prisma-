export interface Metric {
  id: string;
  name: string;
  domain: string;
  owners: {
    business: string[];
    tech: string[];
  };
  themes: string[];
  businessUnits: string[];
  datasetLink: string;
  businessSummary: string;
  whenToUse: string;
  whenNotToUse: string;
  formula: string;
  grain: string;
  filters: string;
  freshnessSLO: string;
  version: number;
  status: 'canonical' | 'experimental' | 'deprecated';
  autoChecks: {
    lint: boolean;
    unit: boolean;
    slo: boolean;
    lineage: boolean;
  };
  usage: {
    dashboards: number;
    experiments: number;
    decisions: number;
  };
  createdAt: string;
  updatedAt: string;
}

export const mockMetrics: Metric[] = [
  {
    id: 'growth.mau',
    name: 'Monthly Active Users',
    domain: 'growth',
    owners: {
      business: ['@ana.silva', '@pedro.costa'],
      tech: ['@carlos.santos'],
    },
    themes: ['Engagement', 'Growth'],
    businessUnits: ['Retail', 'Digital'],
    datasetLink: 'https://databricks.com/datasets/growth_metrics',
    businessSummary: 'Counts unique users who performed at least one meaningful action in the last 30 days',
    whenToUse: 'Use for monthly retention analysis, growth tracking, and executive reporting',
    whenNotToUse: 'Do not use for intra-month trends (use DAU instead) or for specific feature adoption',
    formula: 'COUNT(DISTINCT user_id) WHERE activity_date >= CURRENT_DATE - 30',
    grain: 'User level, aggregated monthly',
    filters: 'Excludes internal users, test accounts, and suspended accounts',
    freshnessSLO: '24h',
    version: 3,
    status: 'canonical',
    autoChecks: {
      lint: true,
      unit: true,
      slo: true,
      lineage: true,
    },
    usage: {
      dashboards: 42,
      experiments: 15,
      decisions: 8,
    },
    createdAt: '2024-01-15',
    updatedAt: '2024-10-01',
  },
  {
    id: 'revenue.arpu',
    name: 'Average Revenue Per User',
    domain: 'revenue',
    owners: {
      business: ['@julia.martinez'],
      tech: ['@fernando.alves'],
    },
    themes: ['Monetization', 'Revenue'],
    businessUnits: ['Retail', 'Business'],
    datasetLink: 'https://databricks.com/datasets/revenue_metrics',
    businessSummary: 'Average monthly revenue generated per active user',
    whenToUse: 'Use for pricing analysis, revenue optimization, and cohort comparisons',
    whenNotToUse: 'Do not use when total revenue is more relevant, or for non-subscription products',
    formula: 'SUM(revenue) / COUNT(DISTINCT active_users)',
    grain: 'User level, aggregated monthly',
    filters: 'Includes only completed transactions, excludes refunds and chargebacks',
    freshnessSLO: '6h',
    version: 5,
    status: 'canonical',
    autoChecks: {
      lint: true,
      unit: true,
      slo: true,
      lineage: true,
    },
    usage: {
      dashboards: 28,
      experiments: 22,
      decisions: 12,
    },
    createdAt: '2023-11-10',
    updatedAt: '2024-09-15',
  },
  {
    id: 'credit.default_rate',
    name: 'Credit Default Rate',
    domain: 'credit',
    owners: {
      business: ['@ricardo.mendes'],
      tech: ['@lucia.rodrigues'],
    },
    themes: ['Risk', 'Credit'],
    businessUnits: ['Credit'],
    datasetLink: 'https://databricks.com/datasets/credit_risk',
    businessSummary: 'Percentage of credit accounts that are 90+ days past due',
    whenToUse: 'Use for risk assessment, portfolio health monitoring, and regulatory reporting',
    whenNotToUse: 'Do not use for early delinquency tracking (use 30+ DPD instead)',
    formula: 'COUNT(accounts WHERE days_past_due >= 90) / COUNT(total_active_accounts)',
    grain: 'Account level, aggregated daily',
    filters: 'Excludes closed accounts and accounts in forbearance',
    freshnessSLO: '24h',
    version: 2,
    status: 'canonical',
    autoChecks: {
      lint: true,
      unit: true,
      slo: true,
      lineage: true,
    },
    usage: {
      dashboards: 18,
      experiments: 5,
      decisions: 15,
    },
    createdAt: '2024-03-20',
    updatedAt: '2024-10-10',
  },
  {
    id: 'product.conversion_rate',
    name: 'Product Conversion Rate',
    domain: 'product',
    owners: {
      business: ['@marina.costa'],
      tech: ['@diego.silva'],
    },
    themes: ['Conversion', 'Product'],
    businessUnits: ['Digital', 'Retail'],
    datasetLink: 'https://databricks.com/datasets/funnel_metrics',
    businessSummary: 'Percentage of users who complete a target action after viewing the product',
    whenToUse: 'Use for funnel optimization, A/B test evaluation, and product performance tracking',
    whenNotToUse: 'Do not use for multi-step funnels (use step-specific conversion instead)',
    formula: 'COUNT(conversions) / COUNT(product_views)',
    grain: 'User-product interaction level',
    filters: 'Excludes bot traffic and internal users',
    freshnessSLO: '3h',
    version: 1,
    status: 'experimental',
    autoChecks: {
      lint: true,
      unit: true,
      slo: false,
      lineage: true,
    },
    usage: {
      dashboards: 12,
      experiments: 8,
      decisions: 3,
    },
    createdAt: '2024-09-01',
    updatedAt: '2024-10-15',
  },
  {
    id: 'operations.support_tickets',
    name: 'Support Tickets Volume',
    domain: 'operations',
    owners: {
      business: ['@beatriz.santos'],
      tech: ['@rafael.oliveira'],
    },
    themes: ['Operations', 'Support'],
    businessUnits: ['Operations'],
    datasetLink: 'https://databricks.com/datasets/support_metrics',
    businessSummary: 'Total number of customer support tickets created',
    whenToUse: 'Use for capacity planning, support quality monitoring, and operational reporting',
    whenNotToUse: 'Do not use for resolution metrics (use Time to Resolution instead)',
    formula: 'COUNT(ticket_id) WHERE created_at >= start_date',
    grain: 'Ticket level, aggregated daily',
    filters: 'Includes all ticket types and channels',
    freshnessSLO: '1h',
    version: 4,
    status: 'canonical',
    autoChecks: {
      lint: true,
      unit: true,
      slo: true,
      lineage: true,
    },
    usage: {
      dashboards: 35,
      experiments: 2,
      decisions: 20,
    },
    createdAt: '2023-08-05',
    updatedAt: '2024-09-30',
  },
];

export interface ValidationQueueItem {
  metricId: string;
  metricName: string;
  status: 'pending' | 'approved' | 'flagged';
  submittedBy: string;
  submittedAt: string;
  changeType: 'new' | 'update' | 'deprecation';
  autoChecks: {
    lint: boolean;
    unit: boolean;
    slo: boolean;
    lineage: boolean;
    crossBUImpact: boolean;
  };
  diff?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
  flagReason?: string;
}

export const mockValidationQueue: ValidationQueueItem[] = [
  {
    metricId: 'engagement.session_duration',
    metricName: 'Average Session Duration',
    status: 'pending',
    submittedBy: '@maria.santos',
    submittedAt: '2024-10-20T14:30:00Z',
    changeType: 'new',
    autoChecks: {
      lint: true,
      unit: true,
      slo: true,
      lineage: true,
      crossBUImpact: false,
    },
  },
  {
    metricId: 'revenue.arpu',
    metricName: 'Average Revenue Per User',
    status: 'pending',
    submittedBy: '@fernando.alves',
    submittedAt: '2024-10-19T10:15:00Z',
    changeType: 'update',
    autoChecks: {
      lint: true,
      unit: true,
      slo: true,
      lineage: true,
      crossBUImpact: true,
    },
    diff: [
      {
        field: 'formula',
        oldValue: 'SUM(revenue) / COUNT(DISTINCT users)',
        newValue: 'SUM(revenue) / COUNT(DISTINCT active_users)',
      },
      {
        field: 'filters',
        oldValue: 'Includes all transactions',
        newValue: 'Includes only completed transactions, excludes refunds',
      },
    ],
  },
  {
    metricId: 'legacy.old_metric',
    metricName: 'Legacy Engagement Metric',
    status: 'pending',
    submittedBy: '@admin',
    submittedAt: '2024-10-18T09:00:00Z',
    changeType: 'deprecation',
    autoChecks: {
      lint: true,
      unit: true,
      slo: true,
      lineage: true,
      crossBUImpact: false,
    },
  },
];

