import axios from './axios-customize'
const apikey = 'tttn';
const FetchAllStore =()=>
{
   return  axios.get(`/${apikey}/user/store`);
}
const FetchAllUser =()=>
{
   return  axios.get(`/${apikey}/user`);
}
const FetchAllShipper =()=>
{
   return  axios.get(`/${apikey}/shipper`);
}
const PostLogin =(email,password)=>
{
   return  axios.post(`/${apikey}/user/login`,{email,password});
}
const startRegistration =(email, name, password )=>
{
   return  axios.post(`/${apikey}/user/startRegistration`,{email, name, password });
}
const completeRegistration =(otp )=>
{
   return  axios.post(`/${apikey}/user/completeRegistration`,{otp });
}
 const AuthAccount  =()=> {
   return axios.get(`/${apikey}/auth`, {
      headers: {
        Authorization: `Bearer YOUR_JWT_TOKEN`,
      },
    });
 };
 const FetchUserByID =(id)=>
{
   return axios.get(`/${apikey}/user/${id}`, { });
}
const PutUser = (id, formData) => {
   return axios.put(`/${apikey}/user/${id}`, formData, {
     headers: {
       'Content-Type': 'multipart/form-data'
     }
   });
};
const PutShipper = (id, formData) => {
   return axios.put(`/${apikey}/shipper/${id}`, formData, {
     headers: {
       'Content-Type': 'multipart/form-data'
     }
   });
};
const PutstoreAllInvalidPr =(id)=>
{
   return axios.put(`/${apikey}/user/storeAllInvalid/${id}`, { });
}
////////////////////
// const FetchAllUser =()=>
// {
//    return  axios.get("/user/all");
// }
const PostRegister =(email,password,username,phone,address)=>
{
   return  axios.post("/user/register",{email,password,username,phone,address});
}


export{FetchAllStore,FetchAllUser,PostLogin,FetchUserByID,PostRegister,AuthAccount,PutUser,PutstoreAllInvalidPr,
   startRegistration,completeRegistration,FetchAllShipper,PutShipper
};