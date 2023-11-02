import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Modal } from 'react-native';
import { useUser } from '../../contexts/UserContext';
import getStatistics from '../../handlers/statistics/getStatistics';
import DatePicker from 'react-native-modern-datepicker';
import PurpleButton from "../../components/PurpleButton";

function formatDate(date) {
  return date.replace("T", "_").split(".")[0];
}

const Statistics = () => {
  const { loggedInUser } = useUser();
  const [isFromDatePickerVisible, setFromDatePickerVisible] = useState(false);
  const [isToDatePickerVisible, setToDatePickerVisible] = useState(false);
  const [fromDate, setFromDate] = useState((new Date(1999, 0, 1)).toISOString());
  const [toDate, setToDate] = useState(new Date().toISOString());
  const [isChoosingDate, setIsChoosingDate] = useState(false);
  const [isGettingStatistics, setIsGettingStatistics] = useState(false);
  const [data, setData] = useState([
    { category: 'My Posts', value: 1000 },
    { category: 'My Likes', value: 500 },
    { category: 'My Reposts', value: 2000 },
    { category: 'Reposts of My Content', value: 1000 },
  ])

  const openToDatePicker = () => {
    setToDatePickerVisible(true);
  }
  
  const openFromDatePicker = () => {
    setFromDatePickerVisible(true);
  }

  const handleToDateChange = (date) => {
    const dateComponents = date.split('/');
  
    if (dateComponents.length === 3) {
      const [year, month, day] = dateComponents;
      
      // Construct a Date object from the components
      const selectedDate = new Date(year, month - 1, day);
      
      // Format the selected date as an ISO string
      const formattedDate = selectedDate.toISOString();
      
      setToDate(formattedDate);
      setToDatePickerVisible(false);
    } else {
      // Handle an invalid date string
      console.error('Invalid date format:', date);
    }
  };

  const handleFromDateChange = (date) => {
    const dateComponents = date.split('/');
  
    if (dateComponents.length === 3) {
      const [year, month, day] = dateComponents;
      const selectedDate = new Date(year, month - 1, day);
      const formattedDate = selectedDate.toISOString();
      
      setFromDate(formattedDate);
      setFromDatePickerVisible(false);
    } else {
      // Handle an invalid date string
      console.error('Invalid date format:', date);
    }
  };

  const renderStatItem = ({ item }) => (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{item.value}</Text>
      <Text style={styles.statsCategory}>{item.category}</Text>
    </View>
  );

  const setStats = (my_posts_count, likes_count, my_reposts_count, others_reposts_count) => {
    return [
      { category: 'My Posts', value: my_posts_count },
      { category: 'My Likes', value: likes_count },
      { category: 'My Reposts', value: my_reposts_count },
      { category: 'Reposts of My Content', value: others_reposts_count },
    ];
  }

  const handlePress = async () => {
    if (!isGettingStatistics) {
      stats = await getStatistics(formatDate(fromDate), formatDate(toDate));
      transformedStats = setStats(0, 0, 0, 0);
      if (stats) {
        transformedStats = setStats(stats.my_posts_count, stats.likes_count, stats.my_reposts_count, stats.others_reposts_count);
      } 
      setData(transformedStats);
    }
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
        </View>
      </View>

      <View style={styles.chooseDates}>
  <View style={styles.row}>
    <View style={styles.wide}>
      <PurpleButton onPress={openFromDatePicker} text="Select From Date" loading={isChoosingDate} width='85%' />
    </View>
    
    <View style={styles.right}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{new Date(fromDate).toLocaleDateString('en-GB')}</Text>
      </View>
    </View>
  </View>

  <View style={styles.row}>
    <View style={styles.wide}>
      <PurpleButton onPress={openToDatePicker} text="Select To Date" loading={isChoosingDate} width='85%' />
    </View>
    
    <View style={styles.right}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{new Date(toDate).toLocaleDateString('en-GB')}</Text> 
      </View>
    </View>
  </View>

  <View style={styles.centeredRow}>
    <PurpleButton
      onPress={handlePress}
      text="Get My Statistics"
      loading={isGettingStatistics}
      width='85%'
    />
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

      <Modal
        visible={isToDatePickerVisible}
        transparent={true}
        animationType="slide"
      >

      <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <DatePicker
          mode="calendar"
          onDateChange={handleToDateChange}
          current={new Date().toISOString().split('T')[0]}
          selected={new Date().toISOString().split('T')[0]}
          style={{ borderRadius: 10 }}
        />
        </View>
        </View>
      </Modal>

      <Modal
        visible={isFromDatePickerVisible}
        transparent={true}
        animationType="slide"
      >

      <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <DatePicker
          mode="calendar"
          onDateChange={handleFromDateChange}
          current={new Date().toISOString().split('T')[0]} // Get today's date in "YYYY-MM-DD" format
          selected={new Date().toISOString().split('T')[0]} // Get today's date in "YYYY-MM-DD" format
          style={{ borderRadius: 10 }}
        />
        </View>
        </View>
      </Modal>
      
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
    paddingTop: 50,
},
chooseDates: {
  paddingHorizontal: 20,
  paddingVertical: 10,
},
row: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginVertical: 10,
},
centeredRow: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginVertical: 10,
},
wide: {
  flex: 1, // Use flex to ensure buttons occupy equal space
  width: 2000, // Set a specific width for the button
},
right: {
  flex: 1,
  marginLeft: 10,
},
dateContainer: {
  borderColor: 'gray',
  borderWidth: 1,
  padding: 5,
  flexDirection: 'row', // To make 'Selected From Date' and 'fromDate' align horizontally
  alignItems: 'center',
  justifyContent: 'space-between',
},

dateText: {
  fontSize: 14,
  marginLeft: 50,
},
userPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
},
modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalContent: {
  borderRadius: 10,
  width: '80%',
  elevation: 5,
},
userInfo: {
    flex: 1,
    marginLeft: 10,
    paddingBottom: 30,
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