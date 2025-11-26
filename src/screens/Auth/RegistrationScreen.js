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
import { registrationValidationSchema } from '../../utils/validators';

const RegistrationScreen = ({ navigation }) => {
  const handleRegistration = async (values, { setSubmitting }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Registration data:', values);
      
      // Navigate to Permission Screen
      navigation.navigate('Permissions', {
        userData: values
      });
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const initialValues = {
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
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
            title="Create Account"
            subtitle="Join Smart Contacts for smarter connections"
            onBackPress={() => navigation.goBack()}
          />

          {/* Formik Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={registrationValidationSchema}
            onSubmit={handleRegistration}
            validateOnMount={true}
          >
            {({ 
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
                {/* Email Input */}
                <InputField
                  field={{ name: 'email', value: values.email }}
                  form={{ touched, errors, setFieldValue, setFieldTouched }}
                  label="Email Address"
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  required
                />

                {/* Phone Input */}
                <InputField
                  field={{ name: 'phone', value: values.phone }}
                  form={{ touched, errors, setFieldValue, setFieldTouched }}
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  required
                />

                {/* Password Input */}
                <InputField
                  field={{ name: 'password', value: values.password }}
                  form={{ touched, errors, setFieldValue, setFieldTouched }}
                  label="Password"
                  placeholder="Create a password"
                  secureTextEntry
                  autoComplete="password"
                  required
                />

                {/* Confirm Password Input */}
                <InputField
                  field={{ name: 'confirmPassword', value: values.confirmPassword }}
                  form={{ touched, errors, setFieldValue, setFieldTouched }}
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  secureTextEntry
                  autoComplete="password"
                  required
                />

                {/* Create Account Button */}
                <Button
                  title={isSubmitting ? 'Creating Account...' : 'Create Account'}
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  disabled={!isValid || isSubmitting}
                  style={styles.createButton}
                  fullWidth
                />

                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Sign In Link */}
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
  createButton: {
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