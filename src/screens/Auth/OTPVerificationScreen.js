import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  StatusBar
} from 'react-native';
import { Formik } from 'formik';
import { Colors } from '../../constants/colors';
import { Button, OTPInput, Header } from '../../components/common';
import { otpValidationSchema } from '../../utils/validators';

const OTPVerificationScreen = ({ navigation, route }) => {
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const userData = route.params?.userData || {};

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleVerifyOTP = async (values, { setSubmitting }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success!',
        'You have been successfully verified!',
        [
          {
            text: 'Continue to Home',
            onPress: () => {
              console.log('User verified:', userData);
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOTP = () => {
    setTimer(30);
    setCanResend(false);
    Alert.alert('OTP Sent', 'A new OTP has been sent to your registered phone/email.');
  };

  const initialValues = {
    otp: ''
  };

  const getPhoneNumber = () => {
    if (userData.phone) {
      return userData.phone;
    } else if (userData.emailOrPhone && /^[0-9]{10}$/.test(userData.emailOrPhone)) {
      return userData.emailOrPhone;
    }
    return 'XXXXXX7890';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      
      {/* Header Component */}
      <Header
        title="Verify OTP"
        subtitle={`We've sent a 6-digit code to\n+91 ${getPhoneNumber()}`}
        subtitleStyle={styles.subtitle}
        onBackPress={() => navigation.goBack()}
      />

      {/* Formik Form */}
      <Formik
        initialValues={initialValues}
        validationSchema={otpValidationSchema}
        onSubmit={handleVerifyOTP}
        validateOnMount={true}
      >
        {({ 
          setFieldValue, 
          handleSubmit, 
          values, 
          errors, 
          touched, 
          isValid,
          isSubmitting 
        }) => (
          <View style={styles.form}>
            {/* OTP Input */}
            <View style={styles.otpContainer}>
              <Text style={styles.otpLabel}>Enter OTP</Text>
              <OTPInput
                field={{ name: 'otp', value: values.otp }}
                form={{ setFieldValue, setFieldTouched: () => {} }}
                length={6}
                onFulfill={handleSubmit}
                autoFocus={true}
              />
              {touched.otp && errors.otp && (
                <Text style={styles.errorText}>{errors.otp}</Text>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <Button
                title={isSubmitting ? 'Verifying...' : 'Verify OTP'}
                onPress={handleSubmit}
                loading={isSubmitting}
                disabled={!isValid || isSubmitting || values.otp.length !== 6}
                style={styles.verifyButton}
                fullWidth
              />

              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>
                  Didn't receive the code?{' '}
                </Text>
                <Button
                  title={canResend ? 'Resend OTP' : `Resend in ${timer}s`}
                  variant="outline"
                  size="small"
                  onPress={handleResendOTP}
                  disabled={!canResend}
                  style={styles.resendButton}
                  textStyle={styles.resendButtonText}
                />
              </View>
            </View>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
  },
  subtitle: {
    textAlign: 'center',
  },
  form: {
    flex: 1,
    paddingTop: 20,
  },
  otpContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  otpLabel: {
    fontSize: 16,
    color: Colors.secondary,
    marginBottom: 20,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    marginTop: 10,
  },
  // actions: {
  //   flex: 1,
  //   justifyContent: 'flex-end',
  //   marginBottom: 30,
  // },
  verifyButton: {
    marginBottom: 20,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    color: Colors.secondary,
    fontSize: 16,
  },
  resendButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    height: 'auto',
  },
  resendButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OTPVerificationScreen;