// Home.js

import React, { useEffect, useState } from 'react';
import { CountOrderItemByID } from '../../../../Services/OrderServices';
function Cart() {
    const [listcoutcart, setlistcoutcart] = useState([]);
    useEffect(() => {
        getcoutcart();
        // if (localStorage.getItem('id666')) {
        //     // Đặt một khoảng thời gian để gọi lại getCustomers sau mỗi 5 phút (300000ms)
        //     const intervalId = setInterval(getcoutcart, 300);
        
        //     // Trong useEffect, chúng ta cần trả về một hàm để xử lý khi component unmount
        //     return () => clearInterval(intervalId);
        //   }
        //   else{
        //     console.log("fail cart")
        //   }
    }, []);
    // useEffect(() => {
    //     const fetchData = async () => {
    //       try {
    //         let res = await CountOrderItemByID(localStorage.getItem('id666'));
    //         if (res && res.data) {
    //           // Kiểm tra xem có sự thay đổi không trước khi cập nhật state
    //           if (JSON.stringify(res.data) !== JSON.stringify(listcoutcart)) {
    //             setlistcoutcart(res.data);
    //           }
    //         }
    //       } catch (error) {
    //         console.error("Error fetching data: ", error);
    //       }
    //     };
      
    //     fetchData(); // Gọi lần đầu tiên
      
    //     // if (localStorage.getItem('id666')) {
    //     //   // Đặt một khoảng thời gian để gọi lại getCustomers sau mỗi 5 phút (300000ms)
    //     //   const intervalId = setInterval(fetchData, 300);
      
    //     //   // Trong useEffect, chúng ta cần trả về một hàm để xử lý khi component unmount
    //     //   return () => clearInterval(intervalId);
    //     // } else {
    //     //   console.log("fail cart");
    //     // }
    //   }, [listcoutcart]); // Đặt listcoutcart làm dependency

    const getcoutcart = async () => {
        try {
            let res = await CountOrderItemByID(localStorage.getItem('id666'));
            if (res && res.data) {
                setlistcoutcart(res.data);
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };
    return (
        <>
            <div className="fa-cart-shopping-container">
                <i className="fa-solid fa-cart-shopping cart-logo" data-count={listcoutcart.orderItemCount}></i>
            </div>
        </>
    );
}

export default Cart;
