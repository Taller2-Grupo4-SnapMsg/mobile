import React, { useState } from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-elements";

export default function RoundedCheckboxButton({ text, isChecked, onToggle }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button
        title={text}
        onPress={onToggle}
        buttonStyle={{
          borderRadius: 25, 
          backgroundColor: isChecked ? "#6B5A8E" : "#eae4f7",
        }}
      />
    </View>
  );
}
