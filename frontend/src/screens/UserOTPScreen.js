import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
// import { verifyOTP } from "../actions/userActions";
import axios from "axios";
//import login from "./LoginScreen";

const OTPScreen = ({ location }) => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState(null);
  //
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("querystringkey");
  const redirect = redirectInUrl ? redirectInUrl : "/login";
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = (e) => {
    const id = JSON.parse(localStorage.getItem("userId"));

    e.preventDefault();
    if (otp.trim() === "") {
      setMessage("OTP is required");
    } else {
      axios
        .post("/api/users/verifyOTP", {
          userId: id,
          otp: otp,
        })
        .then((response) => {
          localStorage.setItem("userDetails", JSON.stringify(response.data));
          navigate("/login");
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  return (
    <>
      <Link to="/UserOTPScreen"></Link>
      <FormContainer>
        <br></br>
        <h4>Sign In</h4>
        {message && <Message variant="light">{message}</Message>}
        {error && <Message variant="light">{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="otp">
            <br></br>
            <Form.Label>
              <h6>Verify OTP</h6>
            </Form.Label>
            <Form.Control
              type="otp"
              placeholder="Enter otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group id="btn" className="buttons">
            <br></br>
            <Button type="submit" variant="light">
              Verify
            </Button>
          </Form.Group>
        </Form>
        <br></br>
      </FormContainer>
    </>
  );
};

export default OTPScreen;
