import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, FlatList, Modal, Alert, ActivityIndicator } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list'
import { useUser } from '../../contexts/UserContext';
import getStatistics from '../../handlers/statistics/getStatistics';
import DatePicker from 'react-native-modern-datepicker';
import PurpleButton from "../../components/PurpleButton";
import { useNavigation } from '@react-navigation/native';
function formatDate(date) {
  return date.replace("T", "_").split(".")[0];
}

DEFAULT_OP1 = 'Last 3 days'
DEFAULT_OP2 = 'Last 7 days'
DEFAULT_OP3 = 'Last 2 weeks'
DEFAULT_OP4 = 'Last month'
DEFAULT_OP5 = 'Last 6 months'

DAYS_FROM_OP1 = 3
DAYS_FROM_OP2 = 7
DAYS_FROM_OP3 = 14
DAYS_FROM_OP4 = 30
DAYS_FROM_OP5 = 180

const Statistics = () => {
  const { loggedInUser } = useUser();
  const [isFromDatePickerVisible, setFromDatePickerVisible] = useState(false);
  const [isToDatePickerVisible, setToDatePickerVisible] = useState(false);
  const [fromDate, setFromDate] = useState((new Date(1999, 0, 1)).toISOString());
  const [toDate, setToDate] = useState(new Date().toISOString());
  const [isChoosingDate, setIsChoosingDate] = useState(false);
  const [isGettingStatistics, setIsGettingStatistics] = useState(false);
  const [defaultOptionSelected, setDefaultOptionSelected] = useState("");
  const navigation = useNavigation();
  const [data, setData] = useState([
    { category: 'My Posts', value: 1000 },
    { category: 'My Likes', value: 500 },
    { category: 'My Reposts', value: 2000 },
    { category: 'Reposts of My Content', value: 1000 },
  ])
  const defaultOptions = [
    {key:'1', value: DEFAULT_OP1},
    {key:'2', value: DEFAULT_OP2},
    {key:'3', value: DEFAULT_OP3},
    {key:'4', value: DEFAULT_OP4},
    {key:'5', value: DEFAULT_OP5},
  ]

  const setDefaultOption = (defaultSelected) => {

    setDefaultOptionSelected(defaultSelected);
    const today = new Date(); 

    if (defaultSelected == DEFAULT_OP1) {
      const daysAgo = new Date(today);
      daysAgo.setDate(today.getDate() - DAYS_FROM_OP1); // Subtract 3 days
    
      setFromDate(daysAgo.toISOString());
    } else if (defaultSelected == DEFAULT_OP2) {
      const daysAgo = new Date(today);
      daysAgo.setDate(today.getDate() - DAYS_FROM_OP2); 
    
      setFromDate(daysAgo.toISOString());
    } else if (defaultSelected == DEFAULT_OP3) {
      const daysAgo = new Date(today);
      daysAgo.setDate(today.getDate() - DAYS_FROM_OP3); 
    
      setFromDate(daysAgo.toISOString());

    } else if (defaultSelected == DEFAULT_OP4) {
      const daysAgo = new Date(today);
      daysAgo.setDate(today.getDate() - DAYS_FROM_OP4); 
    
      setFromDate(daysAgo.toISOString());
    } else if (defaultSelected == DEFAULT_OP5) {
      const daysAgo = new Date(today);
      daysAgo.setDate(today.getDate() - DAYS_FROM_OP5); 
    
      setFromDate(daysAgo.toISOString());
    } else {
      return;
    }

    setToDate(today.toISOString());
  }

  const showFormatedDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString('en-GB')
  }

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
      setDefaultOptionSelected("");
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
      setDefaultOptionSelected("");
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
      if (toDate && fromDate) {
        setIsGettingStatistics(true);
        const toDate_date = new Date(toDate);
        const fromDate_date = new Date(fromDate);
  
        if (toDate_date.getTime() > fromDate_date.getTime()) {
          stats = await getStatistics(formatDate(fromDate), formatDate(toDate), navigation);
          transformedStats = setStats(0, 0, 0, 0);
          if (stats) {
            transformedStats = setStats(stats.my_posts_count, stats.likes_count, stats.my_reposts_count, stats.others_reposts_count);
          } 
          setData(transformedStats);
          setIsGettingStatistics(false);
        }
        else {
          Alert.alert('Error', 'Date range not valid!');
        }
      }
      else {
        Alert.alert('Error', 'Dates not chosen!');
      }
    } else {
      Alert.alert('Success', 'Loading!');
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
            <Text style={styles.dateText}>{showFormatedDate(fromDate)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.wide}>
          <PurpleButton onPress={openToDatePicker} text="Select To Date" loading={isChoosingDate} width='85%' />
        </View>
        
        <View style={styles.right}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{showFormatedDate(toDate)}</Text> 
          </View>
        </View>
      </View>

      <View style={{ paddingTop: 20 }}>
        <SelectList 
          setSelected={(val) => setDefaultOption(val)} 
          data={defaultOptions} 
          searchPlaceholder="Select a premade option"
          save="value"
          />
        </View>

      <View style={styles.centeredRow}>
        {isGettingStatistics ? (
            <ActivityIndicator size="large" color="#947EB0" />
          ) : (
            <PurpleButton
              onPress={handlePress}
              text="Get My Statistics"
              loading={isGettingStatistics}
              width="85%"
            />
        )}
      </View>
    </View>

      
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>My Stats</Text>
        <View>
          <FlatList
            data={data}
            renderItem={renderStatItem}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
          />
          </View>
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
userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: 25,
},
chooseDates: {
  paddingHorizontal: 20,
  paddingVertical: 10,
  paddingBottom: 10,
},
row: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginVertical: 10,
},
centeredRow: {
  paddingTop: 20,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginVertical: 10,
},
wide: {
  flex: 1, // Use flex to ensure buttons occupy equal space
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
    width: 80,
    height: 80,
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
statsCard: {
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 0,
    borderRadius: 10,
    backgroundColor: '#f4f4f4',
},
statsTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
},
statItem: {
    marginTop: 10,
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