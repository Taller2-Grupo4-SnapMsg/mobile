import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { useUser } from '../../contexts/UserContext';
import getStatistics from '../../handlers/statistics/getStatistics';

function formatDate(date) {
  return date.replace("T", "_").split(".")[0];
}

const Statistics = () => {
  const { loggedInUser } = useUser();
  const [fromDate, setFromDate] = useState((new Date(1999, 0, 1)).toISOString());
  const [toDate, setToDate] = useState((new Date()).toISOString());
  const [data, setData] = useState([
    { category: 'My Posts', value: 1000 },
    { category: 'My Likes', value: 500 },
    { category: 'My Reposts', value: 2000 },
    { category: 'Reposts of My Content', value: 1000 },
  ])
  
  const renderStatItem = ({ item }) => (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{item.value}</Text>
      <Text style={styles.statsCategory}>{item.category}</Text>
    </View>
  );

  const handlePress = async () => {
    stats = await getStatistics(formatDate(fromDate), formatDate(toDate));
    console.log("stats: ", stats);

    const transformedStats = [
      { category: 'My Posts', value: stats.my_posts_count },
      { category: 'My Likes', value: stats.likes_count },
      { category: 'My Reposts', value: stats.my_reposts_count },
      { category: 'Reposts of My Content', value: stats.others_reposts_count },
    ];
    setData(transformedStats);
  };

  useEffect(() => {
    handlePress();
  }, []);


  return (
    <View style={styles.container}>
      <View style={styles.userCard}>
        <View>
          <Image source={{ uri: loggedInUser.avatar }} style={styles.userPhoto} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{loggedInUser.username} ~ {loggedInUser.name} {loggedInUser.last_name} </Text>
          <TouchableOpacity onPress={handlePress}>
          <View style={{ backgroundColor: 'blue', padding: 10 }}>
            <Text style={{ color: 'white' }}>Get statistics</Text>
          </View>
        </TouchableOpacity>
        </View>
      </View>
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>My Stats</Text>
        <FlatList
          data={data}
          renderItem={renderStatItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop:60,
},
userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
},
userPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
},
userInfo: {
    flex: 1,
    marginLeft: 10,
},
userName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
},
userFollowers: {
    color: '#999',
},
editButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#008B8B',
},
editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
},
statsCard: {
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f4f4f4',
},
statsTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
},
statItem: {
    marginTop:20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
},
statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
},
statsCategory: {
    color: '#999',
},
addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6495ED',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
},
addButtonText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
},
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
    }
});

export default Statistics