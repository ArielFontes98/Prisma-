import { useState } from 'react'
import { CheckCircle2, Flag, FileText, X } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { Textarea } from './ui/Textarea'
import { Label } from './ui/Label'
import { mockValidationQueue, type ValidationQueueItem } from '@/mocks/metrics'

export function ValidateTab() {
  const [queue, setQueue] = useState(mockValidationQueue)
  const [selectedItem, setSelectedItem] = useState<ValidationQueueItem | null>(null)
  const [showDiffDrawer, setShowDiffDrawer] = useState(false)
  const [flagReason, setFlagReason] = useState('')
  const [showFlagInput, setShowFlagInput] = useState(false)

  const handleApprove = (metricId: string) => {
    setQueue(prev => prev.map(item =>
      item.metricId === metricId
        ? { ...item, status: 'approved' as const }
        : item
    ))
    setShowDiffDrawer(false)
    setSelectedItem(null)
  }

  const handleFlag = (metricId: string) => {
    if (!flagReason) {
      setShowFlagInput(true)
      return
    }
    
    setQueue(prev => prev.map(item =>
      item.metricId === metricId
        ? { ...item, status: 'flagged' as const, flagReason }
        : item
    ))
    setShowDiffDrawer(false)
    setSelectedItem(null)
    setFlagReason('')
    setShowFlagInput(false)
  }

  const openDiff = (item: ValidationQueueItem) => {
    setSelectedItem(item)
    setShowDiffDrawer(true)
    setShowFlagInput(false)
  }

  const pendingCount = queue.filter(item => item.status === 'pending').length

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-nuPurple/10 to-nuDeep/10 rounded-2xl p-6 border border-nuPurple/20">
        <h2 className="text-2xl font-semibold mb-2">Validation Queue</h2>
        <p className="text-slate mb-4">
          Review new and changed metrics. Guardrails, not gates: only block on breaking changes, cross-BU impact, or PII.
        </p>
        <div className="flex items-center gap-4">
          <Badge variant="default" className="text-base px-4 py-2">
            {pendingCount} Pending Review
          </Badge>
          <Badge variant="success" className="text-base px-4 py-2">
            {queue.filter(item => item.status === 'approved').length} Approved
          </Badge>
          <Badge variant="warning" className="text-base px-4 py-2">
            {queue.filter(item => item.status === 'flagged').length} Flagged
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {queue.map((item) => (
          <Card key={item.metricId} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{item.metricName}</h3>
                    <Badge variant={
                      item.status === 'approved' ? 'success' :
                      item.status === 'flagged' ? 'warning' :
                      'default'
                    }>
                      {item.status}
                    </Badge>
                    <Badge variant="outline">
                      {item.changeType}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {item.metricId} • Submitted by {item.submittedBy} • {new Date(item.submittedAt).toLocaleDateString()}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <CheckBadge label="Lint" passed={item.autoChecks.lint} />
                    <CheckBadge label="Unit" passed={item.autoChecks.unit} />
                    <CheckBadge label="SLO" passed={item.autoChecks.slo} />
                    <CheckBadge label="Lineage" passed={item.autoChecks.lineage} />
                    {item.autoChecks.crossBUImpact && (
                      <Badge variant="warning">Cross-BU Impact</Badge>
                    )}
                  </div>

                  {item.flagReason && (
                    <div className="mt-3 p-3 bg-rose rounded-xl">
                      <p className="text-sm text-red-800">
                        <strong>Flag reason:</strong> {item.flagReason}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {item.diff && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDiff(item)}
                      aria-label="View diff"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View Diff
                    </Button>
                  )}
                  
                  {item.status === 'pending' && (
                    <>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleApprove(item.metricId)}
                        aria-label="Approve metric"
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDiff(item)}
                        aria-label="Flag metric for review"
                      >
                        <Flag className="mr-2 h-4 w-4" />
                        Flag
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Diff Drawer */}
      {showDiffDrawer && selectedItem && (
        <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-background shadow-2xl border-l z-50 overflow-y-auto">
          <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{selectedItem.metricName}</h2>
              <p className="text-sm text-muted-foreground">{selectedItem.metricId}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowDiffDrawer(false)
                setSelectedItem(null)
                setShowFlagInput(false)
              }}
              aria-label="Close drawer"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Auto-Checks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <CheckBadge label="Lint" passed={selectedItem.autoChecks.lint} />
                <CheckBadge label="Unit Tests" passed={selectedItem.autoChecks.unit} />
                <CheckBadge label="SLO Freshness" passed={selectedItem.autoChecks.slo} />
                <CheckBadge label="Lineage Link" passed={selectedItem.autoChecks.lineage} />
                {selectedItem.autoChecks.crossBUImpact && (
                  <div className="pt-2">
                    <Badge variant="warning" className="w-full justify-center py-2">
                      ⚠️ Cross-BU Impact Detected
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedItem.diff && selectedItem.diff.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Lineage Deltas</CardTitle>
                  <CardDescription>Changes from previous version</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedItem.diff.map((change, idx) => (
                    <div key={idx} className="border rounded-xl p-4">
                      <p className="font-semibold mb-2 text-sm text-muted-foreground">
                        {change.field}
                      </p>
                      <div className="space-y-2">
                        <div className="bg-rose/50 p-2 rounded-lg">
                          <p className="text-xs text-red-800 mb-1">- Old:</p>
                          <p className="text-sm font-mono">{change.oldValue}</p>
                        </div>
                        <div className="bg-mint/50 p-2 rounded-lg">
                          <p className="text-xs text-green-800 mb-1">+ New:</p>
                          <p className="text-sm font-mono">{change.newValue}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {showFlagInput && (
              <Card>
                <CardHeader>
                  <CardTitle>Flag for Review</CardTitle>
                  <CardDescription>Provide a reason for flagging this metric</CardDescription>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="flagReason">Reason *</Label>
                  <Textarea
                    id="flagReason"
                    placeholder="Describe the issue or concern..."
                    value={flagReason}
                    onChange={(e) => setFlagReason(e.target.value)}
                    rows={4}
                    className="mb-4"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleFlag(selectedItem.metricId)}
                      disabled={!flagReason}
                    >
                      Submit Flag
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowFlagInput(false)
                        setFlagReason('')
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedItem.status === 'pending' && !showFlagInput && (
              <div className="flex gap-3 sticky bottom-0 bg-background pt-4 border-t">
                <Button
                  className="flex-1"
                  size="lg"
                  onClick={() => handleApprove(selectedItem.metricId)}
                  aria-label="Approve and bump version"
                >
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Approve (Version Bump)
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowFlagInput(true)}
                  aria-label="Flag for review"
                >
                  <Flag className="mr-2 h-5 w-5" />
                  Flag
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {showDiffDrawer && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => {
            setShowDiffDrawer(false)
            setSelectedItem(null)
            setShowFlagInput(false)
          }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

function CheckBadge({ label, passed }: { label: string; passed: boolean }) {
  return (
    <Badge variant={passed ? 'success' : 'destructive'}>
      {passed ? '✓' : '✗'} {label}
    </Badge>
  )
}

