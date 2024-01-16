import React, { useContext } from 'react';
import {
  useColorScheme
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import AuthStack from './src/navigation/AuthStack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext, AuthProvider, useAuth } from './src/context/AuthContext';
import { AppStack } from './src/navigation/AppStack';


function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1, width: '100%', height: '100%' }}>
        <NavigationContainer>
          <AppStack />

          {/* {
            authState ? (
              <AppStack />
            ):
            (
              <AuthStack />
            )
          } */}
        </NavigationContainer>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}


export default App;
