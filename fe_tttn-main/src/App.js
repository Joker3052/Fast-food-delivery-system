import { useLocation } from 'react-router-dom';
import './App.css'
import Header_user from './components/user/header_user/Header_user';
import Header_admin from './components/admin/header_admin/Header_admin';
import { ToastContainer, toast } from 'react-toastify';
import AppRoute from './routes/AppRoute';
import Footer from './components/user/Footer/Footer';
import { UserContext } from './context/UserContext';
import { useContext, useEffect, useState } from 'react';
import { AuthAccount } from './Services/UserServices';
import { FetchUserByID } from './Services/UserServices';
import axios from 'axios';
import { baseURL } from './Services/axios-customize';
import { CountOrderItemByID } from './Services/OrderServices';
import { GetOrderItemByID } from './Services/OrderServices';
function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  const { user, loginContext } = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  const [listuserid, setlistuserid] = useState([]);
  const [listcoutcart, setlistcoutcart] = useState([]);

  useEffect(() => {
    fetchData();
    // getcoutcart();
  }, []);

  const getuserid = async () => {
    try {
      if (localStorage.getItem("id666")) {
        let res = await FetchUserByID(localStorage.getItem('id666'));
        if (res && res.data) {
          setlistuserid(res.data);
          localStorage.setItem("email", res.data.email);
          localStorage.setItem("name", res.data.name);
          localStorage.setItem("isAdmin", res.data.isAdmin);
          localStorage.setItem("isStore", res.data.isStore);
          localStorage.setItem("store", res.data.store);
          localStorage.setItem("address", res.data.address);
          localStorage.setItem("image", baseURL + res.data.image);
          localStorage.setItem("phone",res.data.phone);
        }
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const fetchData = async () => {
    try {
      if (localStorage.getItem("token") ) {
        let token_load = localStorage.getItem("token");
        loginContext(token_load);

        const res = await axios.get(`${baseURL}/tttn/auth`, {
          headers: {
            Authorization: `Bearer ${token_load}`,
          },
        });

        if (res) {
          setUserData(res.data.user);
          localStorage.setItem("id666", res.data.user.userId);
          getuserid();
          // try {
          //   // console.log('test cart num: ',res.data.user.userId)
          //   const res1 = await CountOrderItemByID(res.data.user.userId);
          //   // console.log('countcart0',res1.data);
          //   if (res1 && res1.data) {
          //     setlistcoutcart(res1.data);
          //     localStorage.setItem('countcart', res1.data.orderItemCount);
          //     console.log('countcart',res1.data.orderItemCount);
          //   }
          // } catch (error) {
          //   console.error("Error fetching data: ", error);
          // }
          // try {
          //   const res2 = await GetOrderItemByID(res.data.user.userId);
          //   if (res2 && res2.data) {
          //     const orderIds = res2.data.map(order => order.product.id);
              
          //     // Lưu danh sách các orderId vào localStorage với tên 'productcart'
          //     localStorage.setItem('productcart', JSON.stringify(orderIds));
          
          //     // Lặp qua từng đơn hàng và lấy id
          //     orderIds.forEach(orderId => {
          //       console.log('Order ID:', orderId);
          //       // Các xử lý khác với dữ liệu đơn hàng
          //     });
          //   }
          // } catch (error) {
          //   console.error("Error fetching data: ", error);
          // }
        }
      }
    } catch (error) {
      console.error('Error fetching data36:', error);
    }
  };

  // const getcoutcart = async () => {
  //   try {
  //     let res = await CountOrderItemByID(localStorage.getItem('id666'));
  //     if (res && res.data) {
  //       setlistcoutcart(res.data);
  //       localStorage.setItem('countcart', res.data.orderItemCount.toString());
  //       console.log(res.data.orderItemCount);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data: ", error);
  //   }
  // };

  return (
    <>
      <div className='app-container'>
        {!isLoginPage && !isRegisterPage && localStorage.getItem("isAdmin") === "true" && <Header_admin />}
        {!isLoginPage && !isRegisterPage && (localStorage.getItem("isAdmin") === "false" || localStorage.getItem("isAdmin") == null) && <Header_user />}
        <AppRoute />
      </div>
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
