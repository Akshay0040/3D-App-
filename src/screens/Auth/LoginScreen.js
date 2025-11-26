import React from 'react';
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
import { Formik } from 'formik';
import { Colors } from '../../constants/colors';
import { Button, InputField, Header } from '../../components/common';
import { loginValidationSchema } from '../../utils/validators';

const LoginScreen = ({ navigation }) => {
  const handleLogin = async (values, { setSubmitting }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Login data:', values);
      
      // Navigate to OTP Verification after successful login
      navigation.navigate('OTPVerification', {
        userData: values
      });
      
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email/phone or password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = {
    emailOrPhone: '',
    password: ''
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
          {/* Header Component */}
          <Header
            title="Welcome Back"
            subtitle="Sign in to your Smart Contacts account"
            onBackPress={() => navigation.goBack()}
          />

          {/* Formik Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={loginValidationSchema}
            onSubmit={handleLogin}
            validateOnMount={true}
          >
            {({ 
              handleChange, 
              handleBlur, 
              handleSubmit, 
              values, 
              errors, 
              touched, 
              isValid,
              isSubmitting,
              setFieldValue,
              setFieldTouched
            }) => (
              <View style={styles.form}>
                {/* Email or Phone Input */}
                <InputField
                  field={{ 
                    name: 'emailOrPhone', 
                    value: values.emailOrPhone
                  }}
                  form={{ 
                    touched, 
                    errors, 
                    setFieldValue, 
                    setFieldTouched 
                  }}
                  label="Login with Email or Phone"
                  placeholder="Enter your email or phone number"
                  keyboardType="default"
                  autoCapitalize="none"
                  autoComplete="email"
                  required
                />

                {/* Password Input */}
                <InputField
                  field={{ 
                    name: 'password', 
                    value: values.password
                  }}
                  form={{ 
                    touched, 
                    errors, 
                    setFieldValue, 
                    setFieldTouched 
                  }}
                  label="Password"
                  placeholder="Enter your password"
                  secureTextEntry
                  autoComplete="password"
                  required
                />

                {/* Forgot Password */}
                <View style={styles.forgotPasswordContainer}>
                  <Button
                    title="Forgot Password?"
                    variant="ghost"
                    size="small"
                    onPress={() => Alert.alert('Forgot Password', 'Feature coming soon!')}
                    style={styles.forgotPasswordButton}
                    textStyle={styles.forgotPasswordText}
                  />
                </View>

                {/* Sign In Button */}
                <Button
                  title={isSubmitting ? 'Signing In...' : 'Sign In'}
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  disabled={!isValid || isSubmitting}
                  style={styles.signInButton}
                  fullWidth
                />

                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Sign Up Link */}
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
            )}
          </Formik>
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
  form: {
    padding: 20,
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