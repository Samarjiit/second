import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AppointmentScreen from "./screens/AppointmentScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import ProductListScreen from "./screens/ProductListScreen";
import SellerProductListScreen from "./screens/SellerProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import SellerProductEditScreen from "./screens/SellerProductEditScreen";
import OrderListScreen from "./screens/OrderListScreen";
import SellerOrderListScreen from "./screens/SellerOrderListScreen";
import ContactusScreen from "./screens/ContactusScreen";
import SellerRegisterScreen from "./screens/SellerRegisterScreen";
import UserOTPScreen from "./screens/UserOTPScreen";

const App = () => {
  const [clientID, setClientID] = useState("");
  useEffect(() => {
    const getClientId = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal");

      setClientID(clientId);
    };

    if (!window.paypal) {
      getClientId();
    }
  }, []);

  return (
    <>
      {clientID && (
        <PayPalScriptProvider options={{ "client-id": clientID }}>
          <Router>
            <Header />
            <main className="py-3">
              <Container>
                <Routes>
                  <Route path="/order/:id" element={<OrderScreen />} />
                  <Route path="/appointment" element={<AppointmentScreen />} />
                  <Route path="/payment" element={<PaymentScreen />} />
                  <Route path="/placeorder" element={<PlaceOrderScreen />} />
                  <Route path="/login" element={<LoginScreen />} />
                  <Route path="/register" element={<RegisterScreen />} />
                  <Route path="/profile" element={<ProfileScreen />} />
                  <Route path="/verifyOTP" element={<UserOTPScreen />} />
                  <Route
                    path="/product/:id/:seller"
                    element={<ProductScreen />}
                  />
                  <Route path="/cart/:id?" element={<CartScreen />} />
                  <Route path="/admin/userlist" element={<UserListScreen />} />
                  <Route
                    path="/admin/user/:id/edit"
                    element={<UserEditScreen />}
                  />
                  <Route
                    path="/admin/productlist"
                    element={<ProductListScreen />}
                  />
                  <Route
                    path="/admin/productlist/:pageNumber"
                    element={<ProductListScreen />}
                  />
                  <Route
                    path="/seller/productlist"
                    element={<SellerProductListScreen />}
                  />
                  <Route
                    path="/seller/productlist/:pageNumber"
                    element={<SellerProductListScreen />}
                  />
                  <Route
                    path="/admin/product/:id/edit"
                    element={<ProductEditScreen />}
                  />
                  <Route
                    path="/seller/product/:id/edit"
                    element={<SellerProductEditScreen />}
                  />
                  <Route
                    path="/admin/orderlist"
                    element={<OrderListScreen />}
                  />
                  <Route
                    path="/seller/orderlist"
                    element={<SellerOrderListScreen />}
                  />

                  <Route path="/search/:keyword" element={<HomeScreen />} />
                  <Route path="/page/:pageNumber" element={<HomeScreen />} />

                  <Route path="/contactus" element={<ContactusScreen />} />
                  <Route
                    path="/sellregister"
                    element={<SellerRegisterScreen />}
                  />

                  <Route
                    path="/search/:keyword/page/:pageNumber"
                    element={<HomeScreen />}
                  />
                  <Route path="/" element={<HomeScreen />} />
                </Routes>
              </Container>
            </main>
            <Footer />
          </Router>
        </PayPalScriptProvider>
      )}
    </>
  );
};

export default App;
