import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "../screens/stacks/LoginScreen";
import { RegisterScreen } from "../screens/stacks/RegisterScreen";


const Stack = createNativeStackNavigator();
export default function AuthNavigation(){
    return( 
        <Stack.Navigator screenOptions={{headerShown: false, animation: 'slide_from_bottom'}}>
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="Register" component={RegisterScreen}/>
        </Stack.Navigator>
    );
}