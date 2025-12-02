import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';
import { Colors } from '../../constants/colors';

// Import your arrow icon - adjust path according to your file
const leftArrowIcon = require('../../assets/icons/leftarrow.png');

const Header = ({ 
  onBackPress, 
  style,
  iconStyle 
}) => {
  return (
    <View style={[styles.header, style]}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onBackPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Image 
          source={leftArrowIcon} 
          style={[styles.arrowIcon, iconStyle]}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    marginTop: 20, 
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: Colors.primary,
  },
});

export default Header;