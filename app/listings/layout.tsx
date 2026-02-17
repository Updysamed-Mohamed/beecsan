// // app/listings/[[...id]]/layout.tsx
// export async function generateStaticParams() {
//   return [{ id: [] }]; // Tani waxay oggolaanaysaa build-ka static-ga ah
// }

// export default function ListingLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return <>{children}</>;
// }

// app/listings/[[...id]]/layout.tsx

// ⛔ KAN TIRTIR (Sababta Error-ka waa kan): 
// export const dynamicParams = true; 

// ✅ KANNA SIDAAN U BADAL:
// export const dynamicParams = false; 

// export async function generateStaticParams() {
//   // Waxaan u sheegaynaa Next.js inuu dhaliyo hal waddo oo madhan.
//   // Maadaama dynamicParams ay tahay false, Next.js wuxuu oggolaan doonaa build-ka.
//   return [{ id: [] }]; 
// }

// export default function ListingLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return <>{children}</>;
// }

// app/listings/layout.tsx

export default function ListingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
