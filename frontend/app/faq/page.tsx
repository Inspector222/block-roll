import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

const faqs = [
  {
    question: "What is BlockRoll?",
    answer:
      "BlockRoll is a non-custodial data exchange and storage platform powered by BlockDAG. It allows you to securely store, encrypt, and share files using blockchain technology while maintaining complete control over your data.",
  },
  {
    question: "How does wallet authentication work?",
    answer:
      "BlockRoll uses your crypto wallet as your identity. There are no passwords to remember - simply connect your wallet to access your files. Your wallet address is your unique identifier, and only you control access through your private keys.",
  },
  {
    question: "Where are my files stored?",
    answer:
      "Files are encrypted client-side and stored on IPFS (InterPlanetary File System), a decentralized storage network. This ensures your files are distributed across multiple nodes, making them highly available and resistant to censorship.",
  },
  {
    question: "What encryption does BlockRoll use?",
    answer:
      "We use military-grade AES-256 encryption for all files. Encryption happens in your browser before upload, meaning your files are encrypted before they ever leave your device. We also support hybrid encryption for larger files.",
  },
  {
    question: "Can I share files with people who don't have crypto wallets?",
    answer:
      "Currently, file sharing requires both parties to have crypto wallets, as wallet addresses are used for access control. However, we're working on guest access features that will allow temporary sharing via secure links.",
  },
  {
    question: "What is Emergency Access Mode?",
    answer:
      "Emergency Access Mode allows you to designate trusted wallet addresses that can access your vault if you're inactive for a specified period. This is useful for estate planning or ensuring business continuity. You can revoke or modify this at any time.",
  },
  {
    question: "How does the AI Guardian work?",
    answer:
      "AI Guardian monitors access patterns, login locations, devices, and file interactions to detect suspicious activity. It uses machine learning to establish your normal behavior and alerts you to anomalies that could indicate unauthorized access attempts.",
  },
  {
    question: "What are the storage limits?",
    answer:
      "Storage limits depend on your plan. Free accounts get 5GB of storage, while premium plans offer up to 1TB. Enterprise customers can request custom storage allocations based on their needs.",
  },
  {
    question: "Can I revoke file access after sharing?",
    answer:
      "Yes, you can instantly revoke access to any file at any time. When you revoke access, the recipient will no longer be able to decrypt or view the file, even if they previously downloaded it.",
  },
  {
    question: "Is BlockRoll open source?",
    answer:
      "Our SDK and smart contracts are open source and available on GitHub. The core platform code is proprietary, but we're committed to transparency and regularly publish security audits.",
  },
  {
    question: "What blockchains does BlockRoll support?",
    answer:
      "BlockRoll currently supports Ethereum, Polygon, and Arbitrum networks. We're actively working on adding support for more EVM-compatible chains and other blockchain ecosystems.",
  },
  {
    question: "How much does BlockRoll cost?",
    answer:
      "BlockRoll offers a free tier with 5GB storage and basic features. Premium plans start at $9.99/month for 100GB storage and advanced features like AI Guardian and Team Workspaces. Enterprise plans are available with custom pricing.",
  },
]

export default function FAQPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground">Everything you need to know about BlockRoll</p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-12 px-4 lg:px-8">
        <div className="container mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="glass-strong rounded-2xl px-6 border-0">
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* WhatsApp Bot CTA */}
          <div className="glass-strong rounded-3xl p-8 md:p-12 text-center mt-16">
            <MessageCircle className="w-16 h-16 text-secondary mx-auto mb-6" />
            <h2 className="font-serif text-3xl font-bold mb-4">Still have questions?</h2>
            <p className="text-muted-foreground mb-6">Chat with our support bot for instant answers</p>
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <MessageCircle className="mr-2 h-5 w-5" />
              Chat with Support Bot
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
