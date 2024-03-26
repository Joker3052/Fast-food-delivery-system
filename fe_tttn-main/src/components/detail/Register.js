import React, { useState, useEffect } from "react";
// import { PostRegisterUser } from "../Services/UserService";
import { PostRegister, startRegistration } from "../../Services/UserServices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import logoApp from '../../assets/images/foodwall.avif';
import ModalOtpRegister from "./Otp/ModalOtpRegister";
const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [e_mail, set_e_mail] = useState("");
  const [pass_word, set_pass_word] = useState("");
  const [isShowPassWord, setIsShowPassWord] = useState(false);
  const [loadingApi, setLoadingApi] = useState(false);
  const [IsShowModalView, SetIsShowModalView] = useState(false);
  const handleViewStore = () => {
    SetIsShowModalView(true)
}
const handleClose = () => {
  SetIsShowModalView(false);
}
  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);
  const handleRegister = async () => {
    try {
      setLoadingApi(true);
      const res = await startRegistration(e_mail, name,pass_word);

      if (res && res.data) {
        // set_e_mail('');
        // set_pass_word('');
        // setName('');
        toast.success("successful!");
        handleViewStore();
        // navigate("/login");
      } else {
        toast.error(" failed!");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during .");
    }
    setLoadingApi(false);
  }
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && e_mail && pass_word && name) {
      handleRegister();
    }
  };
  const handleLogin = () => {
    // Add your registration logic here
    navigate("/login");
  };
  const handleGoBack = () => {
    navigate("/");
  }
  return (
    <>
      <div className="login-wallpaper">
        <img src={logoApp} alt="Logo" className="logo1" />
        <div className="login-container1 col-12 col-sm-4 ">
          <div className="title">Register</div>
          <div className="text">Email and password</div>
          <div className="input-pass">
            <input
              className="input-login"
              id="text-email"
              type="text"
              placeholder="enter email"
              value={e_mail}
              onKeyPress={handleKeyPress}
              onChange={(event) => set_e_mail(event.target.value)}
            /></div>
          <div className="input-pass">
            <input
              className="input-login"
              id="text-email"
              type="text"
              placeholder="enter name"
              value={name}
              onKeyPress={handleKeyPress}
              onChange={(event) => setName(event.target.value)}
            /></div>
          <div className="input-pass">
            <input
              className="input-login"
              id="text-email"
              type={isShowPassWord === true ? "text" : "password"}
              placeholder="enter password"
              value={pass_word}
              onKeyPress={handleKeyPress}
              onChange={(event) => set_pass_word(event.target.value)}
            />
            <i
              className={
                isShowPassWord === true
                  ? "fa-solid fa-eye"
                  : "fa-solid fa-eye-slash"
              }
              onClick={() => setIsShowPassWord(!isShowPassWord)}
            ></i>
          </div>
          <button
            //   className={e_mail && pass_word ? "active" : ""}
            className={`button-login ${e_mail && pass_word ? "active" : ""}`}
            disabled={e_mail && pass_word ? false : true}
            onClick={() => handleRegister()}
          >
            {loadingApi && <i className="fa-solid fa-sync fa-spin"></i>}Register
          </button>
          <button className="button-login" onClick={handleLogin}>Login</button>
          <div className="go-back">
            <i className="fa-solid fa-backward"></i>
            <span onClick={() => handleGoBack()}>GO BACK HOME</span>
          </div>
        </div>
      </div>
      <ModalOtpRegister
                show={IsShowModalView}
                handleClose={handleClose}
            />
    </>
  );
};
export default Register;
