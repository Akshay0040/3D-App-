import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Text
} from 'react-native';
import { Colors } from '../../constants/colors';

const OTPInput = ({
  // Formik props
  field, // { name, value }
  form, // { setFieldValue, setFieldTouched }
  
  // OTP props
  length = 6,
  onFulfill,
  autoFocus = true,
  editable = true,
  secureText = false,
  
  // Style props
  containerStyle,
  inputStyle,
  filledInputStyle,
  errorStyle,
  
  ...props
}) => {
  const inputRefs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const { name, value } = field || {};
  const { setFieldValue, setFieldTouched } = form || {};

  const otpArray = value ? value.split('').slice(0, length) : [];
  const inputs = Array(length).fill('');

  useEffect(() => {
    if (autoFocus && editable) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [autoFocus, editable]);

  useEffect(() => {
    if (value && value.length === length && onFulfill) {
      onFulfill(value);
    }
  }, [value, length, onFulfill]);

  const focusInput = (index) => {
    if (inputRefs.current[index] && editable) {
      inputRefs.current[index].focus();
      setFocusedIndex(index);
    }
  };

  const handleTextChange = (text, index) => {
    if (!editable) return;

    // Remove non-numeric characters
    const numericText = text.replace(/[^0-9]/g, '');

    if (numericText.length > 1) {
      // Handle paste: fill all inputs with pasted text
      const pastedText = numericText.slice(0, length);
      setFieldValue?.(name, pastedText);
      
      // Focus last input
      const lastFilledIndex = Math.min(pastedText.length, length - 1);
      focusInput(lastFilledIndex);
      return;
    }

    // Single character input
    const newOtpArray = [...otpArray];
    newOtpArray[index] = numericText;
    const newOtpString = newOtpArray.join('');

    setFieldValue?.(name, newOtpString);
    setFieldTouched?.(name, true, false);

    // Auto focus next input
    if (numericText && index < length - 1) {
      focusInput(index + 1);
    }

    // Auto submit when last digit is entered
    if (numericText && index === length - 1) {
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!otpArray[index] && index > 0) {
        // Move to previous input if current is empty
        focusInput(index - 1);
        
        // Clear previous input
        const newOtpArray = [...otpArray];
        newOtpArray[index - 1] = '';
        setFieldValue?.(name, newOtpArray.join(''));
      } else if (otpArray[index]) {
        // Clear current input
        const newOtpArray = [...otpArray];
        newOtpArray[index] = '';
        setFieldValue?.(name, newOtpArray.join(''));
      }
    }
  };

  const handleFocus = (index) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(-1);
  };

  const getInputValue = (index) => {
    return otpArray[index] || '';
  };

  const isInputFilled = (index) => {
    return !!otpArray[index];
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, containerStyle]}>
        <View style={styles.otpContainer}>
          {inputs.map((_, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={[
                styles.input,
                isInputFilled(index) && [styles.filledInput, filledInputStyle],
                focusedIndex === index && styles.focusedInput,
                !editable && styles.disabledInput,
                inputStyle,
              ]}
              value={getInputValue(index)}
              onChangeText={text => handleTextChange(text, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              keyboardType="number-pad"
              maxLength={index === 0 ? length : 1}
              selectTextOnFocus
              editable={editable}
              secureTextEntry={secureText && !isInputFilled(index)}
              contextMenuHidden={true}
              caretHidden={false}
              {...props}
            />
          ))}
        </View>
        
        {/* OTP Length Indicator */}
        <View style={styles.lengthIndicator}>
          <Text style={styles.lengthText}>
            {length}-digit code
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  input: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: Colors.primary,
    backgroundColor: Colors.white,
  },
  filledInput: {
    borderColor: Colors.primary,
    backgroundColor: '#f0f9ff',
  },
  focusedInput: {
    borderColor: Colors.primary,
    backgroundColor: '#f8faff',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledInput: {
    backgroundColor: Colors.lightGray,
    borderColor: Colors.gray,
    color: Colors.gray,
  },
  lengthIndicator: {
    marginTop: 12,
  },
  lengthText: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
  },
});

export default OTPInput;