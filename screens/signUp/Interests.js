import React, { useState } from "react";
import { ScrollView, View, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import RoundedCheckboxButton from "../../components/RoundedCheckBox";
import interestsData from "./interestsData";
import SignInButton from "../../components/PurpleButton";
import { useNavigation } from "@react-navigation/native";
import changeInterests from "../../handlers/changeInterests";
import NextButton from "../../components/PurpleButton";

export default function InterestsList() {
  const itemsPerRow = 3; 
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
      setIsLoading(true); 
      try {
        const response = await changeInterests(selectedInterests);
        if (response) {
          navigation.navigate("MainNavigator");
          navigation.reset({
            index: 0,
            routes: [{ name: "MainNavigator" }],
          });
        } else {
          Alert.alert("Error", "Error al actualizar intereses");
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred.");
      } finally {
        setIsLoading(false); 
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
        <NextButton onPress={handleNextButton} text="Next" loading={isLoading} />
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
