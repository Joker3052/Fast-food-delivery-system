import axios from './axios-customize'
const apikey = 'tttn';
const ShowCategory =()=>
{
   return  axios.get(`/${apikey}/category`);
}
const Categorylimit10 =()=>
{
   return  axios.get(`/${apikey}/product/limit10`);
}
const GetCategoryByID =(id)=>
{
   return axios.get(`/${apikey}/category/${id}`, { });
}
/////////////////

export{ShowCategory,Categorylimit10,GetCategoryByID};