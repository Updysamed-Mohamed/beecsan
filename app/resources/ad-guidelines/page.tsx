import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, XCircle, Camera, Type, AlertCircle } from 'lucide-react';

export default function AdGuidelinesPage() {
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
          <h1 className="font-bold text-foreground uppercase tracking-tight">Ad Guidelines</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Posting Guidelines</h2>
          <p className="text-lg text-muted-foreground">
            Create successful listings by following these guidelines. Clear, honest, and complete listings get more responses.
          </p>
        </div>

        <div className="space-y-8">
          {/* Title */}
          <div className="bg-surface rounded-2xl border border-border p-8">
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Type className="w-5 h-5 text-primary" />
              Title Guidelines
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Be specific and descriptive</p>
                  <p className="text-sm text-muted-foreground">Include brand, model, condition, and key features</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Use clear language</p>
                  <p className="text-sm text-muted-foreground">Avoid abbreviations and special characters when possible</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Avoid misleading titles</p>
                  <p className="text-sm text-muted-foreground">Don't use excessive capitalization or spam-like content</p>
                </div>
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="bg-surface rounded-2xl border border-border p-8">
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              Photo Guidelines
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Use clear, well-lit photos</p>
                  <p className="text-sm text-muted-foreground">Take pictures in natural light and from multiple angles</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Show the actual item</p>
                  <p className="text-sm text-muted-foreground">Upload real photos of the product you're selling</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Highlight details</p>
                  <p className="text-sm text-muted-foreground">Show any damage, wear, or special features clearly</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Don't use stock photos</p>
                  <p className="text-sm text-muted-foreground">Stock images or unrelated photos violate guidelines</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-surface rounded-2xl border border-border p-8">
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Description Guidelines
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Be honest about condition</p>
                  <p className="text-sm text-muted-foreground">Clearly state the condition - New, Like New, Good, or Fair</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Include all relevant information</p>
                  <p className="text-sm text-muted-foreground">Brand, size, color, age, features, and any issues</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Disclose defects</p>
                  <p className="text-sm text-muted-foreground">Mention any damage, missing parts, or functionality issues</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Don't include contact information in description</p>
                  <p className="text-sm text-muted-foreground">Use the Beecsan messaging system instead</p>
                </div>
              </div>
            </div>
          </div>

          {/* Prohibited */}
          <div className="bg-red-500/10 rounded-2xl border border-red-500/30 p-8">
            <h3 className="text-xl font-bold text-red-600 mb-4">Prohibited Items & Content</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Counterfeit or fake items</li>
              <li>• Stolen goods or property</li>
              <li>• Weapons, explosives, or dangerous items</li>
              <li>• Illegal drugs or controlled substances</li>
              <li>• Hate speech or discriminatory content</li>
              <li>• Contact information outside the platform</li>
              <li>• Services that are illegal in your jurisdiction</li>
              <li>• Spam or misleading content</li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Post Your Ad?</h3>
          <p className="text-muted-foreground mb-6">
            Follow these guidelines to create successful, high-quality listings.
          </p>
          <Link href="/listings/create">
            <Button className="bg-primary hover:bg-primary/90 text-white px-8 h-12 font-bold rounded-xl">
              Create New Ad
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
