import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { API_KEY } from "react-native-dotenv";
import moment from 'moment';

const App = () => {

  const todayDateString = moment().format("YYYY-MM-DD");
    
  const [day, setDay] = useState(todayDateString);
  const [neos, setNeos] = useState([]);
  
  const fetchNeos = () => {
    fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${day}&end_date=${day}&api_key=${API_KEY}`)
    .then(r => r.json())
    .then(data => setNeos(data['near_earth_objects'][day]))
  }

  return (
    <View>
      <StatusBar style="auto" />
      <ScrollView>
      <View style={styles.container}>
        <Text style={styles.text}>Near-Earth Object Finder</Text>
        <Calendar style={styles.calendar} onDayPress={day => setDay(day.dateString)} />
        <Button color='#db2020' title={`Click Here to Find NEOs for ${day}`} onPress={fetchNeos} />
        <View style={styles.cardContainer}>
        {neos && 
          neos.map(item => {
            return (
              <View style={styles.card} key={item.id}>
                <Text>{item.name}</Text>
                <Text>Approximate diameter: {Math.round(item.estimated_diameter.feet.estimated_diameter_min)} ft to {Math.round(item.estimated_diameter.feet.estimated_diameter_max)} ft</Text>
                <Text>Relative velocity: {Math.round(item.close_approach_data[0].relative_velocity.miles_per_hour)} mph</Text>
                <Text>Miss distance: {Math.round(item.close_approach_data[0].miss_distance.miles)} miles</Text>
                <Text>Potentially Hazardous? {item.is_potentially_hazardous_asteroid === true ? 'Yes' : 'No'}</Text>
              </View>
            );
          })
        }
        </View>
        </View>
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
  },
  card: {
    marginBottom: 15,
    borderColor: '#bacdd8',
    backgroundColor: '#bacdd8',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 6,
    paddingTop: 4,
    paddingBottom: 4
  },
  cardContainer: {
    marginTop: 15
  },
  calendar: {
    marginBottom: 15
  }
});