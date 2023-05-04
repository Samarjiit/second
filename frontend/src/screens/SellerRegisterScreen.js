import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import Meta from "../components/Meta";
import emailjs from "emailjs-com";

const SellerRegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [validated, setValidated] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (email.trim() === "" || aadhar.trim() === "" || name.trim() === "") {
      alert("All fields are required.");
      return;
    }

    if (!termsChecked) {
      alert("Please accept the Terms and Conditions to continue.");
      return;
    }

    //const existingUser = await dispatch(checkUser(email));

    //if (existingUser) {
    const templateParams = {
      from_name: `${name}`,
      from_email: email,
      aadhar_num: aadhar,
      name: name,
      email: email,
      message: `${name} has sent a request for becoming a seller.
        Email-Id: ${email} 
        Aadhar Number: ${aadhar} `,
    };

    emailjs
      .send(
        "service_5r4f9z8",
        "template_m1tbf7p",
        templateParams,
        "LOdDyu-1pJGtYSCu5"
      )
      .then(
        () => {
          alert("Your request was submitted");
          setName("");
          setEmail("");
          setAadhar("");
          setTermsChecked(false);
        },
        (error) => {
          console.log(error.text);
        }
      );
    //} else {
    //alert("User does not exist. Please make sure you are registered with us.");
    //navigate("/register");
    //}
  };

  return (
    <>
      <Meta title="2ndChance | Contact Us" />
      <FormContainer>
        <br></br>
        <h4>Sell with us!</h4>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group controlId="name">
            <br></br>
            <Form.Label>
              <h6>Name</h6>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            ></Form.Control>
            <Form.Control.Feedback type="invalid">
              Please provide a valid name.
            </Form.Control.Feedback>
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
              required
            ></Form.Control>
            <Form.Control.Feedback type="invalid">
              Please provide a valid Email Address
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="aadhar">
            <br></br>
            <Form.Label>
              <h6>Aadhar Number</h6>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Aadhar Number"
              value={aadhar}
              onChange={(e) => setAadhar(e.target.value)}
              required
            ></Form.Control>
            <Form.Control.Feedback type="invalid">
              Please provide a valid Aadhar Number.
            </Form.Control.Feedback>
          </Form.Group>
          <br></br>
          <Form.Group controlId="termsCheckbox">
            <Form.Check
              type="checkbox"
              label="I agree to the Terms and Conditions for selling on this platform."
              checked={termsChecked}
              onChange={() => setTermsChecked(!termsChecked)}
              required
            />
          </Form.Group>
          <br></br>
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default SellerRegisterScreen;
