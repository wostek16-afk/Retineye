import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.retineye.app',
  appName: 'RetinaScore',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    Preferences: {},
  },
};

export default config;
