"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Code, Copy, RefreshCw } from "lucide-react"

export default function SDKIntegrationPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">SDK & Integration</h1>
          <p className="text-muted-foreground">Integrate BlockRoll into your applications</p>
        </div>

        {/* API Key */}
        <Card className="glass-strong p-6">
          <h2 className="font-serif text-2xl font-semibold mb-6">API Key</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="api-key">Your API Key</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="api-key"
                  value="br_live_1234567890abcdef"
                  readOnly
                  className="bg-background/50 font-mono text-sm"
                />
                <Button variant="outline" size="icon" className="glass bg-transparent shrink-0">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="glass bg-transparent shrink-0">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Keep your API key secure. Never share it publicly.</p>
            </div>
          </div>
        </Card>

        {/* Usage Stats */}
        <Card className="glass-strong p-6">
          <h2 className="font-serif text-2xl font-semibold mb-6">Usage Statistics</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Requests</p>
              <p className="text-3xl font-bold">1,247</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">This Month</p>
              <p className="text-3xl font-bold">342</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
              <p className="text-3xl font-bold">99.8%</p>
            </div>
          </div>
        </Card>

        {/* Code Example */}
        <Card className="glass-strong p-6">
          <h2 className="font-serif text-2xl font-semibold mb-6">Quick Start Example</h2>
          <div className="bg-background/50 rounded-xl p-6 font-mono text-sm overflow-x-auto">
            <pre className="text-foreground">
              {`import { BlockRoll } from '@blockroll/sdk'

// Initialize
const blockroll = new BlockRoll({
  apiKey: 'your-api-key',
  walletAddress: '0x...'
})

// Upload a file
const result = await blockroll.upload(file, {
  encryption: 'AES-256',
  access: 'private'
})

console.log('File CID:', result.cid)

// Share with another wallet
await blockroll.share(result.cid, {
  walletAddress: '0x...',
  permissions: 'view',
  expiresIn: '7d'
})`}
            </pre>
          </div>
        </Card>

        {/* Documentation Link */}
        <Card className="glass-strong p-6 text-center">
          <Code className="w-12 h-12 text-secondary mx-auto mb-4" />
          <h3 className="font-serif text-xl font-semibold mb-2">Need More Help?</h3>
          <p className="text-muted-foreground mb-4">Check out our comprehensive documentation</p>
          <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">View Documentation</Button>
        </Card>
      </div>
    </DashboardLayout>
  )
}
