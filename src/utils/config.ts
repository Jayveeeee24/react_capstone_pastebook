import { MMKV } from "react-native-mmkv";
import { formatDistanceToNow } from 'date-fns';

// export const BASE_URL = 'http://172.26.171.77:7208';//office lan
// export const BASE_URL = 'http://172.26.171.142:7208'; //office wifi mc1
export const BASE_URL = 'http://192.168.55.102:7208';//dorm


export const Storage = new MMKV();

export const Colors = {
    primaryBrand: '#3373B0',
    secondaryBrand: '#eab676',
    success: '#22bb33',
    warning: '#FF8A65',
    danger: '#F56C6C',
    orange: '#FF5722'

}
export const credentialTextTheme = { colors: { primary: Colors.primaryBrand } };

export const convertToRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const relativeTime = formatDistanceToNow(date, { addSuffix: false });

    // Extract number and unit using regex
    const match = relativeTime.match(/(\d+) (\w+)/);
    if (match) {
        const [_, number, unit] = match;
        const modifiedUnit = Number(number) < 0 ? unit.replace(/s$/, '') : unit; // Remove 's' from the end of the unit if number is greater than 1
        return `${number} ${modifiedUnit} ago`; // Using only the first character of the unit
    }

    return relativeTime; // Return the original relative time if no match
};