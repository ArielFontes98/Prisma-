import { useState } from 'react'
import { Database, BarChart3, Cloud, Building2, Shield, CheckCircle2, XCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card'
import { Badge } from './ui/Badge'
import { adapters, type Adapter } from '@/mocks/adapters'

const ADAPTER_ICONS: Record<string, React.ReactNode> = {
  momo: <BarChart3 className="h-6 w-6" />,
  quicksight: <BarChart3 className="h-6 w-6" />,
  databricks: <Database className="h-6 w-6" />,
  xp: <Building2 className="h-6 w-6" />,
  kyb: <Shield className="h-6 w-6" />,
}

export function IntegrationsTab() {
  const [adapterStates, setAdapterStates] = useState(adapters)

  const toggleRead = (id: string) => {
    setAdapterStates(prev => ({
      ...prev,
      [id]: { ...prev[id], read: !prev[id].read }
    }))
  }

  const toggleWrite = (id: string) => {
    setAdapterStates(prev => ({
      ...prev,
      [id]: { ...prev[id], write: !prev[id].write }
    }))
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-nuPurple/10 to-nuDeep/10 rounded-2xl p-6 border border-nuPurple/20">
        <h2 className="text-2xl font-semibold mb-2">Integrations & Adapters</h2>
        <p className="text-slate mb-4">
          Configure connectors for lineage tracking and canonical metric enforcement across tools.
        </p>
        <div className="flex gap-3 text-sm">
          <Badge variant="default" className="px-3 py-1">
            <Cloud className="mr-1 h-3 w-3" />
            {Object.values(adapterStates).filter(a => a.read || a.write).length} Active
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.values(adapterStates).map((adapter) => (
          <AdapterCard
            key={adapter.id}
            adapter={adapter}
            icon={ADAPTER_ICONS[adapter.id]}
            onToggleRead={() => toggleRead(adapter.id)}
            onToggleWrite={() => toggleWrite(adapter.id)}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How Adapters Work</CardTitle>
          <CardDescription>The decision loop for data governance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Badge variant="success">Read</Badge>
                Lineage & Usage Tracking
              </h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Discovers which metrics are used where</li>
                <li>• Tracks usage counts (dashboards, experiments)</li>
                <li>• Builds lineage graphs automatically</li>
                <li>• Powers search and discovery in Consult</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Badge variant="default">Write</Badge>
                Canonical Enforcement
              </h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Injects canonical metric IDs into queries</li>
                <li>• Enforces version pinning for reproducibility</li>
                <li>• Prevents ad-hoc definitions from spreading</li>
                <li>• Enables safe metric evolution</li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Impact of Disabled Adapters</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Toggle adapters off to simulate what happens when connections are lost:
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• <strong>Read OFF:</strong> Usage data disappears from Consult, lineage incomplete</li>
              <li>• <strong>Write OFF:</strong> Version pins not applied, warnings shown in snippets</li>
              <li>• Check the <strong>Consult</strong> tab to see adapter warnings in real-time</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prioritization Framework</CardTitle>
          <CardDescription>Which adapters to build first?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Badge variant="success">High</Badge>
              <div>
                <p className="font-semibold">Momo, QuickSight, Databricks</p>
                <p className="text-muted-foreground">
                  Core analytics platforms with highest metric usage and business impact
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="default">Medium</Badge>
              <div>
                <p className="font-semibold">XP, KYB</p>
                <p className="text-muted-foreground">
                  Domain-specific tools with focused use cases but critical for their teams
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline">Future</Badge>
              <div>
                <p className="font-semibold">Additional platforms</p>
                <p className="text-muted-foreground">
                  Looker, Tableau, Mode, Jupyter notebooks, custom APIs
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface AdapterCardProps {
  adapter: Adapter
  icon: React.ReactNode
  onToggleRead: () => void
  onToggleWrite: () => void
}

function AdapterCard({ adapter, icon, onToggleRead, onToggleWrite }: AdapterCardProps) {
  const isActive = adapter.read || adapter.write

  return (
    <Card className={isActive ? 'border-nuPurple/30' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isActive ? 'bg-nuPurple/10 text-nuPurple' : 'bg-muted text-muted-foreground'}`}>
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg">{adapter.name}</CardTitle>
              <CardDescription className="text-xs">{adapter.description}</CardDescription>
            </div>
          </div>
          {isActive && (
            <Badge variant="success" className="text-xs">
              Active
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onToggleRead}
            className={`
              flex items-center justify-between p-3 rounded-xl border-2 transition-all
              ${adapter.read
                ? 'border-green-500 bg-mint hover:bg-mint/80'
                : 'border-slate/30 bg-muted hover:bg-muted/80'
              }
            `}
            aria-label={`Toggle read mode for ${adapter.name}`}
            aria-pressed={adapter.read}
          >
            <div className="text-left">
              <p className="text-xs font-semibold">Read</p>
              <p className="text-xs text-muted-foreground">Lineage</p>
            </div>
            {adapter.read ? (
              <CheckCircle2 className="h-5 w-5 text-green-700" />
            ) : (
              <XCircle className="h-5 w-5 text-slate" />
            )}
          </button>

          <button
            onClick={onToggleWrite}
            className={`
              flex items-center justify-between p-3 rounded-xl border-2 transition-all
              ${adapter.write
                ? 'border-nuPurple bg-nuPurple/10 hover:bg-nuPurple/20'
                : 'border-slate/30 bg-muted hover:bg-muted/80'
              }
            `}
            aria-label={`Toggle write mode for ${adapter.name}`}
            aria-pressed={adapter.write}
          >
            <div className="text-left">
              <p className="text-xs font-semibold">Write</p>
              <p className="text-xs text-muted-foreground">Enforce</p>
            </div>
            {adapter.write ? (
              <CheckCircle2 className="h-5 w-5 text-nuPurple" />
            ) : (
              <XCircle className="h-5 w-5 text-slate" />
            )}
          </button>
        </div>

        <div className="text-xs space-y-1 text-muted-foreground">
          {adapter.read && (
            <p>✓ Tracking usage and building lineage</p>
          )}
          {adapter.write && (
            <p>✓ Enforcing canonical metrics with version pins</p>
          )}
          {!adapter.read && !adapter.write && (
            <p className="text-slate">Adapter disabled</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

