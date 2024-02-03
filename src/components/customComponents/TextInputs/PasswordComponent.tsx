import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Colors, credentialTextTheme, globalStyles } from "../../../utils/GlobalStyles";
import { useState } from "react";

interface PasswordComponentProps {
    isPasswordValid: boolean;
    password: string;
    setPassword: (password: string) => void;
    warningText: string,
    placeholderText: string;
}

export const PasswordComponent: React.FC<PasswordComponentProps> = ({ isPasswordValid, password, setPassword, warningText, placeholderText }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <View style={[styles.container, { marginBottom: isPasswordValid ? 10 : 0 }]}>
                <MaterialIcons name="lock-outline" size={20} color="#666" style={{ marginHorizontal: 5 }} />
                <TextInput
                    placeholder={placeholderText}
                    theme={credentialTextTheme}
                    right={<TextInput.Icon
                        icon={showPassword ? 'eye-off' : 'eye'}
                        onPress={togglePasswordVisibility} />}
                    secureTextEntry={!showPassword}
                    style={[globalStyles.textDefaults, styles.textInput]}
                    placeholderTextColor={'#666'}
                    value={password}
                    onChangeText={setPassword} />
            </View>
            {!isPasswordValid && (
                <Text style={styles.warningText}>{warningText}</Text>
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
    textInput: {
        color: 'black',
        fontSize: 18,
        flex: 1,
        backgroundColor: 'transparent'
    },
    warningText: {
        color: Colors.danger,
        marginStart: 30
    }
});