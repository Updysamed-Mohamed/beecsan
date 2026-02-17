'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  location: string;
  date: string;
  category: string;
  isFavorite?: boolean;
}

export default function ListingCard({
  id,
  title,
  price,
  image,
  location,
  date,
  category,
  isFavorite = false,
}: ListingCardProps) {
  return (
    // <Link href={`/listings/${id}`}>
    // <Link href={`/listings?id=${id}`}>
    <Link href="/listings?id=TEST_ID">
      <div className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="relative aspect-square bg-muted overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 backdrop-blur hover:bg-background"
            onClick={(e) => {
              e.preventDefault();
              // Handle favorite toggle
            }}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-destructive text-destructive' : ''}`} />
          </Button>
          <span className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            {category}
          </span>
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-sm mb-1 line-clamp-2">{title}</h3>
          <p className="text-primary font-bold text-lg mb-2">
            ${price.toLocaleString()}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{location}</span>
            <span>{date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
