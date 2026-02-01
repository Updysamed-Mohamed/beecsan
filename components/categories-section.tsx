import Link from 'next/link';
import { Briefcase, Home, Smartphone, Car, Sofa, Music, Utensils, Zap } from 'lucide-react';

const categories = [
  { name: 'Jobs', icon: Briefcase, href: '?category=jobs' },
  { name: 'Real Estate', icon: Home, href: '?category=real-estate' },
  { name: 'Electronics', icon: Smartphone, href: '?category=electronics' },
  { name: 'Vehicles', icon: Car, href: '?category=vehicles' },
  { name: 'Furniture', icon: Sofa, href: '?category=furniture' },
  { name: 'Entertainment', icon: Music, href: '?category=entertainment' },
  { name: 'Services', icon: Utensils, href: '?category=services' },
  { name: 'Other', icon: Zap, href: '?category=other' },
];

export default function CategoriesSection() {
  return (
    <section className="bg-muted/50 border-b border-border py-6">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-sm font-semibold text-foreground mb-4">Browse Categories</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={cat.href}
                className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <Icon className="w-6 h-6 text-primary mb-1" />
                <span className="text-xs text-center text-muted-foreground font-medium">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
