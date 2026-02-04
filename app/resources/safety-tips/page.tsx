import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, AlertTriangle, Lock, MapPin, Phone, CreditCard } from 'lucide-react';

export default function SafetyTipsPage() {
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
          <h1 className="font-bold text-foreground uppercase tracking-tight">Safety Tips</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Stay Safe on Beecsan</h2>
          <p className="text-lg text-muted-foreground">
            Your safety is our priority. Follow these guidelines to have a secure buying and selling experience.
          </p>
        </div>

        <div className="space-y-8">
          {/* Tip 1 */}
          <div className="bg-surface rounded-2xl border border-border p-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Meet in Safe Locations</h3>
                <p className="text-muted-foreground mb-3">
                  Always meet the other party in a public place during daylight hours. Choose well-lit areas with plenty of foot traffic like shopping centers or parking lots.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Shopping malls or public markets</li>
                  <li>✓ Busy parking lots with security</li>
                  <li>✓ During daylight hours</li>
                  <li>✓ Bring a trusted friend or family member</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tip 2 */}
          <div className="bg-surface rounded-2xl border border-border p-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Communicate Clearly</h3>
                <p className="text-muted-foreground mb-3">
                  Use the Beecsan messaging system to communicate. Be cautious of requests to move conversations to other platforms or share personal information.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Use Beecsan's built-in messaging</li>
                  <li>✓ Don't share personal phone numbers early</li>
                  <li>✓ Be wary of requests outside the platform</li>
                  <li>✓ Keep conversation records</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tip 3 */}
          <div className="bg-surface rounded-2xl border border-border p-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Payment Safety</h3>
                <p className="text-muted-foreground mb-3">
                  Never pay before inspecting the item. Use secure payment methods and avoid wire transfers to unknown accounts.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Inspect items thoroughly before payment</li>
                  <li>✓ Use secure payment methods</li>
                  <li>✓ Avoid wire transfers and gift cards</li>
                  <li>✓ Keep payment receipts</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tip 4 */}
          <div className="bg-surface rounded-2xl border border-border p-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Trust Your Instincts</h3>
                <p className="text-muted-foreground mb-3">
                  If something feels wrong, it probably is. Don't proceed with any transaction that makes you uncomfortable.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Watch for too-good-to-be-true deals</li>
                  <li>✓ Be suspicious of urgent requests</li>
                  <li>✓ Verify seller reviews and ratings</li>
                  <li>✓ Report suspicious activity</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tip 5 */}
          <div className="bg-surface rounded-2xl border border-border p-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Protect Your Personal Information</h3>
                <p className="text-muted-foreground mb-3">
                  Keep your Beecsan account secure and never share sensitive information like passwords or social security numbers.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Use a strong, unique password</li>
                  <li>✓ Enable account verification</li>
                  <li>✓ Never share login credentials</li>
                  <li>✓ Report account compromises immediately</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">Report Suspicious Activity</h3>
          <p className="text-muted-foreground mb-6">
            If you encounter any suspicious behavior or scam attempts, please report it immediately.
          </p>
          <Link href="/company/contact-support">
            <Button className="bg-primary hover:bg-primary/90 text-white px-8 h-12 font-bold rounded-xl">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
