import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, MessageSquare, HelpCircle } from 'lucide-react';

export default function ContactSupportPage() {
  const faqs = [
    {
      question: 'How do I create an account?',
      answer: 'Click "Sign Up" at the top of the page. Enter your email, create a password, and fill in your profile information. Verify your email to activate your account.',
    },
    {
      question: 'How do I report a problem with a transaction?',
      answer: 'Contact our support team with details about the transaction, including the listing ID, buyer/seller name, and description of the issue. We\'ll investigate and help resolve it.',
    },
    {
      question: 'Is my payment information safe?',
      answer: 'Yes. We use secure payment processing and never store full credit card details. All transactions are encrypted for your protection.',
    },
    {
      question: 'How long does delivery take?',
      answer: 'Delivery varies by agreement between buyer and seller. Most local transactions are completed within a few days of purchase.',
    },
    {
      question: 'Can I cancel a transaction?',
      answer: 'Cancellations depend on the transaction status. Contact the seller immediately if you need to cancel. Our support team can assist if issues arise.',
    },
    {
      question: 'How do I delete my account?',
      answer: 'Go to your profile settings and select "Delete Account". You\'ll need to confirm this action. Active transactions must be completed first.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 bg-surface border-b border-border sticky top-0 z-50 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto h-full flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-bold text-foreground uppercase tracking-tight">Contact Support</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Get Help</h2>
          <p className="text-lg text-muted-foreground">
            We're here to help. Find answers to common questions or reach out to our support team.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-8">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Email Support</h3>
            <p className="text-muted-foreground mb-4">
              Send us an email with details about your issue and we'll respond within 24 hours.
            </p>
            <a href="mailto:support@Beecsan.com" className="text-primary font-semibold hover:underline">
              support@Beecsan.com
            </a>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-8">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Live Chat</h3>
            <p className="text-muted-foreground mb-4">
              Chat with our support team for immediate assistance. Available weekdays 9 AM - 6 PM.
            </p>
            <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl font-bold">
              Start Chat
            </Button>
          </div>
        </div>

        {/* Report Issues */}
        <div className="bg-surface rounded-2xl border border-border p-8 mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary" />
            Report an Issue
          </h3>
          <p className="text-muted-foreground mb-6">
            Found a problem? Let us know and we'll investigate it immediately.
          </p>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wider">
                Issue Type
              </label>
              <select className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Account Issue</option>
                <option>Transaction Problem</option>
                <option>Listing Issue</option>
                <option>Payment Issue</option>
                <option>Safety Concern</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wider">
                Description
              </label>
              <textarea
                rows={5}
                placeholder="Please describe the issue in detail..."
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-white h-12 font-bold rounded-xl">
              Submit Report
            </Button>
          </form>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-8">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-surface rounded-xl border border-border overflow-hidden"
              >
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between font-bold text-foreground hover:bg-muted/30 transition">
                  {faq.question}
                  <span className="transform transition group-open:rotate-180">▼</span>
                </summary>
                <div className="px-6 py-4 bg-muted/20 border-t border-border text-muted-foreground">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">Can't Find What You Need?</h3>
          <p className="text-muted-foreground mb-6">
            Our support team is ready to help. Reach out to us anytime.
          </p>
          <a href="mailto:support@Beecsan.com">
            <Button className="bg-primary hover:bg-primary/90 text-white px-8 h-12 font-bold rounded-xl">
              Email Support Team
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
