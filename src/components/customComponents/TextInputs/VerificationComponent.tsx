import { StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors, credentialTextTheme, globalStyles } from "../../../utils/GlobalStyles";
import { TextInput } from "react-native-paper";

interface VerificationComponentProps {
    isVerificationCodeValid: boolean;
    verificationCode: string;
    setVerificationCode: (verificationCode: string) => void;
}

export const VerificationComponent: React.FC<VerificationComponentProps> = ({ verificationCode, setVerificationCode, isVerificationCodeValid }) => {
    return (
        <>
            <View style={[styles.container, { marginBottom: isVerificationCodeValid ? 10 : 0 }]}>
                <MaterialCommunityIcons name="email-check-outline" size={30} color="#666" style={{ marginHorizontal: 5 }} />
                <TextInput
                    placeholder="Verification Code"
                    theme={credentialTextTheme}
                    style={[globalStyles.textDefaults, styles.verificationTextInput]}
                    placeholderTextColor={Colors.placeholderTextColor}
                    value={verificationCode}
                    onChangeText={setVerificationCode} />
            </View>
            {!isVerificationCodeValid && (
                <Text style={styles.warningText}>Please enter the verification code sent in the email</Text>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomColor: '#ccc',
        marginHorizontal: 30,
        alignItems: "center"
    },
    verificationTextInput: {
        fontSize: 18,
        flex: 1,
        backgroundColor: 'transparent'
    },
    warningText: {
        color: Colors.danger,
        marginStart: 30
    }
});