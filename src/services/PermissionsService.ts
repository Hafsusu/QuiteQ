import { Platform } from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  PermissionStatus,
} from 'react-native-permissions';

class PermissionsService {
  static async checkContactsPermission(): Promise<PermissionStatus> {
    const permission = Platform.select({
      ios: PERMISSIONS.IOS.CONTACTS,
      android: PERMISSIONS.ANDROID.READ_CONTACTS,
    }) as any;
    
    return await check(permission);
  }

  static async requestContactsPermission(): Promise<PermissionStatus> {
    const permission = Platform.select({
      ios: PERMISSIONS.IOS.CONTACTS,
      android: PERMISSIONS.ANDROID.READ_CONTACTS,
    }) as any;
    
    return await request(permission);
  }

  static async checkLocationPermission(): Promise<PermissionStatus> {
    const permission = Platform.select({
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    }) as any;
    
    return await check(permission);
  }

  static async requestLocationPermission(): Promise<PermissionStatus> {
    const permission = Platform.select({
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    }) as any;
    
    return await request(permission);
  }

  static async checkAndRequestContacts(): Promise<boolean> {
    const status = await this.checkContactsPermission();
    
    if (status === RESULTS.GRANTED) {
      return true;
    }
    
    if (status === RESULTS.DENIED || status === RESULTS.LIMITED) {
      const requestedStatus = await this.requestContactsPermission();
      return requestedStatus === RESULTS.GRANTED;
    }
    
    return false;
  }

  static async checkAndRequestLocation(): Promise<boolean> {
    const status = await this.checkLocationPermission();
    
    if (status === RESULTS.GRANTED) {
      return true;
    }
    
    if (status === RESULTS.DENIED || status === RESULTS.LIMITED) {
      const requestedStatus = await this.requestLocationPermission();
      return requestedStatus === RESULTS.GRANTED;
    }
    
    return false;
  }
}

export default PermissionsService;