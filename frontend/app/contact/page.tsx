import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Github, Mail, MessageCircle, Twitter } from "lucide-react"

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">Get in Touch</h1>
          <p className="text-xl text-muted-foreground">We'd love to hear from you. Reach out to our team.</p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-12 px-4 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="glass-strong rounded-3xl p-8 md:p-12">
              <h2 className="font-serif text-2xl font-bold mb-6">Send us a message</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <Input id="name" placeholder="Your name" className="bg-background/50" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="your@email.com" className="bg-background/50" />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <Input id="subject" placeholder="How can we help?" className="bg-background/50" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more..."
                    rows={6}
                    className="bg-background/50 resize-none"
                  />
                </div>
                <Button type="submit" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="glass-strong rounded-3xl p-8">
                <Mail className="w-12 h-12 text-secondary mb-4" />
                <h3 className="font-serif text-xl font-bold mb-2">Email Us</h3>
                <p className="text-muted-foreground mb-4">Our team typically responds within 24 hours</p>
                <a href="mailto:support@blockroll.io" className="text-secondary hover:underline">
                  support@blockroll.io
                </a>
              </div>

              <div className="glass-strong rounded-3xl p-8">
                <MessageCircle className="w-12 h-12 text-secondary mb-4" />
                <h3 className="font-serif text-xl font-bold mb-2">WhatsApp Support</h3>
                <p className="text-muted-foreground mb-4">Chat with our AI support bot for instant help</p>
                <Button variant="outline" className="glass bg-transparent">
                  Start Chat
                </Button>
              </div>

              <div className="glass-strong rounded-3xl p-8">
                <h3 className="font-serif text-xl font-bold mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a
                    href="https://twitter.com"
                    className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center hover:bg-secondary/30 transition-colors"
                  >
                    <Twitter className="w-5 h-5 text-secondary" />
                  </a>
                  <a
                    href="https://github.com"
                    className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center hover:bg-secondary/30 transition-colors"
                  >
                    <Github className="w-5 h-5 text-secondary" />
                  </a>
                  <a
                    href="https://discord.com"
                    className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center hover:bg-secondary/30 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 text-secondary" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
