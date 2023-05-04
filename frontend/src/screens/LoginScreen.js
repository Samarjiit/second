import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { login } from "../actions/userActions";
import Meta from "../components/Meta";

const LoginScreen = ({ location }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("querystringkey");
  const redirect = redirectInUrl ? redirectInUrl : "/";
  const navigate = useNavigate();
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);
  const submitHandler = (e) => {
    e.preventDefault();
    if (email.trim() === "" || password.trim() === "") {
      setMessage("All fields are required.");
    } else {
      dispatch(login(email, password));
    }
  };
  return (
    <>
      <Meta title="2nd Chance | Login" />
      <FormContainer>
        <br></br>
        <h4>Log In</h4>
        {message && <Message variant="light">{message}</Message>}
        {error && <Message variant="light">{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
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

          <Form.Group id="btn" className="buttons">
            <br></br>
            <Button type="submit" variant="light">
              Sign In
            </Button>
          </Form.Group>
        </Form>
        <br></br>
        <Row className="py-3">
          <Col>
            <h6>
              New Customer?{""} &nbsp;
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
              >
                Register
              </Link>
            </h6>
          </Col>
        </Row>
      </FormContainer>
    </>
  );
};

export default LoginScreen;
