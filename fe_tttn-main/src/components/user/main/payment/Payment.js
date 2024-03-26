// Home.js

import React, { useEffect, useState } from 'react';
import Footer from '../../Footer/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import { DeleteAllOrderItem, PostCreateOrder } from '../../../../Services/OrderServices';
import { toast } from 'react-toastify';

function Payment() {
  const {storeName,storeAddress,IdStore} = useParams();
  const id666 = localStorage.getItem("id666");
  const address_user = localStorage.getItem("address");
  const phone_user = localStorage.getItem("phone");
  const [address_U, set_address_U] = useState(address_user);
  const [phone_U, set_phone_U] = useState(phone_user);
  const [me_ss, set_me_ss]= useState('');
  const navigate = useNavigate();
//   useEffect(() => {
    
// }, []);
const handleCreateOrder = async () => {
  try {
    const res = await PostCreateOrder(id666,phone_U,address_U,storeAddress,storeName,IdStore);
// console.log('1',id666)
// console.log('2',phone_U)
// console.log('3',address_U)
// console.log('4',storeAddress)
// console.log('5',me_ss)

    if (res && res.data) {
      toast.success('Create success');
      navigate("/orderU");
      handleDeleteUser();
    } else {
      toast.error('Error!');
    }
  } catch (error) {
    toast.error('Error!');
    console.error('Error:', error);
  }
};
const handleDeleteUser = async () => {
  try {
        let res = await DeleteAllOrderItem(id666)
        if (res && res.data) {
          toast.success("delete your cart")
        } else {
          toast.error("fail")
        }
      } catch (error) {
        toast.error("Error!")
        console.error("Error:", error)
      }
    }
  return (
    <>
      {/* action="/" */}
      <div className="body_info1">
        <div className="container_info">
        <div className="text_info">Your Order</div>
          <form className="form_info"  >
            <div className="form-row_info">
              <div className="input-data_info">
                <input className="input_info" type="text"
                 value={storeName} 
                 />
                <div className="underline_info"></div>
                <label  htmlFor="">Store Name </label>
              </div>
              <div className="input-data_info">
                <input className="input_info" type="text" 
                value={storeAddress}
                  // onChange={(e) => set_name(e.target.value)}
                />
                <div className="underline_info"></div>
                <label htmlFor="">Store Address</label>
              </div>
            </div>

            <div className="form-row_info">
              <div className="input-data_info">
                <input className="input_info" required type="text" 
                value={address_U}
                  onChange={(e) => set_address_U(e.target.value)}
                />
                <div className="underline_info"></div>
                <label htmlFor="">Enter Your Address(*)</label>
              </div>
              <div className="input-data_info">
                <input className="input_info" required type="number"
                 value={phone_U}
                  onChange={(e) => set_phone_U(e.target.value)}
                />
                <div className="underline_info"></div>
                <label htmlFor="">Enter Your Phone(*)</label>
              </div>
            </div>
            {/* <div className="form-row_info">
              <div className="input-data_info textarea_info">
                <textarea type="text" rows="8" cols="80" 
                value={me_ss}
                  onChange={(e) => set_me_ss(e.target.value)}
                ></textarea>
                <br />
                <div className="underline_info"></div>
                <label htmlFor="">Write your message</label>
                <br />

              </div>
            </div> */}
          </form>
          <button className='btn btn-success mx-3 add-to-cart-button'
              onClick={() => handleCreateOrder()}
            >
              Confirm Order
            </button>
        </div>
      </div>
    </>
  );
}

export default Payment;
