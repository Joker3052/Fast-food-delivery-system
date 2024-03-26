import axios from './axios-customize'
const apikey = 'tttn';
const GetALLOrder =()=>
{
   return axios.get(`/${apikey}/order`, { });
}
const PutRecivedOrder =(id,shipper,status)=>
{
   return axios.put(`/${apikey}/order/${id}`, {shipper,status });
}
const PutDoneOrder =(id,shipper,status,payed)=>
{
   return axios.put(`/${apikey}/order/${id}`, {shipper,status,payed });
}

///////////////////////////////////////
const PutOrderByID =(id,ratings,isRate,mess)=>
{
   return axios.put(`/${apikey}/order/${id}`, {ratings,isRate,mess });
}

///////////////////////////////////////////////////////////
const PostCreateOrder =(user,phone,shippingAddress1,shippingAddress2,store)=>
{
   return  axios.post(`/${apikey}/order`,{user,phone,shippingAddress1,shippingAddress2,store});
}
const GetOrderByID =(id)=>
{
   return axios.get(`/${apikey}/order?shippers=${id}`, { });
}


////////////////////////////////////////////


export{PostCreateOrder,GetOrderByID,GetALLOrder,PutOrderByID,PutRecivedOrder,PutDoneOrder};