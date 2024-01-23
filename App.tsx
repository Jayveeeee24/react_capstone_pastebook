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
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera";
import { PhotoProvider } from './src/context/PhotoContext';
import { AlbumProvider } from './src/context/AlbumContext';


function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const { hasPermission, requestPermission } = useCameraPermission()


  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    const checkAndRequestPermissions = async () => {
      await hasCameraRollPermission();

      if (!hasPermission) {
        await requestPermission();
      }
    };

    checkAndRequestPermissions();
  }, [hasPermission]);

  const hasCameraRollPermission = async () => {
    const platformVersion = parseInt(String(Platform.Version), 10);
    const permission =
      platformVersion >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const hasCameraRollPermission = await PermissionsAndroid.check(permission);
    if (!hasCameraRollPermission) {
      await PermissionsAndroid.request(permission);
    }
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
          <PhotoProvider>
            <AlbumProvider>
              <GestureHandlerRootView style={{ flex: 1, width: '100%', height: '100%' }}>
                <NavigationContainer>
                  <AppStack />
                </NavigationContainer>
              </GestureHandlerRootView>
            </AlbumProvider>
          </PhotoProvider>
        </AuthProvider>
      </UserProvider>
    </ToastProvider>
  );
}


export default App;
