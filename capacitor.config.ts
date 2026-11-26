import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ar.medirecord.app',
  appName: 'MediRecord',
  webDir: 'dist',
  plugins: {
    LocalNotifications: {
      iconColor: '#0F5C52',
    },
  },
};

export default config;
