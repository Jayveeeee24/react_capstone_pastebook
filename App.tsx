import React, { useContext } from 'react';
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
import { AuthContext, AuthProvider, useAuth } from './src/context/AuthContext';


function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const {authState} = useAuth();  
  
  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1, width: '100%', height: '100%' }}>
        <NavigationContainer>
          {
            authState ? (
              <AppStack />
            ):
            (
              <AuthStack />
            )
          }
        </NavigationContainer>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}


export default App;
