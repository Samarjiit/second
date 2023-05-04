import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { getUserDetails, updateUser } from "../actions/userActions";
import { USER_UPDATE_RESET } from "../constants/userConstants";
import Meta from "../components/Meta";
const UserEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = id;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSeller, setIsSeller] = useState(false);

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;
  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate;

  useEffect(() => {
    if (successUpdate && user.isAdmin) {
      dispatch({ type: USER_UPDATE_RESET });
      navigate("/admin/userlist");
    } else {
      if (!user.name || user._id !== userId) {
        dispatch(getUserDetails(userId));
      } else {
        setName(user.name);
        setEmail(user.email);
        setPhoneNo(user.phoneNo);
        setIsAdmin(user.isAdmin);
        setIsSeller(user.isSeller);
      }
    }
  }, [dispatch, user, userId, navigate, successUpdate]);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateUser({ _id: userId, name, email, phoneNo, isAdmin, isSeller })
    );
  };
  return (
    <>
      <Meta title="2nd Chance | Admin" />
      <Link className="btn btn-light my-3 back" to="/admin/userlist">
        <i className="fa-solid fa-chevron-left"></i>
      </Link>

      <FormContainer>
        <h4>Edit User</h4>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="light">{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="light">{error}</Message>
        ) : (
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
            <br></br>
            <Form.Group controlId="isadmin">
              <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={isAdmin}
                disabled={user._id === userId && user.isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>
            <Form.Group controlId="isseller">
              <Form.Check
                type="checkbox"
                label="Is Seller"
                checked={isSeller}
                disabled={user._id === userId && userId.isSeller}
                onChange={(e) => setIsSeller(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Form.Group id="btn" className="buttons">
              <br></br>
              <br></br>

              <Button type="submit" variant="light">
                Update
              </Button>
            </Form.Group>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
