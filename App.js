import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { Colors } from './src/constants/colors';

const App = () => {
  return (
    <>
      <StatusBar 
        backgroundColor={Colors.primary} 
        barStyle="light-content" 
      />
      <AppNavigator />
    </>
  );
};

export default App;