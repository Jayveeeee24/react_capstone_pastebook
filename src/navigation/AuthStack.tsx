import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "../screens/stacks/authentication/LoginScreen";
import { RegisterScreen } from "../screens/stacks/authentication/RegisterScreen";
import { AppStack } from "./AppStack";


const Stack = createNativeStackNavigator();
export default function AuthStack() {
    return (
        <Stack.Navigator screenOptions={({ route }) => ({ headerShown: false, animation: 'slide_from_bottom' })}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="AppStack" component={AppStack} />
        </Stack.Navigator>
    );
}