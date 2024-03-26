import * as React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Image } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Home from './src/components/home/Home';
import ShipperOrder from './src/components/shipperOrder/ShipperOrder';
import Info_detail from './src/detail/info_detail/Info_detail';
import ShippingDone from './src/components/shippingDone/ShippingDone';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/detail/login/Login';
import Register from './src/detail/register/Register';
import ChangePass from './src/components/ChangePass';
const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Tabs">
        <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ChangePass" component={ChangePass} />
        {/* Add more screens here as needed */}
      </Stack.Navigator>
    </NavigationContainer> 
    </>
  );
}

function TabNavigator() {
  return (
    // <Tab.Navigator initialRouteName="Home">
    //   <Tab.Screen name="Home" component={Home} />
    //   <Tab.Screen name="Received" component={ShipperOrder} />
    //   <Tab.Screen name="info" component={Info_detail} />
    // </Tab.Navigator>
    <>
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen 
        name="Home" 
        component={Home} 
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('./src/assets/images/3d-house.png') : require('./src/assets/images/home.png')}
              style={{ width: 20, height: 20 }}
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Ship" 
        component={ShipperOrder} 
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('./src/assets/images/delivery-bike.png') : require('./src/assets/images/motorbike.png')}
              style={{ width: 20, height: 20 }}
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Done" 
        component={ShippingDone} 
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('./src/assets/images/check-mark2.png') : require('./src/assets/images/check-mark.png')}
              style={{ width: 20, height: 20 }}
            />
          ),
        }}
      />
      <Tab.Screen 
        name="info" 
        component={Info_detail} 
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require('./src/assets/images/info.png') : require('./src/assets/images/information.png')}
              style={{ width: 20, height: 20 }}
            />
          ),
        }}
      />
    </Tab.Navigator>
    </>
  );
}
