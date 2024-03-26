import React, { useEffect, useState } from 'react';
import { DeleteAllOrderItem, GetOrderByID, PostPaypal, PutOrderByID } from '../../../../Services/OrderServices';
import { baseURL } from '../../../../Services/axios-customize';
import { toast } from 'react-toastify';
import starImage from '../../../../assets/images/star.png';
import { AddRated } from '../../../../Services/OrderServices';
// import './OrderU.css';

function OrderU() {
  const [listorder, setlistorder] = useState([]);
  const id666 = localStorage.getItem('id666');
  const [ratings, set_rartings] = useState('');
  const [mess, set_mess] = useState('');
  useEffect(() => {
    getOrders();
  }, []);
  const handleEditRating = async (item) => {
    try {
      if (ratings !== '1' && ratings !== '2' && ratings !== '3' && ratings !== '4' && ratings !== '5') {
        toast.warning('Please kindly rate the order! ');
        return;
      }
      const res = await PutOrderByID(item.id, ratings, true, mess);

      if (res && res.data) {
        getOrders();
        toast.success('Edit success');
        handleAddRated(item,ratings);
      } else {
        toast.error('Error!');
      }
    } catch (error) {
      toast.error('Error!');
      console.error('Error:', error);
    }
  };
  const handleAddRated = async (item,item2) => {
    try {
      const res = await AddRated(item.id,item2);

      if (res && res.data) {
        getOrders();
        toast.success('Edit success');
      } else {
        toast.error('Error!');
      }
    } catch (error) {
      toast.error('Error!');
      console.error('Error:', error);
    }
  };
  const getOrders = async () => {
    try {
      let res = await GetOrderByID(id666);
      if (res && res.data) {
        setlistorder(res.data);
        console.log("order : ", res.data);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  const handlePayPal = async (item) => {
    try {
      let res = await PostPaypal(item.id);
      if (res && res.data) {
        console.log("paypal : ", res.data.links[1].href);
        let url = `${res.data.links[1].href}`;

    // Mở trang mới trong một tab mới
    window.open(url, '_blank');
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
    
  };
  return (
    <div className="order-history-container">
      <h2>Order History</h2>
      <ul>
        {listorder.map((order) => {
          // Tính tổng giá tiền cho mỗi đơn hàng
          const totalPrice = order.orderLists.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
          }, 0);

          // Chuyển đổi tổng giá tiền sang đô la Mỹ nếu cần
          const totalPriceUsd = order.orderLists.reduce((total, item) => {
            return total + (item.product.priceUsd * item.quantity);
          }, 0);
          return (
            <div key={order.id}>
              <div>
                <p>Date: {new Date(order.dateOrdered).toLocaleString()}</p>
                <p>Store: {order.store} - {order.shippingAddress2}</p>
                <p>Customer: {order.user.name} - {order.phone} - {order.shippingAddress1}</p>
                {order.shipper!==null&&(
                    <p>shipper: {order.shipper.name} - {order.shipper.phone} - {order.shipper.address}</p>
                )}
              </div>
              {order.status === "Pending" && (<p style={{ color: "red" }}>{order.status}</p>)}
              {order.status === "Shipping" && (<p style={{ color: "#999900" }}>{order.status}</p>)}
              {order.status === "Done" && (<p style={{ color: "green" }}>{order.status}</p>)}
              {order.payed&&(<p style={{color: "green"}}>The order has been paid 💵</p>)}
              {order.isPay&&(<p style={{color: "blue"}}>Payment has been switched to PayPal</p>)}
              {!order.isPay&&(
              <button className='btn btn-primary my-3 '
                        onClick={() => handlePayPal(order)}
                    >
                       Paid by PayPal
                    </button>
              )}
              <ul>
                {order.orderLists.map((item) => (
                  <li key={item.id} className="order-item-detail">
                    <img src={`${baseURL}${item.product.image}`} alt={item.product.name} />
                    <p>Name: {item.product.name}</p>
                    <p>Price: {item.product.price} đ (${item.product.priceUsd})</p>
                    <p>Quantity: {item.quantity}</p>
                  </li>
                ))}
              </ul>
              {order.status === "Done" && (
                <>
                  {order.isRate && (
                    <p>
                      {typeof order.ratings === 'number'
                        ? order.ratings % 1 !== 0 // Kiểm tra xem có phải là số nguyên không
                          ? order.ratings.toFixed(2) // Làm tròn đến 2 chữ số thập phân nếu là số thập phân
                          : order.ratings // Giữ nguyên nếu là số nguyên
                        : order.ratings}{' '}
                      <img src={starImage} alt="Star" style={{ width: '20px', height: '20px' }} />{' '}
                      <p>{order.mess}</p>
                    </p>
                  )}

                  {!order.isRate && (
                    <>
                      <div className='rateOrder'>
                        <label>Rate</label>
                        <select
                          type="number"
                          value={ratings}
                          onChange={(event) => set_rartings(event.target.value)}
                        >
                          <option value="">Rate</option>
                          <option value="5">5</option>
                          <option value="4">4</option>
                          <option value="3">3</option>
                          <option value="2">2</option>
                          <option value="1">1</option>
                        </select>
                        <img src={starImage} alt="Star" style={{ width: '20px', height: '20px', marginTop: '54px' }} />{' '}
                        <textarea
                          type="text"
                          rows="4"
                          cols="40"
                          value={mess}
                          onChange={(e) => set_mess(e.target.value)}
                        ></textarea>
                      </div>
                      <button
                        className='btn btn-success'
                        style={{ marginLeft: '70%' }}
                        onClick={() => handleEditRating(order)}
                      >
                        <i className="fa-solid fa-check"></i>
                      </button>
                    </>
                  )}
                </>
              )}



              <p className="total">Total: {totalPrice} đ (${totalPriceUsd})</p>
            </div>
          );
        })}
      </ul>
    </div>

  );
}

export default OrderU;
