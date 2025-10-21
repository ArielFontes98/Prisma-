import { useState, useMemo } from 'react'
import { Search, Filter, Save, Copy, ExternalLink } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Badge } from './ui/Badge'
import { Modal, ModalHeader, ModalTitle, ModalContent } from './ui/Modal'
import { Toast } from './ui/Toast'
import { mockMetrics, type Metric } from '@/mocks/metrics'
import { adapters } from '@/mocks/adapters'

interface Filters {
  search: string
  themes: string[]
  businessUnits: string[]
  statuses: ('canonical' | 'experimental' | 'deprecated')[]
  freshness: number
  sortBy: 'usage' | 'updated' | 'name'
}

const THEME_OPTIONS = ['Engagement', 'Growth', 'Monetization', 'Revenue', 'Risk', 'Credit', 'Operations', 'Support', 'Conversion', 'Product']
const BU_OPTIONS = ['Retail', 'Digital', 'Business', 'Credit', 'Operations']
const FRESHNESS_OPTIONS = [
  { label: '≤ 6 hours', hours: 6 },
  { label: '≤ 24 hours', hours: 24 },
  { label: '≤ 3 days', hours: 72 },
  { label: '≤ 7 days', hours: 168 },
]

export function ConsultTab() {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    themes: [],
    businessUnits: [],
    statuses: ['canonical', 'experimental'],
    freshness: 168,
    sortBy: 'usage',
  })

  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [savedFilters, setSavedFilters] = useState<Array<{ name: string; filters: Filters }>>([])
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const filteredMetrics = useMemo(() => {
    let results = [...mockMetrics]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      results = results.filter(m =>
        m.id.toLowerCase().includes(searchLower) ||
        m.name.toLowerCase().includes(searchLower) ||
        m.businessSummary.toLowerCase().includes(searchLower)
      )
    }

    // Theme filter
    if (filters.themes.length > 0) {
      results = results.filter(m =>
        m.themes.some(t => filters.themes.includes(t))
      )
    }

    // Business unit filter
    if (filters.businessUnits.length > 0) {
      results = results.filter(m =>
        m.businessUnits.some(bu => filters.businessUnits.includes(bu))
      )
    }

    // Status filter
    if (filters.statuses.length > 0) {
      results = results.filter(m => filters.statuses.includes(m.status))
    }

    // Freshness filter
    const freshnessMap: Record<string, number> = {
      '1h': 1, '3h': 3, '6h': 6, '24h': 24, '3d': 72, '7d': 168
    }
    results = results.filter(m => {
      const sloHours = freshnessMap[m.freshnessSLO] || 168
      return sloHours <= filters.freshness
    })

    // Sort
    if (filters.sortBy === 'usage') {
      results.sort((a, b) => {
        const aTotal = a.usage.dashboards + a.usage.experiments + a.usage.decisions
        const bTotal = b.usage.dashboards + b.usage.experiments + b.usage.decisions
        return bTotal - aTotal
      })
    } else if (filters.sortBy === 'updated') {
      results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    } else {
      results.sort((a, b) => a.name.localeCompare(b.name))
    }

    return results
  }, [filters, mockMetrics])

  const copySnippet = (snippet: string, type: string) => {
    navigator.clipboard.writeText(snippet)
    setToast({ message: `${type} snippet copied!`, type: 'success' })
  }

  const saveCurrentFilters = () => {
    const name = prompt('Name for this filter set:')
    if (name) {
      const newSaved = { name, filters: { ...filters } }
      setSavedFilters(prev => {
        const updated = [...prev, newSaved]
        localStorage.setItem('prisma-saved-filters', JSON.stringify(updated))
        return updated
      })
      setToast({ message: 'Filters saved!', type: 'success' })
    }
  }

  const loadSavedFilter = (saved: { name: string; filters: Filters }) => {
    setFilters(saved.filters)
    setToast({ message: `Loaded "${saved.name}"`, type: 'success' })
  }

  const toggleArrayFilter = (key: 'themes' | 'businessUnits' | 'statuses', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value as never)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value as never]
    }))
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-nuPurple/10 to-nuDeep/10 rounded-2xl p-6 border border-nuPurple/20">
        <h2 className="text-2xl font-semibold mb-2">Consult Canonical Metrics</h2>
        <p className="text-slate">
          Discover and search for approved metrics. Filter by theme, business unit, status, and freshness.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search metrics by ID, name, or description..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10"
              aria-label="Search metrics"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            aria-label="Toggle filters"
            aria-expanded={showFilters}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button
            variant="outline"
            onClick={saveCurrentFilters}
            aria-label="Save current filters"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Filters
          </Button>
        </div>

        {savedFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Saved:</span>
            {savedFilters.map((saved, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="cursor-pointer hover:bg-nuPurple/10"
                onClick={() => loadSavedFilter(saved)}
              >
                {saved.name}
              </Badge>
            ))}
          </div>
        )}

        {showFilters && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Themes</h3>
                <div className="flex flex-wrap gap-2">
                  {THEME_OPTIONS.map(theme => (
                    <Badge
                      key={theme}
                      variant={filters.themes.includes(theme) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleArrayFilter('themes', theme)}
                    >
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Business Units</h3>
                <div className="flex flex-wrap gap-2">
                  {BU_OPTIONS.map(bu => (
                    <Badge
                      key={bu}
                      variant={filters.businessUnits.includes(bu) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleArrayFilter('businessUnits', bu)}
                    >
                      {bu}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Status</h3>
                <div className="flex flex-wrap gap-2">
                  {['canonical', 'experimental', 'deprecated'].map(status => (
                    <Badge
                      key={status}
                      variant={filters.statuses.includes(status as never) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleArrayFilter('statuses', status)}
                    >
                      {status}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Freshness SLO</h3>
                <div className="flex flex-wrap gap-2">
                  {FRESHNESS_OPTIONS.map(opt => (
                    <Badge
                      key={opt.hours}
                      variant={filters.freshness === opt.hours ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setFilters(prev => ({ ...prev, freshness: opt.hours }))}
                    >
                      {opt.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Sort By</h3>
                <div className="flex gap-2">
                  {[
                    { key: 'usage' as const, label: 'Usage' },
                    { key: 'updated' as const, label: 'Recently Updated' },
                    { key: 'name' as const, label: 'Name' }
                  ].map(opt => (
                    <Badge
                      key={opt.key}
                      variant={filters.sortBy === opt.key ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setFilters(prev => ({ ...prev, sortBy: opt.key }))}
                    >
                      {opt.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        Found {filteredMetrics.length} metric{filteredMetrics.length !== 1 ? 's' : ''}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMetrics.map((metric) => (
          <Card
            key={metric.id}
            className="hover:shadow-lg transition-all cursor-pointer"
            onClick={() => setSelectedMetric(metric)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setSelectedMetric(metric)}
            aria-label={`View details for ${metric.name}`}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{metric.name}</CardTitle>
                  <CardDescription className="text-xs truncate">{metric.id}</CardDescription>
                </div>
                <Badge variant={
                  metric.status === 'canonical' ? 'success' :
                  metric.status === 'experimental' ? 'default' :
                  'destructive'
                }>
                  {metric.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {metric.businessSummary}
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                {metric.themes.slice(0, 2).map(theme => (
                  <Badge key={theme} variant="outline" className="text-xs">
                    {theme}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>v{metric.version}</span>
                <span>{metric.usage.dashboards + metric.usage.experiments} uses</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedMetric && (
        <MetricDetailsModal
          metric={selectedMetric}
          onClose={() => setSelectedMetric(null)}
          onCopySnippet={copySnippet}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

function MetricDetailsModal({
  metric,
  onClose,
  onCopySnippet
}: {
  metric: Metric
  onClose: () => void
  onCopySnippet: (snippet: string, type: string) => void
}) {
  const sqlSnippet = `SELECT *\nFROM governed.metric_read('${metric.id}', ${metric.version});`
  const pythonSnippet = `from prisma_lite import metric_read\nm = metric_read("${metric.id}", version=${metric.version})`

  const quicksightWriteActive = adapters.quicksight.write
  const databricksWriteActive = adapters.databricks.write

  return (
    <Modal isOpen={true} onClose={onClose} className="max-w-4xl">
      <ModalHeader>
        <div className="flex items-start justify-between pr-8">
          <div>
            <ModalTitle>{metric.name}</ModalTitle>
            <p className="text-sm text-muted-foreground mt-1">{metric.id} • v{metric.version}</p>
          </div>
          <Badge variant={
            metric.status === 'canonical' ? 'success' :
            metric.status === 'experimental' ? 'default' :
            'destructive'
          }>
            {metric.status}
          </Badge>
        </div>
      </ModalHeader>

      <ModalContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Business Owners</h3>
            <div className="flex gap-1">
              {metric.owners.business.map(owner => (
                <Badge key={owner} variant="outline">{owner}</Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Tech Owners</h3>
            <div className="flex gap-1">
              {metric.owners.tech.map(owner => (
                <Badge key={owner} variant="outline">{owner}</Badge>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Business Summary</h3>
          <p className="text-sm">{metric.businessSummary}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">When to Use</h3>
            <p className="text-sm">{metric.whenToUse}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">When NOT to Use</h3>
            <p className="text-sm">{metric.whenNotToUse}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Formula</h3>
          <pre className="text-sm bg-muted p-3 rounded-xl overflow-x-auto">
            {metric.formula}
          </pre>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Grain</h3>
            <p className="text-sm">{metric.grain}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Freshness SLO</h3>
            <Badge variant="success">{metric.freshnessSLO}</Badge>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Dataset Link</h3>
          <a
            href={metric.datasetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-nuPurple hover:underline flex items-center gap-1"
          >
            {metric.datasetLink}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Usage</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-muted rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-nuPurple">{metric.usage.dashboards}</p>
              <p className="text-xs text-muted-foreground">Dashboards</p>
            </div>
            <div className="bg-muted rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-nuPurple">{metric.usage.experiments}</p>
              <p className="text-xs text-muted-foreground">Experiments</p>
            </div>
            <div className="bg-muted rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-nuPurple">{metric.usage.decisions}</p>
              <p className="text-xs text-muted-foreground">Decisions</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Version-Pinned Snippets</h3>
          
          {!quicksightWriteActive && (
            <div className="mb-2 p-2 bg-rose/50 rounded-xl text-xs text-red-800">
              ⚠️ QuickSight write adapter is disabled - version pinning not applied
            </div>
          )}
          {!databricksWriteActive && (
            <div className="mb-2 p-2 bg-rose/50 rounded-xl text-xs text-red-800">
              ⚠️ Databricks write adapter is disabled - version pinning not applied
            </div>
          )}

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold">SQL</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCopySnippet(sqlSnippet, 'SQL')}
                  aria-label="Copy SQL snippet"
                >
                  <Copy className="mr-1 h-3 w-3" />
                  Copy
                </Button>
              </div>
              <pre className="text-xs bg-muted p-3 rounded-xl overflow-x-auto">
                {sqlSnippet}
              </pre>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold">Python</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCopySnippet(pythonSnippet, 'Python')}
                  aria-label="Copy Python snippet"
                >
                  <Copy className="mr-1 h-3 w-3" />
                  Copy
                </Button>
              </div>
              <pre className="text-xs bg-muted p-3 rounded-xl overflow-x-auto">
                {pythonSnippet}
              </pre>
            </div>
          </div>
        </div>

        <div className="flex gap-2 text-xs text-muted-foreground">
          <span>Created: {new Date(metric.createdAt).toLocaleDateString()}</span>
          <span>•</span>
          <span>Updated: {new Date(metric.updatedAt).toLocaleDateString()}</span>
        </div>
      </ModalContent>
    </Modal>
  )
}

