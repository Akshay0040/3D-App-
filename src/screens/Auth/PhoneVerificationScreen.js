// // import React, { useState, useEffect, useRef } from 'react';
// // import {
// //     View,
// //     Text,
// //     StyleSheet,
// //     SafeAreaView,
// //     Alert,
// //     StatusBar,
// //     TouchableOpacity
// // } from 'react-native';
// // import { Formik } from 'formik';
// // import { Colors } from '../../constants/colors';
// // import { Button, OTPInput, Header } from '../../components/common';
// // import AuthService from '../../services/authService';

// // const PhoneVerificationScreen = ({ navigation, route }) => {
// //     const { phone, userData } = route.params || {};
// //     const [timer, setTimer] = useState(30);
// //     const [canResend, setCanResend] = useState(false);
// //     const [isSending, setIsSending] = useState(false);
// //     const timerRef = useRef(null);

// //     // Start countdown timer
// //     useEffect(() => {
// //         if (phone) {
// //             sendOTP();
// //         }

// //         return () => {
// //             if (timerRef.current) {
// //                 clearInterval(timerRef.current);
// //             }
// //         };
// //     }, []);

// //     // Timer countdown
// //     useEffect(() => {
// //         if (timer > 0 && !canResend) {
// //             timerRef.current = setInterval(() => {
// //                 setTimer(prev => {
// //                     if (prev <= 1) {
// //                         setCanResend(true);
// //                         clearInterval(timerRef.current);
// //                         return 0;
// //                     }
// //                     return prev - 1;
// //                 });
// //             }, 1000);
// //         }

// //         return () => {
// //             if (timerRef.current) {
// //                 clearInterval(timerRef.current);
// //             }
// //         };
// //     }, [timer, canResend]);

// //     const sendOTP = async () => {
// //         setIsSending(true);
// //         try {
// //             const result = await AuthService.sendPhoneOTP(phone);

// //             if (result.success) {
// //                 Alert.alert(
// //                     'OTP Sent',
// //                     `OTP sent to ${phone}. For testing, OTP is: ${result.otp}`,
// //                     [{ text: 'OK' }]
// //                 );
// //             } else {
// //                 Alert.alert('Error', result.error);
// //             }
// //         } catch (error) {
// //             Alert.alert('Error', 'Failed to send OTP');
// //         } finally {
// //             setIsSending(false);
// //         }
// //     };

// //     const handleResendOTP = async () => {
// //         if (!canResend) return;

// //         setTimer(30);
// //         setCanResend(false);
// //         await sendOTP();
// //     };

// //     const handleVerifyOTP = async (values, { setSubmitting }) => {
// //         try {
// //             const result = await AuthService.verifyPhoneOTP(phone, values.otp);

// //             if (result.success) {
// //                 Alert.alert(
// //                     'Success!',
// //                     'Phone number verified successfully!',
// //                     [
// //                         {
// //                             text: 'Continue to Login',
// //                             onPress: () => {
// //                                 navigation.navigate('Login', {
// //                                     message: 'Phone verified! You can now login.'
// //                                 });
// //                             }
// //                         }
// //                     ]
// //                 );
// //             } else {
// //                 Alert.alert('Error', result.error);
// //             }
// //         } catch (error) {
// //             Alert.alert('Error', 'Verification failed');
// //         } finally {
// //             setSubmitting(false);
// //         }
// //     };

// //     const formatPhone = (phone) => {
// //         if (phone.length === 10) {
// //             return `+91 ${phone.substring(0, 5)} ${phone.substring(5)}`;
// //         }
// //         return phone;
// //     };

// //     return (
// //         <SafeAreaView style={styles.container}>
// //             <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />

// //             <Header onBackPress={() => navigation.goBack()} />

// //             <View style={styles.content}>
// //                 <View style={styles.header}>
// //                     <Text style={styles.title}>Verify Phone Number</Text>
// //                     <Text style={styles.subtitle}>
// //                         We've sent a 6-digit OTP to{'\n'}
// //                         <Text style={styles.phoneText}>{formatPhone(phone)}</Text>
// //                     </Text>
// //                 </View>

// //                 <Formik
// //                     initialValues={{ otp: '' }}
// //                     onSubmit={handleVerifyOTP}
// //                 >
// //                     {({
// //                         setFieldValue,
// //                         handleSubmit,
// //                         values,
// //                         isSubmitting
// //                     }) => (
// //                         <View style={styles.form}>
// //                             <View style={styles.otpContainer}>
// //                                 <OTPInput
// //                                     field={{ name: 'otp', value: values.otp }}
// //                                     form={{ setFieldValue, setFieldTouched: () => { } }}
// //                                     length={6}
// //                                     onFulfill={handleSubmit}
// //                                     autoFocus={true}
// //                                     filledInputStyle={styles.filledOtpInput}
// //                                 />
// //                             </View>

// //                             <View style={styles.actions}>
// //                                 <Button
// //                                     title={isSubmitting ? 'Verifying...' : 'Verify OTP'}
// //                                     onPress={handleSubmit}
// //                                     loading={isSubmitting}
// //                                     disabled={isSubmitting || values.otp.length !== 6}
// //                                     style={styles.verifyButton}
// //                                     fullWidth
// //                                 />

// //                                 <View style={styles.resendContainer}>
// //                                     <Text style={styles.resendText}>
// //                                         Didn't receive the code?{' '}
// //                                     </Text>
// //                                     <TouchableOpacity
// //                                         onPress={handleResendOTP}
// //                                         disabled={!canResend || isSending}
// //                                     >
// //                                         <Text style={[
// //                                             styles.resendButton,
// //                                             (!canResend || isSending) && styles.resendButtonDisabled
// //                                         ]}>
// //                                             {isSending ? 'Sending...' :
// //                                                 canResend ? 'Resend OTP' : `Resend in ${timer}s`}
// //                                         </Text>
// //                                     </TouchableOpacity>
// //                                 </View>
// //                             </View>
// //                         </View>
// //                     )}
// //                 </Formik>
// //             </View>
// //         </SafeAreaView>
// //     );
// // };

// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         backgroundColor:
// //             Colors.white
// //     },
// //     content: {
// //         flex: 1,
// //         paddingHorizontal: 24
// //     },
// //     header: { 
// //         marginTop: 40, 
// //         marginBottom: 40 
// //     },
// //     title: { 
// //         fontSize: 28, 
// //         fontWeight: 'bold', 
// //         color: Colors.black, 
// //         marginBottom: 12 
// //     },
// //     subtitle: { 
// //         fontSize: 16, 
// //         color: Colors.gray, 
// //         lineHeight: 24 
// //     },
// //     phoneText: { 
// //         fontWeight: '600', 
// //         color: Colors.primary 
// //     },
// //     form: { 
// //         flex: 1 
// //     },
// //     otpContainer: { 
// //         alignItems: 'center' 
// //     },
// //     filledOtpInput: { 
// //         backgroundColor: Colors.lightGray 
// //     },
// //     actions: { 
// //         marginTop: 40 
// //     },
// //     verifyButton: { 
// //         height: 56 
// //     },
// //     resendContainer: {
// //         flexDirection: 'row',
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         marginTop: 24
// //     },
// //     resendText: { 
// //         fontSize: 16, 
// //         color: Colors.gray 
// //     },
// //     resendButton: {
// //         fontSize: 16,
// //         color: Colors.primary,
// //         fontWeight: '600',
// //         marginLeft: 4
// //     },
// //     resendButtonDisabled: {
// //         color: Colors.gray,
// //         opacity: 0.5
// //     }
// // });

// // export default PhoneVerificationScreen;



// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   Alert,
//   StatusBar
// } from 'react-native';
// import { Colors } from '../../constants/colors';
// import { Button, OTPInput, Header } from '../../components/common';
// import AuthService from '../../services/authService';

// const PhoneVerificationScreen = ({ navigation, route }) => {
//   const { phone, userData, confirmation, registrationData } = route.params || {};
//   const [otp, setOtp] = useState('');
//   const [timer, setTimer] = useState(30);
//   const [canResend, setCanResend] = useState(false);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [isSending, setIsSending] = useState(false);

//   // Start timer
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTimer(prev => {
//         if (prev <= 1) {
//           setCanResend(true);
//           clearInterval(interval);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   const handleResendOTP = async () => {
//     if (!canResend) return;
    
//     setIsSending(true);
//     try {
//       const result = await AuthService.sendOTP(phone);
      
//       if (result.success) {
//         Alert.alert('OTP Sent', 'New OTP sent successfully');
//         setTimer(30);
//         setCanResend(false);
//       } else {
//         Alert.alert('Error', result.error);
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to resend OTP');
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const handleVerifyOTP = async () => {
//     if (otp.length !== 6) {
//       Alert.alert('Error', 'Please enter 6-digit OTP');
//       return;
//     }
    
//     setIsVerifying(true);
    
//     try {
//       let result;
      
//       if (registrationData) {
//         // Complete registration
//         result = await AuthService.completeRegistration(
//           confirmation,
//           otp,
//           registrationData
//         );
//       } else {
//         // Just verify OTP (for login or forgot password)
//         result = await AuthService.verifyOTP(confirmation, otp);
//       }
      
//       if (result.success) {
//         Alert.alert(
//           'Success!',
//           registrationData ? 'Registration completed!' : 'Phone verified!',
//           [
//             {
//               text: 'Continue',
//               onPress: () => {
//                 if (registrationData) {
//                   // Go to login after registration
//                   navigation.navigate('Login', {
//                     message: 'Registration successful! Please login.'
//                   });
//                 } else {
//                   // Go to main app
//                   navigation.reset({
//                     index: 0,
//                     routes: [{ name: 'Main' }]
//                   });
//                 }
//               }
//             }
//           ]
//         );
//       } else {
//         Alert.alert('Error', result.error);
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Verification failed');
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   const handleOTPChange = (value) => {
//     setOtp(value);
//     if (value.length === 6) {
//       handleVerifyOTP();
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      
//       <Header onBackPress={() => navigation.goBack()} />

//       <View style={styles.content}>
//         <View style={styles.header}>
//           <Text style={styles.title}>Verify Phone Number</Text>
//           <Text style={styles.subtitle}>
//             Enter OTP sent to{'\n'}
//             <Text style={styles.phoneText}>+91 {phone}</Text>
//           </Text>
//         </View>

//         <View style={styles.otpSection}>
//           <OTPInput
//             field={{ name: 'otp', value: otp }}
//             form={{ 
//               setFieldValue: (field, value) => handleOTPChange(value),
//               setFieldTouched: () => {}
//             }}
//             length={6}
//             onFulfill={handleVerifyOTP}
//             autoFocus={true}
//           />
//         </View>

//         <View style={styles.actions}>
//           <Button
//             title={isVerifying ? 'Verifying...' : 'Verify OTP'}
//             onPress={handleVerifyOTP}
//             loading={isVerifying}
//             disabled={isVerifying || otp.length !== 6}
//             style={styles.verifyButton}
//             fullWidth
//           />

//           <View style={styles.resendContainer}>
//             <Text style={styles.resendText}>
//               Didn't receive OTP?{' '}
//             </Text>
//             <Button
//               title={canResend ? 'Resend OTP' : `Resend in ${timer}s`}
//               variant="outline"
//               size="small"
//               onPress={handleResendOTP}
//               disabled={!canResend || isSending}
//             />
//           </View>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: Colors.white 
//   },
//   content: { 
//     flex: 1, 
//     paddingHorizontal: 24 
//   },
//   header: { 
//     marginTop: 40, 
//     marginBottom: 40 
//   },
//   title: { 
//     fontSize: 28, 
//     fontWeight: 'bold', 
//     color: Colors.black, 
//     marginBottom: 12,
//     textAlign: 'center'
//   },
//   subtitle: { 
//     fontSize: 16, 
//     color: Colors.gray, 
//     lineHeight: 24,
//     textAlign: 'center'
//   },
//   phoneText: { 
//     fontWeight: '600', 
//     color: Colors.primary 
//   },
//   otpSection: { alignItems: 'center' },
//   actions: { marginTop: 40 },
//   verifyButton: { height: 56 },
//   resendContainer: { 
//     flexDirection: 'row', 
//     justifyContent: 'center', 
//     alignItems: 'center',
//     marginTop: 24 
//   },
//   resendText: { fontSize: 16, color: Colors.gray }
// });

// export default PhoneVerificationScreen;










import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  StatusBar
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Button, OTPInput, Header } from '../../components/common';
import AuthService from '../../services/authService';

const PhoneVerificationScreen = ({ navigation, route }) => {
  // ✅ PARAMS FROM REGISTRATION
  const { phone, userData, confirmation, registrationData } = route.params || {};
  
  // ✅ STATE VARIABLES
  const [otp, setOtp] = useState('123456'); // Auto-filled OTP
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // ✅ MOUNT STATE (Alert errors fix ke liye)
  const [isMounted, setIsMounted] = useState(false);
  
  // ✅ REFS (Button bubbling fix ke liye)
  const isVerifyingRef = useRef(false);
  const autoVerifyTimeoutRef = useRef(null);

  // ✅ 1. MOUNT/UNMOUNT HANDLING
  useEffect(() => {
    setIsMounted(true);
    
    return () => {
      setIsMounted(false);
      // Cleanup timeout
      if (autoVerifyTimeoutRef.current) {
        clearTimeout(autoVerifyTimeoutRef.current);
      }
    };
  }, []);

  // ✅ 2. TIMER FOR RESEND OTP
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ✅ 3. AUTO-VERIFY AFTER 3 SECONDS
  useEffect(() => {
    if (isMounted && otp === '123456' && otp.length === 6) {
      autoVerifyTimeoutRef.current = setTimeout(() => {
        console.log('⏰ Auto-verifying OTP after 3 seconds');
        handleVerifyOTP();
      }, 3000);
      
      return () => {
        if (autoVerifyTimeoutRef.current) {
          clearTimeout(autoVerifyTimeoutRef.current);
        }
      };
    }
  }, [otp, isMounted]);

  // ✅ 4. RESEND OTP HANDLER
  const handleResendOTP = async () => {
    if (!canResend || !isMounted) return;
    
    setIsSending(true);
    try {
      console.log('📱 New OTP for', phone, 'is: 123456');
      
      // ✅ Check mounted before Alert
      if (isMounted) {
        Alert.alert('OTP Sent', 'New OTP: 123456');
      }
      
      setTimer(30);
      setCanResend(false);
    } catch (error) {
      if (isMounted) {
        Alert.alert('Error', 'Failed to resend OTP');
      }
    } finally {
      if (isMounted) {
        setIsSending(false);
      }
    }
  };

  // ✅ 5. MAIN VERIFY OTP FUNCTION (with button bubbling fix)
  const handleVerifyOTP = async () => {
    // Prevent multiple clicks
    if (isVerifyingRef.current || !isMounted) return;
    
    // Validate OTP length
    if (otp.length !== 6) {
      if (isMounted) {
        Alert.alert('Error', 'Please enter 6-digit OTP');
      }
      return;
    }
    
    // Validate OTP value
    if (otp !== '123456') {
      if (isMounted) {
        Alert.alert('Invalid OTP', 'Please use: 123456');
      }
      return;
    }
    
    // Set verifying state
    isVerifyingRef.current = true;
    setIsVerifying(true);
    
    try {
      let result;
      
      // Complete registration or just verify
      if (registrationData) {
        result = await AuthService.completeRegistration(confirmation, otp, registrationData);
      } else {
        result = await AuthService.verifyOTP(confirmation, otp);
      }
      
      if (result.success) {
        // ✅ SUCCESS ALERT WITH CONTINUE BUTTON
        if (isMounted) {
          Alert.alert(
            '🎉 Registration Successful!',
            'Your account has been created successfully.',
            [
              {
                text: 'Continue',
                onPress: () => {
                  console.log('✅ Continue button pressed, navigating to Login');
                  // Navigate to Login screen
                  navigation.navigate('Login', {
                    message: 'Registration successful! Please login with your credentials.'
                  });
                }
              }
            ]
          );
        }
      } else {
        if (isMounted) {
          Alert.alert('Error', result.error || 'Please use OTP: 123456');
        }
      }
    } catch (error) {
      if (isMounted) {
        Alert.alert('Error', 'Please use OTP: 123456');
      }
    } finally {
      // Reset verifying state
      if (isMounted) {
        isVerifyingRef.current = false;
        setIsVerifying(false);
      }
    }
  };

  // ✅ 6. OTP INPUT CHANGE HANDLER
  const handleOTPChange = (value) => {
    if (!isMounted) return;
    setOtp(value);
  };

  // ✅ 7. MANUAL VERIFY BUTTON HANDLER (separate from auto-verify)
  const handleManualVerify = () => {
    if (!isVerifying && isMounted) {
      handleVerifyOTP();
    }
  };

  // ✅ UI RENDER
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      
      <Header onBackPress={() => navigation.goBack()} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Verify Phone Number</Text>
          <Text style={styles.subtitle}>
            Enter OTP sent to{'\n'}
            <Text style={styles.phoneText}>+91 {phone}</Text>
          </Text>
          
          {/* ✅ OTP HINT BOX */}
          <View style={styles.otpHintBox}>
            <Text style={styles.otpHintText}>
              🔢 Test OTP: <Text style={styles.otpCode}>123456</Text>
            </Text>
            <Text style={styles.otpInstruction}>
              (Auto-verify in 3 seconds)
            </Text>
          </View>
        </View>

        <View style={styles.otpSection}>
          <OTPInput
            field={{ name: 'otp', value: otp }}
            form={{ 
              setFieldValue: (field, value) => handleOTPChange(value),
              setFieldTouched: () => {}
            }}
            length={6}
            onFulfill={handleVerifyOTP}
            autoFocus={true}
          />
        </View>

        <View style={styles.actions}>
          {/* ✅ USE handleManualVerify FOR BUTTON */}
          <Button
            title={isVerifying ? 'Verifying...' : 'Verify OTP'}
            onPress={handleManualVerify}
            loading={isVerifying}
            disabled={isVerifying || otp.length !== 6}
            style={styles.verifyButton}
            fullWidth
          />

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              Didn't receive OTP?{' '}
            </Text>
            <Button
              title={canResend ? 'Resend OTP' : `Resend in ${timer}s`}
              variant="outline"
              size="small"
              onPress={handleResendOTP}
              disabled={!canResend || isSending}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

// ✅ STYLES
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.white 
  },
  content: { 
    flex: 1, 
    paddingHorizontal: 24 
  },
  header: { 
    marginTop: 40, 
    marginBottom: 40 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: Colors.black, 
    marginBottom: 12,
    textAlign: 'center'
  },
  subtitle: { 
    fontSize: 16, 
    color: Colors.gray, 
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20
  },
  phoneText: { 
    fontWeight: '600', 
    color: Colors.primary 
  },
  otpHintBox: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginTop: 20,
    alignItems: 'center'
  },
  otpHintText: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 4
  },
  otpCode: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.black
  },
  otpInstruction: {
    fontSize: 14,
    color: Colors.gray,
    fontStyle: 'italic'
  },
  otpSection: { alignItems: 'center' },
  actions: { marginTop: 40 },
  verifyButton: { height: 56 },
  resendContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 24 
  },
  resendText: { fontSize: 16, color: Colors.gray }
});

export default PhoneVerificationScreen;