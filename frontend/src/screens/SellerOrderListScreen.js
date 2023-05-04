import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, ListGroup, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listOrders } from "../actions/orderActions";
import Meta from "../components/Meta";
const OrderListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isSeller) {
      dispatch(listOrders());
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, userInfo]);

  return (
    <>
      <Meta title="2nd Chance | Seller" />
      <h4>Orders</h4>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="light">{error}</Message>
      ) : (
        <Table bordered hover responsive className="table-sm" id="order">
          <thead>
            <tr>
              <th>ID</th>
              <th>CUSTOMER</th>
              <th>DATE</th>
              <th>PRODUCTS</th>
              <th>APPOINTMENT</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {orders
              .filter(
                (order) =>
                  order.orderItems.find(
                    (item) => item.seller === userInfo._id
                  ) && order.user !== userInfo._id
              )
              .map((order) => (
                <tr key={order._id}>
                  <td>{order._id.substring(21, 24)}</td>
                  <td>{order.user && order.user.name}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>
                    {" "}
                    {order.orderItems.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col>{item.name}</Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </td>
                  <td>
                    {order.appointmentAddress.place}
                    <br></br>
                    {order.appointmentAddress.day}
                    <br></br>
                    {order.appointmentAddress.timeSlot}
                  </td>
                  <td>Rs. {order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button variant="light" className="btn-sm">
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;
