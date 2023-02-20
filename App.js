import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

const App = () => {

  const todayDateString = new Date().toISOString().split('T')[0];

  const [day, setDay] = useState(todayDateString);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Calendar onDayPress={day => setDay(day.dateString)} />
      <Text>{day}</Text>
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    position: 'relative',
    top: 20
  },
});
