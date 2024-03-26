import React, { useEffect, useState } from 'react';
// import './checkout.css';
import { GetOrderItemByID } from '../../../../Services/OrderServices';
import Cart from '../../secondary/cart/Cart';
import { baseURL } from '../../../../Services/axios-customize';
import { DeleteOrderItemByID } from '../../../../Services/OrderServices';
import { toast } from 'react-toastify';
import { AscOrderItemByID } from '../../../../Services/OrderServices';
import { DescOrderItemByID } from '../../../../Services/OrderServices';
import { Link } from 'react-router-dom';
function Checkout() {
  // const [cartItems, setCartItems] = useState([
  //   {
  //     id: 1,
  //     image: 'https://placekitten.com/100/100',
  //     name: 'Product 1',
  //     quantity: 2,
  //     price: 20,
  //     store: 'Store A',
  //   },
  //   {
  //     id: 2,
  //     image: 'https://placekitten.com/100/101',
  //     name: 'Product 2',
  //     quantity: 1,
  //     price: 30,
  //     store: 'Store B',
  //   },
  //   // Thêm các sản phẩm khác nếu cần
  // ]);
  const id666 = localStorage.getItem('id666');
  const [listproduct, setlistproduct] = useState([]);
  const [storeName, setstoreName] = useState([]);
  const [storeAddress, setstoreAddress] = useState([]);
  const [IdStore, setIdStore] = useState([]);
  useEffect(() => {
    GetOrderItem();
    // console.log(id666);
  }, [])
  const GetOrderItem = async () => {
    try {
      let res = await GetOrderItemByID(id666);
      if (res && res.data) {
        setlistproduct(res.data);
        setstoreName(res.data[0].product.user.store);
        setstoreAddress(res.data[0].product.user.address);
        setIdStore(res.data[0].product.user.id)
        console.log('store : ', res.data[0].product.user.id);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleRemoveFromCart = async (item) => {
    console.log("delete ", item._id);

    try {
      const res = await DeleteOrderItemByID(item._id);

      if (res && res.data) {
        // Xóa sản phẩm khỏi danh sách sản phẩm từ server
        const updatedListProduct = listproduct.filter((product) => product._id !== item._id);
        setlistproduct(updatedListProduct);

        toast.success("delete success!");
      } else {
        toast.error("Error1!");
      }
    } catch (error) {
      toast.error("Error2!");
      console.error("Error:", error);
    }
  };
  const handleAsc = async (item) => {

    try {
      const res = await AscOrderItemByID(item._id);

      if (res && res.data) {

        GetOrderItem();
        toast.success("asc success!");
      } else {
        toast.error("Error1!");
      }
    } catch (error) {
      toast.error("Error2!");
      console.error("Error:", error);
    }
  };
  const handleDesc = async (item) => {
    if (item.quantity == 1) {
      handleRemoveFromCart(item);
    }
    else {
      try {
        const res = await DescOrderItemByID(item._id);

        if (res && res.data) {

          // // Xóa sản phẩm khỏi danh sách sản phẩm từ server
          // const updatedListProduct = listproduct.filter((product) => product._id !== item._id);
          // setlistproduct(updatedListProduct);
          GetOrderItem();
          toast.success("desc success!");
        } else {
          toast.error("Error1!");
        }
      } catch (error) {
        toast.error("Error2!");
        console.error("Error:", error);
      }
    }
  };

  //////////////////////////////////////////////////////
  // const removeFromCart = (itemId) => {
  //   const updatedCart = cartItems.filter((item) => item.id !== itemId);
  //   setCartItems(updatedCart);
  // };

  const totalQuantity = listproduct.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = listproduct.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const totalPriceUsd = listproduct.reduce((total, item) => total + item.product.priceUsd * item.quantity, 0);
  return (
    <div className="checkout-container">
      {/* <h2>Checkout</h2> */}
      <h2><Cart /></h2>
      <ul className="cart-items">
        {listproduct.map((item) => (
          <li key={item.id} className="cart-item">
            <img src={`${baseURL}${item.product.image}`} alt={item.name} />
            <div>
              <p>{item.product.name}</p>
              <p>Price: {item.product.price}đ (${item.product.priceUsd})</p>
              <button onClick={() => handleRemoveFromCart(item)}>Remove</button>
            </div>
            <div>
              <button className='btn btn-danger' onClick={() => handleDesc(item)}>
                -
              </button >
              <label style={{ margin: '0 5px 0 5px' }}>{item.quantity}</label>
              <button className='btn btn-success' onClick={() => handleAsc(item)}>
                +
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="order-summary">
        <h3>Order Summary</h3>
        <p dangerouslySetInnerHTML={{ __html: `<strong>Store Name:</strong> ${storeName}` }} />
        <p dangerouslySetInnerHTML={{ __html: `<strong>Store Address:</strong> ${storeAddress}` }} />
        <p>Total Items: {totalQuantity}</p>
        <p>Total Price: {totalPrice}đ (${totalPriceUsd.toFixed(2)})</p>
        {totalQuantity > 0 && (
          <Link to={`/payment/${storeName}/${storeAddress}/${IdStore}`}>
            <button>Place Order</button>
          </Link>
        )}

      </div>
    </div>
  );
}

export default Checkout;
