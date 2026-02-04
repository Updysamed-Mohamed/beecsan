import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfUsePage() {
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
          <h1 className="font-bold text-foreground uppercase tracking-tight">Terms of Use</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Terms of Use</h2>
          <p className="text-sm text-muted-foreground">Last updated: January 2025</p>
        </div>

        <div className="space-y-8 text-foreground">
          {/* Introduction */}
          <section>
            <h3 className="text-xl font-bold mb-4">1. Acceptance of Terms</h3>
            <p className="text-muted-foreground mb-4">
              By accessing and using this website and/or application, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          {/* User Accounts */}
          <section className="bg-surface rounded-xl border border-border p-6">
            <h3 className="text-xl font-bold mb-4">2. User Accounts</h3>
            <div className="space-y-3 text-muted-foreground text-sm">
              <p>
                <strong className="text-foreground">Registration:</strong> You must be at least 18 years old to create an account. You are responsible for providing accurate information and keeping your password confidential.
              </p>
              <p>
                <strong className="text-foreground">Account Responsibility:</strong> You are responsible for all activities that occur under your account. You agree to notify us immediately of any unauthorized use.
              </p>
              <p>
                <strong className="text-foreground">Suspension:</strong> We reserve the right to suspend or terminate any account that violates these terms.
              </p>
            </div>
          </section>

          {/* Acceptable Use */}
          <section>
            <h3 className="text-xl font-bold mb-4">3. Acceptable Use</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              You agree not to use this website for any purpose that is unlawful or prohibited by these terms. You agree that you will not post or transmit:
            </p>
            <ul className="space-y-2 text-muted-foreground text-sm list-disc list-inside">
              <li>Harassing, abusive, defamatory, or hateful content</li>
              <li>Content that violates intellectual property rights</li>
              <li>Spam, phishing, or malware</li>
              <li>False or misleading information</li>
              <li>Prohibited items or services</li>
              <li>Content intended to defraud users</li>
            </ul>
          </section>

          {/* Transactions */}
          <section className="bg-surface rounded-xl border border-border p-6">
            <h3 className="text-xl font-bold mb-4">4. Transactions and Disputes</h3>
            <div className="space-y-3 text-muted-foreground text-sm">
              <p>
                <strong className="text-foreground">Between Users:</strong> Beecsan is a platform that facilitates transactions between users. We are not responsible for the conduct of any buyer or seller or the quality of items sold.
              </p>
              <p>
                <strong className="text-foreground">Dispute Resolution:</strong> Users agree to resolve disputes directly when possible. Beecsan may assist in mediation but is not responsible for disputes between users.
              </p>
              <p>
                <strong className="text-foreground">No Escrow Service:</strong> Beecsan does not hold funds in escrow. Payment arrangements are made directly between buyers and sellers.
              </p>
            </div>
          </section>

          {/* Listings */}
          <section>
            <h3 className="text-xl font-bold mb-4">5. Product Listings</h3>
            <div className="space-y-3 text-muted-foreground text-sm">
              <p>
                <strong className="text-foreground">Seller Responsibility:</strong> Sellers are responsible for the accuracy, legality, and safety of their listings. All items must comply with local laws.
              </p>
              <p>
                <strong className="text-foreground">Right to Removal:</strong> We reserve the right to remove any listings that violate these terms without prior notice.
              </p>
              <p>
                <strong className="text-foreground">No Warranties:</strong> We do not warrant the quality, accuracy, or legality of any listing.
              </p>
            </div>
          </section>

          {/* Limitations of Liability */}
          <section className="bg-surface rounded-xl border border-border p-6">
            <h3 className="text-xl font-bold mb-4">6. Limitations of Liability</h3>
            <p className="text-muted-foreground text-sm mb-3">
              To the fullest extent permitted by law, Beecsan shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service or materials on the website/application.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h3 className="text-xl font-bold mb-4">7. Intellectual Property Rights</h3>
            <p className="text-muted-foreground text-sm">
              The website and all content, features, and functionality (including but not limited to all information, software, text, displays, images, video and audio) are owned by Beecsan, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          {/* Modifications */}
          <section className="bg-surface rounded-xl border border-border p-6">
            <h3 className="text-xl font-bold mb-4">8. Modifications to Terms</h3>
            <p className="text-muted-foreground text-sm">
              We reserve the right to modify these terms of use at any time. We will notify users of any significant changes via email or a prominent notice on the website/application. Your continued use of the service following notification of changes constitutes your acceptance of the modified terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h3 className="text-xl font-bold mb-4">9. Governing Law</h3>
            <p className="text-muted-foreground text-sm">
              These Terms of Use shall be governed by and construed in accordance with the laws of the jurisdiction in which Beecsan operates, and you irrevocably submit to the exclusive jurisdiction of the courts located there.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-8">
            <h3 className="text-xl font-bold mb-4">10. Contact Us</h3>
            <p className="text-muted-foreground text-sm mb-3">
              If you have any questions about these Terms of Use, please contact us at:
            </p>
            <div className="text-sm">
              <p className="font-semibold text-foreground mb-2">Beecsan</p>
              <p className="text-muted-foreground">Email: legal@Beecsan.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
