import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Colors, credentialTextTheme, globalStyles } from "../../../utils/GlobalStyles";

interface EmailComponentProps {
    email: string;
    setEmail: (email: string) => void;
    isValidEmail: boolean;
    isEmailAvailable: boolean
}

export const EmailComponent: React.FC<EmailComponentProps> = ({ email, setEmail, isValidEmail, isEmailAvailable }) => {
    return (
        <>
            <View style={[styles.container, { marginBottom: isValidEmail ? 10 : 0 }]}>
                <MaterialIcons name="alternate-email" size={20} color={Colors.placeholderTextColor} style={{ marginHorizontal: 5 }} />
                <TextInput
                    placeholder="Email Address"
                    style={[globalStyles.textDefaults, styles.emailTextInput]}
                    value={email}
                    onChangeText={setEmail}
                    theme={credentialTextTheme}
                    placeholderTextColor={Colors.placeholderTextColor} />
            </View>
            {!isValidEmail && (
                <Text style={styles.warningText}>Please enter a valid email address.</Text>
            )}
            {!isEmailAvailable && (
                <Text style={styles.warningText}>This email is already in use. Please use a different email address.</Text>
            )}
        </>
    );
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomColor: Colors.borderBottomColor,
        marginHorizontal: 30,
        alignItems: "center"
    },
    emailTextInput: {
        fontSize: 18,
        flex: 1,
        backgroundColor: 'transparent'
    },
    warningText: {
        color: Colors.danger,
        marginStart: 30
    }
});