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
import { validateLoginForm } from '../../utils/validators';

const LoginScreen = ({ navigation, route }) => {
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Check for success message from verification
  React.useEffect(() => {
    if (route.params?.message) {
    // ✅ Show success message from registration
    Alert.alert('Success', route.params.message, [
      { 
        text: 'OK', 
        onPress: () => {
          // Clear the params after showing
          navigation.setParams({ message: undefined });
        }
      }
    ]);
  }
}, [route.params]);

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
    const validation = validateLoginForm(formData.phone, formData.password);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      setTouched({
        phone: true,
        password: true
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await AuthService.loginWithPhone(formData.phone, formData.password);
      
      if (result.success) {
        // Navigate to Main App
        Alert.alert(
          'Login Successful',
          `Welcome back, ${result.user.firstName}!`,
          [
            {
              text: 'Continue',
              onPress: () => {
                // Reset navigation stack and go to Main
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Main' }],
                });
              }
            }
          ]
        );
      } else {
        // Check if needs phone verification
        if (result.needsVerification) {
          Alert.alert(
            'Phone Not Verified',
            result.error,
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Verify Now', 
                onPress: () => navigation.navigate('PhoneVerification', {
                  phone: formData.phone
                })
              }
            ]
          );
        } else {
          Alert.alert('Login Failed', result.error);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
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
            <View style={styles.header}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in with your phone number
              </Text>
            </View>

            <View style={styles.form}>
              <InputField
                label="Phone Number"
                placeholder="Enter your 10-digit mobile number"
                value={formData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
                onBlur={() => handleBlur('phone')}
                error={touched.phone && errors.phone}
                keyboardType="phone-pad"
                // maxLength={10}
                autoComplete="tel"
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

              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>
                  Don't have an account?{' '}
                </Text>
                <Button
                  title="Sign Up"
                  variant="ghost"
                  size="medium"
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

// Update styles as needed
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.white 
  },
  keyboardAvoid: { 
    flex: 1 
  },
  scrollView: { 
    flex: 1 
  },
  content: { 
    paddingHorizontal: 24, 
    paddingTop: "50%",
    // backgroundColor: Colors.error 
  },
  header: { 
    marginBottom: 40 ,
    alignItems: 'center',
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: Colors.black, 
    marginBottom: 8,
  },
  subtitle: { 
    fontSize: 16, 
    color: Colors.gray 
  },
  // form: {  },
  forgotPasswordContainer: { 
    alignItems: 'flex-end',  
    marginBottom: 4,
    // backgroundColor: Colors.error  
  },
  forgotPasswordButton: { 
    padding: 0 
  },
  forgotPasswordText: { 
    fontSize: 14 
  },
  signInButton: { 
    height: 56, 
    marginTop: 8 
  },
  signUpContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 32,
    paddingBottom: 40
  },
  signUpText: { 
    fontSize: 17, 
    color: Colors.gray 
  },
  // signUpButton: { 
  //   // marginLeft: 8 
  // }
});

export default LoginScreen;