import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-telephony-module' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const TelephonyModule = NativeModules.TelephonyModule
  ? NativeModules.TelephonyModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export interface CallEvent {
  phoneNumber: string;
  callState: 'RINGING' | 'IDLE' | 'OFFHOOK';
  timestamp: number;
}

export interface TelephonyConfig {
  autoReplyEnabled: boolean;
  defaultMessage: string;
  replyToContactsOnly: boolean;
  vibrateOnly: boolean;
}

export class TelephonyService {
  static async initialize(): Promise<boolean> {
    try {
      return await TelephonyModule.initialize();
    } catch (error) {
      console.error('Failed to initialize telephony module:', error);
      return false;
    }
  }

  static async startListening(config: TelephonyConfig): Promise<boolean> {
    try {
      return await TelephonyModule.startListening(config);
    } catch (error) {
      console.error('Failed to start telephony listener:', error);
      return false;
    }
  }

  static async stopListening(): Promise<boolean> {
    try {
      return await TelephonyModule.stopListening();
    } catch (error) {
      console.error('Failed to stop telephony listener:', error);
      return false;
    }
  }

  static async sendSMS(phoneNumber: string, message: string): Promise<boolean> {
    try {
      if (Platform.OS !== 'android') {
        console.warn('SMS sending only available on Android');
        return false;
      }
      return await TelephonyModule.sendSMS(phoneNumber, message);
    } catch (error) {
      console.error('Failed to send SMS:', error);
      return false;
    }
  }

  static async checkPermissions(): Promise<{
    readPhoneState: boolean;
    sendSMS: boolean;
  }> {
    try {
      if (Platform.OS !== 'android') {
        return { readPhoneState: false, sendSMS: false };
      }
      return await TelephonyModule.checkPermissions();
    } catch (error) {
      console.error('Failed to check permissions:', error);
      return { readPhoneState: false, sendSMS: false };
    }
  }

  static async requestPermissions(): Promise<{
    readPhoneState: boolean;
    sendSMS: boolean;
  }> {
    try {
      if (Platform.OS !== 'android') {
        return { readPhoneState: false, sendSMS: false };
      }
      return await TelephonyModule.requestPermissions();
    } catch (error) {
      console.error('Failed to request permissions:', error);
      return { readPhoneState: false, sendSMS: false };
    }
  }

  static async setSilentMode(enabled: boolean): Promise<boolean> {
    try {
      if (Platform.OS !== 'android') {
        return false;
      }
      return await TelephonyModule.setSilentMode(enabled);
    } catch (error) {
      console.error('Failed to set silent mode:', error);
      return false;
    }
  }

  static async startForegroundService(title: string, message: string): Promise<boolean> {
    try {
      if (Platform.OS !== 'android') {
        return false;
      }
      return await TelephonyModule.startForegroundService(title, message);
    } catch (error) {
      console.error('Failed to start foreground service:', error);
      return false;
    }
  }

  static async stopForegroundService(): Promise<boolean> {
    try {
      if (Platform.OS !== 'android') {
        return false;
      }
      return await TelephonyModule.stopForegroundService();
    } catch (error) {
      console.error('Failed to stop foreground service:', error);
      return false;
    }
  }
}

export default TelephonyService;