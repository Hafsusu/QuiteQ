import Geolocation from 'react-native-geolocation-service';
import PermissionsService from './PermissionsService';

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number | null;
  speed?: number | null;
  timestamp?: number;
}

export interface SavedLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  radius: number;
  timestamp: number;
}

class LocationService {
  static async getCurrentLocation(): Promise<Location> {
    try {
      const hasPermission = await PermissionsService.checkAndRequestLocation();
      
      if (!hasPermission) {
        throw new Error('Location permission not granted');
      }

      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy ?? null,
            altitude: position.coords.altitude ?? null,
            speed: position.coords.speed ?? null,
              timestamp: position.timestamp,
            });
          },
          (error) => {
            reject(new Error(`Geolocation error: ${error.message}`));
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          }
        );
      });
    } catch (error) {
      console.error('Error getting current location:', error);
      throw error;
    }
  }

  static async watchLocation(
    onLocationUpdate: (location: Location) => void,
    onError?: (error: Error) => void
  ): Promise<number> {
    try {
      const hasPermission = await PermissionsService.checkAndRequestLocation();
      
      if (!hasPermission) {
        throw new Error('Location permission not granted');
      }

      return Geolocation.watchPosition(
        (position) => {
          onLocationUpdate({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            speed: position.coords.speed,
            timestamp: position.timestamp,
          });
        },
        (error) => {
          if (onError) {
            onError(new Error(`Geolocation watch error: ${error.message}`));
          }
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 10,
          interval: 10000,
          fastestInterval: 5000,
        }
      );
    } catch (error) {
      console.error('Error watching location:', error);
      throw error;
    }
  }

  static stopWatchingLocation(watchId: number): void {
    Geolocation.clearWatch(watchId);
  }

  static async getAddressFromCoordinates(
    latitude: number,
    longitude: number
  ): Promise<string> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const address = data.address;
      const addressParts = [];
      
      if (address.road) addressParts.push(address.road);
      if (address.suburb) addressParts.push(address.suburb);
      if (address.city || address.town || address.village) {
        addressParts.push(address.city || address.town || address.village);
      }
      if (address.state) addressParts.push(address.state);
      if (address.country) addressParts.push(address.country);
      
      return addressParts.join(', ') || 'Unknown location';
    } catch (error) {
      console.error('Error getting address:', error);
      return `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
    }
  }

  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
  }

  static isWithinRadius(
    currentLat: number,
    currentLon: number,
    targetLat: number,
    targetLon: number,
    radius: number
  ): boolean {
    const distance = this.calculateDistance(
      currentLat,
      currentLon,
      targetLat,
      targetLon
    );
    return distance <= radius;
  }

  static async checkLocationAccess(): Promise<{
    hasPermission: boolean;
    error?: string;
  }> {
    try {
      const hasPermission = await PermissionsService.checkAndRequestLocation();
      return { hasPermission };
    } catch (error: any) {
      return {
        hasPermission: false,
        error: error.message || 'Unknown error checking location access',
      };
    }
  }
}

export default LocationService;