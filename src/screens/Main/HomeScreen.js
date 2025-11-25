import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { Colors } from '../../constants/colors';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome to</Text>
        <Text style={styles.appName}>Smart Contacts</Text>
        <Text style={styles.tagline}>Smart Contacts, Smarter Connections</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.placeholder}>
          Home Screen - To be implemented
        </Text>
        <Text style={styles.subText}>
          Your main app content will appear here
        </Text>
      </View>

      <View style={styles.demoActions}>
        <TouchableOpacity 
          style={styles.demoButton}
          onPress={() => navigation.navigate('Auth')}
        >
          <Text style={styles.demoButtonText}>Back to Auth Flow</Text>
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
  header: {
    backgroundColor: Colors.primary,
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  welcome: {
    color: Colors.white,
    fontSize: 18,
    marginBottom: 8,
  },
  appName: {
    color: Colors.white,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagline: {
    color: '#93c5fd',
    fontSize: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholder: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
  demoActions: {
    padding: 20,
    paddingBottom: 30,
  },
  demoButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  demoButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;