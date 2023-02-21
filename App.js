import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { API_KEY } from "react-native-dotenv";
import moment from 'moment';

const App = () => {

  const todaysDateString = moment().format("YYYY-MM-DD");

  useEffect(() => {
    fetchNeos(todaysDateString);
  }, [])

  const [dateSubmittedToApi, setDateSubmittedToApi] = useState(todaysDateString);
  const [neos, setNeos] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchNeos = (date) => {
    setLoading(true);
    setDateSubmittedToApi(date);
    fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${API_KEY}`)
    .then(r => r.json())
    .then(r => { 
      setNeos(r['near_earth_objects'][date]);
      setLoading(false);
    })
  }

  const removeHyphensFromDate = dateSubmittedToApi.split('-').join('');
  const b = moment(removeHyphensFromDate, 'YYYYMMDD');
  const dateForResults = b.format("MMM Do YYYY");
  
  return (
    <View style={styles.background}>
      <StatusBar style="auto" />
      <ScrollView>
      <View style={styles.container}>
        <Text style={styles.text}>Near-Earth Object Finder</Text>
        <Calendar 
          style={styles.calendar}
          initialDate={todaysDateString}
          onDayPress={day => fetchNeos(day.dateString)} 
          markedDates={{ [dateSubmittedToApi]: {selected: true, selectedColor: '#078080'}}}
          theme={{
            backgroundColor: '#fffffe',
            calendarBackground: '#fffffe',
            arrowColor: '#f45d48',
            textSectionTitleColor: '#232323',
            monthTextColor: '#232323',
            textMonthFontWeight: '400',
            todayTextColor: '#f45d48',
          }}
          />
        {loading && 
          <ActivityIndicator style={styles.spinner} size='large' color='#f45d48' />
        }
        {!loading && 
          <Text style={styles.neoTitle}>NEOs for {dateForResults}:</Text>
        }
        <View style={styles.cardContainer}>
        {!loading &&
          neos.map(neo => {
            return (
              <View style={styles.card} key={neo.id}>
                <Text style={styles.name}>{neo.name}</Text>
                <Text style={styles.desc}>Approximate diameter: {Math.round(neo.estimated_diameter.feet.estimated_diameter_min)} ft to {Math.round(neo.estimated_diameter.feet.estimated_diameter_max)} ft</Text>
                <Text style={styles.desc}>Relative velocity: {Math.round(neo.close_approach_data[0].relative_velocity.miles_per_hour)} mph</Text>
                <Text style={styles.desc}>Miss distance: {Math.round(neo.close_approach_data[0].miss_distance.miles)} miles</Text>
                <Text style={styles.desc}>Potentially hazardous? {neo.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}</Text>
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
  background: {
    backgroundColor: '#fffffe',
  },  
  container: {
    flex: 1,
    padding: 25,
    marginTop: 8,
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    color: '#232323',
    marginBottom: 5,
  },
  card: {
    marginBottom: 15,
    borderColor: '#f8f5f2',
    backgroundColor: '#f8f5f2',
    borderWidth: 1,
    borderRadius: 7,
    padding: 10,
  },
  cardContainer: {
    marginTop: 12,
  },
  calendar: {
    marginBottom: 15,
  },
  neoTitle: {
    textAlign: 'center',
    fontSize: 20,
    color: '#232323',
  },
  spinner: {
    marginTop: 8,
    marginBottom: 8,
    padding: 5,
  },
  name: {
    color: '#232323',
    fontSize: 20,
    fontWeight: '500',
  },
  desc: {
    color: '#232323',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#078080',
      alignItems: 'center', 
      justifyContent: 'center',
      borderRadius: 7,
      height: 40,
  }
});