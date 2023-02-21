import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { API_KEY } from "react-native-dotenv";

const App = () => {

  const todayDateString = new Date().toISOString().split('T')[0];  

  const [day, setDay] = useState(todayDateString);
  const [neos, setNeos] = useState([]);
  
  const fetchNeos = () => {
    fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${day}&end_date=${day}&api_key=${API_KEY}`)
    .then(r => r.json())
    .then(data => setNeos(data['near_earth_objects'][day]))
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView>
        <Text style={styles.text}>Near Earth Object Finder</Text>
        <Calendar onDayPress={day => setDay(day.dateString)} />
        <Button color='#db2020' title={`Find NEOs for ${day}`} onPress={fetchNeos} />
        {neos && 
          neos.map(item => {
            return (
              <View key={item.id}>
                <Text>Name: {item.name}</Text>
                <Text>Approximate Diameter in Feet: {item.estimated_diameter.feet.estimated_diameter_min} to {item.estimated_diameter.feet.estimated_diameter_max}</Text>
                <Text>Relative Velocity in mph: {item.close_approach_data[0].relative_velocity.miles_per_hour}</Text>
                <Text>Miss distance in miles: {item.close_approach_data[0].miss_distance.miles}</Text>
                <Text>Potentially Hazardous? {item.is_potentially_hazardous_asteroid.toString()}</Text>
              </View>
            );
          })
        }
      </ScrollView>
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    marginTop: 10
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
  }
});