// import type { CapacitorConfig } from '@capacitor/cli';

// const config: CapacitorConfig = {
//   appId: 'com.example.suuq_som',
//   appName: 'Beecsan',
//   webDir: 'public',
//   server: {
//     url: 'https://beecsan.vercel.app',
//     cleartext: false,
//   },
// };

// export default config;

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.suuq_som',
  appName: 'Beecsan',
  webDir: 'out',
  // bundledWebRuntime: false,
  server: {
    // Tani waxay ka caawinaysaa Next.js inuu boggaga u furo sidii URL caadi ah
    androidScheme: 'https',
    hostname: 'localhost' 
  }
};

export default config;