"use client"
import { useState } from "react"
import { AppLayout } from "@/components/layout/AppLayout"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()
    setLoading(true)
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSubmitted(true)
    setLoading(false)
  }
  return (
    <AppLayout>
      <div className="min-h-screen bg-cream">
      
      {/* Hero */}
      <div className="bg-ink py-24 text-center">
        <p className="font-mono text-xs tracking-widest 
                      text-gold uppercase mb-4">
          Get In Touch
        </p>
        <h1 className="font-cormorant text-5xl font-light 
                       text-white">
          Contact Us
        </h1>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <div>
            <h2 className="font-cormorant text-3xl font-light mb-8">
              We'd love to hear from you
            </h2>
            <p className="text-muted text-sm leading-relaxed mb-12">
              Whether you have a question about a product, need 
              help with an order, or just want to say hello — 
              our team is here for you.
            </p>

            <div className="space-y-8">
              {[
                {
                  label: "EMAIL",
                  value: "hello@maison.com",
                  detail: "We reply within 24 hours"
                },
                {
                  label: "PHONE",
                  value: "+91 98765 43210",
                  detail: "Mon–Sat, 10am–7pm IST"
                },
                {
                  label: "ADDRESS",
                  value: "23 Hauz Khas Village",
                  detail: "New Delhi, 110016, India"
                },
              ].map((info) => (
                <div key={info.label} 
                     className="border-b border-site-border pb-6">
                  <p className="font-mono text-xs tracking-widest 
                                text-gold uppercase mb-2">
                    {info.label}
                  </p>
                  <p className="font-cormorant text-xl font-light mb-1">
                    {info.value}
                  </p>
                  <p className="font-mono text-xs text-muted">
                    {info.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white border border-site-border p-8">
            {submitted ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-green-50 border 
                                border-green-200 rounded-full flex 
                                items-center justify-center mx-auto mb-6">
                  <svg width="24" height="24" viewBox="0 0 24 24" 
                       fill="none" stroke="#16a34a" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 className="font-cormorant text-2xl font-light mb-2">
                  Message Sent!
                </h3>
                <p className="font-mono text-xs text-muted tracking-widest">
                  WE'LL GET BACK TO YOU WITHIN 24 HOURS
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="font-mono text-xs tracking-widest 
                                    text-muted uppercase block mb-2">
                    Full Name
                  </label>
                  <input
                    required
                    className="w-full border border-site-border 
                               bg-cream p-4 text-sm focus:outline-none 
                               focus:border-ink transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs tracking-widest 
                                    text-muted uppercase block mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full border border-site-border 
                               bg-cream p-4 text-sm focus:outline-none 
                               focus:border-ink transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs tracking-widest 
                                    text-muted uppercase block mb-2">
                    Subject
                  </label>
                  <select
                    className="w-full border border-site-border 
                               bg-cream p-4 text-sm focus:outline-none 
                               focus:border-ink transition-colors"
                  >
                    <option>Order Inquiry</option>
                    <option>Product Question</option>
                    <option>Return & Exchange</option>
                    <option>Wholesale</option>
                    <option>Press & Media</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono text-xs tracking-widest 
                                    text-muted uppercase block mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    className="w-full border border-site-border 
                               bg-cream p-4 text-sm focus:outline-none 
                               focus:border-ink transition-colors 
                               resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-ink text-white py-4 
                             font-mono text-xs tracking-widest 
                             uppercase hover:bg-gray-800 
                             transition-colors disabled:opacity-50"
                >
                  {loading ? "SENDING..." : "SEND MESSAGE"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      </div>
    </AppLayout>
  )
}
