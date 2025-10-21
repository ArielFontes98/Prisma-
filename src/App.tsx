import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/Tabs'
import { CreateTab } from './components/CreateTab'
import { ValidateTab } from './components/ValidateTab'
import { ConsultTab } from './components/ConsultTab'
import { SlackTab } from './components/SlackTab'
import { IntegrationsTab } from './components/IntegrationsTab'
import { PrioritizationTab } from './components/PrioritizationTab'
import { RoadmapTab } from './components/RoadmapTab'

function App() {
  const [activeTab, setActiveTab] = useState('consult')

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-nuPurple to-nuDeep">
              <span className="text-white font-bold text-xl">P+</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Prisma++</h1>
              <p className="text-xs text-muted-foreground">Data Governance @ Nubank</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ArielFontes98/Prisma-"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 md:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="mb-8">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="create">Create</TabsTrigger>
              <TabsTrigger value="validate">Validate</TabsTrigger>
              <TabsTrigger value="consult">Consult</TabsTrigger>
              <TabsTrigger value="slack">Slack</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="prioritization">Prioritization</TabsTrigger>
              <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="create">
            <CreateTab />
          </TabsContent>

          <TabsContent value="validate">
            <ValidateTab />
          </TabsContent>

          <TabsContent value="consult">
            <ConsultTab />
          </TabsContent>

          <TabsContent value="slack">
            <SlackTab />
          </TabsContent>

          <TabsContent value="integrations">
            <IntegrationsTab />
          </TabsContent>

          <TabsContent value="prioritization">
            <PrioritizationTab />
          </TabsContent>

          <TabsContent value="roadmap">
            <RoadmapTab />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container px-4 md:px-8 py-6 text-center text-sm text-muted-foreground">
          <p>
            Built with React, TypeScript, Tailwind CSS, and shadcn/ui
          </p>
          <p className="mt-1">
            Prisma++ • Nubank Data Governance • 2024
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App

