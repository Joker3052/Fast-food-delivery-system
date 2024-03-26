import { Routes, Route } from "react-router-dom";
import Login from "../components/detail/login";
import Register from "../components/detail/Register";
import User_Info from "../components/detail/user_Info/User_Info";
import Store_Info from "../components/detail/store_Info/Store_Info";
////////////////////////////////////////////////
import ShipperA from "../components/admin/main/shipperA/shipperA";
import ShipperTrueA from "../components/admin/main/shipperA/shipperTrueA";
import ShipperFalseA from "../components/admin/main/shipperA/shipperFalseA";
import StoreA from "../components/admin/main/store/storeA/StoreA";
import UserA from "../components/admin/main/userA/userA";
import UserStoreA from "../components/admin/main/userA/userStoreA";
import UserWaitingA from "../components/admin/main/userA/userWaitingA";
import Product_A from "../components/admin/main/product/product_A/Product_A";
import Categories_A from "../components/admin/main/product/categories_A/Categories_A";
import Product_inValid_A from "../components/admin/main/product/product_inValid_A/Product_inValid_A";
import Product_Valid_A from "../components/admin/main/product/product_Valid_A/Product_Valid_A";
import Store_A_detail from "../components/admin/main/store/store_A_detail/Store_A_detail";
import OrderA from "../components/admin/main/orderA/orderA";
///////////////////////////////////////////////////////////
import About from "../components/user/main/about/About";
import Home from "../components/user/main/home/Home";
import Dashboard from "../components/admin/main/dashboard/Dashboard";
import StoreU from "../components/user/main/store/storeU/StoreU";
import MyStore from "../components/user/main/store/myStore/MyStore";
import OrderU from "../components/user/main/orderU/OrderU";
import CusOrder from "../components/user/main/orderU/CusOrder";
import Checkout from "../components/user/main/checkout/Checkout";
import Payment from "../components/user/main/payment/Payment";
import TopRated from "../components/user/main/product/topRated/TopRated";
import Product_New from "../components/user/main/product/product_New/Product_New";
import AllProduct_U from "../components/user/main/product/allProduct_U/AllProduct_U";
import Store_U_detail from "../components/user/main/store/store_U_detail/Store_U_detail";
import Product_of_category_tempU from "../components/user/main/product/product_of_category/product_of_category_tempU/Product_of_category_tempU";
import Product_of_category_StoreU from "../components/user/main/product/product_of_category/product_of_category_StoreU/Product_of_category_StoreU";
import Product_of_category_EditU from "../components/user/main/product/product_of_category/product_of_category_EditU/Product_of_category_EditU";
import SearchU from "../components/user/main/search/searchU/SearchU";
import PrivateRoute from "./PrivateRoute";
/////////////////////////////////////////////
// import Carousel from "../components/user/carousel/Carousel";
// import Footer from "../components/user/Footer/Footer";
const AppRoute = () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user_info" element={<User_Info />} />
        <Route path="/store_info" element={<Store_Info />} />
        {/* ////////////////////////////// */}
        {/* <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard/>} /> */}
        <Route
          path="/"
          element={isAdmin ? <Dashboard /> : <Home />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/storeU" element={<StoreU />} />
        <Route path="/myStore" element={<MyStore />} />
        <Route path="/orderU" element={<OrderU />} />
        <Route path="/cusOrder" element={<CusOrder />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment/:storeName/:storeAddress/:IdStore" element={<Payment />} />
        <Route path="/topRated" element={<TopRated />} />
        <Route path="/product_New" element={<Product_New />} />
        <Route path="/allProduct" element={
          <PrivateRoute>
            <AllProduct_U />
          </PrivateRoute>
        } />
        <Route path="/store_U_detail/:getIdStore" element={<Store_U_detail />} />
        <Route path="/product_of_categoryU/:getIdProductofCategory" element={<Product_of_category_tempU />} />
        <Route path="/product_of_category_StoreU/:getIduser/:getIdProductofCategory" element={<Product_of_category_StoreU />} />
        <Route path="/product_of_category_EditU/:getIduser/:getIdProductofCategory" element={<Product_of_category_EditU />} />
        <Route path="/searchU/:getTheSearch" element={<SearchU />} />
        <Route path="/searchU" element={<SearchU />} />
        {/* //////////////////////////////////////// */}
        <Route path="/product_A" element={<Product_A />} />
        <Route path="/product_inValid_A" element={<Product_inValid_A />} />
        <Route path="/product_Valid_A" element={<Product_Valid_A />} />
        <Route path="/categories_A" element={<Categories_A />} />
        <Route path="/storeA" element={<StoreA />} />
        <Route path="/userA" element={<UserA />} />
        <Route path="/userStoreA" element={<UserStoreA />} />
        <Route path="/userWaitingA" element={<UserWaitingA />} />
        <Route path="/store_A_detail/:getIdStore" element={<Store_A_detail />} />
        <Route path="/shipperA" element={<ShipperA />} />
        <Route path="/shipperTrueA" element={<ShipperTrueA />} />
        <Route path="/shipperFalseA" element={<ShipperFalseA />} />
        <Route path="/orderA" element={<OrderA />} />
      </Routes>
    </>
  );
};
export default AppRoute;
