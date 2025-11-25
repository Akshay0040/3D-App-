import { PermissionsAndroid, Platform, Alert } from 'react-native';

export const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      ];

      const granted = await PermissionsAndroid.requestMultiple(permissions);
      
      // Check if all permissions are granted
      const allGranted = Object.values(granted).every(
        result => result === PermissionsAndroid.RESULTS.GRANTED
      );

      return allGranted;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  
  // For iOS, you'll need to implement specific permission requests
  return true;
};