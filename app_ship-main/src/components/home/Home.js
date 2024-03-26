import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, RefreshControl, Button, Alert } from 'react-native';
import { GetALLOrder, PutRecivedOrder } from '../../Services/OrderServices';
import { baseURL } from '../../Services/axios-customize';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FetchUserByID } from '../../Services/UserServices';
// import AsyncStorage from '@react-native-async-storage/async-storage';
const Home = () => {
  const [id666, setid666] = useState("");
  const [listorder, setlistorder] = useState([]);
  const [userinfo, setuserinfo] = useState([]);
  const [isFeatured, setisFeatured] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // Hook to check if screen is focused
  // useEffect(() => {
    
  //   if (isFocused) { // Check if screen is focused
  //     get_id666();
  //     console.log('Screen is focused : ', id666);
  //     getUser();
  //     getOrders();
  //     onRefresh();
  //   }
  // }, [isFocused]); // Run effect whenever isFocused changes
  useEffect(() => {
    const fetchData = async () => {
      if (isFocused) { // Check if screen is focused
        await get_id666();
        console.log('Screen is focused : ', id666);
        await getUser();
        await getOrders();
        // await onRefresh();
      }
    };
  
    fetchData();
    
  }, [isFocused]); 
  
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
 
  const getOrders = async () => {
    try {
      const res = await GetALLOrder();
      setlistorder(res.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setlistorder([]);
    }
  };

  
  const handleImportOrders = async (item) => {
    try {
      let res = await FetchUserByID(id666);
      if (res && res.data) {
      
        if(res.data.isFeatured){
          try {
            const res = await PutRecivedOrder(item.id,id666,"Shipping");
      
            if (res && res.data) {
              getOrders();
              Alert.alert('You have received this order delivery!');
            } else {
              Alert.alert('Error!');
            }
          } catch (error) {
            Alert.alert('Error!');
            console.error('Error:', error);
          }
          
        }
        else{
          Alert.alert('false');
        }
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
   
  };
  const getUser = async () => {
    try {
      let res = await FetchUserByID(id666);
      if (res && res.data) {
        setuserinfo(res.data);
        setisFeatured(res.data.isFeatured);
        console.log("info user", res.data.isFeatured);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await getOrders();
    await getUser();
    setRefreshing(false);
  };
  return (
    <View style={styles.container}>
    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: 'black' }}>Order History</Text>
   
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
         {id666&&isFeatured ? (
          <>
        {listorder.length > 0 ? (
          listorder.map((order) => {
            if (order.status === "Pending") {
              const totalPrice = order.orderLists.reduce((total, item) => {
                return total + (item.product.price * item.quantity);
              }, 0);

              const totalPriceUsd = order.orderLists.reduce((total, item) => {
                return total + (item.product.priceUsd * item.quantity);
              }, 0);

              return (
                <View key={order.id} style={styles.orderContainer}>
                  <View style={styles.orderInfo}>
                    <Text style={styles.text}>Date: {new Date(order.dateOrdered).toLocaleString()}</Text>
                    <Text style={styles.text}>Store: {order.store} - {order.shippingAddress2}</Text>
                    <Text style={styles.text}>Customer: {order.user.name} - {order.phone} - {order.shippingAddress1}</Text>
                  </View>
                  <Text style={[styles.status, { color: order.status === 'Pending' ? 'red' : order.status === 'Shipping' ? '#999900' : 'green' }]}>{order.status}</Text>
                  {order.orderLists.map((item) => (
                    <View key={item.id} style={styles.orderItem}>
                      <Image source={{ uri: `${baseURL}${item.product.image}` }} style={styles.image} />
                      <View style={styles.itemInfo}>
                        <Text style={styles.text}>Name: {item.product.name}</Text>
                        <Text style={styles.text}>Price: {item.product.price} đ (${item.product.priceUsd})</Text>
                        <Text style={styles.text}>Quantity: {item.quantity}</Text>
                      </View>
                    </View>
                  ))}
                  <Text style={styles.total}>Total: {totalPrice} đ (${totalPriceUsd})</Text>
                  <Button title="Receive delivery" onPress={() => handleImportOrders(order)} />
                  <Text style={styles.total}>___________________________________</Text>
                </View>
              );
            }
          })
        ) : (
          <Text style={styles.noDataText}>No data available</Text>
        )}
        </>
        ) : (
          <Text style={styles.noDataText}>You have not been granted delivery authorization</Text>
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
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  scrollView: {
    flexGrow: 1,
  },
  orderContainer: {
    marginBottom: 20,
  },
  orderInfo: {
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    marginBottom: 10,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  text: {
    color: 'black',
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'black',
  },
  noDataText: {
    color: 'black',
  },
});

export default Home;
