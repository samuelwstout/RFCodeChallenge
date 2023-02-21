import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { API_KEY } from "react-native-dotenv";
import moment from 'moment';

const App = () => {

  const todayDateString = moment().format("YYYY-MM-DD");

  const [dayCalendar, setDayCalendar] = useState(todayDateString);
  const [dayFetch, setDayFetch] = useState('');
  const [neos, setNeos] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchNeos = () => {
    setLoading(true);
    fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${dayCalendar}&end_date=${dayCalendar}&api_key=${API_KEY}`)
    .then(r => r.json())
    .then(data => { 
      setNeos(data['near_earth_objects'][dayCalendar]);
      setDayFetch(dayCalendar);
      setLoading(false);
    })
  }

  const dayCalendarNoHyphens = dayCalendar.split('-').join('');
  let a = moment(dayCalendarNoHyphens, 'YYYYMMDD');
  const dayCalendarForButton = a.format("MMM Do YYYY");

  const dayFetchNoHyphens = dayFetch.split('-').join('');
  let b = moment(dayFetchNoHyphens, 'YYYYMMDD');
  const dayFetchForResults = b.format("MMM Do YYYY");
  
  return (
    <View style={styles.background}>
      <StatusBar style="auto" />
      <ScrollView>
      <View style={styles.container}>
        <Text style={styles.text}>Near-Earth Object Finder</Text>
        <Calendar 
          style={styles.calendar} 
          onDayPress={day => setDayCalendar(day.dateString)} 
          markedDates={{ [dayCalendar]: {selected: true, selectedColor: '#078080'}}}
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
        <TouchableOpacity onPress={fetchNeos}>
          <View style={styles.button}>
            <Text style={{ color: '#232323', fontSize: 20, fontWeight: '315' }}>Find NEOs for {dayCalendarForButton}</Text>
          </View>
        </TouchableOpacity>

        {loading && 
          <ActivityIndicator style={styles.spinner} size='large' color='#f45d48' />
        }
        {neos.length !== 0 && 
          <Text style={styles.neoTitle}>NEOs for {dayFetchForResults}:</Text>
        }
        <View style={styles.cardContainer}>
        {
          neos.map(item => {
            return (
              <View style={styles.card} key={item.id}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.desc}>Approximate diameter: {Math.round(item.estimated_diameter.feet.estimated_diameter_min)} ft to {Math.round(item.estimated_diameter.feet.estimated_diameter_max)} ft</Text>
                <Text style={styles.desc}>Relative velocity: {Math.round(item.close_approach_data[0].relative_velocity.miles_per_hour)} mph</Text>
                <Text style={styles.desc}>Miss distance: {Math.round(item.close_approach_data[0].miss_distance.miles)} miles</Text>
                <Text style={styles.desc}>Potentially hazardous? {item.is_potentially_hazardous_asteroid === true ? 'Yes' : 'No'}</Text>
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
    marginTop: 15,
  },
  calendar: {
    marginBottom: 15,
  },
  neoTitle: {
    marginTop: 14,
    textAlign: 'center',
    fontSize: 20,
    color: '#232323',
  },
  spinner: {
    marginTop: 12,
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