import axios from './axios-customize'
const apikey = 'tttn';

const PostLogin =(email,password)=>
{
   return  axios.post(`/${apikey}/shipper/login`,{email,password});
}
 const FetchUserByID =(id)=>
{
   return axios.get(`/${apikey}/shipper/${id}`, { });
}
const PutUser = (id, formData) => {
   return axios.put(`/${apikey}/shipper/${id}`, formData, {
     headers: {
       'Content-Type': 'multipart/form-data'
     }
   });
};

////////////////////
// const FetchAllUser =()=>
// {
//    return  axios.get("/user/all");
// }
const PostRegister =(email,password,name)=>
{
   return  axios.post(`/${apikey}/shipper/register`,{email,password,name});
}


export{PostLogin,FetchUserByID,PostRegister,PutUser};