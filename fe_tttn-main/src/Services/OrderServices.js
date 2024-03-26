import axios from './axios-customize'
const apikey = 'tttn';
const CountOrderItemByID =(id)=>
{
   return axios.get(`/${apikey}/orderItem/get/count?users=${id}`, { });
}
const CountOrderEachItemByID =(id)=>
{
   return axios.get(`/${apikey}/orderItem/get/count?products=${id}`, { });
}
const GetOrderItemByID =(id)=>
{
   return axios.get(`/${apikey}/orderItem?users=${id}`, { });
}
const AddOrderItem =(user,product)=>
{
   return axios.post(`/${apikey}/orderItem`,{user,product});
}
const DeleteOrderItemByID =(id)=>
{
   return axios.delete(`/${apikey}/orderItem/${id}`, { });
}
const DeleteAllOrderItem =(id)=>
{
   return axios.delete(`/${apikey}/orderItem/delAll/${id}`, { });
}
const DescOrderItemByID =(id)=>
{
   return axios.put(`/${apikey}/orderItem/desc/${id}`, { });
}
const AscOrderItemByID =(id)=>
{
   return axios.put(`/${apikey}/orderItem/asc/${id}`, { });
}
///////////////////////////////////////////////////////////
const PostCreateOrder =(user,phone,shippingAddress1,shippingAddress2,store,IdStore)=>
{
   return  axios.post(`/${apikey}/order`,{user,phone,shippingAddress1,shippingAddress2,store,IdStore});
}
const GetOrderByID =(id)=>
{
   return axios.get(`/${apikey}/order?users=${id}`, { });
}
const GetOrderByStoreId =(id)=>
{
   return axios.get(`/${apikey}/order?IdStore=${id}`, { });
}
const GetALLOrder =()=>
{
   return axios.get(`/${apikey}/order`, { });
}
const DeleteOrderByID =(id)=>
{
   return axios.delete(`/${apikey}/order/${id}`, { });
}
const PutOrderByID =(id,ratings,isRate,mess)=>
{
   return axios.put(`/${apikey}/order/${id}`, {ratings,isRate,mess });
}
////////////////////////////////////////////
const AddRated =(id,ratings)=>
{
   return axios.put(`/${apikey}/order/update-ratings/${id}`, {ratings});
}
const PostPaypal =(id)=>
{
   return axios.get(`/${apikey}/paypal/${id}`, { });
}
export{CountOrderItemByID,AddOrderItem,GetOrderItemByID,CountOrderEachItemByID,DeleteOrderItemByID,DeleteAllOrderItem,DescOrderItemByID
   ,AscOrderItemByID,
   PostCreateOrder,GetOrderByID,GetALLOrder,DeleteOrderByID,PutOrderByID,AddRated,PostPaypal,GetOrderByStoreId};