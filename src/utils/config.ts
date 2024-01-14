import { MMKV } from "react-native-mmkv";

// export const BASE_URL = 'http://172.26.171.77:7208';//office lan
export const BASE_URL = 'http://192.168.55.107:7208';//dorm

export const storage = new MMKV();

export const colors = {
    primaryBrand: '#3373B0',
    secondaryBrand: '#eab676',
}