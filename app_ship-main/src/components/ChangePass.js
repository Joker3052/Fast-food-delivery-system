import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FetchUserByID, PutUser } from '../Services/UserServices';

const  ChangePass = () => {
  
  const [password, setpassword] = useState('');
  

  const isFocused = useIsFocused(); // Hook to check if screen is focused
  const [id666, setid666] = useState("");
  useEffect(() => {
    if (isFocused) { // Check if screen is focused
      get_id666();
      console.log('Screen is focused : ', id666);
      getUser();
    }
  }, [isFocused]); // Run effect whenever isFocused changes
  const get_id666 = async () => {
    try {
      const result = await AsyncStorage.getItem('id666');
      if (result !== null) {
        setid666(result);
      } else {
        console.log('Không tìm thấy dữ liệu cho key: id666');
        setid666("");
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu từ AsyncStorage:', error);
    }
  };; // Run effect whenever isFocused changes
 

  const handleEditUser = async () => {
    if (!password) {
      Alert.alert('Enter new password');
    }
    else {
      try {
        const formData = new FormData();
        formData.append('password', password);
        const res = await PutUser(id666, formData);

        if (res && res.data) {
          Alert.alert('Edit success');
          getUser();
        } else {
          Alert.alert('Error!');
        }
      } catch (error) {
        Alert.alert('Error!');
        console.error('Error:', error);
      }
    }
  };
  const getUser = async () => {
    try {
      let res = await FetchUserByID(id666);
      if (res && res.data) {
        //  setpassword(res.data.password)
        // console.log("info store", res.data);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  return (
    <View style={styles.container}>
      
        <>
          <Text style={styles.title}>Change password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="new pass"
              onChangeText={text => setpassword(text)}
              // value={name}
              placeholderTextColor="#C0C0C0"
            />
            
          </View>
        
        <TouchableOpacity style={styles.button} onPress={handleEditUser}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
       </>
    
      
    

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    width: 300,
    height: 40,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: 'black',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default  ChangePass;
