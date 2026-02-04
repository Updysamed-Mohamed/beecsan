import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CookiePolicyPage() {
  const cookieTypes = [
    {
      name: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function properly. They enable user login, security features, and page navigation.',
      example: 'Session ID, Authentication tokens',
    },
    {
      name: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors use our website. The information collected is used to improve the website performance.',
      example: 'Google Analytics, page views, bounce rate',
    },
    {
      name: 'Marketing Cookies',
      description: 'These cookies are used to deliver targeted advertisements based on your browsing history and interests.',
      example: 'Remarketing pixels, conversion tracking',
    },
    {
      name: 'Preference Cookies',
      description: 'These cookies remember your preferences and choices to provide a personalized experience.',
      example: 'Language preference, theme selection',
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
          <h1 className="font-bold text-foreground uppercase tracking-tight">Cookie Policy</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Cookie Policy</h2>
          <p className="text-sm text-muted-foreground">Last updated: January 2025</p>
        </div>

        <div className="space-y-8 text-foreground">
          {/* Introduction */}
          <section>
            <h3 className="text-xl font-bold mb-4">1. What Are Cookies?</h3>
            <p className="text-muted-foreground mb-4">
              Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit our website. They contain information about your browsing activity and preferences. Cookies allow us to recognize you when you return to our website and provide you with a better user experience.
            </p>
          </section>

          {/* Types of Cookies */}
          <section>
            <h3 className="text-xl font-bold mb-4">2. Types of Cookies We Use</h3>
            <div className="space-y-4">
              {cookieTypes.map((cookie, idx) => (
                <div key={idx} className="bg-surface rounded-xl border border-border p-6">
                  <h4 className="font-bold text-foreground mb-2">{cookie.name}</h4>
                  <p className="text-muted-foreground text-sm mb-3">{cookie.description}</p>
                  <p className="text-xs text-primary font-semibold">
                    Examples: {cookie.example}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* First and Third Party */}
          <section className="bg-surface rounded-xl border border-border p-6">
            <h3 className="text-xl font-bold mb-4">3. First-Party and Third-Party Cookies</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-foreground mb-2 text-sm">First-Party Cookies</h4>
                <p className="text-muted-foreground text-sm">
                  These are cookies set directly by Beecsan. They help us remember your preferences and provide essential functionality.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-2 text-sm">Third-Party Cookies</h4>
                <p className="text-muted-foreground text-sm">
                  These cookies are set by third-party services (such as analytics providers) to track usage patterns and improve our services.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Cookies */}
          <section>
            <h3 className="text-xl font-bold mb-4">4. How We Use Cookies</h3>
            <ul className="space-y-2 text-muted-foreground text-sm list-disc list-inside">
              <li>To authenticate your login and maintain your session</li>
              <li>To remember your preferences and settings</li>
              <li>To analyze website traffic and user behavior</li>
              <li>To deliver personalized content and recommendations</li>
              <li>To measure the effectiveness of marketing campaigns</li>
              <li>To prevent fraud and enhance security</li>
              <li>To improve website performance and user experience</li>
            </ul>
          </section>

          {/* Managing Cookies */}
          <section className="bg-surface rounded-xl border border-border p-6">
            <h3 className="text-xl font-bold mb-4">5. Managing Your Cookie Preferences</h3>
            <div className="space-y-3 text-muted-foreground text-sm">
              <p>
                <strong className="text-foreground">Browser Settings:</strong> Most web browsers allow you to control cookies through their settings. You can choose to block or delete cookies, but this may affect the functionality of our website.
              </p>
              <p>
                <strong className="text-foreground">Opt-Out Options:</strong> You can opt out of analytics cookies by using your browser&apos;s do-not-track feature or visiting the opt-out page of third-party analytics providers.
              </p>
              <p>
                <strong className="text-foreground">Cookie Consent:</strong> When you visit our website, we provide a cookie consent banner. You can manage your preferences through this banner.
              </p>
            </div>
          </section>

          {/* Consequences of Disabling */}
          <section>
            <h3 className="text-xl font-bold mb-4">6. Consequences of Disabling Cookies</h3>
            <p className="text-muted-foreground text-sm">
              If you disable all cookies, you may not be able to use certain features of our website, such as login functionality or personalized recommendations. Essential cookies cannot be disabled as they are necessary for the website to function.
            </p>
          </section>

          {/* Third Party Links */}
          <section className="bg-surface rounded-xl border border-border p-6">
            <h3 className="text-xl font-bold mb-4">7. Third-Party Links</h3>
            <p className="text-muted-foreground text-sm">
              Our website may contain links to third-party websites. These websites have their own cookie policies, and we are not responsible for their use of cookies. We encourage you to review their cookie policies before visiting these sites.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h3 className="text-xl font-bold mb-4">8. Data Security</h3>
            <p className="text-muted-foreground text-sm">
              We use cookies securely and encrypt sensitive cookie data. However, no method of transmission over the Internet is completely secure. We encourage users to be cautious when sharing personal information online.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="bg-surface rounded-xl border border-border p-6">
            <h3 className="text-xl font-bold mb-4">9. Changes to This Cookie Policy</h3>
            <p className="text-muted-foreground text-sm">
              We may update this Cookie Policy from time to time to reflect changes in our practices. We will notify you of significant changes by updating the &quot;Last Updated&quot; date. Your continued use of the website indicates your acceptance of these changes.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-8">
            <h3 className="text-xl font-bold mb-4">10. Contact Us</h3>
            <p className="text-muted-foreground text-sm mb-3">
              If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
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
