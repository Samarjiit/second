import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { register } from "../actions/userActions";
import Meta from "../components/Meta";

const RegisterScreen = ({ location }) => {
  const [name, setName] = useState("");
  const [phoneNo, setPhoneNo] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const dispatch = useDispatch();
  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("querystringkey");
  const redirect = redirectInUrl ? redirectInUrl : "/";
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!/^[A-Za-z\s]+$/.test(name)) {
      setMessage("Invalid name format. (Should start with a capital letter)");
    } else if (!/^[789]\d{9}$/.test(phoneNo)) {
      setMessage("Invalid phone number.");
    } else if (!/^[A-Za-z0-9._]+@[A-Za-z0-9]+\.[A-Za-z]+$/.test(email)) {
      setMessage("Invalid email.");
    } else if (
      !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{6,}$/.test(
        password
      )
    ) {
      setMessage(
        "Invalid password. (Must contain 1 digit, 1 lowercase, 1 uppercase and 1 special character)"
      );
    } else if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
    } else if (
      name.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      setMessage("All fields are required.");
    } else if (!termsAccepted) {
      setMessage("Please accept the terms and conditions.");
    } else {
      dispatch(register(name, phoneNo, email, password));
    }
  };

  const handleCheckboxChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  return (
    <>
      <Meta title="2ndChance | Register" />
      <FormContainer>
        <br></br>
        <h4>Sign Up</h4>
        {message && <Message variant="light">{message}</Message>}
        {error && <Message variant="light">{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <br></br>
            <Form.Label>
              <h6>Name</h6>
            </Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="phoneNo">
            <br></br>
            <Form.Label>
              <h6>Phone Number</h6>
            </Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter phone number"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="email">
            <br></br>
            <Form.Label>
              <h6>Email Address</h6>
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="password">
            <br></br>
            <Form.Label>
              <h6>Password</h6>
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="confirmPassword">
            <br></br>
            <Form.Label>
              <h6>Confirm Password</h6>
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
            <br></br>
          </Form.Group>
          <Form.Group controlId="termsAndConditions">
            <Form.Check
              type="checkbox"
              label={
                <span>
                  I agree to the terms and conditions of the website and
                  understand the responsibilities and obligations that come with
                  using its services.
                </span>
              }
              checked={termsAccepted}
              onChange={handleCheckboxChange}
            ></Form.Check>
          </Form.Group>

          <Form.Group id="btn" className="buttons">
            <br></br>
            <Button type="submit" variant="light">
              Register
            </Button>
          </Form.Group>
        </Form>
        <br></br>
        <Row className="py-3">
          <Col>
            <h6>
              Have an account?
              {""} &nbsp;
              <Link to={redirect ? `/login?redirect=${redirect}` : "/login "}>
                Log In
              </Link>
            </h6>
          </Col>
        </Row>
      </FormContainer>
    </>
  );
};

export default RegisterScreen;
