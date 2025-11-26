import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Colors } from '../../constants/colors';

const InputField = ({
  // Formik props
  field, // { name, value, onChange, onBlur } - optional
  form, // { touched, errors, setFieldValue, setFieldTouched } - optional
  
  // Input props
  label,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete = 'off',
  autoCorrect = false,
  editable = true,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  
  // Custom props
  leftIcon,
  rightIcon,
  onRightIconPress,
  variant = 'default',
  size = 'medium',
  
  // Style props
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  
  // Direct props (for non-Formik usage)
  value,
  onChangeText,
  onBlur,
  error,
  touched,
  
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!secureTextEntry);

  // Extract values from field prop or use direct props
  const fieldName = field?.name || props.name;
  const fieldValue = field?.value || value;
  const fieldError = form?.errors?.[fieldName] || error;
  const fieldTouched = form?.touched?.[fieldName] || touched;

  const { setFieldValue, setFieldTouched } = form || {};

  const hasValue = fieldValue && fieldValue.length > 0;
  const displayError = fieldTouched && fieldError;

  const handleFocus = () => {
    setIsFocused(true);
    if (setFieldTouched && fieldName) {
      setFieldTouched(fieldName, true, false);
    }
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (field?.onBlur) {
      field.onBlur(fieldName)(e);
    } else if (onBlur) {
      onBlur(e);
    }
  };

  const handleChangeText = (text) => {
    if (setFieldValue && fieldName) {
      // Formik usage
      setFieldValue(fieldName, text);
    } else if (field?.onChange) {
      // Field prop usage
      field.onChange(fieldName)(text);
    } else if (onChangeText) {
      // Direct prop usage
      onChangeText(text);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Get border color based on state
  const getBorderColor = () => {
    if (displayError) return Colors.error;
    if (isFocused) return Colors.primary;
    if (hasValue) return Colors.primary;
    return Colors.border;
  };

  // Get background color based on variant
  const getBackgroundColor = () => {
    if (!editable) return Colors.lightGray;
    if (variant === 'filled') return Colors.lightGray;
    return Colors.white;
  };

  // Get input height based on size
  const getInputHeight = () => {
    if (size === 'small') return 48;
    if (size === 'large') return 64;
    return 56;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
          {props.required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      {/* Input Container */}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
            backgroundColor: getBackgroundColor(),
            height: multiline ? undefined : getInputHeight(),
            minHeight: multiline ? 100 : getInputHeight(),
          },
          variant === 'outlined' && styles.outlinedContainer,
        ]}
      >
        {/* Left Icon */}
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Text style={styles.icon}>{leftIcon}</Text>
          </View>
        )}

        {/* Text Input */}
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            !editable && styles.disabledInput,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
            inputStyle,
          ]}
          value={fieldValue}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={Colors.gray}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          autoCorrect={autoCorrect}
          editable={editable}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          maxLength={maxLength}
          selectionColor={Colors.primary}
          {...props}
        />

        {/* Right Icon or Password Toggle */}
        <View style={styles.rightIconContainer}>
          {secureTextEntry ? (
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.iconButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.icon}>
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </Text>
            </TouchableOpacity>
          ) : rightIcon ? (
            <TouchableOpacity
              onPress={onRightIconPress}
              style={styles.iconButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              disabled={!onRightIconPress}
            >
              <Text style={styles.icon}>{rightIcon}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Error Message */}
      {displayError && (
        <Text style={[styles.errorText, errorStyle]}>
          {fieldError}
        </Text>
      )}

      {/* Character Counter */}
      {maxLength && (
        <Text style={styles.counterText}>
          {fieldValue?.length || 0}/{maxLength}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 8,
  },
  required: {
    color: Colors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  outlinedContainer: {
    borderWidth: 2,
  },
  leftIconContainer: {
    marginRight: 12,
  },
  rightIconContainer: {
    marginLeft: 12,
  },
  iconButton: {
    padding: 4,
  },
  icon: {
    fontSize: 18,
    color: Colors.gray,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
    paddingVertical: 0,
    paddingHorizontal: 0,
    includeFontPadding: false,
  },
  inputWithLeftIcon: {
    marginLeft: 0,
  },
  inputWithRightIcon: {
    marginRight: 0,
  },
  multilineInput: {
    textAlignVertical: 'top',
    paddingTop: 16,
    paddingBottom: 16,
    height: 'auto',
  },
  disabledInput: {
    color: Colors.gray,
    opacity: 0.7,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    marginTop: 6,
    marginLeft: 4,
  },
  counterText: {
    color: Colors.gray,
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
});

export default InputField;