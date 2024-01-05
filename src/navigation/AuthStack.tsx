import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import { LoginScreen } from "../screens/stacks/LoginScreen";
import { RegisterScreen } from "../screens/stacks/RegisterScreen";


const Stack = createNativeStackNavigator();
export default function AuthNavigation(){
    return( 
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="Onboarding" component={RegisterScreen}/>
        </Stack.Navigator>
    );
}