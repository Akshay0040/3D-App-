import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Alert,
    StatusBar,
    TouchableOpacity
} from 'react-native';
import { Formik } from 'formik';
import { Colors } from '../../constants/colors';
import { Button, OTPInput, Header } from '../../components/common';
import AuthService from '../../services/authService';

const PhoneVerificationScreen = ({ navigation, route }) => {
    const { phone, userData } = route.params || {};
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const timerRef = useRef(null);

    // Start countdown timer
    useEffect(() => {
        if (phone) {
            sendOTP();
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    // Timer countdown
    useEffect(() => {
        if (timer > 0 && !canResend) {
            timerRef.current = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        setCanResend(true);
                        clearInterval(timerRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [timer, canResend]);

    const sendOTP = async () => {
        setIsSending(true);
        try {
            const result = await AuthService.sendPhoneOTP(phone);

            if (result.success) {
                Alert.alert(
                    'OTP Sent',
                    `OTP sent to ${phone}. For testing, OTP is: ${result.otp}`,
                    [{ text: 'OK' }]
                );
            } else {
                Alert.alert('Error', result.error);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to send OTP');
        } finally {
            setIsSending(false);
        }
    };

    const handleResendOTP = async () => {
        if (!canResend) return;

        setTimer(30);
        setCanResend(false);
        await sendOTP();
    };

    const handleVerifyOTP = async (values, { setSubmitting }) => {
        try {
            const result = await AuthService.verifyPhoneOTP(phone, values.otp);

            if (result.success) {
                Alert.alert(
                    'Success!',
                    'Phone number verified successfully!',
                    [
                        {
                            text: 'Continue to Login',
                            onPress: () => {
                                navigation.navigate('Login', {
                                    message: 'Phone verified! You can now login.'
                                });
                            }
                        }
                    ]
                );
            } else {
                Alert.alert('Error', result.error);
            }
        } catch (error) {
            Alert.alert('Error', 'Verification failed');
        } finally {
            setSubmitting(false);
        }
    };

    const formatPhone = (phone) => {
        if (phone.length === 10) {
            return `+91 ${phone.substring(0, 5)} ${phone.substring(5)}`;
        }
        return phone;
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />

            <Header onBackPress={() => navigation.goBack()} />

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Verify Phone Number</Text>
                    <Text style={styles.subtitle}>
                        We've sent a 6-digit OTP to{'\n'}
                        <Text style={styles.phoneText}>{formatPhone(phone)}</Text>
                    </Text>
                </View>

                <Formik
                    initialValues={{ otp: '' }}
                    onSubmit={handleVerifyOTP}
                >
                    {({
                        setFieldValue,
                        handleSubmit,
                        values,
                        isSubmitting
                    }) => (
                        <View style={styles.form}>
                            <View style={styles.otpContainer}>
                                <OTPInput
                                    field={{ name: 'otp', value: values.otp }}
                                    form={{ setFieldValue, setFieldTouched: () => { } }}
                                    length={6}
                                    onFulfill={handleSubmit}
                                    autoFocus={true}
                                    filledInputStyle={styles.filledOtpInput}
                                />
                            </View>

                            <View style={styles.actions}>
                                <Button
                                    title={isSubmitting ? 'Verifying...' : 'Verify OTP'}
                                    onPress={handleSubmit}
                                    loading={isSubmitting}
                                    disabled={isSubmitting || values.otp.length !== 6}
                                    style={styles.verifyButton}
                                    fullWidth
                                />

                                <View style={styles.resendContainer}>
                                    <Text style={styles.resendText}>
                                        Didn't receive the code?{' '}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={handleResendOTP}
                                        disabled={!canResend || isSending}
                                    >
                                        <Text style={[
                                            styles.resendButton,
                                            (!canResend || isSending) && styles.resendButtonDisabled
                                        ]}>
                                            {isSending ? 'Sending...' :
                                                canResend ? 'Resend OTP' : `Resend in ${timer}s`}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                </Formik>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:
            Colors.white
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
        marginBottom: 12 
    },
    subtitle: { 
        fontSize: 16, 
        color: Colors.gray, 
        lineHeight: 24 
    },
    phoneText: { 
        fontWeight: '600', 
        color: Colors.primary 
    },
    form: { 
        flex: 1 
    },
    otpContainer: { 
        alignItems: 'center' 
    },
    filledOtpInput: { 
        backgroundColor: Colors.lightGray 
    },
    actions: { 
        marginTop: 40 
    },
    verifyButton: { 
        height: 56 
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24
    },
    resendText: { 
        fontSize: 16, 
        color: Colors.gray 
    },
    resendButton: {
        fontSize: 16,
        color: Colors.primary,
        fontWeight: '600',
        marginLeft: 4
    },
    resendButtonDisabled: {
        color: Colors.gray,
        opacity: 0.5
    }
});

export default PhoneVerificationScreen;