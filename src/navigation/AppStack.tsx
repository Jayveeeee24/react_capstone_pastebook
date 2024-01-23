import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CardStyleInterpolators, StackNavigationProp, TransitionPresets, createStackNavigator } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { SearchTab } from "../screens/bottomTabs/SearchTab";
import { CreatePostTab } from "../screens/bottomTabs/CreatePostTab";
import { AlbumsTab } from "../screens/bottomTabs/AlbumsTab";
import { ProfileTab } from "../screens/bottomTabs/ProfileTab";
import { HomeTab } from "../screens/bottomTabs/HomeTab";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { NotificationIconWithBadge } from "../components/customComponents/NotificationWithBadge";
import { Images } from "../utils/Images";
import { NotificationScreen } from "../screens/stacks/otherScreens/NotificationScreen";
import { FriendRequestScreen } from "../screens/stacks/otherScreens/FriendRequestScreen";
import { Colors } from "../utils/Config";
import { LoginScreen } from "../screens/stacks/authentication/LoginScreen";
import { RegisterScreen } from "../screens/stacks/authentication/RegisterScreen";
import { useAuth } from "../context/AuthContext";
import { EditProfileScreen } from "../screens/stacks/otherScreens/EditProfileScreen";
import { FollowersScreen } from "../screens/stacks/otherScreens/FollowersScreen";
import { ForgotPasswordScreen } from "../screens/stacks/authentication/ForgotPasswordScreen";
import { SettingsScreen } from "../screens/stacks/otherScreens/SettingsScreen";
import { PhotosScreen } from "../screens/stacks/otherScreens/PhotosScreen";
import { EditEmailScreen } from "../screens/stacks/otherScreens/EditEmailScreen";
import { EditPasswordScreen } from "../screens/stacks/otherScreens/EditPasswordScreen";
import { CameraScreen } from "../screens/stacks/otherScreens/CameraScreen";



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

    return <Ionicons name={iconName} size={26} color={color} />;
  } else if (route.name === 'SearchTab') {
    iconName = focused ? 'search-sharp' : 'search-outline';

    return <Ionicons name={iconName} size={26} color={color} />;
  } else if (route.name === 'ProfileTab') {
    iconName = focused ? 'account-circle' : 'account-circle-outline';

    return <MaterialCommunityIcons name={iconName} size={26} color={color} />;
  } else if (route.name === 'CreatePostTab') {
    iconName = focused ? 'plussquare' : 'plussquareo';

    return <AntDesign name={iconName} size={26} color={color} />;
  } else if (route.name === 'AlbumsTab') {
    iconName = focused ? 'albums-sharp' : 'albums-outline';

    return <Ionicons name={iconName} size={26} color={color} />;
  }
  else {
    iconName = '';
  }
};

export const AppStack = () => {

  function HomeStack({ navigation }: { navigation: HomeStackNavigationProp }) {
    return (
      <Stack.Navigator
        screenOptions={({ route }) => ({
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0
          },
          headerShown: route.name !== 'Login' && route.name !== 'Register' && route.name !== 'Camera',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        })}>
        <Stack.Screen name="Home" component={HomeTab} options={{
          title: '',
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 10, alignItems: "center" }}>
              <NotificationIconWithBadge
                onPress={() => {
                  navigation.navigate('Notifications');
                }}
                badgeCount={3} />

              <TouchableOpacity
                onPress={async () => {
                  navigation.navigate('FriendRequest');
                }}
              >
                <MaterialCommunityIcons name="account-plus-outline" size={30} color="black" />
              </TouchableOpacity>

            </View>
          ),
          headerLeft: () => (
            <View style={{ flexDirection: 'row', marginLeft: 10 }}>
              <Image
                source={Images.logo_wide_dark}
                style={{ width: 120, height: 35 }}
              />
            </View>
          ),
        }} />
        <Stack.Screen name="Notifications" component={NotificationScreen} />
        <Stack.Screen name="FriendRequest" component={FriendRequestScreen} options={{ title: 'Friend Requests' }} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{
          title: 'Edit Profile'
        }} />
        <Stack.Screen name="EditEmail" component={EditEmailScreen} options={{
          title: 'Change Account Email'
        }} />
        <Stack.Screen name="EditPassword" component={EditPasswordScreen} options={{
          title: 'Change Account Password'
        }} />
        <Stack.Screen name="Followers" component={FollowersScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{
          headerTitle: 'Account Settings',
        }} />

        <Stack.Screen name="Photos" component={PhotosScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />

      </Stack.Navigator>
    );
  }

  function BottomTab() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => getTabBarIcon(route, focused, Colors.primaryBrand),
          headerShown: route.name != 'HomeTab',
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 55,
            alignItems: "center",
            display: route.name !== 'CreatePostTab' ? 'flex' : 'none'
          }
        })}>
        <Tab.Screen name="HomeTab" component={HomeStack} />
        <Tab.Screen name="SearchTab" component={SearchTab} />
        <Tab.Screen name="CreatePostTab" component={CreatePostTab} options={{
          headerTitleStyle: {
            marginStart: 10
          },
          headerTitle: 'New Post',
        }} />
        <Tab.Screen name="AlbumsTab" component={AlbumsTab} options={{
          headerTitle: 'My Album Gallery',
          headerTitleStyle: {
            marginStart: 8, fontSize: 22, color: 'black', fontWeight: '500',
          },
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
          },
        }} />
        <Tab.Screen name="ProfileTab" component={ProfileTab} />
      </Tab.Navigator>
    );
  }

  const { authState } = useAuth();

  return (
    <Stack.Navigator screenOptions={({ route }) => ({ headerShown: false, cardStyleInterpolator: (route.name !== 'Login' && route.name !== 'Register') ? CardStyleInterpolators.forHorizontalIOS : CardStyleInterpolators.forBottomSheetAndroid })}>
      {
        authState ?
          (
            <>
              <Stack.Screen name="BottomHome" component={BottomTab} />
            </>
          )
          :
          (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="Forgot" component={ForgotPasswordScreen} />
            </>
          )
      }
    </Stack.Navigator>
  );
} 