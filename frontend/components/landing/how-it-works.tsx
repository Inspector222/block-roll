import { Upload, Lock, Share } from "lucide-react"

const steps = [
  {
    icon: Upload,
    title: "Upload your file",
    description: "Select any file from your device to get started",
  },
  {
    icon: Lock,
    title: "Encrypt & store on IPFS",
    description: "Your file is encrypted and stored securely on decentralized storage",
  },
  {
    icon: Share,
    title: "Share securely by wallet address",
    description: "Grant access to specific wallet addresses with full control",
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 px-4 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg">Three simple steps to secure file sharing</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="glass rounded-2xl p-8 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 mb-4">
                <step.icon className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-serif text-xl font-semibold">Step {index + 1}</h3>
              <h4 className="font-semibold">{step.title}</h4>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
