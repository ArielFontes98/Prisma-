import { CheckCircle2, Circle, Clock } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card'
import { Badge } from './ui/Badge'

const phases = [
  {
    phase: 'Phase 1: Foundation',
    status: 'completed',
    timeline: 'Q3 2024',
    description: 'Core infrastructure and governance workflows',
    items: [
      { name: 'Metric creation form with validation', completed: true },
      { name: 'Auto-checks (lint, unit, SLO, lineage)', completed: true },
      { name: 'Validation queue with approval workflow', completed: true },
      { name: 'AI-assisted descriptions', completed: true },
      { name: 'Basic metric registry (Consult)', completed: true },
      { name: 'Version-pinned snippets (SQL, Python)', completed: true },
    ],
  },
  {
    phase: 'Phase 2: Integration',
    status: 'in-progress',
    timeline: 'Q4 2024',
    description: 'Adapters for key platforms and discoverability',
    items: [
      { name: 'Momo adapter (read + write)', completed: true },
      { name: 'QuickSight adapter (read + write)', completed: false },
      { name: 'Databricks adapter (read + write)', completed: false },
      { name: 'Slack bot with /metric commands', completed: true },
      { name: 'Advanced filters and saved searches', completed: true },
      { name: 'Usage tracking and lineage visualization', completed: false },
    ],
  },
  {
    phase: 'Phase 3: Scale',
    status: 'planned',
    timeline: 'Q1-Q2 2025',
    description: 'Organization-wide adoption and advanced features',
    items: [
      { name: 'XP and KYB adapters', completed: false },
      { name: 'Automated deprecation workflows', completed: false },
      { name: 'Lineage graph UI with impact analysis', completed: false },
      { name: 'Metric versioning API for programmatic access', completed: false },
      { name: 'Cross-BU governance policies', completed: false },
      { name: 'Integration with Looker, Tableau, Mode', completed: false },
    ],
  },
]

export function RoadmapTab() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-nuPurple/10 to-nuDeep/10 rounded-2xl p-6 border border-nuPurple/20">
        <h2 className="text-2xl font-semibold mb-2">Roadmap</h2>
        <p className="text-slate">
          Three-phase rollout: Foundation → Integration → Scale
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {phases.map((phase, idx) => (
          <PhaseCard key={idx} phase={phase} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Success Metrics</CardTitle>
          <CardDescription>How we measure progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-xl">
              <p className="text-2xl font-bold text-nuPurple">85%</p>
              <p className="text-sm text-muted-foreground mt-1">
                Canonical metric adoption in dashboards
              </p>
              <Badge variant="success" className="mt-2">On Track</Badge>
            </div>
            <div className="p-4 border rounded-xl">
              <p className="text-2xl font-bold text-nuPurple">24h</p>
              <p className="text-sm text-muted-foreground mt-1">
                Average metric approval time
              </p>
              <Badge variant="success" className="mt-2">Exceeds Goal</Badge>
            </div>
            <div className="p-4 border rounded-xl">
              <p className="text-2xl font-bold text-nuPurple">150+</p>
              <p className="text-sm text-muted-foreground mt-1">
                Canonical metrics in registry
              </p>
              <Badge variant="default" className="mt-2">Growing</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Design Principles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex gap-3">
            <Badge variant="default" className="h-6">1</Badge>
            <div>
              <p className="font-semibold">Guardrails, not gates</p>
              <p className="text-muted-foreground">
                Block only on breaking changes, cross-BU impact, or PII. Otherwise, guide and review.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Badge variant="default" className="h-6">2</Badge>
            <div>
              <p className="font-semibold">Automate the boring</p>
              <p className="text-muted-foreground">
                AI-assisted descriptions, auto-checks, lineage tracking. Humans focus on judgment calls.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Badge variant="default" className="h-6">3</Badge>
            <div>
              <p className="font-semibold">Meet users where they are</p>
              <p className="text-muted-foreground">
                Slack bot, adapters for existing tools. Don't force workflow changes.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Badge variant="default" className="h-6">4</Badge>
            <div>
              <p className="font-semibold">Version everything</p>
              <p className="text-muted-foreground">
                Metrics evolve. Pin versions for reproducibility, migrate gracefully.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Badge variant="default" className="h-6">5</Badge>
            <div>
              <p className="font-semibold">Transparency builds trust</p>
              <p className="text-muted-foreground">
                Show lineage, usage, owners. Make governance visible, not mysterious.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>✅ <strong>Short term (Next 2 weeks):</strong> Complete QuickSight adapter, launch usage tracking</p>
          <p>🔄 <strong>Medium term (Next quarter):</strong> Databricks adapter, lineage graph UI, XP/KYB adapters</p>
          <p>🎯 <strong>Long term (Next 6 months):</strong> Scale to 500+ canonical metrics, expand to all analytics tools</p>
        </CardContent>
      </Card>
    </div>
  )
}

interface PhaseCardProps {
  phase: {
    phase: string
    status: string
    timeline: string
    description: string
    items: Array<{ name: string; completed: boolean }>
  }
}

function PhaseCard({ phase }: PhaseCardProps) {
  const completedCount = phase.items.filter(item => item.completed).length
  const totalCount = phase.items.length
  const progress = (completedCount / totalCount) * 100

  const statusIcon = {
    completed: <CheckCircle2 className="h-5 w-5 text-green-600" />,
    'in-progress': <Clock className="h-5 w-5 text-nuPurple" />,
    planned: <Circle className="h-5 w-5 text-slate" />,
  }

  const statusBadge = {
    completed: <Badge variant="success">Completed</Badge>,
    'in-progress': <Badge variant="default">In Progress</Badge>,
    planned: <Badge variant="outline">Planned</Badge>,
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {statusIcon[phase.status as keyof typeof statusIcon]}
            <div>
              <CardTitle>{phase.phase}</CardTitle>
              <CardDescription>{phase.description}</CardDescription>
            </div>
          </div>
          <div className="text-right">
            {statusBadge[phase.status as keyof typeof statusBadge]}
            <p className="text-xs text-muted-foreground mt-1">{phase.timeline}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">
              {completedCount} / {totalCount} items
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-nuPurple rounded-full h-2 transition-all"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        <ul className="space-y-2">
          {phase.items.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm">
              {item.completed ? (
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" aria-label="Completed" />
              ) : (
                <Circle className="h-4 w-4 text-slate flex-shrink-0" aria-label="Not completed" />
              )}
              <span className={item.completed ? 'text-muted-foreground' : ''}>
                {item.name}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

