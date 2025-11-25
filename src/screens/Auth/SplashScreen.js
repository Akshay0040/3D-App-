import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { Colors } from '../../constants/colors';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Auto navigate after 2 seconds
    const timer = setTimeout(() => {
      // For now, directly go to login
      // In real app, check if user needs to login or go to home
      navigation.replace('Login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  const handleQuickNavigate = (screen) => {
    navigation.replace(screen);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoSection}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>👥</Text>
        </View>
        <Text style={styles.appName}>Smart Contacts</Text>
        <Text style={styles.tagline}>Smart Contacts, Smarter Connections</Text>
      </View>

      {/* Quick Navigation (for development) */}
      {/* <View style={styles.quickNav}>
        <Text style={styles.quickNavTitle}>Quick Navigation:</Text>
        <View style={styles.quickNavButtons}>
          <TouchableOpacity 
            style={styles.quickNavButton}
            onPress={() => handleQuickNavigate('Login')}
          >
            <Text style={styles.quickNavText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickNavButton}
            onPress={() => handleQuickNavigate('Registration')}
          >
            <Text style={styles.quickNavText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontSize: 50,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: Colors.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  quickNav: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  quickNavTitle: {
    textAlign: 'center',
    color: Colors.gray,
    marginBottom: 10,
    fontSize: 12,
  },
  quickNavButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickNavButton: {
    padding: 10,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
  },
  quickNavText: {
    color: Colors.primary,
    fontSize: 12,
  },
});

export default SplashScreen;