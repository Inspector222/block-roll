import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Shield, Users, AlertTriangle, Sparkles, Code, Lock, FileCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Shield,
    title: "SafeVault",
    subtitle: "Private Storage",
    description:
      "Store your most sensitive files with military-grade AES-256 encryption. Your files are encrypted client-side before upload, ensuring only you have access to your data.",
    benefits: [
      "End-to-end encryption",
      "Client-side key management",
      "Zero-knowledge architecture",
      "IPFS distributed storage",
    ],
  },
  {
    icon: Users,
    title: "Team Workspace",
    subtitle: "Collaborate Securely",
    description:
      "Create shared vaults for your team with granular role-based permissions. Manage who can view, edit, or share files with complete transparency.",
    benefits: ["Role-based access control", "Team file sharing", "Activity tracking", "Collaborative workflows"],
  },
  {
    icon: AlertTriangle,
    title: "Emergency Access Mode",
    subtitle: "Never Lose Access",
    description:
      "Designate trusted wallet addresses that can access your vault after a specified inactivity period. Perfect for estate planning and business continuity.",
    benefits: [
      "Trusted wallet designation",
      "Configurable inactivity periods",
      "Automatic access transfer",
      "Revocable at any time",
    ],
  },
  {
    icon: Sparkles,
    title: "AI Guardian",
    subtitle: "Intelligent Security",
    description:
      "Advanced AI monitors access patterns and detects suspicious activity in real-time. Get instant alerts for unusual login locations, devices, or access attempts.",
    benefits: ["Anomaly detection", "Real-time alerts", "Risk scoring", "Automated threat response"],
  },
  {
    icon: Code,
    title: "SDK & Integration",
    subtitle: "Developer Friendly",
    description:
      "Integrate BlockRoll into your applications with our comprehensive SDK and REST API. Build custom workflows and automate file management.",
    benefits: ["REST API endpoints", "JavaScript SDK", "Webhook support", "Extensive documentation"],
  },
  {
    icon: Lock,
    title: "Granular Permissions",
    subtitle: "Full Control",
    description:
      "Control exactly who can access your files and for how long. Set expiration dates, revoke access instantly, and track all file interactions.",
    benefits: ["Time-based access", "Instant revocation", "Access audit logs", "Per-file permissions"],
  },
]

export default function FeaturesPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-balance">
            Powerful Features for Complete Control
          </h1>
          <p className="text-xl text-muted-foreground text-balance">
            Everything you need to securely store, share, and manage your files on the blockchain
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 px-4 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-12">
            {features.map((feature, index) => (
              <div key={index} className="glass-strong rounded-3xl p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary/20">
                      <feature.icon className="w-8 h-8 text-secondary" />
                    </div>
                    <div>
                      <div className="text-sm text-secondary font-medium mb-2">{feature.subtitle}</div>
                      <h2 className="font-serif text-3xl font-bold mb-4">{feature.title}</h2>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                    <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">Try Now</Button>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Key Benefits</h3>
                    <ul className="space-y-3">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <FileCheck className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
