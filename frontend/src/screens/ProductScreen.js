import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Rating from "../components/Rating";
import Meta from "../components/Meta";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Button,
  ListGroupItem,
  Form,
} from "react-bootstrap";
import {
  listProductDetails,
  createProductReview,
} from "../actions/productActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";

// eslint-disable-next-line no-empty-pattern
const ProductScreen = ({}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    //loading: loadingProductReview,
    error: errorProductReview,
    success: successProductReview,
  } = productReviewCreate;
  useEffect(() => {
    if (successProductReview) {
      alert("Review submitted");
      setRating(0);
      setComment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(listProductDetails(id));
  }, [dispatch, id, successProductReview]);

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createProductReview(id, { rating, comment }));
  };
  return (
    <>
      <Link className="btn btn-light my-3 back" to="/">
        <i className="fa-solid fa-chevron-left"></i>
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={5}>
              <Image src={product.image} alt={product.name} fluid id="pimg" />
            </Col>
            <Col md={6}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h5 id="pname">
                    <b>{product.name}</b>
                  </h5>
                </ListGroup.Item>

                <ListGroup.Item id="pseller">
                  Seller: {product.sellername}
                </ListGroup.Item>
                <ListGroup.Item id="prodrating">
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroupItem>
                  <Row id="pprice">
                    <Col>Price:</Col>
                    <Col>
                      <b>₹{product.price}</b>
                    </Col>
                  </Row>
                </ListGroupItem>
                <ListGroupItem>
                  <Row id="pstatus">
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                    </Col>
                  </Row>
                </ListGroupItem>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Qty</Col>
                      <Col>
                        <Form.Control
                          className="form-select"
                          id="qty"
                          as="select"
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                        >
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
              </ListGroup>

              <ListGroup className="buttons" horizontal>
                <ListGroupItem id="btn">
                  <Button
                    onClick={addToCartHandler}
                    className="btn-block"
                    type="button"
                    disabled={
                      product.countInStock === 0 ||
                      (userInfo && product.user === userInfo._id)
                    }
                  >
                    Buy
                  </Button>
                </ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
          <br></br>
          <Row>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>
                    <h5 id="pdesc">
                      <b>Description:</b>
                    </h5>
                  </Col>
                </Row>
                <Row>
                  <Col id="dcontent">{product.description}</Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Row>
          <Row>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>
                    <h5>Reviews</h5>

                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        {product.reviews.length === 0 && (
                          <Message variant="light">No Reviews</Message>
                        )}
                      </ListGroup.Item>
                      {product.reviews.map((review) => (
                        <ListGroup.Item key={review._id}>
                          {review.name}

                          <Rating value={review.rating} />
                          <p>{review.createdAt.substring(0, 10)}</p>
                          <p>{review.comment}</p>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <h5>Write a Review!</h5>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        {errorProductReview && (
                          <Message variant="light">
                            {errorProductReview}
                          </Message>
                        )}
                        {userInfo ? (
                          <Form onSubmit={submitHandler}>
                            <Form.Group controlId="rating">
                              <Form.Label>Rating</Form.Label>
                              <Form.Control
                                className="form-select"
                                as="select"
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                              >
                                <option value="5">5-Excellent</option>
                                <option value="4">4-Very Good</option>
                                <option value="3">3-Good</option>
                                <option value="2">2-Fair</option>
                                <option value="1">1-Poor</option>
                              </Form.Control>
                            </Form.Group>
                            <br></br>
                            <Form.Group controlId="comment">
                              <Form.Label>Comment</Form.Label>
                              <Form.Control
                                as="textarea"
                                row="3"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                              ></Form.Control>
                            </Form.Group>
                            <br></br>
                            <Form.Group className="buttons">
                              <Button
                                type="submit"
                                variant="light"
                                disabled={product.user === userInfo._id}
                              >
                                Submit
                              </Button>
                            </Form.Group>
                          </Form>
                        ) : (
                          <Message variant="light">
                            Please <Link to="/login">Sign In</Link> to write a
                            review.
                          </Message>
                        )}
                      </ListGroup.Item>
                    </ListGroup>
                  </Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
/*
 <h6 id="or">or</h6>
                <ListGroupItem id="btn">
                  <Button
                    className="btn-block"
                    type="button"
                    disabled={userInfo && product.user === userInfo._id}
                  >
                    Chat with the Seller
                  </Button>
                </ListGroupItem>
                */
