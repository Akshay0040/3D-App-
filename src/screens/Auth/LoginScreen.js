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
import { Button, InputField } from '../../components/common';
import AuthService from '../../services/authService';
import { 
  validateLoginForm,
  getFirebaseAuthErrorMessage 
} from '../../utils/validators';

const LoginScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleLogin = async () => {
    // Validate form
    const validation = validateLoginForm(formData.emailOrPhone, formData.password);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      setTouched({
        emailOrPhone: true,
        password: true
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Determine if input is email or phone
      const isEmail = formData.emailOrPhone.includes('@');
      let email = formData.emailOrPhone;
      
      if (!isEmail) {
        // Convert phone to email format for Firebase
        email = `${formData.emailOrPhone}@smartcontacts.com`;
      }

      const result = await AuthService.signInWithEmail(email, formData.password);
      
      if (result.success) {
        console.log('Login successful:', result.user);
        
        navigation.navigate('OTPVerification', {
          userData: {
            email: email,
            phone: formData.emailOrPhone
          }
        });
      } else {
        const errorMessage = getFirebaseAuthErrorMessage(result.errorCode) || result.error;
        Alert.alert('Login Failed', errorMessage);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    Alert.prompt(
      'Forgot Password',
      'Enter your email address to reset password:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Send',
          onPress: async (email) => {
            if (email) {
              const result = await AuthService.resetPassword(email);
              if (result.success) {
                Alert.alert('Success', result.message);
              } else {
                const errorMessage = getFirebaseAuthErrorMessage(result.errorCode) || result.error;
                Alert.alert('Error', errorMessage);
              }
            }
          },
        },
      ],
      'plain-text'
    );
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
          <View style={styles.content}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to your Smart Contacts account
            </Text>

            <View style={styles.form}>
              <InputField
                label="Login with Email or Phone"
                placeholder="Enter your email or phone number"
                value={formData.emailOrPhone}
                onChangeText={(text) => handleInputChange('emailOrPhone', text)}
                onBlur={() => handleBlur('emailOrPhone')}
                error={touched.emailOrPhone && errors.emailOrPhone}
                keyboardType="default"
                autoCapitalize="none"
                autoComplete="email"
                required
              />

              <InputField
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
                onBlur={() => handleBlur('password')}
                error={touched.password && errors.password}
                secureTextEntry
                autoComplete="password"
                required
              />

              <View style={styles.forgotPasswordContainer}>
                <Button
                  title="Forgot Password?"
                  variant="ghost"
                  size="small"
                  onPress={handleForgotPassword}
                  style={styles.forgotPasswordButton}
                  textStyle={styles.forgotPasswordText}
                />
              </View>

              <Button
                title={isLoading ? 'Signing In...' : 'Sign In'}
                onPress={handleLogin}
                loading={isLoading}
                disabled={isLoading}
                style={styles.signInButton}
                fullWidth
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>
                  Don't have an account?{' '}
                </Text>
                <Button
                  title="Sign Up"
                  variant="outline"
                  size="small"
                  onPress={() => navigation.navigate('Registration')}
                  style={styles.signUpButton}
                  textStyle={styles.signUpButtonText}
                />
              </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    marginTop: 150,
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
    marginBottom: 40,
  },
  form: {
    // padding already handled by content
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: 'normal',
  },
  signInButton: {
    marginBottom: 20,
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
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  signUpText: {
    color: Colors.secondary,
    fontSize: 16,
  },
  signUpButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    height: 'auto',
  },
  signUpButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;