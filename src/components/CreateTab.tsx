import { useState } from 'react'
import { Sparkles, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Textarea } from './ui/Textarea'
import { Label } from './ui/Label'
import { Badge } from './ui/Badge'
import { suggestDescription, type MetricFormData } from '@/hooks/useAIDescription'

export function CreateTab() {
  const [formData, setFormData] = useState<MetricFormData & {
    metricId: string
    ownersB: string
    ownersT: string
    datasetLink: string
    businessSummary: string
    whenToUse: string
    whenNotToUse: string
    freshnessSLO: string
  }>({
    metricId: '',
    name: '',
    ownersB: '',
    ownersT: '',
    theme: [],
    bu: [],
    datasetLink: '',
    businessSummary: '',
    whenToUse: '',
    whenNotToUse: '',
    formula: '',
    grain: '',
    filters: '',
    freshnessSLO: '',
  })

  const [autoChecks, setAutoChecks] = useState({
    lint: false,
    unit: false,
    slo: false,
    lineage: false,
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Simulate auto-checks updating
    setTimeout(() => {
      setAutoChecks({
        lint: formData.metricId.includes('.') && formData.formula.length > 0,
        unit: formData.formula.length > 10,
        slo: formData.freshnessSLO.length > 0,
        lineage: formData.datasetLink.startsWith('http'),
      })
    }, 100)
  }

  const handleAIImprove = () => {
    const data: MetricFormData = {
      name: formData.name,
      theme: formData.theme,
      bu: formData.bu,
      formula: formData.formula,
      grain: formData.grain,
      filters: formData.filters,
    }

    const suggestions = suggestDescription(data)
    
    setFormData(prev => ({
      ...prev,
      businessSummary: suggestions.businessSummary,
      whenToUse: suggestions.whenToUse,
      whenNotToUse: suggestions.whenNotToUse,
    }))
  }

  const allChecksPass = Object.values(autoChecks).every(Boolean)

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-nuPurple/10 to-nuDeep/10 rounded-2xl p-6 border border-nuPurple/20">
        <h2 className="text-2xl font-semibold mb-2">Create New Metric</h2>
        <p className="text-slate">
          Guided creation with AI-assisted descriptions. All fields are required and auto-checks must pass.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Core metric identification and ownership</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metricId">Metric ID *</Label>
                <Input
                  id="metricId"
                  placeholder="domain.metric_name (e.g., growth.mau)"
                  value={formData.metricId}
                  onChange={(e) => handleInputChange('metricId', e.target.value)}
                  aria-required="true"
                />
                <p className="text-xs text-muted-foreground mt-1">Format: domain.metric_name</p>
              </div>

              <div>
                <Label htmlFor="name">Metric Name *</Label>
                <Input
                  id="name"
                  placeholder="Monthly Active Users"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  aria-required="true"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ownersB">Business Owners *</Label>
                  <Input
                    id="ownersB"
                    placeholder="@owner1, @owner2"
                    value={formData.ownersB}
                    onChange={(e) => handleInputChange('ownersB', e.target.value)}
                    aria-required="true"
                  />
                </div>
                <div>
                  <Label htmlFor="ownersT">Tech Owners *</Label>
                  <Input
                    id="ownersT"
                    placeholder="@tech1, @tech2"
                    value={formData.ownersT}
                    onChange={(e) => handleInputChange('ownersT', e.target.value)}
                    aria-required="true"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="theme">Themes *</Label>
                <Input
                  id="theme"
                  placeholder="Growth, Engagement (comma-separated)"
                  value={formData.theme.join(', ')}
                  onChange={(e) => handleInputChange('theme', e.target.value)}
                  onBlur={(e) => setFormData(prev => ({ ...prev, theme: e.target.value.split(',').map(s => s.trim()) }))}
                  aria-required="true"
                />
              </div>

              <div>
                <Label htmlFor="bu">Business Units *</Label>
                <Input
                  id="bu"
                  placeholder="Retail, Digital (comma-separated)"
                  value={formData.bu.join(', ')}
                  onChange={(e) => handleInputChange('bu', e.target.value)}
                  onBlur={(e) => setFormData(prev => ({ ...prev, bu: e.target.value.split(',').map(s => s.trim()) }))}
                  aria-required="true"
                />
              </div>

              <div>
                <Label htmlFor="datasetLink">Dataset Link *</Label>
                <Input
                  id="datasetLink"
                  type="url"
                  placeholder="https://databricks.com/datasets/..."
                  value={formData.datasetLink}
                  onChange={(e) => handleInputChange('datasetLink', e.target.value)}
                  aria-required="true"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Business Context</CardTitle>
                  <CardDescription>How and when to use this metric</CardDescription>
                </div>
                <Button
                  onClick={handleAIImprove}
                  disabled={!formData.name || !formData.formula}
                  aria-label="Improve description with AI"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Improve Description
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="businessSummary">Business Summary *</Label>
                <Textarea
                  id="businessSummary"
                  placeholder="What does this metric measure?"
                  value={formData.businessSummary}
                  onChange={(e) => handleInputChange('businessSummary', e.target.value)}
                  rows={3}
                  aria-required="true"
                />
              </div>

              <div>
                <Label htmlFor="whenToUse">When to Use *</Label>
                <Textarea
                  id="whenToUse"
                  placeholder="Use cases and scenarios"
                  value={formData.whenToUse}
                  onChange={(e) => handleInputChange('whenToUse', e.target.value)}
                  rows={2}
                  aria-required="true"
                />
              </div>

              <div>
                <Label htmlFor="whenNotToUse">When NOT to Use *</Label>
                <Textarea
                  id="whenNotToUse"
                  placeholder="Limitations and anti-patterns"
                  value={formData.whenNotToUse}
                  onChange={(e) => handleInputChange('whenNotToUse', e.target.value)}
                  rows={2}
                  aria-required="true"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technical Definition</CardTitle>
              <CardDescription>Calculation logic and data requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="formula">Formula *</Label>
                <Textarea
                  id="formula"
                  placeholder="COUNT(DISTINCT user_id) WHERE..."
                  value={formData.formula}
                  onChange={(e) => handleInputChange('formula', e.target.value)}
                  rows={3}
                  className="font-mono text-sm"
                  aria-required="true"
                />
              </div>

              <div>
                <Label htmlFor="grain">Grain / Aggregation Level *</Label>
                <Input
                  id="grain"
                  placeholder="User level, aggregated monthly"
                  value={formData.grain}
                  onChange={(e) => handleInputChange('grain', e.target.value)}
                  aria-required="true"
                />
              </div>

              <div>
                <Label htmlFor="filters">Filters *</Label>
                <Textarea
                  id="filters"
                  placeholder="Exclusions, date ranges, conditions..."
                  value={formData.filters}
                  onChange={(e) => handleInputChange('filters', e.target.value)}
                  rows={2}
                  aria-required="true"
                />
              </div>

              <div>
                <Label htmlFor="freshnessSLO">Freshness SLO *</Label>
                <Input
                  id="freshnessSLO"
                  placeholder="6h, 24h, 3d, 7d"
                  value={formData.freshnessSLO}
                  onChange={(e) => handleInputChange('freshnessSLO', e.target.value)}
                  aria-required="true"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  How fresh must this metric be? (e.g., 6h, 24h, 3d)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Auto-Checks</CardTitle>
              <CardDescription>Live validation status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <CheckItem label="Lint" passed={autoChecks.lint} />
              <CheckItem label="Unit Tests" passed={autoChecks.unit} />
              <CheckItem label="SLO Defined" passed={autoChecks.slo} />
              <CheckItem label="Lineage Link" passed={autoChecks.lineage} />
              
              <div className="pt-4 border-t">
                {allChecksPass ? (
                  <Badge variant="success" className="w-full justify-center py-2">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    All checks passed
                  </Badge>
                ) : (
                  <Badge variant="warning" className="w-full justify-center py-2">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    Complete all checks
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Governance</CardTitle>
              <CardDescription>Guardrails, not gates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                ✓ Changes reviewed within 24h
              </p>
              <p className="text-muted-foreground">
                ✓ Auto-approved if checks pass
              </p>
              <p className="text-muted-foreground">
                ⚠️ Manual review for cross-BU impact
              </p>
              <p className="text-muted-foreground">
                🚨 Blocked only for PII or breaking changes
              </p>
            </CardContent>
          </Card>

          <Button
            className="w-full"
            size="lg"
            disabled={!allChecksPass}
            aria-label="Submit metric for validation"
          >
            Submit for Validation
          </Button>
        </div>
      </div>
    </div>
  )
}

function CheckItem({ label, passed }: { label: string; passed: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      {passed ? (
        <CheckCircle2 className="h-5 w-5 text-green-600" aria-label="Check passed" />
      ) : (
        <XCircle className="h-5 w-5 text-slate" aria-label="Check not passed" />
      )}
    </div>
  )
}

