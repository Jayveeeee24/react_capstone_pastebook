import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from "react-native-paper";

interface DatePickerComponentProps {
    dateOfBirth: Date;
    setDateOfBirth: (value: Date) => void;//React.Dispatch<React.SetStateAction<Date>>
    isDateOfBirthValid: boolean;
  }

export const DatePickerComponent: React.FC<DatePickerComponentProps> = ({ dateOfBirth, setDateOfBirth, isDateOfBirthValid }) => {
  const [show, setShow] = useState(false);

  const onChange = (e: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setDateOfBirth(selectedDate);
      setShow(false);
    }
  };

  return (
    <View>
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
          <Card.Content style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={[styles.text, styles.textStyle]}>{dateOfBirth.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</Text>
            <MaterialCommunityIcons name="calendar" size={26} />
          </Card.Content>
        </Card>
      </TouchableWithoutFeedback>
      {!isDateOfBirthValid && (
        <Text style={[styles.textValidation, { marginTop: 5 }]}>Please enter a valid birthdate (13 y.o. up)</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  textValidation: {
    color: 'red', marginStart: 30
  },
  datePickerCard: {
    backgroundColor: "white",
    borderRadius: 5,
    marginTop: 10,
  },
  text: {
    fontFamily: 'Roboto-Medium'
  },
  textStyle: {
    color: '#666',
    fontSize: 16,
  },
});
