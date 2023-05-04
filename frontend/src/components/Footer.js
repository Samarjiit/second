import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useLocation, Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";
  const navigate = useNavigate();

  const handleContactUsClick = () => {
    navigate(redirect);
  };

  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center py-3">Copyright &copy; 2ndChance</Col>
        </Row>
        <Row className="py-3">
          <Col>
            <h6>
              <Link to={{ pathname: "/contactus", search: `?redirect=${redirect}` }} onClick={handleContactUsClick}>
                Contact Us
              </Link>
            </h6>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
