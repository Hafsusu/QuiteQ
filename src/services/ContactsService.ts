import Contacts from 'react-native-contacts';
import PermissionsService from './PermissionsService';

export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  thumbnailPath?: string;
  email?: string;
}

class ContactsService {
  static async getAllContacts(): Promise<Contact[]> {
    try {
      const hasPermission = await PermissionsService.checkAndRequestContacts();
      
      if (!hasPermission) {
        throw new Error('Contacts permission not granted');
      }

      const contacts = await Contacts.getAll();
      
      return contacts
        .filter(contact => 
          contact.phoneNumbers && 
          contact.phoneNumbers.length > 0 &&
          contact.givenName
        )
        .map(contact => {
          const phoneNumber = contact.phoneNumbers[0]?.number || '';
          const formattedPhone = this.formatPhoneNumber(phoneNumber);
          
          const name = [
            contact.givenName,
            contact.middleName,
            contact.familyName,
          ]
            .filter(Boolean)
            .join(' ')
            .trim();

          return {
            id: contact.recordID,
            name: name || 'Unknown Contact',
            phoneNumber: formattedPhone,
            thumbnailPath: contact.thumbnailPath,
            email: contact.emailAddresses?.[0]?.email,
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name));
      
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  }

  static async searchContacts(query: string): Promise<Contact[]> {
    try {
      const hasPermission = await PermissionsService.checkAndRequestContacts();
      
      if (!hasPermission) {
        throw new Error('Contacts permission not granted');
      }

      const contacts = await Contacts.getContactsMatchingString(query);
      
      return contacts
        .filter(contact => 
          contact.phoneNumbers && 
          contact.phoneNumbers.length > 0
        )
        .map(contact => {
          const phoneNumber = contact.phoneNumbers[0]?.number || '';
          const formattedPhone = this.formatPhoneNumber(phoneNumber);
          
          const name = [
            contact.givenName,
            contact.middleName,
            contact.familyName,
          ]
            .filter(Boolean)
            .join(' ')
            .trim();

          return {
            id: contact.recordID,
            name: name || 'Unknown Contact',
            phoneNumber: formattedPhone,
            thumbnailPath: contact.thumbnailPath,
            email: contact.emailAddresses?.[0]?.email,
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name));
      
    } catch (error) {
      console.error('Error searching contacts:', error);
      throw error;
    }
  }

  static async getContactById(contactId: string): Promise<Contact | null> {
    try {
      const hasPermission = await PermissionsService.checkAndRequestContacts();
      
      if (!hasPermission) {
        throw new Error('Contacts permission not granted');
      }

      const contact = await Contacts.getContactById(contactId);
      
      if (!contact || !contact.phoneNumbers?.length) {
        return null;
      }

      const phoneNumber = contact.phoneNumbers[0]?.number || '';
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      const name = [
        contact.givenName,
        contact.middleName,
        contact.familyName,
      ]
        .filter(Boolean)
        .join(' ')
        .trim();

      return {
        id: contact.recordID,
        name: name || 'Unknown Contact',
        phoneNumber: formattedPhone,
        thumbnailPath: contact.thumbnailPath,
        email: contact.emailAddresses?.[0]?.email,
      };
      
    } catch (error) {
      console.error('Error getting contact by ID:', error);
      throw error;
    }
  }

  static formatPhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/\D/g, '');
  }

  static async checkContactsAccess(): Promise<{
    hasPermission: boolean;
    error?: string;
  }> {
    try {
      const hasPermission = await PermissionsService.checkAndRequestContacts();
      return { hasPermission };
    } catch (error: any) {
      return {
        hasPermission: false,
        error: error.message || 'Unknown error checking contacts access',
      };
    }
  }
}

export default ContactsService;