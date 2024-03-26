import axios from './axios-customize'
const apikey = 'tttn';
const ShowProduct =()=>
{
   return  axios.get(`/${apikey}/product`);
}
const ShowProductAdmin =()=>
{
   return  axios.get(`/${apikey}/product/store`);
}
const ShowProductInValid =()=>
{
   return  axios.get(`/${apikey}/product/inValid`);
}
const ShowProductAdminOfStoreByID =(id)=>
{
   return axios.get(`/${apikey}/product/store?users=${id}`, { });
}
const ShowTopRated =()=>
{
   return  axios.get(`/${apikey}/product/topRated`);
}
const Productlimit10 =()=>
{
   return  axios.get(`/${apikey}/product/limit10`);
}
const ShowNew =()=>
{
   return  axios.get(`/${apikey}/product/new`);
}
const GetProductOfStoreByID =(id)=>
{
   return axios.get(`/${apikey}/product?users=${id}`, { });
}
const GetProductOfMyStoreByID =(id)=>
{
   return axios.get(`/${apikey}/product/store?users=${id}`, { });
}
const GetProductOfCategory =(id)=>
{
   return axios.get(`/${apikey}/product?categories=${id}`, { });
}
const GetPrCategoryOfstore =(id1,id2)=>
{
   return axios.get(`/${apikey}/product?users=${id1}&categories=${id2}`, { });
}
const GetPrCategoryOfMystore =(id1,id2)=>
{
   return axios.get(`/${apikey}/product/store?users=${id1}&categories=${id2}`, { });
}
const SearchPrAll =(id)=>
{
   return axios.get(`/${apikey}/product?search=${id}`, { });
}
const PostCreateProduct = (formData) => {
   return axios.post(`/${apikey}/product`, formData, {
     headers: {
       'Content-Type': 'multipart/form-data'
     }
   });
 };
 const PutProduct = (id, formData) => {
   return axios.put(`/${apikey}/product/${id}`, formData, {
     headers: {
       'Content-Type': 'multipart/form-data'
     }
   });
};
 const DelProduct =(id)=>
{
   return axios.delete(`/${apikey}/product/${id}`, { });
}
/////////////////

export{ShowProduct,Productlimit10,ShowTopRated,ShowNew,GetProductOfStoreByID,GetProductOfCategory,
   SearchPrAll,PostCreateProduct,DelProduct,PutProduct,GetPrCategoryOfstore,GetProductOfMyStoreByID,
   GetPrCategoryOfMystore,ShowProductAdmin,ShowProductInValid,ShowProductAdminOfStoreByID};