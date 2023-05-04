import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Meta from "../components/Meta";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import Message from "../components/Message";
import { addToCart, removeFromCart } from "../actions/cartActions";

// eslint-disable-next-line no-empty-pattern
const CartScreen = ({}) => {
  const { id } = useParams();
  const productID = id;
  const location = useLocation();
  const navigate = useNavigate();
  const qtyInUrl = new URLSearchParams(location.search).get("qty");
  console.log(qtyInUrl);
  const qty = qtyInUrl ? Number(qtyInUrl) : 1;
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  useEffect(() => {
    if (productID) {
      dispatch(addToCart(productID, qty));
      navigate("/cart");
    }
  }, [dispatch, productID, qty, navigate]);
  const removeFromCartHandler = (id) => {
    console.log(id);
    dispatch(removeFromCart(id));
    navigate("/cart");
  };
  const checkoutHandler = () => {
    //navigate("/login?redirect=/shipping");
    if (userInfo) {
      navigate("/appointment");
    } else {
      navigate("/login");
    }
  };
  return (
    <>
      <Meta title="2nd Chance | Cart" />
      <Row>
        <Col md={8}>
          <h4>Shopping Cart</h4>
          <br></br>
          {cartItems.length === 0 ? (
            <Message variant="light">
              Your cart is empty.{" "}
              <Link to="/" id="back">
                Go Back
              </Link>
            </Message>
          ) : (
            <ListGroup variant="flush">
              {cartItems
                .filter((item) =>
                  userInfo && item.seller === userInfo._id
                    ? removeFromCartHandler(item.product)
                    : {}
                )
                .map((item) => (
                  <ListGroup.Item key={item.product}>
                    <Row>
                      <Col md={2}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          fluid
                          rounded
                        ></Image>
                      </Col>
                      <Col md={3}>
                        <Link to={`/product/${item.product}/${item.seller}`}>
                          {item.name}
                        </Link>
                      </Col>
                      <Col md={3}>Rs. {item.price}</Col>
                      <Col md={2}>
                        <Form.Control
                          className="form-select"
                          id="qty"
                          as="select"
                          value={item.qty}
                          onChange={(e) =>
                            dispatch(
                              addToCart(item.product, Number(e.target.value))
                            )
                          }
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                      <Col md={1}>
                        <Button
                          type="button"
                          variant="light"
                          onClick={() => removeFromCartHandler(item.product)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card id="subtotal">
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h4>
                  SubTotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  ) items
                </h4>
                <h5>
                  Rs.&nbsp;
                  {cartItems
                    .reduce((acc, item) => acc + item.qty * item.price, 0)
                    .toFixed(2)}
                </h5>
              </ListGroup.Item>
              <ListGroup.Item id="btn" className="buttons">
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed to Checkout
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CartScreen;
