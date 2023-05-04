import React, { useEffect } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/CheckoutSteps";
import {
  getOrderDetails,
  payOrder,
  payCODOrder,
  deliverOrder,
} from "../actions/orderActions";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/orderConstants";
import Meta from "../components/Meta";
const OrderScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const orderId = id;
  const [{ isPending, isResolved, isRejected }] = usePayPalScriptReducer();
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }

    if (!order || successPay || order._id !== orderId || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    }
  }, [order, orderId, dispatch, successPay, successDeliver]);
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: { value: Math.round(order.totalPrice / 81).toFixed(2) },
        },
      ],
    });
  };
  const successPaymentHandler = (data, actions) => {
    return actions.order.capture().then((details) => {
      dispatch(payOrder(orderId, details));
    });
  };
  const paymentHandler = () => {
    dispatch(payCODOrder(order));
  };
  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="light">{error}</Message>
  ) : (
    <>
      <Meta title="2nd Chance | Order" />
      <h4>Order id: {order._id.substring(21, 24)}</h4>
      <br></br>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h5>Appointment</h5>
              <strong>Name: </strong>
              {order.user.name}
              <br></br>
              <strong>Phone Number: </strong>
              {order.user.phoneNo}
              <br></br>
              <strong>Email: </strong>
              <a href={`mailto: ${order.user.email}`}>{order.user.email}</a>
              <br></br>

              <p>
                {" "}
                <strong>Appointment At: </strong>
                {order.appointmentAddress.place}, {order.appointmentAddress.day}
                , {order.appointmentAddress.timeSlot},{" "}
              </p>

              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt.substring(0, 10)}
                </Message>
              ) : (
                <Message variant="info">Not Delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h5>Payment Method</h5>
              <p>
                {" "}
                <strong>Method: </strong>
                {order.paymentMethod.paymentMethod}
              </p>

              {order.isPaid ? (
                <Message variant="success">
                  Paid on {order.paidAt.substring(0, 10)}
                </Message>
              ) : (
                <Message variant="info">Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h5>Order Items</h5>
              {order.orderItems.length === 0 ? (
                <Message>No orders.</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}/${item.seller}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={6}>
                          {item.qty} x Rs.{item.price} = Rs.
                          {item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <ListGroup>
            <ListGroup.Item>
              <h4>Order Summary</h4>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Items:</Col>
                <Col>{order.orderItems.length}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Tax:</Col>
                <Col>Rs.{order.taxPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <strong>Total:</strong>
                </Col>
                <Col>
                  <strong>Rs.{order.totalPrice}</strong>
                </Col>
              </Row>
            </ListGroup.Item>

            {!order.isPaid &&
              order.paymentMethod.paymentMethod === "Paypal" &&
              order.paymentMethod.paymentMethod !== "COD" && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {isPending && <Loader />}
                  {isRejected && (
                    <Message variant="danger">SDK load error</Message>
                  )}
                  {!isResolved ? (
                    <Loader />
                  ) : (
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
            {loadingPay && <Loader />}
            {userInfo &&
              !order.isPaid &&
              !order.isDelivered &&
              order.paymentMethod.paymentMethod === "COD" &&
              userInfo.isAdmin && (
                <ListGroup.Item className="buttons" id="btn">
                  <Row>
                    <Button type="button" onClick={paymentHandler}>
                      Mark as Paid
                    </Button>
                  </Row>
                </ListGroup.Item>
              )}
            {loadingPay && <Loader />}
            {userInfo &&
              !order.isPaid &&
              !order.isDelivered &&
              order.paymentMethod.paymentMethod === "COD" &&
              userInfo.isSeller &&
              order.orderItems.find((item) => item.seller === userInfo._id) && (
                <ListGroup.Item className="buttons" id="btn">
                  <Row>
                    <Button type="button" onClick={paymentHandler}>
                      Mark as Paid
                    </Button>
                  </Row>
                </ListGroup.Item>
              )}
            {loadingDeliver && <Loader />}
            {userInfo &&
              order.isPaid &&
              !order.isDelivered &&
              userInfo.isSeller &&
              order.orderItems.find((item) => item.seller === userInfo._id) && (
                <ListGroup.Item className="buttons" id="btn">
                  <Row>
                    <Button type="button" onClick={deliverHandler}>
                      Mark as Delivered
                    </Button>
                  </Row>
                </ListGroup.Item>
              )}
            {loadingDeliver && <Loader />}
            {userInfo &&
              order.isPaid &&
              !order.isDelivered &&
              userInfo.isAdmin && (
                <ListGroup.Item className="buttons" id="btn">
                  <Row>
                    <Button type="button" onClick={deliverHandler}>
                      Mark as Delivered
                    </Button>
                  </Row>
                </ListGroup.Item>
              )}
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
