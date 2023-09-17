import { StyleSheet, FlatList, View } from "react-native";
import tweets from "../assets/data/tweets";
import React from 'react'; 
import Tweet from "../components/Tweet";

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={tweets}
        renderItem={({ item }) => <Tweet tweet={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgray",
  },
});
