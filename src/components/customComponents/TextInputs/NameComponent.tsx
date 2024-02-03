import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors, credentialTextTheme, globalStyles } from "../../../utils/GlobalStyles";

interface NameComponentProps {
    name: string;
    setName: (name: string) => void;
    isNameValid: boolean;
    placeholderText: string;
    warningText: string
}

export const NameComponent: React.FC<NameComponentProps> = ({ name, setName, isNameValid, placeholderText, warningText }) => {
    return (
        <>
            <View style={[styles.container, { marginBottom: isNameValid ? 10 : 0 }]}>
                <MaterialCommunityIcons
                    name="account-box-outline"
                    size={30}
                    color={Colors.placeholderColor}
                    style={{ marginHorizontal: 5 }} />
                <TextInput
                    placeholder={placeholderText}
                    theme={credentialTextTheme}
                    style={[globalStyles.textDefaults, styles.textInput]}
                    placeholderTextColor={Colors.placeholderColor}
                    value={name}
                    onChangeText={setName} />
            </View>
            {!isNameValid && (
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
        marginStart: 60
    }
});