import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import Meta from "../components/Meta";
import emailjs from 'emailjs-com';
import { useDispatch } from "react-redux";
import { checkUser } from "../actions/userActions";
import { useNavigate } from "react-router-dom";

const SellerRegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [aadhar, setAadhar] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();

    if (email.trim() === "" || aadhar.trim() === "" || name.trim() === "") {
      alert("All fields are required.");
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
      }

      emailjs.send('service_5r4f9z8', 'template_m1tbf7p', templateParams, 'LOdDyu-1pJGtYSCu5')
        .then(() => {
          alert('Your request was submitted');
          setName("");
          setEmail("");
          setAadhar("");
        }, (error) => {
          console.log(error.text);
        });     
    } //else {
      //alert("User does not exist. Please make sure you are registered with us.");
      //navigate("/register");
    //}

  return (
    <>
      <Meta title="2nd Chance | Contact Us" />
      <FormContainer>
        <br></br>
        <h4>Sell with us!</h4>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <br></br>
            <Form.Label>
              <h6>Name</h6>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={ name }
              onChange={(e) => setName(e.target.value)}
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
          <Form.Group controlId="aadhar">
            <br></br>
            <Form.Label>
              <h6>Aadhar Number</h6>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter aadhar number"
              value={aadhar}
              onChange={(e) => setAadhar(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group id="btn" className="buttons">
            <br></br>
            <Button type="submit" variant="light">
              Register
            </Button>
          </Form.Group>
        </Form>
      </FormContainer>
    </>
  );
};

export default SellerRegisterScreen;
