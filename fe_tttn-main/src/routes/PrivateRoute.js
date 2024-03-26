// import { Routes, Route, Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";

const PrivateRoute = (props) => {
  const navigate = useNavigate();
  const handleGoLogin = () => {
    navigate("/login");
  };
  useEffect (()=>{
    if (user && !user.auth) {
    navigate("/login");
    }
  },[] )
  const { user } = useContext(UserContext);
  if (user && !user.auth) {
    return (
      <Container>
        <Alert variant="danger" className="mt-3">
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>
            you do not have permission to access this page, please login to
            continue
          </p>
        </Alert>
        <div className="text-center">
          <button className="btn btn-success" onClick={() => handleGoLogin()}>
            <p className="px-8 m-0 text-[30px]">Login</p>
          </button>
        </div>
      </Container>
    );
  }
  return <>{props.children}</>;
};
export default PrivateRoute;
