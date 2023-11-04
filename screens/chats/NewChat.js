// Quiero un search bar para buscar por username (endpoint hecho)
// y abajo que aparezca automáticamente un listado de la gente a la que yo sigo, como un easy access
// el tema es que este segundo endpoint no está, ver ese tema

import React from 'react'
import { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, 
  Keyboard } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../../components/SearchBar';
import searchUserByUsername from '../../handlers/searchUserByUsername';

export default NewChat = () => { 
    const navigation = useNavigation();
    const [usernameSearched, setUsernameSearched] = useState("");
    const [users, setUsers] = useState([
      {
        id: 1,
        name: 'Mark Doe',
        status: 'active',
        avatar: 'https://bootdey.com/img/Content/avatar/avatar7.png',
      },
      {
        id: 2,
        name: 'Clark Man',
        status: 'active',
        avatar: 'https://bootdey.com/img/Content/avatar/avatar6.png',
      },
      {
        id: 3,
        name: 'Jaden Boor',
        status: 'active',
        avatar: 'https://bootdey.com/img/Content/avatar/avatar5.png',
      },
      {
        id: 4,
        name: 'Srick Tree',
        status: 'active',
        avatar: 'https://bootdey.com/img/Content/avatar/avatar4.png',
      },
      // ... other initial users ...
    ]);

    // Para levantar los users que inicialmente se van a mostrar.
    // Me gustaría que fuesen aquellos a los que sigo, pero la Historia de Usuario no dice nada al respecto
    // useEffect(() => {
    //   const fetchData = async () => {
    //     try {
    //       if (route.params && Object.keys(user_param).length !== 0) {
    //         setUser(user_param);
    //       } else {
    //         setUser(loggedInUser);
    //       }
    //       setIsLoading(false);
    //     } catch (error) {
    //       console.error('Error al obtener usuario:', error);
    //       setIsLoading(false);
    //     }
    //   };
    
    //   fetchData();
    // }, []);

  const renderItem = ({ item }) => {
    const handleChatPress = () => {
      navigation.push('SpecificChat');
    };

    return (
      <TouchableOpacity onPress={handleChatPress}>
        <View style={styles.row}>
          <Image source={{ uri: item.avatar }} style={styles.pic} />
          <View>
            <View style={styles.nameContainer}>
              <Text style={styles.nameTxt} numberOfLines={1} ellipsizeMode="tail">
                {item.name}
              </Text>
              <Text style={styles.mblTxt}>Mobile</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleSearchButtonFunction = async () => {
    console.log("Apretaron el botón de búsqueda");
    Keyboard.dismiss();
    user_data = await searchUserByUsername(usernameSearched, 0, 10);
    console.log(user_data)
    // Create a copy of the current users array
    const updatedUsers = [...users];

    // Add the new data from user_data to the copy
    const newUsers = [];

    user_data.forEach((userData) => {
      // Create a new user with the correct format
      const newUser = {
        id: userData.email,
        name: userData.username,
        avatar: userData.avatar,
      };

      // Add the new user to the array
      newUsers.push(newUser);
    });

    // Set the 'users' state with the new array of users
    setUsers(newUsers);
  };
   

  return (
    <View style={{ flex: 1 }}>
      <SearchBar
        searchText={usernameSearched} // Replace with your actual searchText value
        setSearchText={setUsernameSearched} // Replace with your actual setSearchText function
        handleSearchButton={handleSearchButtonFunction} // Replace with your actual handleSearchButton function
      />
      <FlatList
        data={users}
        keyExtractor={item => {
          return item.id.toString(); // Make sure to convert the ID to a string
        }}
        renderItem={renderItem} // Use the renderItem function directly
      />
    </View>
    
  );
};


const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#DCDCDC',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    padding: 10,
  },
  pic: {
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 280,
  },
  nameTxt: {
    marginLeft: 15,
    fontWeight: '600',
    color: '#222',
    fontSize: 18,
    width: 170,
  },
  mblTxt: {
    fontWeight: '200',
    color: '#777',
    fontSize: 13,
  },
  msgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  msgTxt: {
    fontWeight: '400',
    color: '#008B8B',
    fontSize: 12,
    marginLeft: 15,
  }
})