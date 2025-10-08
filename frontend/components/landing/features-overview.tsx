import { Shield, Users, AlertTriangle, Sparkles, Code } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Shield,
    title: "SafeVault",
    description: "Private encrypted storage with military-grade security for your most sensitive files",
  },
  {
    icon: Users,
    title: "Team Workspace",
    description: "Collaborate securely with role-based permissions and shared vaults",
  },
  {
    icon: AlertTriangle,
    title: "Emergency Access Mode",
    description: "Designate trusted wallets to access your files during inactivity periods",
  },
  {
    icon: Sparkles,
    title: "AI Guardian",
    description: "Intelligent security monitoring that detects suspicious access patterns",
  },
  {
    icon: Code,
    title: "SDK & Integration",
    description: "Developer-friendly APIs and SDKs for seamless integration into your apps",
  },
]

export function FeaturesOverview() {
  return (
    <section className="py-24 px-4 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground text-lg">Everything you need for secure file management</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="glass-strong rounded-2xl p-8 space-y-4 hover:bg-card/50 transition-colors">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/20">
                <feature.icon className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-serif text-xl font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              <Button variant="link" className="p-0 h-auto text-secondary">
                Try Now →
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
