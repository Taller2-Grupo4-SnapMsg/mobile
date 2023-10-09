import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

function formatDateOfBirth(dateOfBirth) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const date = new Date(dateOfBirth);
  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();

  const formattedDate = `${months[month]} ${day}, ${year}`;
  return formattedDate;
}

export default function ProfileExtraInfo({ dateOfBirth, location }) {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.birthdayContainer}>
          <View style={styles.calendarIcon}>
            <FontAwesome name="birthday-cake" size={16} color="#6B5A8E" />
          </View>
          <View style={styles.dateOfBirthContainer}>
            <Text style={styles.statsCountText}>
              {formatDateOfBirth(dateOfBirth)}
            </Text>
          </View>
        </View>
        <View style={styles.locationContainer}>
          <View style={styles.locationIcon}>
            <FontAwesome name="map-marker" size={16} color="#6B5A8E" />
          </View>
          <View style={styles.locationText}>
            <Text style={styles.statsCountText}>{location || 'Earth'}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    fontSize: 16,
  },
  birthdayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  calendarIcon: {
    marginRight: 10,
  },
  dateOfBirthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 10,
  },
  locationText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsCountText: {
    fontWeight: 'bold',
    marginRight: 10,
    color: 'gray',
  },
});
