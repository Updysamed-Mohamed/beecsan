export interface User {
  uid: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  location?: string;
  profilePicUrl?: string;
  bio?: string;
  role: 'buyer' | 'seller';
  rating: number;
  totalProducts: number;
  completedSales: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerProfilePic?: string;
  sellerRating: number;
  title: string;
  description: string;
  price: number;
  category: string;
  condition?: string;
  region?: string;
  city: string;
  image_urls: string[];
  specifications?: string[];
  status: 'available' | 'sold' | 'disabled';
  views: number;
  favorites: number;
  location: string;
  isNegotiable: boolean;
  brand?: string;
  model?: string;
  size?: string;
  created_at: Date;
  updated_at?: Date;
  buyerId?: string;
  soldAt?: Date;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage: string;
  lastTime: Date;
  productId?: string;
  productImage?: string;
  isDeleted: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  isDeleted: boolean;
}
