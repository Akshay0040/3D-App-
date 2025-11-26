import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native';
import { Colors } from '../../constants/colors';
import Button from './Button';

const { width, height } = Dimensions.get('window');

const Header = ({
  title,
  subtitle,
  showBackButton = true,
  onBackPress,
  backButtonText = '←',
  backButtonStyle,
  backButtonTextStyle,
  titleStyle,
  subtitleStyle,
  containerStyle,
  rightComponent,
  centerTitle = true
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {/* Main Content Container */}
      <View style={styles.contentContainer}>
        
        {/* Left Section - Back Button */}
        <View style={styles.leftSection}>
          {showBackButton && (
            <Button
              title={backButtonText}
              variant="outline"
              size="small"
              onPress={onBackPress}
              style={[styles.backButton, backButtonStyle]}
              textStyle={[styles.backButtonText, backButtonTextStyle]}
            />
          )}
        </View>

        {/* Center Section - Title & Subtitle */}
        <View style={[
          styles.centerSection, 
          !centerTitle && styles.leftAlignedTitle,
          !showBackButton && styles.centerWithoutBackButton
        ]}>
          {title && (
            <Text style={[styles.title, titleStyle]} numberOfLines={2}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text style={[styles.subtitle, subtitleStyle]} numberOfLines={3}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right Section - Custom Component */}
        <View style={styles.rightSection}>
          {rightComponent || <View style={styles.placeholder} />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingTop: Platform.OS === 'ios' ? height * 0.06 : height * 0.04,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05, 
  },
  leftSection: {
    width: width * 0.12, 
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  leftAlignedTitle: {
    alignItems: 'flex-start',
    marginLeft: 16,
  },
  centerWithoutBackButton: {
    marginLeft: width * 0.12, 
  },
  rightSection: {
    width: width * 0.12, 
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  placeholder: {
    width: 40,
    height: 40,
  },
  backButton: {
    width: width * 0.1 > 40 ? 40 : width * 0.1, 
    height: width * 0.1 > 40 ? 40 : width * 0.1,
    borderRadius: width * 0.1 > 40 ? 20 : width * 0.05,
    minWidth: 36,
    minHeight: 36,
  },
  backButtonText: {
    fontSize: width * 0.045 > 18 ? 18 : width * 0.045, 
    fontWeight: 'bold',
  },
  title: {
    fontSize: width * 0.065 > 28 ? 28 : width * 0.065, 
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: height * 0.005,
    textAlign: 'center',
    lineHeight: width * 0.075 > 32 ? 32 : width * 0.075,
  },
  subtitle: {
    fontSize: width * 0.04 > 16 ? 16 : width * 0.04, 
    color: Colors.secondary,
    lineHeight: width * 0.05 > 20 ? 20 : width * 0.05,
    textAlign: 'center',
    marginHorizontal: width * 0.02,
  },
});

export default Header;