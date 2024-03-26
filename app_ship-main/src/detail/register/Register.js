import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { PostRegister } from '../../Services/UserServices';

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert('Enter the email and password, name');
      return;
    }

    try {
      const res = await PostRegister(email, password,name);

      if (res && res.data ) {
       
        // console.log('Email:', res.data.email);
        // console.log('name', res.data.name);
        // // console.log('id', res.data.id);
        Alert.alert('Register successful!');
        navigation.goBack();
      } else {
        Alert.alert('Register failed!');
      }
    } catch (error) {
      Alert.alert('An error occurred during Register');
    }
  
  };
  const handleLogin = () => {
    // Add your register logic here
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={text => setEmail(text)}
          value={email}
          placeholderTextColor="#C0C0C0"
        />
        <TextInput
          style={styles.input}
          placeholder="Name"
          onChangeText={text => setName(text)}
          value={name}
          placeholderTextColor="#C0C0C0"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            onChangeText={text => setPassword(text)}
            value={password}
            secureTextEntry={!showPassword}
            placeholderTextColor="#C0C0C0"
          />
          <TouchableOpacity
            style={styles.showPasswordButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.showPasswordText}>
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
     < TouchableOpacity onPress={handleLogin}>
        <Text style={styles.registerText}>go back to login</Text>
      </TouchableOpacity>
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
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#000000',
  },
  showPasswordButton: {
    position: 'absolute',
    right: 15,
  },
  showPasswordText: {
    color: '#007bff',
  },
  registerText: {
    marginTop: 10,
    color: '#007bff',
    fontSize: 16,
  },
});

export default Register;
