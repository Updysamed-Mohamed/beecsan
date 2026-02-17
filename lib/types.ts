// export interface User {
//   id: any;
//   displayName: string;
//   uid: string;
//   email: string;
//   fullName: string;
//   phoneNumber?: string;
//   location?: string;
//   profilePicUrl?: string;
//   bio?: string;
//   role: 'buyer' | 'seller' | 'admin'; // ✅ Waxaan ku darnay 'admin' halkan
//   rating: number;
//   totalProducts: number;
//   completedSales: number;
//   isVerified: boolean;
//   createdAt: any; // ✅ Firebase Timestamp darteed, 'any' ama 'Date' ayaa loo isticmaalaa
//   updatedAt?: any;
// }

// export interface Product {
//   id: string;
//   sellerId: string;
//   sellerName: string;
//   sellerProfilePic?: string;
//   sellerRating: number;
//   title: string;
//   description: string;
//   price: number;
//   category: string;
//   condition?: string;
//   region?: string;
//   city: string;
//   image_urls: string[];
//   specifications?: string[];
//   status: 'available' | 'sold' | 'disabled';
//   views: number;
//   favorites: number;
//   location: string;
//   isNegotiable: boolean;
//   brand?: string;
//   model?: string;
//   size?: string;
//   created_at: any;
//   updated_at?: any;
//   buyerId?: string;
//   soldAt?: any;
// }

// export interface Chat {
//   id: string;
//   participants: string[];
//   lastMessage: string;
//   lastTime: any;
//   productId?: string;
//   productImage?: string;
//   isDeleted: boolean;
// }

// export interface Message {
//   id: string;
//   senderId: string;
//   text: string;
//   timestamp: any;
//   status: 'sent' | 'delivered' | 'read';
//   isDeleted: boolean;
// }

export interface User {
  status: string;
  id: any;
  displayName: string;
  uid: string;
  email: string;
  fullName: string;
  // CHANGED: Aligned with your Firestore screenshot which shows 'phone'
  phone?: string; 
  phoneNumber?: string; // Kept for backward compatibility
  location?: string;
  profilePicUrl?: string;
  bio?: string;
  role: 'buyer' | 'seller' | 'admin' | 'user'; 
  rating: number;
  totalProducts: number;
  completedSales: number;
  isVerified: boolean;
  createdAt: any; 
  updatedAt?: any;
  // ADDED: These fix the "Property does not exist on type User" errors
  activeAds?: number;
  expiredAds?: number;
}

export interface Product {
  subcategory: string;
  visibility: string;
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
  status: 'approved' | 'sold' | 'disabled';
  views: number;
  favorites: number;
  location: string;
  isNegotiable: boolean;
  brand?: string;
  model?: string;
  size?: string;
  created_at: any;
  updated_at?: any;
  buyerId?: string;
  soldAt?: any;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage: string;
  lastTime: any;
  productId?: string;
  productImage?: string;
  isDeleted: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: any;
  status: 'sent' | 'delivered' | 'read';
  isDeleted: boolean;
}

