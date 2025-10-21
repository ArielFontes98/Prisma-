import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Label } from 'recharts'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card'
import { Badge } from './ui/Badge'

const backlogItems = [
  { id: 1, name: 'Momo Adapter', impact: 9, effort: 5, status: 'in-progress' },
  { id: 2, name: 'QuickSight Adapter', impact: 8, effort: 4, status: 'planned' },
  { id: 3, name: 'Databricks Adapter', impact: 9, effort: 6, status: 'planned' },
  { id: 4, name: 'Slack Bot', impact: 7, effort: 3, status: 'completed' },
  { id: 5, name: 'Validation Queue', impact: 8, effort: 4, status: 'completed' },
  { id: 6, name: 'AI Descriptions', impact: 6, effort: 2, status: 'completed' },
  { id: 7, name: 'Advanced Filters', impact: 5, effort: 2, status: 'completed' },
  { id: 8, name: 'Lineage Graph UI', impact: 7, effort: 7, status: 'backlog' },
  { id: 9, name: 'XP Adapter', impact: 5, effort: 4, status: 'backlog' },
  { id: 10, name: 'KYB Adapter', impact: 4, effort: 4, status: 'backlog' },
  { id: 11, name: 'Auto-deprecation Alerts', impact: 6, effort: 3, status: 'backlog' },
  { id: 12, name: 'Metric Versioning API', impact: 8, effort: 8, status: 'backlog' },
]

const statusColors: Record<string, string> = {
  'completed': '#10b981',
  'in-progress': '#8A05BE',
  'planned': '#f59e0b',
  'backlog': '#94a3b8',
}

export function PrioritizationTab() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-nuPurple/10 to-nuDeep/10 rounded-2xl p-6 border border-nuPurple/20">
        <h2 className="text-2xl font-semibold mb-2">Prioritization</h2>
        <p className="text-slate">
          Impact × Effort framework for deciding what to build next
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Impact vs Effort</CardTitle>
          <CardDescription>Feature prioritization scatter plot</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="effort" name="Effort" domain={[0, 10]}>
                <Label value="Effort (Story Points)" position="bottom" offset={20} />
              </XAxis>
              <YAxis type="number" dataKey="impact" name="Impact" domain={[0, 10]}>
                <Label value="Business Impact" angle={-90} position="left" offset={20} />
              </YAxis>
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-background border rounded-xl p-3 shadow-lg">
                        <p className="font-semibold">{data.name}</p>
                        <p className="text-xs text-muted-foreground">Impact: {data.impact}/10</p>
                        <p className="text-xs text-muted-foreground">Effort: {data.effort}/10</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {data.status}
                        </Badge>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Scatter data={backlogItems} fill="#8A05BE">
                {backlogItems.map((item) => (
                  <Cell key={item.id} fill={statusColors[item.status]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>

          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            <Badge variant="success">
              <span className="inline-block w-2 h-2 rounded-full bg-green-600 mr-2" />
              Completed
            </Badge>
            <Badge variant="default">
              <span className="inline-block w-2 h-2 rounded-full bg-nuPurple mr-2" />
              In Progress
            </Badge>
            <Badge variant="warning">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-2" />
              Planned
            </Badge>
            <Badge variant="outline">
              <span className="inline-block w-2 h-2 rounded-full bg-slate mr-2" />
              Backlog
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feature Backlog</CardTitle>
          <CardDescription>Sorted by impact/effort ratio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {backlogItems
              .map(item => ({ ...item, ratio: item.impact / item.effort }))
              .sort((a, b) => b.ratio - a.ratio)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Badge
                      variant={
                        item.status === 'completed' ? 'success' :
                        item.status === 'in-progress' ? 'default' :
                        item.status === 'planned' ? 'warning' :
                        'outline'
                      }
                      className="min-w-[100px] justify-center"
                    >
                      {item.status}
                    </Badge>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Impact</p>
                      <p className="font-semibold">{item.impact}/10</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Effort</p>
                      <p className="font-semibold">{item.effort}/10</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Ratio</p>
                      <p className="font-semibold text-nuPurple">{item.ratio.toFixed(1)}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prioritization Principles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <h3 className="font-semibold mb-1">🎯 High Impact, Low Effort (Quick Wins)</h3>
            <p className="text-muted-foreground">
              Build first: AI descriptions, advanced filters, Slack bot
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">🚀 High Impact, High Effort (Strategic Bets)</h3>
            <p className="text-muted-foreground">
              Plan carefully: Core adapters (Momo, Databricks), versioning API
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">⚡ Low Impact, Low Effort (Fill-ins)</h3>
            <p className="text-muted-foreground">
              When capacity allows: Domain-specific adapters, nice-to-have UX
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">❌ Low Impact, High Effort (Avoid)</h3>
            <p className="text-muted-foreground">
              Deprioritize: Complex features with narrow use cases
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

