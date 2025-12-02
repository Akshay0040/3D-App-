import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Button, InputField, Header } from '../../components/common';
import AuthService from '../../services/authService';
import { 
  validateRegistrationForm,
  getFirebaseAuthErrorMessage 
} from '../../utils/validators';

const RegistrationScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    console.log(`Field ${field} changed: ${value}`);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleBlur = (field) => {
    console.log(`Field ${field} blurred`);
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleRegistration = async () => {
     console.log('Registration button clicked');
    // Validate form
    const validation = validateRegistrationForm(
      formData.email,
      formData.phone,
      formData.password,
      formData.confirmPassword
    );

    console.log('Validation result:', validation);
    
    if (!validation.isValid) {
      console.log('Form validation errors:', validation.errors);
      setErrors(validation.errors);
      // Mark all fields as touched to show errors
      setTouched({
        email: true,
        phone: true,
        password: true,
        confirmPassword: true
      });
      Alert.alert(
        'Validation Error',
        Object.values(validation.errors).join('\n'),
        [{ text: 'OK' }]
      );
      return;
    }
     console.log('Calling AuthService...');
    setIsLoading(true);
    
    try {
      console.log('Registration data:', {
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      })

      const result = await AuthService.signUpWithEmail(
        formData.email, 
        formData.password, 
        formData.phone
      );
      console.log('AuthService result:', result);
      
      if (result.success) {
        Alert.alert(
          'Success!', 
          'Account created successfully! Please check your email for verification.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login', {
                userData: formData
              })
            }
          ]
        );
      } else {
        // Handle Firebase errors
        const errorMessage = getFirebaseAuthErrorMessage(result.errorCode) || result.error;
         console.log('Registration failed:', errorMessage);
        Alert.alert('Registration Failed', errorMessage);
      }
    } catch (error) {
      console.log('Registration error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Header onBackPress={() => navigation.goBack()} />

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join Smart Contacts for smarter connections
            </Text>
          </View>

          <View style={styles.form}>
            {/* Email Input */}
            <InputField
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              onBlur={() => handleBlur('email')}
              error={touched.email && errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              required
            />

            {/* Phone Input */}
            <InputField
              label="Phone Number"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              onBlur={() => handleBlur('phone')}
              error={touched.phone && errors.phone}
              keyboardType="phone-pad"
              autoComplete="tel"
              required
            />

            {/* Password Input */}
            <InputField
              label="Password"
              placeholder="Create a password"
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
              onBlur={() => handleBlur('password')}
              error={touched.password && errors.password}
              secureTextEntry
              autoComplete="password"
              required
            />

            {/* Confirm Password Input */}
            <InputField
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={(text) => handleInputChange('confirmPassword', text)}
              onBlur={() => handleBlur('confirmPassword')}
              error={touched.confirmPassword && errors.confirmPassword}
              secureTextEntry
              autoComplete="password"
              required
            />

            <View style={styles.buttonContainer}>
              <Button
                title={isLoading ? 'Creating Account...' : 'Create Account'}
                onPress={handleRegistration}
                loading={isLoading}
                disabled={isLoading}
                style={styles.createButton}
                textStyle={styles.createButtonText}
                fullWidth
              />
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>
                Already have an account?{' '}
              </Text>
              <Button
                title="Sign In"
                variant="outline"
                size="small"
                onPress={() => navigation.navigate('Login')}
                style={styles.signInButton}
                textStyle={styles.signInButtonText}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondary,
    lineHeight: 22,
    textAlign: 'center',
  },
  form: {
    padding: 20,
    paddingTop: 10,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: Colors.primary,
  },
  createButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: 15,
    color: Colors.gray,
    fontSize: 14,
    fontWeight: '500',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  signInText: {
    color: Colors.secondary,
    fontSize: 16,
  },
  signInButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    height: 'auto',
  },
  signInButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RegistrationScreen;