import React, { useContext, useEffect } from 'react';
import {
  PermissionsAndroid,
  Platform,
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
import { UserProvider } from './src/context/UserContext';


function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    hasPermission();
  }, []);

  const hasPermission = async () => {
    const platformVersion = parseInt(String(Platform.Version), 10);
    const permission =
      platformVersion >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
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
      <UserProvider>
        <AuthProvider>
          <GestureHandlerRootView style={{ flex: 1, width: '100%', height: '100%' }}>
            <NavigationContainer>
              <AppStack />
            </NavigationContainer>
          </GestureHandlerRootView>
        </AuthProvider>
      </UserProvider>
    </ToastProvider>
  );
}


export default App;
