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
import { validateRegistrationForm } from '../../utils/validators';

const RegistrationScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
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

  const handleRegistration = async () => {
    console.log('🎯 ======= REGISTRATION STARTED =======');
    // Validate form
    const validation = validateRegistrationForm(
      formData.firstName,
      formData.lastName,
      formData.phone,
      formData.password,
      formData.confirmPassword
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      setTouched({
        firstName: true,
        lastName: true,
        phone: true,
        password: true,
        confirmPassword: true
      });

      const errorMessages = Object.values(validation.errors).join('\n• ');
      setTimeout(() => {
      Alert.alert(
        'Please fix the following:',
        `• ${errorMessages}`,
        [{ 
          text: 'OK', 
          onPress: () => console.log('Validation alert closed') 
        }]
      );
    }, 100);

      return;
    }

    console.log('✅ Validation passed, calling AuthService...');

    setIsLoading(true);

    try {
       console.log('📞 Calling AuthService.registerUser...');
      const result = await AuthService.registerUser(
        formData.firstName,
        formData.lastName,
        formData.phone,
        formData.password
      );

      console.log('Registration Result:', result);

  //     if (result.success) {
  //       Alert.alert(
  //         'Success!',
  //         'Account created! Please verify your phone number.',
  //         [
  //           {
  //             text: 'Verify Now',
  //             onPress: () => {
  //               console.log('Navigating to PhoneVerification...');
  //               navigation.navigate('PhoneVerification', {
  //                 phone: formData.phone,
  //                 userData: result.user
  //               })
  //             }
  //           }
  //         ]
  //       );
  //     } else {
  //       Alert.alert('Registration Failed', result.error || 'Unknown error');
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //     Alert.alert('Error', 'Something went wrong');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  if (result.success) {
      // Navigate directly to OTP verification
      console.log('🧭 Navigating to PhoneVerification...');
      
      navigation.navigate('PhoneVerification', {
        phone: formData.phone,
        // userData: result.user,
        confirmation: result.confirmation, // Firebase confirmation object
        registrationData: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          password: formData.password
        }
      });
      
    } else {
      Alert.alert('Registration Failed', result.error);
    }
  } catch (error) {
    console.error('Error:', error);
    Alert.alert('Error', 'Something went wrong');
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
              Join with your phone number
            </Text>
          </View>

          <View style={styles.form}>
            {/* First Name */}
            <InputField
              label="First Name"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChangeText={(text) => handleInputChange('firstName', text)}
              onBlur={() => handleBlur('firstName')}
              error={touched.firstName && errors.firstName}
              autoCapitalize="words"
              autoComplete="name-given"
              required
            />

            {/* Last Name */}
            <InputField
              label="Last Name"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChangeText={(text) => handleInputChange('lastName', text)}
              onBlur={() => handleBlur('lastName')}
              error={touched.lastName && errors.lastName}
              autoCapitalize="words"
              autoComplete="name-family"
              required
            />

            {/* Phone Number */}
            <InputField
              label="Phone Number"
              placeholder="Enter 10-digit mobile number"
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              onBlur={() => handleBlur('phone')}
              error={touched.phone && errors.phone}
              keyboardType="phone-pad"
              autoComplete="tel"
              // maxLength={10}
              required
            />

            {/* Password */}
            <InputField
              label="Password"
              placeholder="Create a strong password"
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
              onBlur={() => handleBlur('password')}
              error={touched.password && errors.password}
              secureTextEntry
              autoComplete="password"
              required
            />

            {/* Confirm Password */}
            <InputField
              label="Confirm Password"
              placeholder="Re-enter your password"
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
                // onPress={handleRegistration}
                onPress={() => {
                  console.log('Button Pressed!'); 
                  handleRegistration();
                }}
                loading={isLoading}
                disabled={isLoading}
                style={styles.createButton}
                fullWidth
              />
            </View>

            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>
                Already have an account?{' '}
              </Text>
              <Button
                title="Sign In"
                variant="ghost"
                size="medium"
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
    backgroundColor: Colors.white
  },
  keyboardAvoid: {
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  titleContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
    // backgroundColor: Colors.error  
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray
  },
  form: {
    paddingHorizontal: 24
  },
  buttonContainer: {
    // marginTop: 20, 
    marginBottom: 30,
    // backgroundColor: Colors.error
  },
  createButton: {
    height: 56
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 20, 
    // paddingBottom: 40 ,
    // backgroundColor: Colors.error
  },
  signInText: {
    fontSize: 17,
    color: Colors.gray
  },
  // signInButton: { 
  //   marginLeft: 8 
  // }
});

export default RegistrationScreen;