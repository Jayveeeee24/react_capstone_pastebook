import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeTab } from "../screens/bottomTabs/HomeTab";
import { SearchTab } from "../screens/bottomTabs/SearchTab";
import { ProfileTab } from "../screens/bottomTabs/ProfileTab";
import { CreatePostTab } from "../screens/bottomTabs/CreatePostTab";
import { CardStyleInterpolators, StackNavigationProp, createStackNavigator } from "@react-navigation/stack";
import { AlbumsTab } from "../screens/bottomTabs/AlbumsTab";

import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { NotificationScreen } from "../screens/stacks/NotificationScreen";
import { FriendRequestScreen } from "../screens/stacks/FriendRequestScreen";
import { Image, TouchableOpacity, View } from "react-native";
import { NotificationIconWithBadge } from "../components/NotificationWithBadge";
import AuthStack from './AuthStack';
import { images } from '../utils/Images';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


type HomeStackParamList = {
  Home: undefined;
  Notifications: undefined;
  FriendRequest: undefined;
};

type HomeStackNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>;


const getTabBarIcon = (route: any, focused: any, color: any) => {
  let iconName;

  if (route.name === 'HomeTab') {
    iconName = focused ? 'home-sharp' : 'home-outline';

    return <Ionicons name={iconName} size={24} color={color} />;
  } else if (route.name === 'SearchTab') {
    iconName = focused ? 'search-sharp' : 'search-outline';

    return <Ionicons name={iconName} size={24} color={color} />;
  } else if (route.name === 'ProfileTab') {
    iconName = focused ? 'account-circle' : 'account-circle-outline';

    return <MaterialCommunityIcons name={iconName} size={24} color={color} />;
  } else if (route.name === 'CreatePostTab') {
    iconName = focused ? 'add-circle' : 'add-circle-outline';

    return <Ionicons name={iconName} size={24} color={color} />;
  } else if (route.name === 'AlbumsTab') {
    iconName = focused ? 'albums-sharp' : 'albums-outline';

    return <Ionicons name={iconName} size={24} color={color} />;
  }
  else {
    iconName = '';
  }
};

export default function AppStack() {

  function MyBottomTab() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color }) => getTabBarIcon(route, focused, color),
          headerShown: false,
          tabBarShowLabel: false,
        })}
      >
        <Tab.Screen name="HomeTab" component={HomeStack} />
        <Tab.Screen name="SearchTab" component={SearchTab} />
        <Tab.Screen name="CreatePostTab" component={CreatePostTab} />
        <Tab.Screen name="AlbumsTab" component={AlbumsTab} />
        <Tab.Screen name="ProfileTab" component={ProfileTab} />
      </Tab.Navigator>
    );
  }

  function HomeStack({ navigation }: { navigation: HomeStackNavigationProp }) {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeTab} options={{
          title: '',
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 10 }}>
              <NotificationIconWithBadge
                onPress={() => {
                  navigation.navigate('Notifications');
                }}
                badgeCount={3}
              />

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('FriendRequest');
                }}
              >
                <MaterialCommunityIcons name="account-multiple-plus-outline" size={26} color="black" />
              </TouchableOpacity>
            </View>
          ),
          headerLeft: () => (
            <View style={{ flexDirection: 'row', marginLeft: 10 }}>
              <Image
                source={images.logo_wide_dark}
                style={{ width: 120, height: 35 }}
              />
            </View>
          ),
        }} />

      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={({ route }) => ({
      headerShown: route.name === 'Notifications' || route.name === 'FriendRequest',
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, 
    })}>
      <Stack.Screen name="Pastebook" component={MyBottomTab} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
      <Stack.Screen name="FriendRequest" component={FriendRequestScreen} options={{ title: 'Friend Requests' }} />
    </Stack.Navigator>
  );
}
