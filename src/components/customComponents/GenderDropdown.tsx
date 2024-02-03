// CustomDropdown.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from "react-native-element-dropdown";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../utils/GlobalStyles';

interface GenderDropdown {
  data: { label: string; value: string; }[];
  value: string;
  onValueChange: (value: string) => void;
  isGenderValid: boolean;
}

export const GenderDropdown: React.FC<GenderDropdown> = ({ data, value, onValueChange, isGenderValid }) => {
  const renderItem = (item: any) => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === value && (
          <MaterialCommunityIcons
            style={styles.icon}
            color="black"
            name="gender-male-female"
            size={20}
          />
        )}
      </View>
    );
  };

  return (
    <>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.textStyle}
        selectedTextStyle={styles.textStyle}
        iconStyle={styles.iconStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={'Gender'}
        value={value}
        onChange={(item) => {
          onValueChange(item.value);
        }}
        renderLeftIcon={() => (
          <MaterialCommunityIcons style={styles.icon} color="black" name="gender-male-female" size={20} />
        )}
        renderItem={renderItem}
      />
      {!isGenderValid && (
        <Text style={[styles.textValidation, { marginTop: 5 }]}>Please choose a valid gender</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  textValidation: {
    color: Colors.danger, 
    marginStart: 30
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  textStyle: {
    color: '#666',
    fontSize: 16,
  },
  dropdown: {
    marginHorizontal: 30,
    marginTop: 10,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});