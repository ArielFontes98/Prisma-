import { useState } from 'react'
import { Send, ExternalLink } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Badge } from './ui/Badge'
import { mockMetrics } from '@/mocks/metrics'

interface SlackResponse {
  command: string
  results: Array<{
    id: string
    name: string
    summary: string
    owners: string[]
    datasetLink: string
  }>
}

export function SlackTab() {
  const [command, setCommand] = useState('')
  const [response, setResponse] = useState<SlackResponse | null>(null)

  const handleCommand = () => {
    const trimmed = command.trim()
    
    // Parse command
    if (trimmed.startsWith('/metric find ')) {
      const searchTerm = trimmed.replace('/metric find ', '').toLowerCase()
      const results = mockMetrics
        .filter(m =>
          m.name.toLowerCase().includes(searchTerm) ||
          m.id.toLowerCase().includes(searchTerm) ||
          m.businessSummary.toLowerCase().includes(searchTerm)
        )
        .slice(0, 5)
        .map(m => ({
          id: m.id,
          name: m.name,
          summary: m.businessSummary,
          owners: [...m.owners.business, ...m.owners.tech],
          datasetLink: m.datasetLink,
        }))

      setResponse({
        command: trimmed,
        results,
      })
    } else if (trimmed.startsWith('/metric diff ')) {
      setResponse({
        command: trimmed,
        results: [{
          id: 'example.metric',
          name: 'Example: Version Diff',
          summary: 'v3 → v4: Formula updated, filters changed. Breaking change detected.',
          owners: ['@owner'],
          datasetLink: '#',
        }],
      })
    } else {
      setResponse({
        command: trimmed,
        results: [],
      })
    }
  }

  const exampleCommands = [
    {
      command: '/metric find revenue',
      description: 'Search for canonical metrics by keyword',
    },
    {
      command: '/metric diff growth.mau 2 3',
      description: 'Show differences between versions',
    },
    {
      command: '/metric deprecated',
      description: 'List deprecated metrics and suggested replacements',
    },
    {
      command: '/metric request growth.mau',
      description: 'Request access to a metric dataset',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-nuPurple/10 to-nuDeep/10 rounded-2xl p-6 border border-nuPurple/20">
        <h2 className="text-2xl font-semibold mb-2">Slack Bot Integration</h2>
        <p className="text-slate">
          Interactive demo of Prisma++ Slack bot commands. Find metrics, check diffs, and request access without leaving Slack.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Command Cheatsheet</CardTitle>
              <CardDescription>Available Slack commands</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {exampleCommands.map((cmd, idx) => (
                <div key={idx} className="border-b pb-3 last:border-0">
                  <code className="text-sm bg-muted px-2 py-1 rounded-lg font-mono">
                    {cmd.command}
                  </code>
                  <p className="text-sm text-muted-foreground mt-1">
                    {cmd.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-2">
                <Badge variant="default">1</Badge>
                <div>
                  <p className="font-semibold">Type a command</p>
                  <p className="text-muted-foreground">Use /metric followed by an action</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="default">2</Badge>
                <div>
                  <p className="font-semibold">Get instant results</p>
                  <p className="text-muted-foreground">Bot returns ranked canonicals with metadata</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="default">3</Badge>
                <div>
                  <p className="font-semibold">Open in Consult</p>
                  <p className="text-muted-foreground">Click through for full details and snippets</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Special Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>🔄 <strong>Deprecated alerts:</strong> Auto-suggests canonical replacements</p>
              <p>🔒 <strong>Access requests:</strong> One-click dataset permission flow</p>
              <p>📊 <strong>Usage stats:</strong> See which teams use each metric</p>
              <p>⚡ <strong>Real-time:</strong> Always pulls latest canonical versions</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Try It Out</CardTitle>
              <CardDescription>Simulate Slack bot commands</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="/metric find ..."
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
                    className="font-mono"
                    aria-label="Enter Slack command"
                  />
                  <Button onClick={handleCommand} aria-label="Send command">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {exampleCommands.map((cmd, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start font-mono text-xs"
                      onClick={() => {
                        setCommand(cmd.command)
                        setTimeout(() => {
                          setCommand(cmd.command)
                          // Auto-run the command
                          setTimeout(handleCommand, 100)
                        }, 50)
                      }}
                    >
                      {cmd.command}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {response && (
            <Card>
              <CardHeader>
                <CardTitle>Response</CardTitle>
                <code className="text-xs text-muted-foreground font-mono">
                  {response.command}
                </code>
              </CardHeader>
              <CardContent>
                {response.results.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No results found. Try another command or check the syntax.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {response.results.map((result, idx) => (
                      <div
                        key={idx}
                        className="border rounded-xl p-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-sm">{result.name}</h4>
                            <p className="text-xs text-muted-foreground">{result.id}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // In real app, would navigate to Consult tab with this metric
                              alert('Would open in Consult tab: ' + result.id)
                            }}
                            aria-label="Open in Consult"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs mb-2">{result.summary}</p>
                        <div className="flex flex-wrap gap-1">
                          {result.owners.slice(0, 3).map(owner => (
                            <Badge key={owner} variant="outline" className="text-xs">
                              {owner}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

