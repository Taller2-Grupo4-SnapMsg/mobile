import React, { useState } from "react";
import { ScrollView, View, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import RoundedCheckboxButton from "../../components/RoundedCheckBox";
import interestsData from "./interestsData";
import SignInButton from "../../components/SignInButton";
import { useNavigation } from "@react-navigation/native";
import changeInterests from "../../handlers/changeInterests";

export default function InterestsList() {
  const itemsPerRow = 3; // Number of items per row
  const navigation = useNavigation();
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleInterest = (interest) => {
    const updatedInterests = [...selectedInterests];
    if (updatedInterests.includes(interest)) {
      updatedInterests.splice(updatedInterests.indexOf(interest), 1);
    } else {
      updatedInterests.push(interest);
    }
    setSelectedInterests(updatedInterests);
  };

  const canProceed = selectedInterests.length > 0;

  const rows = [];
  let currentRow = [];

  for (let i = 0; i < interestsData.length; i++) {
    if (currentRow.length === itemsPerRow) {
      rows.push(currentRow);
      currentRow = [];
    }
    currentRow.push(interestsData[i]);
  }

  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  const handleNextButton = async () => {
    if (canProceed) {
      setIsLoading(true); // Set loading state to true
      try {
        const response = await changeInterests(selectedInterests);
        if (response) {
          navigation.navigate("Home");
        } else {
          Alert.alert("Error", "Error al actualizar intereses");
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred.");
      } finally {
        setIsLoading(false); // Set loading state back to false
      }
    } else {
      Alert.alert("Please select at least one interest");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          What are your <Text style={{ color: '#6B5A8E' }}>interests?</Text>
        </Text>
        <Text style={styles.subtitle}>Select at least one</Text>
      </View>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((item) => (
            <View key={item.id} style={styles.item}>
              <RoundedCheckboxButton
                text={item.name}
                isChecked={selectedInterests.includes(item.name)}
                onToggle={() => toggleInterest(item.name)}
              />
            </View>
          ))}
        </View>
      ))}
      <View style={styles.button}>
      {isLoading ? ( 
          <ActivityIndicator size="small" color="#6B5A8E" />
        ) : (
          <SignInButton onPress={handleNextButton} text="Sign in" />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: "column",
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 75,
    marginBottom: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
  item: {
    marginHorizontal: 3,
    marginVertical: 8,
  },
  button: {
    marginVertical: 25,
  },
  subtitle: {
    fontSize: 18,
  },
});
