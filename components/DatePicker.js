import React, { useState } from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import { Feather } from '@expo/vector-icons'; // Assuming you are using Expo for icons
import { getFormatedDate } from 'react-native-modern-datepicker';

function DatePickerModal({ visible, onDateChange, onContinue }) {
    const today = new Date();
    const startDate = getFormatedDate(
      today.setDate(today.getDate() + 1),
      "YYYY/MM/DD"
      );
      
    const minDate = getFormatedDate(today, "YYYY/MM/DD");

    
    return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
        >   
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: 'rgba(0, 0, 0, 1)', // Semi-transparent background

            }}
          >
             <View>
        <Text style={{color: '#fff'}}>Please, select your date of birth</Text>
        </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 20,
                padding: 35,
                width: "95%",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
              }}
            >
              <DatePicker
                mode="calendar"
                maximumDate={minDate}
                minDate={today}
                selected={startDate}
                onSelectedChange={onDateChange}
                options={{
                  textHeaderColor: "#fff",
                  textDefaultColor: "#fff",
                  mainColor: "#6B5A8E",
                  textSecondaryColor: "#fff",
                  borderColor: "#6B5A8E",
                }}
              />
             </View>
                <View>
                <TouchableOpacity  style={styles.followButton} onPress={onContinue}>

                    <Text style={styles.followButtonText}>
                        Continue
                    </Text>
                    </TouchableOpacity>
                </View>

          </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    followButton: {
        
        backgroundColor: '#6B5A8E', // Change the background color as needed
        paddingHorizontal: 35,
        paddingVertical: 10,
        borderRadius: 60,
      },
      followButtonText: {
        fontWeight: 'bold',
      },
    }); 


export default DatePickerModal;
