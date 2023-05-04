import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Form, Button, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import { USER_UPDATE_PROFILE_RESET } from "../constants/userConstants";
import { listMyOrders } from "../actions/orderActions";
import { LinkContainer } from "react-router-bootstrap";
import Meta from "../components/Meta";
const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [phoneNo, setPhoneNo] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;
  const orderListMy = useSelector((state) => state.orderListMy);
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (!user || !user.name || success) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch(getUserDetails("profile"));
        dispatch(listMyOrders());
      } else {
        setName(user.name);
        setEmail(user.email);
        setPhoneNo(user.phoneNo);
      }
    }
  }, [dispatch, navigate, userInfo, user, success]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
    } else {
      dispatch(
        updateUserProfile({ id: user._id, name, email, phoneNo, password })
      );
      console.log("submitted");
    }
  };
  return (
    <>
      <Meta title="2nd Chance | Profile" />
      <Row>
        <Col md={3}>
          <h4>User Profile</h4>
          {message && <Message variant="light">{message}</Message>}
          {error && <Message variant="light">{error}</Message>}
          {success && <Message variant="light">Profile Updated.</Message>}
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
                <h6>New Password</h6>
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="confirmPassword">
              <br></br>
              <Form.Label>
                <h6>Confirm New Password</h6>
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group id="btn" className="buttons">
              <br></br>
              <Button type="submit" variant="light">
                Update
              </Button>
            </Form.Group>
          </Form>
        </Col>
        <Col md={9}>
          <h4>My Orders</h4>
          {loadingOrders ? (
            <Loader />
          ) : errorOrders ? (
            <Message variant="light">{errorOrders}</Message>
          ) : (
            <Table bordered hover responsive className="table-sm" id="order">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.substring(21, 24)}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>{order.totalPrice}</td>
                    <td>
                      {order.isPaid ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <i
                          className="fas fa-times"
                          style={{ color: "red" }}
                        ></i>
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        order.deliveredAt.substring(0, 10)
                      ) : (
                        <i
                          className="fas fa-times"
                          style={{ color: "red" }}
                        ></i>
                      )}
                    </td>
                    <td>
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button className="btn-sm" variant="light">
                          Details
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </>
  );
};

export default ProfileScreen;
