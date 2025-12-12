import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/colors';
import LocationService from '@/services/LocationService';
import PermissionsService from '@/services/PermissionsService';

export interface SavedLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
  timestamp: number;
}

interface LocationPickerProps {
  selectedLocationId?: string;
  savedLocations: SavedLocation[];
  onLocationSelect: (locationId?: string) => void;
  onSaveLocation: (location: Omit<SavedLocation, 'id' | 'timestamp'>) => void;
  onDeleteLocation?: (locationId: string) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  selectedLocationId,
  savedLocations,
  onLocationSelect,
  onSaveLocation,
  onDeleteLocation,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gettingCurrentLocation, setGettingCurrentLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [newLocation, setNewLocation] = useState({
    name: '',
    address: '',
    radius: 100, // meters
    latitude: 0,
    longitude: 0,
  });

  const selectedLocation = savedLocations.find(loc => loc.id === selectedLocationId);

  const handleGetCurrentLocation = async () => {
    try {
      setGettingCurrentLocation(true);
      setLocationError(null);
      
      // Check location permission
      const hasPermission = await PermissionsService.checkAndRequestLocation();
      
      if (!hasPermission) {
        Alert.alert(
          'Location Permission Required',
          'Please enable location services to use your current location.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Get current location
      const location = await LocationService.getCurrentLocation();
      
      // Get address from coordinates
      const address = await LocationService.getAddressFromCoordinates(
        location.latitude,
        location.longitude
      );

      setNewLocation(prev => ({
        ...prev,
        latitude: location.latitude,
        longitude: location.longitude,
        address: address,
        name: address.split(',')[0] || 'Current Location', // Use first part of address as name
      }));

    } catch (error: any) {
      console.error('Error getting current location:', error);
      setLocationError(error.message || 'Failed to get current location');
      
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please make sure location services are enabled.',
        [{ text: 'OK' }]
      );
    } finally {
      setGettingCurrentLocation(false);
    }
  };

  const handleAddLocation = async () => {
    if (!newLocation.name.trim()) {
      Alert.alert('Error', 'Please enter a location name');
      return;
    }

    if (newLocation.latitude === 0 && newLocation.longitude === 0) {
      Alert.alert('Error', 'Please set a location first');
      return;
    }

    try {
      setLoading(true);
      
      // If address is empty, try to get it from coordinates
      let address = newLocation.address;
      if (!address.trim() || address.includes('Lat:')) {
        address = await LocationService.getAddressFromCoordinates(
          newLocation.latitude,
          newLocation.longitude
        );
      }

      const locationToSave = {
        ...newLocation,
        address,
        timestamp: Date.now(),
      };

      onSaveLocation(locationToSave);
      
      // Reset form
      setNewLocation({
        name: '',
        address: '',
        radius: 100,
        latitude: 0,
        longitude: 0,
      });
      setLocationError(null);
      setShowAddModal(false);
      
      Alert.alert('Success', 'Location saved successfully');
      
    } catch (error) {
      console.error('Error saving location:', error);
      Alert.alert('Error', 'Failed to save location');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLocation = (locationId: string) => {
    Alert.alert(
      'Delete Location',
      'Are you sure you want to delete this location?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (onDeleteLocation) {
              onDeleteLocation(locationId);
            }
            if (selectedLocationId === locationId) {
              onLocationSelect(undefined);
            }
          },
        },
      ]
    );
  };

  const renderLocationItem = ({ item }: { item: SavedLocation }) => {
    const isSelected = selectedLocationId === item.id;
    const distance = LocationService.calculateDistance(
      newLocation.latitude || 0,
      newLocation.longitude || 0,
      item.latitude,
      item.longitude
    );

    return (
      <TouchableOpacity
        style={[
          styles.locationItem,
          isSelected && styles.selectedLocationItem,
        ]}
        onPress={() => {
          onLocationSelect(item.id);
          setShowPicker(false);
        }}
        onLongPress={() => handleDeleteLocation(item.id)}
      >
        <View style={styles.locationIconContainer}>
          <Icon 
            name="map-marker" 
            size={20} 
            color={isSelected ? COLORS.primary[500] : COLORS.gray[500]} 
          />
        </View>
        <View style={styles.locationDetails}>
          <Text style={[
            styles.locationName,
            isSelected && styles.selectedLocationName,
          ]}>
            {item.name}
          </Text>
          <Text style={styles.locationAddress}>{item.address}</Text>
          <View style={styles.locationMeta}>
            <Text style={styles.locationMetaText}>
              Radius: {item.radius}m
            </Text>
            {newLocation.latitude !== 0 && newLocation.longitude !== 0 && (
              <Text style={styles.locationDistance}>
                {distance < 1000 
                  ? `${Math.round(distance)}m away` 
                  : `${(distance / 1000).toFixed(1)}km away`
                }
              </Text>
            )}
          </View>
        </View>
        {isSelected && (
          <Icon name="check-circle" size={20} color={COLORS.primary[500]} />
        )}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteLocation(item.id)}
        >
          <Icon name="delete-outline" size={18} color={COLORS.gray[500]} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location Settings</Text>
      
      {/* Current Selection */}
      <TouchableOpacity
        style={styles.currentLocation}
        onPress={() => setShowPicker(true)}
      >
        <View style={styles.currentLocationContent}>
          <Icon name="map-marker" size={20} color={COLORS.primary[500]} />
          <View style={styles.currentLocationText}>
            <Text style={styles.currentLocationName}>
              {selectedLocation ? selectedLocation.name : 'Select a location'}
            </Text>
            <Text style={styles.currentLocationAddress}>
              {selectedLocation ? selectedLocation.address : 'Tap to choose location'}
            </Text>
            {selectedLocation && (
              <Text style={styles.currentLocationRadius}>
                Activation radius: {selectedLocation.radius}m
              </Text>
            )}
          </View>
        </View>
        <Icon name="chevron-right" size={20} color={COLORS.gray[400]} />
      </TouchableOpacity>

      {/* Location Picker Modal */}
      <Modal
        visible={showPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Icon name="close" size={24} color={COLORS.gray[500]} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Select Location</Text>
              <TouchableOpacity onPress={() => setShowAddModal(true)}>
                <Icon name="plus" size={24} color={COLORS.primary[500]} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={savedLocations}
              keyExtractor={(item) => item.id}
              renderItem={renderLocationItem}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Icon name="map-marker-off" size={48} color={COLORS.gray[400]} />
                  <Text style={styles.emptyText}>No locations saved</Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowAddModal(true)}
                  >
                    <Text style={styles.addButtonText}>Add First Location</Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>
        </View>
      </Modal>

      {/* Add Location Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Icon name="close" size={24} color={COLORS.gray[500]} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Add Location</Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={styles.addLocationForm}>
              {/* Current Location Button */}
              <TouchableOpacity
                style={styles.useCurrentButton}
                onPress={handleGetCurrentLocation}
                disabled={gettingCurrentLocation}
              >
                {gettingCurrentLocation ? (
                  <ActivityIndicator size="small" color={COLORS.primary[500]} />
                ) : (
                  <Icon name="crosshairs-gps" size={20} color={COLORS.primary[500]} />
                )}
                <Text style={styles.useCurrentButtonText}>
                  {gettingCurrentLocation ? 'Getting Location...' : 'Use Current Location'}
                </Text>
              </TouchableOpacity>

              {locationError && (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle" size={16} color={COLORS.error[500]} />
                  <Text style={styles.errorText}>{locationError}</Text>
                </View>
              )}

              {/* Coordinates Display */}
              {(newLocation.latitude !== 0 || newLocation.longitude !== 0) && (
                <View style={styles.coordinatesContainer}>
                  <Text style={styles.coordinatesText}>
                    Coordinates: {newLocation.latitude.toFixed(6)}, {newLocation.longitude.toFixed(6)}
                  </Text>
                </View>
              )}

              <TextInput
                style={styles.input}
                placeholder="Location name (e.g., Mosque, Office)"
                placeholderTextColor={COLORS.gray[400]}
                value={newLocation.name}
                onChangeText={(text) => setNewLocation(prev => ({ ...prev, name: text }))}
              />
              
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="Address (auto-filled from location)"
                placeholderTextColor={COLORS.gray[400]}
                multiline
                numberOfLines={2}
                value={newLocation.address}
                onChangeText={(text) => setNewLocation(prev => ({ ...prev, address: text }))}
              />
              
              {/* Radius Selection */}
              <View style={styles.radiusContainer}>
                <Text style={styles.radiusLabel}>
                  Activation Radius: {newLocation.radius}m
                </Text>
                <View style={styles.radiusSlider}>
                  {[50, 100, 200, 500, 1000].map((radius) => (
                    <TouchableOpacity
                      key={radius}
                      style={[
                        styles.radiusOption,
                        newLocation.radius === radius && styles.selectedRadiusOption,
                      ]}
                      onPress={() => setNewLocation(prev => ({ ...prev, radius }))}
                    >
                      <Text style={[
                        styles.radiusOptionText,
                        newLocation.radius === radius && styles.selectedRadiusOptionText,
                      ]}>
                        {radius}m
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={styles.secondaryButton}
                  onPress={() => setShowAddModal(false)}
                  disabled={loading}
                >
                  <Text style={styles.secondaryButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.primaryButton,
                    loading && styles.primaryButtonDisabled,
                  ]}
                  onPress={handleAddLocation}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Save Location</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
   locationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  
  locationMetaText: {
    fontSize: 12,
    color: COLORS.gray[600],
  },
  
  locationDistance: {
    fontSize: 12,
    color: COLORS.success[600],
    fontWeight: '600',
  },
  
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  
  currentLocationRadius: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error[500],
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  
  errorText: {
    fontSize: 14,
    color: COLORS.error[600],
    flex: 1,
  },
  
  coordinatesContainer: {
    backgroundColor: COLORS.gray[50],
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  
  coordinatesText: {
    fontSize: 12,
    color: COLORS.gray[700],
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  currentLocation: {
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentLocationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  currentLocationText: {
    marginLeft: 12,
    flex: 1,
  },
  currentLocationName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  currentLocationAddress: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background.light,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  selectedLocationItem: {
    backgroundColor: COLORS.primary[50],
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationDetails: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  selectedLocationName: {
    color: COLORS.primary[600],
  },
  locationAddress: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 2,
  },
  locationRadius: {
    fontSize: 12,
    color: COLORS.gray[600],
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray[600],
    marginTop: 12,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: COLORS.primary[500],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  addLocationForm: {
    padding: 20,
  },
  input: {
    backgroundColor: COLORS.gray[100],
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  radiusContainer: {
    marginBottom: 20,
  },
  radiusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  radiusSlider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radiusOption: {
    backgroundColor: COLORS.gray[100],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  selectedRadiusOption: {
    backgroundColor: COLORS.primary[500],
  },
  radiusOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gray[700],
  },
  selectedRadiusOptionText: {
    color: '#fff',
  },
  useCurrentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gray[100],
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  useCurrentButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary[500],
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.primary[500],
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: COLORS.gray[100],
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.gray[700],
    fontSize: 16,
    fontWeight: '600',
  },
});