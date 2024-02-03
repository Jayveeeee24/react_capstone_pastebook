import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    textDefaults: {
        fontFamily: 'Roboto-Medium', color: 'black'
    }
});

export const Colors = {
    primaryBrand: '#3373B0',
    secondaryBrand: '#eab676',
    success: '#22bb33',
    warning: '#FF8A65',
    danger: '#EF5350',
    orange: '#FF5722',
    placeholderColor: "#666",
    borderBottomColor: "#ccc"
}

export const credentialTextTheme = { colors: { primary: Colors.primaryBrand } };
