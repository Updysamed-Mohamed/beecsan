'use client';

import { useEffect } from 'react';
import Header from '@/components/header';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BarChart3, TrendingUp, Eye, Heart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();

  // ✅ Redirect must be inside useEffect
  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Seller Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Active Listings</span>
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold">8</p>
            <p className="text-xs text-muted-foreground mt-1">+2 this month</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Total Views</span>
              <Eye className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold">1,247</p>
            <p className="text-xs text-muted-foreground mt-1">+340 this week</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Favorites</span>
              <Heart className="w-5 h-5 text-destructive" />
            </div>
            <p className="text-3xl font-bold">156</p>
            <p className="text-xs text-muted-foreground mt-1">+45 this week</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">Total Sales</span>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold">$12.4K</p>
            <p className="text-xs text-muted-foreground mt-1">+$2.1K this month</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Button className="w-full justify-start" asChild>
                <Link href="/listings/create">Create New Listing</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/dashboard/listings">Manage Listings</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/messages">View Messages</Link>
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="text-sm pb-3 border-b border-border">
                <p className="font-medium">New message from John</p>
                <p className="text-muted-foreground">2 hours ago</p>
              </div>
              <div className="text-sm pb-3 border-b border-border">
                <p className="font-medium">Your iPhone listing got 12 views</p>
                <p className="text-muted-foreground">5 hours ago</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">MacBook Pro added to 8 favorites</p>
                <p className="text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Listings Table */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Your Listings</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-semibold">Title</th>
                  <th className="text-left py-2 font-semibold">Price</th>
                  <th className="text-left py-2 font-semibold">Views</th>
                  <th className="text-left py-2 font-semibold">Status</th>
                  <th className="text-left py-2 font-semibold">Posted</th>
                  <th className="text-left py-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-3">iPhone 15 Pro Max</td>
                  <td className="py-3">$1,200</td>
                  <td className="py-3">342</td>
                  <td className="py-3">
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                      Active
                    </span>
                  </td>
                  <td className="py-3">2 days ago</td>
                  <td className="py-3 text-sm">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </td>
                </tr>

                <tr className="border-b border-border">
                  <td className="py-3">MacBook Pro 16&quot;</td>
                  <td className="py-3">$2,800</td>
                  <td className="py-3">187</td>
                  <td className="py-3">
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                      Active
                    </span>
                  </td>
                  <td className="py-3">5 days ago</td>
                  <td className="py-3 text-sm">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </main>
  );
}
