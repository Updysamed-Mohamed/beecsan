Beecsan Platform

Developer: Abdisamed Mohamed
Repo: GitHub Repository

Stack: Next.js 16, React, TypeScript, Firebase, Supabase, Capacitor (Android/iOS)

Setup & Deployment
Clone repository
git clone https://github.com/Updysamed-Mohamed/beecsan.git
cd beecsan

Install dependencies
npm install
# or pnpm install

Environment variables

Create .env.local:

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyA0x7VDWrVa6SpSshasza2ChSTafpWsMVY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=suuqsomdb.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=suuqsomdb
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=suuqsomdb.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=891601258056
NEXT_PUBLIC_FIREBASE_APP_ID=1:891601258056:web:e8c2413253edfa252b7a7d

NEXT_PUBLIC_SUPABASE_URL=https://rmbcxivvnhlyseaywiuk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtYmN4aXZ2bmhseXNlYXl3aXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1Njc4MzgsImV4cCI6MjA4NTE0MzgzOH0.-CFVq2SBwlFX4MuJDcDD4bfoplvMM7Dxj_uv3-ZKANE

Run locally
npm run dev

Build production
npm run build
npm run start

Android (Capacitor)
npx cap sync android
npx cap open android

10. Handover Checklist

 Source code pushed

 README & Deployment Guide

 Secrets excluded (.env.local, google-services.json)

 Project can be built locally

Developer: Abdisamed Mohamed
Email: contact@updysamed.com

GitHub: https://github.com/Updysamed-Mohamed
