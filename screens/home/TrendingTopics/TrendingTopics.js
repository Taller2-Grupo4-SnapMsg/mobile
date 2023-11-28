import { StyleSheet, FlatList, View, RefreshControl} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import React, {useState, useEffect} from 'react'; 
import LoadingMoreIndicator from "../../../components/LoadingMoreIndicator";
import { useUser } from '../../../contexts/UserContext';
import TrendingTopic from "./TrendingTopic";
import { useTrendingTopics } from '../../../contexts/TrendingTopicContext';
import {
  DarkTheme,
  ThemeProvider,
} from '@react-navigation/native';

export default function TrendingTopics({}) {
  const { trendingTopics, 
          loadingMore, 
          refreshing, 
          handleGetMoreTrendingTopics,
          setReachedEnd } = useTrendingTopics();
    const colorScheme = useColorScheme();
    
    // const handleGetMoreTrendingTopicsOnEndReached = async () =>
    // {
    //   setReachedEnd(true);
    //   handleGetMoreTrendingTopics(0, false);
    // }
   return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DarkTheme}>
    <View style={styles.container}>
      <FlatList
        data={trendingTopics}
        renderItem={({ item }) => {
            return <TrendingTopic item={item} />
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => handleGetMoreTrendingTopics(0, true)}
            colors={['#947EB0']}
          />
        }
        //onEndReached={() => handleGetMoreTrendingTopicsOnEndReached()}
        onEndReachedThreshold={0.1}
        />
      {loadingMore && <LoadingMoreIndicator />}
    </View>
    </ThemeProvider>
   );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  },
  floatingButton: {
    backgroundColor: '#947EB0',
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 15,
    bottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  floatingButton2: {
    backgroundColor: '#947EB0',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 15,
    top: 15,
    elevation: 5,
  },
  iconcontainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});