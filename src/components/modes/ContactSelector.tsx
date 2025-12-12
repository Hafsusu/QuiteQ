import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/colors';
import ContactsService, { Contact as RealContact } from '@/services/ContactsService';

export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  thumbnailPath?: string;
  email?: string;
}

interface ContactSelectorProps {
  selectedContactIds: string[];
  onContactsChange: (contactIds: string[]) => void;
  modeName: string;
}

export const ContactSelector: React.FC<ContactSelectorProps> = ({
  selectedContactIds,
  onContactsChange,
  modeName,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionChecked, setPermissionChecked] = useState(false);

  // Load contacts when component mounts or when picker opens
  useEffect(() => {
    if (showPicker && !permissionChecked) {
      loadContacts();
    }
  }, [showPicker]);

  // Filter contacts based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phoneNumber.includes(searchQuery)
      );
      setFilteredContacts(filtered);
    }
  }, [searchQuery, contacts]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const access = await ContactsService.checkContactsAccess();
      
      if (!access.hasPermission) {
        setError('Contacts permission is required to select contacts.');
        setPermissionChecked(true);
        return;
      }

      const realContacts = await ContactsService.getAllContacts();
      
      const mappedContacts: Contact[] = realContacts.map(contact => ({
        id: contact.id,
        name: contact.name,
        phoneNumber: contact.phoneNumber,
        thumbnailPath: contact.thumbnailPath,
        email: contact.email,
      }));

      setContacts(mappedContacts);
      setFilteredContacts(mappedContacts);
      setPermissionChecked(true);
    } catch (err: any) {
      console.error('Error loading contacts:', err);
      setError(err.message || 'Failed to load contacts');
      Alert.alert(
        'Contacts Error',
        'Unable to load contacts. Please check permissions and try again.',
        [{ text: 'OK', onPress: () => setShowPicker(false) }]
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleContact = (contactId: string) => {
    const newSelection = selectedContactIds.includes(contactId)
      ? selectedContactIds.filter(id => id !== contactId)
      : [...selectedContactIds, contactId];
    onContactsChange(newSelection);
  };

  const selectAllContacts = () => {
    onContactsChange(contacts.map(contact => contact.id));
  };

  const clearSelection = () => {
    onContactsChange([]);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const renderContactItem = ({ item }: { item: Contact }) => {
    const isSelected = selectedContactIds.includes(item.id);

    return (
      <TouchableOpacity
        style={[
          styles.contactItem,
          isSelected && styles.selectedContactItem,
        ]}
        onPress={() => toggleContact(item.id)}
      >
        {item.thumbnailPath ? (
          <Image source={{ uri: item.thumbnailPath }} style={styles.contactAvatarImage} />
        ) : (
          <View style={styles.contactAvatar}>
            <Text style={styles.contactInitials}>
              {getInitials(item.name)}
            </Text>
          </View>
        )}
        <View style={styles.contactDetails}>
          <Text style={[
            styles.contactName,
            isSelected && styles.selectedContactName,
          ]}>
            {item.name}
          </Text>
          <Text style={styles.contactPhone}>{item.phoneNumber}</Text>
          {item.email && (
            <Text style={styles.contactEmail}>{item.email}</Text>
          )}
        </View>
        {isSelected && (
          <Icon name="check-circle" size={20} color={COLORS.primary[500]} />
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={COLORS.primary[500]} />
          <Text style={styles.emptyStateText}>Loading contacts...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyState}>
          <Icon name="alert-circle" size={48} color={COLORS.error[500]} />
          <Text style={styles.emptyStateText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadContacts}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (searchQuery && filteredContacts.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Icon name="account-search" size={48} color={COLORS.gray[400]} />
          <Text style={styles.emptyStateText}>No matching contacts</Text>
          <Text style={styles.emptyStateSubtext}>Try a different search term</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Icon name="account-off" size={48} color={COLORS.gray[400]} />
        <Text style={styles.emptyStateText}>No contacts available</Text>
        <Text style={styles.emptyStateSubtext}>
          {permissionChecked 
            ? 'You don\'t have any contacts saved'
            : 'Checking contacts access...'
          }
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Allowed Contacts</Text>
      <Text style={styles.description}>
        {selectedContactIds.length > 0 
          ? `${selectedContactIds.length} contact${selectedContactIds.length > 1 ? 's' : ''} allowed`
          : `No contacts selected - ${modeName} will reply to everyone`
        }
      </Text>

      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setShowPicker(true)}
      >
        <View style={styles.selectorButtonContent}>
          <Icon name="account-group" size={20} color={COLORS.primary[500]} />
          <Text style={styles.selectorButtonText}>
            {selectedContactIds.length > 0
              ? `Manage ${selectedContactIds.length} contact${selectedContactIds.length > 1 ? 's' : ''}`
              : 'Select Contacts'
            }
          </Text>
        </View>
        <Icon name="chevron-right" size={20} color={COLORS.gray[400]} />
      </TouchableOpacity>

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
              <Text style={styles.modalTitle}>Select Contacts</Text>
              <View style={styles.modalHeaderActions}>
                <TouchableOpacity onPress={selectAllContacts}>
                  <Text style={styles.headerActionText}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={clearSelection}>
                  <Text style={styles.headerActionText}>None</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.searchContainer}>
              <Icon name="magnify" size={20} color={COLORS.gray[500]} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search contacts..."
                placeholderTextColor={COLORS.gray[400]}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Icon name="close-circle" size={20} color={COLORS.gray[500]} />
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={filteredContacts}
              keyExtractor={(item) => item.id}
              renderItem={renderContactItem}
              ListHeaderComponent={
                contacts.length > 0 ? (
                  <View style={styles.selectionSummary}>
                    <Text style={styles.selectionSummaryText}>
                      {selectedContactIds.length} of {contacts.length} contacts selected
                    </Text>
                  </View>
                ) : null
              }
              ListEmptyComponent={renderEmptyState}
              initialNumToRender={20}
              maxToRenderPerBatch={20}
              windowSize={5}
            />

            {selectedContactIds.length > 0 && (
              <View style={styles.selectedPreview}>
                <Text style={styles.selectedPreviewTitle}>Selected:</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.selectedScroll}
                >
                  {selectedContactIds.slice(0, 5).map(contactId => {
                    const contact = contacts.find(c => c.id === contactId);
                    return contact ? (
                      <View key={contact.id} style={styles.selectedContactBadge}>
                        {contact.thumbnailPath ? (
                          <Image 
                            source={{ uri: contact.thumbnailPath }} 
                            style={styles.selectedContactAvatarImage} 
                          />
                        ) : (
                          <View style={styles.selectedContactAvatar}>
                            <Text style={styles.selectedContactInitials}>
                              {getInitials(contact.name)}
                            </Text>
                          </View>
                        )}
                        <Text style={styles.selectedContactName} numberOfLines={1}>
                          {contact.name}
                        </Text>
                      </View>
                    ) : null;
                  })}
                  {selectedContactIds.length > 5 && (
                    <View style={styles.moreBadge}>
                      <Text style={styles.moreBadgeText}>
                        +{selectedContactIds.length - 5} more
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => setShowPicker(false)}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={() => setShowPicker(false)}
              >
                <Text style={styles.primaryButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  contactAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  
  selectedContactAvatarImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 4,
  },
  
  contactEmail: {
    fontSize: 12,
    color: COLORS.gray[500],
    marginTop: 2,
  },
  
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  
  emptyStateText: {
    fontSize: 16,
    color: COLORS.gray[600],
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.gray[500],
    textAlign: 'center',
  },
  
  retryButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary[500],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  selectorButton: {
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectorButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginLeft: 12,
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
    maxHeight: '85%',
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
  modalHeaderActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary[500],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[100],
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.text.primary,
    marginLeft: 8,
  },
  selectionSummary: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.gray[50],
  },
  selectionSummaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  selectedContactItem: {
    backgroundColor: COLORS.primary[50],
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInitials: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary[600],
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  emptyContacts: {
    padding: 40,
    alignItems: 'center',
  },
  emptyContactsText: {
    fontSize: 16,
    color: COLORS.gray[600],
    marginTop: 12,
    marginBottom: 4,
  },
  emptyContactsSubtext: {
    fontSize: 14,
    color: COLORS.gray[500],
    textAlign: 'center',
  },
  selectedPreview: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  selectedPreviewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  selectedScroll: {
    flexDirection: 'row',
  },
  selectedContactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedContactAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  selectedContactInitials: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  selectedContactName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary[600],
    maxWidth: 80,
  },
  moreBadge: {
    backgroundColor: COLORS.gray[200],
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    justifyContent: 'center',
  },
  moreBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gray[700],
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
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