import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, RefreshControl, ScrollView } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FetchUserByID, PutUser } from '../../Services/UserServices';

const Info_detail = () => {
  const [userinfo, setuserinfo] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const navigation = useNavigation();
  const [isFeatured, setisFeatured] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused(); // Hook to check if screen is focused
  const [id666, setid666] = useState("");
  useEffect(() => {
    if (isFocused) { // Check if screen is focused
      // onRefresh();
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
  };
  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('Toàn bộ dữ liệu đã được xóa.');
    } catch (error) {
      console.error('Lỗi khi xóa dữ liệu:', error);
    }
  }
  const handleLogout = () => {
    clearAsyncStorage();
    navigation.navigate('Login'); // Navigate to the login screen
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePass')
  };
  const handleEditUser = async () => {
    if (!name || !phone) {
      Alert.alert('Enter name and phone');
    }
    else {
      try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('address', address);
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
        setuserinfo(res.data);
        setName(res.data.name)
        setPhone(res.data.phone)
        setAddress(res.data.address)
        setisFeatured(res.data.isFeatured)
        console.log("info store", res.data);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await getUser();
    setRefreshing(false);
  };
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {id666 && (
          <>
            <Text style={styles.title}>Shipper Information</Text>
            {!isFeatured && (
              <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10, color: 'red' }}>You have not been granted delivery authorization</Text>
            )}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={userinfo.email}
                readOnly
                placeholderTextColor="#C0C0C0"
              />
              <TextInput
                style={styles.input}
                placeholder="Name"
                onChangeText={text => setName(text)}
                value={name}
                placeholderTextColor="#C0C0C0"
              />
              <TextInput
                style={styles.input}
                placeholder="Address"
                onChangeText={text => setAddress(text)}
                value={address}
                placeholderTextColor="#C0C0C0"
              />
              <TextInput
                style={styles.input}
                placeholder="Phone"
                onChangeText={text => setPhone(text)}
                value={phone}
                placeholderTextColor="#C0C0C0"
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                <Text style={styles.buttonText}>Change Password</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        {id666 ? (
          <>
            <TouchableOpacity style={styles.button} onPress={handleEditUser}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          )}
      </ScrollView>
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
  scrollView: {
    flexGrow: 1,
  },
});

export default Info_detail;
