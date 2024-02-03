import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from "react-native-paper";
import { Colors, globalStyles } from '../../utils/GlobalStyles';

interface DatePickerComponentProps {
  dateOfBirth: Date;
  setDateOfBirth: (value: Date) => void;
  isDateOfBirthValid: boolean;
}

export const DatePickerComponent: React.FC<DatePickerComponentProps> = ({ dateOfBirth, setDateOfBirth, isDateOfBirthValid }) => {
  const [show, setShow] = useState(false);

  const onChange = (e: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setShow(false);
      setDateOfBirth(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      {show && (
        <DateTimePicker
          value={dateOfBirth}
          mode={"date"}
          is24Hour={true}
          onChange={onChange}
        />
      )}
      <TouchableWithoutFeedback onPress={() => { setShow(true) }}>
        <Card style={styles.datePickerCard}>
          <Card.Content style={styles.content}>
            <Text style={[styles.textStyle]}>
              {dateOfBirth.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            <MaterialCommunityIcons name="calendar" size={26} color={Colors.placeholderColor} />
          </Card.Content>
        </Card>
      </TouchableWithoutFeedback>
      {!isDateOfBirthValid && (
        <Text style={[styles.textWarning, { marginTop: 5 }]}>Please enter a valid birthdate (13 y.o. up)</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
    marginHorizontal: 30
  },
  datePickerCard: {
    backgroundColor: "white",
    borderRadius: 5,
    marginTop: 10,
    shadowOpacity: 1
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  textStyle: {
    color: '#666',
    fontSize: 16,
    fontFamily: 'Roboto-Medium'
  },
  textWarning: {
    color: Colors.danger,
    marginStart: 30
  },
});
