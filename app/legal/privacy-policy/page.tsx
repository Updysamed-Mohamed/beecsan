import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
          <h1 className="font-bold text-foreground uppercase tracking-tight">Privacy Policy</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h2>
          <p className="text-sm text-muted-foreground">Last updated: January 2025</p>
        </div>

        <div className="space-y-8 text-foreground">
          {/* Introduction */}
          <section>
            <h3 className="text-xl font-bold mb-4">1. Introduction</h3>
            <p className="text-muted-foreground mb-4">
              Beecsan (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;, or &quot;Company&quot;) operates the Beecsan website and mobile application 
              (&quot;Service&quot;). This page informs you of our policies regarding the collection, use, and disclosure of personal data when 
              you use our Service and the choices you have associated with that data.
            </p>
          </section>

          {/* Information Collection */}
          <section className="bg-surface rounded-xl border border-border p-6">
            <h3 className="text-xl font-bold mb-4 text-foreground">2. Information We Collect</h3>
            <div className="space-y-3 text-muted-foreground text-sm">
              <p>
                <strong className="text-foreground">Personal Information:</strong> When you create an account, we collect your name, email address, phone number, and location.
              </p>
              <p>
                <strong className="text-foreground">Transaction Data:</strong> We collect information about transactions you make, including listing details, prices, and dates.
              </p>
              <p>
                <strong className="text-foreground">Communication Data:</strong> Messages you send through our platform are stored to facilitate transactions and resolve disputes.
              </p>
              <p>
                <strong className="text-foreground">Usage Data:</strong> We collect information about how you interact with our Service, including page visits, searches, and features used.
              </p>
              <p>
                <strong className="text-foreground">Device Data:</strong> Information about your device, browser, IP address, and operating system is collected automatically.
              </p>
            </div>
          </section>

          {/* Use of Data */}
          <section>
            <h3 className="text-xl font-bold mb-4 text-foreground">3. How We Use Your Information</h3>
            <ul className="space-y-2 text-muted-foreground text-sm list-disc list-inside">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service</li>
              <li>To provide customer support and respond to your inquiries</li>
              <li>To gather analysis or valuable information to improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues and fraud</li>
            </ul>
          </section>

          {/* Security */}
          <section className="bg-surface rounded-xl border border-border p-6">
            <h3 className="text-xl font-bold mb-4 text-foreground">4. Security of Your Information</h3>
            <p className="text-muted-foreground text-sm mb-3">
              We take reasonable precautions and follow industry best practices to make sure your personal information is not inappropriately lost, misused, accessed, disclosed, altered, or destroyed. However, no method of transmission over the Internet is 100% secure.
            </p>
            <p className="text-muted-foreground text-sm">
              If you have any questions about the security of your personal information, you can contact us at support@Beecsan.com.
            </p>
          </section>

          {/* Third Party Services */}
          <section>
            <h3 className="text-xl font-bold mb-4 text-foreground">5. Third Party Services</h3>
            <p className="text-muted-foreground text-sm mb-3">
              Our Service may contain links to third-party sites that are not operated by us. This Privacy Policy does not apply to third-party websites, and we are not responsible for their privacy practices. We encourage you to review the privacy policies of any third-party services before providing your personal information.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="bg-surface rounded-xl border border-border p-6">
            <h3 className="text-xl font-bold mb-4 text-foreground">6. Children's Privacy</h3>
            <p className="text-muted-foreground text-sm">
              Our Service does not address anyone under the age of 18. We do not knowingly collect personally identifiable information from children under 18. If you become aware that a child has provided us with personal information, please contact us immediately at support@Beecsan.com.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h3 className="text-xl font-bold mb-4 text-foreground">7. Changes to This Privacy Policy</h3>
            <p className="text-muted-foreground text-sm">
              We may update this Privacy Policy from time to time to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by updating the "Last Updated" date of this Privacy Policy. Your continued use of the Service following the posting of revised Privacy Policy means that you accept and agree to the changes.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-8">
            <h3 className="text-xl font-bold mb-4 text-foreground">8. Contact Us</h3>
            <p className="text-muted-foreground text-sm mb-3">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="text-sm">
              <p className="font-semibold text-foreground mb-2">Beecsan</p>
              <p className="text-muted-foreground">Email: privacy@Beecsan.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
