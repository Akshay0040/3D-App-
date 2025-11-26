import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View
} from 'react-native';
import { Colors } from '../../constants/colors';

const Button = ({
  title,
  onPress,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'ghost'
  size = 'medium', // 'small', 'medium', 'large'
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  ...props
}) => {
  // Get button styles based on props
  const getButtonStyle = () => {
    let buttonStyle = [styles.baseButton];

    // Size styles
    if (size === 'small') buttonStyle.push(styles.smallButton);
    if (size === 'large') buttonStyle.push(styles.largeButton);

    // Variant styles
    if (variant === 'secondary') buttonStyle.push(styles.secondaryButton);
    if (variant === 'outline') buttonStyle.push(styles.outlineButton);
    if (variant === 'ghost') buttonStyle.push(styles.ghostButton);

    // State styles
    if (disabled || loading) buttonStyle.push(styles.disabledButton);
    if (fullWidth) buttonStyle.push(styles.fullWidth);

    return buttonStyle;
  };

  // Get text styles based on props
  const getTextStyle = () => {
    let textStyleArray = [styles.baseText];

    // Size styles
    if (size === 'small') textStyleArray.push(styles.smallText);
    if (size === 'large') textStyleArray.push(styles.largeText);

    // Variant styles
    if (variant === 'secondary') textStyleArray.push(styles.secondaryText);
    if (variant === 'outline') textStyleArray.push(styles.outlineText);
    if (variant === 'ghost') textStyleArray.push(styles.ghostText);

    // State styles
    if (disabled || loading) textStyleArray.push(styles.disabledText);

    return textStyleArray;
  };

  // Get spinner color based on variant
  const getSpinnerColor = () => {
    if (variant === 'outline' || variant === 'ghost') return Colors.primary;
    return Colors.white;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getSpinnerColor()} />
      ) : (
        <View style={styles.contentContainer}>
          {leftIcon && <Text style={styles.icon}>{leftIcon}</Text>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {rightIcon && <Text style={styles.icon}>{rightIcon}</Text>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 56,
    paddingHorizontal: 24,
  },
  smallButton: {
    height: 40,
    paddingHorizontal: 16,
  },
  largeButton: {
    height: 60,
    paddingHorizontal: 32,
  },
  fullWidth: {
    width: '100%',
  },
  
  // Variant Styles
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  
  // Disabled State
  disabledButton: {
    opacity: 0.6,
  },
  
  // Content Container
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Text Styles
  baseText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 18,
  },
  
  // Text Variants
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.white,
  },
  outlineText: {
    color: Colors.primary,
  },
  ghostText: {
    color: Colors.primary,
  },
  disabledText: {
    color: Colors.gray,
  },
  
  // Icon Styles
  icon: {
    fontSize: 16,
    marginHorizontal: 4,
  },
});

// Apply default variant styles
styles.baseButton = [styles.baseButton, styles.primaryButton];
styles.baseText = [styles.baseText, styles.primaryText];

export default Button;