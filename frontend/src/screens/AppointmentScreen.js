import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { saveAppointmentAddress } from "../actions/cartActions";
import moment from "moment/moment";



// eslint-disable-next-line no-empty-pattern
const AppointmentScreen = ({ }) => {
  const cart = useSelector((state) => state.cart);
  const { appointmentAddress } = cart;
  const [place, setPlace] = useState(appointmentAddress.place);

  const [timeSlot, setTimeSlot] = useState(appointmentAddress.timeSlot);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [day, setSelectedDate] = useState(moment());
  const submitHandler = (e) => {
    e.preventDefault();
    if (moment(day).isBefore(moment(), 'day')) {
      alert("Invalid date: Date cannot be less than today");
    } else {
      setSelectedDate(day);

      dispatch(saveAppointmentAddress({ place, day, timeSlot }));
      navigate("/payment");
    }
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 id="steps" />
      <br></br>
      <h4>Appointment</h4>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address">
          <br></br>
          <Form.Label>
            <h6>Place</h6>
          </Form.Label>
          <Form.Control
            className="form-select"
            id="place"
            as="select"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
          >
            <option value="Student Plaza">Student Plaza</option>
            <option value="MIT Library">MIT Library</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="day">
          <br></br>
          <Form.Label>
            <h6>Day</h6>
          </Form.Label>
          <Form.Control
            type="date"
            name="date"
            placeholder="Choose date"
            id="day"
            value={day}
            onChange={(e) => setSelectedDate(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="timeSlot">
          <br></br>
          <Form.Label>
            <h6>Time Slot</h6>
          </Form.Label>
          <Form.Control
            className="form-select"
            id="timeSlot"
            as="select"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
          >
            <option value="5-5.30pm">5-5.30pm</option>
            <option value="5.30-6pm">5.30-6pm</option>
            <option value="6-6.30pm">6-6.30pm</option>
            <option value="6.30-7pm">6.30-7pm</option>
          </Form.Control>
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
  );
};

export default AppointmentScreen;
