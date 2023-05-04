import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Nav, Navbar, Container, NavDropdown } from "react-bootstrap";
import SearchBox from "./SearchBox";
import { logout } from "../actions/userActions";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
  };
  const sellHandler = () => {
    if (userInfo && !userInfo.isSeller && !userInfo.isAdmin) {
      navigate("/sellregister");
    } else if (!userInfo) {
      window.alert(
        "Please register/ login as a user before registering as a Seller."
      );
      navigate("/login");
    }
  };
  return (
    <header>
      <Navbar expand="lg" variant="dark" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand id="brand">
              <img src="../images/Logo.png" alt="" id="logo" /> {" 2ndChance"}
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle className="toggle">
            <i className="fa-sharp fa-solid fa-bars"></i>
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <SearchBox />
            <Nav className="ms-auto">
              <LinkContainer to="/cart">
                <Nav.Link href="/cart">
                  <i className="fas fa-shopping-cart"></i> Cart
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link href="/login">
                    <i className="fas fa-user"></i> Sign Up/Log In
                  </Nav.Link>
                </LinkContainer>
              )}
            {((userInfo && !userInfo.isAdmin && !userInfo.isSeller) ||
                !userInfo) && (
                <Nav.Link onClick={sellHandler}>
                  <i className="fa-solid fa-people-carry-box"></i> Sell Now
                </Nav.Link>
              )}

              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="adminmenu">
                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
              {userInfo && userInfo.isSeller && (
                <NavDropdown title="Seller" id="sellermenu">
                  <LinkContainer to="/seller/productlist">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/seller/orderlist">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
/*  
<LinkContainer to="/admin/userlist">
<NavDropdown.Item>Users</NavDropdown.Item>
</LinkContainer>
*/
