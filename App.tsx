import React from 'react';
import {
  useColorScheme
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import AppStack from './src/navigation/AppStack';
import AuthStack from './src/navigation/AuthStack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';


function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, width: '100%', height: '100%' }}>
      <NavigationContainer>
        {/* <AuthStack /> */}
        <AuthStack />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}


export default App;
