import React, { useEffect, useState } from 'react';
import { GetALLOrder, GetOrderByID } from '../../../../Services/OrderServices';
import { baseURL } from '../../../../Services/axios-customize';
import ModalDelete from './ModalDelete';
import starImage from '../../../../assets/images/star.png';
function OrderA() {
  const [listorder, setlistorder] = useState([]);
  const [IsShowModalDelete, SetIsShowModalDelete] = useState(false);
  const [dataStoreDelete, setDataStoreDelete] = useState({});
  
  useEffect(() => {
    getOrders();
  }, []);
  const handleDeleteOrder = (Store1) => {
    // console.log(Store1)
    setDataStoreDelete(Store1)
    SetIsShowModalDelete(true)
    // getOrders();
  }
  const handleClose = () => {

    SetIsShowModalDelete(false);
    getOrders();
  }
  const getOrders = async () => {
    try {
      let res = await GetALLOrder();
      if (res && res.data) {
        setlistorder(res.data);
        console.log("order : ", res.data);
      }
    } catch (error) {
      setlistorder([]);
      console.error("Error fetching data: ", error);
    }
  };

  return (
    <>
      <div className="order-history-container">
        <h2>ALL Order History</h2>
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
                {order.status==="Pending"&&(<p style={{color: "red"}}>{order.status}</p>)}
                {order.status==="Shipping"&&( <p style={{ color: "#999900" }}>{order.status}</p>)}
                {order.status==="Done"&&(<p style={{color: "green"}}>{order.status}</p>)}
                {order.payed&&(<p style={{color: "green"}}>The order has been paid 💵</p>)}
                {order.isPay&&(<p style={{color: "blue"}}>Payment has been switched to PayPal</p>)}
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
                {order.status==="Done"&&(
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
                  <button className='btn btn-danger mx-3'
                  onClick={() => handleDeleteOrder(order)}
                ><i className="fa-solid fa-trash"></i>
                </button>
                </>
                )}
                
                <p className="total">Total: {totalPrice} đ (${totalPriceUsd})</p>
              </div>
            );
          })}
        </ul>
      </div>
      <ModalDelete
        show={IsShowModalDelete}
        dataStoreDelete={dataStoreDelete}
        handleClose={handleClose}
      />
    </>
  );
}

export default OrderA;
