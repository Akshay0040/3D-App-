import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  StatusBar
} from 'react-native';
import { Colors } from '../../constants/colors';
import { requestPermissions } from '../../utils/permissions';

const PermissionScreen = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const userData = route.params?.userData || {};

  const permissionsList = [
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Receive important updates and alerts',
      icon: '🔔',
      required: true
    },
    {
      id: 'camera',
      title: 'Camera',
      description: 'Scan business cards and QR codes',
      icon: '📷',
      required: false
    },
    {
      id: 'contacts',
      title: 'Contacts',
      description: 'Sync and manage your contacts efficiently',
      icon: '👥',
      required: true
    },
    {
      id: 'messages',
      title: 'Messages',
      description: 'Send automated messages and reminders',
      icon: '💬',
      required: false
    }
  ];

  const handleAllowPermissions = async () => {
    setIsLoading(true);
    try {
      const permissionsGranted = await requestPermissions();
      
      if (permissionsGranted) {
        // Navigate to OTP Verification
        navigation.navigate('OTPVerification', {
          userData: userData
        });
      } else {
        Alert.alert(
          'Permissions Required',
          'Some permissions are required for the app to function properly. Please allow them to continue.',
          [
            {
              text: 'Try Again',
              onPress: () => handleAllowPermissions()
            },
            {
              text: 'Continue Anyway',
              onPress: () => navigation.navigate('OTPVerification', { userData })
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to request permissions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigation.navigate('OTPVerification', {
      userData: userData
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>App Permissions</Text>
          <Text style={styles.subtitle}>
            Grant permissions to unlock all features of Smart Contacts
          </Text>
        </View>

        {/* Permissions List */}
        <View style={styles.permissionsList}>
          {permissionsList.map((permission, index) => (
            <View key={permission.id} style={styles.permissionItem}>
              <View style={styles.permissionIcon}>
                <Text style={styles.iconText}>{permission.icon}</Text>
              </View>
              <View style={styles.permissionInfo}>
                <Text style={styles.permissionTitle}>
                  {permission.title}
                  {permission.required && (
                    <Text style={styles.required}> • Required</Text>
                  )}
                </Text>
                <Text style={styles.permissionDescription}>
                  {permission.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 You can change these permissions later in your device settings
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.allowButton,
            isLoading && styles.allowButtonDisabled
          ]}
          onPress={handleAllowPermissions}
          disabled={isLoading}
        >
          <Text style={styles.allowButtonText}>
            {isLoading ? 'Requesting...' : 'Allow All Permissions'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 24,
    color: Colors.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondary,
    lineHeight: 22,
  },
  permissionsList: {
    padding: 20,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  permissionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
  },
  permissionInfo: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 4,
  },
  required: {
    color: Colors.error,
    fontSize: 14,
  },
  permissionDescription: {
    fontSize: 14,
    color: Colors.gray,
    lineHeight: 18,
  },
  infoBox: {
    backgroundColor: '#f0f9ff',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  infoText: {
    fontSize: 14,
    color: Colors.primary,
    lineHeight: 20,
  },
  actions: {
    padding: 20,
    paddingBottom: 30,
  },
  allowButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  allowButtonDisabled: {
    opacity: 0.6,
  },
  allowButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    padding: 16,
  },
  skipButtonText: {
    textAlign: 'center',
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default PermissionScreen;