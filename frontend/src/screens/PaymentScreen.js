import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../actions/cartActions";
import Meta from "../components/Meta";
// eslint-disable-next-line no-empty-pattern
const PaymentScreen = ({}) => {
  const cart = useSelector((state) => state.cart);
  const { appointmentAddress } = cart;
  const navigate = useNavigate();

  if (!appointmentAddress) {
    navigate("/appointment");
  }
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod({ paymentMethod }));
    navigate("/placeorder");
  };

  return (
    <>
      <Meta title="2nd Chance | Payment Method" />
      <FormContainer>
        <CheckoutSteps step1 step2 id="steps" />
        <br></br>
        <h4>Payment Method</h4>
        <Form onSubmit={submitHandler}>
          <br></br>
          <Form.Group>
            <Form.Label as="legend">
              <h5>Select Method</h5>
            </Form.Label>
            <br></br>
            <Col>
              <Form.Check
                type="radio"
                label="COD"
                id="COD"
                name="paymentMethod"
                value="COD"
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
              <Form.Check
                type="radio"
                label="Paypal"
                id="Paypal"
                name="paymentMethod"
                value="Paypal"
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
            </Col>
          </Form.Group>
          <br></br>
          <br></br>
          <Form.Group id="btn" className="buttons">
            <Button type="submit" variant="light">
              Continue
            </Button>
          </Form.Group>
        </Form>
      </FormContainer>
    </>
  );
};

export default PaymentScreen;
