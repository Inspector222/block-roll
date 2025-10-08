import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Code, Terminal, Book, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DevelopersPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-balance">Build with BlockRoll</h1>
          <p className="text-xl text-muted-foreground text-balance">
            Integrate decentralized file storage into your applications with our developer-friendly SDK and API
          </p>
        </div>
      </section>

      {/* Integration Options */}
      <section className="py-12 px-4 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="glass-strong rounded-2xl p-8 text-center space-y-4">
              <Code className="w-12 h-12 text-secondary mx-auto" />
              <h3 className="font-serif text-xl font-semibold">SDK</h3>
              <p className="text-sm text-muted-foreground">JavaScript/TypeScript SDK for seamless integration</p>
            </div>
            <div className="glass-strong rounded-2xl p-8 text-center space-y-4">
              <Terminal className="w-12 h-12 text-secondary mx-auto" />
              <h3 className="font-serif text-xl font-semibold">CDN</h3>
              <p className="text-sm text-muted-foreground">Quick integration via CDN script tag</p>
            </div>
            <div className="glass-strong rounded-2xl p-8 text-center space-y-4">
              <Zap className="w-12 h-12 text-secondary mx-auto" />
              <h3 className="font-serif text-xl font-semibold">REST API</h3>
              <p className="text-sm text-muted-foreground">Full-featured REST endpoints for any language</p>
            </div>
          </div>

          {/* SDK Installation */}
          <div className="glass-strong rounded-3xl p-8 md:p-12 mb-8">
            <h2 className="font-serif text-3xl font-bold mb-6">SDK Installation</h2>
            <div className="bg-background/50 rounded-xl p-6 font-mono text-sm mb-6">
              <div className="text-muted-foreground mb-2"># Install via npm</div>
              <div className="text-foreground">npm install @blockroll/sdk</div>
              <div className="text-muted-foreground mt-4 mb-2"># Or via yarn</div>
              <div className="text-foreground">yarn add @blockroll/sdk</div>
            </div>

            <h3 className="font-semibold text-lg mb-4">Quick Start</h3>
            <div className="bg-background/50 rounded-xl p-6 font-mono text-sm overflow-x-auto">
              <pre className="text-foreground">
                {`import { BlockRoll } from '@blockroll/sdk'

// Initialize with your wallet
const blockroll = new BlockRoll({
  walletAddress: '0x...',
  apiKey: 'your-api-key'
})

// Upload a file
const result = await blockroll.upload(file, {
  encryption: 'AES-256',
  access: 'private'
})

// Share with another wallet
await blockroll.share(result.cid, {
  walletAddress: '0x...',
  permissions: 'view',
  expiresIn: '7d'
})`}
              </pre>
            </div>
          </div>

          {/* CDN Integration */}
          <div className="glass-strong rounded-3xl p-8 md:p-12 mb-8">
            <h2 className="font-serif text-3xl font-bold mb-6">CDN Integration</h2>
            <div className="bg-background/50 rounded-xl p-6 font-mono text-sm overflow-x-auto">
              <pre className="text-foreground">
                {` Add to your HTML 
<script src="https://cdn.blockroll.io/sdk.js"></script>

<script>
  const blockroll = new BlockRoll.Client({
    walletAddress: '0x...'
  })
  
  // Ready to use
  blockroll.upload(file)
</script>`}
              </pre>
            </div>
          </div>

          {/* REST API Endpoints */}
          <div className="glass-strong rounded-3xl p-8 md:p-12">
            <h2 className="font-serif text-3xl font-bold mb-6">REST API Endpoints</h2>
            <div className="space-y-4">
              <div className="border border-border rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 bg-secondary/20 text-secondary text-xs font-mono rounded">POST</span>
                  <code className="text-sm">/api/v1/upload</code>
                </div>
                <p className="text-sm text-muted-foreground">Upload and encrypt a file</p>
              </div>
              <div className="border border-border rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 bg-secondary/20 text-secondary text-xs font-mono rounded">POST</span>
                  <code className="text-sm">/api/v1/share</code>
                </div>
                <p className="text-sm text-muted-foreground">Share file access with wallet address</p>
              </div>
              <div className="border border-border rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 bg-secondary/20 text-secondary text-xs font-mono rounded">GET</span>
                  <code className="text-sm">/api/v1/files/:cid</code>
                </div>
                <p className="text-sm text-muted-foreground">Retrieve file metadata and access info</p>
              </div>
              <div className="border border-border rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 bg-secondary/20 text-secondary text-xs font-mono rounded">DELETE</span>
                  <code className="text-sm">/api/v1/access/:cid/:wallet</code>
                </div>
                <p className="text-sm text-muted-foreground">Revoke access for specific wallet</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Book className="mr-2 h-5 w-5" />
              View Full Documentation
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
