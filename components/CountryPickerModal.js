import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import CountryPicker from 'react-native-country-picker-modal'

export default function CountryPickerModal({ handleCountryChange, selectedCountryName }) {
  return (
    <View style={styles.countryPickerContainer}>
      <CountryPicker
        {...{
          onSelect: handleCountryChange,
          placeholder: selectedCountryName,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Your styles...
});
