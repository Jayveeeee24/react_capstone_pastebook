import React, { useContext } from 'react';
import {
  Text,
  View,
  useColorScheme
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext, AuthProvider, useAuth } from './src/context/AuthContext';
import { AppStack } from './src/navigation/AppStack';
import { ToastProvider } from 'react-native-toast-notifications';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';


function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <ToastProvider placement="top"
      duration={1500}
      animationType='slide-in'
      animationDuration={400}
      successColor="#4CAF50"
      dangerColor="#F44336"
      warningColor="#FF9800"
      normalColor="#607D8B"
      successIcon={<MaterialCommunityIcons name='check-circle-outline' size={25} color={'white'} />}
      dangerIcon={<MaterialIcons name='error-outline' size={25} color={'white'} />}
      warningIcon={<Ionicons name='warning-outline' size={25} color={'white'} />}
      textStyle={{ fontSize: 20, color: 'white' }}
      offset={50}
      offsetTop={30}
      offsetBottom={40}
      swipeEnabled={true}>
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
    </ToastProvider>
  );
}


export default App;
