import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import Meta from "../components/Meta";
import { Link } from "react-router-dom";

import emailjs from "emailjs-com";

const ContactusScreen = ({ location }) => {
  const [firstName, setFName] = useState("");
  const [lastName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNo] = useState("");
  const [message, setMessage] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    const templateParams = {
      from_name: `${firstName} ${lastName}`,
      from_email: email,
      message_html: message,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      message: `Name: ${firstName} ${lastName}
          Email-Id: ${email} 
          Phone Number: ${phoneNumber}
          Message: ${message} `,
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
          alert(
            "Thank you for your feedback. We will get back to you as soon as possible."
          );
          setFName("");
          setLName("");
          setEmail("");
          setPhoneNo("");
          setMessage("");
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <>
      <Link className="btn btn-light my-3 back" to="/">
        <i className="fa-solid fa-chevron-left"></i>
      </Link>
      <Meta title="2ndChance | Contact Us" />
      <FormContainer>
        <h4>Contact Us</h4>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <br></br>
            <Form.Label>
              <h6>First Name</h6>
            </Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="name">
            <br></br>
            <Form.Label>
              <h6>Last Name</h6>
            </Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLName(e.target.value)}
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

          <Form.Group controlId="phoneNo">
            <br></br>
            <Form.Label>
              <h6>Phone Number</h6>
            </Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNo(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="message">
            <br></br>
            <Form.Label>
              <h6>Message</h6>
            </Form.Label>

            <Form.Control
              as="textarea"
              row="3"
              placeholder="Enter your message here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group id="btn" className="buttons">
            <br></br>
            <Button type="submit" variant="light">
              Submit
            </Button>
          </Form.Group>
        </Form>
      </FormContainer>
    </>
  );
};

export default ContactusScreen;
