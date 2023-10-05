import React from "react";
import { View, TextInput } from "react-native";

export default function TextInputField({ value, onChangeText, placeholder, multiline, numberOfLines }) {
  return (
    <View style={styles.textInput}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        editable={true}
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
    </View>
  );
}

const styles = {
  textInput: {
    height: 34,
    width: "100%",
    borderColor: "#ccc",
    borderBottomWidth: 1,
    borderRadius: 4,
    marginVertical: 6,
    justifyContent: "center",
    paddingLeft: 8,
  },
};
